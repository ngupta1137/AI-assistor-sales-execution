Add a "Sales Companion" enabler to AI Assistor Sales Execution, across all industry packs and country packs. Read PRD.md and CLAUDE.md first. Where this prompt and PRD.md differ, tell me, then follow this prompt for the Companion only.

## What Sales Companion is
Sales Companion is the field enabler for the product: one place where a rep and a manager meet the five generic capabilities (Account Potential, Gap Detection, Action Ranking, Visit Planning, Order and Proposal Suggestion) together with the admin and learning tools they use every day, instead of a dozen separate tools.

Design rule: the Companion consumes outputs of the existing capabilities. It must not build a second route plan, visit brief or order builder. Where a screen exists (Today, Visit brief, Route plan, Order or proposal builder), the Companion links to it and shows its output. Build new only what no capability covers.

It must work for every industry and country, so every label uses vocabulary tokens ({account}, {accounts}, {contact}, {rep}, {offering}, {order}, {visit}) and every number, date and distance uses the country pack. No industry noun is hard-coded in any screen.

## Scope

### P0
1. **Companion hub**: new entry in the main navigation for rep and manager personas. Three pillars as cards: Growth (plan and sell), Productivity (personal and workforce), Learning. A "Powered by" row marks capabilities that use a capability output. Label "Sample data" and "Concept".
2. **Growth: plan**
   - Journey planning: today's route from the existing route plan, plus a safety strip (weather, traffic, fatigue alerts as sample data; fatigue prompt after a set drive time).
   - Pre-call brief card: links to the visit brief, plus last actions, open issues and a sentiment tag.
   - Voice debrief: microphone button using the Web Speech API where supported, with a typed fallback and a "Play sample dictation" button so it works in any demo. A rule-based parser turns the text into structured fields (outcome, issues, follow-ups, {order} intent) for the rep to confirm. Say it is a simulation.
   - Live resource planning (manager): compare an upcoming activation plan with team availability by week, highlight gaps, suggest internal or third-party cover from sample data.
3. **Growth: sell**
   - Summarised call plan per {account}.
   - Dynamic pitch: talking points from the {account}'s sample performance, current offers and trend, with the source of each point shown.
   - Local overlay: ranked list or simple map of nearby {accounts} and what is performing there.
   - Customer value story: template narrative in the {account}'s terms, with the data used shown.
   - Customer self-service view: a clearly separate mock-up of the {account} browsing, ordering and tracking an activation, labelled as a mock-up.
4. **Productivity**: leave (apply, track, manager approval), expense claims (photo preview mock, category, local currency, automatic policy check), HR and payroll (sample pay slips and documents, no real pay information).
5. **Learning**: learning chatbot (rule-based, reuses the assistant engine from `prompts/add-assistant-v2.md` if it is merged; otherwise a small standalone rule engine in `src/core/companion/`), knowledge base search, skill certification tracker with renewals due in 30 days flagged.

### P1 (after P0 passes)
Wellbeing hub, complaint and feedback portal, travel planner with mileage log (distance unit from the country pack), onboarding checklist with e-signature, call fundamentals library, manager view of team learning progress.

## Pack changes
Extend the pack schema and the validator with these fields, and write distinct content for all 10 industries:

Industry pack `companion`:
- `roles`: the rep and manager role titles in this industry's words.
- `expenseCategories`: 5 to 6 categories typical for this industry.
- `certifications`: 4 to 6 required trainings or accreditations in this industry, with renewal cycle. Examples: pharma and meddevices compliance and product training with no clinical claims in the content; financial services licensing and conduct training; agri label and safe-use training; others as fits.
- `learningModules`: 8 to 10 modules and `knowledge`: 10 to 12 how-to entries and FAQs, in practitioner language.
- `pitchTemplates` and `valueStoryTemplates`: 3 each, using tokens.
- `resourcePlans`: 2 sample activations for the resource planning view.
- `guardrails`: how regulated limits apply here (for example the value story and pitch never make clinical, credit, pricing or off-label claims).

Country pack additions: `publicHolidays` (6 to 8 sample), `leaveTypes` (3 to 4 generic types), `expenseLimits` (sample, in local currency), `mileageUnit` and `payslipLabel` (generic wording, no legal terms).

## Rules (same as CLAUDE.md)
Fictional data only; fictional employees from country name pools. Plain language, short sentences, no em dashes, no hype words, no performance claims, label sample data. HR content is sample only.

## Tests
- Extend the Playwright suite: for every industry x country x persona combination, open every Companion screen, complete the voice debrief sample flow, submit a leave request and an expense claim, approve both as manager, and fail on any console error, any leftover `{token}` or `undefined`, or any wrong-industry noun (for example "store" in pharma or financial services).
- Guardrail tests for pharma, meddevices, finserv and agri: the pitch, value story and chatbot never produce a restricted claim; asking for one gets a refusal.
- Pack validator test: every industry and country pack has the new fields, with the minimum counts above.
- `npm test` and `npm run build` must pass. Rebuild and commit `docs/index.html`.

## Git
Work on a branch, commit after each step, push after each commit, never force-push, open a pull request into `main` titled "Add Sales Companion enabler". Steps:
a. Schema, validator, Companion hub, one industry (consumer goods) and one country (US), Growth: plan
b. Growth: sell and Productivity
c. Learning
d. Content for the other 9 industries and 7 countries
e. Tests, README update (how to add Companion content to a pack), PRD update (add the Companion to scope and requirements), rebuild `docs/index.html`

## First reply
Give me a short plan first: file list, the new pack schema (JSDoc), the screen list and where each links to existing screens, and the test approach. Then proceed without waiting. At the end give me what is done, test results, known gaps, the PR link, and confirm `git status` is clean.
