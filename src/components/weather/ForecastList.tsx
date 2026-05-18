"use client";

import { memo, useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useStore } from "@/context/store";
import { ForecastItem } from "@/types/weather";
import { groupForecastByDay } from "@/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudRain, ArrowDown, ArrowUp } from "lucide-react";

interface ForecastListProps {
  data: ForecastItem[];
}

const DAYS_COUNT = 5;

export const ForecastList = memo(function ForecastList({
  data,
}: ForecastListProps) {
  const { lang } = useStore();
  const { t } = useTranslation();

  const dailyForecasts = useMemo(
    () => groupForecastByDay(data, lang, DAYS_COUNT),
    [data, lang],
  );

  return (
    <Card className="shadow-md border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm sm:text-base lg:text-lg font-medium text-foreground/90">
          {t.nextDays}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
        {/*
          Grid sempre fixo em 5 colunas — nunca muda independente
          de quantos dias a API retornar. Em mobile vira scroll horizontal.
        */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {dailyForecasts.map((day) => (
            <div
              key={day.date}
              className="flex flex-col items-center justify-between h-[140px] sm:h-[160px] p-2 sm:p-3 md:p-4 rounded-xl border border-border/50 bg-card hover:bg-accent/30 transition-colors"
            >
              {/* Dia da semana */}
              <span className="text-[10px] sm:text-xs font-semibold capitalize text-muted-foreground truncate w-full text-center leading-tight">
                {/* Exibe abreviação em mobile, nome completo em sm+ */}
                <span className="sm:hidden">{day.weekday.slice(0, 3)}</span>
                <span className="hidden sm:inline">
                  {day.weekday.split("-")[0]}
                </span>
              </span>

              {/* Ícone */}
              <div className="relative w-8 h-8 sm:w-11 sm:h-11">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.weekday}
                  width={44}
                  height={44}
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Max / Min */}
              <div className="flex flex-col items-center gap-0.5 w-full">
                <div className="flex items-center text-xs sm:text-sm font-bold text-foreground">
                  <ArrowUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400 mr-0.5" />
                  {Math.round(day.max)}°
                </div>
                <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground">
                  <ArrowDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-400 mr-0.5" />
                  {Math.round(day.min)}°
                </div>
              </div>

              {/* Chuva — altura fixa para manter alinhamento */}
              <div className="h-4 flex items-center justify-center w-full">
                {day.pop > 0.2 ? (
                  <div className="flex items-center text-[10px] sm:text-xs text-blue-400 font-medium">
                    <CloudRain className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                    {Math.round(day.pop * 100)}%
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground/20">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});
