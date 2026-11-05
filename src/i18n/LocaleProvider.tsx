"use client";

// Переключение языка на месте, как на sarottofabio.com: клик по EN / FR меняет тексты сразу, адрес тот же.
// Компоненты берут тексты через useContent(). Провайдер стоит на каждой странице (главная, about, кейсы);
// где его нет, там английский и переключатель не показывается.
// Выбор запоминается в браузере (localStorage), ?lang=fr в адресе открывает сразу французский.

import { createContext, Fragment, useCallback, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";
import { getContent, getTestimonials } from "./content";

const STORAGE_KEY = "kate-locale";

type Ctx = { locale: Locale; setLocale: ((l: Locale) => void) | null };
const LocaleContext = createContext<Ctx>({ locale: DEFAULT_LOCALE, setLocale: null });

function readSaved(): Locale | null {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (isLocale(fromUrl)) return fromUrl;
    const saved = localStorage.getItem(STORAGE_KEY);
    return isLocale(saved) ? saved : null;
  } catch {
    return null;
  }
}

/** titles — заголовок вкладки по языкам; без него берётся заголовок главной из content. */
export function LocaleProvider({ children, titles }: { children: ReactNode; titles?: Record<Locale, string> }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  // Сервер всегда отдаёт английский. Если выбран французский, страница один раз пересобирается
  // до первой отрисовки (layout effect), чтобы интро и анимации по скроллу стартовали уже с французским текстом.
  const [boot, setBoot] = useState(0);

  useLayoutEffect(() => {
    const saved = readSaved();
    if (saved && saved !== DEFAULT_LOCALE) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- сохранённый язык известен только в браузере
      setLocaleState(saved);
      setBoot(1);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    const title = titles?.[locale] ?? getContent(locale).meta.title;
    const apply = () => {
      if (document.title !== title) document.title = title;
    };
    apply();
    // Next.js ставит заголовок из metadata (английский) позже этого эффекта — следим за <title> и возвращаем свой
    const obs = new MutationObserver(apply);
    obs.observe(document.head, { subtree: true, childList: true, characterData: true });
    // высота блоков меняется вместе с текстом — пересчитываем точки срабатывания анимаций по скроллу
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      obs.disconnect();
      cancelAnimationFrame(id);
    };
  }, [locale, titles]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <Fragment key={boot}>{children}</Fragment>
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext).locale;
/** Функция смены языка; null — на странице без переключателя. */
export const useSetLocale = () => useContext(LocaleContext).setLocale;
export const useContent = () => getContent(useLocale());
export const useTestimonials = () => getTestimonials(useLocale());

/**
 * Пересоздаёт блок при смене языка. Нужен блокам, где буквы и строки выезжают по скроллу:
 * у нового текста другое число букв, и проще заново запустить появление, чем подгонять старые твины.
 */
export function RemountOnLocale({ children }: { children: ReactNode }) {
  return <Fragment key={useLocale()}>{children}</Fragment>;
}

/** Показывает вариант для текущего языка; при смене языка блок пересоздаётся, и появление по скроллу идёт заново. */
export function ByLocale({ en, fr }: { en: ReactNode; fr: ReactNode }) {
  const locale = useLocale();
  return <Fragment key={locale}>{locale === "fr" ? fr : en}</Fragment>;
}
