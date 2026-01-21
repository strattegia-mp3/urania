import { useState, useEffect } from "react";
import axios from "axios";
import { GeocodingResult } from "@/types/weather";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;
const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";

export const useSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Limpa resultados se query for curta
    if (query.length < 3) {
      setResults([]);
      return;
    }

    // Debounce de 500ms
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(GEO_URL, {
          params: {
            q: query, // A API aceita "Cidade, País" nativamente aqui
            limit: 5, // Traz até 5 variações
            appid: API_KEY,
          },
        });
        setResults(data);
      } catch (error) {
        console.error("Erro na busca:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return { query, setQuery, results, isLoading, setResults };
};
