// Французская версия главной (переключатель EN / FR у кнопки меню). Структура та же, что в content.ts: меняйте тексты здесь,
// картинки и ссылки на внешние сайты обычно совпадают с английской версией.
import { content, type Content } from "./content";

const { contact, footer: footerEn } = content;

export const contentFr: Content = {
  contact,

  meta: {
    title: "Ekaterina Kasakina — Portfolio",
    description: "Product Designer basée au Luxembourg. Plus de 10 ans à concevoir des produits clairs et des interfaces sereines qui inspirent confiance.",
  },

  hero: {
    ...content.hero,
    left: ["Product", "Designer"],
    right: ["Basée au", "Luxembourg"],
    bubble: ["Bonjour", "Curieux ? Jetez un œil."],
  },

  portrait: {
    ...content.portrait,
    roles: ["Product Designer", "UX/UI Designer", "Web Designer"],
  },

  statement: {
    customIcon: content.statement.customIcon,
    words: [
      { text: "10+ ans", bold: true },
      { text: "à" },
      { text: "concevoir" },
      { text: "des" },
      { text: "produits", br: true },
      { text: "clairs" },
      { text: "et" },
      { text: "des" },
      { text: "interfaces" },
      { text: "sereines", br: true },
      { text: "qui" },
      { text: "inspirent" },
      { text: "confiance" },
    ],
  },

  services: {
    intro: "J’aide les équipes à transformer leurs idées en",
    hoverCta: "Voir tous les projets ci-dessous",
    items: [
      { title: "Applications mobiles", image: "/placeholders/service-1.svg" },
      { title: "Plateformes web", image: "/placeholders/service-2.svg" },
      { title: "Landing pages", image: "/placeholders/service-3.svg" },
    ],
  },

  shipped: {
    title: "Projets livrés",
    subtitle: "Des produits que j’ai conçus et lancés, des premiers parcours aux fonctionnalités utilisées au quotidien.",
    cta: "",
    ctaHref: "#work",
    items: [
      { name: "Cyberr", category: "Tests techniques", href: "/work/cyberr-technical-tests", cover: "/images/cases/cyberr-tests/Tests-Tests.webp" },
      { name: "Cyberr", category: "Onboarding", href: "/work/cyberr-onboarding", cover: "/images/cases/cyberr-onboarding/Onb-review.webp" },
      { name: "Project Two", category: "Plateforme web", href: "#" },
      { name: "Project Three", category: "Application mobile", href: "#" },
      { name: "Project Four", category: "Design system", href: "#" },
      { name: "Project Five", category: "Product design", href: "#" },
    ],
  },

  process: {
    title: ["Le processus", "fait le produit."],
    intro:
      "Un bon produit n’est jamais un heureux hasard. Il naît de questions posées tôt, de preuves honnêtes et du courage de dire non à ce qui ne sert pas l’utilisateur.",
    pillars: [
      { icon: "research", title: "Guidé par la recherche", text: "Chaque décision part de preuves : entretiens, tests utilisateurs et analytics passent avant la première maquette." },
      { icon: "systems", title: "Systèmes évolutifs", text: "Des composants et des tokens pensés pour durer au-delà d’une fonctionnalité. Un design system est une infrastructure partagée par toute l’équipe." },
      { icon: "outcomes", title: "Résultats business", text: "Chaque parcours est lié à une métrique : conversion, rétention, temps de réalisation. Ce qui ne se mesure pas n’est pas terminé." },
    ],
    results: [
      { value: "10+", product: "Product design", label: "ans d’expérience" },
      { value: "22", product: "LinkedIn", label: "recommandations" },
      { value: "#1", product: "Nom du projet", label: "remplacez par votre résultat" },
    ],
    skills: ["Product discovery", "Recherche utilisateur", "Prototypage", "Design systems", "Handoff aux devs", "Accessibilité WCAG", "Workflows IA"],
    tools: content.process.tools,
    explode: "Secouer les compétences",
    tidy: "Remettre les compétences en place",
  },

  projects: {
    titleTop: "PROJETS",
    titleBottom: "CHOISIS",
    viewLabel: "Voir le projet",
    subtitle: "Une sélection de projets en branding, product design et systèmes visuels, chacun construit avec intention.",
    items: content.projects.items.map((p) => ({
      ...p,
      href: p.href,
      category: ({ "Web platform": "Plateforme web", "Mobile app": "Application mobile", Research: "Recherche" } as Record<string, string>)[p.category] ?? p.category,
    })),
  },

  testimonials: {
    title: ["Recommandée", "par de belles équipes"],
    countLabel: "recommandations sur LinkedIn",
    href: content.testimonials.href,
    prev: "Recommandation précédente",
    next: "Recommandation suivante",
    more: "Lire la suite",
    less: "Réduire",
  },

  footer: {
    ...footerEn,
    lead: "Créons ensemble quelque chose",
    big: ["D’IMPACTANT", "ET DE MARQUANT"],
    reachOut: "Démarrer une conversation",
    whatsapp: { label: "Me contacter sur WhatsApp", href: footerEn.whatsapp.href },
    orEmail: "ou écrivez-moi directement : ",
    socials: footerEn.socials,
    creditLeft: ["Conçu dans ", "Figma"],
    creditRight: ["Développé avec ", "Claude Code"],
  },

  about: {
    ...content.about,
    meta: {
      title: "À propos — Ekaterina Kasakina",
      description: "Product Designer orientée IA, avec 10 ans d’expérience sur des produits à forte charge, pensés mobile first.",
    },
    title: ["Product Designer", "orientée IA"],
    intro: [
      "Product Designer orientée IA, avec 10 ans d’expérience sur de grands projets européens à forte charge, toujours pensés mobile first. J’aime résoudre des problèmes humains et aider les entreprises à grandir en concevant des sites de services professionnels et des applications mobiles.",
      "Je travaille chez Cyber.ai, la plateforme de référence mondiale pour les professionnels de la cybersécurité. Je collabore avec les ingénieurs et les parties prenantes pour comprendre les besoins des utilisateurs, je mène des entretiens et des tests utilisateurs, je crée des wireframes et des prototypes, et je livre le design visuel haute fidélité avec Figma, Figma Make, Lovable, Claude et la suite Adobe.",
    ],
    photoAlt: "Ekaterina Kasakina",
    stats: [
      { value: "10+", label: "ans en product design" },
      { value: "2006", label: "je présente des projets aux parties prenantes depuis" },
      { value: "MSc", label: "en Interaction Design" },
    ],
    facts: [
      "Mobile first",
      "Produits à forte charge",
      "Workflows IA",
      "Entretiens et tests utilisateurs",
      "Figma · Figma Make",
      "Lovable + Claude",
      "Design de services et social",
      "Adore voyager",
      "Nouvelles rencontres, nouvelles cultures",
    ],
    skillsTitle: ["Mes compétences", "en product design"],
    skills: [
      { icon: "ux", title: "Expérience et interface utilisateur", text: "Maîtrise des user stories, storyboards, personas, plans de site, wireframes et prototypes basse et haute fidélité." },
      { icon: "analytics", title: "Esprit analytique", text: "J’aime la recherche et l’analyse de données. Je sais définir les bons KPI et tirer des enseignements des données." },
      { icon: "research", title: "Recherche utilisateur et empathie", text: "Grâce à mon expérience en design de services et design social, je comprends le rôle de la conception centrée utilisateur et je mène les entretiens avec empathie. Je sais planifier et conduire des tests utilisateurs et des enquêtes." },
      { icon: "team", title: "Travail d’équipe et communication", text: "J’ai vécu plusieurs très belles expériences au sein d’équipes. Je présente des projets aux parties prenantes depuis 2006." },
      { icon: "visual", title: "Design visuel", text: "Je maîtrise la typographie, la théorie des couleurs et la hiérarchie visuelle, et je suis de près les dernières tendances du design." },
    ],
    communityTitle: ["Communauté", "& événements"],
    community: [
      { ...content.about.community[0], role: "Responsable de la communauté", alt: "Meetup Friends of Figma Luxembourg", cta: "Voir les événements" },
      { ...content.about.community[1], role: "Organisatrice et directrice de la création", alt: "Logo DevFest Luxembourg", cta: "Visiter devfest.lu" },
    ],
    background:
      "Mon parcours en web design m’a menée vers ce métier, puis j’ai obtenu un MSc en Interaction Design. J’adore voyager, rencontrer de nouvelles personnes et découvrir de nouvelles cultures.",
    cv: { label: "Télécharger le CV", href: content.about.cv.href },
    linkedinLabel: "LinkedIn",
    ctaTitle: ["Dites-moi", "ce dont vous avez besoin !"],
    ctaText: "Je suis toujours curieuse de travailler sur de nouveaux projets intéressants ! 📩",
  },

  contactForm: {
    title: "Démarrer une conversation",
    name: "Nom",
    email: "E-mail",
    subject: "Objet",
    subjects: ["Demande de projet", "Nouvelle opportunité", "Collaboration", "Conférence / presse", "Autre chose"],
    message: "Message",
    placeholders: { name: "Marie Dupont", email: "marie@entreprise.com", message: "Quelques lignes sur ce que vous avez en tête..." },
    send: "Envoyer le message",
    close: "Fermer",
  },

  menu: {
    links: [
      { label: "Accueil", href: "#top" },
      { label: "Projets", href: "#shipped" },
      { label: "À propos", href: "/about" },
      { label: "Contact", href: "#contact", form: true },
    ],
    emailButton: "M’écrire",
    emailCopied: "Copié !",
    open: "Menu",
    close: "Fermer",
    language: "Langue",
  },

  caseStudy: {
    backToWork: "Retour aux projets",
    views: { summary: "Résumé", full: "Étude complète" },
    viewsLabel: "Vue de l’étude de cas",
    onThisPage: "Sur cette page",
    scriptsTitle: "Scripts de recherche",
    scriptsText: "Entretiens et tests d’utilisabilité",
  },
};
