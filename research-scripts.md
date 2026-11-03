<!--
NOTES FOR LAYOUT (Claude Code):
- Separate page linked from the case study as `research-scripts.md`. Same visual style as the case page.
- Put a "← Back to case study" link above the title; it opens the case page with the Full Case Study view selected.
- No Summary / Full Case Study toggle on this page. No images.
-->

[← Back to case study](cyberr-technical-tests-case-study.md)

# Research scripts

Scripts for discovery interviews and moderated usability tests on Technical Tests, with candidates and clients. Sample sizes and findings are in the Listening to both sides section of the case study.

## Recruiting criteria

| Group | Screener | Quota |
| --- | --- | --- |
| Candidates, junior/mid | Early-career cybersecurity professionals active on Cyberr | 3 interviews, 3 tests |
| Candidates, senior | Experienced professionals with certifications on their profile | 3 interviews, 2 tests |
| Clients | Recruiters and hiring managers who recently hired for a cybersecurity role | 5 interviews, 5 tests |

Mix freelance and permanent candidates in each group.

## 1. Candidate discovery interview (45 min)

**Intro.** Thank you for joining. We're exploring how cybersecurity professionals show their skills to employers. There are no right or wrong answers; we're testing ideas, not you. May I record the session for notes only?

**Background**

1. Tell me about your current role and what you work on day to day.
2. What kind of work are you looking for right now?

**Proving skills today**

3. Tell me about the last time an employer asked you to prove your technical skills. What happened?
4. How did you feel about that test? What made it fair or unfair?
5. Which certifications or practice platforms do you mention to employers? Do you think they look at them?
6. What does an employer miss about you when they read your CV?

**Attitude to testing**

7. Imagine a practical test on Cyberr whose results employers can see. What's your first reaction?
8. What would make you start such a test today? What would make you postpone it?
9. What do you need to know before you commit your time to a test?
10. How would you feel if your result were lower than expected? Who should be able to see it?
11. How do you feel about leaderboards and rankings in your field?

**After the test**

12. You've finished a test on an external platform. What do you expect to happen next?
13. What would you like to see in your results? What would you do with them?

**Wrap-up.** If you had a magic wand, what would make proving your skills easier? Is there anything we didn't ask that we should have?

## 2. Client discovery interview (45 min)

**Background**

1. Which cybersecurity roles or projects have you hired for recently?
2. Walk me through your process from shortlist to offer.

**Screening today**

3. Tell me about the last time a hire turned out weaker than expected. What did you miss?
4. How do you check technical skills today? Who does it, and how long does it take?
5. Which signals do you trust most: certifications, experience, referrals, test results? Why?
6. Have you used any testing platforms? What worked and what didn't?

**Value of a test result**

7. A candidate scored 70% on a practical pentest. What does that tell you? What else would you need?
8. How do you choose between two candidates with similar experience?
9. At which point of your process would you send a test? To whom?
10. How would you like to compare candidates after a test?
11. How much would you pay for a test, and who should pay: you or the candidate?

**Wrap-up.** What would make you trust a test result enough to shorten your own technical interview? What would make you ignore it?

## 3. Candidate usability test (40 min, Figma prototype)

**Setup.** Please think out loud. If you get stuck, tell me what you expected to happen. You can't break anything.

**Scenario.** You're looking for new projects and want employers to see your practical skills.

| # | Task | Success criteria | Watch for |
| --- | --- | --- | --- |
| 1 | Find where you can take a technical test | Opens Technical tests from the sidebar | Hesitation between other menu items |
| 2 | Choose a test that fits your level in your area | Opens an area and picks a level, explaining why | Whether the level scale and time are understood |
| 3 | Find out what you'll need to do in the test | Opens details and names the environment and topics | Trust in the instructions; length of the panel |
| 4 | Start the test | Presses Start mission and understands they leave Cyberr | Expectations about coming back |
| 5 | You've come back. Check where your test stands | Finds Pending tests and reads the time left | What they think "pending" means |
| 6 | Review your result and decide whether employers should see it | Reads the breakdown and finds Publish on my profile | Fear of publishing; meaning of the numbers |
| 7 | Find out how you rank against others | Opens the leaderboard and finds their own row | Reaction to a low rank |
| 8 | Find out what you need for the next league | Reads the progress card | Whether the goal feels reachable |

**After each task:** "How easy or hard was that, from 1 (very hard) to 7 (very easy)?" (SEQ)

**Debrief.** What was the most confusing moment? Would you take this test for real? What would stop you? Finish with the SUS questionnaire.

## 4. Client usability test (30 min, Figma prototype)

**Scenario.** You're hiring a pentester for a project and already have a shortlist.

| # | Task | Success criteria | Watch for |
| --- | --- | --- | --- |
| 1 | Send a technical test to candidates from your shortlist | Finds Send test in the project's shortlist | Where they expect the action to be |
| 2 | Choose who should get the test | Selects candidates using the list data | Which columns they rely on |
| 3 | Pick a test that fits the project | Opens an area, checks details and the Questions tab, selects a test | Whether they understand what candidates will face |
| 4 | You've run out of tests. Get more | Finds Buy more tests and completes the purchase panel | Clarity of who pays and what's included |
| 5 | Decide which candidate did best | Opens Test results and compares candidates per question | Whether they read per-question marks or just the overall score |
| 6 | Invite the strongest candidate to an interview | Uses Book a meeting | Whether this feels like the natural next step |

**Debrief.** Would you trust this result in your hiring decision? What's missing?

## Metrics to report

- Task success rate per task
- Time on task for sending a test and finding a result
- SEQ per task and SUS overall
- Usability issues by severity, round 1 vs round 2
