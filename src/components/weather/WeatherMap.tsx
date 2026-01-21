"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map as MapIcon, Layers } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Importações dinâmicas do Leaflet para evitar erro de SSR
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Componente para atualizar a visão do mapa quando as props mudam
import { useMap } from "react-leaflet/hooks";
import { useTranslation } from "@/hooks/useTranslation";
function MapUpdater({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 10);
  }, [lat, lon, map]);
  return null;
}

interface WeatherMapProps {
  lat: number;
  lon: number;
  city: string;
}

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;

export function WeatherMap({ lat, lon, city }: WeatherMapProps) {
  const { t } = useTranslation();
  const [layer, setLayer] = useState("precipitation_new");
  // Fix para ícones do Leaflet no Next.js
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Correção dos ícones padrão do Leaflet que quebram no Webpack
    (async () => {
      const L = (await import("leaflet")).default;
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
    })();
  }, []);

  if (!isMounted)
    return (
      <div className="h-[400px] w-full bg-secondary/20 animate-pulse rounded-xl" />
    );

  return (
    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 flex flex-col">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <MapIcon className="h-4 w-4" /> {t.weatherMap}
        </CardTitle>

        {/* Seletor de Camadas */}
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <Select value={layer} onValueChange={setLayer}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder={t.layer} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="precipitation_new">
                {t.precipitation}
              </SelectItem>
              <SelectItem value="clouds_new">{t.clouds}</SelectItem>
              <SelectItem value="temp_new">{t.temperature}</SelectItem>
              <SelectItem value="wind_new">{t.wind}</SelectItem>
              <SelectItem value="pressure_new">{t.pressure}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 min-h-[350px] relative overflow-hidden rounded-b-xl z-0">
        <MapContainer
          center={[lat, lon]}
          zoom={10}
          scrollWheelZoom={false}
          className="h-full w-full absolute inset-0 z-0"
        >
          {/* Base Layer: OpenStreetMap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="map-tiles"
          />

          {/* Weather Layer: OpenWeatherMap 1.0 */}
          <TileLayer
            key={layer} // Força re-render ao trocar camada
            url={`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${API_KEY}`}
            opacity={0.8}
            zIndex={10}
          />

          <Marker position={[lat, lon]}>
            <Popup>{city}</Popup>
          </Marker>

          <MapUpdater lat={lat} lon={lon} />
        </MapContainer>

        {/* Nota de rodapé sobre o estilo */}
        <div className="absolute bottom-1 left-1 bg-background/80 px-2 py-1 rounded text-[10px] z-[400] pointer-events-none">
          {t.layer}: {layer}
        </div>
      </CardContent>
    </Card>
  );
}
