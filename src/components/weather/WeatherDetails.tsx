"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { MainData } from "@/types/weather";
import { Eye, Gauge, CloudFog, CloudRain, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherDetailsProps {
  main: MainData;
  visibility: number;
  clouds: { all: number };
  rain?: { "1h"?: number };
  snow?: { "1h"?: number };
}

const DetailRow = memo(
  ({
    icon,
    label,
    value,
    highlight,
    className,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
    className?: string;
  }) => (
    <div
      className={cn(
        "space-y-1 p-2.5 rounded-lg border border-border/40 transition-all duration-200",
        "hover:bg-secondary/40 hover:border-border/70 hover:scale-[1.02]",
        highlight && "border-blue-400/30 bg-blue-400/5",
        className,
      )}
    >
      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <div
        className={cn("font-semibold text-sm", highlight && "text-blue-400")}
      >
        {value}
      </div>
    </div>
  ),
);
DetailRow.displayName = "DetailRow";

export const WeatherDetails = memo(function WeatherDetails({
  main,
  visibility,
  clouds,
  rain,
  snow,
}: WeatherDetailsProps) {
  const { t } = useTranslation();
  const hasSnow = (snow?.["1h"] ?? 0) > 0;
  const hasRain = (rain?.["1h"] ?? 0) > 0;

  return (
    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <Gauge className="h-4 w-4" /> {t.atmosphericDetails}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <DetailRow
          icon={<Gauge className="h-3 w-3 text-purple-400" />}
          label={t.pressure}
          value={`${main.pressure} hPa`}
        />
        <DetailRow
          icon={<Eye className="h-3 w-3 text-amber-400" />}
          label={t.visibility}
          value={`${(visibility / 1000).toFixed(1)} km`}
        />
        <DetailRow
          icon={<CloudFog className="h-3 w-3 text-slate-400" />}
          label={t.clouds}
          value={`${clouds.all}%`}
        />
        <DetailRow
          icon={<CloudRain className="h-3 w-3 text-blue-400" />}
          label={t.rain1h}
          value={`${(rain?.["1h"] ?? 0).toFixed(1)} mm`}
          highlight={hasRain}
        />

        {hasSnow && (
          <DetailRow
            icon={<Snowflake className="h-3 w-3 text-sky-300" />}
            label={t.snow1h}
            value={`${snow!["1h"]!.toFixed(1)} mm`}
            highlight={true}
          />
        )}

        {main.grnd_level && (
          <DetailRow
            icon={<Gauge className="h-3 w-3 text-muted-foreground" />}
            label={t.groundLevel}
            value={`${main.grnd_level} hPa`}
            className={!hasSnow ? "col-span-2" : ""}
          />
        )}
      </CardContent>
    </Card>
  );
});
