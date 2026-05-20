"use client";

import { memo, useState, useEffect } from "react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/useTranslation";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const REFRESH_INTERVAL_MS = 1000 * 60 * 10; // 10 minutos

export const RefreshStatus = memo(function RefreshStatus() {
  const { t } = useTranslation();
  const isFetching = useIsFetching({ queryKey: ["weather"] });
  const queryClient = useQueryClient();
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [updatedAgo, setUpdatedAgo] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      const cache = queryClient
        .getQueryCache()
        .getAll()
        .find((q) => Array.isArray(q.queryKey) && q.queryKey[0] === "weather");

      if (!cache?.state.dataUpdatedAt) {
        setUpdatedAgo("");
        setSecondsLeft(null);
        return;
      }

      const elapsed = Date.now() - cache.state.dataUpdatedAt;
      const remaining = Math.max(0, REFRESH_INTERVAL_MS - elapsed);
      const minsLeft = Math.ceil(remaining / 60000);
      const minsAgo = Math.floor(elapsed / 60000);

      setSecondsLeft(minsLeft);
      setUpdatedAgo(minsAgo === 0 ? t.justNow : `${minsAgo} ${t.minutesAgo}`);
    };

    tick();
    const id = setInterval(tick, 30000); // atualiza a cada 30s
    return () => clearInterval(id);
  }, [queryClient, t]);

  if (!secondsLeft && !isFetching) return null;

  return (
    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground select-none">
      <RefreshCw
        className={cn(
          "h-3 w-3 shrink-0 transition-all duration-300",
          isFetching && "animate-spin text-primary",
        )}
      />
      {isFetching ? (
        <span className="text-primary font-medium animate-in fade-in duration-300">
          {t.refreshingNow}
        </span>
      ) : (
        <span className="hidden sm:inline animate-in fade-in duration-300">
          {t.lastUpdated} {updatedAgo}
        </span>
      )}
    </div>
  );
});
