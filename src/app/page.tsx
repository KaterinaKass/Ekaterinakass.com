import { SmoothScroll } from "@/components/SmoothScroll";
import { Hero } from "@/components/Hero";
import { Portrait } from "@/components/Portrait";
import { Statement } from "@/components/Statement";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { FrameLines, MenuPill } from "@/components/Chrome";

export default function Home() {
  return (
    <main>
      <SmoothScroll />
      <Hero />
      <Portrait />
      <Statement />
      <Services />
      <Projects />
      <Testimonials />
      <Footer />
      <FrameLines />
      <MenuPill />
    </main>
  );
}
