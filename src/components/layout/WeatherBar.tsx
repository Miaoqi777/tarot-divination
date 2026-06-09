import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { useWeatherStore } from '../../stores/weatherStore';
import { searchCities } from '../../services/weatherService';
import { useIsMobile } from '../../hooks/useMediaQuery';
import type { GeocodingResult } from '../../types/weather';
import Modal from '../ui/Modal';

export default function WeatherBar() {
  const { data: weather, isLoading, error } = useWeather();
  const cache = useWeatherStore((s) => s.cache);
  const setCache = useWeatherStore((s) => s.setCache);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [searching, setSearching] = useState(false);
  const isMobile = useIsMobile();

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (q.length < 2) { setResults([]); return; }
    setSearching(true);
    const r = await searchCities(q);
    setResults(r);
    setSearching(false);
  };

  const selectCity = (city: GeocodingResult) => {
    setCache({ city: city.name, lat: city.latitude, lon: city.longitude });
    setShowSearch(false);
    setQuery('');
    setResults([]);
  };

  const handleSetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCache({
            city: `${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`,
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        () => setShowSearch(true),
        { timeout: 5000 }
      );
    } else {
      setShowSearch(true);
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-between px-4 py-2 mx-auto"
        style={{
          maxWidth: isMobile ? '100%' : 'calc(100% - 80px)',
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--glass-border)',
          borderRadius: 16,
          marginTop: 10,
          marginLeft: isMobile ? 10 : 80,
          marginRight: 10,
        }}
      >
        {isLoading && (
          <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            <span className="animate-pulse">加载天气中...</span>
          </div>
        )}
        {error && !cache && (
          <button
            onClick={handleSetLocation}
            className="flex items-center gap-2 cursor-pointer"
            style={{ color: 'var(--text-secondary)', fontSize: 14, background: 'none', border: 'none' }}
          >
            <MapPin size={16} />
            设置位置获取天气
          </button>
        )}
        {weather && (
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 28 }}>{weather.current.icon}</span>
            <div>
              <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: 'var(--text-primary)' }}>
                {weather.current.temperature}°C
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {weather.current.descriptionZh}
              </div>
            </div>
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-1 cursor-pointer"
              style={{
                padding: '4px 10px',
                borderRadius: 8,
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-secondary)',
                fontSize: 13,
              }}
            >
              <MapPin size={14} />
              {weather.city}
            </button>
          </div>
        )}
        {!weather && !isLoading && !error && cache && (
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>加载中...</div>
        )}
      </div>

      {/* City Search Modal */}
      <Modal isOpen={showSearch} onClose={() => setShowSearch(false)} title="选择城市">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="输入城市名称搜索..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
                fontSize: 15,
              }}
              autoFocus
            />
          </div>
          {searching && <div className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>搜索中...</div>}
          <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
            {results.map((city, i) => (
              <motion.button
                key={`${city.latitude}-${city.longitude}-${i}`}
                onClick={() => selectCity(city)}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-left w-full"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid transparent',
                  color: 'var(--text-primary)',
                  fontSize: 14,
                }}
                whileHover={{
                  background: 'var(--glass-bg-hover)',
                  borderColor: 'var(--glass-border-strong)',
                }}
              >
                <MapPin size={16} />
                <span>{city.name}{city.admin1 ? `, ${city.admin1}` : ''}{city.country ? `, ${city.country}` : ''}</span>
              </motion.button>
            ))}
          </div>
          <button
            onClick={handleSetLocation}
            className="text-sm underline cursor-pointer text-center"
            style={{ color: 'var(--text-secondary)', background: 'none', border: 'none' }}
          >
            使用当前位置
          </button>
        </div>
      </Modal>
    </>
  );
}
