"use client";

import { useRef, useState } from "react";
import { content } from "@/content";
import { gsap, MOTION_OK, useGsap } from "@/lib/gsap";
import { SplitChars } from "./SplitChars";
import { CursorBubble } from "./CursorBubble";
import { attachNameHover, HOVER_MQ } from "@/lib/nameHover";

const { hero } = content;

/** Подпись: на старте крупно пишется по центру (clip-path), потом уезжает в левый верхний угол. */
function Signature() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={hero.signature}
      alt=""
      // размеры заданы заранее: ширина известна до загрузки картинки (интро её меряет)
      width={1609}
      height={226}
      // мобильный: ширина как в референсе (64% экрана, максимум 240px); с lg — высота 44px
      className="hero-sign h-auto w-[min(64vw,240px)] select-none lg:h-11 lg:w-auto"
      draggable={false}
    />
  );
}

/** Роль или локация в одну строку; к ней идёт линия от вертикальной рамки (5%). Только десктоп. */
function SideLabel({ lines, side }: { lines: string[]; side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div
      className={`absolute top-1/2 hidden -translate-y-1/2 items-center lg:flex ${
        isLeft ? "left-[5%] flex-row" : "right-[5%] flex-row-reverse"
      }`}
    >
      <div
        className={`hero-line h-px w-[clamp(24px,3vw,72px)] bg-line ${isLeft ? "origin-left" : "origin-right"}`}
      />
      <div className={isLeft ? "pl-5" : "pr-5"}>
        <SplitChars
          text={lines.join(" ")}
          charClass="hero-sub-char"
          className="whitespace-nowrap text-[clamp(18px,1.6vw,26px)] leading-[1.2] text-ink"
        />
      </div>
    </div>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [introDone, setIntroDone] = useState(false);

  useGsap(root, ({ q, root }) => {
    gsap.set(root.querySelector(".js-intro"), { visibility: "visible" });
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      // Порядок: подпись крупно по центру → уменьшается и уезжает в левый верхний угол,
      // одновременно кнопка меню появляется и едет на своё место → имя → фамилия с ролью и локацией
      const SIGN = 0.15; // подпись пишется по центру
      const MOVE = 1.65; // подпись и меню едут на места
      const FIRST = 2.35;
      const SECOND = 2.8;

      const sign = root.querySelector<HTMLElement>(".hero-sign")!;
      const sr = sign.getBoundingClientRect();
      // крупная подпись на старте: половина ширины экрана на десктопе, 85% на мобильном (не вылезает за края)
      const bigShare = window.matchMedia("(min-width: 1024px)").matches ? 0.5 : 0.85;
      const bigScale = sr.width > 0 ? Math.min(4, (window.innerWidth * bigShare) / sr.width) : 1;
      gsap.set(sign, {
        x: window.innerWidth / 2 - (sr.left + sr.width / 2),
        y: window.innerHeight / 2 - (sr.top + sr.height / 2),
        scale: bigScale,
        transformOrigin: "50% 50%",
      });

      // кнопка живёт вне hero, поэтому берём её из документа
      const pill = document.querySelector<HTMLElement>("[data-menu-pill]");
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      const pr = pill?.getBoundingClientRect();

      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.2 });
      tl.from(".hero-grid", { opacity: 0, duration: 1.2, ease: "power1.out" }, 0)
        .fromTo(sign, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power2.inOut" }, SIGN)
        .to(sign, { x: 0, y: 0, scale: 1, duration: 1, ease: "power3.inOut" }, MOVE);

      if (pill && pr) {
        // десктоп: стартует под крупной подписью в центре и едет в правый верхний угол; мобильный: просто появляется
        const from = desktop
          ? {
              autoAlpha: 0,
              x: window.innerWidth / 2 - (pr.left + pr.width / 2),
              y: window.innerHeight / 2 + (sr.height * bigScale) / 2 + 40 - (pr.top + pr.height / 2),
            }
          : { autoAlpha: 0, y: 20 };
        tl.from(pill, { ...from, duration: 1, ease: "power3.inOut" }, MOVE);
      }

      tl.from(q(".hero-char-1"), { yPercent: 115, duration: 1.1, stagger: 0.045 }, FIRST)
        .from(q(".hero-char-2"), { yPercent: 115, duration: 1.1, stagger: 0.045 }, SECOND)
        .from(q(".hero-line"), { scaleX: 0, duration: 1.2, ease: "expo.out" }, SECOND);
      // роль и локация выезжают по буквам так же, как имя, и обе одновременно с фамилией
      const labels = new Set(q(".hero-sub-char").map((c) => c.parentElement!));
      labels.forEach((label) =>
        tl.from(label.querySelectorAll(".hero-sub-char"), { yPercent: 115, duration: 1.1, stagger: 0.03 }, SECOND),
      );

      // эффект наведения включается после интро и только на десктопе с мышью
      let detach: (() => void) | undefined;
      const title = root.querySelector<HTMLElement>(".hero-title")!;
      tl.call(() => {
        // волна по имени — везде; увеличение под курсором — только на десктопе с мышью
        detach = attachNameHover(title, ".hero-char", { interactive: window.matchMedia(HOVER_MQ).matches });
        setIntroDone(true);
      });

      // На скролле имя чуть уезжает вверх и бледнеет
      gsap.to(".hero-title", {
        yPercent: -30,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });

      return () => detach?.();
    });
  });

  return (
    <section ref={root} id="top" className="relative z-10 h-svh w-full overflow-hidden bg-cream">
      <div className="hero-grid bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]" />

      <div className="js-intro relative h-full">
        {/* та же высота и отступ сверху, что у кнопки Menu справа (Chrome.tsx).
            На мобильном подпись по центру сверху, с lg в левом углу. Без translate-классов:
            на картинку подписи вешаются GSAP-трансформы для интро */}
        <div className="absolute inset-x-0 top-8 z-10 flex h-11 items-center justify-center lg:right-auto lg:left-[calc(5%+24px)] lg:justify-start">
          <Signature />
        </div>

        <div className="relative flex h-full flex-col items-center justify-center gap-9 lg:flex-row lg:gap-0">
          <SideLabel lines={hero.left} side="left" />

          {/* на мобильном роль над именем, всё по центру */}
          <SplitChars
            text={hero.left.join(" ")}
            charClass="hero-sub-char"
            className="hero-meta text-[18px] leading-[1.15] text-ink lg:hidden"
          />

          <h1 className="hero-title font-display text-center text-[16vw] lg:text-[clamp(36px,8.6vw,145px)] cursor-default leading-[0.95] text-ink uppercase">
            <span className="flex justify-center">
              <SplitChars text={hero.firstLine} charClass="hero-char hero-char-1" />
            </span>
            <span className="flex justify-center">
              <SplitChars text={hero.secondLine} charClass="hero-char hero-char-2" />
            </span>
          </h1>

          <SplitChars
            text={hero.right.join(" ")}
            charClass="hero-sub-char"
            className="hero-meta text-[18px] leading-[1.15] text-ink lg:hidden"
          />

          <SideLabel lines={hero.right} side="right" />
        </div>
      </div>

      <CursorBubble start={introDone} messages={hero.bubble} />
    </section>
  );
}
