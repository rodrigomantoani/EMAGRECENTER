import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { PHProvider } from "@/lib/analytics";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const UMAMI_WEBSITE_ID =
  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ||
  "01a9a1d1-d503-437e-9e4c-e2d74bc2a892";

const UMAMI_DOMAINS =
  process.env.NEXT_PUBLIC_UMAMI_DOMAINS || "quiz.emagrecenters.com.br";

export const metadata: Metadata = {
  title: "HELIXON Tirzepatida 60mg - Controle do Apetite e Emagrecimento",
  description: "HELIXON Tirzepatida 60mg ajuda a reduzir o apetite, aumentar a saciedade e acelerar a perda de peso. 12 semanas de tratamento com frete grátis. R$ 1.799",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Remix Icon */}
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/@react-grab/claude-code/dist/client.global.js"
            strategy="lazyOnload"
          />
        )}
        <Script
          src="https://hlx-tracker.pages.dev/hlx.js"
          strategy="afterInteractive"
        />
        {/* Umami Analytics */}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id={UMAMI_WEBSITE_ID}
          data-domains={UMAMI_DOMAINS}
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${inter.variable} antialiased`}
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      >
        <PHProvider>
          {children}
          <Analytics />
          <SpeedInsights />
        </PHProvider>
      </body>
    </html>
  );
}
