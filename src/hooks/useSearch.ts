import { useState, useEffect, useRef } from "react";
import { GeocodingResult } from "@/types/weather";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;
const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";

export const useSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      // Cancela fetch anterior se ainda estiver em andamento
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          limit: "5",
          appid: API_KEY ?? "",
        });
        const res = await fetch(`${GEO_URL}?${params}`, {
          signal: abortRef.current.signal,
        });
        if (!res.ok) throw new Error("Geocoding error");
        const data: GeocodingResult[] = await res.json();
        setResults(data);
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Erro na busca:", error);
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 450);

    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [query]);

  return { query, setQuery, results, isLoading, setResults };
};
