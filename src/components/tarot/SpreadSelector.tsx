import { motion } from 'framer-motion';
import { Heart, BookOpen, BriefcaseBusiness, Plane, Users, HeartHandshake, GraduationCap, TrendingUp, Compass, PartyPopper } from 'lucide-react';
import type { SpreadType } from '../../types/tarot';

interface SpreadSelectorProps {
  spreads: SpreadType[];
  onSelect: (spread: SpreadType) => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Heart, HeartHandshake, BookOpen, GraduationCap, BriefcaseBusiness,
  TrendingUp, Plane, Compass, Users, PartyPopper,
};

export default function SpreadSelector({ spreads, onSelect }: SpreadSelectorProps) {
  const categories = [
    { key: 'love', label: '恋爱 💕', color: '#F4A4B8' },
    { key: 'study', label: '学习 📚', color: '#B8A4E0' },
    { key: 'work', label: '工作 💼', color: '#A0C8E0' },
    { key: 'travel', label: '旅游 ✈️', color: '#8FD4B0' },
    { key: 'social', label: '人际 🤝', color: '#F5CCA0' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {categories.map((cat) => {
        const catSpreads = spreads.filter((s) => s.category === cat.key);
        if (catSpreads.length === 0) return null;

        return (
          <div key={cat.key}>
            <h3 style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 10, textAlign: 'center' }}>
              {cat.label}
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {catSpreads.map((spread) => {
                const Icon = iconMap[spread.icon] || BookOpen;
                return (
                  <motion.button
                    key={spread.id}
                    onClick={() => onSelect(spread)}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: '50%',
                      background: `${spread.color}30`,
                      border: `2px solid ${spread.color}60`,
                      boxShadow: `0 4px 16px ${spread.color}20`,
                    }}
                    whileHover={{
                      scale: 1.08,
                      background: `${spread.color}50`,
                      borderColor: spread.color,
                      boxShadow: `0 8px 30px ${spread.color}40`,
                    }}
                    whileTap={{ scale: 0.95 }}
                    title={spread.description}
                  >
                    <Icon size={28} color={spread.color} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                      {spread.nameZh}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                      {spread.cardCount}张牌
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
