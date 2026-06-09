import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CurtainTransitionProps {
  onComplete: () => void;
}

export default function CurtainTransition({ onComplete }: CurtainTransitionProps) {
  const [stage, setStage] = useState<'closing' | 'closed' | 'opening'>('closing');

  useEffect(() => {
    // Close curtain
    const t1 = setTimeout(() => setStage('closed'), 1000);
    // Hold briefly then open
    const t2 = setTimeout(() => setStage('opening'), 1800);
    // Complete
    const t3 = setTimeout(() => onComplete(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[600] overflow-hidden pointer-events-none">
      {/* Curtain overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0A0A1A 0%, #141438 30%, #0F0F2E 60%, #1A1A3E 100%)',
        }}
        animate={{
          clipPath: stage === 'closing'
            ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
            : stage === 'closed'
            ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
            : 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
        }}
        transition={{
          duration: stage === 'closed' ? 0 : 0.8,
          ease: 'easeInOut',
        }}
      >
        {/* Fabric texture + star overlay */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(184,107,255,0.2) 3px, rgba(184,107,255,0.2) 4px),
              repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(107,203,255,0.1) 12px, rgba(107,203,255,0.1) 13px)
            `,
          }}
        />

        {/* Decorative sparkle particles — rainbow colored */}
        {Array.from({ length: 20 }).map((_, i) => {
          const colors = ['rgba(255,255,255,0.9)','rgba(184,107,255,0.7)','rgba(107,203,255,0.7)','rgba(255,224,107,0.7)','rgba(255,107,138,0.7)'];
          const c = colors[Math.floor(Math.random() * colors.length)];
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: c,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );
        })}

        {/* Center text during closed stage */}
        {stage === 'closed' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span style={{ fontSize: 48 }}>🔮</span>
              <p style={{
                fontSize: 20,
                color: 'var(--text-primary)',
                fontWeight: 400,
                letterSpacing: 4,
                marginTop: 8,
              }}>
                命运正在揭示...
              </p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
