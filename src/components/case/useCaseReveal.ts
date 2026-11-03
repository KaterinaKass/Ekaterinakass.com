"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap, MOTION_OK, ScrollTrigger } from "@/lib/gsap";

/**
 * Появление контента кейса при скролле (классы см. в CaseUI.tsx).
 * Перезапускается при смене key, например при переключении Summary / Full Case Study.
 */
export function useCaseReveal(scope: RefObject<HTMLElement | null>, key: unknown = null) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const q = (sel: string) => gsap.utils.toArray<HTMLElement>(sel, root);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        q(".rv").forEach((el) =>
          gsap.from(el, {
            y: 28,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }),
        );

        q(".rv-words").forEach((el) =>
          gsap.from(el.querySelectorAll(".rv-word"), {
            yPercent: 115,
            stagger: 0.05,
            duration: 0.9,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }),
        );

        q(".rv-line").forEach((el) =>
          gsap.from(el, { scaleX: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } }),
        );

        // картинка раскрывается из уменьшенной рамки, внутри чуть «отъезжает» масштаб.
        // Скругление всё время равно радиусу рамки из CSS, чтобы углы были круглыми с первого кадра.
        q(".rv-img").forEach((el) => {
          const inner = el.querySelector(".rv-img-inner");
          const r = getComputedStyle(el).borderTopLeftRadius || "24px";
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } });
          tl.fromTo(
            el,
            { clipPath: `inset(8% 6% 8% 6% round ${r})` },
            { clipPath: `inset(0% 0% 0% 0% round ${r})`, duration: 1.3, ease: "expo.out" },
          );
          if (inner) tl.from(inner, { scale: 1.12, duration: 1.6, ease: "expo.out" }, 0);
        });
      });
    }, root);
    // после смены контента пересчитываем позиции всех триггеров на странице
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [scope, key]);
}
