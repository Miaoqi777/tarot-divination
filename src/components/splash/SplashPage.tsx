import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashPageProps {
  onDismiss: () => void;
}

// Star particle data for CSS rendering
interface SparkleData {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
  duration: number;
}

const SPARKLE_COLORS = [
  'rgba(255,255,255,0.9)',
  'rgba(107,203,255,0.8)',
  'rgba(255,224,107,0.7)',
  'rgba(255,107,138,0.7)',
  'rgba(184,107,255,0.7)',
  'rgba(107,255,184,0.6)',
];

function generateSparkles(count: number): SparkleData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 4,
    color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
    duration: 2 + Math.random() * 4,
  }));
}

export default function SplashPage({ onDismiss }: SplashPageProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [sparkles] = useState(() => generateSparkles(50));
  const [largeStars] = useState(() => generateSparkles(8));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Background starfield canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.8 + 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005,
      color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
    }));

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.phase += s.speed;
        const twinkle = Math.sin(s.phase) * 0.5 + 0.5;
        const alpha = s.opacity * (0.5 + twinkle * 0.5);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color.replace(/[\d.]+\)$/, `${alpha})`);
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 900);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center cursor-pointer overflow-hidden"
          style={{ background: 'var(--bg-deep)' }}
          onClick={handleDismiss}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          {/* Starfield canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

          {/* Aurora glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse at 30% 80%, rgba(184,107,255,0.12) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 90%, rgba(107,203,255,0.10) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 100%, rgba(255,107,138,0.08) 0%, transparent 40%)
              `,
            }}
          />

          {/* CSS sparkles (kira-kira) */}
          {sparkles.map((s) => (
            <motion.div
              key={s.id}
              className="absolute"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: s.duration,
                delay: s.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Diamond shape */}
              <div
                className="w-full h-full"
                style={{
                  background: s.color,
                  clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                }}
              />
            </motion.div>
          ))}

          {/* Orbiting decoration rings */}
          <motion.div
            className="absolute"
            style={{ width: 300, height: 300 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            {largeStars.slice(0, 6).map((_, i) => {
              const angle = (i / 6) * Math.PI * 2;
              const r = 130;
              const x = 150 + Math.cos(angle) * r;
              const y = 150 + Math.sin(angle) * r;
              return (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: x - 2,
                    top: y - 2,
                    width: 4,
                    height: 4,
                    background: SPARKLE_COLORS[i],
                    boxShadow: `0 0 8px ${SPARKLE_COLORS[i]}`,
                  }}
                />
              );
            })}
            {/* Thin orbit ring */}
            <div
              className="absolute rounded-full"
              style={{
                left: 20,
                top: 20,
                width: 260,
                height: 260,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
          </motion.div>

          <motion.div
            className="absolute"
            style={{ width: 200, height: 200 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="absolute rounded-full"
              style={{
                left: 20,
                top: 20,
                width: 160,
                height: 160,
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            />
          </motion.div>

          {/* Main content */}
          <motion.div
            className="relative z-10 text-center px-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
          >
            {/* Glowing crystal/star icon */}
            <motion.div
              className="relative mx-auto mb-6"
              style={{ width: 100, height: 100 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Outer glow rings */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  inset: -20,
                  background: 'radial-gradient(circle, rgba(184,107,255,0.3), transparent 70%)',
                }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute rounded-full"
                style={{
                  inset: -40,
                  background: 'radial-gradient(circle, rgba(107,203,255,0.15), transparent 60%)',
                }}
                animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Center diamond */}
              <div
                className="absolute flex items-center justify-center"
                style={{
                  inset: 0,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '30%',
                  transform: 'rotate(45deg)',
                  boxShadow: '0 0 40px rgba(184,107,255,0.3), 0 0 80px rgba(107,203,255,0.2)',
                }}
              >
                <span style={{ fontSize: 48, transform: 'rotate(-45deg)', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }}>
                  🔮
                </span>
              </div>
            </motion.div>

            {/* Rainbow gradient title */}
            <motion.h1
              style={{
                fontSize: 52,
                fontWeight: 200,
                letterSpacing: 10,
                marginBottom: 16,
                background: 'var(--rainbow-gradient)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(184,107,255,0.4))',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.3, delay: 0.8 }}
            >
              塔罗占卜
            </motion.h1>

            <motion.p
              style={{
                fontSize: 18,
                color: 'var(--text-secondary)',
                letterSpacing: 6,
                marginBottom: 40,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              探索你的每日运势
            </motion.p>

            {/* CTA Button with rainbow glow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.8 }}
            >
              <div
                className="inline-flex items-center gap-3 px-10 py-4 cursor-pointer relative"
                style={{
                  background: 'rgba(20,20,56,0.6)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 50,
                  boxShadow: '0 0 30px rgba(184,107,255,0.3), 0 0 60px rgba(107,203,255,0.2)',
                  color: 'var(--text-primary)',
                  fontSize: 18,
                  letterSpacing: 3,
                }}
              >
                <span style={{ fontSize: 22 }}>✨</span>
                点击进入
                <span style={{ fontSize: 22 }}>✨</span>
              </div>
            </motion.div>

            <motion.p
              style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 20, letterSpacing: 1 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
            >
              轻触任意位置开始塔罗之旅
            </motion.p>
          </motion.div>

          {/* Bottom aurora fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(184,107,255,0.1), rgba(107,203,255,0.05), transparent)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
