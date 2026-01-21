import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Coordinates {
  lat: number;
  lon: number;
  name?: string; // Nome da cidade para display
  country?: string;
}

interface WeatherState {
  // Estado
  coords: Coordinates | null;
  units: "metric" | "imperial";
  favorites: Coordinates[];
  lang: "pt" | "en";

  // Ações
  setCoords: (coords: Coordinates | null) => void;
  setUnits: (unit: "metric" | "imperial") => void;
  setLang: (lang: "pt" | "en") => void;
  addFavorite: (coords: Coordinates) => void;
  removeFavorite: (lat: number, lon: number) => void;
}

export const useStore = create<WeatherState>()(
  persist(
    (set) => ({
      coords: null,
      units: "metric",
      favorites: [],
      lang: "pt", // Default

      setCoords: (coords) => set({ coords }),
      setUnits: (units) => set({ units }),
      setLang: (lang) => set({ lang }),

      addFavorite: (newFav) =>
        set((state) => {
          // Evita duplicatas checando lat/lon
          const exists = state.favorites.some(
            (f) => f.lat === newFav.lat && f.lon === newFav.lon,
          );
          if (exists) return state;
          return { favorites: [...state.favorites, newFav] };
        }),

      removeFavorite: (lat, lon) =>
        set((state) => ({
          favorites: state.favorites.filter(
            (f) => f.lat !== lat && f.lon !== lon,
          ),
        })),
    }),
    {
      name: "urania-storage", // LocalStorage
      partialize: (state) => ({
        favorites: state.favorites,
        units: state.units,
        lang: state.lang, // <--- Persistir língua
      }),
    },
  ),
);
