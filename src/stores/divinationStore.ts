import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DivinationPhase, SpreadType, TarotCard, DrawnCard, TarotReading } from '../types/tarot';

interface DivinationStore {
  phase: DivinationPhase;
  selectedSpread: SpreadType | null;
  shuffledDeck: TarotCard[];
  selectedIndices: number[];
  drawnCards: DrawnCard[];
  currentReading: TarotReading | null;

  setPhase: (phase: DivinationPhase) => void;
  setSpread: (spread: SpreadType) => void;
  setDeck: (deck: TarotCard[]) => void;
  selectCard: (index: number) => void;
  deselectCard: (index: number) => void;
  setDrawnCards: (cards: DrawnCard[]) => void;
  setReading: (reading: TarotReading) => void;
  reset: () => void;
  goBackToSelecting: () => void;
}

interface DivinationHistoryStore {
  readings: TarotReading[];
  addReading: (reading: TarotReading) => void;
}

const initialState = {
  phase: 'idle' as DivinationPhase,
  selectedSpread: null,
  shuffledDeck: [],
  selectedIndices: [],
  drawnCards: [],
  currentReading: null,
};

export const useDivinationStore = create<DivinationStore>()((set, get) => ({
  ...initialState,
  setPhase: (phase) => set({ phase }),
  setSpread: (spread) => set({ selectedSpread: spread, phase: 'shuffling' }),
  setDeck: (deck) => set({ shuffledDeck: deck }),
  selectCard: (index) => {
    const state = get();
    if (state.selectedIndices.includes(index)) return;
    const newIndices = [...state.selectedIndices, index];
    set({ selectedIndices: newIndices });
    // Auto-trigger confirming when enough cards selected
    if (state.selectedSpread && newIndices.length >= state.selectedSpread.cardCount) {
      set({ phase: 'confirming' });
    }
  },
  deselectCard: (index) => {
    set((state) => ({
      selectedIndices: state.selectedIndices.filter((i) => i !== index),
    }));
  },
  setDrawnCards: (cards) => set({ drawnCards: cards }),
  setReading: (reading) => set({ currentReading: reading, phase: 'revealing' }),
  reset: () => set({ ...initialState }),
  goBackToSelecting: () => set({ phase: 'selecting_cards', selectedIndices: [] }),
}));

export const useDivinationHistoryStore = create<DivinationHistoryStore>()(
  persist(
    (set) => ({
      readings: [],
      addReading: (reading) =>
        set((state) => ({ readings: [reading, ...state.readings] })),
    }),
    { name: 'tarot-divination-history' }
  )
);

// Helper to check if same category was read today
export function hasReadToday(
  readings: TarotReading[],
  category: string
): boolean {
  const today = new Date().toDateString();
  return readings.some(
    (r) =>
      new Date(r.timestamp).toDateString() === today &&
      r.spreadType.category === category
  );
}
