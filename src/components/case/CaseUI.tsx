import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/*
 * Строительные блоки страниц кейсов. Анимацию навешивает useCaseReveal по классам:
 *   rv       — блок выезжает снизу и проявляется
 *   rv-words — заголовок выезжает по словам (слова в масках)
 *   rv-img   — картинка раскрывается из скруглённой рамки
 *   rv-line  — линия прорастает слева направо
 */

/** Заголовок, разбитый на слова в масках, чтобы они выезжали снизу. */
export function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <span className="rv-word inline-block will-change-transform">{w}</span>
          {" "}
        </span>
      ))}
    </>
  );
}

/** Маленькая подпись капсом над блоками. */
export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[12px] font-medium tracking-[0.08em] text-muted uppercase md:text-[13px] ${className}`}>{children}</p>;
}

/** Секция с якорем для бокового меню. scroll-margin учитывает липкий переключатель видов. */
export function Section({ id, title, children }: { id: string; title?: string; children: ReactNode }) {
  return (
    <section id={id} data-spy={id} className="case-section scroll-mt-28 pt-20 first:pt-0 md:pt-28">
      {title && (
        <>
          <div className="rv-line mb-8 h-px origin-left bg-line md:mb-10" />
          <h2 className="rv-words font-display mb-8 text-[28px] leading-[1.05] text-ink uppercase md:mb-10 md:text-[40px]">
            <Words text={title} />
          </h2>
        </>
      )}
      {children}
    </section>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="rv mt-14 mb-5 text-[22px] leading-[1.2] font-semibold tracking-[-0.01em] text-ink md:text-[26px]">{children}</h3>;
}

export function P({ children, lead = false }: { children: ReactNode; lead?: boolean }) {
  return (
    <p
      className={`rv mb-5 last:mb-0 ${
        lead ? "text-[22px] leading-[1.35] text-ink md:text-[28px]" : "text-[17px] leading-[1.6] text-ink/80 md:text-[18px]"
      }`}
    >
      {children}
    </p>
  );
}

/** Ссылка в тексте: подчёркивание растёт при наведении. */
export function A({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  const cls =
    "text-accent underline decoration-accent/30 underline-offset-[3px] transition-[text-decoration-color] hover:decoration-accent";
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/** Таблица с тонкими линиями; на мобильном каждая строка раскладывается в карточку «подпись — значение». */
export function Table({ head, rows, firstColStrong = false }: { head: ReactNode[]; rows: ReactNode[][]; firstColStrong?: boolean }) {
  // Первая колонка становится заголовком карточки: либо выделенная, либо номер «#».
  const numbered = head[0] === "#";
  const titled = firstColStrong || numbered;
  return (
    <div className="rv my-8">
      <div className="border-t border-ink md:hidden">
        {rows.map((r, i) => (
          <div key={i} className="border-b border-line py-5">
            {titled && (
              <div
                className={
                  numbered
                    ? "mb-2 text-[12px] font-medium tracking-[0.08em] text-muted uppercase"
                    : "mb-3 text-[16px] leading-[1.4] font-medium text-ink"
                }
              >
                {numbered ? `#${r[0]}` : r[0]}
              </div>
            )}
            <dl className="grid gap-3">
              {r.slice(titled ? 1 : 0).map((c, j) => {
                const label = head[j + (titled ? 1 : 0)];
                return (
                  <div key={j}>
                    {label ? <dt className="mb-1 text-[11px] font-medium tracking-[0.08em] text-muted uppercase">{label}</dt> : null}
                    <dd className={`text-[15px] leading-[1.5] ${numbered && j === 0 ? "font-medium text-ink" : "text-ink/80"}`}>{c}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        ))}
      </div>
      <table className="hidden w-full border-collapse text-left text-[15px] leading-[1.5] md:table md:text-[16px]">
        <thead>
          <tr className="border-b border-ink">
            {head.map((h, i) => (
              <th key={i} className="py-3 pr-5 align-bottom text-[12px] font-medium tracking-[0.08em] text-muted uppercase last:pr-0">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-line">
              {r.map((c, j) => (
                <td key={j} className={`py-4 pr-5 align-top last:pr-0 ${j === 0 && firstColStrong ? "font-medium text-ink" : "text-ink/80"}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type Img = { src: string; w: number; h: number; alt: string };

/** Мокап в скруглённой тёмной рамке, на мобильном — на всю ширину экрана без скруглений. Пропорции сохраняются, ничего не обрезается. */
export function Figure({ img, priority = false, sizes = "(min-width: 1024px) 70vw, 100vw", className = "" }: { img: Img; priority?: boolean; sizes?: string; className?: string }) {
  return (
    <figure className={`rv-img isolate overflow-hidden bg-ink [transform:translateZ(0)] max-md:ml-[calc(50%-50vw)] max-md:w-screen md:rounded-[24px] ${className}`}>
      <Image
        src={img.src}
        width={img.w}
        height={img.h}
        alt={img.alt}
        sizes={sizes}
        priority={priority}
        className="rv-img-inner block h-auto w-full"
      />
    </figure>
  );
}

/** Две картинки рядом одной высоты: ширина каждой пропорциональна её соотношению сторон. На мобильном друг под другом. */
export function Pair({ a, b }: { a: Img; b: Img }) {
  return (
    <div className="my-10 flex flex-col gap-4 md:flex-row md:gap-5">
      {[a, b].map((img) => (
        <div key={img.src} className="min-w-0" style={{ flex: `${img.w / img.h} 1 0%` }}>
          <Figure img={img} sizes="(min-width: 768px) 40vw, 100vw" />
        </div>
      ))}
    </div>
  );
}

/** Карточка с подписью и заголовком (блок «Long Story Short» и похожие). */
export function Card({ label, title, children, className = "", tint }: { label?: string; title?: ReactNode; children: ReactNode; className?: string; tint?: string }) {
  return (
    <div className={`rv relative overflow-hidden rounded-[20px] border border-line/70 bg-white/45 p-6 md:p-8 ${className}`}>
      {label && (
        <Label className="mb-4 flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ background: tint ?? "var(--accent)" }} />
          {label}
        </Label>
      )}
      {title && <h3 className="mb-4 text-[21px] leading-[1.2] font-semibold tracking-[-0.01em] text-ink md:text-[24px]">{title}</h3>}
      <div className="text-[16px] leading-[1.6] text-ink/80 md:text-[17px]">{children}</div>
    </div>
  );
}

/** Нумерованный список с крупными номерами. */
export function NumList({ items }: { items: ReactNode[] }) {
  return (
    <ol className="my-8 border-t border-line">
      {items.map((it, i) => (
        <li key={i} className="rv flex gap-5 border-b border-line py-5 text-[17px] leading-[1.6] text-ink/80 md:gap-8 md:text-[18px]">
          <span className="font-display w-8 shrink-0 text-[20px] leading-[1.4] text-accent">{String(i + 1).padStart(2, "0")}</span>
          <span>{it}</span>
        </li>
      ))}
    </ol>
  );
}

/** Маркированный список с тонкими разделителями. */
export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="my-6 border-t border-line">
      {items.map((it, i) => (
        <li key={i} className="rv flex gap-4 border-b border-line py-4 text-[17px] leading-[1.6] text-ink/80 md:text-[18px]">
          <span className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-ink" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/** Ссылка «← Back to …» в стиле сайта: стрелка уезжает влево при наведении. */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="group inline-flex h-11 items-center gap-3 text-[15px] text-ink md:text-[17px]">
      <span className="grid size-9 place-items-center rounded-full border border-ink/80 transition-colors group-hover:bg-ink group-hover:text-cream">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden>
          <path d="M13 7H1m0 0 5-5M1 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {children}
    </Link>
  );
}
