# AI Assistor Sales Execution: Product Requirements (PRD)

Product name: **AI Assistor Sales Execution** (short form: AI Assistor)
Version 0.1, 28 October 2026. Owner: Nitin Gupta. Status: draft for prototype build.

**In one line:** an AI field sales app that tells every field rep which customers to visit, what to do first in each visit and what to sell or order, and proves what happened. It is configured per industry and country, so a pharma prospect sees clinics and doctors, and a paints prospect sees dealers and contractors, on the same product.

---

## 1. Problem

Every business with a field sales team makes the same five decisions every day, usually by habit or spreadsheet:

| # | Decision | Question | Where value leaks today |
|---|---|---|---|
| 1 | Coverage | Which customers deserve attention, served by whom? | Effort follows habit, not potential; top accounts under-served |
| 2 | Frequency and route | How often, how long, in what order? | Fixed call cycles; time lost driving; visits miss the moment |
| 3 | In-visit priorities | What should the rep do first? | Long checklists, nothing ranked; gaps found late or never |
| 4 | Order or proposal | What to sell, and how much? | Orders repeat the last one; range per customer does not grow |
| 5 | Evidence and learning | Did it happen, and did it work? | Execution self-reported; no link from action to outcome |

These are the same in consumer goods, pharma, medical devices, building materials, agri inputs, telecom, electronics, auto parts and financial services. Only the nouns change: a store becomes a clinic, a dealer, a workshop or a merchant; a store manager becomes a physician, a contractor or a business owner.

**Opportunity:** one configurable product that answers all five decisions, with industry and country packs, instead of a custom build per company.

## 2. Goals and non-goals

**Product goals**
1. Give each rep a ranked, explained plan for every visit, sized to the time available.
2. Turn the rep from a data collector into a supervisor of AI agents: agents prepare, the rep approves, adjusts or overrides, and owns the result.
3. Let managers coach from exceptions and overrides instead of chasing reports.
4. Configure to a new industry or country without code changes.

**Prototype (demo) goals**
1. A prospect recognises their own world within 60 seconds: their customer types, products, contacts, currency, cities and problems.
2. The presenter can switch industry and country in under 10 seconds, without the prospect seeing a "demo dropdown".
3. The same core workflow is shown in every industry, so the product reads as one platform.

**Non-goals for v1:** real integrations (CRM, ERP, DMS), real ML models, user accounts, payments, real company or brand names, regulated advice content (for example clinical claims). The Sales Companion (section 9.6) shows leave, expense and pay slip screens as sample-data concepts. They are not HR, payroll or payment features.

## 3. Success measures

Targets are set per customer at pilot design, against matched control territories. No numbers are claimed before a pilot.

| Level | Measure | Notes |
|---|---|---|
| Adoption | Recommendations acted on; overrides with a reason; weekly active reps | Adoption reported separately from impact |
| Execution | Action completion rate; tasks per visit (fewer, better); time with the customer | "Fewer tasks per visit" is a goal, not a failure |
| Commercial | Revenue or volume per visit; range per customer; coverage of high-potential accounts | Industry-specific KPI per pack |
| Financial | Incremental contribution vs control, after costs | Agreed with the customer's finance team |

Demo success: prospect asks for a pilot or a second meeting; prospect correctly describes the product back after the demo.

## 4. Users and personas

| Generic persona | What they need | Main screens |
|---|---|---|
| Field rep | A ranked day, a reason for each action, a pre-filled order or proposal, offline use | Today, Visit brief, Account, Action, Order, Visit complete, Route |
| Field manager | Team view, exceptions, coaching prompts, coverage gaps | Manager home, Exception queue, Coverage |
| Key account manager | Compliance and blockers across a chain or group, evidence for business reviews | Account group view |
| Partner or distributor | Proposed routes or beats to confirm, expected orders | Partner view (P2) |
| Sales ops / admin | Configure packs, rules, action catalogue, agent authority; read value vs control | Configuration, Agent controls |
| Customer (self-service) | Suggested reorder between visits (eB2B) | Out of scope for v1 UI; shown as a touchpoint. The Sales Companion includes a clearly labelled mock-up of the customer's view (section 9.6) |

Each industry pack renames these personas (section 6).

## 5. Core concept: one domain model, many vocabularies

Generic entities, renamed by each industry pack:

| Generic entity | Fields (minimum) | Example: Consumer goods | Example: Pharma |
|---|---|---|---|
| Account | id, name, type, segment, tier, potential score, address, geo, opening hours, last visit | Store | Clinic, hospital or pharmacy |
| Contact | name, role, preferences, last interaction | Store manager | Physician, pharmacist |
| Offering | id, name, category, price, unit, status (core, new, focus) | SKU | Product (approved), sample |
| Visit | account, date, planned duration, status, outcomes | Store visit | Call |
| Action | type, title, why (evidence), value estimate, effort (min), confidence, agent, status | Fix out-of-stock | Detail priority product |
| Order or proposal | lines (offering, qty, reason), total, approval state | Order | Pharmacy order, sample request |
| Evidence | type (photo, note, scan, signature), timestamp | Shelf photo | Signed sample receipt |
| Segment | name, rules | Modern / traditional trade | Hospital / clinic / pharmacy |
| Territory | rep, accounts, target | Territory | Territory |

**Vocabulary tokens.** All UI text uses tokens such as `{account}`, `{accounts}`, `{contact}`, `{rep}`, `{offering}`, `{order}`, `{visit}`. The industry pack supplies the words. No industry noun is hard-coded in screens.

**The five decisions as product capabilities** (generic names, usable across industries):

| Capability | Decides | Output |
|---|---|---|
| Account Potential | Where effort goes | Potential, tier, white space, confidence |
| Gap Detection | What is missing or wrong at each account | Gaps with type, severity, evidence |
| Action Ranking | What to do first in each visit | Ranked actions: value, effort, reason, confidence |
| Visit Planning | Which accounts, how often, in what order | Journey plan, route, time budget per visit |
| Order and Proposal Suggestion | What to sell and how much | Suggested lines and quantities with reasons |

Each capability can run alone; together they close the loop (gaps become actions, actions link to order lines, outcomes retrain everything).

## 6. Industry packs (v1: ten)

| Industry | Account (the "store") | Contacts | Rep title | What is sold or ordered | Typical actions | Headline KPI | Guardrail |
|---|---|---|---|---|---|---|---|
| Consumer goods | Supermarkets, convenience stores, independent shops | Store manager, owner | Sales rep | Products by the case | Fix out-of-stock, secure a display, list a new product, place promo material | Distribution, lines per store | Follow each retailer agreement |
| Pharma | Clinics, hospitals, pharmacies | Physician, pharmacist, procurement | Medical rep | Approved products, samples; pharmacy orders | Detail a priority product with approved material, log a sample drop within limits, check pharmacy stock, follow up a formulary listing | Coverage of priority prescribers, pharmacy availability | Approved content only; sample limits logged; no inducements; no clinical advice from the app |
| Medical devices | Hospitals, surgery centres, labs | Surgeon, OR manager, biomed, procurement | Territory manager | Devices, consumables, service contracts | Support a scheduled case, reorder consumables, run a product trial, renew a service contract, run staff in-service training | Consumable pull-through, contract renewals | Approved claims only; case support logged |
| Beverages and alcohol | Bars and restaurants (on-trade), stores (off-trade) | Owner, bar manager | Brand rep | Products, kegs, cases | Win a menu listing, place a cooler, plan an activation night, check draught quality | Distribution, menu presence | Responsible marketing; local licensing and age rules |
| Building materials and paints | Dealers, hardware stores, contractors, architects | Dealer owner, contractor, painter | Territory sales officer | Products, tinting machines, project quotes | Plan dealer stock, refresh the shade display, run a contractor meet, follow a project lead, service a tinting machine | Dealer sell-in, project conversion | Quotes above a threshold need approval |
| Agri inputs | Agri dealers, cooperatives, farmers | Dealer, progressive farmer | Field sales officer | Seeds, crop protection, fertiliser | Pre-season stock plan, visit a demo plot, run a farmer meeting, collect dues, give label-compliant advice | Season sell-in, demo-to-sale conversion | Crop protection advice follows the product label; credit decisions stay human |
| Telecom retail | SIM and recharge outlets, franchise stores | Outlet owner | Channel sales rep | SIM cards, recharge float, devices, plans | Top up recharge float, restock SIMs, refresh branding, check KYC compliance, demo a new device | New activations, float availability | KYC rules; no activation without valid ID |
| Consumer electronics | Electronics stores, multi-brand outlets | Store manager, in-store promoter | Retail account manager | Models, demo units | Make a demo unit live, train promoters, fix price tags, track sell-out, set up a launch display | Sell-out share, display compliance | Price promises follow the retailer agreement |
| Auto parts | Workshops, parts retailers, fleet operators | Workshop owner, mechanic | Field sales rep | Parts, lubricants, batteries | Stock fast-moving parts, train mechanics, enrol in the loyalty scheme, follow up a warranty claim | Lines per workshop, loyalty enrolment | Counterfeit and warranty rules |
| Financial services field sales | Merchants, small businesses, agent outlets | Business owner | Relationship officer | Accounts, loans, card terminals, insurance | Check terminal health, follow up a loan application, collect KYC documents, offer a product within suitability, collections visit | Active merchants, portfolio quality | Suitability and consent; credit and pricing decisions stay human; no mis-selling |

Each pack contains: vocabulary, account types and segments, 8 to 12 offerings, an action catalogue (8 to 12 action types with evidence type and default effort), KPIs, guardrails, 6 problem statements in the prospect's language, AI assistant Q&A, and a demo storyline.

**Segments replace modern vs traditional trade:** each pack defines two or three segments (for example pharma: hospitals, clinics, pharmacies; paints: dealers, contractors, projects). The workflow adapts: long consultative visits vs short order-led visits.

## 7. Country packs (v1: eight)

| Country | Currency | Distance | Cities (examples) | Content notes |
|---|---|---|---|---|
| United States | USD ($) | miles | Chicago, Dallas, Atlanta, Phoenix | Imperial units; US date format |
| United Kingdom | GBP (£) | miles | Manchester, Birmingham, Leeds, Bristol | UK spelling and postcodes |
| Germany | EUR (€) | km | Munich, Hamburg, Cologne, Frankfurt | Comma decimals; works council note on rep data |
| India | INR (₹, lakh/crore) | km | Mumbai, Pune, Lucknow, Bengaluru | Lakh/crore formatting; festival seasons |
| Brazil | BRL (R$) | km | São Paulo, Belo Horizonte, Curitiba, Recife | Comma decimals |
| Indonesia | IDR (Rp) | km | Jakarta, Surabaya, Bandung, Medan | Large numbers in thousands |
| Mexico | MXN ($) | km | Mexico City, Guadalajara, Monterrey, Puebla | Spanish names |
| UAE | AED | km | Dubai, Abu Dhabi, Sharjah, Al Ain | Weekend Sat to Sun; right-to-left later |

A country pack supplies: currency code and formatting, number and date format, distance unit, cities with approximate coordinates, first and last name pools, account-name patterns (fictional), street and address format, phone format, local events calendar (for example Diwali, Carnival, Ramadan and Eid, Lebaran, Thanksgiving, Christmas), and a price level factor so prices feel local.

v1 UI language is English. Names, places, currency and events are localised. Translated UI is P2.

## 8. Demo setup and switching

Decision: **no industry dropdown in the app header.** Prospects would see it during a demo, and it makes the product feel like a toy.

1. **Setup screen at login (P0).** Pick industry (10 tiles with icons), country (8), and persona (rep, manager, admin). "Start demo" signs in as a named persona for that pack, for example "Dr. visits: Priya Nair, Medical rep, Pune".
2. **Shareable link (P0).** URL parameters `?industry=pharma&country=IN&persona=rep` open the right version directly. A prospect can be sent a pre-configured link.
3. **Hidden presenter menu (P0).** Opened by a keyboard shortcut (Shift+D) or a long press on the logo. Switch industry, country or persona, or reset the demo, without logging out.
4. **Deterministic data (P0).** The same industry plus country always shows the same accounts and numbers (seeded generator), so a demo is repeatable.
5. **Prospect branding (P1).** Optional prospect name and colour typed at setup, shown as "Prepared for <name>". Never use a real company's logo.

## 9. Functional requirements

Priority: P0 = in prototype v1, P1 = next iteration, P2 = later.

### 9.1 Rep experience

| ID | Requirement | Priority |
|---|---|---|
| R1 | Today screen: greeting, territory target vs achieved, opportunity in the territory, today's accounts ranked by value, and the overnight brief banner | P0 |
| R2 | Overnight visit brief per account: agents' ranked plan; each item shows what the agent saw, what it compared, how sure it is; approve, adjust or override with a reason; nothing is sent until approved | P0 |
| R3 | Account 360: profile, contacts, potential and tier, last visits, open gaps, history of orders, KPIs for the pack | P0 |
| R4 | Action detail: why it matters (3 to 5 evidence lines), value estimate, effort in minutes, confidence, talking points for the contact, record outcome (done, not done + reason code) | P0 |
| R5 | Order or proposal builder: suggested lines with reasons, adjust quantities, approval rules from the pack (for example quotes above a threshold, sample limits) | P0 |
| R6 | Evidence capture: photo or note placeholder per action, typed per pack (signature for pharma samples, photo for displays) | P0 |
| R7 | Visit complete: actions done, value captured, next best account | P0 |
| R8 | Route plan: map or list of today's visits in order with travel time and time budget, re-plan when an account closes | P1 |
| R9 | Assistant on every screen (launcher and bottom sheet; on Setup, "About this demo"). It knows the screen, persona and record in view, offers 4 to 6 suggested questions for them, and answers from live app state and generated data, with a "Based on" line and links. The Ask AI page is the full-page view of the same conversation. Rule-based. See section 9.5 | P1 |
| R10 | Offline indicator and queued sync | P2 |

### 9.2 Manager experience

| ID | Requirement | Priority |
|---|---|---|
| M1 | Team today: reps, planned vs done visits, actions completed, value captured | P0 |
| M2 | Exception queue: overrides and blocked actions, each with the reason, routed to the manager or KAM | P0 |
| M3 | Coaching prompts generated from patterns in overrides and outcomes (not a leaderboard used to police) | P1 |
| M4 | Coverage: high-potential accounts not visited in N days | P1 |

### 9.3 Agents and governance

| ID | Requirement | Priority |
|---|---|---|
| G1 | Agent controls: each agent (Visit Planner, Gap agent, Order agent) shows scope, owner, what it does alone, what needs approval, what is never its call, authority level, and a stop or resume button | P0 |
| G2 | Industry guardrails visible in the agent scope (for example pharma: "never suggests off-label content"; financial services: "never sets price or approves credit") | P0 |
| G3 | Audit log of approvals, overrides and agent actions | P1 |

### 9.4 Configuration (shown to prospects as "how it fits your business")

| ID | Requirement | Priority |
|---|---|---|
| C1 | "How this is configured" screen: shows the active pack's vocabulary mapping, segments, action catalogue, KPIs and guardrails | P0 |
| C2 | Problems we solve: six problem statements in the prospect's language, each linked to the capability that solves it | P0 |
| C3 | Pack editor (edit action catalogue, weights) | P2 |

### 9.5 Assistant (R9 detail)

The assistant receives a context object on every open: `{screen, persona, accountId?, actionId?, visitId?, orderId?, filters?}`. Each pack supplies 4 to 6 suggested questions per screen and persona (`assistantContext`), industry phrasing (`assistantAnswers`) and out-of-scope patterns tied to its guardrails (`assistantRefusals`).

| Screen | Persona | What the suggested questions cover |
|---|---|---|
| Today | Rep | What to do first, why this order, what can wait, how the time budget was used |
| Visit brief | Rep | Why an action ranks first, what it was compared against, how sure it is, what an override does, what evidence is missing |
| Account 360 | Rep | Summary, what changed since the last visit, which offerings are gaps, who the contact is |
| Action detail | Rep | How the value was estimated, what evidence supports it, effort, the guardrail on this action |
| Order or proposal builder | Rep | Why these lines, what blocks sending, which rule applies, what changes if a line is edited |
| Visit complete | Rep | What to log, what carries to next time, what the manager will see |
| Route plan | Rep | Why this sequence, what if one stop is skipped, what if the rep runs late |
| Manager home and exception queue | Manager | Which overrides need attention, which reps are drifting, what to coach, patterns in override reasons |
| Agent controls | Rep, manager | What each agent does, what it cannot do, what happens on stop |
| How this is configured, Problems we solve | Rep, manager | How the pack is configured, which words change, what changes by country, how to add an industry, which problem maps to which capability, how a pilot would measure it |
| Setup | None yet | What the product is, whether the data is real, how it changes by industry |

Behaviour:
- Answers are built from generated data and live session state, are deterministic for a given seed, and always say what they are based on. If there is no answer the assistant says so and lists what it can answer. It never invents one.
- Questions outside the pack's guardrails get a plain refusal, the allowed alternative, and a "Why can't you answer that?" explanation naming the guardrail. Promises or predictions of results are refused in every pack.
- Refusals and overrides are logged to the audit log (G3) with persona and screen.
- The assistant may open a screen or the builder with suggested lines. It never approves, sends or overrides for the user.
- A live model is optional and off. It is compiled out of the shipped build, never holds an API key in the repository, and receives only the question, the screen context and sample data.

### 9.6 Sales Companion (concept)

The Companion is the field enabler: one place where a rep and a manager meet the five capabilities with the admin and learning tools they use every day. It consumes outputs of the existing capabilities and links to their screens. It does not build a second route plan, visit brief or order builder. Every label uses vocabulary tokens and every number, date and distance uses the country pack. All of it is sample data and is labelled "Sample data" and "Concept".

| ID | Requirement | Priority |
|---|---|---|
| S1 | Companion hub in the main navigation for rep and manager, with three pillars (Growth, Productivity, Learning) and a "Powered by" row on features that use a capability output | P0 |
| S2 | Growth, plan: journey planning from the Visit Planner route with a safety strip (weather, traffic, fatigue prompt after a set drive time); pre-call brief card linking to the visit brief, with last actions, open issues and a sentiment tag | P0 |
| S3 | Growth, plan: voice debrief using the Web Speech API where supported, with a typed fallback and a sample dictation. A rule-based parser produces outcome, issues, follow-ups and order intent for the rep to confirm. Labelled as a simulation | P0 |
| S4 | Growth, plan: live resource planning for managers, comparing sample activations with team availability by week, highlighting gaps and suggesting internal or third-party cover | P0 |
| S5 | Growth, sell: call plan per account; dynamic pitch with the source of each point shown; local overlay of nearby accounts; customer value story with the data used shown; customer self-service mock-up | P0 |
| S6 | Productivity: leave (apply, track, manager approval), expense claims (receipt photo mock, category, local currency, automatic policy check, manager approval), HR and pay (sample pay slips and documents, no real pay information) | P0 |
| S7 | Learning: learning chatbot (rule-based, reusing the assistant's guard and normaliser), knowledge base search, certification tracker with renewals due within 30 days flagged | P0 |
| S8 | Pitch, value story and chatbot never produce a restricted claim for the pack, and a request for one is refused with the guardrail named and an audit entry | P0 |
| S9 | Wellbeing hub, complaint and feedback portal, travel planner with mileage log, onboarding checklist with e-signature, call fundamentals library, manager view of team learning progress | P1 |

Pack content: each industry pack supplies `companion` (roles, expense categories, certifications, learning modules, knowledge entries, pitch and value story templates, sample activations, guardrails with blocked claim patterns). Each country pack supplies public holidays, leave types, sample expense limits, mileage unit, pay slip label and temperature unit.

## 10. AI behaviour and guardrails

- Every recommendation carries a reason, a value estimate, an effort estimate and a confidence level. Low confidence is said plainly.
- The rep can override any recommendation in one tap; overrides with reasons are feedback, never penalised.
- Agents start at a narrow authority level and earn wider scope on evidence; authority can be withdrawn.
- Prices, credit, contract terms, clinical or agronomic advice and regulated claims are never decided by an agent.
- The assistant follows the same limits: it never decides price, credit, clinical or agronomic questions, and it refuses them in plain language (section 9.5).
- The prototype uses rule-based scoring on generated data. It must say "sample data" on the setup screen and in the presenter menu. It must not claim real results.

## 11. Data generation (prototype)

- Seeded pseudo-random generator keyed by industry + country, so data is stable across reloads.
- Per pack and country: 1 rep territory with 24 to 30 accounts across the pack's segments, 6 to 8 accounts planned today, 8 to 12 offerings with local prices, 3 to 6 actions per planned account drawn from the action catalogue, a suggested order per account, 4 reps for the manager view, 3 agents.
- Account names are fictional and built from patterns (for example "Sunrise Family Clinic", "Krishna Hardware Traders", "Bairro Auto Peças") using the country's name pools. Never real brands, chains or companies.
- Money formatted by country (₹ lakh and crore for India, comma decimals for Germany and Brazil).

## 12. Non-functional requirements

| Area | Requirement |
|---|---|
| Delivery | Static web app, no backend; runs from GitHub Pages and from a single bundled HTML file for offline demos |
| Devices | Mobile-first (phone frame on desktop), works on tablet and desktop |
| Performance | Industry or country switch re-renders in under 1 second |
| Extensibility | Adding an industry or country = adding one pack file, no screen code changes |
| Quality | No console errors; every screen works in all 80 industry-country combinations |
| Confidentiality | No real company names, logos, data or internal terms from any employer |
| Accessibility | Readable contrast, tap targets of at least 44 px |

## 13. Prototype acceptance criteria

1. Setup screen lists 10 industries, 8 countries and 3 personas; "Start demo" works for all combinations.
2. URL parameters open the right pack directly; Shift+D opens the presenter menu.
3. In every industry, all screen labels use that industry's words (no "store" in pharma, no "SKU" in financial services).
4. Switching country changes currency, number format, cities, names, addresses, distance unit and local events.
5. P0 requirements in section 9 all work; the visit brief approve, adjust and override flow updates counts on screen.
6. Agent controls show industry guardrails and the stop button works.
7. Automated check (headless browser) loads all 80 combinations and every P0 screen without errors.

## 14. Demo storyline (same arc in every industry)

1. Setup: pick the prospect's industry and country (or open their link).
2. Today: "Here is your rep's day, ranked by value, in your currency and your cities."
3. Overnight brief: agents prepared the first visit; approve one item, override one with a reason.
4. Action detail: the why, the talking points, the guardrail.
5. Order or proposal: suggested lines, one adjusted, approval rule shown.
6. Visit complete, then manager exception queue: the override arrives with its reason.
7. Agent controls: scope, owner, stop button.
8. How it is configured: their vocabulary, actions and KPIs. Close: "This is a configuration, not a custom build."

## 15. Roadmap

| Phase | Scope |
|---|---|
| Prototype v1 | This PRD's P0 scope: 10 industries, 8 countries, rep, manager, agents, configuration screens |
| Prototype v1.1 | P1: route plan, Ask AI, coaching prompts, coverage, prospect branding |
| Pilot-ready MVP | Real data import (CSV), one CRM integration (for example Salesforce or Dynamics), basic models for potential and order suggestion, offline sync, measurement against control |
| Product | Pack editor, more CRM and ERP connectors, partner and customer self-service views, translated UI |

## 16. Risks and open questions

| Risk or question | Mitigation or next step |
|---|---|
| Prospects read sample numbers as real results | "Sample data" label on setup and presenter menu; no performance claims |
| One generic product feels shallow to a specialist industry | Deep vocabulary, guardrails and problems per pack; validate each pack with one practitioner |
| Regulated industries (pharma, financial services) need stricter flows | Guardrails shown in agent scope; regulated content stays human |
| IP and confidentiality relative to the owner's employer | Use only generic patterns and fictional data; owner to confirm employment-agreement position before external use |
| Product name | Check trademark availability for "AI Assistor" before external use |
| Open: which two industries to validate first with real prospects? | Owner decision |

## Appendix A. Retail execution concepts, generalised

| Retail execution term | Generic term in this product |
|---|---|
| Store | Account |
| Store manager | Contact |
| SKU | Offering |
| Modern trade / traditional trade | Segment |
| Perfect store score | Account execution score (pack-defined pillars) |
| Out-of-stock, void | Gap |
| Suggested order | Order or proposal suggestion |
| Planogram / display compliance | Standard compliance (pack-defined) |
| Beat / call cycle | Journey plan |
| Distributor | Partner |
