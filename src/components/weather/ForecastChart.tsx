"use client";

import { memo, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "@/hooks/useTranslation";
import { ForecastItem } from "@/types/weather";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ForecastChartProps {
  data: ForecastItem[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number | string }[];
  label?: string;
}

const CustomTooltip = memo(({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover/95 border border-border rounded-lg p-3 shadow-xl text-xs backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
      <p className="font-semibold mb-1 text-popover-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[var(--chart-1)]" />
        <p className="text-foreground font-bold text-sm">
          {typeof payload[0].value === "number"
            ? Math.round(payload[0].value)
            : payload[0].value}
          °C
        </p>
      </div>
    </div>
  );
});
CustomTooltip.displayName = "CustomTooltip";

export const ForecastChart = memo(function ForecastChart({
  data,
}: ForecastChartProps) {
  const { t } = useTranslation();

  // Memoizado — não recalcula a cada render
  const chartData = useMemo(
    () =>
      data.slice(0, 9).map((item) => ({
        time: `${format(new Date(item.dt * 1000), "HH")}h`,
        temp: Math.round(item.main.temp),
      })),
    [data],
  );

  return (
    <Card className="h-full shadow-md border-border/50 bg-card/50 backdrop-blur-sm flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm sm:text-base lg:text-lg font-medium text-foreground/90">
          {t.forecast24h}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-[200px] pt-2 px-2 sm:px-4 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 8, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.4}
                />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="var(--muted-foreground)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval={0}
              minTickGap={5}
              dy={10}
            />
            <YAxis hide domain={["dataMin - 2", "dataMax + 2"]} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "var(--muted-foreground)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
                opacity: 0.5,
              }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="var(--chart-1)"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorTemp)"
              animationDuration={800}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});
