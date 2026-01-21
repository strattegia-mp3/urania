"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { Wind } from "@/types/weather";
import { Navigation, Wind as WindIcon } from "lucide-react";

interface WindCardProps {
  wind: Wind;
}

export function WindCard({ wind }: WindCardProps) {
  const { t } = useTranslation();

  // Converte graus meteorológicos em direção cardeal aproximada
  const getDirection = (deg: number) => {
    const directions = [
      t.dirN,
      "NE", // NE é igual em PT/EN
      t.dirE,
      "SE", // SE é igual em PT/EN
      t.dirS,
      `${t.dirS}${t.dirW}`, // SO (PT) ou SW (EN)
      t.dirW,
      `${t.dirN}${t.dirW}`, // NO (PT) ou NW (EN)
    ];
    return directions[Math.round(deg / 45) % 8];
  };

  return (
    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <WindIcon className="h-4 w-4" /> {t.windTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 items-center">
        {/* Lado Esquerdo: Bússola Visual */}
        <div className="relative flex items-center justify-center w-24 h-24 border-2 border-muted rounded-full bg-secondary/20 mx-auto">
          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground font-bold">
            <span className="absolute top-1">{t.dirN}</span>
            <span className="absolute bottom-1">{t.dirS}</span>
            <span className="absolute left-1">{t.dirW}</span>
            <span className="absolute right-1">{t.dirE}</span>
          </div>

          {/* Seta Rotativa */}
          <Navigation
            className="w-10 h-10 text-primary transition-transform duration-1000 ease-out"
            style={{ transform: `rotate(${wind.deg}deg)` }}
            fill="currentColor"
          />
        </div>

        {/* Lado Direito: Dados */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{t.speed}</span>
            <span className="text-2xl font-bold">
              {Math.round(wind.speed * 3.6)}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                km/h
              </span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{t.direction}</span>
            <span className="font-medium">
              {getDirection(wind.deg)} ({wind.deg}°)
            </span>
          </div>

          {wind.gust && (
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">{t.gusts}</span>
              <span className="font-medium text-amber-500">
                {Math.round(wind.gust * 3.6)} km/h
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
