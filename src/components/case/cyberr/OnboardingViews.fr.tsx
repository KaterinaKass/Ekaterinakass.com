import { A, Card, Figure, H3, Label, List, NumList, P, Pair, Section, Table, type Img } from "../CaseUI";
import type { CaseData } from "./CyberrCase";

/* Тексты кейса Cyberr — Candidate Onboarding (FR). Источник: OnboardingViews.tsx */

const DIR = "/images/cases/cyberr-onboarding";
// пока плоские скриншоты из Figma, позже заменятся 3D-мокапами
const img = (file: string, alt: string, w = 2000, h = 1111): Img => ({ src: `${DIR}/${file}`, w, h, alt });

const images = {
  hero: img("Onb-review-top.webp", "« Looking good, Josef! » : le candidat relit son profil terminé avant sa mise en ligne"),
  resume: img("Onb-02-resume.webp", "Ajouter son CV : lien LinkedIn, import d’un fichier ou saisie manuelle, chacun avec une estimation du temps nécessaire"),
  resumeLinkedin: img("Onb-02-resume-linkedin.webp", "Option LinkedIn sélectionnée : un seul champ pour le lien du profil"),
  resumeUpload: img("Onb-02-resume-upload.webp", "Option import sélectionnée : une zone de dépôt pour le fichier du CV"),
  title: img("Onb-03-title.webp", "Étape 3 : un seul champ pour le métier, avec une ligne expliquant pourquoi il compte"),
  skills: img("Onb-04-skills.webp", "Jusqu’à cinq compétences principales, classées par glisser-déposer"),
  experience: img("Onb-05-experience.webp", "Expériences professionnelles pré-remplies à partir du CV, sous forme de cartes modifiables et supprimables"),
  editEducation: img("Onb-06-edit-education.webp", "Fenêtre de modification de la formation, avec des champs pré-remplis à partir du CV"),
  rates: img("Onb-09-rates.webp", "Tarifs : devise, journalier ou annuel, et un curseur de fourchette sur la distribution du marché"),
  details: img("Onb-10-details.webp", "Étape 10 : photo et informations personnelles, avec la raison de la demande"),
  review: img("Onb-review.webp", "« Looking good, Josef! » : relecture du profil terminé avant sa mise en ligne", 1880, 2000),
};

export const onboardingCaseFr: CaseData = {
  header: {
    eyebrow: ["Plateforme de recrutement", "Cyberr Onboarding"],
    title: "L’onboarding de Cyberr : d’un CV à un profil prêt",
    meta: [
      { label: "Rôle", value: "Seule Product Designer" },
      { label: "Périmètre", value: "Recherche utilisateur, analyse concurrentielle, design UI/UX, tests d’utilisabilité" },
      { label: "Équipe", value: "Product Manager, ingénieurs Machine Learning, ingénieurs Frontend" },
      { label: "Utilisateurs", value: "Experts freelances en cybersécurité, des analystes juniors aux pentesters seniors" },
    ],
  },
  hero: images.hero,
  nav: {
    summary: [
      { id: "overview", label: "Aperçu" },
      { id: "long-story-short", label: "En bref" },
      { id: "biggest-shift", label: "Le grand changement" },
      { id: "business-value", label: "Valeur business" },
    ],
    full: [
      { id: "overview", label: "Aperçu" },
      { id: "context", label: "Contexte" },
      { id: "problem", label: "Le problème" },
      { id: "market", label: "Marché" },
      { id: "research", label: "Recherche" },
      { id: "decisions", label: "Décisions" },
      { id: "usability", label: "Tests d’utilisabilité" },
      { id: "outcome", label: "Résultat" },
      { id: "learned", label: "Ce que j’ai appris" },
    ],
  },
};

const b = (t: string) => <strong className="font-semibold text-ink">{t}</strong>;

/* ───────────────────────── SUMMARY ───────────────────────── */

export function OnboardingSummaryFr() {
  return (
    <>
      <Section id="long-story-short" title="En bref">
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <Card label="Le quoi" title="Un onboarding en 10 étapes qui transforme un CV en profil prêt" tint="#0388ee">
            Cyberr met en relation des freelances en cybersécurité et des clients grâce à l’IA. Le matching ne vaut que ce que vaut le profil qui le
            nourrit. J’ai repensé l’onboarding des candidats pour qu’ils relisent un profil que l’IA a déjà rédigé à partir de leur CV, au lieu de
            remplir un formulaire vide.
          </Card>
          <Card label="Le pourquoi" title="Des profils à moitié vides ne donnaient rien au matching" tint="#e0457b">
            La première version était un long formulaire de profil unique. Les candidats abandonnaient vers la section expérience professionnelle, et
            ceux qui allaient au bout laissaient la bio, les tarifs et les compétences vides, ou listaient tous les outils qu’ils avaient un jour
            utilisés. Les clients voyaient des profils qui se ressemblaient tous, et le matching n’avait pas grand-chose sur quoi s’appuyer.
          </Card>
          <Card label="Le comment" className="md:col-span-2" tint="#e8862a">
            <div className="grid gap-8 md:grid-cols-2 md:gap-10">
              <div>
                <h3 className="mb-4 text-[21px] leading-[1.2] font-semibold tracking-[-0.01em] text-ink md:text-[24px]">Ce que la recherche m’a permis</h3>
                <p>
                  L’analyse du funnel de la première version, des entretiens avec 8 candidats et 4 clients, et deux sessions de tests d’utilisabilité.
                  7 candidats sur 8 avaient déjà leur expérience rédigée quelque part et détestaient la ressaisir. Les 4 clients ont tous dit ne lire
                  que les premières compétences d’un profil.
                </p>
              </div>
              <div>
                <h3 className="mb-4 text-[21px] leading-[1.2] font-semibold tracking-[-0.01em] text-ink md:text-[24px]">La direction de design</h3>
                <p>
                  Relire plutôt que ressaisir. Un CV ou un lien LinkedIn remplit l’essentiel du profil, une question par écran maintient le rythme,
                  et le rôle du candidat est de vérifier et corriger. Les compétences sont limitées à cinq et classées, les tarifs se fixent par
                  rapport au marché, et les informations personnelles arrivent en dernier, quand le profil vaut déjà la peine d’être protégé.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Pair a={images.resume} b={images.skills} />

        <Card label="Le pourquoi pas" title="Ni inscription via LinkedIn uniquement, ni long formulaire unique, ni compétences illimitées" tint="#7a5cf0">
          L’import LinkedIn seul semblait le plus rapide, mais beaucoup de professionnels de la sécurité gardent volontairement un LinkedIn minimal.
          Le formulaire unique, c’était ce que nous avions déjà, et il perdait les gens à mi-chemin. Des compétences illimitées semblaient
          généreuses, mais chaque profil finissait par tout lister, et le classement ne voulait plus rien dire.
        </Card>
      </Section>

      <Section id="biggest-shift" title="Le grand changement">
        <P lead>Passer de remplir un formulaire à relire un profil déjà là.</P>
        <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10">
          <div className="rv border-t border-line pt-5">
            <Label className="mb-3">Avant la refonte</Label>
            <p className="text-[17px] leading-[1.6] text-ink/80 md:text-[18px]">
              Un long formulaire où tous les champs étaient vides. Les candidats retapaient ce qui figurait déjà dans leur CV, abandonnaient à
              mi-parcours ou laissaient des champs clés vides, et le matching par IA travaillait avec des profils maigres qui se ressemblaient tous.
            </p>
          </div>
          <div className="rv border-t border-ink pt-5">
            <Label className="mb-3 text-accent!">Après la refonte</Label>
            <p className="text-[17px] leading-[1.6] text-ink/80 md:text-[18px]">
              Les candidats choisissent comment ajouter leur CV, l’IA pré-remplit l’expérience, la formation, les compétences et la bio, et dix
              courtes étapes se terminent par un aperçu du profil tel que les clients le verront.
            </p>
          </div>
        </div>
        <Figure img={images.experience} className="mt-12" />
      </Section>

      <Section id="business-value" title="Valeur business">
        <P>De meilleurs profils au départ, ce sont de meilleurs matchings ensuite, pour les candidats comme pour les clients. Les chiffres exacts sont sous NDA.</P>
        <div className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
          {[
            { label: "Façons d’ajouter un CV", value: "3", text: "Lien LinkedIn, import de fichier ou saisie manuelle, chacun avec une estimation honnête du temps nécessaire." },
            { label: "Compétences principales", value: "5", text: "Une liste courte et classée qui indique aux clients et au modèle de matching ce qu’une personne fait de mieux." },
          ].map((s) => (
            <div key={s.label} className="rv rounded-[20px] border border-line/70 bg-white/45 p-6 md:p-8">
              <Label>{s.label}</Label>
              <p className="font-display my-5 text-[56px] leading-none text-accent md:text-[72px]">{s.value}</p>
              <p className="text-[16px] leading-[1.6] text-ink/80 md:text-[17px]">{s.text}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

/* ───────────────────────── FULL CASE STUDY ───────────────────────── */

export function OnboardingFullFr() {
  return (
    <>
      <Section id="intro">
        <P lead>
          Sur une plateforme de recrutement, le profil, c’est le produit. Les clients le consultent, et le matching par IA le lit. J’ai repensé
          l’onboarding qui le crée. Le plus difficile n’était pas de demander plus d’informations, mais d’en demander moins : laisser le CV faire
          l’essentiel du travail, pour que les candidats n’aient plus qu’à vérifier et corriger.
        </P>
      </Section>

      <Section id="context" title="Contexte">
        <P>
          <A href="https://cyberr.ai/about-us">Cyberr</A> est une plateforme de recrutement et un réseau professionnel entièrement dédiés à la
          cybersécurité. Les clients y recherchent des talents, reçoivent des candidats proposés par l’IA, constituent des shortlists et recrutent
          directement des freelances.
        </P>
        <P>
          Tout cela repose sur une seule chose : ce que les candidats disent d’eux-mêmes à la plateforme. Le modèle de matching pondère les
          compétences, l’expérience et les tarifs. Si un profil est à moitié vide, le modèle devine, et les clients reçoivent des propositions
          auxquelles ils ne font pas confiance.
        </P>
        <P>
          Le premier onboarding était un long formulaire calqué sur la base de données : tous les champs, vides, sur une seule page. Cela convenait à
          l’équipe technique, mais pas aux utilisateurs. Ma mission : rendre l’onboarding assez rapide pour que les candidats aillent au bout, et assez
          structuré pour que le profil obtenu soit exploitable par le matching.
        </P>
      </Section>

      <Section id="problem" title="Le problème">
        <P>
          Le funnel de la première version montrait où ça cassait. La plupart des candidats qui abandonnaient le faisaient à la section expérience
          professionnelle, le premier endroit où il fallait beaucoup écrire. Ceux qui allaient au bout sautaient souvent ce qui comptait le plus pour
          le matching :
        </P>
        <Table
          firstColStrong
          head={["Ce que nous observions dans les profils", "Pourquoi c’était un problème"]}
          rows={[
            ["Bio vide ou d’une seule ligne", "Les clients ne savaient pas qui était la personne"],
            ["Tarifs non renseignés", "Le matching ne pouvait pas filtrer par budget, les clients devaient demander"],
            ["Plus de 15 compétences listées, sans ordre", "Tous les profils se ressemblaient, le modèle ne distinguait pas les points forts des compétences secondaires"],
            ["Expérience copiée du CV en un seul bloc, ou ignorée", "Les dates et les postes ne pouvaient pas être analysés, l’expérience pesait donc peu dans le matching"],
          ]}
        />
        <P>
          Le formulaire traitait chaque champ comme également important et n’aidait les candidats sur aucun d’eux. Avant de redessiner les écrans,
          je voulais comprendre pourquoi les gens s’arrêtaient et ce que les clients lisaient réellement.
        </P>
      </Section>

      <Section id="market" title="Ce que le marché nous a appris">
        <P>
          J’ai étudié les plateformes de freelances et de talents que les candidats utilisent déjà : <A href="https://www.upwork.com">Upwork</A>,{" "}
          <A href="https://www.toptal.com">Toptal</A>, <A href="https://www.malt.com">Malt</A>, <A href="https://contra.com">Contra</A> et le
          parcours de profil de LinkedIn, ainsi que des viviers de talents spécialisés en sécurité comme{" "}
          <A href="https://www.hackthebox.com/business/talent-search">Hack The Box</A>.
        </P>
        <P>
          Les bons parcours avaient trois points communs : ils découpaient le profil en petites étapes, importaient ce qu’ils pouvaient et aidaient
          sur les questions les plus difficiles, comme le prix. Les moins bons demandaient tout d’emblée, y compris les données personnelles, avant
          de donner quoi que ce soit en retour.
        </P>
        <P>J’en ai tiré trois principes de design :</P>
        <NumList
          items={[
            <>{b("Importer d’abord, demander ensuite.")} Ce qui existe déjà dans un CV ou sur LinkedIn ne devrait jamais être ressaisi.</>,
            <>{b("Une décision par écran.")} Il est plus facile de répondre à une question courte et claire qu’à une page de champs vides.</>,
            <>{b("Aider sur les questions difficiles.")} Les tarifs, les compétences et la bio sont là où les gens bloquent, c’est donc là que le design doit faire le plus de travail.</>,
          ]}
        />
      </Section>

      <Section id="research" title="À l’écoute des candidats et des clients">
        <P>
          J’ai mené des entretiens avec 8 candidats (3 juniors, 3 confirmés, 2 seniors) et 4 clients (2 recruteurs, un hiring manager et un lead
          technique), puis deux sessions de tests d’utilisabilité modérés sur un prototype Figma, avec 5 candidats chacune.
        </P>

        <H3>Organisation des sessions</H3>
        <Table
          firstColStrong
          head={["Session", "Format", "Contenu"]}
          rows={[
            ["Entretien candidat", "40 min, à distance", "Comment ils tiennent à jour leur CV et leur LinkedIn, comment ils remplissent leurs profils sur d’autres plateformes, où ils bloquent, comment ils fixent leur tarif"],
            ["Entretien client", "30 min, à distance", "Ce qu’ils lisent en premier dans un profil de freelance, ce qui leur fait passer un profil, à quels signaux ils font confiance"],
            ["Test d’utilisabilité candidat", "35 min, prototype Figma, pensée à voix haute", "7 tâches, de l’ajout du CV à la relecture du profil terminé"],
          ]}
        />
        <P>
          Chaque tâche avait un critère de réussite et une note de facilité (SEQ, de 1 à 7) ; les sessions se terminaient par un questionnaire SUS.
          Les problèmes étaient classés par gravité et comparés d’une session à l’autre.
        </P>

        <H3>Ce qui a résisté à la synthèse</H3>
        <P>J’ai regroupé les notes sur une affinity map et n’ai gardé que les tendances apparues chez au moins trois personnes.</P>
        <Table
          firstColStrong
          head={["Ce que nous avons appris", "D’où cela venait", "Ce que cela a changé dans le design"]}
          rows={[
            ["Les candidats ont déjà leur expérience rédigée et détestent la ressaisir", "7 entretiens candidats sur 8", "Trois façons d’ajouter un CV ; l’IA pré-remplit l’expérience, la formation, les compétences et la bio"],
            ["Beaucoup de professionnels de la sécurité gardent volontairement un LinkedIn minimal ou pas à jour", "4 entretiens candidats sur 8", "LinkedIn est une option parmi d’autres, pas la seule ; l’import de fichier est le chemin le plus rapide"],
            ["Une longue page de champs vides semble interminable, et les gens partent à la première section chargée", "Analyse du funnel, 5 entretiens sur 8", "Une question par écran, un compteur « 3 sur 10 » et une barre de progression"],
            ["Les clients ne lisent que les premières compétences d’un profil", "4 entretiens clients sur 4", "Jusqu’à cinq compétences principales, classées ; l’ordre influence le matching"],
            ["Les candidats ne savent pas combien facturer : les juniors se sous-évaluent, les seniors laissent le champ vide", "6 entretiens candidats sur 8", "Une fourchette de tarif fixée sur la distribution du marché, à la journée ou à l’année"],
            ["Se voir demander une adresse et une date de naissance dès le début paraît suspect", "5 entretiens candidats sur 8", "Informations personnelles déplacées à la dernière étape, avec une ligne d’explication"],
          ]}
        />
        <blockquote className="rv my-10 border-l-2 border-accent pl-6 text-[20px] leading-[1.45] text-ink md:pl-8 md:text-[24px]">
          L’insight qui a recadré le projet est venu d’une analyste SOC de niveau confirmé. Quand je lui ai demandé comment elle remplissait ses
          profils sur de nouvelles plateformes, elle m’a répondu qu’elle avait réécrit son CV trois fois ce mois-là et qu’elle voulait simplement que
          quelqu’un le lise. L’onboarding est alors passé d’un formulaire à remplir à un brouillon à vérifier.
        </blockquote>
      </Section>

      <Section id="decisions" title="Cinq décisions qui ont façonné l’onboarding">
        <H3>
          <span className="mr-3 text-accent">01</span>Relire plutôt que ressaisir
        </H3>
        <P>Le levier le plus puissant était de ne rien demander du tout. Nous avons envisagé trois modèles :</P>
        <List
          items={[
            <>{b("Import LinkedIn uniquement.")} Le plus rapide sur le papier, mais la recherche a montré que beaucoup de professionnels de la sécurité gardent volontairement un LinkedIn minimal, si bien que l’import reviendrait vide.</>,
            <>{b("Formulaire manuel, mieux organisé.")} Familier, mais il obligeait toujours à ressaisir un CV déjà existant.</>,
            <>{b("Trois chemins, avec l’IA qui rédige le premier jet.")} C’est l’option que nous avons retenue.</>,
          ]}
        />
        <P>
          À l’étape 2, les candidats choisissent comment ajouter leur CV : {b("Use LinkedIn link")}, {b("Upload the resume")} ou {b("Fill out manually")}.
          Chaque carte affiche une estimation honnête du temps nécessaire, pour que le chemin le plus rapide soit évident sans masquer les autres.
          L’IA analyse le CV et pré-remplit les étapes suivantes : métier, compétences, expérience, formation, langues et bio. Chaque étape devient
          alors une relecture : les entrées arrivent sous forme de cartes modifiables et supprimables, si bien que corriger une date erronée prend un
          clic, pas un paragraphe à retaper.
        </P>
        <Pair a={images.resumeLinkedin} b={images.resumeUpload} />
        <Figure img={images.experience} className="my-10" />

        <H3>
          <span className="mr-3 text-accent">02</span>Une question par écran
        </H3>
        <P>
          La première version demandait tout sur une seule page. La refonte la découpe en dix étapes, chacune avec une seule question et une courte
          ligne expliquant pourquoi elle compte : « C’est la première chose que les clients verront », « Les freelances qui ajoutent leur expérience
          professionnelle ont deux fois plus de chances de décrocher une mission ». Une pastille « 3 sur 10 » et une barre de progression montrent
          où en est le candidat, et le pied de page indique l’étape en cours.
        </P>
        <P>
          Le CV arrive dès le début, si bien que chaque étape suivante s’ouvre avec quelque chose de déjà rempli. Fermer le parcours avec ✕
          sauvegarde la progression : un candidat peut partir à l’étape 6 et revenir à l’étape 6.
        </P>
        <Figure img={images.title} className="my-10" />

        <H3>
          <span className="mr-3 text-accent">03</span>Cinq compétences, dans l’ordre
        </H3>
        <P>
          Dans la première version, les candidats listaient tous les outils et sujets qu’ils avaient abordés, et les profils devenaient
          indiscernables. Les clients nous ont dit qu’ils lisaient les premières compétences et sautaient le reste.
        </P>
        <P>
          L’étape 4 demande donc jusqu’à cinq compétences principales et permet aux candidats de les classer par glisser-déposer. L’ordre n’est pas
          décoratif : plus une compétence est haut placée, plus elle influence le score de matching, et l’écran le dit. Cinq, c’était un choix
          délibéré. C’est assez pour décrire une vraie spécialisation, assez court pour que les clients lisent tout, et assez peu pour que chaque
          compétence pèse dans le matching. Avec dix, la première compétence aurait peu compté ; avec trois, les personnes au profil large mais réel
          se sentaient à l’étroit.
        </P>
        <Figure img={images.skills} className="my-10" />

        <H3>
          <span className="mr-3 text-accent">04</span>Aider sur la question la plus difficile : le prix
        </H3>
        <P>
          Les tarifs étaient le champ le plus souvent ignoré. Les juniors visaient bas, les seniors ne voulaient pas s’engager sur un chiffre. Au lieu
          d’un champ vide, l’étape 9 affiche un curseur de fourchette sur la distribution des tarifs de la plateforme : les candidats voient où se
          situe la majorité et se positionnent par rapport à elle. Un sélecteur {b("Daily / Yearly")} couvre à la fois les missions freelance et
          les engagements plus longs, et la devise se choisit une seule fois, en haut.
        </P>
        <Figure img={images.rates} className="my-10" />

        <H3>
          <span className="mr-3 text-accent">05</span>Demander la confiance en dernier, montrer le résultat avant la mise en ligne
        </H3>
        <P>
          La date de naissance, le téléphone et l’adresse sont nécessaires pour sécuriser les paiements, mais les demander dès le premier écran
          faisait hésiter les candidats. Ils ont été déplacés à l’étape 10, quand le profil est déjà construit et vaut la peine d’être protégé, avec
          la photo et une ligne expliquant pourquoi nous en avons besoin.
        </P>
        <Figure img={images.details} className="my-10" />
        <P>
          Le parcours se termine par une relecture, pas par un « Terminé ». {b("Looking good, Josef!")} montre le profil exactement tel que les
          clients le verront : compétences, bio, projets, tarifs et formation. Les candidats repèrent leurs erreurs ici, avant tout le monde, et
          seulement ensuite cliquent sur {b("Complete profile")}.
        </P>
        <Figure img={images.review} className="mx-auto mt-10 md:max-w-[640px]" />
      </Section>

      <Section id="usability" title="Ce que les tests d’utilisabilité ont changé">
        <P>La première session n’a pas remis en cause la structure, mais elle a montré où les gens hésitaient encore.</P>
        <Table
          head={["Ce que nous avons observé en session 1", "Ce que nous avons changé"]}
          rows={[
            ["Les candidats ne savaient pas ce qui se passerait après l’import d’un CV", "Une ligne sous le titre explique que l’IA va extraire les informations et pré-remplir le profil"],
            ["Les candidats acceptaient les entrées remplies par l’IA sans vérifier, et laissaient passer des dates erronées", "Chaque entrée est devenue une carte modifiable et supprimable ; la fenêtre de modification s’ouvre avec tous les champs pré-remplis"],
            ["Personne ne comprenait que l’ordre des compétences comptait", "Des poignées de glisser-déposer sur chaque compétence et une ligne expliquant que les compétences du haut pèsent plus dans le matching"],
            ["Fermer le parcours donnait l’impression de tout perdre", "✕ sauvegarde la progression, et au retour on retrouve la même étape"],
            ["L’étape des informations personnelles provoquait une hésitation visible", "Déplacée à la fin, avec une ligne d’explication : la sécurité des paiements"],
            ["Plusieurs candidats voulaient voir leur profil avant sa mise en ligne", <>Un écran de relecture avec le profil complet avant {b("Complete profile")}</>],
          ]}
        />
        <Figure img={images.editEducation} className="my-10" />
        <P>
          Lors de la session 2, les cinq candidats ont terminé l’onboarding sans aide, et la plupart de ceux qui avaient importé un CV ont fini en
          moins de dix minutes. Chaque candidat a ouvert au moins une carte pré-remplie pour la vérifier, exactement le comportement que nous
          recherchions.
        </P>
      </Section>

      <Section id="outcome" title="Le résultat">
        <P>Le nouvel onboarding a été mis en production. Les chiffres exacts sont sous NDA, mais la tendance est claire :</P>
        <div className="my-8 grid gap-4 md:grid-cols-3 md:gap-5">
          {[
            ["Des profils complets dès l’arrivée.", "Expérience, compétences, bio et tarifs sont renseignés dès le départ, pas ajoutés plus tard ou jamais."],
            ["Le matching reçoit de vraies données.", "Des compétences classées, une expérience structurée et une fourchette de tarif donnent au modèle des signaux clairs au lieu de suppositions."],
            ["Un démarrage plus rapide pour les candidats.", "Le CV fait l’essentiel du travail, et le chemin le plus lent est celui que l’on choisit délibérément."],
          ].map(([t, d]) => (
            <Card key={t} title={t}>
              {d}
            </Card>
          ))}
        </div>

        <H3>Ce que nous mesurons</H3>
        <P>J’ai travaillé avec le PM pour définir le succès sous forme de funnel, afin que l’équipe voie où l’onboarding perd encore des utilisateurs :</P>
        <Table
          firstColStrong
          head={["Étape", "Indicateur", "Ce qu’il nous apprend"]}
          rows={[
            ["Démarrage", "Part des candidats choisissant chaque façon d’ajouter un CV", "Les gens font-ils confiance à l’import ?"],
            ["Progression", "Abandons par étape", "Quelle question bloque encore les gens ?"],
            ["Qualité", "Modifications apportées aux entrées remplies par l’IA", "L’analyse est-elle précise, et les gens la vérifient-ils ?"],
            ["Finalisation", "Taux de finalisation de l’onboarding et temps nécessaire", "Le parcours est-il assez court ?"],
            ["Profil", "Part des profils avec bio, tarifs et compétences classées", "L’onboarding produit-il des profils exploitables par le matching ?"],
            ["Valeur", "Délai avant la première invitation d’un client", "Un meilleur profil mène-t-il à des missions ?"],
          ]}
        />
      </Section>

      <Section id="learned" title="Ce que j’ai appris">
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <Card title="Le meilleur champ est celui qu’on n’a pas à remplir.">
            L’essentiel du gain n’est pas venu de meilleurs champs, mais de leur suppression. Dès que le CV s’est chargé de la saisie, chaque étape
            est devenue une vérification rapide.
          </Card>
          <Card title="L’ordre est une décision de design.">
            Les mêmes dix questions donnaient une impression très différente selon ce qui venait en premier. Avec le CV en tête, chaque étape suivante
            commence à moitié faite, et les questions sensibles passent mieux une fois que le profil semble déjà appartenir au candidat.
          </Card>
          <Card title="Aider là où les gens bloquent, pas partout.">
            La plupart des étapes n’ont besoin que d’une question claire. L’effort de design s’est concentré sur les quelques-unes qui arrêtent les
            gens : combien facturer, quelles compétences mettre en avant, quoi écrire sur soi.
          </Card>
          <Card title="Concevoir pour deux lecteurs.">
            Un profil est lu par des clients et par un modèle de matching. Des compétences classées et une fourchette de tarif servent les deux :
            faciles à parcourir pour une personne, claires à pondérer pour un algorithme.
          </Card>
        </div>
      </Section>
    </>
  );
}
