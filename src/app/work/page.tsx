import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { content } from "@/content";
import { contentFr } from "@/content.fr";
import { LocaleProvider, RemountOnLocale } from "@/i18n/LocaleProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Footer } from "@/components/Footer";
import { FrameLines, MenuPill } from "@/components/Chrome";
import { WorkPage } from "@/components/work/WorkPage";

export const metadata: Metadata = pageMeta(content.work.meta.title, content.work.meta.description);

const TITLES = { en: content.work.meta.title, fr: contentFr.work.meta.title };

// Все проекты списком с фильтром по категориям. Язык — тот же, что выбран на главной (EN / FR).
export default function Work() {
  return (
    <LocaleProvider titles={TITLES}>
      <main>
        <SmoothScroll />
        <RemountOnLocale>
          <WorkPage />
          <Footer />
        </RemountOnLocale>
        <FrameLines />
        <MenuPill linkBase="/" />
      </main>
    </LocaleProvider>
  );
}
