"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { content } from "@/content";

const { shipped } = content;
const N = shipped.items.length;

// Числа из reference/sarottofabio-shipped-cards/MECHANIC.md
const MOTION = {
  sceneVh: (n: number) => 220 + (n - 1) * 60 - 15, // высота сцены, vh (5 карточек → 445, у нас 6 → 505)
  progressLead: 0.15,   // прогресс стартует с запасом 0.15 экрана
  enterScreens: 1.2,    // въезд карточек занимает 1.2 экрана прокрутки
  railPerCard: 0.6,     // лента: 0.6 экрана на каждую следующую карточку
  cardStart: 0.12,      // начало въезда первой карточки (доля фазы въезда)
  cardStagger: 0.08,    // сдвиг начала на каждую следующую
  cardDur: 0.42,        // длительность въезда (+ случайные 0…0.06)
  fanDeg: 1.5,          // постоянный наклон: градусы × номер от центра
  jitterRot: 18,        // случайный крен при въезде: ±9°
  jitterX: 90,          // случайный сдвиг вбок при въезде: ±45 px
  jitterDur: 0.06,
  seed: (k: number) => 77 * k + 13,
  rowScale: 0.833,      // масштаб ряда
  scaleFrom: 0.92,      // масштаб в начале въезда (× rowScale)
  headSpace: 240,       // место под заголовок сверху, px
  footSpace: 110,       // место под кнопку снизу, px
  cursorShift: 7,       // сдвиг за курсором во время въезда, px × номер от центра
  dragFrom: 0.8,        // перетаскивание включается, когда карточки встали
  dragThreshold: 5,     // px до начала перетаскивания
  clickCancel: 6,       // сдвиг, после которого клик по карточке не срабатывает, px
  titleIn: [0, 0.09] as const,  // заголовок: прозрачность (доля въезда)
  titleMove: [0, 0.1] as const, // заголовок: подъём 28 px и масштаб 0.97 → 1
  ctaIn: [0.82, 0.95] as const, // кнопка: прозрачность
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Въезд карточки: доезжает с лёгким перелётом (~3 %). */
const backOut = (u: number) => 1 + 1.9 * Math.pow(u - 1, 3) + 0.9 * Math.pow(u - 1, 2);
const range = (v: number, [a, b]: readonly [number, number]) => easeInOutCubic(clamp((v - a) / (b - a), 0, 1));

/** Детерминированный генератор (mulberry32): раскладка одинаковая при каждой загрузке. */
function seeded(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const JITTER = shipped.items.map((_, k) => {
  const r = seeded(MOTION.seed(k));
  return { rot: (r() - 0.5) * MOTION.jitterRot, x: (r() - 0.5) * MOTION.jitterX, dur: MOTION.jitterDur * r() };
});

const cardW = (w: number) => clamp(Math.round(0.3 * w), 420, 700);
const railStep = (w: number) => Math.max(cardW(w) + clamp(Math.round(0.035 * w), 48, 170), Math.round(0.25 * w));

function Header({ className = "" }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <h2 className="font-display text-[32px] leading-none text-ink uppercase md:text-[clamp(40px,4.4vw,64px)]">{shipped.title}</h2>
      <p className="mx-auto mt-4 max-w-[560px] px-6 text-[16px] leading-[1.35] text-ink md:mt-6 md:text-[20px]">{shipped.subtitle}</p>
    </div>
  );
}

function CardBody({ item, index }: { item: (typeof shipped.items)[number]; index: number }) {
  return (
    <>
      {item.cover ? (
        <Image src={item.cover} alt={`${item.name} — ${item.category}`} fill sizes="(max-width: 767px) 68vw, 700px" className="object-cover object-top" draggable={false} />
      ) : (
        // заглушка: замените на cover в content.ts
        <span className="absolute inset-0 grid place-items-center bg-[#efe7e1]">
          <span className="font-display text-[72px] leading-none text-line">{String(index + 1).padStart(2, "0")}</span>
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(transparent,rgba(36,36,36,0.35))]" />
      <span className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 rounded-xl bg-cream/90 px-4 py-3 backdrop-blur-md">
        <span className="text-[16px] leading-tight font-medium text-ink">{item.name}</span>
        <span className="text-[14px] leading-tight text-muted">{item.category}</span>
      </span>
    </>
  );
}

/** Копия боковых линий сайта (FrameLines) внутри блока: блок стоит выше глобальных линий,
 *  поэтому они рисуются здесь — под карточками, но над фоном. */
function SideLines() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-y-0 right-[5%] left-[5%] z-[2]">
      <span className="absolute inset-y-0 left-0 w-px bg-[#ACACAC]" />
      <span className="absolute inset-y-0 right-0 w-px bg-[#ACACAC]" />
    </div>
  );
}

const CARD_CLASS = "overflow-hidden rounded-2xl border border-black/[6%] shadow-[0_22px_48px_rgba(36,36,36,0.16),0_7px_16px_rgba(36,36,36,0.08)] select-none";

/**
 * «Work I've shipped». Десктоп с мышью: сцена закреплена, карточки вылетают снизу с креном и встают веером,
 * дальше прокрутка ведёт ряд влево; вставший ряд можно тянуть мышью и листать стрелками.
 * Телефон, тач и «меньше движения»: горизонтальная лента со snap, без анимации.
 */
/** Вид блока по устройству: "scene" или размер карточки ленты "w×h". Читается один раз после гидрации. */
function readLayout() {
  const mq = (q: string) => window.matchMedia(q).matches;
  const touch = mq("(hover: none)") || mq("(pointer: coarse)") || navigator.maxTouchPoints > 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const W = window.innerWidth;
  if (W >= 768 && !touch && !reduced) return "scene";
  if (W >= 768) return `${cardW(W)}x${Math.round((cardW(W) * 3) / 4)}`;
  const w = Math.round(0.68 * W);
  return `${w}x${Math.round((w * 4) / 3)}`;
}
let layoutCache: string | null = null;
const noop = () => () => {};

export function ShippedWork() {
  const layout = useSyncExternalStore(noop, () => (layoutCache ??= readLayout()), () => "280x373");
  if (layout === "scene") return <Scene />;
  const [w, h] = layout.split("x").map(Number);
  return <List card={{ w, h }} />;
}

function List({ card }: { card: { w: number; h: number } }) {
  const pad = `max(calc((100vw - ${card.w}px) / 2), 16px)`;
  return (
    <section id="shipped" className="relative z-[45] flex h-svh w-full flex-col items-center gap-[clamp(16px,3vh,32px)] bg-cream pt-[10vh] pb-[112px] lg:pb-[clamp(12px,3.5vh,36px)]">
      <SideLines />
      <Header className="relative z-[3] shrink-0" />
      {/* -my-20 / py-20: запас под тень карточек, иначе лента (overflow) срезает её; раскладка не меняется */}
      <div
        className="relative z-[3] -my-20 flex min-h-0 w-full flex-1 snap-x snap-mandatory items-center gap-4 overflow-x-auto overflow-y-hidden py-20 overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingInline: pad, scrollPaddingInline: pad }}
      >
        {shipped.items.map((item, i) => (
          <a key={i} href={item.href} className={`relative block h-full shrink-0 snap-center ${CARD_CLASS}`} style={{ width: card.w, maxHeight: card.h }} draggable={false}>
            <CardBody item={item} index={i} />
          </a>
        ))}
      </div>
      {shipped.cta && (
        <a href={shipped.ctaHref} className="relative z-[3] shrink-0 rounded-full bg-ink px-6 py-[14px] text-[16px] font-medium text-cream">
          {shipped.cta}
        </a>
      )}
    </section>
  );
}

function Scene() {
  const wrap = useRef<HTMLElement>(null);
  const titleLayer = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const cta = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLAnchorElement[]>([]);
  const moved = useRef(false); // был перетаск — клик по карточке гасим

  useEffect(() => {
    const el = wrap.current!;
    let enter = 0; // фаза въезда 0…1
    let rail = 0;  // фаза ленты 0…1
    let settled = 0;
    let drag = 0;  // сдвиг ряда мышью, px
    let mx = 0;    // курсор по X, −1…1

    const half = () => ((N - 1) / 2) * railStep(window.innerWidth);
    const pinned = () => {
      const r = el.getBoundingClientRect();
      return r.top <= 1 && r.bottom >= window.innerHeight - 1;
    };

    function progress() {
      const vh = window.innerHeight;
      const p = clamp(-el.getBoundingClientRect().top, 0, el.offsetHeight - vh) + MOTION.progressLead * vh;
      enter = clamp(p / (MOTION.enterScreens * vh), 0, 1);
      rail = clamp((p - MOTION.enterScreens * vh) / ((N - 1) * MOTION.railPerCard * vh), 0, 1);
    }

    function render() {
      const W = window.innerWidth, vh = window.innerHeight;
      const w = cardW(W), h = Math.round((w * 3) / 4), step = railStep(W), hf = half();
      settled = clamp((enter - MOTION.dragFrom) / 0.1, 0, 1);

      const l = layer.current!;
      l.style.pointerEvents = enter > 0.1 ? "auto" : "none";
      l.style.cursor = dragging ? "grabbing" : settled > 0.8 ? "grab" : "default";

      const shift = -2 * hf * rail + drag;
      const centerY = MOTION.headSpace + (vh - MOTION.headSpace - MOTION.footSpace) / 2 - vh / 2;
      cards.current.forEach((card, k) => {
        const c = k - (N - 1) / 2, j = JITTER[k];
        const u = clamp((enter - (MOTION.cardStart + MOTION.cardStagger * k)) / (MOTION.cardDur + j.dur), 0, 1);
        const e = backOut(u);
        const x = c * step + hf + j.x * (1 - e) + shift * settled + MOTION.cursorShift * mx * c * (1 - settled);
        const y = centerY + (1 - e) * vh;
        const rot = MOTION.fanDeg * c + j.rot * (1 - e);
        const sc = MOTION.rowScale * (MOTION.scaleFrom + (1 - MOTION.scaleFrom) * Math.min(e, 1));
        card.style.width = `${w}px`;
        card.style.height = `${h}px`;
        card.style.margin = `${-h / 2}px 0 0 ${-w / 2}px`;
        card.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg) scale(${sc})`;
        card.style.zIndex = String((N - k) * 20);
      });

      titleLayer.current!.style.opacity = String(range(enter, MOTION.titleIn));
      const t = range(enter, MOTION.titleMove);
      title.current!.style.transform = `translateY(${28 * (1 - t)}px) scale(${0.97 + 0.03 * t})`;
      cta.current!.style.opacity = String(range(enter, MOTION.ctaIn));
      cta.current!.style.pointerEvents = settled > 0.8 ? "auto" : "none";
    }

    const update = () => { progress(); render(); };

    // перетаскивание ряда мышью
    let pid = -1, pending = false, dragging = false, x0 = 0, y0 = 0, d0 = 0, raf = 0;
    const lim = () => half();
    const down = (e: PointerEvent) => {
      if (settled < 0.8 || e.button !== 0) return;
      pid = e.pointerId; pending = true; dragging = false; x0 = e.clientX; y0 = e.clientY; d0 = drag; moved.current = false;
    };
    const move = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      if (pid >= 0 && e.pointerId === pid) {
        const dx = e.clientX - x0, dy = e.clientY - y0;
        if (pending) {
          if (Math.abs(dx) < MOTION.dragThreshold && Math.abs(dy) < MOTION.dragThreshold) return;
          pending = false;
          if (Math.abs(dy) > Math.abs(dx)) { pid = -1; return; } // вертикаль — это прокрутка
          dragging = true;
          try { layer.current!.setPointerCapture(e.pointerId); } catch {}
          layer.current!.style.cursor = "grabbing";
        }
        if (dragging) {
          e.preventDefault();
          drag = clamp(d0 + dx, -lim(), lim());
          if (Math.abs(dx) > MOTION.clickCancel) moved.current = true;
        }
      }
      if (!raf && (dragging || settled < 1)) raf = requestAnimationFrame(() => { raf = 0; render(); });
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== pid) return;
      try { layer.current!.releasePointerCapture(pid); } catch {}
      pid = -1; pending = false; dragging = false;
      render();
    };
    const key = (e: KeyboardEvent) => {
      if (settled < 0.8 || !pinned()) return;
      const step = railStep(window.innerWidth);
      if (e.key === "ArrowLeft") drag = clamp(drag + step, -lim(), lim());
      else if (e.key === "ArrowRight") drag = clamp(drag - step, -lim(), lim());
      else return;
      render();
    };

    const l = layer.current!;
    l.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("keydown", key);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      l.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("keydown", key);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="shipped" ref={wrap} className="relative z-[45] w-full bg-cream" style={{ height: `${MOTION.sceneVh(N)}vh` }}>
      <div className="sticky top-0 h-svh overflow-hidden">
        <SideLines />
        <div ref={titleLayer} className="pointer-events-none absolute inset-0 z-[1] flex justify-center pt-[10vh]" style={{ opacity: 0 }}>
          <div ref={title} className="origin-top will-change-transform" style={{ transform: "translateY(28px) scale(0.97)" }}>
            <Header />
          </div>
        </div>

        <div ref={layer} className="absolute inset-0 z-[4] touch-pan-y" style={{ pointerEvents: "none" }}>
          {shipped.items.map((item, i) => (
            <a
              key={i}
              href={item.href}
              ref={(n) => { if (n) cards.current[i] = n; }}
              onClick={(e) => { if (moved.current) e.preventDefault(); }}
              onDragStart={(e) => e.preventDefault()}
              className={`absolute top-1/2 left-1/2 block will-change-transform ${CARD_CLASS}`}
              style={{ transform: "translate3d(0, 120vh, 0)" }}
            >
              <CardBody item={item} index={i} />
            </a>
          ))}
        </div>

        <div ref={cta} className="absolute inset-x-0 bottom-[6.5%] z-30 flex justify-center" style={{ opacity: 0, pointerEvents: "none" }}>
          {shipped.cta && (
            <a href={shipped.ctaHref} className="rounded-full bg-ink px-6 py-[14px] text-[16px] font-medium text-cream">
              {shipped.cta}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
