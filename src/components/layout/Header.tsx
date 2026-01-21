"use client";

import { CitySearch } from "./CitySearch";
import { useTranslation } from "@/hooks/useTranslation";
import { useStore } from "@/context/store";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { FavoritesMenu } from "./FavoritesMenu";

export function Header() {
  const { t } = useTranslation();
  const setCoords = useStore((state) => state.setCoords);

  const handleGoHome = () => {
    setCoords(null);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <button
          onClick={handleGoHome}
          title={t.home}
          className="hidden md:flex items-center gap-3 cursor-pointer group"
        >
          <Logo className="w-8 h-8 rounded-full shadow-lg transition-all duration-300 group-hover:scale-[1.06] group-hover:shadow-[0_0_18px_rgba(168,85,247,0.6)]" />
          <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Urania
          </span>
        </button>

        {/* Logo mobile */}
        <button
          onClick={handleGoHome}
          title={t.home}
          className="md:hidden cursor-pointer logo-hover"
        >
          <Logo className="w-8 h-8" />
        </button>

        {/* Search */}
        <div className="flex-1 md:flex-none md:w-[400px] mx-2 md:mx-4">
          <CitySearch />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          <FavoritesMenu />
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
