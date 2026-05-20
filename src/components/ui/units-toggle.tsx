"use client";

import { memo } from "react";
import { useStore } from "@/context/store";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";

export const UnitsToggle = memo(function UnitsToggle() {
  const { units, toggleUnits } = useStore();
  const { t } = useTranslation();
  const isMetric = units === "metric";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleUnits}
      title={isMetric ? t.switchToImperial : t.switchToMetric}
      className="h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-md cursor-pointer relative overflow-hidden group"
      aria-label={isMetric ? t.switchToImperial : t.switchToMetric}
    >
      <span className="sr-only">
        {isMetric ? t.switchToImperial : t.switchToMetric}
      </span>
      {/* Fundo animado ao hover */}
      <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md" />
      <span
        className={cn(
          "relative flex items-center gap-0.5 text-xs font-bold tracking-tight transition-all duration-300",
          isMetric ? "text-foreground" : "text-primary",
        )}
      >
        <Thermometer className="h-3.5 w-3.5 shrink-0" />
        <span
          className="transition-all duration-300 ease-in-out"
          style={{ letterSpacing: "-0.02em" }}
        >
          {isMetric ? "°C" : "°F"}
        </span>
      </span>
    </Button>
  );
});
