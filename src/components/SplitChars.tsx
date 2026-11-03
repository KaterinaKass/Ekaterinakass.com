import type { CSSProperties } from "react";

type Props = {
  text: string;
  /** класс на каждую букву, по нему ищет GSAP */
  charClass: string;
  className?: string;
  style?: CSSProperties;
};

/** Делит текст на буквы внутри overflow-hidden маски, чтобы они «выезжали» снизу. */
export function SplitChars({ text, charClass, className = "", style }: Props) {
  return (
    <span className={`inline-flex overflow-hidden ${className}`} style={style} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span key={i} aria-hidden className={`inline-block will-change-transform ${charClass}`}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
