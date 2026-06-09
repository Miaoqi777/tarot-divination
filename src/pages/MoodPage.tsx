import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMoodStore } from '../stores/moodStore';
import { MOOD_TYPES } from '../data/moods';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';

export default function MoodPage() {
  const { entries, addOrUpdateEntry, getEntry } = useMoodStore();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());

  const today = new Date().toISOString().slice(0, 10);
  const todayEntry = getEntry(today);

  // Calendar logic
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [year, month, daysInMonth, startDay]);

  const handleSave = () => {
    if (!selectedMood) return;
    const mood = MOOD_TYPES.find((m) => m.key === selectedMood);
    if (!mood) return;
    addOrUpdateEntry({ date: today, mood: mood.key, emoji: mood.emoji, note, timestamp: Date.now() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <div className="flex flex-col gap-4 px-2 pb-20" style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* Today's mood selector */}
      <GlassCard className="p-5">
        <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12, textAlign: 'center' }}>
          今日心情 {todayEntry ? `- ${todayEntry.emoji}` : ''}
        </h3>
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {MOOD_TYPES.map((mood) => (
            <motion.button
              key={mood.key}
              onClick={() => setSelectedMood(mood.key)}
              className="flex flex-col items-center gap-1 p-3 rounded-2xl cursor-pointer"
              style={{
                background: selectedMood === mood.key ? `${mood.color}40` : 'var(--glass-bg)',
                border: selectedMood === mood.key ? `2px solid ${mood.color}` : '1px solid var(--glass-border)',
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <span style={{ fontSize: 32 }}>{mood.emoji}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{mood.label}</span>
            </motion.button>
          ))}
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="记录一下今天的心情吧...(可选)"
          className="w-full p-3 rounded-xl resize-none text-sm outline-none"
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)',
            height: 60,
          }}
        />
        <div className="flex justify-center mt-3">
          <Button onClick={handleSave} disabled={!selectedMood} size="sm">
            {saved ? '已保存 ✅' : todayEntry ? '更新心情 💾' : '记录心情 💝'}
          </Button>
        </div>
      </GlassCard>

      {/* Calendar */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1 rounded-full hover:bg-white/20 cursor-pointer">
            <ChevronLeft size={20} color="var(--text-primary)" />
          </button>
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
            {year}年{month + 1}月
          </span>
          <button onClick={nextMonth} className="p-1 rounded-full hover:bg-white/20 cursor-pointer">
            <ChevronRight size={20} color="var(--text-primary)" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['日','一','二','三','四','五','六'].map((d) => (
            <div key={d} className="text-center" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d}</div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const entry = getEntry(dateStr);
            const isToday = dateStr === today;
            return (
              <div
                key={i}
                className="flex flex-col items-center justify-center rounded-lg py-1"
                style={{
                  background: isToday ? 'var(--glass-bg-strong)' : 'transparent',
                  border: isToday ? '1px solid var(--glass-border-strong)' : '1px solid transparent',
                }}
              >
                <span style={{ fontSize: 12, color: isToday ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isToday ? 600 : 400 }}>
                  {day}
                </span>
                {entry && <span style={{ fontSize: 16 }}>{entry.emoji}</span>}
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Mood chart (simple) */}
      {entries.length > 0 && (
        <GlassCard className="p-5">
          <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>心情趋势</h4>
          <div className="flex items-end gap-1" style={{ height: 100 }}>
            {entries.slice(-14).map((entry, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-md flex flex-col items-center justify-end pb-1"
                style={{
                  height: `${30 + Math.random() * 70}%`,
                  background: MOOD_TYPES.find((m) => m.key === entry.mood)?.color || '#D4C5F0',
                  opacity: 0.7,
                  minWidth: 20,
                }}
                initial={{ height: 0 }}
                animate={{ height: `${30 + Math.random() * 70}%` }}
                title={entry.emoji}
              >
                <span style={{ fontSize: 10 }}>{entry.emoji}</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
