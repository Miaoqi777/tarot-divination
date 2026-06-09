import { useEffect, useRef, useCallback } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
  twinklePhase: number;
  twinkleSpeed: number;
}

const STAR_COLORS = [
  'rgba(255,255,255,0.9)',
  'rgba(255,255,255,0.6)',
  'rgba(107,203,255,0.8)',
  'rgba(255,224,107,0.7)',
  'rgba(255,107,138,0.6)',
  'rgba(184,107,255,0.7)',
  'rgba(107,255,184,0.6)',
];

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>(0);

  const initStars = useCallback((width: number, height: number) => {
    const stars: Star[] = [];
    const count = 200;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.3 + 0.05,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      });
    }
    starsRef.current = stars;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    // Shooting star state
    let shootingStar = {
      active: false,
      x: 0,
      y: 0,
      length: 80 + Math.random() * 60,
      speed: 8 + Math.random() * 6,
      opacity: 0,
      delay: 3000 + Math.random() * 8000,
      lastTime: 0,
    };

    let time = 0;

    const draw = (timestamp: number) => {
      const dt = timestamp - time;
      time = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars with twinkle
      for (const star of starsRef.current) {
        star.twinklePhase += star.twinkleSpeed * dt * 0.06;
        const twinkle = Math.sin(star.twinklePhase) * 0.4 + 0.6;
        const alpha = star.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color.replace(/[\d.]+\)$/, `${alpha})`);
        ctx.fill();

        // Add glow to brighter stars
        if (star.size > 1.5 && twinkle > 0.8) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          const glowColor = star.color.replace(/[\d.]+\)$/, '0.15)');
          ctx.fillStyle = glowColor;
          ctx.fill();
        }
      }

      // Shooting star
      if (!shootingStar.active) {
        shootingStar.delay -= dt;
        if (shootingStar.delay <= 0) {
          shootingStar.active = true;
          shootingStar.x = canvas.width * 0.7 + Math.random() * canvas.width * 0.3;
          shootingStar.y = Math.random() * canvas.height * 0.4;
          shootingStar.opacity = 0;
          shootingStar.lastTime = timestamp;
        }
      } else {
        const elapsed = timestamp - shootingStar.lastTime;
        shootingStar.opacity = Math.sin((elapsed / 800) * Math.PI);

        if (elapsed > 800) {
          shootingStar.active = false;
          shootingStar.delay = 5000 + Math.random() * 10000;
          shootingStar.length = 60 + Math.random() * 80;
          shootingStar.speed = 7 + Math.random() * 7;
        } else {
          const progress = elapsed / 800;
          const sx = shootingStar.x - progress * shootingStar.speed * 100;
          const sy = shootingStar.y + progress * shootingStar.speed * 40;
          const ex = sx + shootingStar.length;
          const ey = sy - shootingStar.length * 0.4;

          const gradient = ctx.createLinearGradient(sx, sy, ex, ey);
          gradient.addColorStop(0, `rgba(255,255,255,${shootingStar.opacity})`);
          gradient.addColorStop(1, 'rgba(255,255,255,0)');

          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Glow trail
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.strokeStyle = `rgba(184,107,255,${shootingStar.opacity * 0.4})`;
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [initStars]);

  return (
    <>
      {/* Starfield canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Aurora gradient overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: `
            radial-gradient(ellipse at 20% 80%, rgba(107,203,255,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 90%, rgba(184,107,255,0.10) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 100%, rgba(255,107,138,0.06) 0%, transparent 40%),
            radial-gradient(ellipse at 60% 0%, rgba(107,255,184,0.05) 0%, transparent 30%)
          `,
        }}
      />
    </>
  );
}
