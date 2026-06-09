import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles, BookOpen, Heart, Music, User, Menu, X
} from 'lucide-react';
import { useIsMobile } from '../../hooks/useMediaQuery';

const menuItems = [
  { path: '/divination', icon: Sparkles, label: '塔罗占卜' },
  { path: '/encyclopedia', icon: BookOpen, label: '塔罗百科' },
  { path: '/mood', icon: Heart, label: '心情记录' },
  { path: '/whitenoise', icon: Music, label: '白噪音' },
  { path: '/profile', icon: User, label: '个人中心' },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Desktop: hovering sidebar
  const handleMouseEnter = () => !isMobile && setIsExpanded(true);
  const handleMouseLeave = () => !isMobile && setIsExpanded(false);

  const sidebarContent = (
    <div
      className="flex flex-col gap-2"
      style={{ width: isMobile ? '100%' : (isExpanded ? 200 : 60), transition: 'width 0.3s ease' }}
    >
      {/* Mobile close button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(false)}
          className="self-end p-2 mb-2 rounded-full hover:bg-white/20"
        >
          <X size={20} color="var(--text-primary)" />
        </button>
      )}

      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <motion.button
            key={item.path}
            onClick={() => { navigate(item.path); isMobile && setIsMobileOpen(false); }}
            className="flex items-center gap-3 cursor-pointer"
            style={{
              padding: isExpanded || isMobile ? '12px 16px' : '12px',
              justifyContent: isExpanded || isMobile ? 'flex-start' : 'center',
              borderRadius: 12,
              background: isActive ? 'var(--glass-bg-strong)' : 'transparent',
              border: isActive ? '1px solid var(--glass-border-strong)' : '1px solid transparent',
              boxShadow: isActive ? '0 0 20px var(--glow-purple)' : 'none',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
            whileHover={{
              background: 'var(--glass-bg-hover)',
              borderColor: 'var(--glass-border-strong)',
              boxShadow: '0 0 20px var(--glow-purple)',
            }}
            whileTap={{ scale: 0.96 }}
            title={!isExpanded && !isMobile ? item.label : undefined}
          >
            <Icon size={20} />
            <AnimatePresence>
              {(isExpanded || isMobile) && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  style={{ fontSize: 14, fontWeight: 500 }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );

  // Mobile: bottom tab bar + hamburger menu
  if (isMobile) {
    return (
      <>
        {/* Hamburger trigger */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 z-[100] p-2 rounded-xl"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'var(--glass-blur)',
            WebkitBackdropFilter: 'var(--glass-blur)',
            border: '1px solid var(--glass-border)',
          }}
        >
          <Menu size={20} color="var(--text-primary)" />
        </button>

        {/* Slide-in menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-[200] bg-black/20 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
              />
              <motion.div
                className="fixed left-0 top-0 bottom-0 z-[300] p-4"
                style={{
                  background: 'var(--glass-bg-strong)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRight: '1px solid var(--glass-border-strong)',
                  boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
                }}
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {sidebarContent}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Bottom tab bar */}
        <div
          className="fixed bottom-0 left-0 right-0 z-[100] flex justify-around py-2 px-4"
          style={{
            background: 'var(--glass-bg-strong)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid var(--glass-border)',
          }}
        >
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer"
                style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
              >
                <Icon size={20} />
                <span style={{ fontSize: 10 }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </>
    );
  }

  // Desktop: fixed left sidebar
  return (
    <div
      className="fixed left-3 top-1/2 z-[100] -translate-y-1/2 py-3"
      style={{
        background: 'var(--glass-bg-strong)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)',
        borderRadius: 20,
        boxShadow: 'var(--glass-shadow)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {sidebarContent}
    </div>
  );
}
