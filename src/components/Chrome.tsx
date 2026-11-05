"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { content } from "@/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ContactForm } from "./ContactForm";

/** Две вертикальные линии-рамки поверх всей страницы — на мобильном и на десктопе, как в референсе.
 *  При загрузке вырастают сверху вниз (анимация .frame-line в globals.css). Стоят на 5%, как края сетки проектов и футера. */
export function FrameLines() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-y-0 left-[5%] right-[5%] z-40">
      <span className="frame-line absolute inset-y-0 left-0 w-px bg-[#ACACAC]" />
      <span className="frame-line absolute inset-y-0 right-0 w-px bg-[#ACACAC]" />
    </div>
  );
}

/** Копирует текст в буфер; запасной путь для браузеров без Clipboard API. */
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

/** Якоря (#…) получают префикс страницы, ссылки на другие страницы (/about) идут как есть. */
const menuHref = (base: string, href: string) => (href.startsWith("/") ? href : base + href);

const DESKTOP_MQ = "(min-width: 1024px)";
const EASE = "expo.out"; // близко к cubic-bezier(.22, 1, .36, 1)

/**
 * Синяя кнопка «Menu».
 * Десктоп (lg): в правом верхнем углу на одной линии с подписью в hero, панель выпадает вниз.
 * linkBase: префикс для якорей меню на других страницах (например "/" на странице кейса).
 * Мобильный: внизу по центру. Сама кнопка вырастает в меню на весь экран: снизу внутри неё поднимается
 * чёрный круг и заливает её, появляются пункты меню; «Menu» с крестиком остаются внизу карточки.
 */
export function MenuPill({ linkBase = "" }: { linkBase?: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const closeForm = useCallback(() => setFormOpen(false), []);
  // пункт «Contact»: меню закрывается, форма открывается кадром позже — иначе закрытие меню
  // (его эффект идёт после эффекта формы) снимет блокировку прокрутки, которую поставила форма
  const openForm = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => setFormOpen(true));
  };
  const pill = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const circle = useRef<HTMLSpanElement>(null);
  const skin = useRef<HTMLSpanElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);

  // в футере кнопку не показываем: на мобильном уезжает вниз, на десктопе вверх
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: "#contact",
      start: "top 85%",
      onToggle: (self) => {
        const desktop = window.matchMedia(DESKTOP_MQ).matches;
        if (self.isActive) setOpen(false);
        gsap.to(pill.current, {
          y: self.isActive ? (desktop ? -120 : 120) : 0,
          autoAlpha: self.isActive ? 0 : 1,
          duration: 0.5,
          ease: "power3.out",
        });
      },
    });
    return () => st.kill();
  }, []);

  // десктоп: выпадающая панель
  const animateDesktop = (isOpen: boolean) => {
    const links = panel.current!.querySelectorAll(".menu-link");
    const hidden = "inset(0% 0% 100% 0% round 24px)";
    if (isOpen) {
      gsap.set([panel.current, backdrop.current], { display: "block" });
      gsap.to(backdrop.current, { opacity: 1, duration: 0.35 });
      gsap.fromTo(
        panel.current,
        { clipPath: hidden, y: -12 },
        { clipPath: "inset(0% 0% 0% 0% round 24px)", y: 0, duration: 0.6, ease: "expo.out" },
      );
      gsap.fromTo(links, { yPercent: 110 }, { yPercent: 0, stagger: 0.05, duration: 0.6, ease: "power3.out", delay: 0.1 });
    } else {
      gsap.to(backdrop.current, { opacity: 0, duration: 0.3, onComplete: () => gsap.set(backdrop.current, { display: "none" }) });
      gsap.to(panel.current, {
        clipPath: hidden,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => gsap.set(panel.current, { display: "none" }),
      });
    }
  };

  // мобильный: кнопка сама раскрывается в карточку
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const animateMobile = (isOpen: boolean) => {
    const c = card.current!;
    const items = list.current!.querySelectorAll(".sheet-item");
    menuTl.current?.kill();
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    const tl = gsap.timeline();
    if (isOpen) {
      gsap.set(list.current, { display: "flex" });
      gsap.set(items, { opacity: 0, y: 12 });
      // карточка растягивается на весь экран; кнопка стоит в 40px от низа (bottom-10), поэтому опускаем её отрицательным отступом
      tl.to(c, { width: window.innerWidth, height: window.innerHeight, marginBottom: -40, borderRadius: 0, duration: 0.8, ease: EASE }, 0)
        .to(bar.current, { paddingLeft: 24, paddingRight: 24, paddingBottom: 40, duration: 0.8, ease: EASE }, 0)
        .to(circle.current, { bottom: "-20%", duration: 0.8, ease: EASE }, 0.1)
        // под кругом фон и обводка тоже становятся чёрными, чтобы по краю не просвечивал синий
        .to(skin.current, { backgroundColor: "#242424", borderColor: "#242424", duration: 0.2 }, 0.35)
        .to(items, { opacity: 1, y: 0, duration: 0.4, ease: EASE, stagger: 0.08 }, 0.4);
    } else {
      tl.to(items, { opacity: 0, duration: 0.15 }, 0)
        .set(skin.current, { clearProps: "backgroundColor,borderColor" }, 0)
        .to(c, { width: 150, height: 48, marginBottom: 0, borderRadius: 24, duration: 0.8, ease: EASE }, 0)
        .to(bar.current, { paddingLeft: 20, paddingRight: 16, paddingBottom: 0, duration: 0.8, ease: EASE }, 0)
        .set(list.current, { display: "none" }, 0.15)
        .to(circle.current, { bottom: "-200%", duration: 0.8, ease: EASE }, 0)
        // возвращаем размеры классам, чтобы не мешать десктопу после ресайза
        .set([c, bar.current], { clearProps: "width,height,marginBottom,borderRadius,padding" });
    }
    menuTl.current = tl;
  };

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia(DESKTOP_MQ).matches) animateDesktop(open);
    else animateMobile(open);
    // анимации запускаются только при смене open; функции-аниматоры читают ref'ы и не зависят от рендера
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, []);

  // мобильный: тап мимо карточки закрывает меню
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (window.matchMedia(DESKTOP_MQ).matches) return;
      if (!card.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const onCopy = async () => {
    await copyText(content.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <div
        ref={backdrop}
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-50 hidden bg-black/30 opacity-0 backdrop-blur-sm"
      />

      {/* top/высота совпадают с блоком подписи в Hero.tsx */}
      <div
        ref={pill}
        data-menu-pill
        className="fixed bottom-10 left-1/2 z-[60] -translate-x-1/2 lg:top-8 lg:right-[calc(5%+24px)] lg:bottom-auto lg:left-auto lg:translate-x-0"
      >
        {/* десктопная выпадающая панель */}
        <div
          ref={panel}
          className="absolute top-[calc(100%+12px)] right-0 hidden w-[340px] bg-cream p-3 shadow-[0_20px_60px_rgba(0,0,0,.18)]"
        >
          <nav className="flex flex-col">
            {content.menu.links.map((l) => (
              <a
                key={l.label}
                href={menuHref(linkBase, l.href)}
                onClick={l.form ? openForm : () => setOpen(false)}
                aria-haspopup={l.form ? "dialog" : undefined}
                className="group overflow-hidden rounded-xl px-4 py-2 transition-colors hover:bg-accent"
              >
                <span className="menu-link font-display block text-[28px] leading-[1.15] text-ink uppercase transition-colors group-hover:text-cream">
                  {l.label}
                </span>
              </a>
            ))}
          </nav>
        </div>

        {/* кнопка; на мобильном она же раскрывается в карточку меню */}
        <div
          ref={card}
          className="relative isolate flex h-12 w-[150px] flex-col overflow-hidden rounded-[24px] text-cream shadow-[0_6px_24px_rgba(0,0,0,.08)] transition-transform duration-200 hover:scale-[1.04] lg:h-11 lg:w-auto"
        >
          {/* синий фон с обводкой — отдельный слой под кругом; в раскрытом меню он перекрашивается в чёрный */}
          <span ref={skin} aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] border border-[#0C6CB6] bg-accent" />
          {/* чёрный круг: поднимается снизу и заливает карточку */}
          <span
            ref={circle}
            aria-hidden
            className="pointer-events-none absolute left-1/2 z-0 h-[200%] w-[200%] -translate-x-1/2 rounded-[50%] bg-ink lg:hidden"
            style={{ bottom: "-200%" }}
          />

          {/* пункты мобильного меню */}
          <div ref={list} className="relative z-10 hidden flex-1 flex-col items-center justify-center gap-6 pt-8 pb-2 lg:hidden!">
            {content.menu.links.map((l) => (
              <a key={l.label} href={menuHref(linkBase, l.href)} onClick={l.form ? openForm : () => setOpen(false)} aria-haspopup={l.form ? "dialog" : undefined} className="sheet-item font-display block text-[32px] leading-none text-cream uppercase">
                {l.label}
              </a>
            ))}
            <button
              onClick={onCopy}
              className="sheet-item mt-2 flex h-10 items-center rounded-full border border-white/40 px-5 text-[14px] text-cream transition-colors active:bg-white active:text-ink"
            >
              {copied ? content.menu.emailCopied : content.menu.emailButton}
            </button>
          </div>

          <button
            ref={bar}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="relative z-10 flex h-12 w-full shrink-0 items-center justify-between gap-6 pr-4 pl-5 text-[13px] lg:h-11 lg:justify-start lg:text-[17px]"
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className="relative block h-3 w-5" aria-hidden>
              <span className={`absolute left-0 h-[1.5px] w-full bg-cream transition-all duration-300 ${open ? "top-1/2 rotate-45" : "top-[2px]"}`} />
              <span className={`absolute left-0 h-[1.5px] w-full bg-cream transition-all duration-300 ${open ? "top-1/2 -rotate-45" : "top-[9px]"}`} />
            </span>
          </button>
        </div>
      </div>

      <ContactForm open={formOpen} onClose={closeForm} />
    </>
  );
}
