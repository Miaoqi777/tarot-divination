import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AudioStore {
  currentTrackId: string | null;
  isPlaying: boolean;
  volume: number;
  isMinimized: boolean;
  setTrack: (trackId: string | null) => void;
  setPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setMinimized: (minimized: boolean) => void;
}

export const useAudioStore = create<AudioStore>()(
  persist(
    (set) => ({
      currentTrackId: null,
      isPlaying: false,
      volume: 0.5,
      isMinimized: false,
      setTrack: (trackId) => set({ currentTrackId: trackId }),
      setPlaying: (playing) => set({ isPlaying: playing }),
      setVolume: (volume) => set({ volume }),
      setMinimized: (minimized) => set({ isMinimized: minimized }),
    }),
    {
      name: 'tarot-audio',
      partialize: (state) => ({ volume: state.volume, currentTrackId: state.currentTrackId }),
    }
  )
);
