"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type Props = {
  /** true, когда закончилось интро hero */
  start: boolean;
  /** тексты печатаются по очереди, последний остаётся */
  messages: string[];
};

const DESKTOP = "(min-width: 1024px) and (pointer: fine)"; // мобильные и планшеты — без бабла
const OFFSET = { x: 18, y: 22 }; // смещение бабла от кончика курсора
const BOTTOM_GAP = 64; // отступ от низа экрана, когда курсора нет
const HOLD = 3000; // сколько держится каждая фраза, мс

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const isEnabled = () =>
  window.matchMedia(DESKTOP).matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Бабл с печатающимся текстом. Если курсор на странице, бабл едет за ним;
 * если курсор неизвестен или ушёл за окно, бабл стоит снизу по центру.
 * Только десктоп с мышью; при reduced motion не показывается (элемент остаётся невидимым).
 */
export function CursorBubble({ start, messages }: Props) {
  const [text, setText] = useState("");
  const box = useRef<HTMLDivElement>(null);
  // позицию курсора ловим с самого начала, чтобы к концу интро она уже была известна
  const pointer = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!isEnabled()) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") pointer.current = { x: e.clientX, y: e.clientY };
    };
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) pointer.current = null; // курсор ушёл за пределы окна
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  useEffect(() => {
    if (!start || !isEnabled()) return;
    const el = box.current!;
    const section = el.parentElement!;
    let cancelled = false;

    // позиция: за курсором или снизу по центру
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    const target = () => {
      const p = pointer.current;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (p) return { x: p.x + OFFSET.x, y: p.y + OFFSET.y };
      return { x: (window.innerWidth - w) / 2, y: window.innerHeight - BOTTOM_GAP - h };
    };
    const first = target();
    gsap.set(el, { x: first.x, y: first.y });
    const follow = () => {
      const t = target();
      xTo(t.x);
      yTo(t.y);
    };
    gsap.ticker.add(follow);

    gsap.fromTo(el, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)" });

    // бабл живёт только в первом блоке: прячем, когда hero уходит с экрана
    let done = false;
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "40% top",
      onLeave: () => gsap.to(el, { autoAlpha: 0, scale: 0.8, duration: 0.25 }),
      onEnterBack: () => !done && gsap.to(el, { autoAlpha: 1, scale: 1, duration: 0.3 }),
    });

    // печать: каждая фраза держится HOLD мс, после последней бабл исчезает насовсем
    (async () => {
      for (let m = 0; m < messages.length; m++) {
        const msg = messages[m];
        for (let i = 1; i <= msg.length; i++) {
          if (cancelled) return;
          setText(msg.slice(0, i));
          await wait(70);
        }
        await wait(HOLD);
        if (cancelled) return;
        if (m === messages.length - 1) break;
        for (let i = msg.length - 1; i >= 0; i--) {
          if (cancelled) return;
          setText(msg.slice(0, i));
          await wait(30);
        }
        await wait(250);
      }
      done = true;
      gsap.to(el, {
        autoAlpha: 0,
        scale: 0.6,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => gsap.ticker.remove(follow),
      });
    })();

    return () => {
      cancelled = true;
      gsap.ticker.remove(follow);
      st.kill();
    };
  }, [start, messages]);

  return (
    <div
      ref={box}
      aria-hidden
      className="pointer-events-none invisible fixed top-0 left-0 z-[60] flex h-9 items-center rounded-full rounded-tl-md bg-[#9fd4ff] px-4 text-[15px] whitespace-nowrap text-ink shadow-[0_8px_24px_rgba(3,136,238,.2)]"
    >
      <span>{text}</span>
      <span className="ml-[2px] inline-block h-[1.05em] w-[1.5px] animate-pulse bg-ink" />
    </div>
  );
}
