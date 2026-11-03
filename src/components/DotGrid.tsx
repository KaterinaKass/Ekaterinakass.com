"use client";

import { useEffect, useRef } from "react";

const BASE_ALPHA = 0.07; // точки в покое — приглушённые
const MAX_ALPHA = 0.4;

type Props = {
  className?: string;
  /** шаг сетки, px */
  gap?: number;
  /** радиус точки в покое, px */
  radius?: number;
  /** радиус точки прямо под курсором, px */
  hoverRadius?: number;
  /** радиус влияния курсора, px */
  reach?: number;
};

/**
 * Сетка точек на canvas. Точки рядом с курсором плавно увеличиваются и белеют (только десктоп с мышью).
 * Курсор сглаживается (lerp), кадры рисуются только пока есть движение и блок виден.
 */
export function DotGrid({ className = "", gap = 18, radius = 1.25, hoverRadius = 3.2, reach = 260 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    // целевая и сглаженная позиция курсора (в координатах холста); -9999 = курсора нет
    const target = { x: -9999, y: -9999 };
    const cur = { x: -9999, y: -9999 };
    let strength = 0; // 0..1, плавное появление/исчезновение эффекта
    let strengthTarget = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const ox = (w % gap) / 2;
      const oy = (h % gap) / 2;
      for (let y = oy; y < h; y += gap) {
        for (let x = ox; x < w; x += gap) {
          const d = Math.hypot(x - cur.x, y - cur.y);
          // плавный спад: 1 под курсором → 0 на краю зоны
          const k = d < reach ? Math.pow(1 - d / reach, 2) * strength : 0;
          const r = radius + (hoverRadius - radius) * k;
          // под курсором точка белеет максимум до 40% непрозрачности
          ctx.fillStyle = `rgba(255,255,255,${BASE_ALPHA + (MAX_ALPHA - BASE_ALPHA) * k})`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const tick = () => {
      raf = 0;
      if (cur.x < -9000) {
        cur.x = target.x;
        cur.y = target.y;
      } else {
        cur.x += (target.x - cur.x) * 0.18;
        cur.y += (target.y - cur.y) * 0.18;
      }
      strength += (strengthTarget - strength) * 0.12;
      draw();
      const moving =
        Math.abs(target.x - cur.x) > 0.3 || Math.abs(target.y - cur.y) > 0.3 || Math.abs(strengthTarget - strength) > 0.005;
      if (moving && visible) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      strengthTarget = inside ? 1 : 0;
      kick();
    };
    const onLeave = () => {
      strengthTarget = 0;
      kick();
    };

    // на мобильных и планшетах точки статичные, без реакции на курсор
    const interactive = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (interactive) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("mouseleave", onLeave);
    }
    // при скролле курсор стоит, а блок едет — пересчитываем через следующий pointermove
    resize();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [gap, radius, hoverRadius, reach]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none ${className}`} />;
}
