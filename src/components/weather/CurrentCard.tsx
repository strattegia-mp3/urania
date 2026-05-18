import { memo, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { CurrentWeatherResponse } from "@/types/weather";
import { Droplets, Wind, Eye, Gauge, MapPin, Clock } from "lucide-react";
import { FavoriteToggle } from "./FavoriteToggle";

interface CurrentCardProps {
  data: CurrentWeatherResponse;
  city?: string;
}

// Converte timezone offset em hora local sem criar Date() repetidamente
function getLocalTime(timezoneOffset: number): string {
  const now = Date.now();
  const utc = now + new Date().getTimezoneOffset() * 60000;
  return new Date(utc + 1000 * timezoneOffset).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const Metric = memo(
  ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }) => (
    <div className="flex flex-col gap-1 rounded-lg border border-border/50 bg-secondary/30 p-2.5 sm:p-3 hover:bg-secondary/50 transition-colors">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        {icon}
        {label}
      </span>
      <span className="text-sm font-bold tracking-tight text-foreground">
        {value}
      </span>
    </div>
  ),
);
Metric.displayName = "Metric";

export const CurrentCard = memo(function CurrentCard({
  data,
  city: _city,
}: CurrentCardProps) {
  const { t } = useTranslation();

  const description = useMemo(
    () =>
      data.weather[0].description.charAt(0).toUpperCase() +
      data.weather[0].description.slice(1),
    [data.weather],
  );

  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
  const countryCode = data.sys.country?.toLowerCase() ?? "";
  const flagUrl = countryCode
    ? `https://flagcdn.com/w40/${countryCode}.png`
    : null;
  const locationName = `${data.name}, ${data.sys.country}`;
  const localTime = useMemo(() => getLocalTime(data.timezone), [data.timezone]);

  return (
    <Card className="relative h-full overflow-hidden border-border bg-card/80 backdrop-blur flex flex-col">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

      <CardHeader className="relative pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {data.name}
              </h2>
              {flagUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={flagUrl}
                  alt={data.sys.country}
                  width={40}
                  height={20}
                  loading="eager"
                  className="h-4 w-auto rounded-[2px] shadow-sm opacity-90 object-cover"
                  title={data.sys.country}
                />
              )}
              <div className="-ml-1">
                <FavoriteToggle
                  city={data.name}
                  country={data.sys.country}
                  lat={data.coord.lat}
                  lon={data.coord.lon}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              {description}
            </p>
          </div>
          <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary border border-primary/20 shrink-0">
            {t.now}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 flex-1 px-4 sm:px-6">
        {/* Temperatura */}
        <div className="flex items-center gap-2">
          <div className="relative -ml-2 sm:-ml-4 h-20 w-20 sm:h-28 sm:w-28 lg:h-32 lg:w-32 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={iconUrl}
              alt={description}
              width={128}
              height={128}
              loading="eager"
              className="h-full w-full object-contain drop-shadow-sm filter saturate-150"
            />
          </div>
          <div>
            <div className="text-5xl sm:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70">
              {Math.round(data.main.temp)}°
            </div>
            <div className="mt-1 text-sm font-medium text-muted-foreground">
              {t.feelsLike} {Math.round(data.main.feels_like)}°
              <div className="flex items-center gap-2 text-xs font-semibold mt-1">
                <span className="text-red-400">
                  ↑ {Math.round(data.main.temp_max)}°
                </span>
                <span className="text-blue-400">
                  ↓ {Math.round(data.main.temp_min)}°
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid w-full grid-cols-2 gap-2 sm:gap-3 sm:w-auto sm:min-w-[220px]">
          <Metric
            icon={<Droplets className="h-3.5 w-3.5 text-blue-400" />}
            label={t.humidity}
            value={`${data.main.humidity}%`}
          />
          <Metric
            icon={<Wind className="h-3.5 w-3.5 text-teal-400" />}
            label={t.wind}
            value={`${Math.round(data.wind.speed * 3.6)} km/h`}
          />
          <Metric
            icon={<Gauge className="h-3.5 w-3.5 text-purple-400" />}
            label={t.pressure}
            value={`${data.main.pressure} hPa`}
          />
          <Metric
            icon={<Eye className="h-3.5 w-3.5 text-amber-400" />}
            label={t.visibility}
            value={`${(data.visibility / 1000).toFixed(1)} km`}
          />
        </div>
      </CardContent>

      <CardFooter className="relative border-t border-border/40 py-3 mt-auto flex items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="font-medium truncate max-w-[130px] sm:max-w-[200px]">
            {locationName}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-background/50 px-2 py-1 border border-border/50 shadow-sm shrink-0">
          <Clock className="h-3.5 w-3.5 text-primary animate-pulse" />
          <span className="text-xs font-mono font-medium text-foreground tracking-wider">
            {localTime}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
});
