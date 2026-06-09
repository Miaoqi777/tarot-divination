import { motion, AnimatePresence } from 'framer-motion';
import { useDivinationStore, useDivinationHistoryStore, hasReadToday } from '../stores/divinationStore';
import { shuffleDeck, drawCards, createReading } from '../services/tarotService';
import { SPREADS } from '../data/spreads';
import SpreadSelector from '../components/tarot/SpreadSelector';
import ShuffleAnimation from '../components/tarot/ShuffleAnimation';
import CardSpread from '../components/tarot/CardSpread';
import ConfirmationPopup from '../components/tarot/ConfirmationPopup';
import CurtainTransition from '../components/tarot/CurtainTransition';
import ResultReveal from '../components/tarot/ResultReveal';
import RepeatWarning from '../components/tarot/RepeatWarning';
import Toast from '../components/ui/Toast';
import { useState, useCallback, useEffect } from 'react';
import type { SpreadType } from '../types/tarot';

export default function DivinationPage() {
  const phase = useDivinationStore((s) => s.phase);
  const selectedSpread = useDivinationStore((s) => s.selectedSpread);
  const shuffledDeck = useDivinationStore((s) => s.shuffledDeck);
  const selectedIndices = useDivinationStore((s) => s.selectedIndices);
  const setPhase = useDivinationStore((s) => s.setPhase);
  const setSpread = useDivinationStore((s) => s.setSpread);
  const setDeck = useDivinationStore((s) => s.setDeck);
  const setDrawnCards = useDivinationStore((s) => s.setDrawnCards);
  const setReading = useDivinationStore((s) => s.setReading);
  const reset = useDivinationStore((s) => s.reset);
  const goBackToSelecting = useDivinationStore((s) => s.goBackToSelecting);

  const readings = useDivinationHistoryStore((s) => s.readings);
  const addReading = useDivinationHistoryStore((s) => s.addReading);

  const [toast, setToast] = useState({ visible: false, message: '' });
  const [showRepeatWarning, setShowRepeatWarning] = useState(false);
  const [pendingSpread, setPendingSpread] = useState<SpreadType | null>(null);

  // Handle spread selection
  const handleSelectSpread = useCallback((spread: SpreadType) => {
    // Check if same category was already read today
    if (hasReadToday(readings, spread.category)) {
      setPendingSpread(spread);
      setShowRepeatWarning(true);
    } else {
      startDivination(spread);
    }
  }, [readings]);

  const startDivination = (spread: SpreadType) => {
    setSpread(spread);
    // Shuffle after a short delay for the spread selector to animate out
    setTimeout(() => {
      const deck = shuffleDeck();
      setDeck(deck);
      setPhase('spreading');
    }, 100);
  };

  const handleRepeatConfirm = () => {
    setShowRepeatWarning(false);
    if (pendingSpread) {
      startDivination(pendingSpread);
      setPendingSpread(null);
    }
  };

  const handleRepeatCancel = () => {
    setShowRepeatWarning(false);
    setPendingSpread(null);
  };

  // Handle shuffle completion
  const handleShuffleComplete = useCallback(() => {
    setPhase('spreading');
  }, [setPhase]);

  // Handle card selection confirmation
  const handleConfirmSelection = useCallback(() => {
    if (!selectedSpread) return;
    const drawn = drawCards(shuffledDeck, selectedIndices, selectedSpread);
    setDrawnCards(drawn);
    setPhase('transitioning');
  }, [selectedSpread, shuffledDeck, selectedIndices, setDrawnCards, setPhase]);

  // Handle curtain transition completion
  const handleCurtainComplete = useCallback(() => {
    const state = useDivinationStore.getState();
    if (state.selectedSpread && state.drawnCards.length > 0) {
      const reading = createReading(state.selectedSpread, state.drawnCards);
      setReading(reading);
      addReading(reading);
    }
  }, [setReading, addReading]);

  // Handle new reading
  const handleNewReading = () => {
    reset();
    setPhase('selecting_spread');
  };

  // Initialize to spread selection on mount
  useEffect(() => {
    if (phase === 'idle') {
      setPhase('selecting_spread');
    }
  }, [phase, setPhase]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Toast notifications */}
      <Toast
        message={toast.message}
        isVisible={toast.visible}
        onClose={() => setToast({ visible: false, message: '' })}
      />

      {/* Repeat warning */}
      <RepeatWarning
        isOpen={showRepeatWarning}
        onConfirm={handleRepeatConfirm}
        onCancel={handleRepeatCancel}
        spreadName={pendingSpread?.nameZh || ''}
      />

      <AnimatePresence mode="wait">
        {/* Spread Selection */}
        {phase === 'selecting_spread' && (
          <motion.div
            key="spread-selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl px-4"
          >
            <h2
              className="text-center mb-4"
              style={{ fontSize: 22, fontWeight: 500, color: 'var(--text-primary)' }}
            >
              请选择占卜类型
            </h2>
            <p
              className="text-center mb-8"
              style={{ fontSize: 14, color: 'var(--text-secondary)' }}
            >
              选择你想要探索的人生领域，开始你的塔罗之旅
            </p>
            <SpreadSelector spreads={SPREADS} onSelect={handleSelectSpread} />
          </motion.div>
        )}

        {/* Shuffling */}
        {phase === 'shuffling' && (
          <motion.div
            key="shuffle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-2xl"
          >
            <ShuffleAnimation onComplete={handleShuffleComplete} />
          </motion.div>
        )}

        {/* Spreading + Selecting Cards */}
        {(phase === 'spreading' || phase === 'selecting_cards' || phase === 'confirming') && (
          <motion.div
            key="card-spread"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col items-center justify-center"
            style={{ paddingBottom: 80 }}
          >
            <CardSpread
              cards={shuffledDeck}
              selectedIndices={selectedIndices}
              maxSelect={selectedSpread?.cardCount || 3}
              phase={phase}
            />
          </motion.div>
        )}

        {/* Confirmation Popup */}
        {phase === 'confirming' && selectedSpread && (
          <ConfirmationPopup
            cards={selectedIndices.map((i) => shuffledDeck[i])}
            spreadName={selectedSpread.nameZh}
            onConfirm={handleConfirmSelection}
            onCancel={goBackToSelecting}
          />
        )}

        {/* Curtain Transition */}
        {phase === 'transitioning' && (
          <CurtainTransition
            key="curtain"
            onComplete={handleCurtainComplete}
          />
        )}

        {/* Result Reveal */}
        {phase === 'revealing' && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-4xl px-4 overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 120px)', paddingTop: 10 }}
          >
            <ResultReveal onNewReading={handleNewReading} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
