import { motion } from 'framer-motion';
import type { TarotCard as TarotCardType } from '../../types/tarot';

interface TarotCardProps {
  card: TarotCardType;
  isSelected?: boolean;
  isRevealed?: boolean;
  isReversed?: boolean;
  position?: { x: number; y: number; rotation: number; zIndex: number; scale?: number };
  onClick?: () => void;
  index?: number;
  isFlipped?: boolean;
}

export default function TarotCard({
  card,
  isSelected = false,
  isRevealed = false,
  isReversed = false,
  position,
  onClick,
  index = 0,
  isFlipped = false,
}: TarotCardProps) {
  const cardWidth = 120;
  const cardHeight = 180;

  return (
    <motion.div
      className="absolute cursor-pointer select-none"
      style={{
        width: cardWidth,
        height: cardHeight,
        perspective: 800,
        left: position ? position.x : 0,
        top: position ? position.y : 0,
        zIndex: position?.zIndex ?? 1,
      }}
      animate={{
        x: position?.x ?? 0,
        y: position?.y ?? 0,
        rotate: position?.rotation ?? 0,
        scale: position?.scale ?? 1,
      }}
      whileHover={onClick ? {
        scale: (position?.scale ?? 1) * 1.08,
        y: (position?.y ?? 0) - 12,
        filter: 'brightness(1.2)',
        boxShadow: isSelected
          ? '0 8px 32px var(--gold-glow), 0 0 60px var(--glow-purple), 0 0 100px var(--glow-blue)'
          : '0 8px 32px var(--glow-purple), 0 0 60px var(--glow-blue), 0 0 90px var(--glow-pink)',
        zIndex: 200,
        transition: { type: 'spring', stiffness: 400, damping: 20 },
      } : undefined}
      onClick={onClick}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    >
      {/* Card flip container */}
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        {/* Card Back — Dark cosmic + rainbow glow */}
        <div
          className="absolute inset-0 rounded-xl flex items-center justify-center overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #141438 0%, #1A1A4E 30%, #0F0F2E 60%, #1A1A3E 100%)',
            border: isSelected ? '2px solid var(--gold-light)' : '1px solid rgba(255,255,255,0.15)',
            boxShadow: isSelected
              ? '0 0 25px var(--gold-glow), 0 0 50px var(--glow-purple), inset 0 0 20px rgba(184,107,255,0.1)'
              : '0 4px 16px rgba(0,0,0,0.3), inset 0 0 10px rgba(107,203,255,0.05)',
          }}
        >
          {/* Ornamental pattern — star diamond */}
          <div className="absolute inset-3 rounded-lg"
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          />
          <div
            className="absolute"
            style={{
              width: 55, height: 55,
              transform: 'rotate(45deg)',
              border: '1.5px solid rgba(255,255,255,0.2)',
              borderRadius: 4,
            }}
          />
          <div
            className="absolute"
            style={{
              width: 30, height: 30,
              transform: 'rotate(45deg)',
              background: 'rgba(184,107,255,0.15)',
              borderRadius: 3,
              boxShadow: '0 0 20px rgba(184,107,255,0.3)',
            }}
          />
          <span style={{ fontSize: 26, zIndex: 1, filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))' }}>🔮</span>
        </div>

        {/* Card Face */}
        <div
          className="absolute inset-0 rounded-xl flex flex-col items-center justify-between p-3"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(180deg, #1E1E42 0%, #181838 50%, #141430 100%)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 30px var(--glow-purple)',
          }}
        >
          {/* Reversed indicator */}
          {isReversed && isRevealed && (
            <div
              className="absolute top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(255,107,138,0.2)', fontSize: 10, color: 'var(--rainbow-pink)' }}
            >
              逆位
            </div>
          )}

          <div className="flex flex-col items-center gap-1 flex-1 justify-center">
            <span style={{
              fontSize: 36,
              transform: isReversed && isRevealed ? 'rotate(180deg)' : 'none',
              filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.3))',
            }}>
              {card.symbol}
            </span>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-primary)',
              textAlign: 'center',
              lineHeight: 1.3,
            }}>
              {card.nameZh}
            </span>
          </div>

          <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center' }}>
            {card.arcana === 'major' ? '大阿卡纳' : card.suit}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
