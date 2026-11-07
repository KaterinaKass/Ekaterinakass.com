"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode, type Ref } from "react";
import { createPortal } from "react-dom";
import { content } from "@/content";
import { useContent } from "@/i18n/LocaleProvider";
import { gsap } from "@/lib/gsap";
import { lockScroll } from "@/lib/scroll";
import { EMAIL_RE, suggestEmail } from "@/lib/validateEmail";

const { contact } = content;
const noop = () => () => {};
const EASE = "expo.out"; // тот же, что у кнопки меню

// подписи — тот же стиль, что у подписей в кейсах (CaseUI: 12/13px, medium, uppercase, разрядка 0.08em)
const labelBase = "text-[12px] font-medium tracking-[0.08em] uppercase md:text-[13px]";
// поля — основной текст сайта (16px, без разрядки)
const fieldBase = "w-full rounded-xl border bg-transparent px-4 py-3 text-[16px] outline-none transition-colors";

// dark — светлый текст на синем/чёрном (всплывающая форма), light — тёмный текст на белом (страница About).
// Подсказка-ошибка — «облачко» контрастного цвета (кремовое на чёрном, чёрное на белом), как пузырь у курсора и Hello в первом экране.
const TONE = {
  dark: {
    label: `${labelBase} text-cream/70`,
    field: `${fieldBase} text-cream placeholder:text-cream/40`,
    ok: "border-cream/25 focus:border-cream",
    bad: "border-error focus:border-error",
    tip: "bg-cream text-ink",
    tipLink: "text-ink",
  },
  light: {
    label: `${labelBase} text-muted`,
    field: `${fieldBase} text-ink placeholder:text-ink/35`,
    ok: "border-line focus:border-accent",
    bad: "border-error focus:border-error",
    tip: "bg-ink text-cream",
    tipLink: "text-cream",
  },
} as const;
type Tone = keyof typeof TONE;

type Field = "name" | "email" | "message";
const FIELDS: Field[] = ["name", "email", "message"];
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "sent" | "failed";

/** Значок в облачке: круг цвета ошибки с восклицательным знаком (или синий с «i» для подсказки), линии как у крестика закрытия. */
function TipIcon({ kind }: { kind: "error" | "hint" }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="mt-[1px] size-[18px] shrink-0">
      <circle cx="10" cy="10" r="10" className={kind === "error" ? "fill-error" : "fill-accent"} />
      {kind === "error" ? (
        <>
          <path d="M10 5.5v5.5" stroke="#f7f1ed" strokeWidth="1.75" strokeLinecap="round" />
          <circle cx="10" cy="14.25" r="1.1" fill="#f7f1ed" />
        </>
      ) : (
        <>
          <circle cx="10" cy="5.75" r="1.1" fill="#f7f1ed" />
          <path d="M10 9v5.5" stroke="#f7f1ed" strokeWidth="1.75" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/** Облачко под полем со стрелкой вверх, к полю. Появляется с коротким подъёмом (cf-tip в globals.css). */
function Tip({ id, tone, kind = "error", children }: { id?: string; tone: Tone; kind?: "error" | "hint"; children: ReactNode }) {
  return (
    <div
      id={id}
      className={`cf-tip relative mt-3 flex items-start gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-[14px] leading-[1.35] font-medium ${TONE[tone].tip}`}
    >
      <span aria-hidden className="absolute -top-[5px] left-5 size-2.5 rotate-45 rounded-[2px] bg-inherit" />
      <TipIcon kind={kind} />
      <span className="min-w-0">{children}</span>
    </div>
  );
}

function check(field: Field, value: string, t: ReturnType<typeof useContent>["contactForm"]): string | undefined {
  const v = value.trim();
  if (field === "email") return !v ? t.errors.emailEmpty : EMAIL_RE.test(v) ? undefined : t.errors.email;
  return v ? undefined : t.errors[field];
}

/**
 * Форма заявки — общая для всплывающего окна и страницы About. tone: "dark" — для синего/чёрного фона, "light" — для белого.
 * Проверка полей по схеме «ругать поздно, хвалить рано» (Smashing Magazine, Baymard, GOV.UK):
 * — пока человек печатает, ошибок нет;
 * — неверная почта подсвечивается, когда ушли с поля; пустые поля — только после нажатия «Send»;
 * — как только поле с ошибкой исправлено, ошибка сразу исчезает (проверка на каждом вводе);
 * — при отправке с ошибками фокус уходит в первое неверное поле.
 * Отправка — POST /api/contact (письмо Кате через Resend), без перехода в почтовую программу.
 */
export function ContactFormBody({
  tone = "dark",
  itemClass = "",
  className = "",
  formRef,
  header,
  lenisPrevent,
}: {
  tone?: Tone;
  itemClass?: string;
  className?: string;
  formRef?: Ref<HTMLFormElement>;
  header?: ReactNode;
  /** внутри всплывающего окна: прокрутка колесом идёт по форме, а не по странице (Lenis) */
  lenisPrevent?: boolean;
}) {
  const t = useContent().contactForm;
  const T = TONE[tone];
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const [errors, setErrors] = useState<Errors>({});
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const emailInput = useRef<HTMLInputElement>(null);

  const setError = (f: Field, msg: string | undefined) => setErrors((e) => (e[f] === msg ? e : { ...e, [f]: msg }));

  // уход с поля: непустое неверное значение — сразу ошибка; пустое не трогаем (ругаем за пустоту только при отправке)
  const onBlur = (f: Field, value: string) => {
    if (value.trim() || errors[f]) setError(f, check(f, value, t));
    if (f === "email") setSuggestion(EMAIL_RE.test(value.trim()) ? suggestEmail(value.trim()) : null);
  };
  // ввод: если ошибка уже показана — проверяем заново, чтобы она пропала, как только всё верно
  const onInput = (f: Field, value: string) => {
    if (errors[f]) setError(f, check(f, value, t));
    if (f === "email" && suggestion) setSuggestion(null);
  };

  const applySuggestion = () => {
    if (!suggestion || !emailInput.current) return;
    emailInput.current.value = suggestion;
    setSuggestion(null);
    setError("email", undefined);
    emailInput.current.focus();
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const d = new FormData(form);
    const next: Errors = {};
    for (const f of FIELDS) next[f] = check(f, String(d.get(f) ?? ""), t);
    setErrors(next);
    const firstBad = FIELDS.find((f) => next[f]);
    if (firstBad) {
      form.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(d)),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setSuggestion(null);
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  const fieldClass = (f: Field) => `${T.field} ${errors[f] ? T.bad : T.ok}`;
  const describedBy = (f: Field) => (errors[f] ? id(`${f}-err`) : f === "email" && suggestion ? id("email-hint") : undefined);
  const errorTip = (f: Field) =>
    errors[f] ? (
      <Tip id={id(`${f}-err`)} tone={tone}>
        {errors[f]}
      </Tip>
    ) : null;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate data-lenis-prevent={lenisPrevent || undefined} className={className}>
      {header}

      {status === "sent" ? (
        <div role="status" className={`${itemClass} flex shrink-0 flex-col items-start gap-3 py-6`}>
          <p className="font-display text-[28px] leading-none uppercase">{t.sent.title}</p>
          <p className={`max-w-[40ch] text-[16px] leading-[1.5] ${tone === "dark" ? "text-cream/70" : "text-muted"}`}>{t.sent.text}</p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-3 text-[16px] font-medium underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
          >
            {t.sent.again}
          </button>
        </div>
      ) : (
        <>
          {/* ловушка для ботов: людям не видна, бот заполнит — сервер молча отбросит письмо */}
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

          <div className={`flex shrink-0 flex-col ${itemClass}`}>
            <label htmlFor={id("name")} className={`${T.label} mb-2`}>
              {t.name}
            </label>
            <input
              id={id("name")}
              name="name"
              autoComplete="name"
              placeholder={t.placeholders.name}
              aria-invalid={!!errors.name}
              aria-describedby={describedBy("name")}
              onBlur={(e) => onBlur("name", e.target.value)}
              onInput={(e) => onInput("name", e.currentTarget.value)}
              className={fieldClass("name")}
            />
            {errorTip("name")}
          </div>

          <div className={`flex shrink-0 flex-col ${itemClass}`}>
            <label htmlFor={id("email")} className={`${T.label} mb-2`}>
              {t.email}
            </label>
            <input
              ref={emailInput}
              id={id("email")}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder={t.placeholders.email}
              aria-invalid={!!errors.email}
              aria-describedby={describedBy("email")}
              onBlur={(e) => onBlur("email", e.target.value)}
              onInput={(e) => onInput("email", e.currentTarget.value)}
              className={fieldClass("email")}
            />
            {errorTip("email")}
            {!errors.email && suggestion && (
              <Tip id={id("email-hint")} tone={tone} kind="hint">
                {t.didYouMean}{" "}
                <button
                  type="button"
                  onClick={applySuggestion}
                  className={`font-semibold underline decoration-1 underline-offset-[3px] transition-opacity hover:opacity-70 ${T.tipLink}`}
                >
                  {suggestion}
                </button>
                ?
              </Tip>
            )}
          </div>

          <div className={`flex shrink-0 flex-col ${itemClass}`}>
            <label htmlFor={id("subject")} className={`${T.label} mb-2`}>
              {t.subject}
            </label>
            <span className="relative">
              <select id={id("subject")} name="subject" defaultValue={t.subjects[0]} className={`${T.field} ${T.ok} appearance-none pr-10`}>
                {t.subjects.map((s) => (
                  <option key={s} value={s} className="text-ink">
                    {s}
                  </option>
                ))}
              </select>
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className={`pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 ${tone === "dark" ? "text-cream" : "text-ink"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>

          <div className={`flex shrink-0 flex-col ${itemClass}`}>
            <label htmlFor={id("message")} className={`${T.label} mb-2`}>
              {t.message}
            </label>
            <textarea
              id={id("message")}
              name="message"
              rows={5}
              placeholder={t.placeholders.message}
              aria-invalid={!!errors.message}
              aria-describedby={describedBy("message")}
              onBlur={(e) => onBlur("message", e.target.value)}
              onInput={(e) => onInput("message", e.currentTarget.value)}
              className={`${fieldClass("message")} resize-none`}
            />
            {errorTip("message")}
          </div>

          <div className={`mt-2 flex shrink-0 flex-col ${itemClass}`}>
            <button
              type="submit"
              disabled={status === "sending"}
              aria-busy={status === "sending"}
              // размеры и шрифт — как у CTA-кнопок сайта (ShippedWork), цвет и обводка — как у кнопки меню
              className="flex items-center justify-center rounded-full border border-[#0C6CB6] bg-accent px-6 py-[14px] text-[16px] leading-none font-medium text-cream transition-[transform,opacity] duration-200 hover:scale-[1.04] disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100"
            >
              {status === "sending" ? t.sending : t.send}
            </button>
            {status === "failed" && (
              <div role="alert">
                <Tip tone={tone}>
                  {t.failed}{" "}
                  <a href={`mailto:${contact.email}`} className={`underline decoration-1 underline-offset-[3px] ${T.tipLink}`}>
                    {contact.email}
                  </a>
                </Tip>
              </div>
            )}
          </div>
        </>
      )}
    </form>
  );
}

/**
 * Форма «Start a conversation» поверх сайта.
 * Анимация как у мобильного меню (Chrome.tsx → MenuPill): фон темнеет с блюром, снизу внутри карточки
 * поднимается чёрный круг и заливает её, затем поля по очереди всплывают.
 * Мобильный — на весь экран, десктоп — карточка по центру.
 * Отправка — письмом через /api/contact; после закрытия форма сбрасывается (ошибки, «Спасибо»).
 */
export function ContactForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useContent().contactForm;
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
  const [resetKey, setResetKey] = useState(0);

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
        .call(() => {
          lockScroll(false);
          setResetKey((k) => k + 1);
        });
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

        <ContactFormBody
          key={resetKey}
          formRef={body}
          itemClass="cf-item"
          lenisPrevent
          className="relative z-10 flex max-h-svh flex-1 flex-col gap-5 overflow-y-auto px-6 pt-8 pb-10 md:max-h-[90svh] md:p-10"
          header={
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
          }
        />
      </div>
    </div>,
    document.body,
  );
}
