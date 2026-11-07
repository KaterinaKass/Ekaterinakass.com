"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import { useContent } from "@/i18n/LocaleProvider";
import { gsap, MOTION_OK, ScrollTrigger, useGsap } from "@/lib/gsap";
import { Icons3D } from "./Icons3D";
import { DotGrid } from "./DotGrid";


// Форма волны в долях ширины и высоты svg (0..1): ровный старт у левого края внизу, плавный подъём,
// две волны и крутой подъём, который уходит в правый край. Кривые Безье: [c1x, c1y, c2x, c2y, x, y].
const WAVE_START: [number, number] = [-0.02, 0.95];
const WAVE: number[][] = [
  [0.08, 0.95, 0.2, 0.9, 0.3, 0.77],
  [0.4, 0.64, 0.46, 0.4, 0.54, 0.4],
  [0.61, 0.4, 0.64, 0.68, 0.69, 0.68],
  [0.74, 0.68, 0.77, 0.28, 0.82, 0.28],
  [0.86, 0.28, 0.87, 0.46, 0.9, 0.46],
  [0.94, 0.46, 0.96, 0.12, 1.02, 0.04],
];
// на телефоне узко: одна мягкая волна и подъём к правому краю, иначе изгибы сжимаются в острые пики
const WAVE_MOBILE: number[][] = [
  [0.2, 0.95, 0.35, 0.58, 0.5, 0.55],
  [0.64, 0.52, 0.74, 0.76, 0.85, 0.56],
  [0.92, 0.43, 0.96, 0.15, 1.03, 0.05],
];
function wavePath(w: number, h: number) {
  const pt = (x: number, y: number) => `${(x * w).toFixed(1)} ${(y * h).toFixed(1)}`;
  return `M ${pt(...WAVE_START)} ` + (w < 768 ? WAVE_MOBILE : WAVE).map((c) => `C ${pt(c[0], c[1])}, ${pt(c[2], c[3])}, ${pt(c[4], c[5])}`).join(" ");
}

/** Тёмная закреплённая секция (закрепление короткое, 60vh, чтобы блок можно было быстро пролистать): слова «загораются» по мере скролла, снизу рисуется линия, вокруг плавают 3D-иконки. */
export function Statement() {
  const { statement } = useContent();
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

    // линия строится в настоящих пикселях svg (viewBox = размер на экране), без растяжения:
    // тогда длина пути совпадает с длиной на экране и скрытая линия не выглядывает «хвостиком»
    const svg = root.querySelector<SVGSVGElement>(".wave-svg");
    const path = root.querySelector<SVGPathElement>(".wave-path");
    const draw = { p: 0 };
    let len = 0;
    const applyDraw = () => {
      if (path && len) path.style.strokeDashoffset = `${len * (1 - draw.p)}`;
    };
    const layout = () => {
      if (!svg || !path) return;
      const { width: w, height: h } = svg.getBoundingClientRect();
      if (!w || !h) return;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      path.setAttribute("d", wavePath(w, h));
      len = path.getTotalLength();
      path.style.strokeDasharray = `${len} ${len}`;
      applyDraw();
    };
    layout();
    const ro = new ResizeObserver(layout);
    if (svg) ro.observe(svg);

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      draw.p = 0;
      applyDraw();

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
      tl.from(q(".statement-line"), { scaleX: 0, duration: 0.3, ease: "power2.out" }, 0);
      tl.to(draw, { p: 1, duration: 0.9, ease: "none", onUpdate: applyDraw }, 0.25);

      return () => {
        draw.p = 1;
        applyDraw();
      };
    });

    return () => ro.disconnect();
  });

  // слова загораются быстро, как в референсе: начинают, пока секция въезжает на экран,
  // и все горят примерно к 35% закреплённого скролла. Отдельно от остального: при смене языка
  // слов становится другое число, и анимация пересоздаётся под новые слова
  useLayoutEffect(() => {
    const el = root.current!;
    const ctx = gsap.context(() => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo(
          gsap.utils.toArray<HTMLElement>(".statement-word", el),
          { opacity: 0.18 },
          {
            opacity: 1,
            stagger: 0.1,
            duration: 0.3,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 60%",
              end: () => `top+=${(el.offsetHeight - window.innerHeight) * 0.35} top`,
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, [statement.words]);

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
        <svg className="wave-svg pointer-events-none absolute inset-x-0 bottom-0 h-[34%] w-full md:h-[45%]" fill="none" aria-hidden>
          {/* d и viewBox выставляются в layout() под реальный размер */}
          <path className="wave-path" stroke="#f7f1ed" strokeWidth="3" strokeLinecap="round" />
        </svg>
        {/* иконки поверх текста (canvas не перехватывает клики) */}
        <Icons3D progress={progress} customIconSrc={statement.customIcon} className="absolute inset-0 z-20" />
      </section>
    </div>
  );
}
