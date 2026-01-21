"use client";

import { Header } from "@/components/layout/Header";
import { HomeView } from "@/components/layout/HomeView";
import { CurrentCard } from "@/components/weather/CurrentCard";
import { ForecastChart } from "@/components/weather/ForecastChart";
import { ForecastList } from "@/components/weather/ForecastList";
import { AirPollutionCard } from "@/components/weather/AirPollutionCard";
import { WeatherDetails } from "@/components/weather/WeatherDetails";
import { LocationAstroCard } from "@/components/weather/LocationAstroCard";
import { WindCard } from "@/components/weather/WindCard";
import { WeatherMap } from "@/components/weather/WeatherMap";
import { useWeather } from "@/hooks/useWeather";
import { useTranslation } from "@/hooks/useTranslation";
import { useStore } from "@/context/store";
import { Loader2, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const { coords } = useStore();
  const { data, isLoading, error } = useWeather();
  const { t } = useTranslation();

  // Estado: Home (Sem localização)
  if (!coords) {
    return (
      <div className="min-h-screen bg-background flex flex-col relative">
        <Header />
        <main className="flex-1">
          <HomeView />
        </main>
      </div>
    );
  }

  // Estado: Dashboard (Com localização)
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto p-4 md:p-6 space-y-6 max-w-7xl pb-20">
        {isLoading ? (
          <div className="flex h-[70vh] items-center justify-center flex-col gap-4 animate-pulse">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">
{t.loadingSatellites}            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-destructive gap-2 border border-destructive/20 rounded-xl bg-destructive/5 p-8">
            <AlertCircle className="w-8 h-8" />
            <p className="font-semibold">{t.connectionError}</p>
            <p className="text-sm text-muted-foreground">
              {t.checkConnection}
            </p>
          </div>
        ) : data ? (
          /* Bento Grid */
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Destaque Principal */}

            {/* Bloco 2: CurrentCard */}
            <div className="col-span-1 md:col-span-3 min-h-[320px]">
              <CurrentCard data={data.current} city={coords.name} />
            </div>

            {/* Bloco 5: Astro & Ciclo Solar */}
            <div className="col-span-1 md:col-span-1 h-full">
              <LocationAstroCard
                city={{
                  name: data.forecast.city.name,
                  country: data.forecast.city.country,
                  population: data.forecast.city.population,
                  timezone: data.forecast.city.timezone,
                  coord: data.forecast.city.coord,
                }}
                sun={{
                  sunrise: data.forecast.city.sunrise,
                  sunset: data.forecast.city.sunset,
                }}
              />
            </div>
            {/* Gráficos e Mapas */}

            {/* Bloco 8: Mapa Meteorológico Interativo */}
            <div className="col-span-1 md:col-span-2 min-h-[400px]">
              <WeatherMap
                lat={data.current.coord.lat}
                lon={data.current.coord.lon}
                city={coords.name || data.current.name}
              />
            </div>

            {/* Gráfico 24h */}
            <div className="col-span-1 md:col-span-2 min-h-[400px]">
              <ForecastChart data={data.forecast.list} />
            </div>

            {/* Detalhes Técnicos */}

            {/* Bloco 4: Vento Detalhado */}
            <div className="col-span-1 md:col-span-1">
              <WindCard wind={data.current.wind} />
            </div>

            {/* Bloco 3: Detalhes Atmosféricos */}
            <div className="col-span-1 md:col-span-2">
              <WeatherDetails
                main={data.current.main}
                visibility={data.current.visibility}
                clouds={data.current.clouds}
                rain={data.current.rain}
              />
            </div>

            {/* Bloco 6: Poluição */}
            <div className="col-span-1 md:col-span-1">
              <AirPollutionCard data={data.pollution} />
            </div>

            {/* Previsão Estendida */}

            {/* Bloco 7: Lista de Próximos Dias */}
            <div className="col-span-1 md:col-span-4">
              <ForecastList data={data.forecast.list} />
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
