import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Footer } from "@/components/Footer";
import { FrameLines, MenuPill } from "@/components/Chrome";
import { CyberrCase } from "@/components/case/cyberr/CyberrCase";
import { FullView, SummaryView, testsCase } from "@/components/case/cyberr/CyberrViews";

export const metadata: Metadata = pageMeta("Technical Tests at Cyberr — Case Study", "Hands-on skill tests inside a cybersecurity hiring platform: from claimed skills to proven ones.");

// ?view=full открывает сразу полную версию кейса (на неё ведёт «Back to case study» со страницы скриптов)
export default async function CyberrTechnicalTests({ searchParams }: PageProps<"/work/cyberr-technical-tests">) {
  const { view } = await searchParams;
  return (
    <main>
      <SmoothScroll />
      <CyberrCase initialView={view === "full" ? "full" : "summary"} data={testsCase} summary={<SummaryView />} full={<FullView />} />
      <Footer />
      <FrameLines />
      <MenuPill linkBase="/" />
    </main>
  );
}
