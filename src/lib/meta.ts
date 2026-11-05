import type { Metadata } from "next";

// Адрес сайта для абсолютных ссылок на превью (og:image). На Vercel берётся прод-домен проекта.
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://kate-gules.vercel.app";

const SITE_NAME = "Ekaterina Kasakina";

const OG_IMAGE = {
  url: "/og-v2.jpg",
  width: 1200,
  height: 630,
  alt: "Ekaterina Kasakina — Product Designer based in Luxembourg",
};

/** Метаданные страницы + превью для мессенджеров/соцсетей.
 *  Картинка превью одна на весь сайт: public/og-v2.jpg (1200×630; первый вариант — public/og.jpg). */
export function pageMeta(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US", title, description, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
  };
}
