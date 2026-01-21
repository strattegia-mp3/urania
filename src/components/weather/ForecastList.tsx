"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useStore } from "@/context/store";
import { ForecastItem } from "@/types/weather";
import { groupForecastByDay } from "@/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CloudRain, ArrowDown, ArrowUp } from "lucide-react";

interface ForecastListProps {
  data: ForecastItem[];
}

export function ForecastList({ data }: ForecastListProps) {
  const { lang } = useStore();
  const { t } = useTranslation();

  // Passamos o 'lang' para o agrupador gerar "Segunda" ou "Monday"
  const dailyForecasts = groupForecastByDay(data, lang);

  return (
    <Card className="col-span-1 md:col-span-3 lg:col-span-4 h-full shadow-md border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-foreground/90">
          {t.nextDays}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex w-full md:grid md:grid-cols-6 gap-4 p-4">
            {dailyForecasts.map((day) => (
              <div
                key={day.date}
                className="flex flex-col items-center justify-between min-w-[120px] w-full h-[160px] p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors"
              >
                <span className="text-sm font-semibold capitalize text-muted-foreground">
                  {day.weekday.split("-")[0]}
                </span>

                <div className="relative w-12 h-12">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                    alt="Icon"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex items-center gap-3 w-full justify-center">
                  <div className="flex items-center text-sm font-bold text-foreground">
                    <ArrowUp className="w-3 h-3 text-red-400 mr-1" />
                    {Math.round(day.max)}°
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ArrowDown className="w-3 h-3 text-blue-400 mr-1" />
                    {Math.round(day.min)}°
                  </div>
                </div>

                {/* Área de probabilidade de chuva com altura fixa para evitar pulos de layout */}
                <div className="h-4 flex items-center justify-center w-full">
                  {day.pop > 0.2 ? (
                    <div className="flex items-center text-xs text-blue-400 font-medium">
                      <CloudRain className="w-3 h-3 mr-1" />
                      {Math.round(day.pop * 100)}%
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/20">-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
