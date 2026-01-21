import { format, parseISO } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { ForecastItem } from "@/types/weather";

// Interface para o resumo diário
export interface DailyForecast {
  date: string; // "2023-10-25"
  weekday: string; // "Quarta-feira"
  min: number; // Menor temp do dia
  max: number; // Maior temp do dia
  icon: string; // Ícone predominante (pegaremos o do meio dia)
  pop: number; // Probabilidade de chuva média
}

// Mapa de Locales
const locales = {
  pt: ptBR,
  en: enUS,
};

type LangType = "pt" | "en";

// Formata a hora para o gráfico
export const formatTime = (dt: number, lang: LangType = "pt"): string => {
  return format(new Date(dt * 1000), "HH:mm", { locale: locales[lang] });
};

// Transforma a lista de 3h em uma lista de dias únicos (Min/Max)
export const groupForecastByDay = (
  list: ForecastItem[],
  lang: LangType = "pt",
): DailyForecast[] => {
  const dailyMap = new Map<string, DailyForecast>();

  list.forEach((item) => {
    // Pegamos só o dia
    const dateKey = item.dt_txt.split(" ")[0];
    const current = dailyMap.get(dateKey);

    if (!current) {
      // Se não existe, cria o inicial
      dailyMap.set(dateKey, {
        date: dateKey,
        weekday: format(parseISO(dateKey), "EEEE", { locale: locales[lang] }),
        min: item.main.temp_min,
        max: item.main.temp_max,
        icon: item.weather[0].icon, // Pega o primeiro ícone disponível
        pop: item.pop,
      });
    } else {
      // Se existe, atualiza min/max
      dailyMap.set(dateKey, {
        ...current,
        min: Math.min(current.min, item.main.temp_min),
        max: Math.max(current.max, item.main.temp_max),
        // Se o item for perto do meio dia (12:00), atualizamos o ícone para ser mais representativo
        icon: item.dt_txt.includes("12:00")
          ? item.weather[0].icon
          : current.icon,
        pop: Math.max(current.pop, item.pop), // Pega a maior chance de chuva do dia
      });
    }
  });

  // Converte o Map de volta para Array e remove o dia atual se estiver incompleto
  return Array.from(dailyMap.values());
};
