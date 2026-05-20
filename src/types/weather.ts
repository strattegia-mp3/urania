export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface Rain {
  "1h"?: number;
  "3h"?: number;
}

export interface Snow {
  "1h"?: number;
  "3h"?: number;
}

export interface MainData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface CurrentWeatherResponse {
  coord: { lon: number; lat: number };
  weather: WeatherCondition[];
  base: string;
  main: MainData;
  visibility: number;
  wind: Wind;
  rain?: Rain;
  snow?: Snow;
  clouds: { all: number };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: MainData & { temp_kf?: number };
  weather: WeatherCondition[];
  clouds: { all: number };
  wind: Wind;
  visibility: number;
  pop: number;
  rain?: Rain;
  snow?: Snow;
  sys: { pod: "d" | "n" };
  dt_txt: string;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface AirPollutionItem {
  main: { aqi: number };
  components: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
  dt: number;
}

export interface AirPollutionResponse {
  coord: { lon: number; lat: number };
  list: AirPollutionItem[];
}

// UV Index (One Call API)
export interface UVResponse {
  lat: number;
  lon: number;
  date_iso: string;
  date: number;
  value: number;
}

export interface GeocodingResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface WeatherData {
  current: CurrentWeatherResponse;
  forecast: ForecastResponse;
  pollution: AirPollutionResponse;
  uv: UVResponse;
}
