import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { content } from "@/content";
import { contentFr } from "@/content.fr";
import { LocaleProvider, RemountOnLocale } from "@/i18n/LocaleProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Footer } from "@/components/Footer";
import { FrameLines, MenuPill } from "@/components/Chrome";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = pageMeta(content.about.meta.title, content.about.meta.description);

const TITLES = { en: content.about.meta.title, fr: contentFr.about.meta.title };

// Язык — тот же, что выбран на главной (EN / FR). Блоки с выезжающими по буквам заголовками
// пересоздаются при смене языка, чтобы появление шло уже с новым текстом.
export default function About() {
  return (
    <LocaleProvider titles={TITLES}>
      <main>
        <SmoothScroll />
        <RemountOnLocale>
          <AboutPage />
          <Footer />
        </RemountOnLocale>
        <FrameLines />
        <MenuPill linkBase="/" />
      </main>
    </LocaleProvider>
  );
}
