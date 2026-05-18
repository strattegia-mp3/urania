import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { shallow } from "zustand/shallow";

export interface Coordinates {
  lat: number;
  lon: number;
  name?: string;
  country?: string;
}

interface WeatherState {
  coords: Coordinates | null;
  units: "metric" | "imperial";
  favorites: Coordinates[];
  lang: "pt" | "en";

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
      lang: "pt",

      setCoords: (coords) => set({ coords }),
      setUnits: (units) => set({ units }),
      setLang: (lang) => set({ lang }),

      addFavorite: (newFav) =>
        set((state) => {
          const exists = state.favorites.some(
            (f) => f.lat === newFav.lat && f.lon === newFav.lon,
          );
          if (exists) return state;
          return { favorites: [...state.favorites, newFav] };
        }),

      removeFavorite: (lat, lon) =>
        set((state) => ({
          // fix: usava AND (&&) mas deve ser OR (||) para filtrar corretamente
          favorites: state.favorites.filter(
            (f) => !(f.lat === lat && f.lon === lon),
          ),
        })),
    }),
    {
      name: "urania-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favorites: state.favorites,
        units: state.units,
        lang: state.lang,
      }),
    },
  ),
);

// Re-export shallow para uso nos componentes
export { shallow };
