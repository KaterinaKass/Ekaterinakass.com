"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { content } from "@/content";
import { testimonials as all } from "@/testimonials";
import { gsap, MOTION_OK, useGsap } from "@/lib/gsap";
import { SplitText } from "gsap/SplitText";
import { SplitChars } from "./SplitChars";

gsap.registerPlugin(SplitText);

const { testimonials: copy } = content;
/** Короче этого отзывы пока скрыты, чтобы все цитаты были примерно одного объёма. */
const MIN_LENGTH = 200;
const testimonials = all.filter((t) => t.text.length >= MIN_LENGTH);
const TOTAL = testimonials.length;
const pad = (n: number) => String(n).padStart(2, "0");
const PREVIEW = 248;

/** Первые PREVIEW символов по границе слова, с многоточием; короткие отзывы как есть. */
function preview(text: string) {
  if (text.length <= PREVIEW) return text;
  const cut = text.slice(0, PREVIEW + 1);
  const space = cut.lastIndexOf(" ");
  return cut.slice(0, space > 0 ? space : PREVIEW).replace(/[\s.,;:!?—–-]+$/, "") + "…";
}

/** Один размер для всех цитат: как у подзаголовка в блоке проектов (Projects.tsx), чуть крупнее на мобильном. */
const QUOTE_SIZE = "text-[18px] leading-[1.4] md:text-[clamp(18px,1.5vw,22px)] md:leading-[1.45]";

const initials = (name: string) =>
  name
    .split(" ")
    .filter((w) => /^[A-ZА-Я]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden className={dir === "prev" ? "rotate-180" : ""}>
      <path d="M2 2l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Отзывы с LinkedIn: заголовок и число отзывов сверху, цитата по центру, слева автор, справа счётчик и стрелки. */
export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const busy = useRef(false);
  const first = useRef(true);
  const t = testimonials[index];

  useGsap(root, ({ q }) => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const st = { trigger: root.current, start: "top 75%" };
      const tl = gsap.timeline({ scrollTrigger: st });
      tl.from(q(".reviews-char"), { yPercent: 115, stagger: 0.025, duration: 0.9, ease: "power4.out" })
        .from(q(".reviews-fade"), { y: 24, opacity: 0, stagger: 0.08, duration: 0.8, ease: "power3.out" }, 0.2)
        .from(q(".reviews-rule"), { scaleX: 0, transformOrigin: "left", duration: 1.2, ease: "expo.out" }, 0)
        .from(q(".reviews-vrule"), { scaleY: 0, transformOrigin: "top", duration: 1.2, ease: "power2.out", stagger: 0.1 }, 0);
    });
  });

  // Цитата делится на строки внутри масок, строки выезжают снизу — как буквы заголовков на сайте.
  // Первый раз — по скроллу, при смене отзыва — сразу; при «Show more» текст просто перестраивается.
  const shownIndex = useRef(index);
  useLayoutEffect(() => {
    const el = root.current!;
    const text = el.querySelector<HTMLElement>("[data-current] .reviews-text");
    if (!text || !window.matchMedia(MOTION_OK).matches) return;
    const isFirst = first.current;
    const changed = shownIndex.current !== index;
    first.current = false;
    shownIndex.current = index;
    const more = el.querySelector("[data-current] .reviews-more");
    let extra: gsap.core.Timeline | undefined;
    const split = SplitText.create(text.querySelectorAll("p"), {
      type: "lines",
      mask: "lines",
      linesClass: "reviews-line",
      autoSplit: true,
      onSplit(self) {
        if (!isFirst && !changed) return;
        return gsap.from(self.lines, {
          yPercent: 110,
          stagger: 0.07,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: isFirst ? { trigger: el, start: "top 75%", once: true } : undefined,
        });
      },
    });
    if (changed) {
      extra = gsap.timeline();
      extra
        .fromTo(el.querySelectorAll(".reviews-person > *"), { y: 16, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.6, ease: "power3.out" }, 0.1)
        .fromTo(el.querySelector(".reviews-current"), { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: "power3.out" }, 0);
      if (more) extra.fromTo(more, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.35);
    }
    return () => {
      extra?.kill();
      split.revert();
    };
  }, [index, expanded]);

  const go = (step: number) => {
    if (busy.current) return;
    busy.current = true;
    const next = (index + step + TOTAL) % TOTAL;
    const el = root.current!;
    if (!window.matchMedia(MOTION_OK).matches) {
      busy.current = false;
      setExpanded(false);
      setIndex(next);
      return;
    }
    // старые строки уезжают вверх в свои маски, автор и кнопка гаснут
    const out = el.querySelectorAll(".reviews-person, [data-current] .reviews-more");
    gsap
      .timeline({
        onComplete: () => {
          gsap.set(out, { clearProps: "opacity,transform" });
          busy.current = false;
          setExpanded(false);
          setIndex(next);
        },
      })
      .to(el.querySelectorAll("[data-current] .reviews-line"), { yPercent: -110, stagger: 0.03, duration: 0.4, ease: "power3.in" }, 0)
      .to(out, { opacity: 0, y: -12, duration: 0.3, ease: "power2.in" }, 0);
  };

  // свайп на тач-экранах
  const touchX = useRef<number | null>(null);

  return (
    <section
      ref={root}
      id="reviews"
      className="relative z-10 w-full bg-ink pt-[10vh] pb-24 text-cream"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="relative mx-auto grid w-[90%] grid-cols-1 md:grid-cols-[1fr_2fr_1fr]">
        {/* верхний ряд: заголовок и число отзывов */}
        <div className="hidden md:block" />
        <div className="px-6 pb-10 md:px-[clamp(24px,3vw,48px)] md:pb-16">
          {/* шрифт как в блоке «10+ years of shaping»: обычный гротеск, ключевая часть полужирная */}
          {/* размеры и начертания как в блоке «10+ years of shaping» (Statement.tsx):
              мобильный — жирное слово отдельной строкой, остальное 9.8vw; десктоп — всё clamp(32px,5vw,64px).
              В 10+ years жирное 17.8vw, но длинное «Recommended» в таком размере шире экрана, поэтому 10.8vw */}
          <h2 className="text-[9.8vw] leading-[1.08] font-normal text-cream md:text-[clamp(32px,5vw,64px)] md:leading-[1.14]">
            <span className="block text-[10.8vw] leading-none font-semibold md:text-[length:inherit] md:leading-[inherit]">
              <SplitChars text={copy.title[0]} charClass="reviews-char" />
            </span>
            <span className="block">
              <SplitChars text={copy.title[1]} charClass="reviews-char" />
            </span>
          </h2>
        </div>
        <a
          href={copy.href}
          target="_blank"
          rel="noopener noreferrer"
          className="reviews-fade group flex items-end gap-3 px-6 pb-10 md:flex-col md:items-start md:gap-2 md:px-[clamp(24px,3vw,48px)] md:pb-16"
        >
          <span className="text-[28px] leading-none text-cream/60 transition-colors group-hover:text-cream md:text-[clamp(28px,2.4vw,40px)]">{all.length}</span>
          <span className="max-w-[200px] pb-0.5 text-[16px] leading-[1.25] text-cream/50 transition-colors group-hover:text-cream md:text-[18px]">
            {copy.countLabel} <span aria-hidden>↗</span>
          </span>
        </a>

        <span className="reviews-rule col-span-full h-px bg-[#5a5a5a]" />

        {/* автор: на десктопе слева сверху, сразу под кавычками */}
        <div className="order-3 px-6 pt-8 md:order-none md:px-[clamp(24px,3vw,48px)] md:pt-14">
          <svg className="reviews-fade mb-8 hidden text-accent md:block" width="36" height="28" viewBox="0 0 36 28" fill="currentColor" aria-hidden>
            <path d="M0 16.5C0 7.9 4.9 1.9 13.3 0l1.4 3.6C9.9 5.2 7.5 8.3 7.2 12.4H14V28H0V16.5Zm21 0C21 7.9 25.9 1.9 34.3 0l1.4 3.6c-4.8 1.6-7.2 4.7-7.5 8.8H35V28H21V16.5Z" />
          </svg>
          <div className="reviews-person reviews-fade flex items-center gap-4">
            {t.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.photo} alt="" width={56} height={56} className="size-14 shrink-0 rounded-xl object-cover" />
            ) : (
              <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-cream text-[18px] font-semibold text-ink">
                {initials(t.name)}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-[18px] leading-tight font-medium text-cream">{t.name}</p>
              <p className="mt-1 text-[14px] leading-snug text-cream/50">{t.role}</p>
            </div>
          </div>
        </div>

        {/* цитата */}
        {/* все цитаты лежат в одной ячейке грида, видна только текущая: высота блока = самой длинной,
            поэтому при переключении страница не прыгает (на мобильном только текущая, иначе под короткими пусто) */}
        <blockquote className="reviews-quote relative order-2 grid px-6 pt-8 text-cream md:order-none md:px-[clamp(24px,3vw,48px)] md:pt-14 md:pb-16">
          {testimonials.map((item, k) => {
            const current = k === index;
            const long = item.text.length > PREVIEW;
            const open = current && expanded;
            const text = open ? item.text : preview(item.text);
            return (
              <div
                key={k}
                aria-hidden={!current}
                data-current={current || undefined}
                className={`[grid-area:1/1] ${QUOTE_SIZE} ${current ? "" : "invisible max-md:hidden"}`}
              >
                {/* key меняется вместе с текстом: React пересоздаёт блок целиком, а не правит строки, которые нарезал SplitText */}
                <div key={current ? `c${k}${open ? "o" : ""}` : "n"} className="reviews-text">
                  {text.split("\n\n").map((para, p) => (
                    <p key={p} className="mb-[0.6em] last:mb-0">
                      {para}
                    </p>
                  ))}
                </div>
                {long && (
                  <button
                    type="button"
                    tabIndex={current ? 0 : -1}
                    onClick={() => setExpanded((v) => !v)}
                    aria-expanded={open}
                    className="reviews-more mt-6 flex cursor-pointer items-center gap-2 text-[16px] leading-none text-cream/60 transition-colors hover:text-cream md:text-[18px]"
                  >
                    {open ? copy.less : copy.more}
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
                      <path d="M1 1.5l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </blockquote>

        {/* счётчик и стрелки */}
        <div className="order-4 flex items-center justify-between px-6 pt-10 md:order-none md:flex-col md:items-start md:justify-start md:gap-8 md:px-[clamp(24px,3vw,48px)] md:pt-14">
          <p className="reviews-fade flex items-baseline text-[20px] leading-none text-cream/60 md:text-[clamp(20px,1.6vw,26px)]" aria-live="polite">
            <span className="inline-flex overflow-hidden">
              <span key={index} className="reviews-current inline-block">{pad(index + 1)}</span>
            </span>
            <span className="text-cream/35">&nbsp;/&nbsp;{TOTAL}</span>
          </p>
          <div className="reviews-fade flex gap-3">
            {(["prev", "next"] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => go(dir === "prev" ? -1 : 1)}
                aria-label={copy[dir]}
                className="grid size-12 cursor-pointer place-items-center rounded-full border border-cream/60 text-cream transition-colors hover:border-cream hover:bg-cream hover:text-ink"
              >
                <Arrow dir={dir} />
              </button>
            ))}
          </div>
        </div>

        <span className="reviews-rule order-5 col-span-full mt-10 h-px bg-[#5a5a5a] md:mt-0" />

        {/* вертикальные разделители колонок (десктоп) */}
        <span className="reviews-vrule pointer-events-none absolute inset-y-0 left-1/4 hidden w-px bg-[#5a5a5a] md:block" />
        <span className="reviews-vrule pointer-events-none absolute inset-y-0 left-3/4 hidden w-px bg-[#5a5a5a] md:block" />
      </div>
    </section>
  );
}
