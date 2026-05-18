"use client";

import { useEffect, useState, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map as MapIcon, Layers } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";
import { useTranslation } from "@/hooks/useTranslation";

// Lazy-load completo do bundle Leaflet — evita SSR e reduz JS inicial
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false, loading: () => null },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
});

import { useMap } from "react-leaflet/hooks";

const MapUpdater = memo(({ lat, lon }: { lat: number; lon: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 10);
  }, [lat, lon, map]);
  return null;
});
MapUpdater.displayName = "MapUpdater";

interface WeatherMapProps {
  lat: number;
  lon: number;
  city: string;
}

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;

const LAYER_OPTIONS = [
  { value: "precipitation_new", labelKey: "precipitation" },
  { value: "clouds_new", labelKey: "clouds" },
  { value: "temp_new", labelKey: "temperature" },
  { value: "wind_new", labelKey: "wind" },
  { value: "pressure_new", labelKey: "pressure" },
] as const;

export const WeatherMap = memo(function WeatherMap({
  lat,
  lon,
  city,
}: WeatherMapProps) {
  const { t } = useTranslation();
  const [layer, setLayer] = useState("precipitation_new");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // ícones Leaflet/Webpack
    import("leaflet").then((L) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
    });
  }, []);

  if (!isMounted) {
    return (
      <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 flex flex-col">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <MapIcon className="h-4 w-4" /> {t.weatherMap}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-[300px] lg:min-h-[350px] bg-secondary/20 animate-pulse rounded-b-xl" />
      </Card>
    );
  }

  return (
    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 flex flex-col">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <MapIcon className="h-4 w-4" /> {t.weatherMap}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <Select value={layer} onValueChange={setLayer}>
            <SelectTrigger className="w-[130px] sm:w-[140px] h-8 text-xs">
              <SelectValue placeholder={t.layer} />
            </SelectTrigger>
            <SelectContent>
              {LAYER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t[opt.labelKey as keyof typeof t] as string}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 min-h-[300px] lg:min-h-[350px] relative overflow-hidden rounded-b-xl z-0">
        <MapContainer
          center={[lat, lon]}
          zoom={10}
          scrollWheelZoom={false}
          className="h-full w-full absolute inset-0 z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="map-tiles"
          />
          <TileLayer
            key={layer}
            url={`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${API_KEY}`}
            opacity={0.8}
            zIndex={10}
          />
          <Marker position={[lat, lon]}>
            <Popup>{city}</Popup>
          </Marker>
          <MapUpdater lat={lat} lon={lon} />
        </MapContainer>

        <div className="absolute bottom-1 left-1 bg-background/80 px-2 py-1 rounded text-[10px] z-[400] pointer-events-none">
          {t.layer}: {layer}
        </div>
      </CardContent>
    </Card>
  );
});
