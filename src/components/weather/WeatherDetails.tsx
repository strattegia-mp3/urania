import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { MainData, Wind as WindType } from "@/types/weather";
import { Eye, Gauge, CloudFog, CloudRain } from "lucide-react";

interface WeatherDetailsProps {
  main: MainData;
  visibility: number;
  clouds: { all: number };
  rain?: { "1h"?: number };
}

export function WeatherDetails({
  main,
  visibility,
  clouds,
  rain,
}: WeatherDetailsProps) {
  const { t } = useTranslation();

  return (
    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <Gauge className="h-4 w-4" /> {t.atmosphericDetails}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {/* Pressão */}
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">{t.pressure}</span>
          <div className="font-semibold">{main.pressure} hPa</div>
          {main.grnd_level && (
            <div className="text-[10px] text-muted-foreground">
              {t.groundLevel}: {main.grnd_level} hPa
            </div>
          )}
        </div>

        {/* Visibilidade */}
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Eye className="h-3 w-3" /> {t.visibility}
          </span>
          <div className="font-semibold">
            {(visibility / 1000).toFixed(1)} km
          </div>
        </div>

        {/* Nuvens */}
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <CloudFog className="h-3 w-3" /> {t.clouds}
          </span>
          <div className="font-semibold">{clouds.all}%</div>
        </div>

        {/* Precipitação (Se houver) */}
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <CloudRain className="h-3 w-3" /> {t.rain1h}
          </span>
          <div className="font-semibold">{rain?.["1h"] || 0} mm</div>
        </div>
      </CardContent>
    </Card>
  );
}
