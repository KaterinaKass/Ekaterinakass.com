"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { content } from "@/content";
import { gsap, MOTION_OK, useGsap } from "@/lib/gsap";
import { SplitChars } from "@/components/SplitChars";
import { ContactFields, submitContact } from "@/components/ContactForm";
import { DotIconField, LineIcon, Odometer, TONES } from "@/components/ProcessSection";

const { about: copy } = content;

// Числа из reference/sarottofabio-about/MECHANIC.md
const MOTION = {
  tilt: {
    perspective: 900,     // px
    rotateY: 5,           // град. на краю фото по горизонтали
    rotateX: 4,           // град. на краю фото по вертикали
    back: "transform 0.6s cubic-bezier(.4,0,.2,1)", // возврат, когда курсор ушёл
  },
  odometer: {
    delay: 150,           // мс, первый счётчик
    step: 180,            // мс между счётчиками
    margin: "-15% 0px",   // порог появления
  },
  // лента фактов: у оригинала 2 копии списка за 35 с; у нас 4 копии (чтобы хватало на широких экранах),
  // поэтому 70 с — та же скорость
  marquee: 70,
} as const;

// контейнер страницы — как у блоков на главной (между вертикальными линиями)
const WRAP = "mx-auto w-[90%] px-3 md:px-[clamp(24px,3vw,48px)]";
const INNER = "mx-auto max-w-[1320px]";

/* ---------- иконки навыков: линейные, как остальные иконки сайта ---------- */

const ICONS: Record<(typeof copy.skills)[number]["icon"], ReactNode> = {
  ux: (
    <>
      <path d="M5.5 4h13a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path d="M3.5 9h17" />
      <path d="M9 9v11" />
    </>
  ),
  visual: (
    <>
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8h2.1a3.8 3.8 0 0 0 3.8-3.8c0-4-3.8-7.2-8.5-7.2Z" />
      <circle cx="7.5" cy="11.5" r="1.2" />
      <circle cx="9.8" cy="7.6" r="1.2" />
      <circle cx="14.4" cy="7.4" r="1.2" />
    </>
  ),
  research: <path d="M12 19.5s-7.5-4.3-7.5-9.7A4.3 4.3 0 0 1 12 7.1a4.3 4.3 0 0 1 7.5 2.7c0 5.4-7.5 9.7-7.5 9.7Z" />,
  team: (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19.5c.7-3 3-4.8 5.5-4.8s4.8 1.8 5.5 4.8" />
      <circle cx="16.5" cy="9.5" r="2.4" />
      <path d="M15.6 14.8c2.4-.3 4.3 1.3 4.9 4.2" />
    </>
  ),
  analytics: (
    <>
      <path d="M3.5 20.5h17" />
      <path d="M7 17v-4" />
      <path d="M11 17V8" />
      <path d="M15 17v-6" />
      <path d="M19 17V5" />
    </>
  ),
};

/* ---------- первый экран: заголовок, текст и фото с наклоном за курсором ---------- */

function TiltPhoto() {
  const card = useRef<HTMLDivElement>(null);
  const T = MOTION.tilt;

  const move = (e: MouseEvent<HTMLDivElement>) => {
    const el = card.current;
    if (!el || !window.matchMedia(MOTION_OK).matches) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    el.style.transition = "";
    el.style.transform = `perspective(${T.perspective}px) rotateY(${T.rotateY * x}deg) rotateX(${-T.rotateX * y}deg)`;
  };
  const leave = () => {
    const el = card.current;
    if (!el) return;
    el.style.transition = T.back;
    el.style.transform = `perspective(${T.perspective}px) rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <div
      ref={card}
      onMouseMove={move}
      onMouseLeave={leave}
      className="about-photo bg-dots relative aspect-[3/4] w-full overflow-hidden rounded-2xl will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      <Image
        src={copy.photo}
        alt={copy.photoAlt}
        fill
        priority
        sizes="(max-width: 768px) 90vw, 480px"
        className="object-cover object-top select-none"
        draggable={false}
      />
    </div>
  );
}

function Hero() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ q }) => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap
        .timeline({ delay: 0.2 })
        .from(q(".about-title-char"), { yPercent: 115, stagger: 0.025, duration: 0.9, ease: "power4.out" })
        .from(q(".about-intro"), { y: 24, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" }, 0.3)
        .from(q(".about-photo-wrap"), { y: 40, opacity: 0, duration: 1, ease: "power3.out" }, 0.15);
    });
  });

  return (
    <section ref={root} id="top" className="relative pt-[120px] pb-10 md:pt-[140px] md:pb-[100px]">
      <div className={WRAP}>
        <div className={`${INNER} grid grid-cols-1 items-end gap-10 md:grid-cols-[1.3fr_1fr] md:gap-16`}>
          <div className="flex flex-col justify-end">
            <h1 className="mb-7 text-[9.8vw] leading-[1.04] font-normal tracking-[-0.03em] text-ink md:text-[clamp(42px,5.8vw,84px)]">
              <span className="block font-semibold">
                <SplitChars text={copy.title[0]} charClass="about-title-char" />
              </span>
              <span className="block">
                <SplitChars text={copy.title[1]} charClass="about-title-char" />
              </span>
            </h1>
            <div className="flex max-w-[56ch] flex-col gap-4">
              {copy.intro.map((p) => (
                <p key={p.slice(0, 24)} className="about-intro text-[16px] leading-[1.6] text-muted md:text-[17px]">
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div className="about-photo-wrap w-full max-w-[480px] md:justify-self-end">
            <TiltPhoto />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- цифры-одометры ---------- */

function Stats() {
  const root = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- настройка «меньше движения» известна только в браузере
    if (!window.matchMedia(MOTION_OK).matches) return setStill(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setStarted(true);
        io.disconnect();
      },
      { rootMargin: MOTION.odometer.margin },
    );
    io.observe(root.current!);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={root}>
      <div className={WRAP}>
        <div className={`${INNER} grid grid-cols-1 gap-8 border-t border-line py-10 sm:grid-cols-3 sm:gap-4 md:gap-10 md:py-20`}>
          {copy.stats.map((s, i) => (
            <div key={s.value}>
              <div className="text-[clamp(46px,13vw,96px)] leading-[0.88] font-semibold tracking-[-0.03em] text-accent">
                <Odometer value={s.value} started={started} still={still} delay={MOTION.odometer.delay + MOTION.odometer.step * i} />
              </div>
              <p className="mt-3 text-[14px] text-muted md:text-[16px] md:leading-[1.4]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- бегущая строка фактов ---------- */

const FACT = "text-[clamp(20px,2.4vw,32px)] leading-none font-medium tracking-[-0.02em] whitespace-nowrap text-ink";

function Facts() {
  const reel = [...copy.facts, ...copy.facts, ...copy.facts, ...copy.facts];
  return (
    <section className="my-6 py-6 md:my-10 md:py-10">
      {/* лента обрезается по вертикальным линиям рамки (5% от краёв, как FrameLines); py — запас под хвосты букв g, y, p */}
      <div className="mx-[5%] overflow-hidden py-[0.15em] text-[clamp(20px,2.4vw,32px)] motion-reduce:hidden">
        {/* с движением: лента; останавливается под курсором */}
        <div
          className="tools-marquee marquee-hover-pause flex w-max"
          style={{ "--marquee-duration": `${MOTION.marquee}s` } as CSSProperties}
        >
          {reel.map((f, i) => (
            <span key={i} aria-hidden={i >= copy.facts.length || undefined} className={`${FACT} flex items-center`}>
              {f}
              <span className="px-8 text-accent">·</span>
            </span>
          ))}
        </div>
      </div>
      {/* «меньше движения»: тот же список стоит на месте и переносится */}
      <div className={`${WRAP} hidden flex-wrap justify-center gap-x-8 gap-y-4 motion-reduce:flex`}>
        {copy.facts.map((f) => (
          <span key={f} className={FACT}>
            {f}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ---------- навыки: плитки с точками за курсором ---------- */

const SKILL_TONES = ["accent", "dark", "plain", "dark", "accent"] as const;
// 3 плитки в первом ряду, 2 широкие во втором
const SKILL_SPAN = ["lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3", "sm:col-span-2 lg:col-span-3"];

function Skills() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ q }) => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(q(".skills-char"), { yPercent: 115, stagger: 0.025, duration: 0.9, ease: "power4.out", scrollTrigger: { trigger: root.current, start: "top 75%" } });
      q(".skill-tile").forEach((tile, i) => {
        gsap.from(tile, { y: 32, opacity: 0, duration: 0.8, delay: (i % 3) * 0.06, ease: "power3.out", scrollTrigger: { trigger: tile, start: "top 90%" } });
      });
    });
  });

  return (
    <section ref={root} className="py-12 md:py-[90px]">
      <div className={WRAP}>
        <div className={INNER}>
          <h2 className="mb-10 text-[9.8vw] leading-[1.08] font-normal text-ink md:mb-[56px] md:text-[clamp(32px,5vw,64px)] md:leading-[1.14]">
            <span className="block font-semibold">
              <SplitChars text={copy.skillsTitle[0]} charClass="skills-char" />
            </span>
            <span className="block">
              <SplitChars text={copy.skillsTitle[1]} charClass="skills-char" />
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-6">
            {copy.skills.map((s, i) => {
              const t = TONES[SKILL_TONES[i % SKILL_TONES.length]];
              return (
                <div
                  key={s.title}
                  className={`skill-tile relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-2xl border p-[26px] lg:min-h-[340px] ${t.tile} ${SKILL_SPAN[i] ?? ""}`}
                >
                  <DotIconField icon={ICONS[s.icon]} tone={t.dots} />
                  <div className="relative z-[1]">
                    <div className="mb-4">
                      <LineIcon size={36}>{ICONS[s.icon]}</LineIcon>
                    </div>
                    <h3 className="mb-[10px] text-[20px] leading-[1.1] font-semibold tracking-[-0.02em] md:text-[22px]">{s.title}</h3>
                    <p className={`max-w-[52ch] text-[15px] leading-[1.55] ${t.text}`}>{s.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const BTN =
  "inline-flex w-full items-center justify-center gap-2.5 rounded-full sm:w-auto border px-6 py-[14px] text-[16px] leading-none font-medium transition-[transform,background-color,color] duration-200 hover:scale-[1.04]";

/* ---------- фон: текст проявляется по словам при прокрутке ---------- */

function Background() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ q }) => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        q(".bg-word"),
        { opacity: 0.15 },
        { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 80%", end: "bottom 55%", scrub: true } },
      );
      gsap.from(q(".bg-links > a"), { y: 20, opacity: 0, stagger: 0.08, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: q(".bg-links")[0], start: "top 92%" } });
    });
  });

  return (
    <section ref={root} className="py-12 md:py-[90px]">
      <div className={WRAP}>
        <div className={`${INNER} max-w-[1100px]!`}>
          <p className="text-[clamp(24px,3.2vw,48px)] leading-[1.2] font-medium tracking-[-0.02em] text-ink">
            {copy.background.split(" ").map((w, i) => (
              <span key={i} className="bg-word">
                {w}{" "}
              </span>
            ))}
          </p>
          {/* кнопки — размеры как у CTA сайта; на телефоне одна под другой во всю ширину; CV — синяя, как кнопка меню, LinkedIn — контурная */}
          <div className="bg-links mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-10">
            <a
              href={copy.cv.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${BTN} border-[#0C6CB6] bg-accent text-cream`}
            >
              {copy.cv.label}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 4v11" />
                <path d="m7 10 5 5 5-5" />
                <path d="M5 20h14" />
              </svg>
            </a>
            <a
              href={content.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`${BTN} border-ink text-ink hover:bg-ink hover:text-cream`}
            >
              {copy.linkedinLabel}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- сообщества: карточки-ссылки ---------- */

function Community() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ q }) => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(q(".community-char"), { yPercent: 115, stagger: 0.025, duration: 0.9, ease: "power4.out", scrollTrigger: { trigger: root.current, start: "top 75%" } });
      q(".community-card").forEach((card, i) => {
        gsap.from(card, { y: 32, opacity: 0, duration: 0.8, delay: i * 0.08, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 90%" } });
      });
    });
  });

  return (
    <section ref={root} className="py-12 md:py-[90px]">
      <div className={WRAP}>
        <div className={INNER}>
          <h2 className="mb-10 text-[9.8vw] leading-[1.08] font-normal text-ink md:mb-[56px] md:text-[clamp(32px,5vw,64px)] md:leading-[1.14]">
            <span className="block font-semibold">
              <SplitChars text={copy.communityTitle[0]} charClass="community-char" />
            </span>
            <span className="block">
              <SplitChars text={copy.communityTitle[1]} charClass="community-char" />
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            {copy.community.map((c) => (
              <a
                key={c.name}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="community-card group flex flex-col overflow-hidden rounded-2xl border border-line bg-white"
              >
                <div className={`relative aspect-[16/9] overflow-hidden ${c.logo ? "bg-[#efe7e1]" : ""}`}>
                  <Image
                    src={c.image}
                    alt={c.alt}
                    fill
                    sizes="(max-width: 768px) 90vw, 640px"
                    className={`transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04] ${c.logo ? "object-contain p-[14%]" : "object-cover"}`}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-5 p-[26px] md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="mb-2 text-[12px] font-medium tracking-[0.08em] text-muted uppercase md:text-[13px]">{c.role}</p>
                    <h3 className="text-[22px] leading-[1.1] font-semibold tracking-[-0.02em] text-ink md:text-[26px]">{c.name}</h3>
                  </div>
                  <span className={`${BTN} shrink-0 border-ink text-ink group-hover:bg-ink group-hover:text-cream`}>
                    {c.cta}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M7 17 17 7" />
                      <path d="M8 7h9v9" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- призыв и форма (поля — из общей формы сайта) ---------- */

function Contact() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ q }) => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 75%" } })
        .from(q(".cta-char"), { yPercent: 115, stagger: 0.025, duration: 0.9, ease: "power4.out" })
        .from(q(".cta-fade"), { y: 32, opacity: 0, stagger: 0.12, duration: 0.8, ease: "power3.out" }, 0.25);
    });
  });

  return (
    <section ref={root} id="write" className="scroll-mt-[120px] pt-12 pb-20 md:pt-[72px] md:pb-[120px]">
      <div className={WRAP}>
        <div className={`${INNER} text-center`}>
          <h2 className="text-[9.8vw] leading-[1.08] font-normal text-ink md:text-[clamp(32px,5vw,64px)] md:leading-[1.14]">
            <span className="block font-semibold">
              <SplitChars text={copy.ctaTitle[0]} charClass="cta-char" />
            </span>
            <span className="block">
              <SplitChars text={copy.ctaTitle[1]} charClass="cta-char" />
            </span>
          </h2>
          <p className="cta-fade mx-auto mt-5 max-w-[46ch] text-[16px] leading-[1.5] text-muted md:text-[18px]">{copy.ctaText}</p>

          <form
            onSubmit={submitContact}
            className="cta-fade mx-auto mt-10 flex max-w-[560px] flex-col gap-5 rounded-[24px] border border-line bg-white px-6 pt-8 pb-10 text-left text-ink md:p-10"
          >
            <ContactFields tone="light" />
          </form>
        </div>
      </div>
    </section>
  );
}

/** Страница About: первый экран с фото, цифры, лента фактов, навыки, сообщества, фон и форма. */
export function AboutPage() {
  return (
    <div className="relative z-10 bg-cream">
      <Hero />
      <Stats />
      <Facts />
      <Skills />
      <Community />
      <Background />
      <Contact />
    </div>
  );
}
