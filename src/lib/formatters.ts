import { format, parseISO } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { ForecastItem } from "@/types/weather";

export interface DailyForecast {
  date: string;
  weekday: string;
  min: number;
  max: number;
  icon: string;
  pop: number;
}

const locales = { pt: ptBR, en: enUS };
type LangType = "pt" | "en";

export const formatTime = (dt: number, lang: LangType = "pt"): string =>
  format(new Date(dt * 1000), "HH:mm", { locale: locales[lang] });

/**
 * Agrupa a lista de 3h em dias, descarta o dia atual (sempre parcial)
 * e retorna exatamente os próximos DAYS_TO_SHOW dias completos.
 *
 * A API retorna até 40 slots (5 dias × 8 slots/dia). O dia de hoje
 * pode ter de 1 a 8 slots dependendo da hora atual, tornando o total
 * de dias entre 4 e 6. Normalizar garante sempre 5 cards.
 */
export const groupForecastByDay = (
  list: ForecastItem[],
  lang: LangType = "pt",
  daysToShow = 5,
): DailyForecast[] => {
  const todayKey = new Date().toISOString().split("T")[0];
  const dailyMap = new Map<string, DailyForecast>();

  for (const item of list) {
    const dateKey = item.dt_txt.split(" ")[0];

    // Descarta o dia atual — ele é parcial e distorce min/max
    if (dateKey === todayKey) continue;

    const current = dailyMap.get(dateKey);
    if (!current) {
      dailyMap.set(dateKey, {
        date: dateKey,
        weekday: format(parseISO(dateKey), "EEEE", { locale: locales[lang] }),
        min: item.main.temp_min,
        max: item.main.temp_max,
        icon: item.weather[0].icon,
        pop: item.pop,
      });
    } else {
      dailyMap.set(dateKey, {
        ...current,
        min: Math.min(current.min, item.main.temp_min),
        max: Math.max(current.max, item.main.temp_max),
        icon: item.dt_txt.includes("12:00")
          ? item.weather[0].icon
          : current.icon,
        pop: Math.max(current.pop, item.pop),
      });
    }
  }

  // Retorna exatamente daysToShow dias (slice garante o limite superior)
  return Array.from(dailyMap.values()).slice(0, daysToShow);
};
