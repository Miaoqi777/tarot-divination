import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDivinationStore } from '../../stores/divinationStore';
import { getContextualMeaning } from '../../services/tarotService';
import Button from '../ui/Button';
import TarotCardComponent from './TarotCard';
import { RotateCcw } from 'lucide-react';
import type { DrawnCard } from '../../types/tarot';

interface ResultRevealProps {
  onNewReading: () => void;
}

export default function ResultReveal({ onNewReading }: ResultRevealProps) {
  const currentReading = useDivinationStore((s) => s.currentReading);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [allFlipped, setAllFlipped] = useState(false);

  if (!currentReading) return null;

  const { spreadType, cards } = currentReading;

  const handleFlipAll = () => {
    // Flip cards one by one
    cards.forEach((_, i) => {
      setTimeout(() => {
        setFlippedCards((prev) => {
          const next = new Set(prev);
          next.add(i);
          if (next.size === cards.length) {
            setAllFlipped(true);
          }
          return next;
        });
      }, i * 600);
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 pb-8">
      {/* Title */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)' }}>
          {spreadType.nameZh} · 占卜结果
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          {new Date(currentReading.timestamp).toLocaleString('zh-CN')}
        </p>
      </motion.div>

      {/* Cards display */}
      <div className="flex flex-wrap justify-center gap-6">
        {cards.map((drawn: DrawnCard, i: number) => {
          const isFlipped = flippedCards.has(i);
          return (
            <motion.div
              key={i}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
            >
              <div style={{ width: 120, height: 180 }}>
                <TarotCardComponent
                  card={drawn.card}
                  isReversed={drawn.isReversed}
                  isRevealed={isFlipped}
                  isFlipped={isFlipped}
                  position={{ x: 0, y: 0, rotation: 0, zIndex: 1 }}
                />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                {drawn.position.nameZh}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {drawn.card.nameZh} {drawn.isReversed ? '逆位' : '正位'}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Flip all button */}
      {!allFlipped && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Button onClick={handleFlipAll} size="lg">
            翻开塔罗牌 ✨
          </Button>
        </motion.div>
      )}

      {/* Interpretations */}
      {allFlipped && (
        <motion.div
          className="w-full max-w-2xl flex flex-col gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {cards.map((drawn: DrawnCard, i: number) => {
            const contextualMeaning = getContextualMeaning(drawn, spreadType.category);
            return (
              <motion.div
                key={i}
                className="p-5 rounded-2xl"
                style={{
                  background: 'var(--glass-bg-strong)',
                  backdropFilter: 'var(--glass-blur)',
                  WebkitBackdropFilter: 'var(--glass-blur)',
                  border: '1px solid var(--glass-border-strong)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 40px var(--glow-purple)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontSize: 24 }}>{drawn.card.symbol}</span>
                  <div>
                    <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                      【{drawn.position.nameZh}】{drawn.card.nameZh}
                    </span>
                    <span style={{
                      fontSize: 12,
                      marginLeft: 8,
                      padding: '2px 8px',
                      borderRadius: 8,
                      background: drawn.isReversed ? 'rgba(255,107,138,0.15)' : 'rgba(107,255,184,0.15)',
                      color: drawn.isReversed ? 'var(--rainbow-pink)' : 'var(--rainbow-green)',
                      boxShadow: drawn.isReversed ? '0 0 10px rgba(255,107,138,0.2)' : '0 0 10px rgba(107,255,184,0.2)',
                    }}>
                      {drawn.isReversed ? '逆位' : '正位'}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {contextualMeaning}
                </p>
              </motion.div>
            );
          })}

          {/* New reading button */}
          <motion.div
            className="flex justify-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: cards.length * 0.2 + 0.4 }}
          >
            <Button onClick={onNewReading} variant="secondary" size="lg">
              <RotateCcw size={18} />
              <span style={{ marginLeft: 8 }}>再来一次占卜</span>
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
