// Весь контент страницы в одном месте. Сейчас здесь плейсхолдеры, меняйте тексты и пути к картинкам тут.

const EMAIL = "kass.ekaterina@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/ekaterinakass/";

export const content = {
  contact: { email: EMAIL, linkedin: LINKEDIN },

  meta: {
    title: "Ekaterina Kasakina — Portfolio",
    description: "Placeholder portfolio description.",
  },

  hero: {
    firstLine: "EKATERINA",
    secondLine: "KASAKINA",
    left: ["Product", "Designer"],
    right: ["Based in", "Luxembourg"],
    signature: "/images/signature.webp",
    signatureWhite: "/images/signature-white.webp", // белая версия для синего блока с фото
    // бабл у курсора после интро (только десктоп): тексты печатаются по очереди
    bubble: ["Hey there", "Curious? Have a look."],
  },

  portrait: {
    image: "/images/ekaterina.webp",
    alt: "Ekaterina Kasakina",
    roles: ["Product Designer", "UX/UI Designer", "Web Designer"],
  },

  statement: {
    // своя 3D-иконка справа сверху: положите SVG по этому пути (папка public).
    // Пока файла нет, на этом месте показывается пиксельный робот.
    customIcon: "/icons/tool.svg",
    // bold: true выделяет слово жирным
    words: [
      { text: "10+ years", bold: true },
      { text: "of" },
      { text: "shaping" },
      { text: "clear", br: true },
      { text: "products" },
      { text: "and" },
      { text: "calm" },
      { text: "interfaces", br: true },
      { text: "people" },
      { text: "trust" },
    ] as { text: string; bold?: boolean; br?: boolean }[],
  },

  services: {
    intro: "I help teams turn ideas into",
    // кнопка при наведении на превью, ведёт к блоку с работами
    hoverCta: "View all works below",
    items: [
      { title: "Mobile apps", image: "/placeholders/service-1.svg" },
      { title: "Web platforms", image: "/placeholders/service-2.svg" },
      { title: "Landings", image: "/placeholders/service-3.svg" },
    ],
  },

  projects: {
    titleTop: "SELECTED",
    titleBottom: "WORK",
    viewLabel: "View project", // кнопка у курсора над карточками
    subtitle:
      "Selection of projects across branding, product design, and visual systems - each one built with intention.",
    items: [
      // logo: картинка вместо плейсхолдера (w/h — размеры на карточке в px)
      // preview: картинка на фоне карточки при наведении (обычно первое изображение кейса)
      {
        name: "Cyberr",
        year: "2026",
        category: "Product design | Art direction",
        href: "/work/cyberr-technical-tests",
        logo: { src: "/logos/cyberr.png", w: 155, h: 48 },
        preview: "/images/cases/cyberr-tests/Tests-Tests.webp",
      },
      { name: "Project Two", year: "2025", category: "Web platform", href: "#" },
      { name: "Project Three", year: "2025", category: "Mobile app", href: "#" },
      { name: "Project Four", year: "2024", category: "Design system", href: "#" },
      { name: "Project Five", year: "2023", category: "Product design", href: "#" },
      { name: "Project Six", year: "2023", category: "Research", href: "#" },
    ] as { name: string; year: string; category: string; href: string; logo?: { src: string; w: number; h: number }; preview?: string }[],
  },

  // блок отзывов перед футером; сами отзывы лежат в src/testimonials.ts
  testimonials: {
    // [жирная часть, обычная часть]
    title: ["Recommended", "by great teams"],
    countLabel: "reviews on LinkedIn",
    href: `${LINKEDIN}details/recommendations/`,
    prev: "Previous recommendation",
    next: "Next recommendation",
    more: "Show more",
    less: "Show less",
  },

  footer: {
    avatar: "/images/character-v4.webp",
    avatarAspect: 864 / 1739, // ширина / высота картинки персонажа
    lead: "Let's make something",
    big: ["THOUGHTFUL AND", "REMARKABLE"],
    reachOut: "Reach out",
    email: EMAIL,
    socials: [
      { label: "Instagram", href: "#", icon: "instagram" },
      { label: "LinkedIn", href: LINKEDIN, icon: "linkedin" },
      { label: "Email", href: `mailto:${EMAIL}`, icon: "mail" },
    ] as { label: string; href: string; icon: "instagram" | "linkedin" | "mail" }[],
    // [обычный текст, название жирным]
    creditLeft: ["Designed in ", "Figma"],
    creditRight: ["Built with ", "Claude Code"],
  },

  menu: {
    links: [
      { label: "Home", href: "#top" },
      { label: "Work", href: "#work" },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
    emailButton: "Email me",
    emailCopied: "Copied!",
  },

};
