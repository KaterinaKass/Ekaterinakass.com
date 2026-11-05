"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { content } from "@/content";
import { gsap, MOTION_OK, useGsap } from "@/lib/gsap";
import { SplitChars } from "./SplitChars";

const { projects } = content;

/** Плейсхолдер логотипа проекта: значок + название. Замените на <img> с логотипом. */
function LogoPlaceholder({ name, index }: { name: string; index: number }) {
  return (
    <div className="flex items-center gap-3 text-ink">
      <span className="grid size-9 place-items-center rounded-lg bg-ink text-[14px] font-semibold text-cream">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="text-[22px] font-medium tracking-tight">{name}</span>
    </div>
  );
}

/** Сетка проектов: заголовок выезжает по буквам, карточки появляются при скролле, за курсором ездит кнопка «View project» с анимированными стрелками. */
export function Projects() {
  const root = useRef<HTMLElement>(null);
  const cursor = useRef<HTMLDivElement>(null);

  useGsap(root, ({ q, root }) => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(q(".projects-char"), {
        yPercent: 115,
        stagger: 0.03,
        duration: 0.9,
        ease: "power4.out",
        scrollTrigger: { trigger: ".projects-head", start: "top 80%" },
      });
      gsap.from(".projects-sub", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".projects-head", start: "top 75%" },
      });

      q(".project-card").forEach((card) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 85%" } });
        tl.from(card.querySelectorAll(".card-char"), { yPercent: 115, stagger: 0.02, duration: 0.6, ease: "power3.out" })
          .from(card.querySelector(".card-logo"), { y: 30, opacity: 0, duration: 0.7, ease: "power3.out" }, 0.1);
      });
      gsap.from(q(".grid-border"), {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".projects-grid", start: "top 80%" },
      });
    });

    // кружок-курсор
    const el = cursor.current!;
    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
    const grid = root.querySelector<HTMLElement>(".projects-grid")!;
    const move = (e: PointerEvent) => {
      const r = grid.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
    };
    const enter = () => gsap.to(el, { scale: 1, duration: 0.35, ease: "back.out(2)" });
    const leave = () => gsap.to(el, { scale: 0, duration: 0.25 });
    grid.addEventListener("pointermove", move);
    grid.addEventListener("pointerenter", enter);
    grid.addEventListener("pointerleave", leave);
    return () => {
      grid.removeEventListener("pointermove", move);
      grid.removeEventListener("pointerenter", enter);
      grid.removeEventListener("pointerleave", leave);
    };
  });

  return (
    <section ref={root} id="work" className="relative z-10 w-full bg-cream pb-24">
      <div className="projects-head flex flex-col items-center px-6 pt-[10vh] pb-16 md:pb-24">
        {/* расстояние между словами = обычный пробел (~0.25em), без лишних отступов */}
        <h2 className="font-display flex flex-wrap justify-center gap-x-[0.25em] text-center text-[32px] leading-none text-ink md:text-[40px]">
          <SplitChars text={projects.titleTop} charClass="projects-char" />
          <SplitChars text={projects.titleBottom} charClass="projects-char" />
        </h2>
        <p className="projects-sub mt-6 max-w-[720px] text-center text-[16px] leading-[1.35] text-ink md:text-[20px]">
          {projects.subtitle}
        </p>
      </div>

      <div className="projects-grid relative mx-auto grid w-[90%] grid-cols-1 border-t border-line md:grid-cols-2 md:cursor-none">
        {projects.items.map((p, i) => (
          <a
            key={p.name}
            href={p.href}
            className="project-card group relative flex h-[260px] flex-col items-center justify-between overflow-hidden border-b border-line px-6 py-6 md:h-[348px] md:py-8 md:odd:border-r"
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-[#efe7e1] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-y-100" />
            {/* превью проекта при наведении: проявляется на фоне, книзу уходит в цвет фона, чтобы читались лого и категория */}
            {p.preview && (
              <span aria-hidden className="pointer-events-none absolute inset-0 hidden opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 md:block">
                <Image
                  src={p.preview}
                  alt=""
                  fill
                  sizes="45vw"
                  className="scale-105 object-cover opacity-60 transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-100"
                />
                <span className="absolute inset-0 bg-[linear-gradient(transparent_40%,var(--cream)_100%)]" />
              </span>
            )}
            <SplitChars text={p.year} charClass="card-char" className="relative text-[12px] text-muted md:text-[18px]" />
            {/* мобильный (как в референсе): год сверху, по центру лого + роль с отступом 24px, внизу кнопка с обводкой.
                Десктоп: обёртка «растворяется» (md:contents) — год, лого, роль распределяются по высоте карточки */}
            <div className="relative flex w-full flex-col items-center gap-6 md:contents">
              {/* с превью лого при наведении опускается и уменьшается, как в референсе; без превью — просто чуть растёт.
                  Ховер на внутренней обёртке: на .card-logo GSAP пишет инлайн translate/scale для появления */}
              <div className="card-logo relative flex w-full justify-center">
                <div
                  className={`flex w-full justify-center transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${
                    p.preview ? "md:group-hover:translate-y-[65px] md:group-hover:scale-[0.8]" : "group-hover:scale-105"
                  }`}
                >
                  {p.logo ? (
                    // ширина логотипа — доля ширины карточки, как в референсе (на мобильном доля больше)
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.logo.src}
                      alt={p.name}
                      width={p.logo.w}
                      height={p.logo.h}
                      style={{ "--logo-w": `${p.logo.maxW ?? 40}%`, "--logo-w-m": `${p.logo.maxWMobile ?? 70}%` } as CSSProperties}
                      className="block h-auto w-(--logo-w-m) select-none md:w-(--logo-w)"
                      draggable={false}
                    />
                  ) : (
                    <LogoPlaceholder name={p.name} index={i} />
                  )}
                </div>
              </div>
              {/* роль: крупнее и с разрядкой, чтобы читалась (у .font-display своя плотная разрядка, поэтому через style) */}
              <SplitChars
                text={p.category.toUpperCase()}
                charClass="card-char"
                className="font-display relative text-[14px] leading-none text-ink md:text-[20px]"
                style={{ letterSpacing: "0.06em" }}
              />
            </div>
            {/* мобильная кнопка как в референсе: обводка-пилюля, стрелка по диагонали */}
            <span className="relative flex items-center gap-2 rounded-full border border-ink px-3 py-[7px] text-[14px] leading-none text-ink md:hidden">
              {projects.viewLabel}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </span>
          </a>
        ))}

        {/* декоративные боковые линии, вырастают сверху вниз */}
        <span className="grid-border absolute top-0 left-0 h-full w-px bg-line" />
        <span className="grid-border absolute top-0 right-0 h-full w-px bg-line" />

        {/* кнопка у курсора: размеры и шрифт как у кнопки меню на десктопе, белая с чёрной обводкой */}
        <div
          ref={cursor}
          className="pointer-events-none absolute top-0 left-0 z-20 hidden h-11 items-center gap-6 rounded-full border border-ink bg-white pr-4 pl-5 text-[17px] whitespace-nowrap text-ink md:flex"
        >
          {projects.viewLabel}
          <span className="relative block h-4 w-5" aria-hidden>
            {/* вторая (серая) стрелка появляется справа, обе сдвигаются и сближаются, потом всё возвращается */}
            <svg className="arrow-2 absolute top-0 left-0" width="10" height="16" viewBox="0 0 10 16" fill="none">
              <path d="M2 2l6 6-6 6" stroke="#a8a8a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg className="arrow-1 absolute top-0 left-0" width="10" height="16" viewBox="0 0 10 16" fill="none">
              <path d="M2 2l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
}
