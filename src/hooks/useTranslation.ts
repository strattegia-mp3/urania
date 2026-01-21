import { useStore } from "@/context/store";
import { translations } from "@/lib/i18n";

export const useTranslation = () => {
  const { lang } = useStore();
  return {
    t: translations[lang],
    lang,
    setLang: useStore.getState().setLang, // Acesso direto à action
  };
};
