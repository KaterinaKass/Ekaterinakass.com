import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Footer } from "@/components/Footer";
import { FrameLines, MenuPill } from "@/components/Chrome";
import { RevealScope } from "@/components/case/RevealScope";
import { A, BackLink, List, P, Section, Table, Words } from "@/components/case/CaseUI";

export const metadata: Metadata = {
  title: "Research scripts — Technical Tests at Cyberr",
  description: "Scripts for discovery interviews and moderated usability tests on Cyberr Technical Tests.",
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

export default function ResearchScripts() {
  return (
    <main>
      <SmoothScroll />
      <RevealScope className="relative z-10 bg-cream">
        <header className="relative overflow-hidden">
          <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
          <div className="relative mx-[5%] px-4 pt-6 md:px-[clamp(24px,3.5vw,56px)] lg:pt-8">
            <BackLink href={CASE_HREF}>Back to case study</BackLink>
            <div className="mx-auto max-w-[880px] pt-24 pb-16 lg:pt-32 lg:pb-24">
              <p className="rv mb-6 text-[12px] font-medium tracking-[0.1em] text-accent uppercase md:text-[14px]">Cyberr Technical Tests</p>
              <h1 className="rv-words font-display text-[clamp(36px,6vw,96px)] leading-[0.98] text-ink uppercase">
                <Words text="Research scripts" />
              </h1>
              <p className="rv mt-8 text-[20px] leading-[1.45] text-ink md:text-[24px]">
                Scripts for discovery interviews and moderated usability tests on Technical Tests, with candidates and clients. Sample sizes and
                findings are in the <A href={`${CASE_HREF}#research`}>Listening to both sides</A> section of the case study.
              </p>
            </div>
          </div>
        </header>

        <div className="mx-[5%] px-4 pb-28 md:px-[clamp(24px,3.5vw,56px)] md:pb-40">
          <div className="mx-auto max-w-[880px]">
            <Section id="recruiting" title="Recruiting criteria">
              <Table
                firstColStrong
                head={["Group", "Screener", "Quota"]}
                rows={[
                  ["Candidates, junior/mid", "Early-career cybersecurity professionals active on Cyberr", "3 interviews, 3 tests"],
                  ["Candidates, senior", "Experienced professionals with certifications on their profile", "3 interviews, 2 tests"],
                  ["Clients", "Recruiters and hiring managers who recently hired for a cybersecurity role", "5 interviews, 5 tests"],
                ]}
              />
              <P>Mix freelance and permanent candidates in each group.</P>
            </Section>

            <Section id="candidate-interview" title="1. Candidate discovery interview (45 min)">
              <Note label="Intro.">
                Thank you for joining. We’re exploring how cybersecurity professionals show their skills to employers. There are no right or wrong
                answers; we’re testing ideas, not you. May I record the session for notes only?
              </Note>
              <Group title="Background">
                <Questions
                  items={["Tell me about your current role and what you work on day to day.", "What kind of work are you looking for right now?"]}
                />
              </Group>
              <Group title="Proving skills today">
                <Questions
                  start={3}
                  items={[
                    "Tell me about the last time an employer asked you to prove your technical skills. What happened?",
                    "How did you feel about that test? What made it fair or unfair?",
                    "Which certifications or practice platforms do you mention to employers? Do you think they look at them?",
                    "What does an employer miss about you when they read your CV?",
                  ]}
                />
              </Group>
              <Group title="Attitude to testing">
                <Questions
                  start={7}
                  items={[
                    "Imagine a practical test on Cyberr whose results employers can see. What’s your first reaction?",
                    "What would make you start such a test today? What would make you postpone it?",
                    "What do you need to know before you commit your time to a test?",
                    "How would you feel if your result were lower than expected? Who should be able to see it?",
                    "How do you feel about leaderboards and rankings in your field?",
                  ]}
                />
              </Group>
              <Group title="After the test">
                <Questions
                  start={12}
                  items={[
                    "You’ve finished a test on an external platform. What do you expect to happen next?",
                    "What would you like to see in your results? What would you do with them?",
                  ]}
                />
              </Group>
              <Note label="Wrap-up.">
                If you had a magic wand, what would make proving your skills easier? Is there anything we didn’t ask that we should have?
              </Note>
            </Section>

            <Section id="client-interview" title="2. Client discovery interview (45 min)">
              <Group title="Background">
                <Questions
                  items={["Which cybersecurity roles or projects have you hired for recently?", "Walk me through your process from shortlist to offer."]}
                />
              </Group>
              <Group title="Screening today">
                <Questions
                  start={3}
                  items={[
                    "Tell me about the last time a hire turned out weaker than expected. What did you miss?",
                    "How do you check technical skills today? Who does it, and how long does it take?",
                    "Which signals do you trust most: certifications, experience, referrals, test results? Why?",
                    "Have you used any testing platforms? What worked and what didn’t?",
                  ]}
                />
              </Group>
              <Group title="Value of a test result">
                <Questions
                  start={7}
                  items={[
                    "A candidate scored 70% on a practical pentest. What does that tell you? What else would you need?",
                    "How do you choose between two candidates with similar experience?",
                    "At which point of your process would you send a test? To whom?",
                    "How would you like to compare candidates after a test?",
                    "How much would you pay for a test, and who should pay: you or the candidate?",
                  ]}
                />
              </Group>
              <Note label="Wrap-up.">
                What would make you trust a test result enough to shorten your own technical interview? What would make you ignore it?
              </Note>
            </Section>

            <Section id="candidate-usability" title="3. Candidate usability test (40 min, Figma prototype)">
              <Note label="Setup.">Please think out loud. If you get stuck, tell me what you expected to happen. You can’t break anything.</Note>
              <Note label="Scenario.">You’re looking for new projects and want employers to see your practical skills.</Note>
              <Table
                head={["#", "Task", "Success criteria", "Watch for"]}
                rows={[
                  ["1", "Find where you can take a technical test", "Opens Technical tests from the sidebar", "Hesitation between other menu items"],
                  ["2", "Choose a test that fits your level in your area", "Opens an area and picks a level, explaining why", "Whether the level scale and time are understood"],
                  ["3", "Find out what you’ll need to do in the test", "Opens details and names the environment and topics", "Trust in the instructions; length of the panel"],
                  ["4", "Start the test", "Presses Start mission and understands they leave Cyberr", "Expectations about coming back"],
                  ["5", "You’ve come back. Check where your test stands", "Finds Pending tests and reads the time left", "What they think “pending” means"],
                  ["6", "Review your result and decide whether employers should see it", "Reads the breakdown and finds Publish on my profile", "Fear of publishing; meaning of the numbers"],
                  ["7", "Find out how you rank against others", "Opens the leaderboard and finds their own row", "Reaction to a low rank"],
                  ["8", "Find out what you need for the next league", "Reads the progress card", "Whether the goal feels reachable"],
                ]}
              />
              <P>
                <strong className="font-semibold text-ink">After each task:</strong> “How easy or hard was that, from 1 (very hard) to 7 (very easy)?”
                (SEQ)
              </P>
              <Note label="Debrief.">
                What was the most confusing moment? Would you take this test for real? What would stop you? Finish with the SUS questionnaire.
              </Note>
            </Section>

            <Section id="client-usability" title="4. Client usability test (30 min, Figma prototype)">
              <Note label="Scenario.">You’re hiring a pentester for a project and already have a shortlist.</Note>
              <Table
                head={["#", "Task", "Success criteria", "Watch for"]}
                rows={[
                  ["1", "Send a technical test to candidates from your shortlist", "Finds Send test in the project’s shortlist", "Where they expect the action to be"],
                  ["2", "Choose who should get the test", "Selects candidates using the list data", "Which columns they rely on"],
                  ["3", "Pick a test that fits the project", "Opens an area, checks details and the Questions tab, selects a test", "Whether they understand what candidates will face"],
                  ["4", "You’ve run out of tests. Get more", "Finds Buy more tests and completes the purchase panel", "Clarity of who pays and what’s included"],
                  ["5", "Decide which candidate did best", "Opens Test results and compares candidates per question", "Whether they read per-question marks or just the overall score"],
                  ["6", "Invite the strongest candidate to an interview", "Uses Book a meeting", "Whether this feels like the natural next step"],
                ]}
              />
              <Note label="Debrief.">Would you trust this result in your hiring decision? What’s missing?</Note>
            </Section>

            <Section id="metrics" title="Metrics to report">
              <List
                items={[
                  "Task success rate per task",
                  "Time on task for sending a test and finding a result",
                  "SEQ per task and SUS overall",
                  "Usability issues by severity, round 1 vs round 2",
                ]}
              />
              <div className="rv mt-14">
                <BackLink href={CASE_HREF}>Back to case study</BackLink>
              </div>
            </Section>
          </div>
        </div>
      </RevealScope>
      <Footer />
      <FrameLines />
      <MenuPill linkBase="/" />
    </main>
  );
}
