import { useQuery } from '@tanstack/react-query';
import { fetchWeather } from '../services/weatherService';
import { useWeatherStore } from '../stores/weatherStore';

export function useWeather() {
  const cache = useWeatherStore((s) => s.cache);

  return useQuery({
    queryKey: ['weather', cache?.lat, cache?.lon],
    queryFn: () => {
      if (!cache) throw new Error('No location set');
      return fetchWeather(cache.lat, cache.lon);
    },
    enabled: !!cache,
    staleTime: 30 * 60 * 1000, // 30 min
    refetchInterval: 30 * 60 * 1000,
    retry: 2,
  });
}
