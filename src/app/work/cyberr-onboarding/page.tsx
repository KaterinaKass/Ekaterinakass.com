import type { Metadata } from "next";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Footer } from "@/components/Footer";
import { FrameLines, MenuPill } from "@/components/Chrome";
import { CyberrCase } from "@/components/case/cyberr/CyberrCase";
import { OnboardingFull, OnboardingSummary, onboardingCase } from "@/components/case/cyberr/OnboardingViews";

export const metadata: Metadata = {
  title: "Onboarding at Cyberr — Case Study",
  description: "A 10-step onboarding that turns a resume into a profile ready for AI matching.",
};

// ?view=full открывает сразу полную версию кейса
export default async function CyberrOnboarding({ searchParams }: PageProps<"/work/cyberr-onboarding">) {
  const { view } = await searchParams;
  return (
    <main>
      <SmoothScroll />
      <CyberrCase initialView={view === "full" ? "full" : "summary"} data={onboardingCase} summary={<OnboardingSummary />} full={<OnboardingFull />} />
      <Footer />
      <FrameLines />
      <MenuPill linkBase="/" />
    </main>
  );
}
