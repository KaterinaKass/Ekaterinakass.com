"use client";

import type Lenis from "lenis";

// Текущий экземпляр Lenis (его создаёт SmoothScroll). Пустой при reduced motion.
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

/** Прокрутка к позиции в пикселях: через Lenis, если он есть, иначе нативно. */
export function scrollToY(y: number, immediate = false) {
  if (lenis) lenis.scrollTo(y, { immediate, force: true, duration: 1.2 });
  else window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
}

/** Останавливает / возобновляет плавный скролл (например, пока открыта модалка). */
export function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
}
