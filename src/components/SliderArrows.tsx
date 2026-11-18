import type { Ref } from "react";

export function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden className={dir === "left" ? "rotate-180" : ""}>
      <path d="M3 11h16M12 4l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const BTN =
  "grid size-12 shrink-0 cursor-pointer place-items-center rounded-full border border-ink bg-cream text-ink transition-[background-color,color,opacity] duration-300 hover:bg-ink hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-25";

type Props = {
  prevLabel: string;
  nextLabel: string;
  onPrev: () => void;
  onNext: () => void;
  /** для React-состояния; блоки, которые рисуют напрямую в DOM, меняют disabled через ref */
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  prevRef?: Ref<HTMLButtonElement>;
  nextRef?: Ref<HTMLButtonElement>;
  className?: string;
};

/**
 * Пара стрелок под карточками: «назад» и «вперёд».
 * Только на десктопе (md+); на телефоне ленты листаются свайпом. В начале и в конце ленты стрелка бледнеет.
 */
export function SliderArrows({ prevLabel, nextLabel, onPrev, onNext, prevDisabled, nextDisabled, prevRef, nextRef, className = "" }: Props) {
  return (
    <div className={`hidden items-center justify-center gap-3 md:flex ${className}`}>
      <button ref={prevRef} type="button" aria-label={prevLabel} disabled={prevDisabled} onClick={onPrev} className={`slider-arrow ${BTN}`}>
        <ArrowIcon dir="left" />
      </button>
      <button ref={nextRef} type="button" aria-label={nextLabel} disabled={nextDisabled} onClick={onNext} className={`slider-arrow ${BTN}`}>
        <ArrowIcon dir="right" />
      </button>
    </div>
  );
}
