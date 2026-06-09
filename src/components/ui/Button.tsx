import { motion } from 'framer-motion';
import type { ReactNode, ComponentPropsWithoutRef } from 'react';

type MotionButtonProps = ComponentPropsWithoutRef<typeof motion.button>;

interface ButtonProps extends MotionButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variants = {
  primary: {
    background: 'linear-gradient(135deg, rgba(184,107,255,0.6), rgba(107,203,255,0.5), rgba(107,255,184,0.4))',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 4px 20px rgba(184,107,255,0.4), 0 0 40px rgba(107,203,255,0.2)',
    backdropFilter: 'blur(10px)',
  },
  secondary: {
    background: 'var(--glass-bg-strong)',
    color: 'var(--text-primary)',
    border: '1px solid var(--glass-border-strong)',
    boxShadow: 'var(--glass-shadow)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid transparent',
    boxShadow: 'none',
  },
};

const sizes = {
  sm: { padding: '6px 14px', fontSize: '13px', borderRadius: '10px' },
  md: { padding: '10px 22px', fontSize: '15px', borderRadius: '12px' },
  lg: { padding: '14px 30px', fontSize: '17px', borderRadius: '14px' },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const v = variants[variant];
  const s = sizes[size];

  return (
    <motion.button
      className={`font-medium cursor-pointer ${className}`}
      style={{
        ...v,
        ...s,
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
      whileHover={!disabled ? { scale: 1.03, y: -1 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
