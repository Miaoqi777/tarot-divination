import type { WeatherData, WeatherCurrent, WeatherDaily, GeocodingResult } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

// WMO Weather Code mapping
const WMO_CODES: Record<number, { icon: string; descriptionZh: string }> = {
  0:  { icon: '☀️', descriptionZh: '晴天' },
  1:  { icon: '🌤️', descriptionZh: '大部晴朗' },
  2:  { icon: '⛅', descriptionZh: '多云' },
  3:  { icon: '☁️', descriptionZh: '阴天' },
  45: { icon: '🌫️', descriptionZh: '雾' },
  48: { icon: '🌫️', descriptionZh: '霜雾' },
  51: { icon: '🌦️', descriptionZh: '小雨' },
  53: { icon: '🌦️', descriptionZh: '小雨' },
  55: { icon: '🌧️', descriptionZh: '小雨' },
  61: { icon: '🌧️', descriptionZh: '小雨' },
  63: { icon: '🌧️', descriptionZh: '中雨' },
  65: { icon: '🌧️', descriptionZh: '大雨' },
  71: { icon: '🌨️', descriptionZh: '小雪' },
  73: { icon: '🌨️', descriptionZh: '中雪' },
  75: { icon: '❄️', descriptionZh: '大雪' },
  77: { icon: '❄️', descriptionZh: '雪粒' },
  80: { icon: '🌧️', descriptionZh: '阵雨' },
  81: { icon: '🌧️', descriptionZh: '中阵雨' },
  82: { icon: '⛈️', descriptionZh: '大阵雨' },
  85: { icon: '🌨️', descriptionZh: '小阵雪' },
  86: { icon: '❄️', descriptionZh: '大阵雪' },
  95: { icon: '⛈️', descriptionZh: '雷暴' },
  96: { icon: '⛈️', descriptionZh: '冰雹雷暴' },
  99: { icon: '⛈️', descriptionZh: '强雷暴' },
};

function getWeatherInfo(code: number) {
  return WMO_CODES[code] || { icon: '🌈', descriptionZh: '未知' };
}

/** Search cities by name */
export async function searchCities(query: string): Promise<GeocodingResult[]> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=5&language=zh&format=json`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.results) return [];
    return data.results.map((r: any) => ({
      name: r.name,
      latitude: r.latitude,
      longitude: r.longitude,
      country: r.country || '',
      admin1: r.admin1 || '',
    }));
  } catch {
    return [];
  }
}

/** Fetch weather for a location */
export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7`;
  const res = await fetch(url);
  const data = await res.json();

  const currentWeather = getWeatherInfo(data.current.weather_code);
  const current: WeatherCurrent = {
    temperature: Math.round(data.current.temperature_2m),
    weatherCode: data.current.weather_code,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    description: currentWeather.descriptionZh,
    descriptionZh: currentWeather.descriptionZh,
    icon: currentWeather.icon,
  };

  const daily: WeatherDaily[] = data.daily.time.map((date: string, i: number) => {
    const w = getWeatherInfo(data.daily.weather_code[i]);
    return {
      date,
      tempMax: Math.round(data.daily.temperature_2m_max[i]),
      tempMin: Math.round(data.daily.temperature_2m_min[i]),
      weatherCode: data.daily.weather_code[i],
      descriptionZh: w.descriptionZh,
      icon: w.icon,
    };
  });

  // Reverse geocode to get city name
  let city = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
  try {
    const geoRes = await fetch(`${GEOCODING_URL}?latitude=${lat}&longitude=${lon}&count=1&language=zh&format=json`);
    const geoData = await geoRes.json();
    if (geoData.results?.[0]) {
      city = geoData.results[0].name;
    }
  } catch { /* use coordinates as fallback */ }

  return { city, lat, lon, current, daily };
}

/** Get user's geolocation */
export function getUserLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => reject(new Error('Geolocation denied')),
      { timeout: 5000 }
    );
  });
}
