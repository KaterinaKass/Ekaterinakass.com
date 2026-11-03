import { A, Card, Figure, H3, Label, List, NumList, P, Pair, Section, Table, type Img } from "../CaseUI";
import { FigureVideo, type Vid } from "../FigureVideo";
import type { CaseData } from "./CyberrCase";

/* Тексты кейса Cyberr — Technical Tests. Источник: cyberr-technical-tests-case-study.md */

const DIR = "/images/cases/cyberr-tests";
const img = (file: string, alt: string, w = 3000, h = 2250): Img => ({ src: `${DIR}/${file}`, w, h, alt });
// видео + картинка-превью с тем же именем и суффиксом -poster
const vid = (name: string, alt: string, w = 2000, h = 1500): Vid => ({ ...img(`${name}-poster.webp`, alt, w, h), video: `${DIR}/${name}.mp4` });

export const SCRIPTS_HREF = "/work/cyberr-technical-tests/research-scripts";

const images = {
  hero: { ...img("Tests-Tests.webp", "Cyberr Technical tests hub with pending tests, value banner and test categories"), video: `${DIR}/Tests-Tests.mp4` },
  resultSummary: img("Tests-Test-result.webp", "Candidate test result with per-question breakdown, Retake test and Publish on my profile"),
  waitingSummary: img("Tests-waiting.webp", "Mobile test screen in the “Waiting for results” state", 3000, 2000),
  clientResultsSummary: img("Client-test-results.webp", "Client view comparing three candidates question by question with pass and fail marks"),
  result: img("Tests-Test-result.webp", "Candidate test result with points, correct answers, time spent, per-question breakdown, Retake test and Publish on my profile"),
  waiting: img("Tests-Results-waiting-mob.webp", "Mobile test screen in the “Waiting for results” state after returning from the Airbus environment", 3000, 2000),
  selectTest: img("Client-select-test.webp", "Client picks a test from areas of cybersecurity, each with a level scale and duration"),
  clientResults: img("Client-test-results.webp", "Test results matrix comparing three candidates question by question, with Book a meeting in the header"),
  selectCandidates: vid("Client-select-candidates", "Step 1 of Send test: selecting candidates from the shortlist, with Tech Tests Left counter and Buy more tests"),
  leaderboard: vid("Tests-Leaderboard-new", "Leaderboard with league tabs, podium, the user’s pinned row and a progress card to the next league"),
};

const header: CaseData["header"] = {
  eyebrow: ["Hiring platform", "Cyberr Technical Tests"],
  title: "Technical Tests at Cyberr: from claimed skills to proven ones",
  meta: [
    { label: "Role", value: "Sole Product Designer" },
    { label: "Scope", value: "User Research, Competitive Analysis, UI/UX Design, Usability Testing" },
    { label: "Team", value: "Product Manager, Machine Learning engineers, Frontend engineers" },
    { label: "Users", value: "Cybersecurity candidates (junior to senior) and hiring clients: recruiters, hiring managers, technical leads" },
  ],
};

const nav = {
  summary: [
    { id: "overview", label: "Overview" },
    { id: "long-story-short", label: "Long Story Short" },
    { id: "biggest-shift", label: "The Biggest Shift" },
    { id: "business-value", label: "Business Value" },
  ],
  full: [
    { id: "overview", label: "Overview" },
    { id: "context", label: "Context" },
    { id: "tension", label: "The Tension" },
    { id: "market", label: "Market" },
    { id: "research", label: "Research" },
    { id: "decisions", label: "Decisions" },
    { id: "usability", label: "Usability Testing" },
    { id: "outcome", label: "Outcome" },
    { id: "learned", label: "What I Learned" },
  ],
};

export const testsCase: CaseData = { header, hero: images.hero, nav, scriptsHref: SCRIPTS_HREF };

const b = (t: string) => <strong className="font-semibold text-ink">{t}</strong>;

/* ───────────────────────── SUMMARY ───────────────────────── */

export function SummaryView() {
  return (
    <>
      <Section id="long-story-short" title="Long Story Short">
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <Card label="The What" title="Hands-On Skill Tests Inside a Cybersecurity Hiring Platform" tint="#0388ee">
            Cyberr already verified identities and certifications. I designed the layer that was missing: practical tests built with Airbus that let
            candidates prove what they can do, and give clients a way to act on that proof inside the projects they are hiring for.
          </Card>
          <Card label="The Why" title="A Test Sits Between Two People Who Want Opposite Things" tint="#e0457b">
            Candidates want to look strong and fear a bad result following them. Clients want the truth fast and fear a result that means nothing.
            Lean too far toward clients and candidates don’t start; lean too far toward candidates and clients stop trusting the result. The first
            spec leaned strict: one attempt, results synced to the profile, no feedback.
          </Card>
          <Card label="The How" className="md:col-span-2" tint="#e8862a">
            <div className="grid gap-8 md:grid-cols-2 md:gap-10">
              <div>
                <h3 className="mb-4 text-[21px] leading-[1.2] font-semibold tracking-[-0.01em] text-ink md:text-[24px]">What Research Helped Me Do</h3>
                <p>
                  Interviews with 6 candidates and 5 clients, plus two rounds of usability tests, turned the strict spec around. All three senior
                  candidates would rather have no result than a weak public one, and 4 of 5 clients said they trust comparison, not a single number.{" "}
                  <A href={SCRIPTS_HREF}>Research scripts</A>
                </p>
              </div>
              <div>
                <h3 className="mb-4 text-[21px] leading-[1.2] font-semibold tracking-[-0.01em] text-ink md:text-[24px]">What Was the Design Direction</h3>
                <p>
                  Private by default, shared by intent. Results stay with the candidate until they publish them, with a retake to lower the stakes. A
                  visible waiting state covers the hand-off to the Airbus environment. For clients, tests start from the project shortlist and end in a
                  question-by-question comparison.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Pair a={images.resultSummary} b={images.waitingSummary} />

        <Card label="The Why Not" title="No Public Scores by Default, No Hidden Weak Results, No Single Number" tint="#7a5cf0">
          Public by default would have pushed the most experienced people out and left a leaderboard full of beginners. Auto-hiding weak results
          felt safe, but clients would see only good scores and trust none of them. A ranked list by score reduced people to the one number clients
          said they didn’t believe.
        </Card>

        <FigureVideo img={images.leaderboard} className="mt-10" />
      </Section>

      <Section id="biggest-shift" title="The Biggest Shift">
        <P lead>From a score you have to trust to a comparison you can act on.</P>
        <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10">
          <div className="rv border-t border-line pt-5">
            <Label className="mb-3">Before redesign</Label>
            <p className="text-[17px] leading-[1.6] text-ink/80 md:text-[18px]">
              Skills were self-reported. Clients trusted CVs or ran their own screening outside Cyberr, and a strong candidate looked the same on paper
              as an average one.
            </p>
          </div>
          <div className="rv border-t border-ink pt-5">
            <Label className="mb-3 text-accent!">After redesign</Label>
            <p className="text-[17px] leading-[1.6] text-ink/80 md:text-[18px]">
              Clients send one test to their shortlist in three steps and see every candidate on the same questions, pass or fail, with Book a
              meeting right in the header. Candidates decide when their own results become public.
            </p>
          </div>
        </div>
        <Figure img={images.clientResultsSummary} className="mt-12" />
      </Section>

      <Section id="business-value" title="Business Value">
        <P>
          Turned an Airbus partnership into a product line and gave Cyberr a layer of trust general job boards don’t have. Exact numbers are under
          NDA.
        </P>
        <div className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
          {[
            { label: "Trust layers", value: "3", text: "Identity, certifications and now practical skills, all verified on one platform." },
            { label: "Client demand", value: "5 of 5", text: "Clients wanted to test the shortlist they already had, so Send test lives inside the project." },
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

export function FullView() {
  return (
    <>
      <Section id="intro">
        <P lead>
          In cybersecurity hiring, everyone says they’re good. I designed the feature that lets candidates prove it, and gives clients a way to act
          on that proof. The hard part wasn’t the screens. It was making a test feel safe enough for candidates to take, and credible enough for
          clients to trust.
        </P>
      </Section>

      <Section id="context" title="Context">
        <P>
          <A href="https://cyberr.ai/about-us">Cyberr</A> is a hiring platform and professional network built only for cybersecurity. It had already
          solved two layers of trust: identities were verified, and certifications were validated via Credly. Clients could search talent, use AI
          matching, build shortlists and hire directly.
        </P>
        <P>
          But a verified identity and a valid certificate still say nothing about whether a person can find and exploit a misconfigured service under
          time pressure. That was the layer missing. Clients kept running their own technical screening outside the platform, and every good
          candidate looked the same on paper as an average one.
        </P>
        <P>
          A partnership with Airbus gave us realistic, hands-on missions in a real attack environment. My job was to turn that into a product people
          on both sides would actually use.
        </P>
      </Section>

      <Section id="tension" title="The Tension">
        <P>A test sits between two people who want opposite things from it.</P>
        <Table
          firstColStrong
          head={["", "The candidate", "The client"]}
          rows={[
            ["Wants", "To look strong and get noticed", "To see the truth, fast"],
            ["Fears", "A bad result following them forever", "A result that can be gamed or means nothing"],
            ["Needs from the design", "Safety and control", "Transparency and comparability"],
          ]}
        />
        <P>
          If we lean too far toward the client, candidates don’t start. If we lean too far toward the candidate, the result becomes marketing, and
          clients stop trusting it. A test nobody takes and a result nobody trusts fail in the same way: the feature dies.
        </P>
        <P>
          The first spec leaned toward strictness: one attempt per test, results synced to the profile, no detailed feedback. It was clean from an
          engineering point of view, but it assumed candidates would accept high stakes with no control. I wasn’t sure they would, so before
          designing anything I wanted to hear from both sides.
        </P>
      </Section>

      <Section id="market" title="What the market taught us">
        <P>
          The skills gap in security is about quality, not just headcount: in 2024 ISC2 estimated a shortfall of about 4.8M professionals, and 90% of
          respondents reported skills gaps on their teams (
          <A href="https://www.isc2.org/Insights/2024/10/ISC2-2024-Cybersecurity-Workforce-Study">ISC2</A>). Employers need a better signal, and
          several products already try to give one.
        </P>
        <P>
          Looking at them, I saw two camps. {b("Training platforms")} like{" "}
          <A href="https://www.hackthebox.com/business/talent-search">Hack The Box</A>,{" "}
          <A href="https://help.tryhackme.com/en/articles/10517530-tryhackme-leagues">TryHackMe</A> and{" "}
          <A href="https://pro.root-me.org/?page=sommaire&lang=en">Root-Me PRO</A> are great at motivation, with ranks, leagues and streaks. But their
          scores mostly measure how active you are, and hiring is a side feature. {b("Assessment tools")} like HackerRank and{" "}
          <A href="https://www.testgorilla.com/blog/how-assess-cybersecurity-skills/">TestGorilla</A> live inside the hiring process, but their
          results belong to one employer. Candidates take a new test for every application, and the tests lean toward knowledge checks rather than
          hands-on work.
        </P>
        <P>That gave me three principles to design by:</P>
        <NumList
          items={[
            <>{b("Borrow the motivation, not the noise.")} Gamification should pull candidates in, but the result must reflect skill, not grinding.</>,
            <>{b("The result belongs to the candidate.")} It should be portable across employers, and the candidate decides when it’s shown.</>,
            <>
              {b("Tests live where hiring happens.")} For clients, a test is useful only inside the project they are hiring for, next to the people
              they are considering.
            </>,
          ]}
        />
      </Section>

      <Section id="research" title="Listening to both sides">
        <P>
          I ran discovery interviews with 6 candidates (half junior and mid-level, half senior) and 5 clients (recruiters, hiring managers and a
          technical lead). I split candidates by seniority on purpose: I expected juniors and seniors to feel very differently about being tested,
          and they did. Later, two rounds of moderated usability tests on Figma prototypes, with 5 participants per group each round, checked
          whether the design actually solved what we heard.
        </P>

        <H3>How the sessions were set up</H3>
        <Table
          firstColStrong
          head={["Session", "Format", "What it covered"]}
          rows={[
            ["Candidate interview", "45 min, remote", "How they prove skills today, how they feel about being tested and ranked, what they expect after a test on an external platform"],
            ["Client interview", "45 min, remote", "How they screen technical skills today, which signals they trust, how they’d compare candidates and who should pay for a test"],
            ["Candidate usability test", "40 min, Figma prototype, think-aloud", "8 tasks, from finding a test to understanding what it takes to reach the next league"],
            ["Client usability test", "30 min, Figma prototype, think-aloud", "6 tasks, from sending a test from the shortlist to booking a meeting with the strongest candidate"],
          ]}
        />
        <P>
          Every usability task had a success criterion and an ease rating (SEQ, 1 to 7); candidate sessions ended with a SUS questionnaire. Issues
          were rated by severity and compared between rounds. One interview question did most of the work with clients:{" "}
          <em>“A candidate scored 70% on a practical pentest. What does that tell you?”</em> Almost nobody could answer without asking what exactly
          the person got wrong.
        </P>
        <P>
          <A href={SCRIPTS_HREF}>Research scripts</A>: recruiting criteria, all four scripts and usability tasks.
        </P>

        <H3>What survived the synthesis</H3>
        <P>
          After each round I clustered notes on an affinity map and kept only patterns that came up with at least three people. Here is what
          survived, and what it changed.
        </P>
        <Table
          firstColStrong
          head={["What we learned", "Where it came from", "What it changed in the design"]}
          rows={[
            ["Senior candidates would rather have no result than a weak public one", "3 of 3 senior interviews", "Results are private by default; publishing is the candidate’s choice"],
            ["Candidates postpone tests when the effort is unclear", "5 of 6 candidate interviews", "Level, time and topics are visible on every card; a details panel before starting"],
            ["Leaving the platform for the test environment creates doubt: did it save, when will I know?", "Interviews, confirmed in usability round 1", "A Pending tests block that tracks every active test and its deadline"],
            ["Juniors see tests as a way to stand out without experience", "3 of 3 junior interviews", "Leaderboard and leagues to reward progress and make strong juniors visible"],
            ["Clients don’t trust a single number; they trust comparison", "4 of 5 client interviews", "A side-by-side view of candidates on the same questions"],
            ["Clients already have a shortlist and want to test those exact people", "5 of 5 client interviews", "Send test starts from the project shortlist, not from a separate catalog"],
            ["Clients want to know what candidates will face before paying", "Usability round 1", "Test details with the full question list, available before sending"],
          ]}
        />
        <blockquote className="rv my-10 border-l-2 border-accent pl-6 text-[20px] leading-[1.45] text-ink md:pl-8 md:text-[24px]">
          The insight that reframed the project came from a senior pentester. Asked how he would feel about a public score, he said he’d simply never
          take the test. That one answer turned the first spec’s strict model upside down: if the most experienced people opt out, the leaderboard
          fills with beginners, and clients learn to ignore it.
        </blockquote>
      </Section>

      <Section id="decisions" title="Five decisions that shaped the product">
        <H3>
          <span className="mr-3 text-accent">01</span>Private by default, shared by intent
        </H3>
        <P>The central question was who sees a result, and when. We considered three models:</P>
        <List
          items={[
            <>{b("Public by default")}, as in the first spec. This gives maximum transparency, but research told us senior candidates would simply not start.</>,
            <>{b("Auto-hide weak results")} below a threshold. This feels safe, but clients would see only good scores and stop trusting all of them.</>,
            <>{b("Private by default, with explicit sharing.")} This is what we chose.</>,
          ]}
        />
        <P>
          The final model has two contexts. A test a candidate takes on their own stays private until they press {b("Publish on my profile")}. A test
          a client sends is shared with that client by design, because the candidate accepts it as part of an application. Candidates get control
          where it matters for reputation; clients get unfiltered results where it matters for hiring. {b("Retake test")} lowers the stakes even
          further: a first attempt is practice, not a verdict.
        </P>
        <Figure img={images.result} className="my-10" />

        <H3>
          <span className="mr-3 text-accent">02</span>Designing the in-between
        </H3>
        <P>
          The tests run in the Airbus environment, not in Cyberr. That gap is where trust leaks: users finish, close the tab, and don’t know if
          anything happened. An email alone felt too passive, and a status buried in the test card was too easy to miss.
        </P>
        <P>
          I made the waiting state a first-class part of the page. {b("Pending tests")} sit at the top of the hub: each card shows the test, the role
          and company it came from, the time left with a progress bar, and one action, {b("Go to test")}. Results sync back automatically, so the
          block quietly turns into a result. Honestly, this was the least glamorous screen in the project, and probably the one that did the most for
          completion.
        </P>
        <Figure img={images.waiting} className="my-10" />

        <H3>
          <span className="mr-3 text-accent">03</span>Effort you can see before you commit
        </H3>
        <P>
          Candidates postponed tests when they couldn’t estimate the effort, so every card answers three questions at a glance: how hard (a level
          scale), how long (time) and what you get (points). A details panel before {b("Start mission")} explains the environment and the topics
          covered. The pattern repeats on the client side: a client sees the same details, plus a {b("Questions")} tab, before sending a test to
          anyone.
        </P>
        <Figure img={images.selectTest} className="my-10" />

        <H3>
          <span className="mr-3 text-accent">04</span>From a number to a decision
        </H3>
        <P>
          For clients, the score itself was never the product; the decision was. We explored a ranked list of candidates by score and profile cards
          with a score badge. Both reduced people to one number, which is exactly what clients said they didn’t trust.
        </P>
        <P>
          The final {b("Test results")} view is a matrix: candidates in columns with their overall score, questions in rows with a clear pass or fail
          mark for each. A recruiter instantly sees that two candidates with similar totals failed completely different topics. Each test has its own
          tab, and {b("Book a meeting")} sits right in the header, so the comparison ends with an action, not a spreadsheet.
        </P>
        <Figure img={images.clientResults} className="my-10" />
        <P>
          Getting there had to be just as direct. {b("Send test")} lives in the project’s shortlist and opens a three-step flow: select candidates,
          pick a test, send. A {b("Tech Tests Left")} counter and an inline {b("Buy more tests")} panel mean running out of tests never breaks the
          flow.
        </P>
        <FigureVideo img={images.selectCandidates} className="my-10" />

        <H3>
          <span className="mr-3 text-accent">05</span>Motivation without noise
        </H3>
        <P>
          We wanted juniors to have a reason to come back, without turning the leaderboard into a points race. Leagues are based on points from
          validated tests, not on weekly activity. The user’s own row is always pinned at the bottom of the table, even far down the list, and a
          progress card turns a distant rank into a concrete next goal: how many points to the next league.
        </P>
        <FigureVideo img={images.leaderboard} className="mt-10" />
      </Section>

      <Section id="usability" title="What usability testing changed">
        <P>
          The first round of usability tests didn’t challenge the big decisions, but it exposed the gaps between them. Most issues were about clarity
          at moments of uncertainty, the same theme as the research.
        </P>
        <Table
          head={["What we saw in round 1", "What we changed"]}
          rows={[
            ["Several candidates read the dot scale as a rating, not a difficulty", "Added a “Level” label next to the dots and kept the scale identical on every screen"],
            ["Candidates weren’t sure whether a finished result was already public", <>A private state by default and a single, explicit {b("Publish on my profile")} action</>],
            ["Clients looked for a way to test candidates in the Candidates tab, not in a separate section", <>{b("Send test")} moved into the project shortlist, where clients already make decisions</>],
            ["Clients hesitated to send a test they couldn’t preview", <>A {b("Questions")} tab in the test details, available before sending</>],
            ["Running out of tests mid-flow sent clients to a separate pricing page", "Tests left are visible on the first step, and buying more opens in a side panel"],
            ["Clients compared only the overall percentage and missed the detail", "Per-question marks made high-contrast, with overall scores moved into the column headers"],
          ]}
        />
        <P>
          In round 2, every candidate found their pending test and understood their result’s visibility without help. Clients completed the
          send-a-test flow without help, and most went straight to the per-question view when asked who did best.
        </P>
      </Section>

      <Section id="outcome" title="The outcome">
        <P>Technical Tests shipped to production. Exact numbers are under NDA, but the shape of the result is clear:</P>
        <div className="my-8 grid gap-4 md:grid-cols-3 md:gap-5">
          {[
            ["A new layer of trust.", "Cyberr now verifies identity, certifications and practical skills, which no general job board offers."],
            ["Screening moved inside the platform.", "Clients test their shortlist within a project and compare candidates before booking interviews, instead of running separate processes."],
            ["A new revenue stream.", "Paid tests for clients and candidates turned an Airbus partnership into a product line."],
          ].map(([t, d]) => (
            <Card key={t} title={t}>
              {d}
            </Card>
          ))}
        </div>

        <H3>What we measure</H3>
        <P>I worked with the PM to define success as a funnel, not a single number, so the team can see where trust breaks:</P>
        <Table
          firstColStrong
          head={["Side", "Metric", "What it tells us"]}
          rows={[
            ["Candidates", "Test start rate from the hub", "Is starting a test perceived as safe and worth the time?"],
            ["Candidates", "Completion rate after leaving for the test environment", "Does the hand-off work?"],
            ["Candidates", "Publish rate of finished results", "Do candidates believe results help them?"],
            ["Clients", "Projects where a test was sent", "Is testing part of the hiring flow?"],
            ["Clients", "Interviews booked from Test results", "Does comparison lead to decisions?"],
            ["Business", "Repeat test purchases", "Do clients see enough value to pay again?"],
          ]}
        />
      </Section>

      <Section id="learned" title="What I learned">
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <Card title="Trust is a two-sided design problem.">
            I started by designing a feature for candidates and ended up designing a contract between two people. Every decision had to work for both,
            and the best ones, like private by default and shared by intent, gave each side what it needed without taking it from the other.
          </Card>
          <Card title="The quietest screens carry the most weight.">
            A waiting state rarely gets design attention, yet in a flow that leaves the platform, it is the moment that decides whether people come
            back. The Pending tests block did more for completion than any of the more visible screens.
          </Card>
          <Card title="A number is not an insight.">
            Clients didn’t want a better score; they wanted an easier decision. Designing for the decision, not the data, changed the results view
            completely.
          </Card>
          <Card title="Push back on the spec with evidence, not opinion.">
            The first spec wasn’t wrong, it was untested. One clear pattern from seniors was enough to change the core model, because it came with a
            real consequence for the business: an empty leaderboard.
          </Card>
        </div>
      </Section>
    </>
  );
}
