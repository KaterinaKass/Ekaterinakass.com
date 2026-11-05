// Языки сайта. Английский — основной. Французский включается переключателем EN / FR на главной
// (как на sarottofabio.com): текст меняется на месте, без перезагрузки и без смены адреса.
export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const isLocale = (v: unknown): v is Locale => LOCALES.includes(v as Locale);

/** Подписи кнопок переключателя: короткие — в углу на десктопе, полные — в мобильном меню. */
export const LOCALE_LABELS: Record<Locale, { short: string; full: string }> = {
  en: { short: "EN", full: "English" },
  fr: { short: "FR", full: "Français" },
};
