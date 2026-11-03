"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  className?: string;
  /** ширина / высота исходной картинки, чтобы холст сразу был нужной формы */
  aspect: number;
  /** сколько «пикселей» по ширине картинки */
  columns?: number;
  /** на мобильном холст растягивается на всю ширину экрана, и пиксели слетаются почти от краёв */
  wideOnMobile?: boolean;
};

// координаты в долях, а не в px: если холст поменяет размер посреди анимации (подгрузился шрифт,
// изменилась высота блока), пиксели просто пересчитаются под новый размер, а не растянутся
type Particle = {
  gx: number; gy: number; // куда прилетает: доля ширины / высоты картинки
  sx: number; sy: number; // откуда стартует: доля ширины / высоты холста
  delay: number;
  color: string;
};

const DURATION = 0.75; // сек, полёт одного пикселя
const SPREAD = 0.9; // сек, разброс стартов по рядам
const FADE = 0.35; // сек, переход от пикселей к чёткой картинке

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Картинка собирается из квадратных «пикселей»: изображение уменьшается до сетки,
 * каждый квадрат летит из случайной точки на своё место (снизу вверх по рядам),
 * в конце пиксели сменяются оригиналом. Старт, когда элемент наполовину на экране.
 */
export function PixelAssemble({ src, aspect, className = "", columns = 36, wideOnMobile = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.src = src;
    let raf = 0;
    let state: "idle" | "playing" | "done" = "idle";
    let io: IntersectionObserver | undefined;
    let cancelled = false;

    // Геометрия: в «широком» режиме (мобильный) холст = вся ширина экрана, картинка рисуется по центру;
    // иначе холст ровно по картинке. imgW/offX — где внутри холста стоит сама картинка.
    let geo = { cssW: 0, cssH: 0, imgW: 0, offX: 0, wide: false };
    const setup = () => {
      const wide = wideOnMobile && window.innerWidth < 768;
      canvas.style.width = wide ? "100vw" : "";
      canvas.style.aspectRatio = wide ? "auto" : String(aspect);
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      const imgW = wide ? cssH * aspect : cssW;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      geo = { cssW, cssH, imgW, offX: (cssW - imgW) / 2, wide };
      return geo;
    };

    const drawFinal = (alpha = 1) => {
      ctx.globalAlpha = alpha;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, geo.offX, 0, geo.imgW, geo.cssH);
      ctx.globalAlpha = 1;
    };

    const cols = columns;
    let rows = 0;
    const buildParticles = () => {
      const { wide } = geo;
      rows = Math.round((cols * img.naturalHeight) / img.naturalWidth);
      // уменьшаем картинку до сетки: каждый пиксель = средний цвет клетки
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const octx = off.getContext("2d")!;
      octx.drawImage(img, 0, 0, cols, rows);
      const data = octx.getImageData(0, 0, cols, rows).data;

      // широкий режим: пиксели стартуют по всей ширине холста (почти от краёв экрана), как в референсе;
      // обычный — облаком вокруг фигуры

      const parts: Particle[] = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          if (data[i + 3] < 110) continue; // пропускаем прозрачные клетки
          const gx = x / cols;
          const gy = y / rows;
          const ang = Math.random() * Math.PI * 2;
          const dist = (0.35 + Math.random() * 0.65) * 1.1; // в ширинах картинки (в обычном режиме холст = картинка)
          parts.push({
            gx,
            gy,
            sx: wide ? 0.03 + Math.random() * 0.94 : gx + Math.cos(ang) * dist,
            sy: wide ? gy + (Math.random() - 0.5) * 0.9 + 0.1 : gy + Math.sin(ang) * dist * 0.6 * aspect + 0.15,
            // нижние ряды раньше, плюс немного случайности
            delay: (1 - y / rows) * SPREAD + Math.random() * 0.25,
            color: `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`,
          });
        }
      }
      return parts;
    };

    const play = () => {
      state = "playing";
      setup();
      const parts = buildParticles();
      const total = SPREAD + 0.25 + DURATION;
      const t0 = performance.now();

      const frame = (now: number) => {
        const t = (now - t0) / 1000;
        const { cssW, cssH, imgW, offX } = geo; // geo читаем каждый кадр — он мог обновиться при ресайзе
        const cellW = imgW / cols;
        const cellH = cssH / rows;
        ctx.clearRect(0, 0, cssW, cssH);

        const pixelAlpha = t < total ? 1 : Math.max(0, 1 - (t - total) / FADE);
        if (pixelAlpha > 0) {
          for (const p of parts) {
            const k = Math.min(1, Math.max(0, (t - p.delay) / DURATION));
            if (k <= 0) continue;
            const e = easeOutCubic(k);
            ctx.globalAlpha = Math.min(1, k * 2) * pixelAlpha;
            ctx.fillStyle = p.color;
            // +0.6px, чтобы между соседними пикселями не было щелей
            const sx = p.sx * cssW;
            const sy = p.sy * cssH;
            const tx = offX + p.gx * imgW;
            const ty = p.gy * cssH;
            ctx.fillRect(sx + (tx - sx) * e, sy + (ty - sy) * e, cellW + 0.6, cellH + 0.6);
          }
          ctx.globalAlpha = 1;
        }
        if (t >= total) drawFinal(1 - pixelAlpha);
        if (t < total + FADE) raf = requestAnimationFrame(frame);
        else state = "done";
      };
      raf = requestAnimationFrame(frame);
    };

    img.onload = () => {
      if (cancelled) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setup();
        drawFinal();
        state = "done";
        return;
      }
      setup(); // пустой холст нужного размера, пока не начали
      io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          io?.disconnect();
          play();
        },
        { threshold: 0.5 },
      );
      io.observe(canvas);
    };

    // Следим за размером самого холста, а не окна: высота блока может поменяться и без ресайза окна
    // (например, когда догрузился шрифт имени). Тогда пересчитываем холст, иначе браузер растянет
    // уже нарисованную картинку по одной оси. Во время анимации кадры сами подхватят новый geo.
    let lastW = 0;
    let lastH = 0;
    const onResize = () => {
      if (!img.complete || !img.naturalWidth) return;
      const wide = wideOnMobile && window.innerWidth < 768;
      if (wide === geo.wide && canvas.clientWidth === lastW && canvas.clientHeight === lastH) return;
      setup();
      lastW = geo.cssW;
      lastH = geo.cssH;
      if (state === "done") drawFinal();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      io?.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [src, columns, aspect, wideOnMobile]);

  return <canvas ref={canvasRef} aria-hidden className={className} style={{ aspectRatio: aspect }} />;
}
