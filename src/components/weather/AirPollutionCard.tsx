"use client";

import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AirPollutionResponse, UVResponse } from "@/types/weather";
import { Activity, Sun } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

interface AirPollutionCardProps {
  data: AirPollutionResponse;
  uv?: UVResponse;
}

// UV helpers
function getUVInfo(value: number, t: ReturnType<typeof useTranslation>["t"]) {
  if (value <= 2)
    return {
      label: t.uvLow,
      desc: t.uvDescLow,
      color: "text-emerald-500",
      bar: "bg-emerald-500",
      pct: (value / 11) * 100,
    };
  if (value <= 5)
    return {
      label: t.uvModerate,
      desc: t.uvDescModerate,
      color: "text-yellow-500",
      bar: "bg-yellow-500",
      pct: (value / 11) * 100,
    };
  if (value <= 7)
    return {
      label: t.uvHigh,
      desc: t.uvDescHigh,
      color: "text-orange-500",
      bar: "bg-orange-500",
      pct: (value / 11) * 100,
    };
  if (value <= 10)
    return {
      label: t.uvVeryHigh,
      desc: t.uvDescVeryHigh,
      color: "text-red-500",
      bar: "bg-red-500",
      pct: (value / 11) * 100,
    };
  return {
    label: t.uvExtreme,
    desc: t.uvDescExtreme,
    color: "text-violet-600",
    bar: "bg-violet-600",
    pct: 100,
  };
}

const AQI_CONFIG = [
  {
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  {
    bg: "bg-yellow-500/15",
    border: "border-yellow-500/30",
    dot: "bg-yellow-500",
  },
  {
    bg: "bg-orange-500/15",
    border: "border-orange-500/30",
    dot: "bg-orange-500",
  },
  { bg: "bg-red-500/15", border: "border-red-500/30", dot: "bg-red-500" },
  {
    bg: "bg-purple-900/20",
    border: "border-purple-700/30",
    dot: "bg-purple-700",
  },
];

export const AirPollutionCard = memo(function AirPollutionCard({
  data,
  uv,
}: AirPollutionCardProps) {
  const { t } = useTranslation();

  const aqi = data.list[0].main.aqi;
  const { pm2_5, so2, no2 } = data.list[0].components;
  const aqiStyle = AQI_CONFIG[aqi - 1] ?? AQI_CONFIG[0];

  const aqiLabels = [
    t.aqiGood,
    t.aqiFair,
    t.aqiModerate,
    t.aqiPoor,
    t.aqiVeryPoor,
  ];
  const aqiDescs = [
    t.aqiDescGood,
    t.aqiDescFair,
    t.aqiDescModerate,
    t.aqiDescPoor,
    t.aqiDescVeryPoor,
  ];

  const uvValue = uv?.value ?? 0;
  const uvInfo = useMemo(() => getUVInfo(uvValue, t), [uvValue, t]);

  return (
    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <Activity className="h-4 w-4" /> {t.airQuality}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AQI badge + label */}
        <div
          className={cn(
            "flex items-center justify-between rounded-xl p-3 border transition-all duration-300",
            aqiStyle.bg,
            aqiStyle.border,
          )}
        >
          <div>
            <div className="text-xl font-bold leading-tight">
              {aqiLabels[aqi - 1]}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {aqiDescs[aqi - 1]}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "w-2.5 h-2.5 rounded-full animate-pulse",
                aqiStyle.dot,
              )}
            />
            <span className="text-sm font-bold">AQI {aqi}</span>
          </div>
        </div>

        {/* Barra AQI */}
        <Progress value={(aqi / 5) * 100} className="h-1.5" />

        {/* Poluentes */}
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          {[
            { label: "PM2.5", value: pm2_5.toFixed(1) },
            { label: "SO₂", value: so2.toFixed(1) },
            { label: "NO₂", value: no2.toFixed(1) },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center bg-secondary/30 p-2 rounded-lg border border-border/30 hover:bg-secondary/50 hover:scale-[1.03] transition-all duration-200"
            >
              <span>{label}</span>
              <span className="font-bold text-foreground text-sm mt-0.5">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Divisor */}
        <div className="border-t border-border/40" />

        {/* UV Index */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Sun className="h-3.5 w-3.5" /> {t.uvIndex}
            </span>
            <div className="flex items-center gap-1.5">
              <span className={cn("text-sm font-bold", uvInfo.color)}>
                {Math.round(uvValue)}
              </span>
              <span className={cn("text-xs font-medium", uvInfo.color)}>
                {uvInfo.label}
              </span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out",
                uvInfo.bar,
              )}
              style={{ width: `${Math.min(uvInfo.pct, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            {uvInfo.desc}
          </p>
        </div>
      </CardContent>
    </Card>
  );
});
