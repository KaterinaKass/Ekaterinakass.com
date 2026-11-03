import { A, Card, Figure, H3, Label, List, NumList, P, Pair, Section, Table, type Img } from "../CaseUI";
import type { CaseData } from "./CyberrCase";

/* Тексты кейса Cyberr — Candidate Onboarding. Источник: cyberr-onboarding-case-study.md */

const DIR = "/images/cases/cyberr-onboarding";
// пока плоские скриншоты из Figma, позже заменятся 3D-мокапами
const img = (file: string, alt: string, w = 2000, h = 1111): Img => ({ src: `${DIR}/${file}`, w, h, alt });

const images = {
  hero: img("Onb-review-top.webp", "“Looking good, Josef!”: the candidate reviews their finished profile before it goes live"),
  resume: img("Onb-02-resume.webp", "Add your resume: LinkedIn link, upload or fill out manually, each with a time estimate"),
  resumeLinkedin: img("Onb-02-resume-linkedin.webp", "LinkedIn selected: a single field for the profile link"),
  resumeUpload: img("Onb-02-resume-upload.webp", "Upload selected: a drop zone for the resume file"),
  title: img("Onb-03-title.webp", "Step 3: a single field for the professional role, with a line on why it matters"),
  skills: img("Onb-04-skills.webp", "Up to five main skills, ranked by drag handles"),
  experience: img("Onb-05-experience.webp", "Work experience pre-filled from the resume as cards with edit and delete"),
  editEducation: img("Onb-06-edit-education.webp", "Edit education modal with fields pre-filled from the resume"),
  rates: img("Onb-09-rates.webp", "Rates: currency, Daily or Yearly, and a range slider over the market distribution"),
  details: img("Onb-10-details.webp", "Step 10: photo and personal details, with a reason for asking"),
  review: img("Onb-review.webp", "“Looking good, Josef!”: a review of the finished profile before it goes live", 1880, 2000),
};

export const onboardingCase: CaseData = {
  header: {
    eyebrow: ["Hiring platform", "Cyberr Onboarding"],
    title: "Onboarding at Cyberr: from a CV to a ready profile",
    meta: [
      { label: "Role", value: "Sole Product Designer" },
      { label: "Scope", value: "User Research, Competitive Analysis, UI/UX Design, Usability Testing" },
      { label: "Team", value: "Product Manager, Machine Learning engineers, Frontend engineers" },
      { label: "Users", value: "Freelance cybersecurity experts, from junior analysts to senior pentesters" },
    ],
  },
  hero: images.hero,
  nav: {
    summary: [
      { id: "overview", label: "Overview" },
      { id: "long-story-short", label: "Long Story Short" },
      { id: "biggest-shift", label: "The Biggest Shift" },
      { id: "business-value", label: "Business Value" },
    ],
    full: [
      { id: "overview", label: "Overview" },
      { id: "context", label: "Context" },
      { id: "problem", label: "The Problem" },
      { id: "market", label: "Market" },
      { id: "research", label: "Research" },
      { id: "decisions", label: "Decisions" },
      { id: "usability", label: "Usability Testing" },
      { id: "outcome", label: "Outcome" },
      { id: "learned", label: "What I Learned" },
    ],
  },
};

const b = (t: string) => <strong className="font-semibold text-ink">{t}</strong>;

/* ───────────────────────── SUMMARY ───────────────────────── */

export function OnboardingSummary() {
  return (
    <>
      <Section id="long-story-short" title="Long Story Short">
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <Card label="The What" title="A 10-Step Onboarding That Turns a Resume into a Ready Profile" tint="#0388ee">
            Cyberr matches cybersecurity freelancers with clients using AI. Matching is only as good as the profile behind it. I redesigned candidate
            onboarding so that people review a profile the AI has already drafted from their resume, instead of filling in an empty form.
          </Card>
          <Card label="The Why" title="Half-Empty Profiles Gave Matching Nothing to Work With" tint="#e0457b">
            The first version was a single long profile form. Candidates quit around the work experience section, and those who finished left bios,
            rates and skills blank or listed every tool they had ever touched. Clients saw profiles that looked the same, and matching had little to go
            on.
          </Card>
          <Card label="The How" className="md:col-span-2" tint="#e8862a">
            <div className="grid gap-8 md:grid-cols-2 md:gap-10">
              <div>
                <h3 className="mb-4 text-[21px] leading-[1.2] font-semibold tracking-[-0.01em] text-ink md:text-[24px]">What Research Helped Me Do</h3>
                <p>
                  Funnel analytics of the first version, interviews with 8 candidates and 4 clients, and two rounds of usability tests. 7 of 8 candidates
                  already had their experience written down and hated retyping it. All 4 clients said they read only the top few skills of a profile.
                </p>
              </div>
              <div>
                <h3 className="mb-4 text-[21px] leading-[1.2] font-semibold tracking-[-0.01em] text-ink md:text-[24px]">What Was the Design Direction</h3>
                <p>
                  Review, don’t retype. A resume or LinkedIn link fills most of the profile, one question per screen keeps the pace, and the candidate’s
                  job is to check and correct. Skills are capped at five and ranked, rates are set against the market, and personal details come last,
                  when the profile is already worth protecting.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Pair a={images.resume} b={images.skills} />

        <Card label="The Why Not" title="No LinkedIn-Only Sign-Up, No Single Long Form, No Unlimited Skills" tint="#7a5cf0">
          LinkedIn-only import looked fastest, but many security people keep a minimal LinkedIn on purpose. A single form was what we already had, and
          it lost people halfway. Unlimited skills felt generous, but every profile ended up listing everything, and the ranking stopped meaning
          anything.
        </Card>
      </Section>

      <Section id="biggest-shift" title="The Biggest Shift">
        <P lead>From filling in a form to reviewing a profile that’s already there.</P>
        <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10">
          <div className="rv border-t border-line pt-5">
            <Label className="mb-3">Before redesign</Label>
            <p className="text-[17px] leading-[1.6] text-ink/80 md:text-[18px]">
              One long form with every field empty. Candidates typed out what was already in their CV, gave up halfway or left key fields blank, and AI
              matching worked with thin, look-alike profiles.
            </p>
          </div>
          <div className="rv border-t border-ink pt-5">
            <Label className="mb-3 text-accent!">After redesign</Label>
            <p className="text-[17px] leading-[1.6] text-ink/80 md:text-[18px]">
              Candidates pick how to add their resume, the AI pre-fills experience, education, skills and bio, and ten short steps end with a preview
              of the profile exactly as clients will see it.
            </p>
          </div>
        </div>
        <Figure img={images.experience} className="mt-12" />
      </Section>

      <Section id="business-value" title="Business Value">
        <P>Better profiles at the start mean better matches later, for candidates and for clients. Exact numbers are under NDA.</P>
        <div className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
          {[
            { label: "Ways to add a resume", value: "3", text: "LinkedIn link, file upload or manual entry, each with an honest time estimate." },
            { label: "Main skills", value: "5", text: "A short, ranked list that tells clients and the matching model what a person does best." },
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

export function OnboardingFull() {
  return (
    <>
      <Section id="intro">
        <P lead>
          On a hiring platform, the profile is the product. Clients see it, and AI matching reads it. I redesigned the onboarding that creates it. The
          hard part wasn’t asking for more information. It was asking for less: letting the resume do most of the work, so candidates only check and
          correct.
        </P>
      </Section>

      <Section id="context" title="Context">
        <P>
          <A href="https://cyberr.ai/about-us">Cyberr</A> is a hiring platform and professional network built only for cybersecurity. Clients search
          talent, get AI-matched candidates, build shortlists and hire freelancers directly.
        </P>
        <P>
          All of that depends on one thing: what candidates tell the platform about themselves. The matching model weighs skills, experience and
          rates. If a profile is half-empty, the model guesses, and clients get matches they don’t trust.
        </P>
        <P>
          The first onboarding was one long form that mirrored the database: every field, empty, on one page. It worked for engineering, but not for
          people. My job was to make onboarding fast enough that candidates finish it, and structured enough that the profile it produces is worth
          matching on.
        </P>
      </Section>

      <Section id="problem" title="The Problem">
        <P>
          The funnel of the first version showed where it broke. Most candidates who dropped off did it at the work experience section, the first
          place where they had to type a lot. Those who finished often skipped what mattered most for matching:
        </P>
        <Table
          firstColStrong
          head={["What we saw in profiles", "Why it hurt"]}
          rows={[
            ["Bio left empty or one line long", "Clients had no idea who the person was"],
            ["Rates left blank", "Matching couldn’t filter by budget, clients had to ask"],
            ["15+ skills listed, in no order", "Every profile looked the same, the model couldn’t tell strengths from side skills"],
            ["Experience copied from the CV in one block, or skipped", "Dates and roles couldn’t be parsed, so experience counted for little in matching"],
          ]}
        />
        <P>
          The form treated every field as equally important and gave candidates no help with any of them. Before redesigning screens, I wanted to
          understand why people stopped and what clients actually read.
        </P>
      </Section>

      <Section id="market" title="What the market taught us">
        <P>
          I looked at freelance and talent platforms candidates already use: <A href="https://www.upwork.com">Upwork</A>,{" "}
          <A href="https://www.toptal.com">Toptal</A>, <A href="https://www.malt.com">Malt</A>, <A href="https://contra.com">Contra</A> and
          LinkedIn’s own profile flow, plus security-specific talent pools like{" "}
          <A href="https://www.hackthebox.com/business/talent-search">Hack The Box</A>.
        </P>
        <P>
          The good flows had three things in common: they split the profile into small steps, they imported what they could, and they helped with the
          hardest questions, like price. The weak ones asked for everything up front, including personal data, before giving anything back.
        </P>
        <P>That gave me three principles to design by:</P>
        <NumList
          items={[
            <>{b("Import first, ask second.")} Whatever already exists in a CV or on LinkedIn should never be typed again.</>,
            <>{b("One decision per screen.")} A short, clear question is easier to answer than a page of empty fields.</>,
            <>{b("Help with the hard questions.")} Rates, skills and bio are where people stall, so that’s where the design should do the most work.</>,
          ]}
        />
      </Section>

      <Section id="research" title="Listening to candidates and clients">
        <P>
          I ran interviews with 8 candidates (3 junior, 3 mid-level, 2 senior) and 4 clients (2 recruiters, a hiring manager and a technical lead),
          then two rounds of moderated usability tests on a Figma prototype with 5 candidates each.
        </P>

        <H3>How the sessions were set up</H3>
        <Table
          firstColStrong
          head={["Session", "Format", "What it covered"]}
          rows={[
            ["Candidate interview", "40 min, remote", "How they keep their CV and LinkedIn up to date, how they fill in profiles on other platforms, where they stall, how they set their rate"],
            ["Client interview", "30 min, remote", "What they read first in a freelancer profile, what makes them skip one, which signals they trust"],
            ["Candidate usability test", "35 min, Figma prototype, think-aloud", "7 tasks, from adding a resume to reviewing the finished profile"],
          ]}
        />
        <P>
          Every usability task had a success criterion and an ease rating (SEQ, 1 to 7); sessions ended with a SUS questionnaire. Issues were rated by
          severity and compared between rounds.
        </P>

        <H3>What survived the synthesis</H3>
        <P>I clustered notes on an affinity map and kept only patterns that came up with at least three people.</P>
        <Table
          firstColStrong
          head={["What we learned", "Where it came from", "What it changed in the design"]}
          rows={[
            ["Candidates already have their experience written down and hate retyping it", "7 of 8 candidate interviews", "Three ways to add a resume; the AI pre-fills experience, education, skills and bio"],
            ["Many security people keep LinkedIn minimal or outdated on purpose", "4 of 8 candidate interviews", "LinkedIn is one option, not the only one; file upload is the fastest path"],
            ["A long page of empty fields feels endless, and people leave at the first heavy section", "Funnel analytics, 5 of 8 interviews", "One question per screen, a “3 of 10” counter and a progress bar"],
            ["Clients read only the top few skills of a profile", "4 of 4 client interviews", "Up to five main skills, ranked; the order affects matching"],
            ["Candidates don’t know what to charge: juniors underprice, seniors leave it blank", "6 of 8 candidate interviews", "A rate range set over the market distribution, daily or yearly"],
            ["Being asked for an address and date of birth early feels suspicious", "5 of 8 candidate interviews", "Personal details moved to the last step, with a one-line reason"],
          ]}
        />
        <blockquote className="rv my-10 border-l-2 border-accent pl-6 text-[20px] leading-[1.45] text-ink md:pl-8 md:text-[24px]">
          The insight that reframed the project came from a mid-level SOC analyst. Asked how she fills in profiles on new platforms, she said she had
          rewritten her CV three times that month and just wanted someone to read it. That turned onboarding from a form to fill into a draft to check.
        </blockquote>
      </Section>

      <Section id="decisions" title="Five decisions that shaped onboarding">
        <H3>
          <span className="mr-3 text-accent">01</span>Review, don’t retype
        </H3>
        <P>The biggest lever was not to ask at all. We considered three models:</P>
        <List
          items={[
            <>{b("LinkedIn-only import.")} The fastest on paper, but research showed many security professionals keep LinkedIn minimal on purpose, so the import would come back empty.</>,
            <>{b("Manual form, better organized.")} Familiar, but it still made people retype a CV they already had.</>,
            <>{b("Three paths, with the AI doing the first draft.")} This is what we chose.</>,
          ]}
        />
        <P>
          On step 2, candidates choose how to add their resume: {b("Use LinkedIn link")}, {b("Upload the resume")} or {b("Fill out manually")}. Each
          card shows an honest time estimate, so the faster path is obvious without hiding the others. The AI parses the resume and pre-fills the next
          steps: role, skills, experience, education, languages and bio. Each step then becomes a review: entries arrive as cards with edit and delete,
          so fixing a wrong date takes one click, not a retyped paragraph.
        </P>
        <Pair a={images.resumeLinkedin} b={images.resumeUpload} />
        <Figure img={images.experience} className="my-10" />

        <H3>
          <span className="mr-3 text-accent">02</span>One question per screen
        </H3>
        <P>
          The first version asked for everything on one page. The redesign splits it into ten steps, each with a single question and a short line
          explaining why it matters: “This is the first thing clients will see”, “Freelancers who add work experience are twice as likely to land a
          job”. A “3 of 10” pill and a progress bar show how far along the candidate is, and the footer names the stage they’re in.
        </P>
        <P>
          The resume comes right at the start, so every step after it opens with something already filled in. Closing the flow with ✕ saves
          progress, so a candidate can leave at step 6 and come back to step 6.
        </P>
        <Figure img={images.title} className="my-10" />

        <H3>
          <span className="mr-3 text-accent">03</span>Five skills, in order
        </H3>
        <P>
          In the first version, candidates listed every tool and topic they had touched, and profiles became indistinguishable. Clients told us they
          read the first few skills and skip the rest.
        </P>
        <P>
          So step 4 asks for up to five main skills and lets candidates rank them by dragging. The order isn’t decoration: the higher a skill sits, the
          more it affects the matching score, and the screen says so. Five was a deliberate number. It’s enough to describe a real specialization, short
          enough that clients read all of it, and small enough that every skill carries weight in matching. With ten, the top skill would count for
          little; with three, people with a broad but real profile felt cut short.
        </P>
        <Figure img={images.skills} className="my-10" />

        <H3>
          <span className="mr-3 text-accent">04</span>Help with the hardest question: price
        </H3>
        <P>
          Rates were the field candidates skipped most. Juniors guessed low, seniors didn’t want to commit to a number. Instead of an empty input, step
          9 shows a range slider over a distribution of rates on the platform, so candidates see where most people are and place themselves within it.
          A {b("Daily / Yearly")} switch covers both freelance projects and longer engagements, and the currency is set once at the top.
        </P>
        <Figure img={images.rates} className="my-10" />

        <H3>
          <span className="mr-3 text-accent">05</span>Ask for trust last, show the result before it goes live
        </H3>
        <P>
          Date of birth, phone and address are required for secure payments, but asking for them on the first screen made candidates hesitate. They
          moved to step 10, when the profile is already built and worth protecting, together with the photo, and with one line explaining why we need
          them.
        </P>
        <Figure img={images.details} className="my-10" />
        <P>
          The flow ends with a review, not a “Done”. {b("Looking good, Josef!")} shows the profile exactly as clients will see it: skills, bio,
          projects, rates and education. Candidates catch mistakes here, before anyone else does, and only then press {b("Complete profile")}.
        </P>
        <Figure img={images.review} className="mx-auto mt-10 md:max-w-[640px]" />
      </Section>

      <Section id="usability" title="What usability testing changed">
        <P>The first round didn’t challenge the structure, but it showed where people still hesitated.</P>
        <Table
          head={["What we saw in round 1", "What we changed"]}
          rows={[
            ["Candidates weren’t sure what would happen after uploading a CV", "A line under the title explains that the AI will extract the details and pre-fill the profile"],
            ["Candidates accepted AI-filled entries without checking, and missed wrong dates", "Every entry became a card with edit and delete; the edit modal opens with all fields pre-filled"],
            ["Nobody realized the order of skills mattered", "Drag handles on each skill and a line explaining that higher skills weigh more in matching"],
            ["Closing the flow felt like losing everything", "✕ saves progress, and coming back opens the same step"],
            ["The personal details step caused visible hesitation", "Moved to the end, with a one-line reason: secure payments"],
            ["Several candidates wanted to see their profile before it went live", <>A review screen with the full profile before {b("Complete profile")}</>],
          ]}
        />
        <Figure img={images.editEducation} className="my-10" />
        <P>
          In round 2, all five candidates completed onboarding without help, and most of those who uploaded a CV finished in under ten minutes. Every
          candidate opened at least one pre-filled card to check it, which was exactly the behavior we wanted.
        </P>
      </Section>

      <Section id="outcome" title="The outcome">
        <P>The new onboarding shipped to production. Exact numbers are under NDA, but the shape of the result is clear:</P>
        <div className="my-8 grid gap-4 md:grid-cols-3 md:gap-5">
          {[
            ["Profiles arrive complete.", "Experience, skills, bio and rates are filled in from the start, not added later or never."],
            ["Matching gets real data.", "Ranked skills, structured experience and a rate range give the model clear signals instead of guesses."],
            ["A faster start for candidates.", "The resume does most of the work, and the slowest path is the one people choose on purpose."],
          ].map(([t, d]) => (
            <Card key={t} title={t}>
              {d}
            </Card>
          ))}
        </div>

        <H3>What we measure</H3>
        <P>I worked with the PM to define success as a funnel, so the team can see where onboarding still loses people:</P>
        <Table
          firstColStrong
          head={["Stage", "Metric", "What it tells us"]}
          rows={[
            ["Start", "Share of candidates choosing each resume path", "Do people trust the import?"],
            ["Progress", "Drop-off by step", "Which question still stops people?"],
            ["Quality", "Edits made to AI-filled entries", "How accurate is parsing, and do people check it?"],
            ["Completion", "Onboarding completion rate and time to complete", "Is the flow short enough?"],
            ["Profile", "Share of profiles with bio, rates and ranked skills", "Does onboarding produce profiles worth matching on?"],
            ["Value", "Time to the first client invitation", "Does a better profile lead to work?"],
          ]}
        />
      </Section>

      <Section id="learned" title="What I learned">
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <Card title="The best field is the one you don’t have to fill.">
            Most of the gain came not from better inputs but from removing them. Once the resume did the typing, every step became a quick check.
          </Card>
          <Card title="Order is a design decision.">
            The same ten questions felt very different depending on what came first. With the resume up front, every next step starts half-done, and sensitive
            questions land better once the profile already feels like the candidate’s own.
          </Card>
          <Card title="Help where people stall, not everywhere.">
            Most steps need nothing but a clear question. The design effort went into the few that stop people: what to charge, which skills to lead
            with, what to write about yourself.
          </Card>
          <Card title="Design for two readers.">
            A profile is read by clients and by a matching model. Ranked skills and a rate range serve both: they are easy for a person to scan and
            clear for an algorithm to weigh.
          </Card>
        </div>
      </Section>
    </>
  );
}
