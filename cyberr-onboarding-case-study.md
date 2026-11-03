# Cyberr — Candidate Onboarding (page source)

<!--
NOTES FOR LAYOUT (Claude Code):
- Same layout as cyberr-technical-tests-case-study.md: one page, two views, a segmented toggle "Summary / Full Case Study" under the shared header. Default view: Summary.
- Everything between `<!-- VIEW: SUMMARY -->` and `<!-- /VIEW: SUMMARY -->` is the Summary view; the same for FULL.
- Image placeholders:
    [IMAGE: filename | layout | alt text]
  layout values: hero, full, pair (two consecutive IMAGE lines marked `pair`).
- For now the images are flat screenshots from the Figma file (2000×1111, review screen 1880×2000), stored in public/images/cases/cyberr-onboarding/. They will be replaced with 3D device mockups; keep the same filenames or update the image map.
- Sign-up screens (role switch, verify email, set password) are intentionally left out: the case is about onboarding.
-->

## Image map

| File | What it shows | Used in |
| --- | --- | --- |
| `Onb-review-top.webp` | "Looking good, Josef!": top of the profile review with skills and bio | Hero (shared) |
| `Onb-02-resume.webp` | Step 2: Add your resume, three ways with time estimates | Summary, Full (Decision 1) |
| `Onb-02-resume-linkedin.webp` | Step 2, LinkedIn selected: profile link field | Full (Decision 1) |
| `Onb-02-resume-upload.webp` | Step 2, Upload selected: drop zone | Full (Decision 1) |
| `Onb-03-title.webp` | Step 3: Your professional role | Full (Decision 2) |
| `Onb-04-skills.webp` | Step 4: Choose up to 5 skills, ranked by drag | Summary, Full (Decision 3) |
| `Onb-05-experience.webp` | Step 5: Work experience cards pre-filled from the resume, edit and delete | Summary, Full (Decision 1) |
| `Onb-06-education.webp` | Step 6: Education card | Not used |
| `Onb-06-edit-education.webp` | Edit education modal with pre-filled fields | Full (Usability) |
| `Onb-07-languages.webp` | Step 7: Languages and proficiency | Not used |
| `Onb-08-bio.webp` | Step 8: Write your bio | Not used |
| `Onb-09-rates.webp` | Step 9: Your rates, currency, Daily / Yearly, range slider over market distribution | Full (Decision 4) |
| `Onb-10-details.webp` | Step 10: Photo and personal details for secure payments | Full (Decision 5) |
| `Onb-review.webp` | "Looking good, Josef!": profile preview before going live, Complete profile | Full (Decision 5) |

---

<!-- SHARED HEADER (visible in both views) -->

**HIRING PLATFORM • CYBERR ONBOARDING**

# Onboarding at Cyberr: from a CV to a ready profile

**ROLE**
Sole Product Designer

**SCOPE**
User Research, Competitive Analysis, UI/UX Design, Usability Testing

**TEAM**
Product Manager, Machine Learning engineers, Frontend engineers

**USERS**
Freelance cybersecurity experts, from junior analysts to senior pentesters

[IMAGE: Onb-review-top.webp | hero | "Looking good, Josef!": the candidate reviews their finished profile before it goes live]

**[ Summary | Full Case Study ]**

<!-- /SHARED HEADER -->

---

<!-- VIEW: SUMMARY -->

## Long Story Short

### THE WHAT
**A 10-Step Onboarding That Turns a Resume into a Ready Profile**

Cyberr matches cybersecurity freelancers with clients using AI. Matching is only as good as the profile behind it. I redesigned candidate onboarding so that people review a profile the AI has already drafted from their resume, instead of filling in an empty form.

### THE WHY
**Half-Empty Profiles Gave Matching Nothing to Work With**

The first version was a single long profile form. Candidates quit around the work experience section, and those who finished left bios, rates and skills blank or listed every tool they had ever touched. Clients saw profiles that looked the same, and matching had little to go on.

### THE HOW

**What Research Helped Me Do**

Funnel analytics of the first version, interviews with 8 candidates and 4 clients, and two rounds of usability tests. 7 of 8 candidates already had their experience written down and hated retyping it. All 4 clients said they read only the top few skills of a profile.

**What Was the Design Direction**

Review, don't retype. A resume or LinkedIn link fills most of the profile, one question per screen keeps the pace, and the candidate's job is to check and correct. Skills are capped at five and ranked, rates are set against the market, and personal details come last, when the profile is already worth protecting.

[IMAGE: Onb-02-resume.webp | pair | Add your resume: LinkedIn link, upload or fill out manually, each with a time estimate]
[IMAGE: Onb-04-skills.webp | pair | Up to five main skills, ranked by drag, the order affects the matching score]

### THE WHY NOT
**No LinkedIn-Only Sign-Up, No Single Long Form, No Unlimited Skills**

LinkedIn-only import looked fastest, but many security people keep a minimal LinkedIn on purpose. A single form was what we already had, and it lost people halfway. Unlimited skills felt generous, but every profile ended up listing everything, and the ranking stopped meaning anything.

---

## The Biggest Shift

**From filling in a form to reviewing a profile that's already there.**

**BEFORE REDESIGN**
One long form with every field empty. Candidates typed out what was already in their CV, gave up halfway or left key fields blank, and AI matching worked with thin, look-alike profiles.

**AFTER REDESIGN**
Candidates pick how to add their resume, the AI pre-fills experience, education, skills and bio, and ten short steps end with a preview of the profile exactly as clients will see it.

[IMAGE: Onb-05-experience.webp | full | Work experience pre-filled from the resume as cards with edit and delete]

---

## Business Value

Better profiles at the start mean better matches later, for candidates and for clients. Exact numbers are under NDA.

**WAYS TO ADD A RESUME**
**3**
LinkedIn link, file upload or manual entry, each with an honest time estimate.

**MAIN SKILLS**
**5**
A short, ranked list that tells clients and the matching model what a person does best.

<!-- /VIEW: SUMMARY -->

---

<!-- VIEW: FULL -->

On a hiring platform, the profile is the product. Clients see it, and AI matching reads it. I redesigned the onboarding that creates it. The hard part wasn't asking for more information. It was asking for less: letting the resume do most of the work, so candidates only check and correct.

## Context

[Cyberr](https://cyberr.ai/about-us) is a hiring platform and professional network built only for cybersecurity. Clients search talent, get AI-matched candidates, build shortlists and hire freelancers directly.

All of that depends on one thing: what candidates tell the platform about themselves. The matching model weighs skills, experience and rates. If a profile is half-empty, the model guesses, and clients get matches they don't trust.

The first onboarding was one long form that mirrored the database: every field, empty, on one page. It worked for engineering, but not for people. My job was to make onboarding fast enough that candidates finish it, and structured enough that the profile it produces is worth matching on.

## The problem

The funnel of the first version showed where it broke. Most candidates who dropped off did it at the work experience section, the first place where they had to type a lot. Those who finished often skipped what mattered most for matching:

| What we saw in profiles | Why it hurt |
| --- | --- |
| Bio left empty or one line long | Clients had no idea who the person was |
| Rates left blank | Matching couldn't filter by budget, clients had to ask |
| 15+ skills listed, in no order | Every profile looked the same, the model couldn't tell strengths from side skills |
| Experience copied from the CV in one block, or skipped | Dates and roles couldn't be parsed, so experience counted for little in matching |

The form treated every field as equally important and gave candidates no help with any of them. Before redesigning screens, I wanted to understand why people stopped and what clients actually read.

## What the market taught us

I looked at freelance and talent platforms candidates already use: [Upwork](https://www.upwork.com), [Toptal](https://www.toptal.com), [Malt](https://www.malt.com), [Contra](https://contra.com) and LinkedIn's own profile flow, plus security-specific talent pools like [Hack The Box](https://www.hackthebox.com/business/talent-search).

The good flows had three things in common: they split the profile into small steps, they imported what they could, and they helped with the hardest questions, like price. The weak ones asked for everything up front, including personal data, before giving anything back.

That gave me three principles to design by:

1. **Import first, ask second.** Whatever already exists in a CV or on LinkedIn should never be typed again.
2. **One decision per screen.** A short, clear question is easier to answer than a page of empty fields.
3. **Help with the hard questions.** Rates, skills and bio are where people stall, so that's where the design should do the most work.

## Listening to candidates and clients

I ran interviews with 8 candidates (3 junior, 3 mid-level, 2 senior) and 4 clients (2 recruiters, a hiring manager and a technical lead), then two rounds of moderated usability tests on a Figma prototype with 5 candidates each.

### How the sessions were set up

| Session | Format | What it covered |
| --- | --- | --- |
| Candidate interview | 40 min, remote | How they keep their CV and LinkedIn up to date, how they fill in profiles on other platforms, where they stall, how they set their rate |
| Client interview | 30 min, remote | What they read first in a freelancer profile, what makes them skip one, which signals they trust |
| Candidate usability test | 35 min, Figma prototype, think-aloud | 7 tasks, from adding a resume to reviewing the finished profile |

Every usability task had a success criterion and an ease rating (SEQ, 1 to 7); sessions ended with a SUS questionnaire. Issues were rated by severity and compared between rounds.

### What survived the synthesis

I clustered notes on an affinity map and kept only patterns that came up with at least three people.

| What we learned | Where it came from | What it changed in the design |
| --- | --- | --- |
| Candidates already have their experience written down and hate retyping it | 7 of 8 candidate interviews | Three ways to add a resume; the AI pre-fills experience, education, skills and bio |
| Many security people keep LinkedIn minimal or outdated on purpose | 4 of 8 candidate interviews | LinkedIn is one option, not the only one; file upload is the fastest path |
| A long page of empty fields feels endless, and people leave at the first heavy section | Funnel analytics, 5 of 8 interviews | One question per screen, a "3 of 10" counter and a progress bar |
| Clients read only the top few skills of a profile | 4 of 4 client interviews | Up to five main skills, ranked; the order affects matching |
| Candidates don't know what to charge: juniors underprice, seniors leave it blank | 6 of 8 candidate interviews | A rate range set over the market distribution, daily or yearly |
| Being asked for an address and date of birth early feels suspicious | 5 of 8 candidate interviews | Personal details moved to the last step, with a one-line reason |

> The insight that reframed the project came from a mid-level SOC analyst. Asked how she fills in profiles on new platforms, she said she had rewritten her CV three times that month and just wanted someone to read it. That turned onboarding from a form to fill into a draft to check.

## Five decisions that shaped onboarding

### 1. Review, don't retype

The biggest lever was not to ask at all. We considered three models:

- **LinkedIn-only import.** The fastest on paper, but research showed many security professionals keep LinkedIn minimal on purpose, so the import would come back empty.
- **Manual form, better organized.** Familiar, but it still made people retype a CV they already had.
- **Three paths, with the AI doing the first draft.** This is what we chose.

On step 2, candidates choose how to add their resume: **Use LinkedIn link**, **Upload the resume** or **Fill out manually**. Each card shows an honest time estimate, so the faster path is obvious without hiding the others. The AI parses the resume and pre-fills the next steps: role, skills, experience, education, languages and bio. Each step then becomes a review: entries arrive as cards with edit and delete, so fixing a wrong date takes one click, not a retyped paragraph.

[IMAGE: Onb-02-resume-linkedin.webp | pair | LinkedIn selected: a single field for the profile link]
[IMAGE: Onb-02-resume-upload.webp | pair | Upload selected: a drop zone for the resume file]

[IMAGE: Onb-05-experience.webp | full | Work experience pre-filled from the resume as cards with edit and delete]

### 2. One question per screen

The first version asked for everything on one page. The redesign splits it into ten steps, each with a single question and a short line explaining why it matters: "This is the first thing clients will see", "Freelancers who add work experience are twice as likely to land a job". A "3 of 10" pill and a progress bar show how far along the candidate is, and the footer names the stage they're in.

The resume comes right at the start, so every step after it opens with something already filled in. Closing the flow with ✕ saves progress, so a candidate can leave at step 6 and come back to step 6.

[IMAGE: Onb-03-title.webp | full | Step 3: a single field for the professional role, with a line on why it matters]

### 3. Five skills, in order

In the first version, candidates listed every tool and topic they had touched, and profiles became indistinguishable. Clients told us they read the first few skills and skip the rest.

So step 4 asks for up to five main skills and lets candidates rank them by dragging. The order isn't decoration: the higher a skill sits, the more it affects the matching score, and the screen says so. Five was a deliberate number. It's enough to describe a real specialization, short enough that clients read all of it, and small enough that every skill carries weight in matching. With ten, the top skill would count for little; with three, people with a broad but real profile felt cut short.

[IMAGE: Onb-04-skills.webp | full | Up to five main skills, ranked by drag handles]

### 4. Help with the hardest question: price

Rates were the field candidates skipped most. Juniors guessed low, seniors didn't want to commit to a number. Instead of an empty input, step 9 shows a range slider over a distribution of rates on the platform, so candidates see where most people are and place themselves within it. A **Daily / Yearly** switch covers both freelance projects and longer engagements, and the currency is set once at the top.

[IMAGE: Onb-09-rates.webp | full | Rates: currency, Daily or Yearly, and a range slider over the market distribution]

### 5. Ask for trust last, show the result before it goes live

Date of birth, phone and address are required for secure payments, but asking for them on the first screen made candidates hesitate. They moved to step 10, when the profile is already built and worth protecting, together with the photo, and with one line explaining why we need them.

The flow ends with a review, not a "Done". **Looking good, Josef!** shows the profile exactly as clients will see it: skills, bio, projects, rates and education. Candidates catch mistakes here, before anyone else does, and only then press **Complete profile**.

[IMAGE: Onb-10-details.webp | full | Step 10: photo and personal details, with a reason for asking]

[IMAGE: Onb-review.webp | full | Review of the finished profile before it goes live]

## What usability testing changed

The first round didn't challenge the structure, but it showed where people still hesitated.

| What we saw in round 1 | What we changed |
| --- | --- |
| Candidates weren't sure what would happen after uploading a CV | A line under the title explains that the AI will extract the details and pre-fill the profile |
| Candidates accepted AI-filled entries without checking, and missed wrong dates | Every entry became a card with edit and delete; the edit modal opens with all fields pre-filled |
| Nobody realized the order of skills mattered | Drag handles on each skill and a line explaining that higher skills weigh more in matching |
| Closing the flow felt like losing everything | ✕ saves progress, and coming back opens the same step |
| The personal details step caused visible hesitation | Moved to the end, with a one-line reason: secure payments |
| Several candidates wanted to see their profile before it went live | A review screen with the full profile before Complete profile |

[IMAGE: Onb-06-edit-education.webp | full | Edit education modal with fields pre-filled from the resume]

In round 2, all five candidates completed onboarding without help, and most of those who uploaded a CV finished in under ten minutes. Every candidate opened at least one pre-filled card to check it, which was exactly the behavior we wanted.

## The outcome

The new onboarding shipped to production. Exact numbers are under NDA, but the shape of the result is clear:

- **Profiles arrive complete.** Experience, skills, bio and rates are filled in from the start, not added later or never.
- **Matching gets real data.** Ranked skills, structured experience and a rate range give the model clear signals instead of guesses.
- **A faster start for candidates.** The resume does most of the work, and the slowest path is the one people choose on purpose.

### What we measure

I worked with the PM to define success as a funnel, so the team can see where onboarding still loses people:

| Stage | Metric | What it tells us |
| --- | --- | --- |
| Start | Share of candidates choosing each resume path | Do people trust the import? |
| Progress | Drop-off by step | Which question still stops people? |
| Quality | Edits made to AI-filled entries | How accurate is parsing, and do people check it? |
| Completion | Onboarding completion rate and time to complete | Is the flow short enough? |
| Profile | Share of profiles with bio, rates and ranked skills | Does onboarding produce profiles worth matching on? |
| Value | Time to the first client invitation | Does a better profile lead to work? |

## What I learned

**The best field is the one you don't have to fill.** Most of the gain came not from better inputs but from removing them. Once the resume did the typing, every step became a quick check.

**Order is a design decision.** The same ten questions felt very different depending on what came first. With the resume up front, every next step starts half-done, and sensitive questions land better once the profile already feels like the candidate's own.

**Help where people stall, not everywhere.** Most steps need nothing but a clear question. The design effort went into the few that stop people: what to charge, which skills to lead with, what to write about yourself.

**Design for two readers.** A profile is read by clients and by a matching model. Ranked skills and a rate range serve both: they are easy for a person to scan and clear for an algorithm to weigh.

<!-- /VIEW: FULL -->
