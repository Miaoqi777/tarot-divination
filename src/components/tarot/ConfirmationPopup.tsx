import { motion } from 'framer-motion';
import Button from '../ui/Button';
import type { TarotCard } from '../../types/tarot';

interface ConfirmationPopupProps {
  cards: TarotCard[];
  spreadName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationPopup({ cards, spreadName, onConfirm, onCancel }: ConfirmationPopupProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onCancel} />

      {/* Content */}
      <motion.div
        className="relative w-full max-w-md p-6 rounded-2xl"
        style={{
          background: 'var(--glass-bg-strong)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid var(--glass-border-strong)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px var(--glow-purple)',
        }}
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <h3
          className="text-center mb-2"
          style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}
        >
          确认占卜
        </h3>
        <p
          className="text-center mb-4"
          style={{ fontSize: 14, color: 'var(--text-secondary)' }}
        >
          你已为「{spreadName}」选择了以下 {cards.length} 张牌
        </p>

        {/* Selected cards preview */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {cards.map((card, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-2 rounded-xl"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                minWidth: 70,
              }}
            >
              <span style={{ fontSize: 24 }}>{card.symbol}</span>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)', textAlign: 'center' }}>
                {card.nameZh}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-3">
          <Button variant="secondary" onClick={onCancel}>重新选择</Button>
          <Button variant="primary" onClick={onConfirm}>确认占卜 🔮</Button>
        </div>

        <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>
          确认后未选择的牌将被收起，为你揭示塔罗的指引
        </p>
      </motion.div>
    </motion.div>
  );
}
