import Image from "next/image";

/** Нарисованные обложки-заглушки для карточек «Work I've shipped», пока нет настоящих картинок.
 *  Размеры в cq-единицах: карточка — контейнер (container-type: size), поэтому всё масштабируется вместе с ней. */

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Зерно поверх градиента — без него большие градиенты выглядят «пластиковыми» и дают полосы. */
function Grain() {
  return <span aria-hidden className="absolute inset-0 opacity-[0.22] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />;
}

const DIR = "/images/cases/placeholders";

// фоны лендингов (public/images/cases/placeholders/gradient-2…4) и цвет надписи под каждый: на светлом — тёмная
const LANDINGS = [
  { bg: `${DIR}/gradient-2.webp`, ink: "#ffffff" },
  { bg: `${DIR}/gradient-3.webp`, ink: "#242424" },
  { bg: `${DIR}/gradient-4.webp`, ink: "#ffffff" },
];

function Bg({ src }: { src: string }) {
  return <Image src={src} alt="" fill sizes="(max-width: 767px) 68vw, 700px" className="object-cover" draggable={false} />;
}

export function GradientCover({ n }: { n: number }) {
  const l = LANDINGS[(n - 1) % LANDINGS.length];
  return (
    <span className="absolute inset-0 overflow-hidden">
      <Bg src={l.bg} />
      <Grain />
      <span
        className="font-display absolute inset-x-0 top-[40%] -translate-y-1/2 text-center leading-none whitespace-nowrap"
        style={{ fontSize: "clamp(36px, 12cqw, 120px)", color: l.ink }}
      >
        Landing #{n}
      </span>
    </span>
  );
}

/** Мокап айфона с логотипом Revolut на экране. Телефон уходит за нижний край карточки — под плашку с названием. */
export function PhoneCover() {
  return (
    <span className="absolute inset-0 overflow-hidden">
      <Bg src={`${DIR}/gradient-1.webp`} />
      <Grain />
      {/* корпус */}
      <span
        className="absolute left-1/2 -translate-x-1/2 bg-[#1c1c1e] shadow-[0_30px_60px_rgba(30,30,60,0.28),inset_0_0_0_1.5px_#3a3a3c]"
        style={{ top: "9cqh", height: "min(100cqh, 190cqw)", aspectRatio: "9 / 19.5", borderRadius: "min(9cqh, 17cqw)", padding: "min(1.6cqh, 3cqw)" }}
      >
        {/* экран */}
        <span
          className="relative flex h-full w-full flex-col items-center overflow-hidden"
          style={{
            borderRadius: "min(7.6cqh, 14.5cqw)",
            background:
              "radial-gradient(90% 60% at 50% 0%, #3b6bff 0%, transparent 70%), radial-gradient(80% 60% at 100% 100%, #7a3cff 0%, transparent 70%), #0a0b2e",
          }}
        >
          {/* статус-бар и Dynamic Island */}
          <span className="flex w-full items-center justify-between px-[12%] font-semibold text-white" style={{ height: "min(7cqh, 13cqw)", fontSize: "min(2.6cqh, 5cqw)" }}>
            <span>9:41</span>
            <span className="flex items-center gap-[3px]">
              <span className="block rounded-[1px] bg-white" style={{ width: "min(3cqh, 5.5cqw)", height: "min(1.4cqh, 2.6cqw)" }} />
            </span>
          </span>
          <span className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black" style={{ top: "min(1.6cqh, 3cqw)", width: "32%", height: "min(4cqh, 7.5cqw)" }} />
          {/* логотип */}
          <span className="flex flex-1 items-center justify-center pb-[30%]">
            {/* логотип тёмный — на тёмном экране перекрашен в белый */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${DIR}/revolut-logo.webp`} alt="Revolut" width={768} height={172} className="block h-auto w-[66%] brightness-0 invert" draggable={false} />
          </span>
        </span>
      </span>
    </span>
  );
}
