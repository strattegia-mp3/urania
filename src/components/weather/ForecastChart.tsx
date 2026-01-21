"use client";

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
  payload?: {
    value: number | string;
    name?: string;
  }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover/95 border border-border rounded-lg p-3 shadow-xl text-xs backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
        <p className="font-semibold mb-1 text-popover-foreground">{label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--chart-1)]"></span>
          <p className="text-foreground font-bold text-sm">
            {typeof payload[0].value === "number"
              ? Math.round(payload[0].value)
              : payload[0].value}
            °C
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function ForecastChart({ data }: ForecastChartProps) {
  const { t } = useTranslation();
  const chartData = data.slice(0, 9).map((item) => ({
    time: `${format(new Date(item.dt * 1000), "HH")}h`,
    temp: Math.round(item.main.temp),
  }));

  return (
    <Card className="col-span-1 md:col-span-3 lg:col-span-2 h-full shadow-md border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-foreground/90">
          {t.forecast24h}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[250px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              {/* Gradiente */}
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
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTemp)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
