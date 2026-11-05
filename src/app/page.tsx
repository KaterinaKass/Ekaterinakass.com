import { SmoothScroll } from "@/components/SmoothScroll";
import { Hero } from "@/components/Hero";
import { Portrait } from "@/components/Portrait";
import { Statement } from "@/components/Statement";
// Services и Projects временно скрыты (не удалены): вернуть — раскомментировать импорт и строку в разметке
// import { Services } from "@/components/Services";
import { ShippedWork } from "@/components/ShippedWork";
import { ProcessSection } from "@/components/ProcessSection";
// import { Projects } from "@/components/Projects";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { FrameLines, MenuPill } from "@/components/Chrome";
import { LocaleProvider, RemountOnLocale } from "@/i18n/LocaleProvider";

export default function Home() {
  return (
    // язык переключается на месте (EN / FR у кнопки меню); блоки с выезжающими по скроллу буквами
    // пересоздаются при смене языка, чтобы появление шло уже с новым текстом
    <LocaleProvider>
      <main>
        <SmoothScroll />
        <Hero />
        <Portrait />
        <Statement />
        {/* <Services /> */}
        <ShippedWork />
        <RemountOnLocale>
          <ProcessSection />
        </RemountOnLocale>
        {/* <Projects /> */}
        <RemountOnLocale>
          <Testimonials />
          <Footer />
        </RemountOnLocale>
        <FrameLines />
        <MenuPill />
      </main>
    </LocaleProvider>
  );
}
