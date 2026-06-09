import { motion } from 'framer-motion';
import { ReactNode, ComponentPropsWithoutRef } from 'react';

type MotionDivProps = ComponentPropsWithoutRef<typeof motion.div>;

interface GlassCardProps extends MotionDivProps {
  children: ReactNode;
  variant?: 'light' | 'strong';
  className?: string;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  variant = 'light',
  className = '',
  onClick,
  ...props
}: GlassCardProps) {
  const bg = variant === 'strong'
    ? 'var(--glass-bg-strong)'
    : 'var(--glass-bg)';
  const border = variant === 'strong'
    ? 'var(--glass-border-strong)'
    : 'var(--glass-border)';

  return (
    <motion.div
      className={className}
      onClick={onClick}
      style={{
        background: bg,
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: `1px solid ${border}`,
        boxShadow: 'var(--glass-shadow)',
        borderRadius: 16,
      }}
      whileHover={onClick ? {
        background: 'var(--glass-bg-hover)',
        boxShadow: 'var(--glass-shadow-hover)',
        borderColor: 'var(--glass-border-strong)',
      } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
