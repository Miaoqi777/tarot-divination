import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { ALL_CARDS, MAJOR_ARCANA } from '../data/cards';
import type { TarotCard } from '../types/tarot';
import { useIsMobile } from '../hooks/useMediaQuery';

const SUIT_NAMES: Record<string, string> = {
  wands: '权杖', cups: '圣杯', swords: '宝剑', pentacles: '星币',
};

export default function EncyclopediaPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'>('all');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const isMobile = useIsMobile();

  const filteredCards = useMemo(() => {
    let result = ALL_CARDS;
    if (filter === 'major') result = result.filter((c) => c.arcana === 'major');
    else if (filter !== 'all') result = result.filter((c) => c.suit === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((c) =>
        c.nameZh.includes(q) || c.name.toLowerCase().includes(q)
      );
    }
    return result;
  }, [filter, search]);

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'major', label: '大阿卡纳' },
    { key: 'wands', label: '权杖' },
    { key: 'cups', label: '圣杯' },
    { key: 'swords', label: '宝剑' },
    { key: 'pentacles', label: '星币' },
  ];

  return (
    <div className="flex flex-col h-full px-2" style={{ paddingBottom: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12, textAlign: 'center' }}>
        塔罗牌百科
      </h2>

      {/* Search */}
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索牌名..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none text-sm"
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all"
            style={{
              background: filter === f.key ? 'var(--glass-bg-strong)' : 'var(--glass-bg)',
              border: `1px solid ${filter === f.key ? 'var(--glass-border-strong)' : 'var(--glass-border)'}`,
              color: filter === f.key ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Card grid */}
      <div
        className="overflow-y-auto flex-1"
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
          gap: 10,
        }}
      >
        {filteredCards.map((card, i) => (
          <motion.div
            key={card.id}
            className="flex flex-col items-center gap-1 p-3 rounded-xl cursor-pointer"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
            }}
            whileHover={{
              scale: 1.05,
              background: 'var(--glass-bg-hover)',
              borderColor: 'var(--glass-border-strong)',
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCard(card)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.01 }}
          >
            <span style={{ fontSize: 28 }}>{card.symbol}</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-primary)', textAlign: 'center' }}>
              {card.nameZh}
            </span>
            <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>
              {card.arcana === 'major' ? '大牌' : SUIT_NAMES[card.suit!]}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Card Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="fixed inset-0 z-[500] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedCard(null)} />
            <motion.div
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl p-5"
              style={{
                background: 'var(--glass-bg-strong)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid var(--glass-border-strong)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              }}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/20"
              >
                <X size={18} color="var(--text-primary)" />
              </button>

              <div className="flex flex-col items-center gap-2 mb-4">
                <span style={{ fontSize: 48 }}>{selectedCard.symbol}</span>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {selectedCard.nameZh}
                </h3>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {selectedCard.name}
                </span>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded-full text-xs"
                    style={{ background: 'rgba(180,160,220,0.2)', color: 'var(--text-secondary)' }}>
                    {selectedCard.arcana === 'major' ? '大阿卡纳' : `小阿卡纳 · ${SUIT_NAMES[selectedCard.suit!]}`}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs"
                    style={{ background: 'rgba(180,160,220,0.2)', color: 'var(--text-secondary)' }}>
                    {selectedCard.element}元素
                  </span>
                </div>
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.8 }}>
                {selectedCard.descriptionZh}
              </p>

              {/* Upright */}
              <div className="mb-4">
                <h4 style={{ fontSize: 15, fontWeight: 600, color: '#60A080', marginBottom: 8 }}>✨ 正位释义</h4>
                <div className="flex flex-wrap gap-1 mb-2">
                  {selectedCard.keywordsUpright.map((kw) => (
                    <span key={kw} className="px-2 py-0.5 rounded-full text-xs"
                      style={{ background: 'rgba(100,160,128,0.1)', color: '#60A080' }}>{kw}</span>
                  ))}
                </div>
                {(['general','love','study','work','travel','social'] as const).map((area) => (
                  <div key={area} className="mb-2">
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {area === 'general' ? '总体' : area === 'love' ? '恋爱' : area === 'study' ? '学习' : area === 'work' ? '工作' : area === 'travel' ? '旅游' : '人际'}：
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {selectedCard.meaningsUpright[area]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Reversed */}
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: '#C06060', marginBottom: 8 }}>🔄 逆位释义</h4>
                <div className="flex flex-wrap gap-1 mb-2">
                  {selectedCard.keywordsReversed.map((kw) => (
                    <span key={kw} className="px-2 py-0.5 rounded-full text-xs"
                      style={{ background: 'rgba(192,96,96,0.1)', color: '#C06060' }}>{kw}</span>
                  ))}
                </div>
                {(['general','love','study','work','travel','social'] as const).map((area) => (
                  <div key={area} className="mb-2">
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {area === 'general' ? '总体' : area === 'love' ? '恋爱' : area === 'study' ? '学习' : area === 'work' ? '工作' : area === 'travel' ? '旅游' : '人际'}：
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {selectedCard.meaningsReversed[area]}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
