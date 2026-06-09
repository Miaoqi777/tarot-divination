import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'info' | 'warning' | 'success';
}

const colors = {
  info: { bg: 'rgba(196, 200, 240, 0.4)', border: 'rgba(180, 160, 220, 0.6)' },
  warning: { bg: 'rgba(250, 220, 180, 0.4)', border: 'rgba(240, 180, 120, 0.6)' },
  success: { bg: 'rgba(180, 220, 200, 0.4)', border: 'rgba(140, 200, 160, 0.6)' },
};

export default function Toast({ message, isVisible, onClose, type = 'info' }: ToastProps) {
  const c = colors[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-6 left-1/2 z-[2000] px-5 py-3 rounded-xl flex items-center gap-3"
          style={{
            background: c.bg,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${c.border}`,
            boxShadow: 'var(--glass-shadow)',
            transform: 'translateX(-50%)',
          }}
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
        >
          <span style={{ color: 'var(--text-primary)', fontSize: 14 }}>{message}</span>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X size={16} color="var(--text-secondary)" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
