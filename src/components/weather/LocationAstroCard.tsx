"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sunrise,
  Sunset,
  MapPin,
  Users,
  Globe,
  Clock,
  Navigation,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface LocationAstroCardProps {
  city: {
    name: string;
    country: string;
    population?: number;
    timezone: number;
    coord: {
      lat: number;
      lon: number;
    };
  };
  sun: {
    sunrise: number;
    sunset: number;
  };
}

export function LocationAstroCard({ city, sun }: LocationAstroCardProps) {
  const { t } = useTranslation();

  // Formatadores
  const formatTime = (ts: number) =>
    new Date(ts * 1000).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatPopulation = (num?: number) => {
    if (!num) return "N/A";
    return new Intl.NumberFormat("pt-BR", {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(num);
  };

  const formatCoord = (val: number, type: "lat" | "lon") => {
    const abs = Math.abs(val).toFixed(2);
    if (type === "lat") {
      return val >= 0 ? `${abs}° ${t.dirN}` : `${abs}° ${t.dirS}`;
    }
    return val >= 0 ? `${abs}° ${t.dirE}` : `${abs}° ${t.dirW}`;
  };

  const formatGMT = (offset: number) => {
    const hours = offset / 3600;
    const sign = hours >= 0 ? "+" : "";
    return `UTC ${sign}${hours}`;
  };

  // URL da Bandeira
  const countryCode = city.country ? city.country.toLowerCase() : "";
  const flagUrl = countryCode
    ? `https://flagcdn.com/w40/${countryCode}.png`
    : null;

  return (
    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 flex flex-col overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <Globe className="h-4 w-4" /> {t.locationAstro}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between gap-4">
        {/* Bloco 1: Identificação Geográfica */}
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            {/* Linha 1: Nome da Cidade e Bandeira*/}
            <div className="flex items-center gap-2 min-w-0">
              <h2
                className="text-xl font-bold truncate leading-tight tracking-tight"
                title={city.name}
              >
                {city.name}
              </h2>
              {flagUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={flagUrl}
                  alt={city.country}
                  className="h-4 w-auto rounded-[2px] shadow-sm opacity-80 shrink-0"
                />
              )}
            </div>

            {/* Linha 2: País e População */}
            <div className="flex items-center justify-between mt-1">
              {/* País */}
              <div className="text-xs text-muted-foreground font-medium flex items-center gap-1 bg-secondary/30 px-2 py-0.5 rounded-md">
                <MapPin className="h-3 w-3" /> {city.country}
              </div>

              {/* População */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span className="font-mono font-bold text-foreground">
                  {formatPopulation(city.population)}
                </span>
              </div>
            </div>
          </div>

          {/* Grid de Coordenadas */}
          <div className="grid grid-cols-2 gap-2 p-2 bg-secondary/20 rounded-lg border border-border/40">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Navigation className="h-2.5 w-2.5" /> {t.latitude}
              </span>
              <span className="font-mono text-xs font-semibold truncate">
                {formatCoord(city.coord.lat, "lat")}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Navigation className="h-2.5 w-2.5 rotate-90" /> {t.longitude}
              </span>
              <span className="font-mono text-xs font-semibold truncate">
                {formatCoord(city.coord.lon, "lon")}
              </span>
            </div>
            <div className="col-span-2 flex items-center justify-between border-t border-border/40 pt-1 mt-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" /> {t.timezone}
              </span>
              <span className="font-mono text-xs font-semibold text-primary">
                {formatGMT(city.timezone)}
              </span>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Bloco 2: Ciclo Solar */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-full shrink-0">
              <Sunrise className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">
                {t.sunrise}
              </span>
              <span className="text-sm font-bold font-mono truncate">
                {formatTime(sun.sunrise)}
              </span>
            </div>
          </div>

          {/* Indicador visual de ciclo */}
          <div className="h-1 flex-1 mx-3 md:mx-4 bg-gradient-to-r from-amber-500/20 via-primary/20 to-orange-500/20 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-amber-500 to-orange-500 opacity-50 blur-[2px]" />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end min-w-0">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">
                {t.sunset}
              </span>
              <span className="text-sm font-bold font-mono truncate">
                {formatTime(sun.sunset)}
              </span>
            </div>
            <div className="p-2 bg-orange-600/10 rounded-full shrink-0">
              <Sunset className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
