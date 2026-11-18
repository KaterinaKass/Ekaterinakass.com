"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useContent } from "@/i18n/LocaleProvider";
import { gsap, MOTION_OK, useGsap } from "@/lib/gsap";
import { backOut, CARD_ENTER, cardJitter, SideLines } from "./ShippedWork";
import { ArrowIcon, SliderArrows } from "./SliderArrows";

const DRAG_THRESHOLD = 5; // px до начала перетаскивания мышью
const RUBBER = 0.35; // сопротивление, когда ленту тянут за край
const ENTER_RISE = 0.9; // карточка въезжает снизу с расстояния 0.9 высоты экрана

/**
 * Вид ленты, как у «Work I've shipped»: десктоп с мышью — "rail" (лента двигается трансформом, карточки
 * вылетают снизу с креном, ряд листается стрелками, мышью и тачпадом); телефон, тач и «меньше движения» —
 * "native" (обычная горизонтальная прокрутка со snap, без анимации появления).
 */
function readMode(): "rail" | "native" {
  const mq = (q: string) => window.matchMedia(q).matches;
  const touch = mq("(hover: none)") || mq("(pointer: coarse)") || navigator.maxTouchPoints > 0;
  return window.innerWidth >= 768 && !touch && !mq("(prefers-reduced-motion: reduce)") ? "rail" : "native";
}

let modeCache: "rail" | "native" | null = null;
const noop = () => () => {};

/**
 * Блок услуг по образцу intrepide.lu: заголовок и подзаголовок, под ними лента квадратных карточек,
 * ниже стрелки и текст в две колонки.
 * Десктоп: карточки 40vw, ч/б, при наведении цветные и название ярче, за курсором едет кружок «View work»,
 * стрелки под карточками. Телефон: карточки на всю ширину (−48px), сразу цветные, листание свайпом.
 */
export function Services() {
  const { services } = useContent();
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  // вид читается один раз после гидрации (на сервере — "native")
  const mode = useSyncExternalStore(noop, () => (modeCache ??= readMode()), () => "native" as const);
  const [edge, setEdge] = useState({ start: true, end: false });
  const nav = useRef<{ go: (dir: -1 | 1) => void }>({ go: () => {} });

  useEffect(() => {
    const t = track.current;
    if (!t) return;
    const cards = () => Array.from(t.querySelectorAll<HTMLElement>(".svc-card"));
    const pad = (side: "Left" | "Right") => parseFloat(getComputedStyle(t)[`padding${side}`]) || 0;
    const reduced = () => !window.matchMedia(MOTION_OK).matches;

    if (mode === "native") {
      // обычная прокрутка: стрелки (на планшете с мышью) листают scrollLeft
      const update = () => setEdge({ start: t.scrollLeft <= 4, end: t.scrollLeft >= t.scrollWidth - t.clientWidth - 4 });
      const nearest = () => {
        const x = t.scrollLeft + pad("Left");
        const list = cards();
        return list.reduce((b, c, i) => (Math.abs(c.offsetLeft - x) < Math.abs(list[b].offsetLeft - x) ? i : b), 0);
      };
      nav.current.go = (dir) => {
        const c = cards()[Math.max(0, Math.min(cards().length - 1, nearest() + dir))];
        t.scrollTo({ left: c.offsetLeft - pad("Left"), behavior: reduced() ? "auto" : "smooth" });
      };
      update();
      t.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      return () => {
        t.removeEventListener("scroll", update);
        window.removeEventListener("resize", update);
      };
    }

    // ---- rail: лента двигается трансформом, карточки не обрезаются по высоте и могут вылетать снизу ----
    t.scrollLeft = 0;
    let x = 0;
    const maxShift = () => {
      const list = cards();
      const last = list[list.length - 1];
      return Math.max(0, last.offsetLeft + last.offsetWidth + pad("Right") - t.clientWidth);
    };
    const pos = (i: number) => Math.min(cards()[i].offsetLeft - pad("Left"), maxShift());
    const nearest = () => {
      const list = cards();
      return list.reduce((b, _, i) => (Math.abs(pos(i) + x) < Math.abs(pos(b) + x) ? i : b), 0);
    };
    const update = () => setEdge({ start: x >= -2, end: x <= -maxShift() + 2 });
    const apply = () => {
      gsap.set(t, { x });
      update();
    };
    let goal: number | null = null; // карточка, к которой лента едет после стрелки (быстрые клики складываются)
    const mover = { v: 0 };
    const tweenTo = (target: number) => {
      mover.v = x;
      gsap.to(mover, {
        v: target,
        duration: 0.8,
        ease: "power3.out",
        overwrite: true,
        onUpdate: () => {
          x = mover.v;
          apply();
        },
        onComplete: () => void (goal = null),
      });
    };
    const snap = () => {
      goal = null;
      tweenTo(-pos(nearest()));
    };
    nav.current.go = (dir) => {
      const n = cards().length;
      let i = goal ?? nearest();
      // следующая карточка, у которой позиция действительно другая (в конце позиции упираются в край)
      do i += dir;
      while (i > 0 && i < n - 1 && pos(i) === pos(i - dir));
      goal = Math.max(0, Math.min(n - 1, i));
      tweenTo(-pos(goal));
    };
    const clampRubber = (v: number) => {
      const min = -maxShift();
      if (v > 0) return v * RUBBER;
      if (v < min) return min + (v - min) * RUBBER;
      return v;
    };

    // перетаскивание мышью
    let pid = -1;
    let pending = false;
    let dragging = false;
    let sx = 0;
    let sy = 0;
    let x0 = 0;
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      pid = e.pointerId;
      pending = true;
      dragging = false;
      sx = e.clientX;
      sy = e.clientY;
      x0 = x;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerId !== pid) return;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (pending) {
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
        pending = false;
        if (Math.abs(dy) > Math.abs(dx)) return void (pid = -1); // вертикаль — это прокрутка страницы
        dragging = true;
        gsap.killTweensOf(mover);
        goal = null;
        t.dataset.drag = "on";
        try {
          t.setPointerCapture(pid);
        } catch {}
      }
      if (!dragging) return;
      e.preventDefault();
      x = clampRubber(x0 + dx);
      apply();
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== pid) return;
      pid = -1;
      if (!dragging) return;
      dragging = false;
      delete t.dataset.drag;
      snap();
      // клик после перетаскивания не должен открывать ссылку
      const block = (ev: MouseEvent) => ev.preventDefault();
      t.addEventListener("click", block, { capture: true, once: true });
      setTimeout(() => t.removeEventListener("click", block, { capture: true }), 0);
    };
    // горизонтальная прокрутка тачпадом
    let wheelTimer = 0;
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      gsap.killTweensOf(mover);
      goal = null;
      x = clampRubber(x - e.deltaX);
      apply();
      clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(snap, 140);
    };
    const resize = () => {
      x = -pos(nearest());
      apply();
    };

    t.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    t.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("resize", resize);
    apply();
    return () => {
      clearTimeout(wheelTimer);
      t.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      t.removeEventListener("wheel", wheel);
      window.removeEventListener("resize", resize);
      gsap.set(t, { clearProps: "transform" });
    };
  }, [mode]);

  // появление карточек как у «Work I've shipped»: по прокрутке каждая вылетает снизу с креном и сдвигом вбок,
  // масштаб 0.92 → 1, доезжает с лёгким перелётом; следующая стартует чуть позже. Только в режиме rail.
  useEffect(() => {
    const el = root.current;
    if (mode !== "rail" || !el) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".svc-card", el);
      const tl = gsap.timeline({
        defaults: { ease: backOut },
        scrollTrigger: { trigger: el.querySelector(".svc-slider"), start: "top 90%", end: "top 20%", scrub: true, invalidateOnRefresh: true },
      });
      // заголовок: проявляется и поднимается на 28px с масштабом 0.97 → 1, как у «Work I've shipped»
      gsap.from(el.querySelector(".svc-head"), {
        autoAlpha: 0,
        y: 28,
        scale: 0.97,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: el.querySelector(".svc-head"), start: "top 85%" },
      });
      cards.forEach((card, k) => {
        const j = cardJitter(k);
        gsap.set(card, { zIndex: (cards.length - k) * 20 });
        tl.fromTo(
          card,
          { y: () => window.innerHeight * ENTER_RISE, x: j.x, rotation: j.rot, scale: CARD_ENTER.scaleFrom },
          { y: 0, x: 0, rotation: 0, scale: 1, duration: CARD_ENTER.dur + j.dur },
          CARD_ENTER.start + CARD_ENTER.stagger * k,
        );
      });
      tl.to({}, { duration: Math.max(0, 1 - tl.duration()) }); // общая длина фазы — 1, как у сцены проектов
    }, el);
    return () => ctx.revert();
  }, [mode]);

  useGsap(root, ({ q, root }) => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(q(".svc-outro > *"), {
        y: 30,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: q(".svc-outro")[0], start: "top 85%" },
      });
    });

    // кружок за курсором: появляется над карточкой, едет за мышью (только десктоп с мышью)
    mm.add("(min-width: 768px) and (pointer: fine)", () => {
      const wrap = root.querySelector<HTMLElement>(".svc-slider")!;
      const cta = root.querySelector<HTMLElement>(".svc-cta")!;
      gsap.set(cta, { xPercent: -50, yPercent: -50, scale: 0 });
      const xTo = gsap.quickTo(cta, "x", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(cta, "y", { duration: 0.4, ease: "power3" });
      let shown = false;
      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const r = wrap.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const target = e.target as HTMLElement;
        const over = !!target.closest(".svc-card");
        if (over && !shown) {
          gsap.set(cta, { x, y });
          gsap.to(cta, { scale: 1, duration: 0.45, ease: "back.out(1.8)", overwrite: "auto" });
        } else if (!over && shown) {
          gsap.to(cta, { scale: 0, duration: 0.3, ease: "power2.in", overwrite: "auto" });
        }
        shown = over;
        xTo(x);
        yTo(y);
      };
      const leave = () => {
        shown = false;
        gsap.to(cta, { scale: 0, duration: 0.3, ease: "power2.in", overwrite: "auto" });
      };
      wrap.addEventListener("pointermove", move);
      wrap.addEventListener("pointerleave", leave);
      return () => {
        wrap.removeEventListener("pointermove", move);
        wrap.removeEventListener("pointerleave", leave);
      };
    });
  });

  return (
    // z-[45] — выше общих линий рамки (FrameLines, z-40), как у «Work I've shipped»: карточки лежат поверх линий,
    // а свои линии (SideLines) блок рисует под карточками
    <div ref={root} className="relative z-[45]">
      <section id="services" className="relative w-full overflow-hidden bg-cream pt-16 pb-24 md:pt-[120px] md:pb-[160px]">
        <SideLines />
        {/* заголовок и подзаголовок — тем же стилем, что у «Work I've shipped» */}
        <div className="svc-head relative z-[3] px-6 text-center md:px-[5%]">
          <h2 className="font-display text-[32px] leading-none text-ink uppercase md:text-[clamp(40px,4.4vw,64px)]">{services.title}</h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[16px] leading-[1.35] text-ink md:mt-6 md:text-[20px]">{services.subtitle}</p>
        </div>

        {/* лента карточек */}
        <div className="svc-slider relative z-[3] mt-10 md:mt-[60px]">
          <div
            ref={track}
            data-mode={mode}
            className="svc-track flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-6 px-6 [scrollbar-width:none] data-[drag=on]:cursor-grabbing data-[drag=on]:select-none data-[mode=rail]:cursor-grab data-[mode=rail]:snap-none data-[mode=rail]:overflow-visible md:gap-6 md:scroll-px-[5%] md:px-[5%] [&::-webkit-scrollbar]:hidden"
          >
            {services.items.map((s) => (
              <a
                key={s.title}
                href={services.hoverHref}
                draggable={false}
                className="svc-card group relative block aspect-square w-[calc(100vw-48px)] shrink-0 snap-start overflow-hidden rounded-2xl bg-ink select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:w-[40vw] md:cursor-none"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt=""
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover transition-[filter,scale] duration-500 ease-out md:grayscale md:group-hover:scale-[1.03] md:group-hover:grayscale-0 md:group-focus-visible:grayscale-0"
                />
                <span aria-hidden className="absolute inset-0 bg-ink/25" />
                <h3 className="font-display absolute top-1/2 left-1/2 w-[calc(100%-40px)] -translate-x-1/2 -translate-y-1/2 text-center text-[32px] leading-[1.05] text-cream uppercase transition-opacity duration-300 md:text-[clamp(36px,4.2vw,60px)] md:opacity-60 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                  {s.title}
                </h3>
              </a>
            ))}
          </div>

          {/* кружок у курсора над карточкой */}
          <span
            aria-hidden
            className="svc-cta pointer-events-none absolute top-0 left-0 z-[300] hidden size-[132px] flex-col items-center justify-center gap-2 rounded-full bg-cream/85 px-4 text-center text-[18px] leading-[1.1] font-medium text-ink backdrop-blur-sm md:flex"
          >
            {services.hoverCta}
            <ArrowIcon dir="right" />
          </span>
        </div>

        {/* под карточками: стрелки (только десктоп), ниже текст в две колонки */}
        <div className="svc-outro relative z-[3] mx-auto mt-10 flex max-w-[812px] flex-col items-center gap-10 px-6 md:mt-12 md:gap-[60px]">
          <SliderArrows
            prevLabel={services.prev}
            nextLabel={services.next}
            onPrev={() => nav.current.go(-1)}
            onNext={() => nav.current.go(1)}
            prevDisabled={edge.start}
            nextDisabled={edge.end}
          />
          <p className="w-full gap-6 text-[16px] leading-[1.45] text-ink md:columns-2 md:text-[18px]">{services.outro}</p>
        </div>
      </section>
    </div>
  );
}
