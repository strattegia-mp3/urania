import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/providers/Providers";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Urania Weather",
  description: "Minimalist Weather Dashboard",
  manifest: "/manifest.json",
  // Preconnect hints para APIs externas — reduz latência
  other: {
    preconnect: "https://api.openweathermap.org",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Preconnect para reduzir latência das APIs */}
        <link rel="preconnect" href="https://api.openweathermap.org" />
        <link rel="preconnect" href="https://tile.openweathermap.org" />
        <link rel="preconnect" href="https://flagcdn.com" />
        <link rel="dns-prefetch" href="https://openweathermap.org" />
      </head>
      <body className={`font-sans antialiased`}>
        <Toaster position="top-center" richColors />
        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
