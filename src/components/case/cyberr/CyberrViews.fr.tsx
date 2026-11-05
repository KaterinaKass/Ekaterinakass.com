import { A, Card, Figure, H3, Label, List, NumList, P, Pair, Section, Table, type Img } from "../CaseUI";
import { FigureVideo, type Vid } from "../FigureVideo";
import type { CaseData } from "./CyberrCase";

/* Тексты кейса Cyberr — Technical Tests (французская версия). Источник: CyberrViews.tsx */

const DIR = "/images/cases/cyberr-tests";
const img = (file: string, alt: string, w = 3000, h = 2250): Img => ({ src: `${DIR}/${file}`, w, h, alt });
// видео + картинка-превью с тем же именем и суффиксом -poster
const vid = (name: string, alt: string, w = 2000, h = 1500): Vid => ({ ...img(`${name}-poster.webp`, alt, w, h), video: `${DIR}/${name}.mp4` });

export const SCRIPTS_HREF_FR = "/work/cyberr-technical-tests/research-scripts";

const images = {
  hero: { ...img("Tests-Tests.webp", "Hub des tests techniques Cyberr avec les tests en attente, une bannière de valeur et les catégories de tests"), video: `${DIR}/Tests-Tests.mp4` },
  resultSummary: img("Tests-Test-result.webp", "Résultat de test d’un candidat avec le détail par question, Retake test et Publish on my profile"),
  waitingSummary: img("Tests-waiting.webp", "Écran de test mobile dans l’état « Waiting for results »", 3000, 2000),
  clientResultsSummary: img("Client-test-results.webp", "Vue client comparant trois candidats question par question, avec les réussites et les échecs"),
  result: img("Tests-Test-result.webp", "Résultat de test d’un candidat avec les points, les bonnes réponses, le temps passé, le détail par question, Retake test et Publish on my profile"),
  waiting: img("Tests-Results-waiting-mob.webp", "Écran de test mobile dans l’état « Waiting for results » après le retour de l’environnement Airbus", 3000, 2000),
  selectTest: img("Client-select-test.webp", "Le client choisit un test parmi les domaines de la cybersécurité, chacun avec une échelle de niveau et une durée"),
  clientResults: img("Client-test-results.webp", "Matrice des résultats comparant trois candidats question par question, avec Book a meeting dans l’en-tête"),
  selectCandidates: vid("Client-select-candidates", "Étape 1 de Send test : sélection des candidats dans la shortlist, avec le compteur Tech Tests Left et Buy more tests"),
  leaderboard: vid("Tests-Leaderboard-new", "Classement avec onglets de ligues, podium, ligne de l’utilisateur épinglée et carte de progression vers la ligue suivante"),
};

const header: CaseData["header"] = {
  eyebrow: ["Plateforme de recrutement", "Cyberr Technical Tests"],
  title: "Les tests techniques de Cyberr : des compétences déclarées aux compétences prouvées",
  meta: [
    { label: "Rôle", value: "Seule Product Designer" },
    { label: "Périmètre", value: "Recherche utilisateur, analyse concurrentielle, design UI/UX, tests d’utilisabilité" },
    { label: "Équipe", value: "Product Manager, ingénieurs Machine Learning, ingénieurs frontend" },
    { label: "Utilisateurs", value: "Candidats en cybersécurité (de junior à senior) et clients recruteurs : recruteurs, hiring managers, responsables techniques" },
  ],
};

const nav = {
  summary: [
    { id: "overview", label: "Aperçu" },
    { id: "long-story-short", label: "En bref" },
    { id: "biggest-shift", label: "Le grand changement" },
    { id: "business-value", label: "Valeur business" },
  ],
  full: [
    { id: "overview", label: "Aperçu" },
    { id: "context", label: "Contexte" },
    { id: "tension", label: "La tension" },
    { id: "market", label: "Marché" },
    { id: "research", label: "Recherche" },
    { id: "decisions", label: "Décisions" },
    { id: "usability", label: "Tests d’utilisabilité" },
    { id: "outcome", label: "Résultats" },
    { id: "learned", label: "Ce que j’ai appris" },
  ],
};

export const testsCaseFr: CaseData = { header, hero: images.hero, nav, scriptsHref: SCRIPTS_HREF_FR };

const b = (t: string) => <strong className="font-semibold text-ink">{t}</strong>;

/* ───────────────────────── SUMMARY ───────────────────────── */

export function SummaryViewFr() {
  return (
    <>
      <Section id="long-story-short" title="En bref">
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <Card label="Le quoi" title="Des tests pratiques au sein d’une plateforme de recrutement en cybersécurité" tint="#0388ee">
            Cyberr vérifiait déjà les identités et les certifications. J’ai conçu la couche qui manquait : des tests pratiques construits avec Airbus,
            qui permettent aux candidats de prouver ce qu’ils savent faire et donnent aux clients un moyen d’exploiter cette preuve dans les projets
            pour lesquels ils recrutent.
          </Card>
          <Card label="Le pourquoi" title="Un test se place entre deux personnes aux attentes opposées" tint="#e0457b">
            Les candidats veulent paraître solides et craignent qu’un mauvais résultat les poursuive. Les clients veulent la vérité, vite, et
            craignent un résultat qui ne veut rien dire. Trop pencher vers les clients, et les candidats ne commencent pas ; trop pencher vers les
            candidats, et les clients ne font plus confiance au résultat. La première spécification penchait vers la rigueur : une seule tentative,
            des résultats synchronisés avec le profil, aucun retour.
          </Card>
          <Card label="Le comment" className="md:col-span-2" tint="#e8862a">
            <div className="grid gap-8 md:grid-cols-2 md:gap-10">
              <div>
                <h3 className="mb-4 text-[21px] leading-[1.2] font-semibold tracking-[-0.01em] text-ink md:text-[24px]">Ce que la recherche m’a permis de faire</h3>
                <p>
                  Des entretiens avec 6 candidats et 5 clients, puis deux sessions de tests d’utilisabilité, ont renversé la spécification stricte.
                  Les trois candidats seniors préféraient n’avoir aucun résultat plutôt qu’un résultat faible et public, et 4 clients sur 5 ont dit
                  faire confiance à la comparaison, pas à un chiffre isolé.{" "}
                  <A href={SCRIPTS_HREF_FR}>Scripts de recherche</A>
                </p>
              </div>
              <div>
                <h3 className="mb-4 text-[21px] leading-[1.2] font-semibold tracking-[-0.01em] text-ink md:text-[24px]">Quelle direction de design</h3>
                <p>
                  Privé par défaut, partagé par choix. Les résultats restent au candidat jusqu’à ce qu’il les publie, avec la possibilité de repasser
                  le test pour réduire l’enjeu. Un état d’attente visible accompagne le passage vers l’environnement Airbus. Côté clients, les tests
                  partent de la shortlist du projet et aboutissent à une comparaison question par question.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Pair a={images.resultSummary} b={images.waitingSummary} />

        <Card label="Le pourquoi pas" title="Pas de scores publics par défaut, pas de résultats faibles masqués, pas de chiffre unique" tint="#7a5cf0">
          Des résultats publics par défaut auraient fait fuir les profils les plus expérimentés et laissé un classement rempli de débutants. Masquer
          automatiquement les résultats faibles semblait rassurant, mais les clients n’auraient vu que de bons scores et n’auraient cru à aucun
          d’entre eux. Une liste classée par score réduisait les gens au seul chiffre auquel les clients disaient ne pas croire.
        </Card>

        <FigureVideo img={images.leaderboard} className="mt-10" />
      </Section>

      <Section id="biggest-shift" title="Le grand changement">
        <P lead>D’un score auquel il faut faire confiance à une comparaison sur laquelle on peut agir.</P>
        <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10">
          <div className="rv border-t border-line pt-5">
            <Label className="mb-3">Avant la refonte</Label>
            <p className="text-[17px] leading-[1.6] text-ink/80 md:text-[18px]">
              Les compétences étaient autodéclarées. Les clients se fiaient aux CV ou menaient leur propre présélection en dehors de Cyberr, et un
              excellent candidat ressemblait sur le papier à un candidat moyen.
            </p>
          </div>
          <div className="rv border-t border-ink pt-5">
            <Label className="mb-3 text-accent!">Après la refonte</Label>
            <p className="text-[17px] leading-[1.6] text-ink/80 md:text-[18px]">
              Les clients envoient un test à leur shortlist en trois étapes et voient chaque candidat sur les mêmes questions, réussies ou échouées,
              avec Book a meeting directement dans l’en-tête. Les candidats décident eux-mêmes du moment où leurs résultats deviennent publics.
            </p>
          </div>
        </div>
        <Figure img={images.clientResultsSummary} className="mt-12" />
      </Section>

      <Section id="business-value" title="Valeur business">
        <P>
          Un partenariat avec Airbus transformé en ligne de produit, et une couche de confiance que les job boards généralistes n’ont pas. Les
          chiffres exacts sont sous NDA.
        </P>
        <div className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
          {[
            { label: "Couches de confiance", value: "3", text: "Identité, certifications et désormais compétences pratiques, toutes vérifiées sur une seule plateforme." },
            { label: "Demande des clients", value: "5 sur 5", text: "Les clients voulaient tester la shortlist qu’ils avaient déjà : Send test se trouve donc dans le projet." },
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

export function FullViewFr() {
  return (
    <>
      <Section id="intro">
        <P lead>
          Dans le recrutement en cybersécurité, tout le monde se dit bon. J’ai conçu la fonctionnalité qui permet aux candidats de le prouver, et
          qui donne aux clients un moyen d’agir sur cette preuve. Le plus difficile, ce n’étaient pas les écrans. C’était de rendre un test assez
          rassurant pour que les candidats le passent, et assez crédible pour que les clients y croient.
        </P>
      </Section>

      <Section id="context" title="Contexte">
        <P>
          <A href="https://cyberr.ai/about-us">Cyberr</A> est une plateforme de recrutement et un réseau professionnel dédiés exclusivement à la
          cybersécurité. Elle avait déjà résolu deux couches de confiance : les identités étaient vérifiées et les certifications validées via
          Credly. Les clients pouvaient rechercher des talents, utiliser le matching par IA, constituer des shortlists et recruter directement.
        </P>
        <P>
          Mais une identité vérifiée et un certificat valide ne disent toujours rien de la capacité d’une personne à trouver et exploiter un service
          mal configuré sous la pression du temps. C’était la couche manquante. Les clients continuaient de mener leurs propres évaluations
          techniques en dehors de la plateforme, et chaque bon candidat ressemblait sur le papier à un candidat moyen.
        </P>
        <P>
          Un partenariat avec Airbus nous a apporté des missions pratiques et réalistes dans un véritable environnement d’attaque. Mon rôle était
          d’en faire un produit que les deux côtés utiliseraient vraiment.
        </P>
      </Section>

      <Section id="tension" title="La tension">
        <P>Un test se place entre deux personnes qui en attendent des choses opposées.</P>
        <Table
          firstColStrong
          head={["", "Le candidat", "Le client"]}
          rows={[
            ["Veut", "Paraître solide et se faire remarquer", "Voir la vérité, vite"],
            ["Craint", "Un mauvais résultat qui le poursuit pour toujours", "Un résultat qu’on peut truquer ou qui ne veut rien dire"],
            ["Attend du design", "Sécurité et contrôle", "Transparence et comparabilité"],
          ]}
        />
        <P>
          Si l’on penche trop vers le client, les candidats ne commencent pas. Si l’on penche trop vers le candidat, le résultat devient du
          marketing et les clients cessent d’y croire. Un test que personne ne passe et un résultat auquel personne ne croit échouent de la même
          manière : la fonctionnalité meurt.
        </P>
        <P>
          La première spécification penchait vers la rigueur : une seule tentative par test, des résultats synchronisés avec le profil, aucun retour
          détaillé. C’était propre du point de vue de l’ingénierie, mais cela supposait que les candidats accepteraient un enjeu élevé sans aucun
          contrôle. Je n’en étais pas sûre, alors avant de concevoir quoi que ce soit, j’ai voulu entendre les deux côtés.
        </P>
      </Section>

      <Section id="market" title="Ce que le marché nous a appris">
        <P>
          Le déficit de compétences en sécurité est une question de qualité, pas seulement d’effectifs : en 2024, ISC2 estimait le manque à environ
          4,8 millions de professionnels, et 90 % des répondants signalaient des lacunes de compétences dans leurs équipes (
          <A href="https://www.isc2.org/Insights/2024/10/ISC2-2024-Cybersecurity-Workforce-Study">ISC2</A>). Les employeurs ont besoin d’un
          meilleur signal, et plusieurs produits tentent déjà de le leur donner.
        </P>
        <P>
          En les observant, j’ai vu deux camps. Les {b("plateformes de formation")} comme{" "}
          <A href="https://www.hackthebox.com/business/talent-search">Hack The Box</A>,{" "}
          <A href="https://help.tryhackme.com/en/articles/10517530-tryhackme-leagues">TryHackMe</A> et{" "}
          <A href="https://pro.root-me.org/?page=sommaire&lang=en">Root-Me PRO</A> excellent dans la motivation, avec des rangs, des ligues et des
          séries. Mais leurs scores mesurent surtout votre niveau d’activité, et le recrutement y reste secondaire. Les {b("outils d’évaluation")}{" "}
          comme HackerRank et{" "}
          <A href="https://www.testgorilla.com/blog/how-assess-cybersecurity-skills/">TestGorilla</A> s’inscrivent dans le processus de
          recrutement, mais leurs résultats appartiennent à un seul employeur. Les candidats repassent un nouveau test à chaque candidature, et ces
          tests vérifient davantage les connaissances que la pratique.
        </P>
        <P>J’en ai tiré trois principes de design :</P>
        <NumList
          items={[
            <>{b("Emprunter la motivation, pas le bruit.")} La gamification doit attirer les candidats, mais le résultat doit refléter la compétence, pas l’acharnement.</>,
            <>{b("Le résultat appartient au candidat.")} Il doit pouvoir le présenter à n’importe quel employeur, et c’est lui qui décide quand il est visible.</>,
            <>
              {b("Les tests vivent là où se fait le recrutement.")} Pour les clients, un test n’est utile qu’au sein du projet pour lequel ils
              recrutent, à côté des personnes qu’ils envisagent.
            </>,
          ]}
        />
      </Section>

      <Section id="research" title="À l’écoute des deux côtés">
        <P>
          J’ai mené des entretiens exploratoires avec 6 candidats (moitié juniors et confirmés, moitié seniors) et 5 clients (recruteurs, hiring
          managers et un responsable technique). J’ai volontairement réparti les candidats par séniorité : je m’attendais à ce que juniors et
          seniors vivent très différemment le fait d’être testés, et c’était le cas. Ensuite, deux sessions de tests d’utilisabilité modérés sur
          des prototypes Figma, avec 5 participants par groupe à chaque session, ont vérifié si le design répondait vraiment à ce que nous avions
          entendu.
        </P>

        <H3>Organisation des sessions</H3>
        <Table
          firstColStrong
          head={["Session", "Format", "Contenu"]}
          rows={[
            ["Entretien candidat", "45 min, à distance", "Comment ils prouvent leurs compétences aujourd’hui, ce qu’ils ressentent face aux tests et aux classements, ce qu’ils attendent après un test sur une plateforme externe"],
            ["Entretien client", "45 min, à distance", "Comment ils évaluent les compétences techniques aujourd’hui, à quels signaux ils se fient, comment ils compareraient les candidats et qui devrait payer un test"],
            ["Test d’utilisabilité candidat", "40 min, prototype Figma, pensée à voix haute", "8 tâches, de la recherche d’un test à la compréhension de ce qu’il faut pour atteindre la ligue suivante"],
            ["Test d’utilisabilité client", "30 min, prototype Figma, pensée à voix haute", "6 tâches, de l’envoi d’un test depuis la shortlist à la prise de rendez-vous avec le meilleur candidat"],
          ]}
        />
        <P>
          Chaque tâche d’utilisabilité avait un critère de réussite et une note de facilité (SEQ, de 1 à 7) ; les sessions candidats se terminaient
          par un questionnaire SUS. Les problèmes étaient classés par gravité et comparés d’une session à l’autre. Avec les clients, une question
          d’entretien a fait l’essentiel du travail :{" "}
          <em>« Un candidat a obtenu 70 % à un pentest pratique. Qu’est-ce que cela vous dit ? »</em> Presque personne n’a pu répondre sans
          demander ce que la personne avait raté exactement.
        </P>
        <P>
          <A href={SCRIPTS_HREF_FR}>Scripts de recherche</A> : critères de recrutement des participants, les quatre scripts et les tâches
          d’utilisabilité.
        </P>

        <H3>Ce qui a résisté à la synthèse</H3>
        <P>
          Après chaque session, j’ai regroupé les notes sur une carte d’affinités et n’ai gardé que les tendances apparues chez au moins trois
          personnes. Voici ce qui a résisté, et ce que cela a changé.
        </P>
        <Table
          firstColStrong
          head={["Ce que nous avons appris", "D’où cela vient", "Ce que cela a changé dans le design"]}
          rows={[
            ["Les candidats seniors préfèrent n’avoir aucun résultat plutôt qu’un résultat faible et public", "3 entretiens seniors sur 3", "Les résultats sont privés par défaut ; la publication est le choix du candidat"],
            ["Les candidats repoussent les tests quand l’effort n’est pas clair", "5 entretiens candidats sur 6", "Niveau, durée et thèmes visibles sur chaque carte ; un panneau de détails avant de commencer"],
            ["Quitter la plateforme pour l’environnement de test sème le doute : est-ce enregistré, quand vais-je savoir ?", "Entretiens, confirmé lors de la 1re session d’utilisabilité", "Un bloc Pending tests qui suit chaque test en cours et son échéance"],
            ["Les juniors voient les tests comme un moyen de se démarquer sans expérience", "3 entretiens juniors sur 3", "Classement et ligues pour récompenser la progression et rendre visibles les juniors talentueux"],
            ["Les clients ne se fient pas à un chiffre unique ; ils se fient à la comparaison", "4 entretiens clients sur 5", "Une vue côte à côte des candidats sur les mêmes questions"],
            ["Les clients ont déjà une shortlist et veulent tester précisément ces personnes", "5 entretiens clients sur 5", "Send test part de la shortlist du projet, pas d’un catalogue séparé"],
            ["Les clients veulent savoir à quoi les candidats seront confrontés avant de payer", "1re session d’utilisabilité", "Des détails du test avec la liste complète des questions, accessibles avant l’envoi"],
          ]}
        />
        <blockquote className="rv my-10 border-l-2 border-accent pl-6 text-[20px] leading-[1.45] text-ink md:pl-8 md:text-[24px]">
          L’insight qui a recadré le projet est venu d’un pentesteur senior. Quand je lui ai demandé ce qu’il penserait d’un score public, il m’a
          répondu qu’il ne passerait tout simplement jamais le test. Cette seule réponse a renversé le modèle strict de la première spécification :
          si les profils les plus expérimentés se retirent, le classement se remplit de débutants, et les clients apprennent à l’ignorer.
        </blockquote>
      </Section>

      <Section id="decisions" title="Cinq décisions qui ont façonné le produit">
        <H3>
          <span className="mr-3 text-accent">01</span>Privé par défaut, partagé par choix
        </H3>
        <P>La question centrale était de savoir qui voit un résultat, et quand. Nous avons envisagé trois modèles :</P>
        <List
          items={[
            <>{b("Public par défaut")}, comme dans la première spécification. Transparence maximale, mais la recherche nous a montré que les candidats seniors ne commenceraient tout simplement pas.</>,
            <>{b("Masquer automatiquement les résultats faibles")} sous un certain seuil. Rassurant en apparence, mais les clients ne verraient que de bons scores et cesseraient de croire à tous.</>,
            <>{b("Privé par défaut, avec un partage explicite.")} C’est ce que nous avons choisi.</>,
          ]}
        />
        <P>
          Le modèle final distingue deux contextes. Un test qu’un candidat passe de lui-même reste privé jusqu’à ce qu’il appuie sur{" "}
          {b("Publish on my profile")}. Un test envoyé par un client est partagé avec ce client par principe, car le candidat l’accepte dans le
          cadre d’une candidature. Les candidats gardent le contrôle là où leur réputation est en jeu ; les clients obtiennent des résultats non
          filtrés là où le recrutement l’exige. {b("Retake test")} réduit encore l’enjeu : une première tentative est un entraînement, pas un
          verdict.
        </P>
        <Figure img={images.result} className="my-10" />

        <H3>
          <span className="mr-3 text-accent">02</span>Concevoir l’entre-deux
        </H3>
        <P>
          Les tests se déroulent dans l’environnement Airbus, pas dans Cyberr. C’est dans cet écart que la confiance s’effrite : les utilisateurs
          terminent, ferment l’onglet et ne savent pas si quelque chose s’est passé. Un simple e-mail semblait trop passif, et un statut enfoui dans
          la carte du test passait trop facilement inaperçu.
        </P>
        <P>
          J’ai fait de l’état d’attente un élément à part entière de la page. Les {b("Pending tests")} sont en haut du hub : chaque carte affiche le
          test, le poste et l’entreprise d’où il vient, le temps restant avec une barre de progression, et une seule action, {b("Go to test")}. Les
          résultats se synchronisent automatiquement, et le bloc se transforme discrètement en résultat. Honnêtement, c’était l’écran le moins
          spectaculaire du projet, et probablement celui qui a le plus contribué au taux de complétion.
        </P>
        <Figure img={images.waiting} className="my-10" />

        <H3>
          <span className="mr-3 text-accent">03</span>Un effort visible avant de s’engager
        </H3>
        <P>
          Les candidats repoussaient les tests quand ils ne pouvaient pas estimer l’effort ; chaque carte répond donc d’un coup d’œil à trois
          questions : quelle difficulté (une échelle de niveau), combien de temps (la durée) et ce que l’on gagne (des points). Un panneau de
          détails avant {b("Start mission")} présente l’environnement et les thèmes couverts. Le même principe se retrouve côté client : un client
          voit les mêmes détails, plus un onglet {b("Questions")}, avant d’envoyer un test à qui que ce soit.
        </P>
        <Figure img={images.selectTest} className="my-10" />

        <H3>
          <span className="mr-3 text-accent">04</span>D’un chiffre à une décision
        </H3>
        <P>
          Pour les clients, le score lui-même n’a jamais été le produit ; c’était la décision. Nous avons exploré une liste de candidats classés par
          score et des cartes de profil avec un badge de score. Les deux réduisaient les gens à un seul chiffre, exactement ce à quoi les clients
          disaient ne pas faire confiance.
        </P>
        <P>
          La vue finale {b("Test results")} est une matrice : les candidats en colonnes avec leur score global, les questions en lignes avec, pour
          chacune, une marque claire de réussite ou d’échec. Un recruteur voit immédiatement que deux candidats aux totaux proches ont échoué sur
          des thèmes complètement différents. Chaque test a son propre onglet, et {b("Book a meeting")} se trouve directement dans l’en-tête : la
          comparaison se conclut par une action, pas par un tableur.
        </P>
        <Figure img={images.clientResults} className="my-10" />
        <P>
          Y accéder devait être tout aussi direct. {b("Send test")} se trouve dans la shortlist du projet et ouvre un parcours en trois étapes :
          sélectionner les candidats, choisir un test, envoyer. Un compteur {b("Tech Tests Left")} et un panneau {b("Buy more tests")} intégré
          font qu’être à court de tests n’interrompt jamais le parcours.
        </P>
        <FigureVideo img={images.selectCandidates} className="my-10" />

        <H3>
          <span className="mr-3 text-accent">05</span>De la motivation sans bruit
        </H3>
        <P>
          Nous voulions donner aux juniors une raison de revenir, sans transformer le classement en course aux points. Les ligues reposent sur les
          points obtenus aux tests validés, pas sur l’activité hebdomadaire. La ligne de l’utilisateur est toujours épinglée en bas du tableau,
          même loin dans la liste, et une carte de progression transforme un rang lointain en objectif concret : le nombre de points jusqu’à la
          ligue suivante.
        </P>
        <FigureVideo img={images.leaderboard} className="mt-10" />
      </Section>

      <Section id="usability" title="Ce que les tests d’utilisabilité ont changé">
        <P>
          La première session de tests d’utilisabilité n’a pas remis en cause les grandes décisions, mais elle a révélé les failles entre elles. La
          plupart des problèmes concernaient la clarté dans les moments d’incertitude, le même thème que dans la recherche.
        </P>
        <Table
          head={["Ce que nous avons observé lors de la 1re session", "Ce que nous avons changé"]}
          rows={[
            ["Plusieurs candidats lisaient l’échelle à points comme une note, pas comme une difficulté", "Ajout d’un libellé « Level » à côté des points, avec une échelle identique sur tous les écrans"],
            ["Les candidats ne savaient pas si un résultat terminé était déjà public", <>Un état privé par défaut et une action unique et explicite, {b("Publish on my profile")}</>],
            ["Les clients cherchaient à tester les candidats depuis l’onglet Candidates, pas dans une section à part", <>{b("Send test")} a été déplacé dans la shortlist du projet, là où les clients prennent déjà leurs décisions</>],
            ["Les clients hésitaient à envoyer un test qu’ils ne pouvaient pas prévisualiser", <>Un onglet {b("Questions")} dans les détails du test, accessible avant l’envoi</>],
            ["Être à court de tests en plein parcours renvoyait les clients vers une page de tarifs séparée", "Les tests restants sont visibles dès la première étape, et l’achat s’ouvre dans un panneau latéral"],
            ["Les clients ne comparaient que le pourcentage global et passaient à côté du détail", "Des marques par question plus contrastées, et les scores globaux déplacés dans les en-têtes de colonnes"],
          ]}
        />
        <P>
          Lors de la 2e session, chaque candidat a trouvé son test en attente et compris la visibilité de son résultat sans aide. Les clients ont
          réalisé le parcours d’envoi d’un test sans aide, et la plupart sont allés directement à la vue par question quand on leur a demandé qui
          avait le mieux réussi.
        </P>
      </Section>

      <Section id="outcome" title="Le résultat">
        <P>Les tests techniques ont été mis en production. Les chiffres exacts sont sous NDA, mais les grandes lignes du résultat sont claires :</P>
        <div className="my-8 grid gap-4 md:grid-cols-3 md:gap-5">
          {[
            ["Une nouvelle couche de confiance.", "Cyberr vérifie désormais l’identité, les certifications et les compétences pratiques, ce qu’aucun job board généraliste ne propose."],
            ["La présélection s’est installée dans la plateforme.", "Les clients testent leur shortlist au sein d’un projet et comparent les candidats avant de fixer des entretiens, au lieu de mener des processus séparés."],
            ["Une nouvelle source de revenus.", "Les tests payants pour les clients et les candidats ont transformé un partenariat avec Airbus en ligne de produit."],
          ].map(([t, d]) => (
            <Card key={t} title={t}>
              {d}
            </Card>
          ))}
        </div>

        <H3>Ce que nous mesurons</H3>
        <P>
          Avec le PM, j’ai défini le succès comme un entonnoir plutôt qu’un chiffre unique, pour que l’équipe voie où la confiance se rompt :
        </P>
        <Table
          firstColStrong
          head={["Côté", "Indicateur", "Ce qu’il nous dit"]}
          rows={[
            ["Candidats", "Taux de démarrage des tests depuis le hub", "Commencer un test est-il perçu comme sûr et digne du temps investi ?"],
            ["Candidats", "Taux de complétion après le passage vers l’environnement de test", "Le passage de relais fonctionne-t-il ?"],
            ["Candidats", "Taux de publication des résultats terminés", "Les candidats pensent-ils que les résultats les aident ?"],
            ["Clients", "Projets dans lesquels un test a été envoyé", "Les tests font-ils partie du parcours de recrutement ?"],
            ["Clients", "Entretiens fixés depuis Test results", "La comparaison mène-t-elle à des décisions ?"],
            ["Business", "Achats de tests récurrents", "Les clients y voient-ils assez de valeur pour payer à nouveau ?"],
          ]}
        />
      </Section>

      <Section id="learned" title="Ce que j’ai appris">
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <Card title="La confiance est un problème de design à deux faces.">
            J’ai commencé par concevoir une fonctionnalité pour les candidats et j’ai fini par concevoir un contrat entre deux personnes. Chaque
            décision devait fonctionner pour les deux, et les meilleures, comme « privé par défaut, partagé par choix », donnaient à chaque côté ce
            dont il avait besoin sans le retirer à l’autre.
          </Card>
          <Card title="Les écrans les plus discrets portent le plus de poids.">
            Un état d’attente retient rarement l’attention du design, et pourtant, dans un parcours qui quitte la plateforme, c’est le moment qui
            décide si les gens reviennent. Le bloc Pending tests a fait plus pour la complétion que n’importe quel écran plus visible.
          </Card>
          <Card title="Un chiffre n’est pas un insight.">
            Les clients ne voulaient pas un meilleur score ; ils voulaient une décision plus simple. Concevoir pour la décision, et non pour la
            donnée, a complètement transformé la vue des résultats.
          </Card>
          <Card title="Remettre en cause la spécification avec des preuves, pas des opinions.">
            La première spécification n’était pas fausse, elle n’avait pas été testée. Une seule tendance nette chez les seniors a suffi à changer le
            modèle central, parce qu’elle s’accompagnait d’une conséquence réelle pour le business : un classement vide.
          </Card>
        </div>
      </Section>
    </>
  );
}
