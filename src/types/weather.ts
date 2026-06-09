export interface WeatherCurrent {
  temperature: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  description: string;
  descriptionZh: string;
  icon: string;
}

export interface WeatherData {
  city: string;
  lat: number;
  lon: number;
  current: WeatherCurrent;
  daily: WeatherDaily[];
}

export interface WeatherDaily {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  descriptionZh: string;
  icon: string;
}

export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;  // province/state
}
