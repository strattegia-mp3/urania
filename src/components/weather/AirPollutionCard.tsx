import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AirPollutionResponse } from "@/types/weather";
import { Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/hooks/useTranslation";

export function AirPollutionCard({ data }: { data: AirPollutionResponse }) {
  const { t } = useTranslation();

  const aqi = data.list[0].main.aqi;
  const pm25 = data.list[0].components.pm2_5;
  const so2 = data.list[0].components.so2;
  const no2 = data.list[0].components.no2;

  // Mapa de cores e textos para o AQI
  const aqiMap: Record<number, { label: string; color: string; desc: string }> =
    {
      1: { label: t.aqiGood, color: "bg-emerald-500", desc: t.aqiDescGood },
      2: { label: t.aqiFair, color: "bg-yellow-500", desc: t.aqiDescFair },
      3: {
        label: t.aqiModerate,
        color: "bg-orange-500",
        desc: t.aqiDescModerate,
      },
      4: { label: t.aqiPoor, color: "bg-red-500", desc: t.aqiDescPoor },
      5: {
        label: t.aqiVeryPoor,
        color: "bg-purple-900",
        desc: t.aqiDescVeryPoor,
      },
    };

  const info = aqiMap[aqi] || aqiMap[1];
  const progressValue = (aqi / 5) * 100;

  return (
    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <Activity className="h-4 w-4" /> {t.airQuality}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{info.label}</div>
            <div className="text-xs text-muted-foreground">{info.desc}</div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-white font-bold text-sm ${info.color}`}
          >
            AQI {aqi}
          </div>
        </div>

        {/* Barra de Progresso visual do AQI (1 a 5) */}
        <Progress value={progressValue} className="h-2" />

        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground pt-2">
          <div className="flex flex-col items-center bg-secondary/30 p-2 rounded">
            <span>PM2.5</span>
            <span className="font-bold text-foreground">{pm25.toFixed(1)}</span>
          </div>
          <div className="flex flex-col items-center bg-secondary/30 p-2 rounded">
            <span>SO₂</span>
            <span className="font-bold text-foreground">{so2.toFixed(1)}</span>
          </div>
          <div className="flex flex-col items-center bg-secondary/30 p-2 rounded">
            <span>NO₂</span>
            <span className="font-bold text-foreground">{no2.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
