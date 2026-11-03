# Cyberr — Technical Tests (page source)

<!--
NOTES FOR LAYOUT (Claude Code):
- One page, two views. A segmented toggle "Summary / Full Case Study" sits once, right under the shared header. Default view: Summary. The toggle appears only there; nothing else in the text links to or mentions it.
- Everything between `<!-- VIEW: SUMMARY -->` and `<!-- /VIEW: SUMMARY -->` is the Summary view; the same for FULL.
- Image placeholders:
    [IMAGE: filename | layout | alt text]
  Filenames are the original exported files, use them as is.
  layout values:
    hero  — edge-to-edge hero under the header
    full  — full content width
    pair  — two images side by side (two consecutive IMAGE lines marked `pair`), equal height, stacked on mobile
- All images are dark 3D device mockups (monitor, MacBook, iPhone) on dark / magenta / orange backgrounds. Use a dark section or rounded containers behind them.
- Never crop the mockups; keep the original aspect ratio. Most are 3000×2250 (4:3); Tests-Results-waiting-mob.webp and Tests-waiting.webp are 3000×2000 (3:2).
- Not used anywhere: Tests-Leaderboard-mob.webp (duplicates the desktop leaderboard).
- Link `[Research scripts](research-scripts.md)` points to a separate page built from research-scripts.md, in the same visual style as the case, with a "← Back to case study" link at the top that returns to the Full Case Study view.
-->

## Image map

| File | What it shows | Device | Used in |
| --- | --- | --- | --- |
| `Tests-Tests.webp` | Technical tests hub: Pending tests block with time left and Go to test, value banner "Top candidates don't just say they're good", categories grid | MacBook | Hero (shared) |
| `Tests-Test-result.webp` | Pentest test 3 result panel: earned points, correct answers, time spent, per-question list, Retake test and Publish on my profile | MacBook | Summary, Full (Decision 1) |
| `Tests-Results-waiting-mob.webp` | Pentest Level 3 on mobile, "Waiting for results…" state, pink grid background | iPhone | Full (Decision 2) |
| `Tests-waiting.webp` | Same "Waiting for results…" screen, orange grid background | iPhone | Summary |
| `Client-select-test.webp` | "Send a technical test to 3 candidates": tests grouped by area in an accordion, level dots and time | MacBook | Full (Decision 3) |
| `Client-test-results.webp` | Shortlist → Test results: candidates in columns with overall score, questions in rows with pass/fail marks, Book a meeting | MacBook | Summary, Full (Decision 4) |
| `Client-select-candidates.webp` | "Select candidates to send a test": candidate rows with rating, badges, match, test status, rate; Tech Tests Left counter and Buy more tests | Desktop monitor | Full (Decision 4) |
| `Tests-Leaderboard.webp` | Pentest leaderboard: league tabs, podium for top 3, user's own row pinned at the bottom, "Earn 1,500 more points to reach the Expert League" progress card | Desktop monitor | Full (Decision 5) |

---

<!-- SHARED HEADER (visible in both views) -->

**HIRING PLATFORM • CYBERR TECHNICAL TESTS**

# Technical Tests at Cyberr: from claimed skills to proven ones

**ROLE**
Sole Product Designer

**SCOPE**
User Research, Competitive Analysis, UI/UX Design, Usability Testing

**TEAM**
Product Manager, Machine Learning engineers, Frontend engineers

**PARTNER**
Airbus, provider of the hands-on test environment

**USERS**
Cybersecurity candidates (junior to senior) and hiring clients: recruiters, hiring managers, technical leads

[IMAGE: Tests-Tests.webp | hero | Cyberr Technical tests hub with pending tests, value banner and test categories]

**[ Summary | Full Case Study ]**

<!-- /SHARED HEADER -->

---

<!-- VIEW: SUMMARY -->

## Long Story Short

### THE WHAT
**Hands-On Skill Tests Inside a Cybersecurity Hiring Platform**

Cyberr already verified identities and certifications. I designed the layer that was missing: practical tests built with Airbus that let candidates prove what they can do, and give clients a way to act on that proof inside the projects they are hiring for.

### THE WHY
**A Test Sits Between Two People Who Want Opposite Things**

Candidates want to look strong and fear a bad result following them. Clients want the truth fast and fear a result that means nothing. Lean too far toward clients and candidates don't start; lean too far toward candidates and clients stop trusting the result. The first spec leaned strict: one attempt, results synced to the profile, no feedback.

### THE HOW

**What Research Helped Me Do**

Interviews with 6 candidates and 5 clients, plus two rounds of usability tests, turned the strict spec around. All three senior candidates would rather have no result than a weak public one, and 4 of 5 clients said they trust comparison, not a single number. [Research scripts](research-scripts.md)

**What Was the Design Direction**

Private by default, shared by intent. Results stay with the candidate until they publish them, with a retake to lower the stakes. A visible waiting state covers the hand-off to the Airbus environment. For clients, tests start from the project shortlist and end in a question-by-question comparison.

[IMAGE: Tests-Test-result.webp | pair | Candidate test result with per-question breakdown, Retake test and Publish on my profile]
[IMAGE: Tests-waiting.webp | pair | Mobile test screen in the "Waiting for results" state]

### THE WHY NOT
**No Public Scores by Default, No Hidden Weak Results, No Single Number**

Public by default would have pushed the most experienced people out and left a leaderboard full of beginners. Auto-hiding weak results felt safe, but clients would see only good scores and trust none of them. A ranked list by score reduced people to the one number clients said they didn't believe.

---

## The Biggest Shift

**From a score you have to trust to a comparison you can act on.**

**BEFORE REDESIGN**
Skills were self-reported. Clients trusted CVs or ran their own screening outside Cyberr, and a strong candidate looked the same on paper as an average one.

**AFTER REDESIGN**
Clients send one test to their shortlist in three steps and see every candidate on the same questions, pass or fail, with Book a meeting right in the header. Candidates decide when their own results become public.

[IMAGE: Client-test-results.webp | full | Client view comparing three candidates question by question with pass and fail marks]

---

## Business Value

Turned an Airbus partnership into a product line and gave Cyberr a layer of trust general job boards don't have. Exact numbers are under NDA.

**TRUST LAYERS**
**3**
Identity, certifications and now practical skills, all verified on one platform.

**CLIENT DEMAND**
**5 of 5**
Clients wanted to test the shortlist they already had, so Send test lives inside the project.

<!-- /VIEW: SUMMARY -->

---

<!-- VIEW: FULL -->

In cybersecurity hiring, everyone says they're good. I designed the feature that lets candidates prove it, and gives clients a way to act on that proof. The hard part wasn't the screens. It was making a test feel safe enough for candidates to take, and credible enough for clients to trust.

## Context

[Cyberr](https://cyberr.ai/about-us) is a hiring platform and professional network built only for cybersecurity. It had already solved two layers of trust: identities were verified, and certifications were validated via Credly. Clients could search talent, use AI matching, build shortlists and hire directly.

But a verified identity and a valid certificate still say nothing about whether a person can find and exploit a misconfigured service under time pressure. That was the layer missing. Clients kept running their own technical screening outside the platform, and every good candidate looked the same on paper as an average one.

A partnership with Airbus gave us realistic, hands-on missions in a real attack environment. My job was to turn that into a product people on both sides would actually use.

## The tension

A test sits between two people who want opposite things from it.

|  | The candidate | The client |
| --- | --- | --- |
| Wants | To look strong and get noticed | To see the truth, fast |
| Fears | A bad result following them forever | A result that can be gamed or means nothing |
| Needs from the design | Safety and control | Transparency and comparability |

If we lean too far toward the client, candidates don't start. If we lean too far toward the candidate, the result becomes marketing, and clients stop trusting it. A test nobody takes and a result nobody trusts fail in the same way: the feature dies.

The first spec leaned toward strictness: one attempt per test, results synced to the profile, no detailed feedback. It was clean from an engineering point of view, but it assumed candidates would accept high stakes with no control. I wasn't sure they would, so before designing anything I wanted to hear from both sides.

## What the market taught us

The skills gap in security is about quality, not just headcount: in 2024 ISC2 estimated a shortfall of about 4.8M professionals, and 90% of respondents reported skills gaps on their teams ([ISC2](https://www.isc2.org/Insights/2024/10/ISC2-2024-Cybersecurity-Workforce-Study)). Employers need a better signal, and several products already try to give one.

Looking at them, I saw two camps. **Training platforms** like [Hack The Box](https://www.hackthebox.com/business/talent-search), [TryHackMe](https://help.tryhackme.com/en/articles/10517530-tryhackme-leagues) and [Root-Me PRO](https://pro.root-me.org/?page=sommaire&lang=en) are great at motivation, with ranks, leagues and streaks. But their scores mostly measure how active you are, and hiring is a side feature. **Assessment tools** like HackerRank and [TestGorilla](https://www.testgorilla.com/blog/how-assess-cybersecurity-skills/) live inside the hiring process, but their results belong to one employer. Candidates take a new test for every application, and the tests lean toward knowledge checks rather than hands-on work.

That gave me three principles to design by:

1. **Borrow the motivation, not the noise.** Gamification should pull candidates in, but the result must reflect skill, not grinding.
2. **The result belongs to the candidate.** It should be portable across employers, and the candidate decides when it's shown.
3. **Tests live where hiring happens.** For clients, a test is useful only inside the project they are hiring for, next to the people they are considering.

## Listening to both sides

I ran discovery interviews with 6 candidates (half junior and mid-level, half senior) and 5 clients (recruiters, hiring managers and a technical lead). I split candidates by seniority on purpose: I expected juniors and seniors to feel very differently about being tested, and they did. Later, two rounds of moderated usability tests on Figma prototypes, with 5 participants per group each round, checked whether the design actually solved what we heard.

### How the sessions were set up

| Session | Format | What it covered |
| --- | --- | --- |
| Candidate interview | 45 min, remote | How they prove skills today, how they feel about being tested and ranked, what they expect after a test on an external platform |
| Client interview | 45 min, remote | How they screen technical skills today, which signals they trust, how they'd compare candidates and who should pay for a test |
| Candidate usability test | 40 min, Figma prototype, think-aloud | 8 tasks, from finding a test to understanding what it takes to reach the next league |
| Client usability test | 30 min, Figma prototype, think-aloud | 6 tasks, from sending a test from the shortlist to booking a meeting with the strongest candidate |

Every usability task had a success criterion and an ease rating (SEQ, 1 to 7); candidate sessions ended with a SUS questionnaire. Issues were rated by severity and compared between rounds. One interview question did most of the work with clients: *"A candidate scored 70% on a practical pentest. What does that tell you?"* Almost nobody could answer without asking what exactly the person got wrong.

[Research scripts](research-scripts.md): recruiting criteria, all four scripts and usability tasks.

### What survived the synthesis

After each round I clustered notes on an affinity map and kept only patterns that came up with at least three people. Here is what survived, and what it changed.

| What we learned | Where it came from | What it changed in the design |
| --- | --- | --- |
| Senior candidates would rather have no result than a weak public one | 3 of 3 senior interviews | Results are private by default; publishing is the candidate's choice |
| Candidates postpone tests when the effort is unclear | 5 of 6 candidate interviews | Level, time and topics are visible on every card; a details panel before starting |
| Leaving the platform for the test environment creates doubt: did it save, when will I know? | Interviews, confirmed in usability round 1 | A Pending tests block that tracks every active test and its deadline |
| Juniors see tests as a way to stand out without experience | 3 of 3 junior interviews | Leaderboard and leagues to reward progress and make strong juniors visible |
| Clients don't trust a single number; they trust comparison | 4 of 5 client interviews | A side-by-side view of candidates on the same questions |
| Clients already have a shortlist and want to test those exact people | 5 of 5 client interviews | Send test starts from the project shortlist, not from a separate catalog |
| Clients want to know what candidates will face before paying | Usability round 1 | Test details with the full question list, available before sending |

The insight that reframed the project came from a senior pentester. Asked how he would feel about a public score, he said he'd simply never take the test. That one answer turned the first spec's strict model upside down: if the most experienced people opt out, the leaderboard fills with beginners, and clients learn to ignore it.

## Five decisions that shaped the product

### 1. Private by default, shared by intent

The central question was who sees a result, and when. We considered three models:

- **Public by default**, as in the first spec. This gives maximum transparency, but research told us senior candidates would simply not start.
- **Auto-hide weak results** below a threshold. This feels safe, but clients would see only good scores and stop trusting all of them.
- **Private by default, with explicit sharing.** This is what we chose.

The final model has two contexts. A test a candidate takes on their own stays private until they press **Publish on my profile**. A test a client sends is shared with that client by design, because the candidate accepts it as part of an application. Candidates get control where it matters for reputation; clients get unfiltered results where it matters for hiring. **Retake test** lowers the stakes even further: a first attempt is practice, not a verdict.

[IMAGE: Tests-Test-result.webp | full | Candidate test result with points, correct answers, time spent, per-question breakdown, Retake test and Publish on my profile]

### 2. Designing the in-between

The tests run in the Airbus environment, not in Cyberr. That gap is where trust leaks: users finish, close the tab, and don't know if anything happened. An email alone felt too passive, and a status buried in the test card was too easy to miss.

I made the waiting state a first-class part of the page. **Pending tests** sit at the top of the hub: each card shows the test, the role and company it came from, the time left with a progress bar, and one action, **Go to test**. Results sync back automatically, so the block quietly turns into a result. Honestly, this was the least glamorous screen in the project, and probably the one that did the most for completion.

<!-- The desktop Pending tests block is already shown in the hero (Tests-Tests.webp). Here show the mobile waiting state. -->
[IMAGE: Tests-Results-waiting-mob.webp | full | Mobile test screen in the "Waiting for results" state after returning from the Airbus environment]

### 3. Effort you can see before you commit

Candidates postponed tests when they couldn't estimate the effort, so every card answers three questions at a glance: how hard (a level scale), how long (time) and what you get (points). A details panel before **Start mission** explains the environment and the topics covered. The pattern repeats on the client side: a client sees the same details, plus a **Questions** tab, before sending a test to anyone.

[IMAGE: Client-select-test.webp | full | Client picks a test from areas of cybersecurity, each with a level scale and duration]

### 4. From a number to a decision

For clients, the score itself was never the product; the decision was. We explored a ranked list of candidates by score and profile cards with a score badge. Both reduced people to one number, which is exactly what clients said they didn't trust.

The final **Test results** view is a matrix: candidates in columns with their overall score, questions in rows with a clear pass or fail mark for each. A recruiter instantly sees that two candidates with similar totals failed completely different topics. Each test has its own tab, and **Book a meeting** sits right in the header, so the comparison ends with an action, not a spreadsheet.

[IMAGE: Client-test-results.webp | full | Test results matrix comparing three candidates question by question, with Book a meeting in the header]

Getting there had to be just as direct. **Send test** lives in the project's shortlist and opens a three-step flow: select candidates, pick a test, send. A **Tech Tests Left** counter and an inline **Buy more tests** panel mean running out of tests never breaks the flow.

[IMAGE: Client-select-candidates.webp | full | Step 1 of Send test: selecting candidates from the shortlist, with Tech Tests Left counter and Buy more tests]

### 5. Motivation without noise

We wanted juniors to have a reason to come back, without turning the leaderboard into a points race. Leagues are based on points from validated tests, not on weekly activity. The user's own row is always pinned at the bottom of the table, even far down the list, and a progress card turns a distant rank into a concrete next goal: how many points to the next league.

[IMAGE: Tests-Leaderboard.webp | full | Leaderboard with league tabs, podium, the user's pinned row and a progress card to the next league]

## What usability testing changed

The first round of usability tests didn't challenge the big decisions, but it exposed the gaps between them. Most issues were about clarity at moments of uncertainty, the same theme as the research.

| What we saw in round 1 | What we changed |
| --- | --- |
| Several candidates read the dot scale as a rating, not a difficulty | Added a "Level" label next to the dots and kept the scale identical on every screen |
| Candidates weren't sure whether a finished result was already public | A private state by default and a single, explicit **Publish on my profile** action |
| Clients looked for a way to test candidates in the Candidates tab, not in a separate section | **Send test** moved into the project shortlist, where clients already make decisions |
| Clients hesitated to send a test they couldn't preview | A **Questions** tab in the test details, available before sending |
| Running out of tests mid-flow sent clients to a separate pricing page | Tests left are visible on the first step, and buying more opens in a side panel |
| Clients compared only the overall percentage and missed the detail | Per-question marks made high-contrast, with overall scores moved into the column headers |

In round 2, every candidate found their pending test and understood their result's visibility without help. Clients completed the send-a-test flow without help, and most went straight to the per-question view when asked who did best.

## The outcome

Technical Tests shipped to production. Exact numbers are under NDA, but the shape of the result is clear:

- **A new layer of trust.** Cyberr now verifies identity, certifications and practical skills, which no general job board offers.
- **Screening moved inside the platform.** Clients test their shortlist within a project and compare candidates before booking interviews, instead of running separate processes.
- **A new revenue stream.** Paid tests for clients and candidates turned an Airbus partnership into a product line.

### What we measure

I worked with the PM to define success as a funnel, not a single number, so the team can see where trust breaks:

| Side | Metric | What it tells us |
| --- | --- | --- |
| Candidates | Test start rate from the hub | Is starting a test perceived as safe and worth the time? |
| Candidates | Completion rate after leaving for the test environment | Does the hand-off work? |
| Candidates | Publish rate of finished results | Do candidates believe results help them? |
| Clients | Projects where a test was sent | Is testing part of the hiring flow? |
| Clients | Interviews booked from Test results | Does comparison lead to decisions? |
| Business | Repeat test purchases | Do clients see enough value to pay again? |

## What I learned

**Trust is a two-sided design problem.** I started by designing a feature for candidates and ended up designing a contract between two people. Every decision had to work for both, and the best ones, like private by default and shared by intent, gave each side what it needed without taking it from the other.

**The quietest screens carry the most weight.** A waiting state rarely gets design attention, yet in a flow that leaves the platform, it is the moment that decides whether people come back. The Pending tests block did more for completion than any of the more visible screens.

**A number is not an insight.** Clients didn't want a better score; they wanted an easier decision. Designing for the decision, not the data, changed the results view completely.

**Push back on the spec with evidence, not opinion.** The first spec wasn't wrong, it was untested. One clear pattern from seniors was enough to change the core model, because it came with a real consequence for the business: an empty leaderboard.

<!-- /VIEW: FULL -->
