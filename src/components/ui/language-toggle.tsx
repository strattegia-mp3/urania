import { useStore } from "@/context/store";
import { useTranslation } from "@/hooks/useTranslation";

export function LanguageToggle() {
  const { lang, t } = useTranslation();
  const setLang = useStore((state) => state.setLang);

  return (
    <button
      onClick={() => setLang(lang === "pt" ? "en" : "pt")}
      title={t.language}
      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full
                 bg-background/50 hover:bg-accent/10 transition-colors
                 backdrop-blur-sm cursor-pointer"
    >
      <span className={lang === "pt" ? "text-primary" : "opacity-60"}>PT</span>
      <span className="opacity-40">|</span>
      <span className={lang === "en" ? "text-primary" : "opacity-60"}>EN</span>
    </button>
  );
}
