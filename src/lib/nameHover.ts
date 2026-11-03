"use client";

import { gsap } from "@/lib/gsap";

/** Эффекты наведения включаем только на десктопе с мышью */
export const HOVER_MQ = "(min-width: 1024px) and (pointer: fine)";

/**
 * Волна по имени: буквы под курсором (или под «волной», которая сама проходит слева направо)
 * становятся жирнее (обводка в цвет текста) и шире (боковой отступ той же величины) —
 * поэтому слово под волной заметно «разбухает» и раздвигается. Плюс лёгкий сдвиг от курсора.
 * Сила спадает линейно до нуля на расстоянии ~3 ширин буквы.
 * Используется для имени в hero и в футере.
 */
export function attachNameHover(
  title: HTMLElement,
  charSelector: string,
  // interactive: false — только волна сама по себе (мобильный), без реакции на курсор
  { interactive = true }: { interactive?: boolean } = {},
) {
  const chars = gsap.utils.toArray<HTMLElement>(charSelector, title);
  // снимаем маски после интро, иначе раздвинутые/утолщённые буквы обрезаются
  title.querySelectorAll<HTMLElement>(".overflow-hidden").forEach((el) => (el.style.overflow = "visible"));

  // толщина обводки идёт через CSS-переменную --sw (см. .wave-char в globals.css)
  chars.forEach((el) => el.classList.add("wave-char"));
  gsap.set(chars, { "--sw": "0px" });
  const setters = chars.map((el) => ({
    x: gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" }),
    sw: gsap.quickTo(el, "--sw", { duration: 0.45, ease: "power3.out" }),
  }));

  // центры букв считаем без текущих смещений
  let centers: { x: number; y: number; w: number; h: number }[] = [];
  let fontSize = 16;
  let avgW = 1; // средняя ширина буквы: радиус влияния одинаковый для всех (узкая «I» не выпадает из волны)
  const measure = () => {
    fontSize = parseFloat(getComputedStyle(chars[0]).fontSize) || 16;
    centers = chars.map((el) => {
      const r = el.getBoundingClientRect();
      const tx = Number(gsap.getProperty(el, "x")) || 0;
      const pad = parseFloat(getComputedStyle(el).getPropertyValue("--sw")) || 0;
      return { x: r.left - tx + r.width / 2, y: r.top + r.height / 2, w: r.width - pad * 2, h: r.height };
    });
    avgW = centers.reduce((a, c) => a + c.w, 0) / Math.max(centers.length, 1);
  };

  const STROKE = 0.06; // обводка и боковой отступ буквы под волной, доля размера шрифта (~6px при 100px)
  const PUSH = 0.03; // сдвиг от курсора, доля размера шрифта
  const apply = (px: number, py: number) => {
    if (!centers.length) measure();
    centers.forEach((c, i) => {
      const dx = c.x - px;
      const dy = c.y - py;
      const d = Math.hypot(dx, dy);
      const reach = avgW * 3;
      const k = d < reach ? 1 - d / reach : 0;
      setters[i].sw(STROKE * fontSize * k);
      setters[i].x(d > 0 ? (dx / d) * PUSH * fontSize * k * k : 0);
    });
  };
  const reset = () => setters.forEach((s) => (s.x(0), s.sw(0)));

  // для волны: проходим по обеим строкам имени одновременно (ближайшая строка для каждой буквы)
  const applyRows = (px: number) => {
    if (!centers.length) measure();
    centers.forEach((c, i) => {
      const dx = c.x - px;
      const d = Math.abs(dx);
      const reach = avgW * 3;
      const k = d < reach ? 1 - d / reach : 0;
      setters[i].sw(STROKE * fontSize * k);
      setters[i].x(d > 0 ? Math.sign(dx) * PUSH * fontSize * k * k : 0);
    });
  };

  let hovering = false;
  const onMove = (e: PointerEvent) => {
    hovering = true;
    apply(e.clientX, e.clientY);
  };
  const onLeave = () => {
    hovering = false;
    reset();
  };
  const onEnter = () => measure();

  // волна сама по себе, пока мышь не над именем
  const sweep = { p: 0 };
  // волна проходит слева направо каждые ~5 секунд (1.1 с волна + 3.9 с пауза)
  const idle = gsap.timeline({ repeat: -1, repeatDelay: 3.9, delay: 1.5 });
  idle.to(sweep, {
    p: 1,
    duration: 1.1,
    ease: "power1.inOut",
    onStart: measure,
    onUpdate: () => {
      if (hovering) return;
      const r = title.getBoundingClientRect();
      // волна идёт по каждой строке имени: курсор-«призрак» по центру каждой строки по очереди не нужен —
      // берём середину высоты всего имени и радиус влияния по вертикали покрывает обе строки
      applyRows(r.left - 80 + (r.width + 160) * sweep.p);
    },
    onComplete: () => {
      sweep.p = 0;
      if (!hovering) reset();
    },
  });

  if (interactive) {
    title.addEventListener("pointerenter", onEnter);
    title.addEventListener("pointermove", onMove);
    title.addEventListener("pointerleave", onLeave);
  }
  window.addEventListener("resize", measure);
  window.addEventListener("scroll", measure, { passive: true });

  return () => {
    idle.kill();
    title.removeEventListener("pointerenter", onEnter);
    title.removeEventListener("pointermove", onMove);
    title.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("resize", measure);
    window.removeEventListener("scroll", measure);
  };
}

