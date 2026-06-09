import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WeatherCache {
  city: string;
  lat: number;
  lon: number;
}

interface WeatherStore {
  cache: WeatherCache | null;
  setCache: (cache: WeatherCache) => void;
}

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set) => ({
      cache: null,
      setCache: (cache) => set({ cache }),
    }),
    { name: 'tarot-weather' }
  )
);
