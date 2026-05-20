import { useQuery } from "@tanstack/react-query";
import { WeatherData } from "@/types/weather";
import { useStore } from "@/context/store";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

async function fetchWeather(
  lat: number,
  lon: number,
  units: string,
  lang: string,
): Promise<WeatherData> {
  const apiLang = lang === "pt" ? "pt_br" : "en";

  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    appid: API_KEY ?? "",
    units,
    lang: apiLang,
  });

  const pollutionParams = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    appid: API_KEY ?? "",
  });

  // UV Index — endpoint legado ainda gratuito no plano Free
  const uvParams = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    appid: API_KEY ?? "",
  });

  const [currentRes, forecastRes, pollutionRes, uvRes] = await Promise.all([
    fetch(`${BASE_URL}/weather?${params}`),
    fetch(`${BASE_URL}/forecast?${params}`),
    fetch(`${BASE_URL}/air_pollution?${pollutionParams}`),
    fetch(`${BASE_URL}/uvi?${uvParams}`),
  ]);

  if (!currentRes.ok || !forecastRes.ok || !pollutionRes.ok) {
    throw new Error("Falha ao buscar dados meteorológicos");
  }

  const [current, forecast, pollution, uv] = await Promise.all([
    currentRes.json(),
    forecastRes.json(),
    pollutionRes.json(),
    // UV pode falhar silenciosamente — retorna 0 como fallback
    uvRes.ok ? uvRes.json() : Promise.resolve({ value: 0 }),
  ]);

  return { current, forecast, pollution, uv };
}

export const useWeather = () => {
  const { coords, units, lang } = useStore();

  return useQuery({
    queryKey: ["weather", coords?.lat, coords?.lon, units, lang],
    queryFn: () => fetchWeather(coords!.lat, coords!.lon, units, lang),
    enabled: !!coords?.lat && !!coords?.lon,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    // Auto-refresh silencioso a cada 10 minutos
    refetchInterval: 1000 * 60 * 10,
    // Continua fazendo refresh mesmo com a aba em background
    refetchIntervalInBackground: false,
    retry: 1,
  });
};
