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

export function CurrentCard({ data, city }: CurrentCardProps) {
  const { t } = useTranslation();
  const description =
    data.weather[0].description.charAt(0).toUpperCase() +
    data.weather[0].description.slice(1);

  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

  // URL da bandeira
  const countryCode = data.sys.country ? data.sys.country.toLowerCase() : "";
  const flagUrl = countryCode
    ? `https://flagcdn.com/w40/${countryCode}.png`
    : null;

  // Formatação do nome do local para o Footer
  const locationName = `${data.name}, ${data.sys.country}`;

  // Horário local
  const formatLocalTime = (timezoneOffset: number) => {
    // 1. Pega o timestamp atual (UTC do browser)
    const d = new Date();
    const localTime = d.getTime();

    // 2. Compensa o deslocamento do próprio browser para chegar no "UTC Zero"
    const localOffset = d.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;

    // 3. Adiciona o deslocamento da cidade (API vem em segundos, convertemos p/ ms)
    const targetTime = utc + 1000 * timezoneOffset;

    // 4. Formata
    return new Date(targetTime).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Dashboard técnico geralmente usa 24h
    });
  };

  const localTime = formatLocalTime(data.timezone);

  return (
    <Card className="relative h-full overflow-hidden border-border bg-card/80 backdrop-blur flex flex-col">
      {/* Glow sutil */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

      <CardHeader className="relative pb-2">
        <CardTitle className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            {/* Título com Bandeira */}
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {/* Priorizamos data.name para o título principal (geralmente mais curto) */}
                {data.name}
              </h2>
              {flagUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={flagUrl}
                  alt={data.sys.country}
                  className="h-4 w-auto rounded-[2px] shadow-sm opacity-90 object-cover"
                  title={data.sys.country}
                />
              )}
              <div className="-ml-1">
                {/* Ajuste fino de margem */}
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

          <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary border border-primary/20">
            {t.now}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative flex flex-col items-center justify-between gap-6 md:flex-row flex-1">
        {/* Temperatura */}
        <div className="flex items-center gap-2">
          <div className="relative -ml-4 h-24 w-24 md:h-32 md:w-32">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={iconUrl}
              alt={description}
              className="h-full w-full object-contain drop-shadow-sm filter saturate-150"
            />
          </div>

          <div>
            <div className="text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70">
              {Math.round(data.main.temp)}°
            </div>
            <div className="mt-1 text-sm font-medium text-muted-foreground">
              {t.feelsLike} {Math.round(data.main.feels_like)}°
              <div className="flex items-center gap-2 text-xs font-semibold mt-1">
                <span className="text-red-400 flex items-center">
                  ↑ {Math.round(data.main.temp_max)}°
                </span>
                <span className="text-blue-400 flex items-center">
                  ↓ {Math.round(data.main.temp_min)}°
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid w-full grid-cols-2 gap-3 md:w-auto">
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

      {/* Footer */}
      <CardFooter className="relative border-t border-border/40 py-3 mt-auto flex items-center justify-between gap-4">
        {/* Lado Esquerdo: Localização */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
          <MapPin className="h-3.5 w-3.5" />
          <span className="font-medium truncate max-w-[150px]">
            {locationName}
          </span>
        </div>

        {/* Lado Direito: Horário Local */}
        <div className="flex items-center gap-2 rounded-md bg-background/50 px-2 py-1 border border-border/50 shadow-sm">
          <Clock className="h-3.5 w-3.5 text-primary animate-pulse" />{" "}
          {/* Animação sutil no relógio */}
          <span className="text-xs font-mono font-medium text-foreground tracking-wider">
            {localTime}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

/* ===== Subcomponente semântico ===== */
function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border/50 bg-secondary/30 p-3 hover:bg-secondary/50 transition-colors">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        {icon}
        {label}
      </span>
      <span className="text-sm font-bold tracking-tight text-foreground">
        {value}
      </span>
    </div>
  );
}
