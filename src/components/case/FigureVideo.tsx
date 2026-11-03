"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Img } from "./CaseUI";

export type Vid = Img & { video: string };

/**
 * Видео-мокап в той же рамке, что и Figure. Сначала видна картинка-превью (img.src),
 * видео начинает грузиться, только когда рамка подходит к экрану, и плавно
 * подменяет превью, когда готово играть. Зациклено, без звука.
 */
export function FigureVideo({ img, priority = false, sizes = "(min-width: 1024px) 70vw, 100vw", className = "" }: { img: Vid; priority?: boolean; sizes?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);

  // грузим видео заранее, за экран до появления; при reduced motion остаётся превью
  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // играем только пока видео на экране
  useEffect(() => {
    const v = ref.current;
    if (!v || !load) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()));
    io.observe(v);
    return () => io.disconnect();
  }, [load]);

  return (
    <figure className={`rv-img isolate overflow-hidden bg-ink [transform:translateZ(0)] max-md:ml-[calc(50%-50vw)] max-md:w-screen md:rounded-[24px] ${className}`}>
      <div className="rv-img-inner relative">
        <Image src={img.src} width={img.w} height={img.h} alt={img.alt} sizes={sizes} priority={priority} className="block h-auto w-full" />
        <video
          ref={ref}
          src={load ? img.video : undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          onCanPlayThrough={() => setReady(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </figure>
  );
}
