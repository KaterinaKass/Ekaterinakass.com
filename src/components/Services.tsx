"use client";

import { useRef, useState } from "react";
import { content } from "@/content";
import { gsap, MOTION_OK, useGsap } from "@/lib/gsap";
import { SplitChars } from "./SplitChars";

const { services } = content;

/** Рваный край, которым тёмная секция переходит в светлую. */
function TornEdge() {
  return (
    <svg
      className="relative block h-5 w-full md:h-[54px]"
      viewBox="0 0 1440 54"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="#242424"
        d="M0 0H1440V30C1400 34 1372 26 1330 32S1260 40 1210 34 1140 28 1090 36 1010 44 960 36 880 26 830 34 750 46 700 38 620 28 570 34 500 42 450 36 380 30 330 38 250 44 200 36 120 28 70 34 20 40 0 36Z"
      />
    </svg>
  );
}

const INACTIVE = { scale: 0.72, color: "#c9c0b9" };
const ACTIVE = { scale: 1, color: "#242424" };

/**
 * Секция со списком направлений. Все три видны сразу: активное крупнее и чёрное,
 * остальные мельче и серые. По клику активным становится выбранное. Справа превью меняется через синюю шторку; при наведении
 * на превью за курсором едет круглая кнопка, ведущая к блоку с работами.
 */
export function Services() {
  const root = useRef<HTMLDivElement>(null);
  const activate = useRef<(i: number) => void>(undefined);
  const [active, setActive] = useState(0);

  useGsap(root, ({ q, root }) => {
    const rows = q(".service-row");
    const images = q(".service-img");
    const wipes = q(".service-wipe");
    gsap.set(rows.slice(1), INACTIVE);
    gsap.set(images.slice(1), { autoAlpha: 0 });

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.set(wipes, { yPercent: 100 });

      // появление: подводка и все три строки выезжают по буквам, когда секция подходит к экрану
      const intro = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 70%" } });
      intro
        .from(q(".service-intro-word"), { yPercent: 110, stagger: 0.05, duration: 0.6, ease: "power3.out" })
        .from(q(".service-char"), { yPercent: 115, stagger: 0.012, duration: 0.7, ease: "power3.out" }, 0.1)
        .fromTo(
          ".service-card",
          { clipPath: "inset(100% 0% 0% 0% round 16px)" },
          { clipPath: "inset(0% 0% 0% 0% round 16px)", duration: 1, ease: "power3.inOut" },
          0,
        );
    });

    // смена активной категории по клику: строка увеличивается и чернеет,
    // синяя шторка накрывает превью, под ней меняется картинка, шторка уезжает вверх
    let current = 0;
    let swap: gsap.core.Timeline | undefined;
    const showImage = (i: number) => images.forEach((img, j) => gsap.set(img, { autoAlpha: j === i ? 1 : 0 }));
    activate.current = (i) => {
      if (i === current) return;
      const prev = current;
      current = i;
      setActive(i);
      const smooth = { duration: 0.6, ease: "sine.inOut", overwrite: "auto" as const };
      gsap.to(rows[prev], { ...INACTIVE, ...smooth });
      gsap.to(rows[i], { ...ACTIVE, ...smooth });
      swap?.progress(1);
      if (!window.matchMedia(MOTION_OK).matches) return showImage(i);
      swap = gsap
        .timeline()
        .fromTo(wipes[i], { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: "power2.inOut" })
        .add(() => showImage(i))
        .to(wipes[i], { yPercent: -100, duration: 0.5, ease: "power2.inOut" });
    };
    // наведение на неактивную категорию слегка её затемняет
    rows.forEach((row, i) => {
      row.addEventListener("pointerenter", () => i !== current && gsap.to(row, { color: "#8f8580", duration: 0.25 }));
      row.addEventListener("pointerleave", () => i !== current && gsap.to(row, { color: INACTIVE.color, duration: 0.25 }));
    });

    // кнопка на превью: появляется при наведении и едет за курсором
    const card = root.querySelector<HTMLElement>(".service-card")!;
    const cta = root.querySelector<HTMLElement>(".service-cta")!;
    gsap.set(cta, { xPercent: -50, yPercent: -50, scale: 0 });
    const xTo = gsap.quickTo(cta, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(cta, "y", { duration: 0.4, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
    };
    const enter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = card.getBoundingClientRect();
      gsap.set(cta, { x: e.clientX - r.left, y: e.clientY - r.top });
      gsap.to(cta, { scale: 1, duration: 0.45, ease: "back.out(1.8)" });
    };
    const leave = () => gsap.to(cta, { scale: 0, duration: 0.3, ease: "power2.in" });
    card.addEventListener("pointermove", move);
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    return () => {
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
    };
  });

  return (
    <div ref={root} className="relative z-10">
      <section className="flex h-svh w-full flex-col overflow-hidden bg-cream">
        <TornEdge />
        {/* мобильный: отступы как в референсе — 120px сверху, 96px до категорий, превью прижато к низу с отступом 96px */}
        <div className="flex flex-1 flex-col items-center pt-[120px] md:flex-row md:px-[5%] md:pt-0">
          <div className="flex w-full flex-col items-center md:items-end">
            {/* подводка выровнена по правому краю вместе с категориями */}
            <p className="mb-24 flex flex-wrap justify-center gap-x-[0.3em] overflow-hidden px-8 text-[18px] text-ink md:justify-end md:self-end md:px-0">
              {services.intro.split(" ").map((w, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <span className="service-intro-word inline-block">{w}</span>
                </span>
              ))}
            </p>
            {/* все три категории всегда видны, активная выбирается кликом */}
            <div>
              <div className="service-list flex flex-col items-center md:items-end">
                {services.items.map((s, i) => (
                  <button
                    key={s.title}
                    type="button"
                    aria-pressed={active === i}
                    onClick={() => activate.current?.(i)}
                    className="service-row flex cursor-pointer origin-center justify-center rounded-md text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:origin-right md:justify-end"
                  >
                    <SplitChars
                      text={s.title.toUpperCase()}
                      charClass="service-char"
                      className="font-display text-[32px] leading-[1.25] md:text-[clamp(30px,4.4vw,60px)] md:leading-[1.15]"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto mb-24 flex w-full items-center justify-center md:my-0">
            <a
              href="#work"
              aria-label={services.hoverCta}
              className="service-card relative block aspect-[5/4] w-[calc(100%-64px)] max-w-[460px] overflow-hidden rounded-2xl md:max-w-none md:cursor-none"
            >
              {services.items.map((s, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={s.image}
                  src={s.image}
                  alt=""
                  className="service-img absolute inset-0 h-full w-full object-cover"
                  style={{ zIndex: i }}
                />
              ))}
              {services.items.map((s, i) => (
                <div key={i} className="service-wipe absolute inset-0 z-10 bg-accent" />
              ))}
              {/* круглая кнопка у курсора (только мышь) */}
              <span className="service-cta pointer-events-none absolute top-0 left-0 z-20 hidden size-[180px] flex-col items-center justify-center gap-3 rounded-full bg-ink/80 px-6 text-center text-[22px] leading-[1.15] text-white backdrop-blur-sm md:flex">
                {services.hoverCta}
                <svg className="animate-bob" width="22" height="26" viewBox="0 0 22 26" fill="none" aria-hidden>
                  <path d="M11 1v22M2 15l9 9 9-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
