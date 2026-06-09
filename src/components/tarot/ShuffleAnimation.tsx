import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ShuffleAnimationProps {
  onComplete: () => void;
}

export default function ShuffleAnimation({ onComplete }: ShuffleAnimationProps) {
  const [phase, setPhase] = useState<'stack' | 'shuffling' | 'done'>('stack');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('shuffling'), 600);
    const t2 = setTimeout(() => { setPhase('done'); onComplete(); }, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center gap-6" style={{ height: 400 }}>
      <div className="relative" style={{ width: 200, height: 260 }}>
        {/* Deck stack visual */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-xl"
            style={{
              width: 120,
              height: 180,
              left: 40,
              top: 40,
              background: i % 2 === 0
                ? 'linear-gradient(135deg, #141438, #1A1A4E)'
                : 'linear-gradient(135deg, #0F0F2E, #1A1A3E)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 0 10px rgba(107,203,255,0.05)',
              transformOrigin: 'center center',
            }}
            animate={
              phase === 'shuffling'
                ? {
                    x: [0, (i % 2 === 0 ? -80 : 80), (i % 2 === 0 ? 80 : -80), 0],
                    y: [i * 1, -50 + i * 5, 50 + i * 5, i * 1],
                    rotate: [i * 2 - 8, (i % 2 === 0 ? -15 : 15), (i % 2 === 0 ? 15 : -15), i * 2 - 8],
                    scale: [1, 1.05, 1.05, 1],
                  }
                : phase === 'done'
                ? { opacity: 0, scale: 0.8 }
                : {}
            }
            transition={
              phase === 'shuffling'
                ? {
                    duration: 1.8,
                    repeat: phase === 'shuffling' ? 1 : 0,
                    ease: 'easeInOut',
                    delay: i * 0.05,
                  }
                : { duration: 0.4 }
            }
          />
        ))}

        {/* Center glow during shuffle */}
        {phase === 'shuffling' && (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 150,
              height: 150,
              left: 25,
              top: 55,
              background: 'radial-gradient(circle, rgba(184,107,255,0.3), rgba(107,203,255,0.15), transparent)',
            }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1, repeat: 2, ease: 'easeInOut' }}
          />
        )}
      </div>

      <motion.p
        style={{ fontSize: 18, color: 'var(--text-primary)', fontWeight: 500 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {phase === 'stack' ? '准备洗牌...' : phase === 'shuffling' ? '正在洗牌中...' : '洗牌完成 ✨'}
      </motion.p>
    </div>
  );
}
