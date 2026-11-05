import type { ReactNode } from "react";
import { RevealScope } from "../RevealScope";
import { A, BackLink, List, P, Section, Table, Words } from "../CaseUI";

export const researchScriptsMetaFr = {
  title: "Scripts de recherche — Technical Tests chez Cyberr",
  description: "Scripts des entretiens exploratoires et des tests d’utilisabilité modérés sur Cyberr Technical Tests.",
};

const CASE_HREF = "/work/cyberr-technical-tests?view=full";

/** Подзаголовок внутри скрипта (Background, Proving skills today…) */
function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rv mt-8">
      <p className="mb-3 text-[12px] font-medium tracking-[0.08em] text-muted uppercase md:text-[13px]">{title}</p>
      {children}
    </div>
  );
}

/** Вопросы со сквозной нумерацией. */
function Questions({ start = 1, items }: { start?: number; items: string[] }) {
  return (
    <ol start={start} className="border-t border-line">
      {items.map((q, i) => (
        <li key={i} className="flex gap-5 border-b border-line py-4 text-[17px] leading-[1.55] text-ink/80 md:gap-8 md:text-[18px]">
          <span className="font-display w-8 shrink-0 text-[17px] leading-[1.6] text-accent">{String(start + i).padStart(2, "0")}</span>
          <span>{q}</span>
        </li>
      ))}
    </ol>
  );
}

/** Абзац с жирным началом: «Intro.», «Setup.», «Wrap-up.» */
function Note({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p className="rv mt-8 rounded-[20px] border border-line/70 bg-white/45 p-6 text-[17px] leading-[1.6] text-ink/80 md:p-8 md:text-[18px]">
      <strong className="font-semibold text-ink">{label}</strong> {children}
    </p>
  );
}

export function ResearchScriptsFr() {
  return (
    <RevealScope className="relative z-10 bg-cream">
      <header className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <div className="relative mx-[5%] px-4 pt-6 md:px-[clamp(24px,3.5vw,56px)] lg:pt-8">
          <BackLink href={CASE_HREF}>Retour à l’étude de cas</BackLink>
          <div className="mx-auto max-w-[880px] pt-24 pb-16 lg:pt-32 lg:pb-24">
            <p className="rv mb-6 text-[12px] font-medium tracking-[0.1em] text-accent uppercase md:text-[14px]">Cyberr Technical Tests</p>
            <h1 className="rv-words font-display text-[clamp(36px,6vw,96px)] leading-[0.98] text-ink uppercase">
              <Words text="Scripts de recherche" />
            </h1>
            <p className="rv mt-8 text-[20px] leading-[1.45] text-ink md:text-[24px]">
              Scripts des entretiens exploratoires et des tests d’utilisabilité modérés sur Technical Tests, avec des candidats et des clients. La
              taille des échantillons et les résultats figurent dans la section <A href={`${CASE_HREF}#research`}>À l’écoute des deux côtés</A> de
              l’étude de cas.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-[5%] px-4 pb-28 md:px-[clamp(24px,3.5vw,56px)] md:pb-40">
        <div className="mx-auto max-w-[880px]">
          <Section id="recruiting" title="Critères de recrutement">
            <Table
              firstColStrong
              head={["Groupe", "Critères de sélection", "Quota"]}
              rows={[
                ["Candidats, juniors/confirmés", "Professionnels de la cybersécurité en début de carrière, actifs sur Cyberr", "3 entretiens, 3 tests"],
                ["Candidats, seniors", "Professionnels expérimentés avec des certifications sur leur profil", "3 entretiens, 2 tests"],
                ["Clients", "Recruteurs et hiring managers ayant récemment recruté sur un poste en cybersécurité", "5 entretiens, 5 tests"],
              ]}
            />
            <P>Mélanger candidats freelances et candidats en CDI dans chaque groupe.</P>
          </Section>

          <Section id="candidate-interview" title="1. Entretien exploratoire candidat (45 min)">
            <Note label="Introduction.">
              Merci d’être là. Nous cherchons à comprendre comment les professionnels de la cybersécurité montrent leurs compétences aux employeurs. Il
              n’y a pas de bonne ou de mauvaise réponse ; ce sont des idées que nous testons, pas vous. Puis-je enregistrer la session, uniquement pour
              mes notes ?
            </Note>
            <Group title="Parcours">
              <Questions
                items={[
                  "Parlez-moi de votre poste actuel et de ce sur quoi vous travaillez au quotidien.",
                  "Quel type de travail recherchez-vous en ce moment ?",
                ]}
              />
            </Group>
            <Group title="Prouver ses compétences aujourd’hui">
              <Questions
                start={3}
                items={[
                  "Racontez-moi la dernière fois qu’un employeur vous a demandé de prouver vos compétences techniques. Que s’est-il passé ?",
                  "Qu’avez-vous pensé de ce test ? Qu’est-ce qui le rendait juste ou injuste ?",
                  "Quelles certifications ou plateformes d’entraînement mentionnez-vous aux employeurs ? Pensez-vous qu’ils les regardent ?",
                  "Qu’est-ce qu’un employeur ne voit pas de vous en lisant votre CV ?",
                ]}
              />
            </Group>
            <Group title="Rapport aux tests">
              <Questions
                start={7}
                items={[
                  "Imaginez un test pratique sur Cyberr dont les employeurs peuvent voir les résultats. Quelle est votre première réaction ?",
                  "Qu’est-ce qui vous ferait commencer un tel test aujourd’hui ? Qu’est-ce qui vous ferait le repousser ?",
                  "Que devez-vous savoir avant de consacrer du temps à un test ?",
                  "Que ressentiriez-vous si votre résultat était inférieur à vos attentes ? Qui devrait pouvoir le voir ?",
                  "Que pensez-vous des classements et des leaderboards dans votre domaine ?",
                ]}
              />
            </Group>
            <Group title="Après le test">
              <Questions
                start={12}
                items={[
                  "Vous venez de terminer un test sur une plateforme externe. Qu’attendez-vous qu’il se passe ensuite ?",
                  "Qu’aimeriez-vous voir dans vos résultats ? Qu’en feriez-vous ?",
                ]}
              />
            </Group>
            <Note label="Conclusion.">
              Si vous aviez une baguette magique, qu’est-ce qui rendrait plus facile la preuve de vos compétences ? Y a-t-il une question que nous ne
              vous avons pas posée et que nous aurions dû poser ?
            </Note>
          </Section>

          <Section id="client-interview" title="2. Entretien exploratoire client (45 min)">
            <Group title="Parcours">
              <Questions
                items={[
                  "Pour quels postes ou projets en cybersécurité avez-vous recruté récemment ?",
                  "Décrivez-moi votre processus, de la shortlist à l’offre.",
                ]}
              />
            </Group>
            <Group title="La présélection aujourd’hui">
              <Questions
                start={3}
                items={[
                  "Racontez-moi la dernière fois qu’une recrue s’est révélée moins solide que prévu. Qu’est-ce qui vous avait échappé ?",
                  "Comment vérifiez-vous les compétences techniques aujourd’hui ? Qui s’en charge, et combien de temps cela prend-il ?",
                  "À quels signaux faites-vous le plus confiance : certifications, expérience, recommandations, résultats de tests ? Pourquoi ?",
                  "Avez-vous utilisé des plateformes de tests ? Qu’est-ce qui a fonctionné, et qu’est-ce qui n’a pas fonctionné ?",
                ]}
              />
            </Group>
            <Group title="La valeur d’un résultat de test">
              <Questions
                start={7}
                items={[
                  "Un candidat a obtenu 70 % à un pentest pratique. Qu’est-ce que cela vous dit ? De quoi d’autre auriez-vous besoin ?",
                  "Comment choisissez-vous entre deux candidats à l’expérience similaire ?",
                  "À quel moment de votre processus enverriez-vous un test ? À qui ?",
                  "Comment aimeriez-vous comparer les candidats après un test ?",
                  "Combien paieriez-vous pour un test, et qui devrait payer : vous ou le candidat ?",
                ]}
              />
            </Group>
            <Note label="Conclusion.">
              Qu’est-ce qui vous ferait suffisamment confiance à un résultat de test pour raccourcir votre propre entretien technique ? Qu’est-ce qui
              vous le ferait ignorer ?
            </Note>
          </Section>

          <Section id="candidate-usability" title="3. Test d’utilisabilité candidat (40 min, prototype Figma)">
            <Note label="Mise en place.">
              Merci de penser à voix haute. Si vous êtes bloqué, dites-moi ce que vous vous attendiez à voir se produire. Vous ne pouvez rien casser.
            </Note>
            <Note label="Scénario.">Vous cherchez de nouveaux projets et voulez que les employeurs voient vos compétences pratiques.</Note>
            <Table
              head={["#", "Tâche", "Critère de réussite", "Points d’attention"]}
              rows={[
                ["1", "Trouvez où passer un test technique", "Ouvre Technical tests depuis la barre latérale", "Hésitation avec d’autres éléments du menu"],
                ["2", "Choisissez un test adapté à votre niveau dans votre domaine", "Ouvre un domaine et choisit un niveau en expliquant pourquoi", "Compréhension de l’échelle des niveaux et de la durée"],
                ["3", "Découvrez ce que vous devrez faire pendant le test", "Ouvre les détails et cite l’environnement et les sujets", "Confiance dans les instructions ; longueur du panneau"],
                ["4", "Lancez le test", "Clique sur Start mission et comprend qu’il quitte Cyberr", "Attentes concernant le retour"],
                ["5", "Vous êtes revenu. Vérifiez où en est votre test", "Trouve Pending tests et lit le temps restant", "Ce que « pending » signifie pour lui"],
                ["6", "Consultez votre résultat et décidez si les employeurs doivent le voir", "Lit le détail et trouve Publish on my profile", "Peur de publier ; signification des chiffres"],
                ["7", "Découvrez votre classement par rapport aux autres", "Ouvre le leaderboard et trouve sa propre ligne", "Réaction à un classement bas"],
                ["8", "Découvrez ce qu’il vous faut pour la ligue suivante", "Lit la carte de progression", "L’objectif paraît-il atteignable ?"],
              ]}
            />
            <P>
              <strong className="font-semibold text-ink">Après chaque tâche :</strong> « Sur une échelle de 1 (très difficile) à 7 (très facile),
              était-ce facile ou difficile ? » (SEQ)
            </P>
            <Note label="Débriefing.">
              Quel a été le moment le plus déroutant ? Passeriez-vous ce test pour de vrai ? Qu’est-ce qui vous en empêcherait ? Terminer par le
              questionnaire SUS.
            </Note>
          </Section>

          <Section id="client-usability" title="4. Test d’utilisabilité client (30 min, prototype Figma)">
            <Note label="Scénario.">Vous recrutez un pentester pour un projet et avez déjà une shortlist.</Note>
            <Table
              head={["#", "Tâche", "Critère de réussite", "Points d’attention"]}
              rows={[
                ["1", "Envoyez un test technique aux candidats de votre shortlist", "Trouve Send test dans la shortlist du projet", "Où il s’attend à trouver l’action"],
                ["2", "Choisissez qui doit recevoir le test", "Sélectionne les candidats à partir des données de la liste", "Sur quelles colonnes il s’appuie"],
                ["3", "Choisissez un test adapté au projet", "Ouvre un domaine, consulte les détails et l’onglet Questions, sélectionne un test", "Comprend-il ce que les candidats vont affronter ?"],
                ["4", "Vous n’avez plus de tests. Obtenez-en d’autres", "Trouve Buy more tests et remplit le panneau d’achat", "Clarté sur qui paie et ce qui est inclus"],
                ["5", "Déterminez quel candidat s’en est le mieux sorti", "Ouvre Test results et compare les candidats question par question", "Lit-il les notes par question ou seulement le score global ?"],
                ["6", "Invitez le meilleur candidat à un entretien", "Utilise Book a meeting", "Cela lui semble-t-il l’étape suivante naturelle ?"],
              ]}
            />
            <Note label="Débriefing.">Feriez-vous confiance à ce résultat dans votre décision de recrutement ? Que manque-t-il ?</Note>
          </Section>

          <Section id="metrics" title="Indicateurs à rapporter">
            <List
              items={[
                "Taux de réussite par tâche",
                "Temps passé sur la tâche pour envoyer un test et trouver un résultat",
                "SEQ par tâche et SUS global",
                "Problèmes d’utilisabilité par gravité, session 1 vs session 2",
              ]}
            />
            <div className="rv mt-14">
              <BackLink href={CASE_HREF}>Retour à l’étude de cas</BackLink>
            </div>
          </Section>
        </div>
      </div>
    </RevealScope>
  );
}
