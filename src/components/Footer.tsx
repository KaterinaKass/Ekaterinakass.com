"use client";

import { useRef } from "react";
import { content } from "@/content";
import { gsap, MOTION_OK, useGsap } from "@/lib/gsap";
import { SplitChars } from "./SplitChars";
import { PixelAssemble } from "./PixelAssemble";
import { attachNameHover, HOVER_MQ } from "@/lib/nameHover";

const { footer, hero } = content;

/** Иконки соцсетей: 48px, тонкая круглая обводка и знак внутри (как по стилю в референсе). */
function Icon({ name }: { name: "instagram" | "linkedin" | "mail" }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
      // эффект наведения — на самом значке, а не на ссылке: у ссылки прозрачность анимирует GSAP
      className="transition-opacity group-hover:opacity-70"
    >
      <circle cx="24" cy="24" r="22.25" />
      {name === "instagram" && (
        <>
          <rect x="15" y="15" width="18" height="18" rx="5.5" />
          <circle cx="24" cy="24" r="4.3" />
          <circle cx="29.2" cy="18.8" r="0.9" fill="currentColor" stroke="none" />
        </>
      )}
      {name === "linkedin" && (
        <>
          <path d="M17.5 21.5V31" />
          <circle cx="17.5" cy="17.3" r="1.2" fill="currentColor" stroke="none" />
          <path d="M22.5 31v-9.5M22.5 25.5c0-2.4 1.6-4.2 3.8-4.2s3.6 1.6 3.6 4.2V31" />
        </>
      )}
      {name === "mail" && (
        <>
          <circle cx="24" cy="24" r="4.2" />
          <path d="M28.2 20v5.2a2.6 2.6 0 0 0 5.2 0V24a9.4 9.4 0 1 0-3.7 7.5" />
        </>
      )}
    </svg>
  );
}

/** Финальный синий экран: большое имя, аватар, призыв и контакты. */
export function Footer() {
  const root = useRef<HTMLElement>(null);

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
      <div className="mx-[5%] flex flex-col items-center gap-6 py-8 md:flex-row md:items-end md:justify-between md:gap-8 md:px-[clamp(24px,3.5vw,56px)]">
        <div className="text-center md:text-left">
          <p className="mb-2 flex justify-center gap-[0.3em] overflow-hidden text-[16px] md:justify-start md:text-[clamp(16px,2vw,48px)]">
            {footer.lead.split(" ").map((w, i) => (
              <span key={i} className="footer-lead-word inline-block">{w}</span>
            ))}
          </p>
          <h3 className="font-wide text-[32px] leading-none text-cream md:text-[clamp(32px,3.8vw,88px)]">
            {footer.big.map((line) => (
              <span key={line} className="block">
                <SplitChars text={line} charClass="footer-big-char" />
              </span>
            ))}
          </h3>
        </div>

        <div className="flex flex-col items-center gap-3 md:items-end">
          <span className="text-[18px]">{footer.reachOut}</span>
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
    </footer>
  );
}
