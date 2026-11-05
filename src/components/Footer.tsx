"use client";

import { useCallback, useRef, useState } from "react";
import { content } from "@/content";
import { gsap, MOTION_OK, useGsap } from "@/lib/gsap";
import { SplitChars } from "./SplitChars";
import { PixelAssemble } from "./PixelAssemble";
import { ContactForm } from "./ContactForm";
import { attachNameHover, HOVER_MQ } from "@/lib/nameHover";

const { footer, hero } = content;

/** Иконки соцсетей как в референсе: 48px, контурные знаки (сетка 24, линия 2) без круга вокруг. */
function Icon({ name }: { name: "instagram" | "linkedin" | "mail" }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      // эффект наведения — на самом значке, а не на ссылке: у ссылки прозрачность анимирует GSAP
      className="transition-opacity group-hover:opacity-70"
    >
      {name === "instagram" && (
        <>
          <path d="M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
          <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
          <path d="M16.5 7.5v.01" />
        </>
      )}
      {name === "linkedin" && (
        <>
          <path d="M8 11v5" />
          <path d="M8 8v.01" />
          <path d="M12 16v-5" />
          <path d="M16 16v-3a2 2 0 1 0 -4 0" />
          <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z" />
        </>
      )}
      {name === "mail" && (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
        </>
      )}
    </svg>
  );
}

// кнопка с обводкой на синем: размеры как у CTA сайта, при наведении заливается светлым
const OUTLINE_BTN =
  "inline-flex items-center justify-center gap-2.5 rounded-full border border-cream/70 px-6 py-[14px] text-[16px] leading-none font-medium text-cream transition-colors duration-200 hover:border-cream hover:bg-cream hover:text-accent md:text-[clamp(16px,1.1vw,20px)]";

/** Значок WhatsApp контуром — тем же стилем, что иконки соцсетей (линия 2, скруглённые концы). */
function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
      <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
    </svg>
  );
}

/** Финальный синий экран: большое имя, аватар, призыв и контакты. */
export function Footer() {
  const root = useRef<HTMLElement>(null);
  const [formOpen, setFormOpen] = useState(false);
  const closeForm = useCallback(() => setFormOpen(false), []);

  useGsap(root, ({ q }) => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const st = { trigger: root.current, start: "top 60%" };
      const tl = gsap.timeline({ scrollTrigger: st });
      tl.from(q(".footer-name-char"), { yPercent: 115, stagger: 0.035, duration: 1, ease: "power4.out" })
        .from(q(".footer-big-char"), { yPercent: 115, stagger: 0.015, duration: 0.7, ease: "power3.out" }, 0.4)
        .from(q(".footer-lead-word"), { yPercent: 110, stagger: 0.04, duration: 0.6 }, 0.4)
        .from(q(".footer-social"), { y: 20, opacity: 0, stagger: 0.08, duration: 0.6 }, 0.6)
        .from(".footer-rule", { scaleX: 0, duration: 1.2, ease: "expo.out" }, 0.3);

      // после появления имени включаем на нём ту же «лупу», что в первом блоке (только десктоп с мышью)
      let detach: (() => void) | undefined;
      tl.call(() => {
        const name = root.current?.querySelector<HTMLElement>(".footer-name");
        if (name && window.matchMedia(HOVER_MQ).matches) detach = attachNameHover(name, ".footer-name-char");
      });

      // персонаж слегка покачивается только на десктопе; на мобильном стоит на месте, как в референсе
      // (сборку из пикселей делает PixelAssemble)
      if (window.matchMedia("(min-width: 768px)").matches)
        gsap.to(".footer-avatar", { y: -8, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.5 });

      return () => detach?.();
    });
  });

  return (
    <footer ref={root} id="contact" className="bg-dots relative z-10 flex min-h-svh w-full flex-col overflow-hidden text-cream">
      {/* имя по центру, персонаж по центру поверх него; на мобильном имя шире экрана и обрезается, как в референсе */}
      <div className="relative flex flex-1 items-center justify-center pt-16">
        {/* размеры как в референсе: на мобильном строки шире экрана (~140%), на десктопе ~76% ширины */}
        <p className="footer-name font-display cursor-default text-center text-[26vw] leading-[0.9] whitespace-nowrap text-[#009AF7] uppercase select-none md:text-[clamp(40px,14vw,240px)]">
          <span className="flex justify-center"><SplitChars text={hero.firstLine} charClass="footer-name-char" /></span>
          <span className="flex justify-center"><SplitChars text={hero.secondLine} charClass="footer-name-char" /></span>
        </p>
        <PixelAssemble
          src={footer.avatar}
          aspect={footer.avatarAspect}
          wideOnMobile
          className="footer-avatar pointer-events-none absolute top-[calc(50%+2rem)] left-1/2 h-[min(75%,365px)] w-auto -translate-x-1/2 -translate-y-1/2 md:h-[min(45svh,405px)]"
        />
      </div>

      <div className="footer-rule mx-[5%] h-px origin-left bg-cream/30" />

      {/* на десктопе контент отодвинут от вертикальных линий, как в референсе */}
      <div className="mx-[5%] flex flex-col items-center gap-4 py-8 md:flex-row md:items-end md:justify-between md:gap-8 md:px-[clamp(24px,3.5vw,56px)]">
        <div className="text-center md:text-left">
          <p className="mb-2 flex justify-center gap-[0.3em] overflow-hidden text-[16px] md:justify-start md:text-[clamp(16px,2vw,48px)]">
            {footer.lead.split(" ").map((w, i) => (
              <span key={i} className="footer-lead-word inline-block">{w}</span>
            ))}
          </p>
          {/* шрифт шире, чем Trobika в референсе, поэтому кегль чуть меньше: строки получаются той же ширины (28px на мобильном) */}
          <h3 className="font-wide text-[28px] leading-none text-cream md:text-[clamp(30px,3.4vw,80px)]">
            {footer.big.map((line) => (
              <span key={line} className="block">
                <SplitChars text={line} charClass="footer-big-char" />
              </span>
            ))}
          </h3>
        </div>

        <div className="flex flex-col items-center gap-5 md:items-end">
          <div className="flex flex-col items-center gap-2.5 md:items-end">
            {/* две кнопки с обводкой: форма и WhatsApp; на телефоне одна под другой */}
            <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={() => setFormOpen(true)} aria-haspopup="dialog" className={OUTLINE_BTN}>
                {footer.reachOut}
              </button>
              <a href={footer.whatsapp.href} target="_blank" rel="noopener noreferrer" className={OUTLINE_BTN}>
                <WhatsAppIcon />
                {footer.whatsapp.label}
              </a>
            </div>
            {/* мелкий текст — как подпись «Designed in Figma» ниже; почта — ссылка mailto тем же стилем, что и текст */}
            <p className="text-[12px] text-cream/80 md:text-[18px]">
              {footer.orEmail}
              <a href={`mailto:${footer.email}`} className="transition-opacity hover:opacity-70">
                {footer.email}
              </a>
            </p>
          </div>
          <div className="flex gap-5">
            {footer.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="footer-social group block size-12 rounded-full text-cream"
              >
                <Icon name={s.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-[5%] flex justify-between border-t border-cream/20 py-4 text-[12px] text-cream/80 md:px-[clamp(24px,3.5vw,56px)] md:text-[18px]">
        <span>
          {footer.creditLeft[0]}
          <b className="font-semibold text-cream">{footer.creditLeft[1]}</b>
        </span>
        <span>
          {footer.creditRight[0]}
          <b className="font-semibold text-cream">{footer.creditRight[1]}</b>
        </span>
      </div>

      <ContactForm open={formOpen} onClose={closeForm} />
    </footer>
  );
}
