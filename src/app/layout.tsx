import type { Metadata } from "next";
import { Archivo, Inter_Tight } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "lenis/dist/lenis.css";
import "./globals.css";
import { content } from "@/content";
import { pageMeta, SITE_URL } from "@/lib/meta";
import { existsSync } from "node:fs";
import { join } from "node:path";

// PP Neue Montreal включаем, только если файлы шрифта лежат в public/fonts (проверка при сборке)
const hasNeueMontreal = existsSync(join(process.cwd(), "public/fonts/PPNeueMontreal-Regular.woff2"));

const display = Archivo({
  variable: "--font-display-src",
  subsets: ["latin"],
  axes: ["wdth"],
});

const body = Inter_Tight({
  variable: "--font-body-src",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMeta(content.meta.title, content.meta.description),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} antialiased ${hasNeueMontreal ? "font-neue" : ""}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
