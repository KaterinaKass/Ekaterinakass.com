import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Footer } from "@/components/Footer";
import { FrameLines, MenuPill } from "@/components/Chrome";
import { LocalizedCase } from "@/components/case/cyberr/CyberrCase";
import { OnboardingFull, OnboardingSummary, onboardingCase } from "@/components/case/cyberr/OnboardingViews";
import { OnboardingFullFr, OnboardingSummaryFr, onboardingCaseFr } from "@/components/case/cyberr/OnboardingViews.fr";
import { LocaleProvider, RemountOnLocale } from "@/i18n/LocaleProvider";

const TITLES = { en: "Onboarding at Cyberr — Case Study", fr: "L’onboarding de Cyberr — Étude de cas" };

export const metadata: Metadata = pageMeta(TITLES.en, "A 10-step onboarding that turns a resume into a profile ready for AI matching.");

// ?view=full открывает сразу полную версию кейса. Язык — тот же, что выбран на главной (EN / FR).
export default async function CyberrOnboarding({ searchParams }: PageProps<"/work/cyberr-onboarding">) {
  const { view } = await searchParams;
  return (
    <LocaleProvider titles={TITLES}>
      <main>
        <SmoothScroll />
        <LocalizedCase
          initialView={view === "full" ? "full" : "summary"}
          en={{ data: onboardingCase, summary: <OnboardingSummary />, full: <OnboardingFull /> }}
          fr={{ data: onboardingCaseFr, summary: <OnboardingSummaryFr />, full: <OnboardingFullFr /> }}
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
