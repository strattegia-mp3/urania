"use client";

import { useState, useRef, useEffect } from "react";
import { useSearch } from "@/hooks/useSearch";
import { useStore } from "@/context/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { useTranslation } from "@/hooks/useTranslation";

interface SearchCity {
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
}

export function CitySearch() {
  const { query, setQuery, results, isLoading, setResults } = useSearch();
  const { setCoords } = useStore();
  const { getLocation, isLoading: isGeoLoading } = useGeoLocation();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown se clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCity = (city: SearchCity) => {
    setCoords({
      lat: city.lat,
      lon: city.lon,
      name: city.name,
      country: city.country,
    });
    setIsOpen(false);
    setQuery("");
    setResults([]); // Limpa a lista
  };

  const handleGeoLocation = () => {
    getLocation();
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-sm md:max-w-md mx-auto"
    >
      <div className="relative flex items-center gap-2 group">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />

          <Input
            id="search-input"
            type="search"
            placeholder={t.searchPlaceholder}
            className="pl-9 pr-8 bg-secondary/50 border-transparent focus:bg-background focus:border-primary/50 transition-all shadow-sm"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />

          {/* Botão limpar busca */}
          {query.length > 0 && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleGeoLocation}
          title={t.useLocation}
          disabled={isGeoLoading}
          className="shrink-0 bg-background/50 backdrop-blur border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all cursor-pointer"
        >
          {isGeoLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Dropdown de Resultados Melhorado */}
      {isOpen && query.length > 2 && (
        <div className="absolute top-full mt-2 w-full rounded-xl border border-border/50 bg-popover/95 backdrop-blur-md text-popover-foreground shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Estado de Loading */}
          {isLoading && (
            <div className="p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> {t.searching}
            </div>
          )}

          {/* Estado de Sem Resultados */}
          {!isLoading && results.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {t.noResults}
              <br />
              <span className="text-xs opacity-70">{t.searchHint} </span>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <ul className="py-1">
              {results.map((city, idx) => {
                const countryCode = city.country
                  ? city.country.toLowerCase()
                  : "";
                return (
                  <li key={`${city.lat}-${idx}`}>
                    <button
                      className="w-full text-left px-4 py-3 text-sm hover:bg-accent/50 hover:text-accent-foreground flex items-center justify-between transition-colors border-b border-border/30 last:border-0"
                      onClick={() => handleSelectCity(city)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium flex items-center gap-2">
                          {city.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {/* Mostra Estado se disponível */}
                          {city.state ? `${city.state}, ` : ""}
                          {city.country}
                        </span>
                      </div>

                      {/* Bandeira do País */}
                      {countryCode && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://flagcdn.com/w40/${countryCode}.png`}
                          alt={city.country}
                          className="h-4 w-6 object-cover rounded shadow-sm opacity-80"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
