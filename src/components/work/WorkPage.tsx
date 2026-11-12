"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useContent } from "@/i18n/LocaleProvider";
import { gsap, MOTION_OK, useGsap } from "@/lib/gsap";
import { SplitChars } from "@/components/SplitChars";
import { GradientCover, PhoneCover } from "@/components/CoverArt";

// контейнер — как на странице About (между вертикальными линиями)
const WRAP = "mx-auto w-[90%] px-3 md:px-[clamp(24px,3vw,48px)]";
const INNER = "mx-auto max-w-[1320px]";

type Item = ReturnType<typeof useContent>["work"]["items"][number];

/** Обложка проекта для превью у курсора: картинка или нарисованная заглушка, как в «Work I've shipped». */
function Cover({ item, items }: { item: Item; items: Item[] }) {
  if (item.cover) return <Image src={item.cover} alt="" fill sizes="360px" className="object-cover object-top" draggable={false} />;
  if (item.art === "phone") return <PhoneCover />;
  if (item.art === "gradient") {
    const n = items.slice(0, items.indexOf(item) + 1).filter((it) => it.art === "gradient").length;
    return <GradientCover n={n} />;
  }
  return <span className="absolute inset-0 bg-[#efe7e1]" />;
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * Страница /work. По мотивам sarottofabio.com/work: заголовок, вводный текст, фильтр-пилюли с числом проектов
 * и список строк (годы · название с тегами · итог · стрелка). Переключателя list/grid нет.
 * Наше: шрифты и цвета сайта, заливка строки снизу вверх при наведении, превью обложки едет за курсором.
 */
export function WorkPage() {
  const { work } = useContent();
  const [active, setActive] = useState<string>("all");
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const label = (id: string) => work.categories.find((c) => c.id === id)?.label ?? id;
  const count = (id: string) => (id === "all" ? work.items.length : work.items.filter((p) => p.tags.includes(id)).length);
  const visible = work.items.filter((p) => active === "all" || p.tags.includes(active));

  // появление: заголовок по буквам, затем текст, фильтры и строки
  useGsap(root, ({ q }) => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap
        .timeline({ delay: 0.2 })
        .from(q(".work-title-char"), { yPercent: 115, stagger: 0.025, duration: 0.9, ease: "power4.out" })
        .from(q(".work-intro"), { y: 24, opacity: 0, duration: 0.8, ease: "power3.out" }, 0.3)
        .from(q(".work-filter"), { y: 16, opacity: 0, stagger: 0.04, duration: 0.6, ease: "power3.out" }, 0.4)
        .from(q(".work-row"), { y: 30, opacity: 0, stagger: 0.07, duration: 0.8, ease: "power3.out" }, 0.5);
    });

    // превью у курсора (только мышь)
    const el = preview.current!;
    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  });

  const show = (i: number | null) => {
    setHovered(i);
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    gsap.to(preview.current, {
      scale: i === null ? 0.6 : 1,
      autoAlpha: i === null ? 0 : 1,
      duration: i === null ? 0.25 : 0.45,
      ease: i === null ? "power2.out" : "back.out(1.6)",
      overwrite: "auto",
    });
  };

  // при смене фильтра строки мягко проявляются заново
  const pick = (id: string) => {
    if (id === active) return;
    setActive(id);
    show(null);
    requestAnimationFrame(() => {
      if (!window.matchMedia(MOTION_OK).matches) return;
      gsap.fromTo(
        root.current!.querySelectorAll(".work-row"),
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: "power3.out", overwrite: true },
      );
    });
  };

  const filters = [{ id: "all", label: work.all }, ...work.categories];

  return (
    <section ref={root} id="top" className="relative pt-[120px] pb-24 md:pt-[160px] md:pb-[140px]">
      <div className={WRAP}>
        <div className={INNER}>
          <h1 className="mb-6 text-[11vw] leading-[1.02] font-semibold tracking-[-0.03em] text-ink md:mb-8 md:text-[clamp(48px,6.4vw,96px)]">
            <SplitChars text={work.title} charClass="work-title-char" />
          </h1>
          <p className="work-intro max-w-[58ch] text-[16px] leading-[1.6] text-muted md:text-[18px]">{work.intro}</p>

          {/* фильтр: пилюли с числом проектов, выбранная залита чёрным */}
          <div role="group" aria-label={work.filterLabel} className="mt-12 flex flex-wrap gap-2 md:mt-20">
            {filters.map((f) => {
              const on = f.id === active;
              const n = count(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  disabled={n === 0}
                  onClick={() => pick(f.id)}
                  className={`work-filter inline-flex cursor-pointer items-center gap-[6px] rounded-full border px-4 py-[9px] text-[14px] leading-none font-medium whitespace-nowrap transition-colors duration-300 disabled:cursor-default disabled:opacity-40 md:text-[15px] ${
                    on ? "border-ink bg-ink text-cream" : "border-line text-ink hover:border-ink"
                  }`}
                >
                  {f.label}
                  <span className={`text-[12px] ${on ? "text-cream/60" : "text-muted"}`}>{n}</span>
                </button>
              );
            })}
          </div>

          {/* список */}
          <ul className="mt-8 border-t border-line md:mt-12" onPointerLeave={() => show(null)}>
            {visible.map((p) => {
              const i = work.items.indexOf(p);
              const live = Boolean(p.href);
              const Row = live ? "a" : "div";
              return (
                <li key={p.name} className="work-row">
                  <Row
                    {...(live ? { href: p.href } : { "aria-disabled": true })}
                    onPointerEnter={() => show(i)}
                    className={`group relative grid grid-cols-[1fr_44px] items-center gap-x-5 gap-y-3 overflow-hidden border-b border-line py-7 md:grid-cols-[120px_1.7fr_1.15fr_48px] md:py-9 ${
                      live ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    {/* заливка снизу вверх, как у карточек проектов на главной */}
                    <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-[#efe7e1] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-y-100" />

                    <span className="relative hidden text-[14px] text-muted tabular-nums md:block md:pl-4">
                      {p.years || String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="relative transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-x-2 max-md:pl-1">
                      <div className="text-[clamp(26px,3.2vw,44px)] leading-none font-medium tracking-[-0.025em] text-ink">{p.name}</div>
                      <div className="mt-3 flex flex-wrap gap-[6px]">
                        {p.tags.map((t) => (
                          <span key={t} className="rounded-full border border-line px-[10px] py-[4px] text-[12px] leading-none text-muted">
                            {label(t)}
                          </span>
                        ))}
                        {!live && (
                          <span className="rounded-full bg-ink/[6%] px-[10px] py-[4px] text-[12px] leading-none text-muted">{work.soon}</span>
                        )}
                      </div>
                    </div>

                    <div className="relative hidden md:block">
                      {p.result && <div className="text-[20px] leading-[1.15] font-medium tracking-[-0.02em] text-ink lg:text-[22px]">{p.result}</div>}
                      {p.resultNote && <div className="mt-1 text-[13px] leading-snug text-muted">{p.resultNote}</div>}
                    </div>

                    <span
                      aria-hidden
                      className={`relative grid size-11 place-items-center justify-self-end rounded-full border transition-colors duration-300 md:size-12 md:mr-4 ${
                        live ? "border-ink text-ink group-hover:bg-ink group-hover:text-cream" : "border-line text-line"
                      }`}
                    >
                      <span className="transition-transform duration-300 group-hover:-rotate-45">
                        <Arrow />
                      </span>
                    </span>
                    {live && <span className="sr-only">{work.open}</span>}
                  </Row>
                </li>
              );
            })}
          </ul>
          {visible.length === 0 && <p className="py-16 text-center text-muted">{work.empty}</p>}
        </div>
      </div>

      {/* превью обложки у курсора: все обложки лежат стопкой, видна только текущая */}
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-30 hidden aspect-[4/3] w-[min(26vw,360px)] overflow-hidden rounded-2xl border border-black/[6%] shadow-[0_22px_48px_rgba(36,36,36,0.16),0_7px_16px_rgba(36,36,36,0.08)] [container-type:size] md:block"
      >
        {work.items.map((p, i) => (
          <span key={p.name} className={`absolute inset-0 transition-opacity duration-300 ${hovered === i ? "opacity-100" : "opacity-0"}`}>
            <Cover item={p} items={work.items} />
          </span>
        ))}
      </div>
    </section>
  );
}
