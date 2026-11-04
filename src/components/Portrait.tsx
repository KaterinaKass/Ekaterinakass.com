"use client";

import { useRef } from "react";
import { content } from "@/content";
import { gsap, MOTION_OK, useGsap } from "@/lib/gsap";
import { DotGrid } from "./DotGrid";

const { portrait } = content;
const COLUMNS = 5;

/**
 * Переход из hero в синюю секцию: пять кремовых колонок по очереди «уезжают»,
 * открывая портрет. Дальше на скролле выезжают плашки с ролями.
 */
export function Portrait() {
  const root = useRef<HTMLDivElement>(null);

  useGsap(root, ({ q, root }) => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.to(q(".curtain-col"), {
        scaleY: 0,
        ease: "none",
        stagger: { each: 0.12, from: "center" },
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "top 20%",
          scrub: true,
        },
      });

      gsap.fromTo(
        ".portrait-img",
        { scale: 1.15, yPercent: 8 },
        {
          scale: 1,
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "top top", scrub: true },
        },
      );

      // подпись позади фото «пишется» одновременно с появлением плашек ролей
      gsap.fromTo(
        ".portrait-sign",
        { clipPath: "inset(0% 100% 0% 0%)", opacity: 0.4 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: ".roles-track", start: "top 85%", end: "top+=8% 55%", scrub: true },
        },
      );

      const chips = q(".role-chip");
      chips.forEach((chip, i) => {
        const dir = i - (chips.length - 1) / 2; // -1, 0, 1
        gsap.from(chip, {
          xPercent: dir * 60,
          yPercent: 140,
          rotate: dir * 8,
          opacity: 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".roles-track",
            start: `top+=${i * 4}% 85%`,
            end: `top+=${i * 4}% 55%`,
            scrub: true,
          },
        });
      });
    });
  });

  return (
    <div ref={root} id="about" className="relative">
      {/* шторка из колонок, лежит поверх верхнего края синей секции */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-[200px]">
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <div key={i} className="curtain-col h-full flex-1 origin-top bg-cream" />
        ))}
      </div>

      <section className="relative h-[150vh] w-full overflow-x-clip bg-accent">
        {/* h-dvh: высота меняется вместе с адресной строкой, фото всегда стоит на нижнем крае экрана */}
        <div className="sticky top-0 flex h-dvh items-end justify-center overflow-hidden">
          {/* точки под курсором увеличиваются и белеют */}
          <DotGrid className="absolute inset-0 h-full w-full" />
          {/* подпись позади фото; на мобильном фото на всю ширину, поэтому подпись над головой */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.hero.signatureWhite}
            alt=""
            aria-hidden
            className="portrait-sign pointer-events-none absolute top-[9%] md:top-[38%] left-1/2 z-[1] w-[min(88vw,1100px)] -translate-x-1/2 -translate-y-1/2 select-none"
            draggable={false}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={portrait.image}
            alt={portrait.alt}
            className="portrait-img relative z-[2] h-[92svh] w-auto max-w-none origin-bottom select-none"
            draggable={false}
          />
        </div>

        <div className="roles-track absolute inset-x-0 bottom-0 h-[60vh]">
          {/* на десктопе плашки разнесены по ширине, как в референсе */}
          <div className="sticky top-[70svh] z-[3] mx-auto flex flex-wrap items-center justify-center gap-3 px-4 pb-10 md:w-[84%] md:justify-between md:px-0">
            {portrait.roles.map((r) => (
              <span
                key={r}
                className="role-chip rounded-full bg-ink px-5 py-2 text-[20px] whitespace-nowrap text-white md:text-[28px]"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
