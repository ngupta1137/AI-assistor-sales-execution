# AI Assistor Sales Execution

An AI field sales app that tells every field rep which customers to visit, what to do first in each visit and what to sell or order, and shows what happened. One product, configured by an industry pack and a country pack.

- Product requirements: [PRD.md](PRD.md) (source of truth)
- Build brief: [prompts/build-prototype-v1.md](prompts/build-prototype-v1.md)
- Standing rules for AI coding sessions: [CLAUDE.md](CLAUDE.md)

**Live demo:** https://ai-assistor-sales-execution.vercel.app (Vercel, deploys from `main`).

**All data is fictional sample data.** Names, places, products and numbers are generated. Nothing in the prototype describes a real company or a real result.

## Status & Architectural Taxonomy

This project strictly adheres to honest enterprise architecture labeling:

| Tier | Component / Capability | Implementation State | Verification Method |
|---|---|---|---|
| **BUILT** | 5-Decision Constraint Graph (Coverage, Routing, Action, Order, Outcome) | Built & Interactive | In-browser deterministic solver with live recompute trace |
| **BUILT** | Offline Local Mutation Engine & Storage Durability | Built & Interactive | IndexedDB + navigator.storage.persist health check |
| **BUILT** | Rapid In-Visit Blitz Mode (45s) & Account Camera Exemption | Built & Interactive | Client-side execution with KAM-governed policy verification |
| **BUILT** | RMA Return Claim Logging & Substitute Selector | Built & Interactive | Segregation of duties: AR approval queue, contract parity |
| **BUILT** | Supervisory Anti-Gaming & Works Council Safe Mode | Built & Interactive | Anomaly queue, BetrVG 87 rep telemetry anonymization |
| **BUILT** | 20 Industry Packs x 11 Country Packs (220 Permutations) | Built & Interactive | 258,000+ automated static assertions |
| **DESIGNED** | SAP S/4HANA Idempotent Middleware Dedupe Contract | Architecture Spec | BAPI_SALESORDER_CREATEFROMDAT2 + UUID token spec |
| **DESIGNED** | Enterprise SSO & RBAC (Entra ID, Okta SAML 2.0, Ping) | Architecture Spec | OpenID Connect / SAML 2.0 federation design |
| **DESIGNED** | Offline Compensating Flows (Oversell, Credit Hold, Price Drift) | Architecture Spec | Replay table + state machine reconciliation design |
| **DESIGNED** | Pre-Registered Causal Difference-in-Differences Model | Methodology Spec | Matched-territory synthetic control protocol |
| **PROPOSED** | SCIM 2.0 Automated User Provisioning & Cloud KMS (CMEK) | Target Cloud Topology | Target enterprise Kubernetes cloud infrastructure |
| **PROPOSED** | Third-Party SOC 2 Type II / ISO 27001 Examination | Target Audit Program | Formal examination program for enterprise commercialization |

**Positioning Strategy:** AI Assistor is positioned as a **Closed-Loop Decision & Outcome Overlay** that connects to existing CRMs (Salesforce CG Cloud, StayinFront, Veeva) and ERPs (SAP, Microsoft Dynamics), providing constraint-coupled execution intelligence and capturing structured override signals without requiring high-risk system replacement.

Scoring is rule-based on generated data. The "agents" are deterministic rules, not machine learning models.

## Run it

Requires Node 18 or later.

```bash
npm install
```

```bash
npm run dev
```

Then open `http://localhost:5173/?industry=cpg&country=US&persona=rep`. The dev server serves ES modules straight from `src/`.

```bash
npm run build
```

This writes one self-contained file, `docs/index.html` (about 280 KB, no external requests). You can email it or open it from disk with a double click. It works over `file://`.

```bash
npm test
```

This builds, then runs the static checks and the browser checks. The browser checks need Chromium for Playwright. On a new machine, run `npx playwright install chromium` once.

## URL patterns

| URL | Opens |
|---|---|
| `?industry=pharma&country=IN&persona=rep` | Pharma, India, field rep, Today screen |
| `?industry=building&country=UK&persona=manager` | Paints and building materials, UK, manager view |
| `?industry=finserv&country=AE&persona=admin` | Financial services, UAE, configuration screen |
| `...&prepared=Northwind%20Health&color=1d4ed8` | Adds "Prepared for Northwind Health" and an accent colour |
| `...#/brief/A03` | Goes straight to a screen (hash routes below) |
| no parameters | Setup screen |

- **Industries:** `cpg`, `pharma`, `meddevices`, `beverages`, `building` (also `paints`), `agri`, `telecom`, `electronics`, `autoparts`, `finserv` (also `fs`), `foodservice`, `industrial`, `apparel`, `energy`, `insurance`, `animalhealth`, `hygiene`, `logistics`, `education`, `packaging`.
- **Countries:** `US`, `UK` (also `GB`), `DE`, `FR`, `AU`, `NZ`, `IN`, `BR`, `ID`, `MX`, `AE` (also `UAE`). Case does not matter. ANZ is two packs, `AU` and `NZ`, because the two have different currencies, holidays and cities.
- **Personas:** `rep`, `manager`, `admin`.
- **Hash routes:** `#/today`, `#/brief/<id>`, `#/account/<id>`, `#/action/<actionId>`, `#/order/<id>`, `#/complete/<id>`, `#/route`, `#/ask`, `#/manager`, `#/agents`, `#/config`, `#/problems`, `#/setup`.
- An unknown industry or country opens the setup screen with a short note. It does not show an error.
- Any accent colour is darkened until white text on it reaches 4.5:1 contrast.

**Presenter menu.** Press Shift+D, or long press the logo on a phone or tablet. From there you can switch industry, country or persona, set "Prepared for", copy the share link, show presenter notes beside the phone frame (desktop only) and reset the demo. Switching never logs you out. Decisions are kept per industry and country until you press Reset.

## The assistant

Every screen has an **Ask AI** button (bottom right, above the action bar). On Setup it is **About this demo** with three questions. It opens a bottom sheet that keeps its conversation as you move between screens. The Ask AI page is the full-page view of the same conversation.

- **Context.** It receives `{screen, persona, accountId?, actionId?, visitId?, orderId?, filters?}` on every open, and its suggested questions change with the screen and the persona (4 to 6 each, from the pack's `assistantContext`).
- **Grounded.** Every answer is built from the generated data and the live session, and carries a "Based on" line and links back into the app. If you approved, adjusted or overrode an item, the next answer reflects it. Numbers match what the screen shows.
- **Honest.** It is rule-based, and the header says "Sample data. Answers come from configured rules and this scenario's data, not a live model." If it has no answer it says so and lists what it can answer on that screen. It never invents one.
- **Guardrails.** Each pack lists out-of-scope question patterns (`assistantRefusals`) tied to its guardrails: clinical, dosing and claims in pharma and devices; price, rate and credit in financial services; label-only advice in agri; and so on. A refusal gives the allowed alternative and a "Why can't you answer that?" panel naming the guardrail. Refusals and overrides are written to the audit log with persona and screen. Promises of results are refused in every pack.
- **Actions.** It can open a screen ("show me the customer with the biggest gap") or open the builder with the suggested lines ("draft the order for this customer"). It never approves, sends or overrides for you.
- **Presenter.** Shift+D has "Assistant: on or off" and "Reset chat". `?assistant=off` hides it for a clean screenshot. Switching industry, country or persona starts a new conversation.

Code is in `src/core/assistant/`: `engine.js` (guardrail check, normalise the question into generic words, score intents with the screen as context, run a handler, apply vocabulary and spelling), `intents.js` (the catalogue), `handlers.js` (one handler per intent), `router.js` (the context object), `guard.js` (refusals), `provider.js` (adapter) and `ui.js` (launcher, sheet, focus).

### Add assistant content to a new pack

1. Create `src/packs/industries/<id>.assistant.js` and spread it into the pack (`...assistant`), as the other packs do.
2. `assistantContext`: build it with `withBase({...})` from `src/packs/assistant-base.js`. The shared questions use vocabulary tokens, so they read in your words. Add your own industry questions per screen. Each screen and persona needs 4 to 6 in total. Required: rep on today, brief, account, action, order, complete, route, agents, config and problems; manager on manager, agents, config and problems.
3. Each question has an `intent`. Use an id from `src/core/assistant/intents.js` (for example `order.blocking`), or `answer:<key>` to answer with your own text from `assistantAnswers`.
4. `assistantAnswers`: required keys `talkToContact`, `goodVisit` and `guardrailWhy`, plus one key for every `answer:<key>` you used. Tokens: the vocabulary tokens plus `{name}`, `{person}`, `{area}`, `{city}` of the account in focus.
5. `assistantRefusals`: 4 to 6 entries `{id, guardrail, patterns, refusal, allowed}`. `guardrail` is the id of one of your pack's guardrails (`all1`, `gap1`, `order1`, `planner1`). Patterns are lowercase words or phrases of 4 or more characters, matched from the start of a word, so `licen` covers licence and license. Write patterns that do not appear in your own suggested questions: the tests fail if a suggestion trips a refusal.
6. Run `npm test`. The validator names anything missing. The engine test answers every suggested question on every screen for every persona and country and fails on an empty answer, a missing "Based on" line, a leftover token or a wrong-industry word.

### Turning on a live model (off by default)

Not recommended for a public demo. The adapter exists for private experiments only.

- The live provider is **compiled out** of the shipped build. `docs/index.html` contains none of its code (the tests check this).
- To try it: build with `ASSISTANT_LIVE=1 npm run build`, then open the page with `?live=https://your-endpoint`. Only `https://` endpoints are accepted.
- The page sends only the question, the screen, persona, industry and country, and the rule-based answer built from generated sample data. It sends no API key. The endpoint holds the key, so keep the key on a server you control, never in this repository or the page.
- Guardrail refusals run before the call and on the reply, and the reply is shown as a model answer. If the endpoint fails, the rule-based answer is shown instead.

## Sales Companion (concept)

The Companion is the field enabler: one place where a rep and a manager meet the five capabilities together with the admin and learning tools they use every day. It is a new tab (Companion) for the rep and the manager. Problems we solve is now reached from Config.

**Design rule.** The Companion consumes outputs of the existing capabilities and links to their screens. It does not build a second route plan, visit brief or order builder. Each hub row has a "Powered by" row naming the capability whose output it shows.

| Pillar | Screens | Uses |
|---|---|---|
| Growth: plan | Journey planning with a safety strip (weather, traffic, a fatigue prompt after 120 minutes of driving, all sample data); pre-call brief card with a sentiment tag; voice debrief; live resource planning (manager) | The Visit Planner route, gaps and ranked actions |
| Growth: sell | Call plan; dynamic pitch (each point shows its source; your own point is checked); local overlay (schematic map and ranked list); customer value story with the data used; customer self-service mock-up | Ranked actions, KPIs, the order draft, potential |
| Productivity | Leave (apply, track, manager approval); expense claims (receipt photo mock, local currency, automatic policy check, manager approval); HR and pay (sample pay slips and documents) | Country pack |
| Learning | Certification tracker (renewals due within 30 days and overdue are flagged); learning modules; knowledge base search; a rule-based chatbot; onboarding checklist with a demo e-signature; call fundamentals library; team learning progress for managers | Assistant guard and normaliser |
| Productivity (P1) | Wellbeing hub (daily check-in, tips, anonymous team counts for managers; not medical advice); complaint and feedback portal (anonymous option, manager acknowledges); travel planner with a mileage log in the country's unit | Route plan, country pack |

- **Everything is sample data.** Pay slip amounts are generated and labelled as samples. Nothing is real HR or pay information. The hub and every screen say "Sample data", and the hub says "Concept".
- **The voice debrief is a simulation.** A rule-based parser turns text into outcome, issues, follow-ups and order intent for the rep to confirm. The microphone button appears only where the browser supports speech recognition, and it never starts by itself. Browsers may send microphone audio to the browser maker, and the screen says so. Typing and "Play sample dictation" work everywhere.
- **Approvals are real inside the demo.** The rep submits leave or an expense, switches persona (Shift+D), and the manager approves or rejects. The rep sees the result. Every step goes to the audit log.
- **Restricted claims.** Each pack lists blocked claim patterns (`companion.guardrails`). The pitch, value story and knowledge text may never contain one. A request for one, typed into the pitch or asked of the chatbot, is refused with the guardrail named and an audit entry. Tests fail if authored text contains a blocked pattern.
- **Customer self-service** is a clearly separate mock-up of what the account could browse, order and track. It is not a customer portal and it writes nothing.

### Add Companion content to a new pack

1. Create `src/packs/industries/<id>.companion.js` exporting `{ companion: {...} }` and spread it into the pack (`...companion`), as the other packs do.
2. Fill in every field (the validator names what is missing):
   - `roles`: the rep and manager titles.
   - `expenseCategories`: 5 to 6, each with a `limitClass` (meals, travel, lodging or other) that picks the country's sample limit.
   - `certifications`: 4 to 6 with `cycleMonths`.
   - `learningModules`: 8 to 10.
   - `knowledge`: 10 to 12 how-to entries.
   - `pitchTemplates`: exactly 3, each one talking point. Tokens: the vocabulary tokens plus `{name} {person} {kpi} {kpiValue} {kpiTarget} {offer} {trend} {event} {eventDays}`. `uses` lists what each reads, and is shown as the source.
   - `valueStoryTemplates`: exactly 3. Tokens: `{name} {person} {share} {potential} {current} {whitespace} {orderCount} {trend} {offer}`. `{orders}` stays the vocabulary word.
   - `resourcePlans`: exactly 2 sample activations (`startWeek` 0 to 4, `weeks` 2 to 5, `perWeek` rep-days).
   - `guardrails`: 2 to 5, each with `blocked` patterns (lowercase, 4 or more characters, at least 3).
3. No authored text in the block may contain one of its own blocked patterns, so write "never offers special terms" and not the blocked phrase.
4. Run `npm test`. The engine test checks every pack's content, runs the debrief, leave and expense flows and asks the chatbot under every guardrail.

### Add Companion fields to a new country

In the country file add `publicHolidays` (6 to 8 `{name, monthDay}`), `leaveTypes` (3 to 4 `{id, label, days}`), `expenseLimits` (`meals`, `travel`, `lodging`, `other`, sample amounts in local currency), `mileageUnit` (`mi` or `km`), `payslipLabel` (generic wording) and `tempUnit` (`C` or `F`). Moving holidays use approximate fixed dates.

## Demo script (PRD section 14)

The same arc works in every industry. The presenter notes panel shows a version of these steps written for the selected industry.

1. **Setup.** Pick the prospect's industry and country, or open their link. Say once that it is sample data.
2. **Today.** "Here is your rep's day, ranked by value, in your currency and your cities." Point at the overnight brief banner and the territory target.
3. **Overnight brief.** Open the first brief. Approve one item. Override another with a reason and watch the counts change. Mention that nothing is sent until the rep approves.
4. **Action detail.** Show the why, the talking points and the guardrail, then capture the evidence (photo, scan, note or signature) and mark it done.
5. **Order or proposal.** Show the suggested lines with reasons. Raise one line until the approval rule triggers. In pharma, raise a sample line above two to show the block.
6. **Visit complete, then manager.** Close the visit and the next best account appears. Open Shift+D, switch to Manager, and the override is at the top of the exception queue with its reason and route.
7. **Agent controls.** Show scope, owner, authority level and the industry guardrails. Stop the Order agent and show its items paused in a brief. Resume it.
8. **How it is configured.** Show their vocabulary, actions and KPIs. Close with "This is a configuration, not a custom build."

## Project structure

```
index.html                      Dev entry (build swaps in inline CSS and JS)
src/main.js                     Starts the app
src/styles.css                  Mobile-first styles, phone frame on desktop
src/core/
  app.js                        URL config, hash router, render loop, event delegation, Shift+D, long press
  state.js                      Session state: decisions, outcomes, orders, exceptions, agent stops, audit log
  text.js                       The one text gate: vocabulary tokens, data values, UK spelling, HTML escaping
  format.js                     Money (Intl plus lakh/crore, Mio., jt), dates, distance, time
  rng.js                        Seeded generator (FNV-1a hash, Mulberry32)
  presenter.js                  Presenter menu and notes panel
  ui.js, icons.js               Shared helpers and brand-neutral line icons
  screens/*.js                  One file per screen. Each exports render(ctx, args) and its actions
src/data/generate.js            Territory, accounts, plan, briefs, orders, reps, exceptions from (industry, country)
src/packs/schema.js             JSDoc types and the pack validator
src/packs/index.js              Pack registry
src/packs/industries/*.js       One file per industry
src/packs/countries/*.js        One file per country
scripts/build.mjs               esbuild bundle, inlined into docs/index.html
scripts/dev.mjs                 Static dev server
tests/static.mjs                Fast checks, no browser
tests/e2e.mjs                   Playwright checks against the built file
```

Screens never contain industry nouns. They write `{account}`, `{contact}`, `{visit}`, `{order}` and similar tokens. `t()` in `src/core/text.js` fills those from the industry pack. Capitalised tokens (`{Account}`) give capitalised words. Source copy is US English, and `t()` converts it to UK spelling for the UK, India, Germany and the UAE.

## Add an industry pack

1. Copy the pack closest to the new industry, for example `src/packs/industries/autoparts.js`, to `src/packs/industries/<id>.js`. The id is lowercase letters and digits.
2. Set `name`, `tagline` (shown on the setup tile), `icon` (a key from `src/core/icons.js`; add an icon there if you need one) and `accent` (hex, at least 4.5:1 against white; the validator checks this).
3. Fill in `vocab`: the words for account, contact, rep, manager, KAM, offering, order and visit, singular and plural. These words replace the tokens on every screen.
4. Define 2 or 3 `segments`. Each needs a visit length, a visit style, a reference annual value in USD, opening hours, account types with name words per language (`en` is required; `pt`, `es`, `de`, `fr` and `id` are used by Brazil, Mexico, Germany, France and Indonesia), and contact roles. Mark at least one segment `key: true`; overrides there route to the KAM.
5. Add 8 to 12 `offerings` with fictional names. Set `price` to a reference USD price, `0` for no charge, or `null` when people, not the agent, set the price. Add a `kind` for special classes such as samples or contracts. Only actions that ask for that kind will talk about them.
6. Add 8 to 12 `actions`. Each needs `title`, `saw` (what the agent saw), `compared` (what it compared against), 3 to 5 `why` lines and 2 to 3 `talk` lines. Templates can use `{product} {days} {pct} {qty} {peers} {n} {weeks} {area} {city} {person} {role} {event} {eventDays} {type} {segment} {amount}` plus vocabulary tokens. Include at least one action for each agent (`planner`, `gap`, `order`) and at least 3 actions per segment.
7. Add `orderReasons` (optionally `bySegment` overrides), `orderRules` (`totalAbove`, `lineMax`, `humanPrice`, `prerequisite`, `info`), `overrideReasons` (with `route`), `outcomeReasons` (mark the ones that block), `visitNotes` (strings, or `{ text, segments }`), 4 to 6 `kpis` (the first is the territory headline; add `segments` to limit one to the segments it applies to), `guardrails`, exactly 6 `problems`, 8 to 10 `assistant` questions and answers, an 8-step `storyline`, and `forbidden` words that must never appear for this industry. A `prerequisite` rule (for example a needs review with signed consent before a loan line can be sent) names an action and its evidence type; the generator makes sure that action is in the brief whenever the order needs it.
8. Register the pack in `src/packs/index.js`: import it and add it to the `INDUSTRIES` list.
9. Run `npm test`. The validator reports anything missing. The duplicate-text check fails if you copied sentences from another pack, so rewrite them in the new industry's own words. The browser checks then open the new industry in all 8 countries.
10. Run `npm run build` and commit `docs/index.html`.

Update the count check in `tests/static.mjs` (`expected 20 industries`, and the country count) when you add one.

## Add a country pack

1. Copy the closest country, for example `src/packs/countries/MX.js`, to `src/packs/countries/<ID>.js`. The id is two capital letters.
2. Set `locale` and `currency`. `Intl.NumberFormat` must accept both; the validator tries them. Set `decimals`, and `compactUnits` for short amounts (the value is the divisor, `min` is the smallest amount shown in that unit).
3. Set `priceFactor`, the local price level against the USD reference prices. It is not an exchange rate. Set `priceStep` for currencies without small coins.
4. Set the date order and separator, clock, distance unit, `spelling` (`us` or `uk`), weekend days and average urban `speedKmh`.
5. Add 4 cities with coordinates, at least 5 areas each, a postcode pattern (`{d}` is a digit, `{L}` a letter) and a phone pattern. Use ranges reserved for fiction where they exist, otherwise mask digits.
6. Add at least 8 streets, 16 first names, 16 last names and 8 name prefixes. Set `nameLang` and `patterns` for business, institution, family and person names. Check prefixes against real chains in that country; a generic word next to "Hospital" can become a real hospital's name.
7. Add at least 5 local events with approximate dates (`dates` by year for moving holidays, `monthDay` for fixed ones) and a few `notes`.
8. Register it in `src/packs/index.js`, update the country count in `tests/static.mjs`, and add its currency and distance to the `CURRENCY` and `DIST` maps in `tests/e2e.mjs`.
9. Run `npm test`, then `npm run build`.

## Tests

`npm test` runs seven steps and fails on the first failure: build, static checks, assistant engine checks, Companion engine checks, the browser suite, the assistant browser suite and the Companion browser suite.

1. **Build** of `docs/index.html`.
2. **Static checks** (`tests/static.mjs`, about 61,000 checks, a few seconds):
   - Every pack against the schema, including accent contrast, segment-scoped KPIs and notes, and order prerequisites that can actually be met.
   - No order reason claims a signature or consent that has not been captured.
   - Every template token resolves.
   - No em or en dashes and no hype words in shipped source.
   - A blocklist of real brands, chains and companies.
   - No sentence copied between industries.
   - No industry nouns hard-coded in `src/core`.
   - US spelling in source.
   - Generation is deterministic for all 220 combinations: 24 to 30 accounts, 6 to 8 visits, 3 to 6 actions, every visit inside opening hours.
   - Country formatting: lakh and crore, comma decimals, date orders.
3. **Browser checks** (`tests/e2e.mjs`, Playwright against the built file, about 80 seconds with 4 workers). For each of the 220 combinations, the rep flow opens every brief, action, account, order and complete screen. It also:
   - Runs approve, adjust and override and checks the live counts.
   - Captures the typed evidence, including drawing a signature.
   - Triggers the order rules: approval threshold, and the sample limit block.
   - Closes the visit and switches to manager through the presenter menu, then checks the override and its note are in the exception queue.
   - Checks coaching prompts and coverage, then stops and resumes the Order agent and checks paused items and the audit log.
   - Opens config, problems, route re-plan and Ask AI.
   - Opens manager and admin direct links for all 220 combinations, and starts the demo from the setup screen for all 220.
   - Edge cases: bad links, aliases, HTML escaping of "Prepared for", the contrast guard, the same data after a reload, long press, switch time and reset.

Any console error, leftover `{token}`, `undefined` or `NaN`, or one of the pack's forbidden words (for example "store" in pharma or financial services) fails the run. `E2E_ONLY=pharma:IN npm run test:e2e` runs one combination. `E2E_WORKERS=8` runs more in parallel.

Regression checks from the October 2026 functional review are part of the suite: proposals blocked until the needs review has signed consent (F01), sample requests never shown as signed drops (F02), month actuals unchanged by estimates (F03), override notes kept through save (F04), closed visits leaving coverage gaps (F05), the stored approver named everywhere (F06), honest stopped-agent copy (F07) and done actions leaving open gaps (F08). Layout checks open every screen at 320 and 390 px wide and fail on sideways scroll or any tap target under 44 px.

**Companion checks.** `tests/companion-unit.mjs` (about 7,800 checks, no browser) validates every pack, runs the sample data, the debrief parser, the leave and expense rules with manager approval, the learning chatbot under every guardrail, and checks authored text against its own blocked patterns. `tests/companion.mjs` opens every Companion screen in all 220 combinations for the rep and the manager, and in each combination completes the voice debrief sample, submits a leave request and an expense, approves both as the manager and sees the result as the rep. It also covers a restricted claim refused in all 20 industries, the microphone fallbacks (unsupported, denied, working), flagged renewals and resource gaps cross-checked against the engine, and layout at 320 and 390 px.

**Assistant checks.** `tests/assistant-unit.mjs` answers every suggested question on every screen for every persona, industry and country without a browser (249,720 checks). `tests/assistant.mjs` (about 10 minutes with 4 workers; it uses Playwright's controlled clock for the 400 to 700 ms typing delay) opens every screen in all 220 combinations for the rep and the manager, clicks every suggested question and checks for an answer, a "Based on" line, no leftover token, no wrong-industry word and no console error. It also covers the guardrail refusals and audit entries, an answer that reflects an override, the focus trap, Escape and tap targets, navigation that never submits, the shared conversation, the presenter toggle, `?assistant=off`, the Setup questions, and that the live provider is absent from the build.

Last full run: static 193,616 checks; assistant engine 609,372; Companion engine 29,028; browser suite 220 combinations, 3 personas, 16,250 screens, 62,663 assertions; assistant suite 22,440 questions, 380,806 assertions; Companion suite 8,800 screens, 220 flows, 51,816 assertions. All passing.

## Publish on GitHub Pages

1. Merge the pull request into `main`.
2. On GitHub, open **Settings**, then **Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Set **Branch** to `main`, set the folder to `/docs`, and click **Save**.
5. After a minute or two the site is live at `https://ngupta1137.github.io/AI-assistor-sales-execution/`. Share links such as `https://ngupta1137.github.io/AI-assistor-sales-execution/?industry=pharma&country=IN&persona=rep`.

If the repository is private, GitHub Pages needs a paid plan, and the published site is public unless your organisation has Enterprise access control. Check this before sending links. `docs/.nojekyll` is already in place.

## Publish on Vercel

`vercel.json` sets the build for you: install with `npm install`, build with `npm run build`, serve the `docs` folder. Project settings in the dashboard are not needed and are overridden by this file.

1. In Vercel, choose **Add New → Project** and import `ngupta1137/AI-assistor-sales-execution`. If the repo is not listed, give the Vercel GitHub app access to it under GitHub **Settings → Applications → Vercel → Configure**.
2. Leave the Framework Preset as **Other** and click **Deploy**.
3. Every merge to `main` deploys to production. Every pull request gets a preview link.

If a build fails with "No Output Directory named public", the deployment ran without `vercel.json`. Redeploy the latest commit on `main`.

## Known gaps and risks

- **Names are generated, not cleared.** Product and account names are coined from patterns and screened against a blocklist of about 120 real brands. A generated name can still match a small real business or a product somewhere. Screen the names for each country and industry you demo in, and check "AI Assistor" for trademark conflicts (PRD section 16) before any external use.
- **Regulated content is guardrail text only.** The pharma, devices, financial services and agri packs state the rules, but they have not been reviewed by a compliance or regulatory practitioner. PRD section 16 recommends one practitioner review per pack.
- **Numbers are illustrative.** Price factors are rough local price levels, not exchange rates. Event dates for moving holidays are approximate. Travel time is a straight-line estimate.
- **The Companion is a concept on sample data.** Leave, expenses, pay slips and the certification tracker are not connected to any HR, payroll or learning system. Weather and traffic are generated, not live. The "map" is schematic. The sentiment tag is a visible rule, not a prediction. The customer self-service view is a mock-up.
- **The microphone depends on the browser.** Where speech recognition exists it may send audio to the browser maker. Where it does not, the screen offers typing and the sample dictation. The parser is keyword rules, so a long, free dictation can be misread. The rep confirms every field before it is saved.
- **Holidays and limits are samples.** Public holidays use fixed approximate dates and expense limits are illustrative amounts in local currency. Leave rules (balances, working-day counting) are simplified and not a statement of local employment law.
- **The assistant is rule-based, not a language model.** It scores a question against a catalogue of 52 intents, so a phrasing it was not written for falls back to "I do not have an answer for that" and the list of questions it can answer. The suggested questions always work, free text may not, and a prospect will find the edge of it. The screen says it is rule-based.
- **Refusal patterns are keyword lists.** A rephrased clinical, credit or label question can slip past a pattern and then falls back to "no answer", which is safe but is not a refusal. Patterns need review by a compliance practitioner for each regulated pack before external use.
- **Assistant answers are guidance plus data, not advice.** Industry answers (`assistantAnswers`) are short practitioner-style guidance written for the demo. They have not been reviewed by an industry specialist.
- **The assistant is not on the Ask page's launcher.** The full-page Ask view replaces the floating button on that one screen.
- **State lives in memory.** A page reload resets the demo, by design, so every demo starts clean. Decisions survive switching packs and personas through the presenter menu.
- **English UI only.** Names, places, currency and events are local. Right-to-left Arabic and translated UI are P2.
- **Accessibility is partly verified.** Tap targets are at least 44 px and accent colours pass 4.5:1. A full screen-reader audit has not been done.
- **Desktop shows a phone frame.** Tablet layout uses the same mobile layout, wider. A tablet-optimised layout was not designed.
