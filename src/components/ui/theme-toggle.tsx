import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Light mode" : "Dark mode"}
      className="relative flex h-10 w-10 items-center justify-center rounded-full
                 bg-background/50 hover:bg-accent/10 transition-all
                 backdrop-blur-sm overflow-hidden cursor-pointer"
    >
      {isDark ? (
        <Moon className="h-5 w-5 text-cyan-400 icon-rise drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
      ) : (
        <Sun className="h-5 w-5 text-amber-500 icon-rise drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
      )}

      {/* Glow de fundo */}
      <div
        className={`absolute inset-0 opacity-20 blur-md ${
          isDark ? "bg-cyan-500" : "bg-amber-500"
        }`}
      />
    </button>
  );
}
