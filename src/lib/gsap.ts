"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/**
 * Запускает анимации внутри gsap.context, привязанного к ref.
 * Всё созданное внутри (твины, ScrollTrigger) убирается при размонтировании.
 */
export function useGsap(
  scope: RefObject<HTMLElement | null>,
  setup: (ctx: { q: (sel: string) => HTMLElement[]; root: HTMLElement }) => void,
) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      setup({ q: (sel) => gsap.utils.toArray<HTMLElement>(sel, root), root });
    }, root);
    return () => ctx.revert();
    // setup намеренно вызывается один раз
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
