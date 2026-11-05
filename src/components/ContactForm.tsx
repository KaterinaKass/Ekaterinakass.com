"use client";

import { useEffect, useRef, useSyncExternalStore, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { content } from "@/content";
import { gsap } from "@/lib/gsap";
import { lockScroll } from "@/lib/scroll";

const { contactForm: t, contact } = content;
const noop = () => () => {};
const EASE = "expo.out"; // тот же, что у кнопки меню

// подписи — тот же стиль, что у подписей в кейсах (CaseUI: 12/13px, medium, uppercase, разрядка 0.08em)
const labelBase = "flex shrink-0 flex-col gap-2 text-[12px] font-medium tracking-[0.08em] uppercase md:text-[13px]";
// поля — основной текст сайта (16px, без разрядки); normal-case/tracking-normal сбрасывают стиль подписи
const fieldBase = "w-full normal-case tracking-normal font-normal rounded-xl border bg-transparent px-4 py-3 text-[16px] outline-none transition-colors";

// dark — светлый текст на синем/чёрном (всплывающая форма), light — тёмный текст на белом (страница About)
const TONE = {
  dark: {
    label: `${labelBase} text-cream/70`,
    field: `${fieldBase} border-cream/25 text-cream placeholder:text-cream/40 focus:border-cream`,
  },
  light: {
    label: `${labelBase} text-muted`,
    field: `${fieldBase} border-line text-ink placeholder:text-ink/35 focus:border-accent`,
  },
} as const;

/** Отправка: открывает почтовый клиент с готовым письмом (бэкенда у сайта нет). */
export function submitContact(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const d = new FormData(e.currentTarget);
  const subject = `${d.get("subject")} — ${d.get("name")}`;
  const text = `${d.get("message")}\n\n${d.get("name")}\n${d.get("email")}`;
  window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
}

/** Поля формы и кнопка — общие для всплывающей формы и формы на странице About. tone: "dark" — для синего/чёрного фона, "light" — для белого. */
export function ContactFields({ itemClass = "", tone = "dark" }: { itemClass?: string; tone?: keyof typeof TONE }) {
  const { label, field } = TONE[tone];
  return (
    <>
      <label className={`${label} ${itemClass}`}>
        {t.name}
        <input name="name" required autoComplete="name" placeholder="Jane Doe" className={field} />
      </label>

      <label className={`${label} ${itemClass}`}>
        {t.email}
        <input name="email" type="email" required autoComplete="email" placeholder="janedoe@company.com" className={field} />
      </label>

      <label className={`${label} ${itemClass}`}>
        {t.subject}
        <span className="relative">
          <select name="subject" defaultValue={t.subjects[0]} className={`${field} appearance-none pr-10`}>
            {t.subjects.map((s) => (
              <option key={s} value={s} className="text-ink">
                {s}
              </option>
            ))}
          </select>
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </label>

      <label className={`${label} ${itemClass}`}>
        {t.message}
        <textarea name="message" required rows={5} placeholder="A few lines about what you have in mind..." className={`${field} resize-none`} />
      </label>

      <button
        type="submit"
        // размеры и шрифт — как у CTA-кнопок сайта (ShippedWork), цвет и обводка — как у кнопки меню
        className={`${itemClass} mt-2 flex shrink-0 items-center justify-center rounded-full border border-[#0C6CB6] bg-accent px-6 py-[14px] text-[16px] leading-none font-medium text-cream transition-transform duration-200 hover:scale-[1.04]`}
      >
        {t.send}
      </button>
    </>
  );
}

/**
 * Форма «Start a conversation» поверх сайта.
 * Анимация как у мобильного меню (Chrome.tsx → MenuPill): фон темнеет с блюром, снизу внутри карточки
 * поднимается чёрный круг и заливает её, затем поля по очереди всплывают.
 * Мобильный — на весь экран, десктоп — карточка по центру.
 * Отправка: открывает почтовый клиент с готовым письмом (бэкенда у сайта нет).
 */
export function ContactForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  // портал в body: у футера свой слой (z-10), внутри него модалка оказалась бы под рамками и меню
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const wrap = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const circle = useRef<HTMLSpanElement>(null);
  const skin = useRef<HTMLSpanElement>(null);
  const body = useRef<HTMLFormElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const first = useRef(true);

  useEffect(() => {
    if (!mounted) return;
    if (first.current) {
      first.current = false;
      if (!open) return;
    }
    const items = body.current!.querySelectorAll(".cf-item");
    tl.current?.kill();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const k = reduce ? 0 : 1;
    const t2 = gsap.timeline();

    if (open) {
      lockScroll(true);
      gsap.set(wrap.current, { display: "flex" });
      gsap.set(items, { opacity: 0, y: 16 });
      gsap.set(skin.current, { clearProps: "backgroundColor" });
      t2.to(backdrop.current, { opacity: 1, duration: 0.35 * k }, 0)
        .fromTo(card.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 * k, ease: EASE }, 0)
        .fromTo(circle.current, { bottom: "-200%" }, { bottom: "-60%", duration: 0.8 * k, ease: EASE }, 0.1 * k)
        .to(skin.current, { backgroundColor: "#242424", duration: 0.2 * k }, 0.35 * k)
        .to(items, { opacity: 1, y: 0, duration: 0.5 * k, ease: EASE, stagger: 0.06 * k }, 0.4 * k)
        .call(() => body.current?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true }));
    } else {
      t2.to(items, { opacity: 0, duration: 0.15 * k }, 0)
        .set(skin.current, { clearProps: "backgroundColor" }, 0.1 * k)
        .to(circle.current, { bottom: "-200%", duration: 0.6 * k, ease: "power3.in" }, 0.05 * k)
        .to(card.current, { y: 40, opacity: 0, duration: 0.4 * k, ease: "power3.in" }, 0.3 * k)
        .to(backdrop.current, { opacity: 0, duration: 0.3 * k }, 0.35 * k)
        .set(wrap.current, { display: "none" })
        .call(() => lockScroll(false));
    }
    tl.current = t2;
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => () => lockScroll(false), []);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={wrap}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cf-title"
      className="fixed inset-0 z-[80] hidden items-stretch justify-center md:items-center"
    >
      <div ref={backdrop} onClick={onClose} className="absolute inset-0 bg-black/30 opacity-0 backdrop-blur-sm" />

      <div
        ref={card}
        className="relative isolate flex w-full flex-col overflow-hidden text-cream md:w-[min(560px,90vw)] md:rounded-[24px] md:shadow-[0_20px_60px_rgba(0,0,0,.25)]"
      >
        {/* синий слой с обводкой, как у кнопки меню; под кругом перекрашивается в чёрный */}
        <span ref={skin} aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] bg-accent" />
        <span
          ref={circle}
          aria-hidden
          className="pointer-events-none absolute left-1/2 z-0 h-[200%] w-[260%] -translate-x-1/2 rounded-[50%] bg-ink"
          style={{ bottom: "-200%" }}
        />

        <form
          ref={body}
          onSubmit={submitContact}
          data-lenis-prevent
          className="relative z-10 flex max-h-svh flex-1 flex-col gap-5 overflow-y-auto px-6 pt-8 pb-10 md:max-h-[90svh] md:p-10"
        >
          <div className="cf-item flex shrink-0 items-start justify-between gap-6">
            <h2 id="cf-title" className="font-display text-[32px] leading-none uppercase">
              {t.title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className="relative mt-1 block size-8 shrink-0 transition-opacity hover:opacity-70"
            >
              <span className="absolute top-1/2 left-1 h-[1.5px] w-6 rotate-45 bg-cream" />
              <span className="absolute top-1/2 left-1 h-[1.5px] w-6 -rotate-45 bg-cream" />
            </button>
          </div>

          <ContactFields itemClass="cf-item" />
        </form>
      </div>
    </div>,
    document.body,
  );
}
