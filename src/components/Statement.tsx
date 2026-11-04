"use client";

import { Fragment, useRef } from "react";
import { content } from "@/content";
import { gsap, MOTION_OK, ScrollTrigger, useGsap } from "@/lib/gsap";
import { Icons3D } from "./Icons3D";
import { DotGrid } from "./DotGrid";

const { statement } = content;

/** Тёмная закреплённая секция (закрепление короткое, 60vh, чтобы блок можно было быстро пролистать): слова «загораются» по мере скролла, снизу рисуется линия, вокруг плавают 3D-иконки. */
export function Statement() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  useGsap(root, ({ q, root }) => {
    // прогресс для 3D-иконок (работает и при reduced motion)
    ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom bottom",
      onUpdate: (self) => (progress.current = self.progress),
    });

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const path = root.querySelector<SVGPathElement>(".wave-path");
      const len = path?.getTotalLength() ?? 0;
      if (path) gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
      tl.from(q(".statement-line"), { scaleX: 0, duration: 0.3, ease: "power2.out" }, 0);

      // слова загораются быстро, как в референсе: начинают, пока секция въезжает на экран,
      // и все горят примерно к 35% закреплённого скролла
      gsap.fromTo(
        q(".statement-word"),
        { opacity: 0.18 },
        {
          opacity: 1,
          stagger: 0.1,
          duration: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 60%",
            end: () => `top+=${(root.offsetHeight - window.innerHeight) * 0.35} top`,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        },
      );
      if (path) tl.to(path, { strokeDashoffset: 0, duration: 0.9, ease: "none" }, 0.25);
    });
  });

  return (
    <div ref={root} className="relative z-10 h-[160vh]">
      <section className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden bg-ink">
        {/* те же точки, что в блоке с фото: под курсором увеличиваются и белеют */}
        <DotGrid className="absolute inset-0 h-full w-full" />
        <div className="relative z-10 flex w-full items-center">
          <div className="statement-line ml-[5%] hidden h-px flex-1 origin-left bg-[#5a5a5a] md:block" />
          {/* мобильный: текст слева (отступ 9%, ширина 84%), «10+ years» отдельной крупной строкой; с md — по центру */}
          <p className="mr-auto ml-[9%] w-[84%] text-left text-[9.8vw] leading-[1.08] text-cream md:mx-0 md:w-auto md:px-6 md:text-center md:text-[clamp(32px,5vw,64px)] md:leading-[1.14]">
            {statement.words.map((w, i) => (
              <Fragment key={i}>
                {w.br && <br className="hidden md:block" />}
                <span
                  className={`statement-word ${
                    w.bold
                      ? "mb-3 block text-[17.8vw] leading-none font-semibold md:mb-0 md:inline-block md:text-[length:inherit] md:leading-[inherit]"
                      : "inline-block"
                  }`}
                >
                  {w.text}
                </span>{" "}
              </Fragment>
            ))}
          </p>
          <div className="statement-line mr-[5%] hidden h-px flex-1 origin-right bg-[#5a5a5a] md:block" />
        </div>

        {/* линия-волна и значок на ней */}
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] w-full"
          viewBox="0 0 1440 260"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <path
            className="wave-path"
            d="M-20 250 C 200 230, 380 140, 560 150 S 660 200, 720 190 S 820 120, 900 140 S 1180 230, 1300 120 S 1420 10, 1460 -10"
            stroke="#f7f1ed"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* иконки поверх текста (canvas не перехватывает клики) */}
        <Icons3D progress={progress} customIconSrc={statement.customIcon} className="absolute inset-0 z-20" />
      </section>
    </div>
  );
}
