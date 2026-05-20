"use client";

import Link from "next/link";
import { CloudOff, MoveLeft } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useTranslation } from "@/hooks/useTranslation";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none"
        style={{ animationDelay: "2s" }}
      />

      {/* Header simplificado só com a Logo */}
      <header className="absolute top-0 w-full p-6 flex justify-center sm:justify-start z-10">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 rounded-full shadow-lg shadow-purple-500/20" />
          <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Urania
          </span>
        </div>
      </header>

      {/* Conteúdo Central */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10">
        <div className="flex flex-col items-center text-center space-y-6 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary/50 border border-border/50 shadow-sm backdrop-blur-sm">
            <CloudOff className="h-12 w-12 text-muted-foreground animate-float" />
          </div>

          <div className="space-y-3">
            <h1 className="text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/70">
              404
            </h1>
            <h2 className="text-xl font-semibold text-foreground">
              {t.notFoundTitle}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base px-4">
              {t.notFoundText}
            </p>
          </div>

          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:scale-95 shadow-lg shadow-primary/25"
          >
            <MoveLeft className="h-4 w-4" />
            {t.home}
          </Link>
        </div>
      </main>
    </div>
  );
}
