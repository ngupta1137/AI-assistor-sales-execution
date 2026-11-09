# Feature Gap Audit: Enterprise Governance, Agents, Quality System, Lab and Product Manager Layer (v4)

Audit conducted before writing Wave 1 code, per section 0 of the specification. Every feature ID from the specification is listed with its current implementation status, location, and plan.

| Feature ID | Feature Name and Description | Exists today (file and screen) | Status | Plan |
|---|---|---|---|---|
| **G1** | Seven outcomes on every suggestion card (Suggest, Clarify, Evidence, Conflict, Stale, Role, Compliance) | `src/core/screens/brief.js`, `src/core/state.js` | Done | Implemented 7 deterministic outcomes with unique card looks, clarification choice chips, refresh stale, missing evidence notes, next step lines, and happy path invariance on first cards. |
| **G2** | Status chips and rule drawer (Approved, In date, Applies here, Rule version, Legal approved) | `src/core/screens/brief.js` | Done | Added status chip row to every card; clicking opens modal rule drawer showing version, owner, approver, effective dates, scope, never-decides, and 3 plain checks. |
| **G3** | Context bar ("Recommendations apply to this context: {market}, {segment}, {channel}, {role}") | `src/core/screens/today.js`, `src/core/screens/account.js` | Done | Added context bar at the top of Today and Account 360 screens showing market, segment, channel, and rep role. |
| **G4** | Flag a recommendation (Reason chips: Not true here, Out of date, Wrong wording, Not allowed, Other) | `src/core/screens/brief.js`, `src/core/state.js` | Done | Added flag recommendation link, modal sheet with reason chips and optional note, card flagged chip, and automatic gap backlog and audit logging. |
| **G5** | Acting-as bar and rights matrix with denied notice and denial logging | `src/core/app.js`, `src/packs/governance-base.js` | Done | Added acting-as bar on every screen, RBAC matrix modal from single governance rights table, unauthorised navigation guard with denied notice naming owning team, and Denial audit logging. |
| **G6** | Record kept (Audit receipt for non-rep personas with rule version, data age, model use, audit id) | `src/core/screens/brief.js` | Done | Implemented Record Kept immutable audit receipt on suggestion trace cards showing rule version, data source and age, outcome, model division of labor, audited viewer, and deterministic audit event ID. |
| **G7** | Exact-wording gate (Mandatory reading checkbox hiding action button for legal-approved items) | `src/core/screens/brief.js`, `src/core/state.js` | Done | Added exact wording box with mandatory reading checkbox hiding approval button until checked, logging Decision event with rule version. |
| **G8** | Readiness banner ("Season readiness: N of M items ready" with progress bar) | `src/core/screens/manager.js` | Done | Implemented Season readiness banner with dynamic progress bar and toggleable list of non-ready items sourced from the industry governance pack. |
| **G9** | Rule health page (Version, owner, age, acceptance, override, retire action with mandatory approver/reason) | `src/core/screens/rule-health.js` | Done | Created Rule Health screen featuring rule registry, sparklines, health status chips, and retirement modal requiring named approver and mandatory business reason. |
| **G10** | Audit trail page with replay and as-of lookup (Filter by type/person/rule, step replay, as-of rule lookup) | `src/core/screens/audit-trail.js` | Done | Created Audit Trail screen with session event filtering by type and actor, G10a step-by-step causal decision replay stepper, and G10b as-of historical policy version lookup. |
| **G11** | Try a case floating chips panel (8 test chips for governance outcomes) | None | Missing | Add floating button (bottom left) with 8 case chips that force deterministic test states onto card 3. |
| **G12** | Guide ("How this works" 3-step guide and legend modal) | None | Missing | Add "How this works" link in acting-as bar opening 3-step guide and label legend modal with sample data disclaimer. |
| **G13** | Simple view and text size toggles (A, A+, A++, "Talk to my manager" button) | None | Missing | Add font size stepper and simple view toggle in rep preferences; render "Talk to my manager" button in simple mode. |
| **G14** | Screen states demo switcher (Loading skeleton, Empty state, Error state) | None | Missing | Add state toggles in demo drawer with return navigation for all 3 states. |
| **A1** | Agents Layers view (Experiences, Orchestration, Product agents, Interfaces, Shared foundations) | `src/core/screens/agents.js` (Agent cards only) | Partial | Build 5-layer architecture visualization page showing Visit Orchestrator, product agent capabilities, tools, and shared foundations. |
| **A2** | One visit trace (Time budget slider, 6 tool calls with latency and value-per-minute selection) | None | Missing | Add interactive visit trace simulator with time slider and audit trail export. |
| **A3** | One gap end to end (6-step stepper with credit/price hold and approver unlock) | None | Missing | Add 6-step lifecycle stepper from Gap Detection to model update with regulated hold gate. |
| **A4** | Tools and guardrails catalogue and raw write denial simulation | None | Missing | Render table of tools and capability permissions; add "Agent tries raw system write" test button with blocked denial. |
| **A5** | Account 360 feature profile (Features, producing capability, age, stale slider, refresh) | `src/core/screens/account.js` (Account data) | Partial | Add Account 360 feature profile tab with stale threshold slider, stale warnings, and refresh logging. |
| **A6** | Account and visit memory (Timeline, note expiry slider, do not use, forget, add note) | None | Missing | Add memory timeline with expiry slider, exclusion flags, and next-visit usage forecast. |
| **E1** | Six test layers table (Data contracts, Golden suite, Regression, Journey, Authority, Offline) | None | Missing | Build test methodology overview table detailing frequencies and responsible teams. |
| **E2** | Golden suite table (Cases, capability, expected decision, critical flag, pass rule) | None | Missing | Build Golden Suite table with UI add/edit capability and 80 percent plus critical pass threshold enforcement. |
| **E3** | Blind set evaluation (Comparison between team set and blind set, gap limit gate check) | None | Missing | Build blind set comparative dashboard with safe decline vs wrong suggestion classification. |
| **E4** | Eval gate (5 dimensions per capability, current vs candidate, slider thresholds) | None | Missing | Build multidimensional evaluation gate with adjustable tolerance sliders. |
| **E5** | Regression table with real counts (Live counts read from build JSON) | None | Missing | Build regression table reading real execution counts from generated JSON. |
| **E6** | Error rates per 1,000 suggestions (Configurable limits, sliders, live session error counter) | None | Missing | Build error budget dashboard with limit breach indicators and live console error listener. |
| **E7** | Failures log (Symptom, root cause, fix, regression test id, slice metrics) | None | Missing | Build failure log with slice-level analysis and critical failure release block. |
| **E8** | Release gate summary (Go, Fix, Stop per item, composite Go rule) | None | Missing | Build composite release gate checking A/B, evals, golden cases, regression, error rates, and gaps. |
| **L-AB** | Portfolio Lab: A/B testing simulation (Lift range, sample size, effect size, noise sliders) | None | Missing | Add simulated A/B testing tab with pre-registered decision rules. |
| **L-ROI** | Portfolio Lab: ROI calculator (Uplift, unit value, scale, cost, overlap slider) | None | Missing | Add portfolio ROI model with capability overlap deduplication. |
| **L-MAT** | Portfolio Lab: Maturity matrix (Level 1 to 3, Full vs Proxy capability execution) | None | Missing | Add market maturity diagnostic mapping cluster readiness to proxy vs full execution. |
| **L-CH** | Portfolio Lab: Change tracking (Adoption, execution, value diagnostic chips) | None | Missing | Add change tracking dashboard with rep protection notice. |
| **L-EV** | Portfolio Lab: Eval gate | None | Missing | Expose Eval Gate (E4) inside Lab modal. |
| **L-RG** | Portfolio Lab: Regression table | None | Missing | Expose Regression Table (E5) inside Lab modal. |
| **L-ER** | Portfolio Lab: Error rates | None | Missing | Expose Error Rates (E6) inside Lab modal. |
| **L-FL** | Portfolio Lab: Failures log | None | Missing | Expose Failures Log (E7) inside Lab modal. |
| **L-GATE** | Portfolio Lab: Release gate | None | Missing | Expose Release Gate (E8) inside Lab modal. |
| **L-US** | Portfolio Lab: Session usage tracking (Click telemetry by persona and section) | `src/core/telemetry.js` (Sync events) | Partial | Add session telemetry counter matrix with Clear and Copy controls. |
| **L-OUT** | Portfolio Lab: Outcomes precedence simulator (Tick conditions to see winning outcome) | None | Missing | Add interactive outcome precedence test simulator. |
| **L-PV** | Portfolio Lab: Authority and applicability demo (Edit-drift simulation) | None | Missing | Add candidate rule authority inspector with edit-drift unapproved flag. |
| **L-RV** | Portfolio Lab: Review queue (Maker-checker workflow with side-by-side wording diff) | None | Missing | Add maker-checker rule review queue with legal approver check. |
| **L-RT** | Portfolio Lab: Rights simulator (Role x action matrix test) | None | Missing | Add interactive rights tester showing permitted and denied actions. |
| **L-GP** | Portfolio Lab: Gap backlog and managed term map | None | Missing | Add gap backlog with claim action and canonical term confirmation list. |
| **L-CD** | Portfolio Lab: Interactive card demo | None | Missing | Add standalone card sandbox demonstrating all governance states. |
| **L-TR** | Portfolio Lab: Suggestion trace inspector | None | Missing | Add worked trace demonstrating deterministic rule choice and model explanation. |
| **L-AG** | Portfolio Lab: Agents tab | None | Missing | Embed agent views (A1 to A6) in Lab overlay. |
| **L-PM** | Portfolio Lab: Product Manager views tab | None | Missing | Embed product manager views (P1 to P4) in Lab overlay. |
| **L-DEC** | Portfolio Lab: Decisions and model gateway | None | Missing | Add decision log, out-of-scope catalogue, and model tier gateway architecture. |
| **P1** | Product Manager: Metric tree (Reach x acceptance x completion, what-if slider) | None | Missing | Build interactive metric tree with live what-if slider and weakest-lever diagnostics. |
| **P2** | Product Manager: Decision log by market (Market/status filters, add decision form) | None | Missing | Build market-segmented decision log with audit trail logging. |
| **P3** | Product Manager: Bias checks by market (Account tier parity, review threshold slider) | None | Missing | Build demographic and tier parity monitor with automated review triggers. |
| **P4** | Product Manager: Cost and speed calculator (Model tier cost, latency, monthly budget sliders) | None | Missing | Build model unit economics and latency calculator with budget alert thresholds. |
| **T1** | Static pack validation test suite | `tests/static.mjs` | Partial | Extend static tests to validate all new governance, agents, quality, and PM pack fields. |
| **T2** | Screen sweep test across all persona x industry x country combinations | `tests/e2e.mjs` | Partial | Expand screen sweep to verify all new governance and quality tabs across all packs. |
| **T3** | Governance behaviour automated tests | None | Missing | Add Playwright tests verifying outcomes, drawer, exact wording, flag, rights, and screen states. |
| **T4** | Agent view automated tests | None | Missing | Add Playwright tests verifying layers, visit trace slider, gap stepper, and memory expiry. |
| **T5** | Quality and release gate automated tests | None | Missing | Add Playwright tests verifying golden suite pass rule, eval gate, and release gate logic. |
| **T6** | Product manager views automated tests | None | Missing | Add Playwright tests verifying metric tree what-if, decision log, bias, and cost sliders. |
| **T7** | No-overlap automated test (Floating controls at 1280, 390, and 360 px) | None | Missing | Implement automated bounding box collision test for all floating and fixed controls. |
| **T8** | Determinism test across all packs | `tests/static.mjs` | Partial | Verify two successive generations produce identical card outcomes. |
| **T9** | Parity test | None | Missing | Add automated test validating that every feature ID in this audit is covered by tests. |
| **T10** | Lab regression table real counts generator | None | Missing | Generate `docs/test-counts.json` from test runs for live consumption by the UI. |
