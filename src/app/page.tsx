"use client";

import { lazy, Suspense, memo } from "react";
import { Header } from "@/components/layout/Header";
import { HomeView } from "@/components/layout/HomeView";
import { useWeather } from "@/hooks/useWeather";
import { useTranslation } from "@/hooks/useTranslation";
import { useStore } from "@/context/store";
import { Loader2, AlertCircle } from "lucide-react";

// Lazy load pesados
const CurrentCard = lazy(() =>
  import("@/components/weather/CurrentCard").then((m) => ({
    default: m.CurrentCard,
  })),
);
const ForecastChart = lazy(() =>
  import("@/components/weather/ForecastChart").then((m) => ({
    default: m.ForecastChart,
  })),
);
const ForecastList = lazy(() =>
  import("@/components/weather/ForecastList").then((m) => ({
    default: m.ForecastList,
  })),
);
const AirPollutionCard = lazy(() =>
  import("@/components/weather/AirPollutionCard").then((m) => ({
    default: m.AirPollutionCard,
  })),
);
const WeatherDetails = lazy(() =>
  import("@/components/weather/WeatherDetails").then((m) => ({
    default: m.WeatherDetails,
  })),
);
const LocationAstroCard = lazy(() =>
  import("@/components/weather/LocationAstroCard").then((m) => ({
    default: m.LocationAstroCard,
  })),
);
const WindCard = lazy(() =>
  import("@/components/weather/WindCard").then((m) => ({
    default: m.WindCard,
  })),
);
const WeatherMap = lazy(() =>
  import("@/components/weather/WeatherMap").then((m) => ({
    default: m.WeatherMap,
  })),
);

const CardSkeleton = memo(({ className = "" }: { className?: string }) => (
  <div
    className={`rounded-2xl border border-border/40 bg-card/40 animate-pulse ${className}`}
  />
));
CardSkeleton.displayName = "CardSkeleton";

export default function Dashboard() {
  const { coords } = useStore();
  const { data, isLoading, error } = useWeather();
  const { t } = useTranslation();

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6 max-w-screen-2xl pb-10">
        {isLoading ? (
          <div className="flex h-[70vh] items-center justify-center flex-col gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">
              {t.loadingSatellites}
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-destructive gap-3 border border-destructive/20 rounded-2xl bg-destructive/5 p-8">
            <AlertCircle className="w-8 h-8" />
            <p className="font-semibold">{t.connectionError}</p>
            <p className="text-sm text-muted-foreground">{t.checkConnection}</p>
          </div>
        ) : data ? (
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-3 md:gap-4">
                <CardSkeleton className="sm:col-span-2 lg:col-span-3 2xl:col-span-4 min-h-[280px]" />
                <CardSkeleton className="lg:col-span-1 2xl:col-span-2 min-h-[280px]" />
                <CardSkeleton className="sm:col-span-2 lg:col-span-2 2xl:col-span-3 min-h-[380px]" />
                <CardSkeleton className="sm:col-span-2 lg:col-span-2 2xl:col-span-3 min-h-[380px]" />
                <CardSkeleton className="lg:col-span-1 2xl:col-span-2" />
                <CardSkeleton className="sm:col-span-2 lg:col-span-2 2xl:col-span-2" />
                <CardSkeleton className="lg:col-span-1 2xl:col-span-2" />
                <CardSkeleton className="sm:col-span-2 lg:col-span-4 2xl:col-span-6 min-h-[200px]" />
              </div>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 2xl:col-span-4 min-h-[260px] lg:min-h-[300px]">
                <CurrentCard data={data.current} city={coords.name} />
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-1 2xl:col-span-2">
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

              <div className="col-span-1 sm:col-span-2 lg:col-span-2 2xl:col-span-3 min-h-[380px]">
                <WeatherMap
                  lat={data.current.coord.lat}
                  lon={data.current.coord.lon}
                  city={coords.name || data.current.name}
                />
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-2 2xl:col-span-3 min-h-[380px]">
                <ForecastChart data={data.forecast.list} />
              </div>

              <div className="col-span-1 sm:col-span-1 lg:col-span-1 2xl:col-span-2">
                <WindCard wind={data.current.wind} />
              </div>

              <div className="col-span-1 sm:col-span-1 lg:col-span-2 2xl:col-span-2">
                <WeatherDetails
                  main={data.current.main}
                  visibility={data.current.visibility}
                  clouds={data.current.clouds}
                  rain={data.current.rain}
                />
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-1 2xl:col-span-2">
                <AirPollutionCard data={data.pollution} />
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-4 2xl:col-span-6">
                <ForecastList data={data.forecast.list} />
              </div>
            </div>
          </Suspense>
        ) : null}
      </main>
    </div>
  );
}
