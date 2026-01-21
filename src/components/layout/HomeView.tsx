"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/context/store";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Globe,
  Compass,
} from "lucide-react";
import { CITIES_DB, getRandomCities, CityOption } from "@/lib/cities";

// Componente de Skeleton para o Loading
const CitySkeleton = () => (
  <div className="h-24 sm:h-28 lg:h-32 w-full rounded-xl border border-white/5 bg-white/5 animate-pulse flex flex-col justify-between p-3 sm:p-4">
    <div className="flex justify-between items-start">
      <div className="h-8 w-8 rounded-lg bg-white/10" />
      <div className="h-4 w-6 rounded bg-white/10" />
    </div>
    <div className="space-y-2">
      <div className="h-4 w-3/4 rounded bg-white/10" />
      <div className="h-3 w-1/4 rounded bg-white/5" />
    </div>
  </div>
);

export function HomeView() {
  const { setCoords } = useStore();
  const { t } = useTranslation();

  const [displayedCities, setDisplayedCities] = useState<CityOption[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(true);

  // Carregamento inicial
  useEffect(() => {
    // Timeout artificial para simular carregamento
    const timer = setTimeout(() => {
      setDisplayedCities(getRandomCities(6));
      setIsRefreshing(false); // Desativa o skeleton após carregar
    }, 500);

    return () => clearTimeout(timer); // Boa prática: limpar timeout se desmontar
  }, []);

  // Handles
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setDisplayedCities(getRandomCities(6));
      setIsRefreshing(false);
    }, 800);
  };

  const handleSelectCity = (city: CityOption) => {
    setCoords({
      lat: city.lat,
      lon: city.lon,
      name: city.name,
      country: city.country,
    });
  };

  const handleSurpriseMe = () => {
    const randomCity = CITIES_DB[Math.floor(Math.random() * CITIES_DB.length)];
    handleSelectCity(randomCity);
  };

  const handleExplore = () => {
    const inputElement = document.getElementById("search-input");
    if (inputElement) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        inputElement.focus();
      }, 100);
    }
  };

  const getRegionColor = (region: string) => {
    switch (region) {
      case "SA":
        return "from-green-500/20 to-emerald-900/20";
      case "NA":
        return "from-blue-500/20 to-indigo-900/20";
      case "EU":
        return "from-purple-500/20 to-violet-900/20";
      case "AS":
        return "from-red-500/20 to-rose-900/20";
      case "AF":
        return "from-yellow-500/20 to-amber-900/20";
      case "OC":
        return "from-cyan-500/20 to-blue-900/20";
      default:
        return "from-gray-500/20 to-slate-900/20";
    }
  };

  return (
    // Container Principal
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-x-hidden md:overflow-hidden flex items-center justify-center bg-background">
      {/* Background Cósmico */}
      <div className="absolute inset-0 z-0">
        {/* Fundo Base Profundo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/50 via-background to-background" />

        {/* Grid Perspectiva (Cyber Grid) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)] opacity-30" />

        {/* Nebulosas (Blobs) */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-violet-600/10 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
      </div>

      {/* Layout Split */}
      <div className="container relative z-10 h-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full gap-6 lg:gap-12 items-center">
          {/* Seção Esquerda: HERO TEXT */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
            {/* Badge Tech */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Urania Weather System
            </div>

            {/* Títulos */}
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter bg-gradient-to-br from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
                {t.welcomeTitle}
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-[400px] lg:max-w-none mx-auto lg:mx-0 leading-relaxed">
                {t.welcomeText}
              </p>
            </div>

            {/* Ações Hero */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 w-full pt-2">
              <Button
                size="lg"
                className="rounded-full h-12 px-6 shadow-[0_0_20px_-5px_var(--color-primary)] hover:shadow-[0_0_30px_-5px_var(--color-primary)] transition-all duration-300 cursor-pointer"
                onClick={handleSurpriseMe}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {t.surpriseMe}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full h-12 px-6 border-primary/20 hover:bg-primary/5 cursor-pointer"
                onClick={handleExplore}
              >
                <Compass className="mr-2 h-4 w-4" />
                {t.explore}
              </Button>
            </div>
          </div>

          {/* Seção Direita: GRID DE CIDADES */}
          <div className="lg:col-span-7 h-full flex flex-col justify-center animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
            {/* Toolbar Compacta */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider">
                <Globe className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">{t.realTimeDestinations}</span>
                <span className="sm:hidden">{t.destinations}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8 text-xs hover:bg-white/5 cursor-pointer"
              >
                <RefreshCw
                  className={`mr-2 h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`}
                />
                {t.refreshCities}
              </Button>
            </div>

            <div className="relative w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 overflow-y-auto max-h-[50vh] lg:max-h-none pr-1 lg:pr-0 scrollbar-hide">
                {/* Loading */}
                {isRefreshing
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <CitySkeleton key={i} />
                    ))
                  : displayedCities.map((city, idx) => (
                      <button
                        key={`${city.name}-${idx}`}
                        onClick={() => handleSelectCity(city)}
                        className="group relative h-24 sm:h-28 lg:h-32 w-full overflow-hidden rounded-xl border border-border/50 bg-card backdrop-blur-sm text-left transition-all hover:border-primary/50 hover:bg-card/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
                      >
                        {/* Gradiente de Fundo (Hover) */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${getRegionColor(city.region)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                        />

                        <div className="relative z-10 h-full flex flex-col justify-between p-3 sm:p-4">
                          <div className="flex justify-between items-start">
                            <div className="p-1.5 rounded-lg bg-black/20 group-hover:bg-black/40 transition-colors backdrop-blur-md border border-white/5">
                              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`https://flagcdn.com/w40/${city.country.toLowerCase()}.png`}
                              alt={city.country}
                              className="h-3 sm:h-4 w-auto rounded-[2px] shadow-sm"
                            />
                          </div>

                          <div>
                            <h3 className="font-semibold text-sm sm:text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
                              {city.name}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              <span className="uppercase tracking-wider text-[10px]">
                                {city.country}
                              </span>
                              <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ml-auto" />
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
