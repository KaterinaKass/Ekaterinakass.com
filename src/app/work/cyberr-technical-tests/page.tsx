import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Footer } from "@/components/Footer";
import { FrameLines, MenuPill } from "@/components/Chrome";
import { LocalizedCase } from "@/components/case/cyberr/CyberrCase";
import { FullView, SummaryView, testsCase } from "@/components/case/cyberr/CyberrViews";
import { FullViewFr, SummaryViewFr, testsCaseFr } from "@/components/case/cyberr/CyberrViews.fr";
import { LocaleProvider, RemountOnLocale } from "@/i18n/LocaleProvider";

const TITLES = { en: "Technical Tests at Cyberr — Case Study", fr: "Les tests techniques de Cyberr — Étude de cas" };

export const metadata: Metadata = pageMeta(TITLES.en, "Hands-on skill tests inside a cybersecurity hiring platform: from claimed skills to proven ones.");

// ?view=full открывает сразу полную версию кейса (на неё ведёт «Back to case study» со страницы скриптов).
// Язык — тот же, что выбран на главной (EN / FR), переключатель есть и здесь.
export default async function CyberrTechnicalTests({ searchParams }: PageProps<"/work/cyberr-technical-tests">) {
  const { view } = await searchParams;
  return (
    <LocaleProvider titles={TITLES}>
      <main>
        <SmoothScroll />
        <LocalizedCase
          initialView={view === "full" ? "full" : "summary"}
          en={{ data: testsCase, summary: <SummaryView />, full: <FullView /> }}
          fr={{ data: testsCaseFr, summary: <SummaryViewFr />, full: <FullViewFr /> }}
        />
        <RemountOnLocale>
          <Footer />
        </RemountOnLocale>
        <FrameLines />
        <MenuPill linkBase="/" />
      </main>
    </LocaleProvider>
  );
}
