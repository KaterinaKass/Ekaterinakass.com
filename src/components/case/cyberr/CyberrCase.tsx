"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { gsap, MOTION_OK, ScrollTrigger } from "@/lib/gsap";
import { scrollToY } from "@/lib/scroll";
import { BackLink, Figure, Label, Words, type Img } from "../CaseUI";
import { FigureVideo, type Vid } from "../FigureVideo";
import { useCaseReveal } from "../useCaseReveal";

export type CaseView = "summary" | "full";

type NavItem = { id: string; label: string };

/** Всё, чем кейсы Cyberr отличаются друг от друга: шапка, обложка, меню и тексты двух видов. */
export type CaseData = {
  header: { eyebrow: [string, string]; title: string; meta: { label: string; value: string }[] };
  hero: Img | Vid;
  nav: Record<CaseView, NavItem[]>;
  scriptsHref?: string;
};

const VIEWS: { id: CaseView; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "full", label: "Full Case Study" },
];

/** Переключатель видов: чёрная плашка переезжает под выбранный пункт. */
function ViewToggle({ view, onChange }: { view: CaseView; onChange: (v: CaseView) => void }) {
  return (
    <div role="tablist" aria-label="Case study view" className="relative grid h-12 grid-cols-2 rounded-full border border-ink/80 bg-cream/85 p-1 shadow-[0_6px_24px_rgba(0,0,0,.06)] backdrop-blur-md md:h-11">
      <span
        aria-hidden
        className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
          view === "full" ? "translate-x-full" : ""
        }`}
      />
      {VIEWS.map((v) => (
        <button
          key={v.id}
          role="tab"
          aria-selected={view === v.id}
          onClick={() => onChange(v.id)}
          className={`relative z-10 rounded-full px-5 text-[14px] whitespace-nowrap transition-colors duration-500 md:px-6 md:text-[15px] ${
            view === v.id ? "text-cream" : "text-ink hover:text-ink/60"
          }`}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}

/** Страница кейса Cyberr: общий заголовок, переключатель Summary / Full Case Study, боковое меню разделов. */
export function CyberrCase({ initialView, data, summary, full }: { initialView: CaseView; data: CaseData; summary: ReactNode; full: ReactNode }) {
  const { header, hero, nav, scriptsHref } = data;
  const [view, setView] = useState<CaseView>(initialView);
  const [active, setActive] = useState("overview");
  const headerRef = useRef<HTMLElement>(null);
  const viewsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const switching = useRef(false);

  // после смены вида возвращаемся к началу контента, если ушли ниже
  useLayoutEffect(() => {
    if (!switching.current) return;
    switching.current = false;
    gsap.set(contentRef.current, { clearProps: "opacity,transform" });
    const top = viewsRef.current!.getBoundingClientRect().top + window.scrollY - 24;
    if (window.scrollY > top) scrollToY(top, true);
  }, [view]);

  useCaseReveal(headerRef);
  useCaseReveal(contentRef, view);

  // заголовок скрыт до загрузки JS (js-intro), чтобы не мигал перед анимацией
  useLayoutEffect(() => {
    gsap.set(headerRef.current!.querySelector(".js-intro"), { visibility: "visible" });
  }, []);

  // подсветка текущего раздела в боковом меню
  useLayoutEffect(() => {
    const triggers = gsap.utils.toArray<HTMLElement>("[data-spy]").map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: (self) => self.isActive && setActive(el.dataset.spy!),
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, [view]);

  const changeView = (v: CaseView) => {
    if (v === view) return;
    const url = v === "full" ? "?view=full" : window.location.pathname;
    window.history.replaceState(null, "", url);
    const swap = () => {
      switching.current = true;
      setActive("overview");
      setView(v);
    };
    if (window.matchMedia(MOTION_OK).matches)
      gsap.to(contentRef.current, { opacity: 0, y: 16, duration: 0.3, ease: "power2.in", onComplete: swap });
    else swap();
  };

  const items = nav[view];

  return (
    <article className="relative z-10 bg-cream">
      <header ref={headerRef} id="overview" data-spy="overview" className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />

        <div className="js-intro relative">
          {/* та же линия и высота, что у подписи и кнопки Menu на главной */}
          <div className="absolute top-6 left-[calc(5%+16px)] lg:top-8 lg:left-[calc(5%+24px)]">
            <BackLink href="/#shipped">Back to work</BackLink>
          </div>

          {/* как в референсе: слева заголовок, справа карточки 2×2 */}
          <div className="mx-[5%] grid gap-12 px-4 pt-32 md:px-[clamp(24px,3.5vw,56px)] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-[clamp(40px,5vw,96px)] lg:pt-44">
            <div>
              <p className="rv mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium tracking-[0.1em] text-accent uppercase md:text-[14px]">
                <span>{header.eyebrow[0]}</span>
                <span aria-hidden className="size-1 rounded-full bg-accent" />
                <span>{header.eyebrow[1]}</span>
              </p>
              <h1 className="rv-words font-display text-[clamp(32px,4.4vw,76px)] leading-[0.98] text-ink uppercase">
                <Words text={header.title} />
              </h1>
            </div>

            <dl className="grid grid-cols-1 gap-3 self-start sm:grid-cols-2 md:gap-4">
              {header.meta.map((m) => (
                <div key={m.label} className="rv rounded-[20px] border border-line/70 bg-white/45 p-5 md:p-6">
                  <dt className="mb-3 text-[12px] font-medium tracking-[0.08em] text-muted uppercase md:text-[13px]">{m.label}</dt>
                  <dd className="text-[15px] leading-[1.45] text-ink md:text-[16px]">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mx-[5%] mt-10 lg:mt-14">
            {"video" in hero ? (
              <FigureVideo img={hero} priority sizes="(min-width: 768px) 90vw, 100vw" className="md:rounded-[28px]!" />
            ) : (
              <Figure img={hero} priority sizes="(min-width: 768px) 90vw, 100vw" className="md:rounded-[28px]!" />
            )}
          </div>
        </div>
      </header>

      <div ref={viewsRef} className="relative mx-[5%] px-4 pt-12 pb-28 md:px-[clamp(24px,3.5vw,56px)] md:pt-16 md:pb-40">
        <div className="sticky top-4 z-30 mb-16 flex justify-center lg:top-8 lg:mb-24">
          <ViewToggle view={view} onChange={changeView} />
        </div>

        <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-[clamp(40px,6vw,120px)]">
          {/* боковое меню разделов, как в референсе */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <Label className="mb-4">On this page</Label>
              <nav className="flex flex-col border-l border-line">
                {items.map((it) => (
                  <a
                    key={it.id}
                    href={`#${it.id}`}
                    className={`relative -ml-px border-l py-[7px] pl-4 text-[15px] transition-colors duration-300 ${
                      active === it.id ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
                    }`}
                  >
                    {it.label}
                  </a>
                ))}
              </nav>

              {scriptsHref && (
              <Link
                href={scriptsHref}
                className="group mt-10 flex items-center gap-3 rounded-[16px] border border-line/70 bg-white/45 p-3 pr-4 transition-colors hover:border-ink/40"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-cream">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M4 1.5h5.5L12.5 4.5V14.5H4z M9 1.5V5h3.5 M6.5 8.5h4 M6.5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="leading-tight">
                  <span className="block text-[14px] font-medium text-ink">Research scripts</span>
                  <span className="block text-[12px] text-muted">Interviews & usability tests</span>
                </span>
              </Link>
              )}
            </div>
          </aside>

          <div ref={contentRef} className="max-w-[880px] min-w-0">
            {view === "summary" ? summary : full}
          </div>
        </div>
      </div>
    </article>
  );
}
