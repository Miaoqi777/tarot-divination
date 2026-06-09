import { useMemo } from 'react';
import { motion } from 'framer-motion';
import TarotCard from './TarotCard';
import { useDivinationStore } from '../../stores/divinationStore';
import { useIsMobile } from '../../hooks/useMediaQuery';
import type { TarotCard as TarotCardType, DivinationPhase } from '../../types/tarot';

interface CardSpreadProps {
  cards: TarotCardType[];
  selectedIndices: number[];
  maxSelect: number;
  phase: DivinationPhase;
}

function calculateFanLayout(
  count: number,
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  return Array.from({ length: count }, (_, i) => {
    const angle = startAngle + (endAngle - startAngle) * (i / Math.max(count - 1, 1));
    const rad = (angle * Math.PI) / 180;
    const x = centerX + radius * Math.sin(rad) - 60;
    const y = centerY - radius * Math.cos(rad) - 90;
    const rotation = angle * 0.5;
    // Cards near center have higher zIndex
    const distFromCenter = Math.abs(i - count / 2);
    const zIndex = distFromCenter < count / 3 ? 10 + Math.floor(count / 3 - distFromCenter) : 1;
    const scale = distFromCenter < count / 6 ? 1.02 : 0.95;
    return { x, y, rotation, zIndex, scale };
  });
}

export default function CardSpread({ cards, selectedIndices, maxSelect, phase }: CardSpreadProps) {
  const selectCard = useDivinationStore((s) => s.selectCard);
  const isMobile = useIsMobile();

  // Show a subset of cards for better UX (first 30 cards)
  const displayCards = useMemo(() => cards.slice(0, Math.min(30, cards.length)), [cards]);

  // Calculate fan positions
  const radius = isMobile ? 280 : 350;
  const centerX = isMobile ? 180 : 400;
  const centerY = isMobile ? 250 : 300;
  const positions = useMemo(
    () => calculateFanLayout(displayCards.length, centerX, centerY, radius, -65, 65),
    [displayCards.length, centerX, centerY, radius]
  );

  const isSelecting = phase === 'selecting_cards' || phase === 'confirming';

  return (
    <div className="relative w-full" style={{ height: isMobile ? 420 : 500 }}>
      {/* Selected count indicator */}
      <div
        className="absolute top-2 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl"
        style={{
          background: 'var(--glass-bg-strong)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--glass-border-strong)',
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>
          已选 {selectedIndices.length} / {maxSelect} 张
        </span>
      </div>

      {/* Cards */}
      {displayCards.map((card, i) => {
        const originalIndex = cards.indexOf(card);
        const pos = positions[i];
        const isSelected = selectedIndices.includes(originalIndex);

        return (
          <motion.div
            key={`${card.id}-${originalIndex}`}
            initial={{ opacity: 0, scale: 0.3, x: 400, y: 300, rotate: 90 }}
            animate={{
              opacity: 1,
              scale: pos.scale,
              x: pos.x,
              y: pos.y,
              rotate: pos.rotation,
            }}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 15,
              delay: i * 0.03,
            }}
            style={{ position: 'absolute', zIndex: isSelected ? 200 : pos.zIndex }}
          >
            <TarotCard
              card={card}
              isSelected={isSelected}
              position={{ x: 0, y: 0, rotation: 0, zIndex: pos.zIndex, scale: pos.scale }}
              onClick={isSelecting ? () => selectCard(originalIndex) : undefined}
              index={i}
            />
          </motion.div>
        );
      })}

      {/* Instruction text */}
      {isSelecting && (
        <motion.p
          className="absolute left-1/2 -translate-x-1/2 text-center"
          style={{
            bottom: isMobile ? 50 : 30,
            color: 'var(--text-secondary)',
            fontSize: 14,
            width: '100%',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          点击牌面选择吸引你的 {maxSelect} 张牌
        </motion.p>
      )}
    </div>
  );
}
