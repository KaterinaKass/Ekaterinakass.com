"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { DndContext, DragOverlay, PointerSensor, closestCenter, defaultDropAnimationSideEffects, useSensor, useSensors, type DropAnimation } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { content } from "@/content";
import { gsap, MOTION_OK, useGsap } from "@/lib/gsap";
import { SplitChars } from "./SplitChars";

const { process: copy } = content;

// Числа из reference/sarottofabio-process/MECHANIC.md
const MOTION = {
  // точки в форме иконки на плитках-принципах
  dots: {
    raster: 120,          // иконка растрируется в 120×120
    alphaCut: 110,        // точка там, где альфа иконки > 110
    area: 1.5,            // иконка занимает квадрат 1.5 × max(ширина, высота) плитки
    step: 13,             // шаг сетки точек, px
    radius: 2.21,         // радиус точки, px; под курсором × (1 + 1.5·o)
    grow: 1.5,
    falloff: 14450,       // o = H · exp(−d² / 14450), σ ≈ 85 px
    ringFrom: 0.35,       // кольцо вокруг точки, когда o > 0.35
    ringGap: 2.5,
    follow: 0.18,         // пятно догоняет курсор: доля пути за кадр
    fadeIn: 0.12,         // H растёт к 1
    fadeOut: 0.08,        // H гаснет
    maxDpr: 2,
  },
  // счётчики в плитке итогов
  odometer: {
    duration: 1300,       // мс
    ease: "cubic-bezier(0.16, 1, 0.3, 1)",
    delay: 150,           // мс, первый ряд
    rowStep: 180,         // мс между рядами
    charStep: 70,         // мс между символами в ряду
    signDuration: 600,    // не-цифры проявляются снизу
    signShift: "0.35em",
    line: "0.88em",       // высота строки числа
    margin: "-15% 0px",   // порог появления
    hoverScale: 1.05,     // наведение на ряд; у оригинала пружина stiffness 400, damping 30 — у нас GSAP-кривая
  },
  // теги навыков
  skills: {
    dragDistance: 5,      // px до начала перетаскивания
    swapEvery: 6,         // px движения между перестановками
    drop: { duration: 280, easing: "cubic-bezier(0.22, 1, 0.36, 1)" } as const,
    ghostOpacity: 0.3,    // место перетаскиваемого тега
    gravity: 1.3,
    restitution: 0.35,
    friction: 0.15,
    frictionAir: 0.015,
    buttonInset: 34,      // центр кнопки от правого-нижнего угла плитки, px
    maxSpeed: 5,          // скорость = min(5, 700 / расстояние до кнопки)
    speedK: 700,
    jitterX: 1.5,         // случайно ±0.75 по X
    spin: 0.2,            // случайное вращение ±0.1
    maxStep: 32,          // шаг физики не больше 32 мс
    tidyDuration: 620,    // возврат на место
    tidyStagger: 25,      // мс × номер тега
    tidyEase: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  marqueePerTool: 4,      // лента: 4 с на каждый логотип (6 → 24 с)
} as const;

/* ---------- иконки: линейные, как остальные иконки сайта (обводка 2, скруглённые концы) ---------- */

export function LineIcon({ size = 48, children }: { size?: number; children: ReactNode }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

const ICONS: Record<"research" | "systems" | "outcomes", ReactNode> = {
  research: (
    <>
      <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" />
      <circle cx="12" cy="10.5" r="2.6" />
      <path d="M7.6 16.6c.9-1.7 2.5-2.6 4.4-2.6s3.5.9 4.4 2.6" />
    </>
  ),
  systems: (
    <>
      <path d="M12 3.5 3.5 8 12 12.5 20.5 8 12 3.5Z" />
      <path d="m3.5 12 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16 8.5 4.5 8.5-4.5" />
    </>
  ),
  outcomes: (
    <>
      <path d="M3.5 3.5v17h17" />
      <path d="m7.5 15 3.8-3.8 3 3 5.2-5.7" />
      <path d="M15.5 8.5h4v4" />
    </>
  ),
};

// Иконки кнопки взяты с референса: набор Phosphor (MIT), Bomb и ArrowCounterClockwise, начертание regular
function BombIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden>
      <path d="M248,32h0a8,8,0,0,0-8,8,52.66,52.66,0,0,1-3.57,17.39C232.38,67.22,225.7,72,216,72c-11.06,0-18.85-9.76-29.49-24.65C176,32.66,164.12,16,144,16c-16.39,0-29,8.89-35.43,25a66.07,66.07,0,0,0-3.9,15H88A16,16,0,0,0,72,72v9.59A88,88,0,0,0,112,248h1.59A88,88,0,0,0,152,81.59V72a16,16,0,0,0-16-16H120.88a46.76,46.76,0,0,1,2.69-9.37C127.62,36.78,134.3,32,144,32c11.06,0,18.85,9.76,29.49,24.65C184,71.34,195.88,88,216,88c16.39,0,29-8.89,35.43-25A68.69,68.69,0,0,0,256,40,8,8,0,0,0,248,32ZM140.8,94a72,72,0,1,1-57.6,0A8,8,0,0,0,88,86.66V72h48V86.66A8,8,0,0,0,140.8,94ZM111.89,209.32A8,8,0,0,1,104,216a8.52,8.52,0,0,1-1.33-.11,57.5,57.5,0,0,1-46.57-46.57,8,8,0,1,1,15.78-2.64,41.29,41.29,0,0,0,33.43,33.43A8,8,0,0,1,111.89,209.32Z" />
    </svg>
  );
}

function TidyIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 256 256" fill="currentColor" aria-hidden>
      <path d="M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L44.59,96H72a8,8,0,0,1,0,16H24a8,8,0,0,1-8-8V56a8,8,0,0,1,16,0V85.8L60.25,60A96,96,0,0,1,224,128Z" />
    </svg>
  );
}

/* ---------- точки в форме иконки, загораются под курсором ---------- */

export type Tone = { rgb: [number, number, number]; base: number; hover: number };

export function DotIconField({ icon, tone }: { icon: ReactNode; tone: Tone }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const source = useRef<HTMLDivElement>(null);
  const [r, g, b] = tone.rgb;

  useEffect(() => {
    const el = box.current;
    const cv = canvas.current;
    const svg = source.current?.querySelector("svg");
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !svg || !ctx) return;
    if (!window.matchMedia(MOTION_OK).matches || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const D = MOTION.dots;
    let dead = false;
    let mask: Uint8ClampedArray | null = null;
    let points = new Float32Array(0);
    let raf = 0;
    let x = -9999, y = -9999, tx = -9999, ty = -9999;
    let power = 0;
    let inside = false;

    const draw = () => {
      const w = el.clientWidth, h = el.clientHeight;
      ctx.clearRect(0, 0, w, h);
      if (power < 0.005) return;
      for (let i = 0; i < points.length; i += 2) {
        const px = points[i], py = points[i + 1];
        const dx = px - x, dy = py - y;
        const o = power * Math.exp(-(dx * dx + dy * dy) / D.falloff);
        const alpha = power * tone.base + (tone.hover - tone.base) * o;
        const rad = D.radius * (1 + D.grow * o);
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
        if (o > D.ringFrom) {
          ctx.beginPath();
          ctx.arc(px, py, rad + D.ringGap, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    };

    const layout = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h || !mask) return;
      const dpr = Math.min(window.devicePixelRatio || 1, D.maxDpr);
      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const size = D.area * Math.max(w, h);
      const ox = (w - size) / 2, oy = (h - size) / 2;
      const list: number[] = [];
      for (let py = D.step / 2; py < h; py += D.step) {
        for (let px = D.step / 2; px < w; px += D.step) {
          const cx = Math.floor(((px - ox) / size) * D.raster);
          const cy = Math.floor(((py - oy) / size) * D.raster);
          if (cx < 0 || cy < 0 || cx >= D.raster || cy >= D.raster) continue;
          if (mask[(cy * D.raster + cx) * 4 + 3] > D.alphaCut) list.push(px, py);
        }
      }
      points = new Float32Array(list);
      draw();
    };

    const tick = () => {
      x += (tx - x) * D.follow;
      y += (ty - y) * D.follow;
      power += inside ? (1 - power) * D.fadeIn : -power * D.fadeOut;
      draw();
      if (!inside && power < 0.01) {
        power = 0;
        draw();
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const run = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const local = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top] as const;
    };
    const onEnter = (e: PointerEvent) => {
      inside = true;
      [tx, ty] = local(e);
      x = tx;
      y = ty;
      run();
    };
    const onMove = (e: PointerEvent) => {
      [tx, ty] = local(e);
      if (!inside) {
        inside = true;
        x = tx;
        y = ty;
      }
      run();
    };
    const onLeave = () => {
      inside = false;
      run();
    };

    // иконку растрируем в маленький холст и берём альфу пикселей
    const markup = new XMLSerializer().serializeToString(svg);
    const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml" }));
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      if (dead) return;
      const off = document.createElement("canvas");
      off.width = off.height = D.raster;
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.drawImage(img, 0, 0, D.raster, D.raster);
      mask = octx.getImageData(0, 0, D.raster, D.raster).data;
      layout();
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;

    const ro = new ResizeObserver(layout);
    ro.observe(el);
    const tile = el.parentElement ?? el;
    tile.addEventListener("pointerenter", onEnter);
    tile.addEventListener("pointermove", onMove);
    tile.addEventListener("pointerleave", onLeave);
    return () => {
      dead = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      tile.removeEventListener("pointerenter", onEnter);
      tile.removeEventListener("pointermove", onMove);
      tile.removeEventListener("pointerleave", onLeave);
    };
  }, [r, g, b, tone.base, tone.hover]);

  return (
    <div ref={box} aria-hidden className="pointer-events-none absolute inset-0">
      <canvas ref={canvas} className="absolute inset-0" />
      <div ref={source} className="hidden">
        <LineIcon size={120}>{icon}</LineIcon>
      </div>
    </div>
  );
}

/* ---------- плитки-принципы ---------- */

export const TONES = {
  accent: { tile: "border-accent bg-accent text-cream", text: "text-cream/80", dots: { rgb: [247, 241, 237], base: 0.09, hover: 0.22 } },
  dark: { tile: "border-ink bg-ink text-cream", text: "text-cream/70", dots: { rgb: [247, 241, 237], base: 0.07, hover: 0.18 } },
  plain: { tile: "border-line bg-[#efe7e1] text-ink", text: "text-muted", dots: { rgb: [36, 36, 36], base: 0.05, hover: 0.14 } },
} satisfies Record<string, { tile: string; text: string; dots: Tone }>;

const TILE = "process-tile relative overflow-hidden rounded-2xl border";

function PillarTile({ pillar, tone, className }: { pillar: (typeof copy.pillars)[number]; tone: keyof typeof TONES; className: string }) {
  const t = TONES[tone];
  const icon = ICONS[pillar.icon];
  return (
    <div className={`${TILE} flex min-h-[220px] flex-col p-[26px] lg:min-h-0 ${t.tile} ${className}`}>
      <DotIconField icon={icon} tone={t.dots} />
      <div className="relative z-[1] mt-auto">
        <div className="mb-4">
          <LineIcon>{icon}</LineIcon>
        </div>
        <h3 className="mb-[10px] text-[24px] leading-[1.05] font-semibold tracking-[-0.02em]">{pillar.title}</h3>
        <p className={`text-[14px] leading-[1.5] ${t.text}`}>{pillar.text}</p>
      </div>
    </div>
  );
}

/* ---------- счётчик-одометр ---------- */

export function Odometer({ value, started, delay, still }: { value: string; started: boolean; delay: number; still: boolean }) {
  const O = MOTION.odometer;
  const rolls = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!started || still) return;
    const anims = Array.from(value).map((ch, i) => {
      const el = rolls.current[i];
      if (!el) return null;
      const at = delay + O.charStep * i;
      if (/\d/.test(ch)) {
        const n = 10 + Number(ch) + 1;
        return el.animate([{ transform: "translateY(0%)" }, { transform: `translateY(-${((n - 1) / n) * 100}%)` }], { duration: O.duration, delay: at, easing: O.ease, fill: "both" });
      }
      return el.animate(
        [{ opacity: 0, transform: `translateY(${O.signShift})` }, { opacity: 1, transform: "translateY(0)" }],
        { duration: O.signDuration, delay: at, easing: O.ease, fill: "both" },
      );
    });
    return () => anims.forEach((a) => a?.cancel());
  }, [started, still, value, delay, O]);

  return (
    <span className="inline-flex overflow-hidden" style={{ height: O.line }}>
      <span className="sr-only">{value}</span>
      {Array.from(value).map((ch, i) => {
        if (!/\d/.test(ch)) {
          return (
            <span key={i} ref={(el) => void (rolls.current[i] = el)} aria-hidden className="block" style={{ lineHeight: 0.88, opacity: still ? 1 : 0 }}>
              {ch}
            </span>
          );
        }
        const d = Number(ch);
        const reel = [...Array.from({ length: 10 }, (_, k) => k), ...Array.from({ length: d + 1 }, (_, k) => k)];
        const end = `translateY(-${((reel.length - 1) / reel.length) * 100}%)`;
        return (
          <span key={i} aria-hidden className="relative block overflow-hidden" style={{ height: O.line }}>
            <span className="invisible block" style={{ lineHeight: 0.88 }}>{ch}</span>
            <span ref={(el) => void (rolls.current[i] = el)} className="absolute inset-x-0 top-0 block" style={{ transform: still ? end : undefined }}>
              {reel.map((k, j) => (
                <span key={j} className="block text-center" style={{ height: O.line, lineHeight: 0.88 }}>{k}</span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}

function ResultsTile({ className }: { className: string }) {
  const tile = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- настройка «меньше движения» известна только в браузере
    if (!window.matchMedia(MOTION_OK).matches) return setStill(true);
    const el = tile.current!;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setStarted(true);
        io.disconnect();
      },
      { rootMargin: MOTION.odometer.margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const scale = (el: HTMLElement, to: number) => {
    if (still) return;
    gsap.to(el, { scale: to, duration: 0.35, ease: "back.out(1.6)", overwrite: true });
  };

  return (
    <div ref={tile} className={`${TILE} bg-dots flex min-h-[300px] flex-col border-accent p-[26px] text-cream lg:min-h-0 ${className}`}>
      {copy.results.map((item, i) => (
        <div
          key={item.value + i}
          className="relative z-[1] flex flex-1 cursor-default flex-col justify-center py-5"
          onMouseEnter={(e) => scale(e.currentTarget.querySelector<HTMLElement>(".process-num")!, MOTION.odometer.hoverScale)}
          onMouseLeave={(e) => scale(e.currentTarget.querySelector<HTMLElement>(".process-num")!, 1)}
        >
          <p className="mb-1 text-[14px] font-medium">{item.product}</p>
          <div className="process-num origin-left text-[56px] leading-[0.88] font-semibold tracking-[-0.03em]">
            <Odometer value={item.value} started={started} still={still} delay={MOTION.odometer.delay + MOTION.odometer.rowStep * i} />
          </div>
          <p className="mt-2 text-[14px] text-cream/80">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- навыки: перетаскивание и «встряска» ---------- */

const PILL = "inline-flex select-none items-center rounded-full border border-line bg-cream px-3.5 py-2 text-[13px] leading-none text-ink md:px-4 md:py-[10px] md:text-[14px]";

function Skill({ label, interactive, register }: { label: string; interactive: boolean; register: (label: string, el: HTMLLIElement | null) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id: label, disabled: !interactive });
  return (
    <li
      ref={(el) => {
        setNodeRef(el);
        register(label, el);
      }}
      {...attributes}
      {...listeners}
      className={`${PILL} touch-none will-change-transform ${interactive ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
      style={{ opacity: isDragging ? MOTION.skills.ghostOpacity : 1 }}
    >
      {label}
    </li>
  );
}

const dropAnimation: DropAnimation = {
  ...MOTION.skills.drop,
  sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: String(MOTION.skills.ghostOpacity) } } }),
};

function SkillsTile({ className }: { className: string }) {
  const S = MOTION.skills;
  const [items, setItems] = useState<string[]>(() => [...copy.skills]);
  const [active, setActive] = useState<string | null>(null);
  const [mode, setMode] = useState<"sorted" | "physics" | "restoring">("sorted");
  const [calm, setCalm] = useState(false);
  const tile = useRef<HTMLDivElement>(null);
  const els = useRef(new Map<string, HTMLLIElement>());
  const sim = useRef<{ stop: () => void } | null>(null);
  const lastSwap = useRef({ x: -Infinity, y: -Infinity });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- настройка «меньше движения» известна только в браузере
    setCalm(!window.matchMedia(MOTION_OK).matches);
    return () => sim.current?.stop();
  }, []);

  const register = useCallback((label: string, el: HTMLLIElement | null) => {
    if (el) els.current.set(label, el);
    else els.current.delete(label);
  }, []);

  const explode = async () => {
    const box = tile.current;
    if (!box || sim.current || active) return;
    const { Engine, Bodies, Body, Composite } = await import("matter-js");
    const rect = box.getBoundingClientRect();
    const engine = Engine.create({ enableSleeping: true });
    engine.gravity.y = S.gravity;
    const origin = { x: rect.width - S.buttonInset, y: rect.height - S.buttonInset };
    const bodies = [...els.current.values()].map((el) => {
      const r = el.getBoundingClientRect();
      const cx = r.left - rect.left + r.width / 2;
      const cy = r.top - rect.top + r.height / 2;
      const body = Bodies.rectangle(cx, cy, r.width, r.height, {
        chamfer: { radius: Math.min(r.width, r.height) / 2 - 1 },
        restitution: S.restitution,
        friction: S.friction,
        frictionAir: S.frictionAir,
      });
      const dx = cx - origin.x, dy = cy - origin.y;
      const dist = Math.hypot(dx, dy) || 1;
      const speed = Math.min(S.maxSpeed, S.speedK / dist);
      Body.setVelocity(body, { x: (dx / dist) * speed + (Math.random() - 0.5) * S.jitterX, y: (dy / dist) * speed });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * S.spin);
      return { el, body, cx, cy };
    });
    const w = rect.width, h = rect.height;
    const walls = [
      Bodies.rectangle(w / 2, h + 100, w + 400, 200, { isStatic: true }),
      Bodies.rectangle(-100, h / 2, 200, h * 4, { isStatic: true }),
      Bodies.rectangle(w + 100, h / 2, 200, h * 4, { isStatic: true }),
      Bodies.rectangle(w / 2, -160, w + 400, 200, { isStatic: true }),
    ];
    Composite.add(engine.world, [...walls, ...bodies.map((b) => b.body)]);
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      Engine.update(engine, Math.min(now - last, S.maxStep));
      last = now;
      let asleep = true;
      for (const { el, body, cx, cy } of bodies) {
        if (!body.isSleeping) asleep = false;
        el.style.transform = `translate(${body.position.x - cx}px, ${body.position.y - cy}px) rotate(${body.angle}rad)`;
      }
      raf = asleep ? 0 : requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    sim.current = { stop: () => raf && cancelAnimationFrame(raf) };
    setMode("physics");
  };

  const tidy = () => {
    sim.current?.stop();
    sim.current = null;
    setMode("restoring");
    let total = 0;
    [...els.current.values()].forEach((el, i) => {
      const from = el.style.transform;
      el.style.transform = "";
      if (!from) return;
      const delay = S.tidyStagger * i;
      total = Math.max(total, S.tidyDuration + delay);
      el.animate([{ transform: from }, { transform: "translate(0px, 0px) rotate(0rad)" }], { duration: S.tidyDuration, delay, easing: S.tidyEase, fill: "backwards" });
    });
    window.setTimeout(() => setMode("sorted"), total);
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: S.dragDistance } }));
  const sorted = mode === "sorted";

  return (
    <div ref={tile} className={`${TILE} flex items-center border-line bg-[#efe7e1] p-5 md:p-[26px] ${className}`}>
      {!calm && (
        <button
          type="button"
          onClick={sorted ? explode : tidy}
          disabled={mode === "restoring"}
          aria-label={sorted ? copy.explode : copy.tidy}
          title={sorted ? copy.explode : copy.tidy}
          className="absolute right-[14px] bottom-[14px] z-10 grid size-10 cursor-pointer place-items-center rounded-full border border-line bg-cream text-muted transition-colors hover:text-ink disabled:cursor-default disabled:opacity-40"
        >
          {sorted ? <BombIcon /> : <TidyIcon />}
        </button>
      )}
      <DndContext
        id="process-skills"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active: a }) => {
          setActive(String(a.id));
          lastSwap.current = { x: -Infinity, y: -Infinity };
        }}
        onDragOver={({ active: a, over, delta }) => {
          if (!over || a.id === over.id) return;
          if (Math.hypot(delta.x - lastSwap.current.x, delta.y - lastSwap.current.y) < S.swapEvery) return;
          lastSwap.current = { x: delta.x, y: delta.y };
          setItems((list) => {
            const from = list.indexOf(String(a.id));
            const to = list.indexOf(String(over.id));
            return from < 0 || to < 0 ? list : arrayMove(list, from, to);
          });
        }}
        onDragEnd={() => setActive(null)}
        onDragCancel={() => setActive(null)}
      >
        {/* теги сразу меняются местами в списке, поэтому сдвигать соседей не нужно */}
        <SortableContext items={items} strategy={() => null}>
          <ul className="flex flex-wrap gap-[10px] pb-12 md:pb-0 md:pr-10">
            {items.map((label) => (
              <Skill key={label} label={label} interactive={sorted} register={register} />
            ))}
          </ul>
        </SortableContext>
        <DragOverlay dropAnimation={dropAnimation}>{active && <li className={`${PILL} cursor-grabbing list-none shadow-lg`}>{active}</li>}</DragOverlay>
      </DndContext>
    </div>
  );
}

/* ---------- инструменты: бегущая лента логотипов ---------- */

function ToolsTile({ className }: { className: string }) {
  const twice = [...copy.tools, ...copy.tools];
  const reel = [...twice, ...twice];
  return (
    <div className={`${TILE} flex min-h-[180px] items-center border-ink bg-ink py-[26px] lg:min-h-0 ${className}`}>
      <div className="relative w-full overflow-hidden">
        <div className="tools-marquee flex w-max items-center" style={{ "--marquee-duration": `${MOTION.marqueePerTool * copy.tools.length}s` } as React.CSSProperties}>
          {reel.map((name, i) => (
            <div key={`${name}-${i}`} aria-hidden={i >= copy.tools.length || undefined} className="flex shrink-0 flex-col items-center gap-[10px] pr-8">
              <Image src={`/images/tools/${name.toLowerCase()}.webp`} alt={i < copy.tools.length ? name : ""} width={52} height={52} className="size-[52px] object-contain" draggable={false} />
              <span className="text-[12px] font-medium whitespace-nowrap text-cream/70">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- блок ---------- */

/** «Process is the product»: принципы с точками за курсором, итоги-счётчики, навыки с перетаскиванием и лента инструментов. */
export function ProcessSection() {
  const root = useRef<HTMLElement>(null);

  // появление в стиле сайта (как у блока отзывов): буквы заголовка из масок, текст и плитки снизу
  useGsap(root, ({ q }) => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 75%" } })
        .from(q(".process-char"), { yPercent: 115, stagger: 0.025, duration: 0.9, ease: "power4.out" })
        .from(q(".process-fade"), { y: 24, opacity: 0, duration: 0.8, ease: "power3.out" }, 0.2);
      q(".process-tile").forEach((tile, i) => {
        gsap.from(tile, { y: 32, opacity: 0, duration: 0.8, delay: (i % 4) * 0.06, ease: "power3.out", scrollTrigger: { trigger: tile, start: "top 90%" } });
      });
    });
  });

  return (
    <section ref={root} id="process" className="relative z-10 w-full bg-cream py-16 md:py-[120px]">
      <div className="mx-auto w-[90%] px-3 md:px-[clamp(24px,3vw,48px)]">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-8 md:mb-[72px]">
            <h2 className="text-[9.8vw] leading-[1.08] font-normal text-ink md:text-[clamp(32px,5vw,64px)] md:leading-[1.14]">
              <span className="block font-semibold">
                <SplitChars text={copy.title[0]} charClass="process-char" />
              </span>
              <span className="block">
                <SplitChars text={copy.title[1]} charClass="process-char" />
              </span>
            </h2>
            <p className="process-fade max-w-[420px] text-[16px] leading-[1.5] text-muted md:text-[18px]">{copy.intro}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:auto-rows-[minmax(140px,auto)]">
            <PillarTile pillar={copy.pillars[0]} tone="accent" className="lg:col-start-1 lg:row-span-2 lg:row-start-1" />
            <PillarTile pillar={copy.pillars[1]} tone="dark" className="lg:col-start-2 lg:row-span-2 lg:row-start-1" />
            <PillarTile pillar={copy.pillars[2]} tone="plain" className="lg:col-start-3 lg:row-span-2 lg:row-start-1" />
            <ResultsTile className="lg:col-start-4 lg:row-span-3 lg:row-start-1" />
            <SkillsTile className="lg:col-span-2 lg:col-start-1 lg:row-start-3" />
            <ToolsTile className="lg:col-start-3 lg:row-start-3" />
          </div>
        </div>
      </div>
    </section>
  );
}
