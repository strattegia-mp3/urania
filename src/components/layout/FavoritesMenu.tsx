"use client";

import { useStore } from "@/context/store";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Trash2, MapPin } from "lucide-react";

export function FavoritesMenu() {
  const { favorites, setCoords, removeFavorite } = useStore();
  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelect = (fav: any) => {
    setCoords(fav);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title={t.favorites} className="cursor-pointer">
          <div className="relative">
            <Star className="h-[1.2rem] w-[1.2rem]" />
            {/* Badge se tiver favoritos */}
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>{t.favorites}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {favorites.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {t.emptyFavorites}
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="p-1">
              {favorites.map((fav, idx) => (
                <div
                  key={`${fav.lat}-${idx}`}
                  className="flex items-center justify-between gap-2 p-1 group"
                >
                  {/* Botão de Selecionar Cidade */}
                  <DropdownMenuItem
                    onClick={() => handleSelect(fav)}
                    className="flex-1 cursor-pointer flex flex-col items-start gap-1 py-2"
                  >
                    <span className="font-semibold">{fav.name}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {fav.country}
                    </span>
                  </DropdownMenuItem>

                  {/* Botão de Deletar (Trash) */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // Impede de selecionar a cidade ao deletar
                      removeFavorite(fav.lat, fav.lon);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
