"use client";

import { useStore } from "@/context/store";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner"; // Opcional: Se tiver toast, senão remova
import { useTranslation } from "@/hooks/useTranslation";

interface FavoriteToggleProps {
  city: string;
  country: string;
  lat: number;
  lon: number;
}

export function FavoriteToggle({
  city,
  country,
  lat,
  lon,
}: FavoriteToggleProps) {
  const { favorites, addFavorite, removeFavorite } = useStore();
  const { t } = useTranslation();

  // Verifica se já existe na lista (comparando coordenadas aproximadas)
  const isFavorite = favorites.some(
    (fav) => Math.abs(fav.lat - lat) < 0.001 && Math.abs(fav.lon - lon) < 0.001,
  );

  const handleToggle = () => {
    if (isFavorite) {
      removeFavorite(lat, lon);
      // Feedback de remoção (informativo)
      toast.warning(t.removedFromFavorites, {
        icon: "🗑️",
        description: `${city}, ${country}`,
        duration: 2000,
      });
    } else {
      addFavorite({ lat, lon, name: city, country });
      // Feedback de sucesso (positivo)
      toast.success(t.addedToFavorites, {
        description: `${city}, ${country}`,
        duration: 2000,
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="group relative h-8 w-8 hover:bg-transparent cursor-pointer"
      title={isFavorite ? t.removeFromFavorites : t.addToFavorites}
    >
      <Star
        className={cn(
          "h-6 w-6 transition-all duration-300",
          isFavorite
            ? "fill-amber-400 text-amber-400 scale-110" // Estrela preenchida e brilhante
            : "text-muted-foreground/50 group-hover:text-amber-400 group-hover:scale-110", // Estrela vazia
        )}
      />
      {/* Efeito de brilho ao ativar */}
      {isFavorite && (
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-amber-400/20 opacity-50 duration-1000" />
      )}
    </Button>
  );
}
