"use client";

import { memo, useCallback } from "react";
import { CitySearch } from "./CitySearch";
import { useTranslation } from "@/hooks/useTranslation";
import { useStore } from "@/context/store";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { FavoritesMenu } from "./FavoritesMenu";

export const Header = memo(function Header() {
  const { t } = useTranslation();
  const setCoords = useStore((state) => state.setCoords);

  const handleGoHome = useCallback(() => {
    setCoords(null);
  }, [setCoords]);

  return (
    <header className="sticky top-0 z-40 w-full h-14 sm:h-16 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 max-w-screen-2xl mx-auto gap-2">
        {/* Logo desktop */}
        <button
          onClick={handleGoHome}
          title={t.home}
          className="hidden md:flex items-center gap-2 lg:gap-3 cursor-pointer group shrink-0"
        >
          <Logo className="w-7 h-7 lg:w-8 lg:h-8 rounded-full shadow-lg transition-all duration-300 group-hover:scale-[1.06] group-hover:shadow-[0_0_18px_rgba(168,85,247,0.6)]" />
          <span className="font-bold text-xl lg:text-2xl tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Urania
          </span>
        </button>

        {/* Logo mobile */}
        <button
          onClick={handleGoHome}
          title={t.home}
          className="md:hidden cursor-pointer shrink-0"
        >
          <Logo className="w-7 h-7" />
        </button>

        {/* Search — cresce para preencher espaço disponível */}
        <div className="flex-1 min-w-0 md:flex-none md:w-[380px] lg:w-[440px] mx-1 sm:mx-2 md:mx-4">
          <CitySearch />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 shrink-0">
          <FavoritesMenu />
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
});
