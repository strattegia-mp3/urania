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
  const base = `${BASE_URL}`;

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

  const [currentRes, forecastRes, pollutionRes] = await Promise.all([
    fetch(`${base}/weather?${params}`),
    fetch(`${base}/forecast?${params}`),
    fetch(`${base}/air_pollution?${pollutionParams}`),
  ]);

  if (!currentRes.ok || !forecastRes.ok || !pollutionRes.ok) {
    throw new Error("Falha ao buscar dados meteorológicos");
  }

  const [current, forecast, pollution] = await Promise.all([
    currentRes.json(),
    forecastRes.json(),
    pollutionRes.json(),
  ]);

  return { current, forecast, pollution };
}

export const useWeather = () => {
  const { coords, units, lang } = useStore();

  return useQuery({
    queryKey: ["weather", coords?.lat, coords?.lon, units, lang],
    queryFn: () => fetchWeather(coords!.lat, coords!.lon, units, lang),
    enabled: !!coords?.lat && !!coords?.lon,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
    gcTime: 1000 * 60 * 10, // 10 minutos no garbage collector
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
