import type { Metadata } from "next";
import { content } from "@/content";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Footer } from "@/components/Footer";
import { FrameLines, MenuPill } from "@/components/Chrome";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: content.about.meta.title,
  description: content.about.meta.description,
};

export default function About() {
  return (
    <main>
      <SmoothScroll />
      <AboutPage />
      <Footer />
      <FrameLines />
      <MenuPill linkBase="/" />
    </main>
  );
}
