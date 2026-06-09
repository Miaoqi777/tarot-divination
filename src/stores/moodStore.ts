import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MoodEntry } from '../types/mood';

interface MoodStore {
  entries: MoodEntry[];
  addOrUpdateEntry: (entry: MoodEntry) => void;
  getEntry: (date: string) => MoodEntry | undefined;
}

export const useMoodStore = create<MoodStore>()(
  persist(
    (set, get) => ({
      entries: [],
      addOrUpdateEntry: (entry) => {
        const existing = get().entries.findIndex((e) => e.date === entry.date);
        if (existing >= 0) {
          set((state) => {
            const updated = [...state.entries];
            updated[existing] = entry;
            return { entries: updated };
          });
        } else {
          set((state) => ({ entries: [...state.entries, entry] }));
        }
      },
      getEntry: (date) => get().entries.find((e) => e.date === date),
    }),
    { name: 'tarot-mood' }
  )
);
