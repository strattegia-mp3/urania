import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { WeatherData } from "@/types/weather";
import { useStore } from "@/context/store";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const useWeather = () => {
  const { coords, units, lang } = useStore();
  const apiLang = lang === "pt" ? "pt_br" : "en";

  return useQuery({
    queryKey: ["weather", coords?.lat, coords?.lon, units, lang],

    queryFn: async (): Promise<WeatherData> => {
      if (!coords) throw new Error("Coordenadas não definidas");

      // Promise.all executa as 3 requisições simultaneamente visando performance
      const [currentRes, forecastRes, pollutionRes] = await Promise.all([
        axios.get(`${BASE_URL}/weather`, {
          params: {
            lat: coords.lat,
            lon: coords.lon,
            appid: API_KEY,
            units: units,
            lang: apiLang,
          },
        }),
        axios.get(`${BASE_URL}/forecast`, {
          params: {
            lat: coords.lat,
            lon: coords.lon,
            appid: API_KEY,
            units: units,
            lang: apiLang,
          },
        }),
        axios.get(`${BASE_URL}/air_pollution`, {
          params: {
            lat: coords.lat,
            lon: coords.lon,
            appid: API_KEY,
          },
        }),
      ]);

      return {
        current: currentRes.data,
        forecast: forecastRes.data,
        pollution: pollutionRes.data,
      };
    },
    enabled: !!coords?.lat && !!coords?.lon,
    staleTime: 1000 * 60 * 5, // Cinco minutos de cache
  });
};