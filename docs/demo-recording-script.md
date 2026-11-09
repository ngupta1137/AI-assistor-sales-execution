# AI Assistor Sales Execution: Master Demo Recording Script & Claude Automation Protocol

> **MANDATE FOR CLAUDE (CLAUDE CHROME SESSION & BROWSER AUTOMATION):**
> You must strictly utilize the **`narrated-demo-video`** skill (`C:\Users\nitin\.claude\skills\synced\fdaeee27-ad52-43cf-a55a-80aed6112052_068cbf4d-2d4e-48e7-97ec-85412d730bcd\narrated-demo-video\SKILL.md`) and adhere to all of its architectural best practices and production instructions.

---

## 0. Standing Bar & Core Directives (from `narrated-demo-video` Skill)

### 0.1 Principal & Director Level Bar
- **Mechanism over labels:** Demonstrate and narrate how the system actually computes decisions (constraint propagation, value-per-minute knapsack fitting, supervisory hold gates, model gateway tiers, parity drift math), never superficial feature labels.
- **Truthful evidence:** All data shown is fictional sample data. Never make unverified performance claims. Clearly distinguish working features (Built & Interactive) from architecture specifications (Designed) and target cloud infrastructure (Proposed).
- **Hostile expert self-critique:** The script and on-screen proofs are engineered to satisfy a skeptical Enterprise Commercial VP, CIO, or CFO.
- **Boundary and refusal proofs:** The demo explicitly showcases boundary conditions (stale data refresh, exact-wording gating, unauthorized security write denial, and clinical off-label refusal) because demonstrating refusal builds deeper institutional trust than uniform success.

### 0.2 Scripting & TTS Pronunciation Rules (ElevenLabs Cloned Voice)
- **Beat Structure:** Numbered beats: `[on-screen action] + [narration line]`. One clear action per sentence; narration introduces the concept, and the cursor follows.
- **Spoken Form for TTS:** All acronyms and abbreviations are phonetically spaced (e.g. `C R M`, `C P G`, `U S`, `A P I`, `R B A C`, `S A P`, `R M A`, `G D P R`, `I N R`, `B E T R V G eighty-seven`) with zero markdown formatting inside voiceover text so ElevenLabs generates flawless audio without mispronunciation.
- **Cadence & Pauses:** 130 to 145 words per minute. Pacing includes 400 to 700 ms natural breathing room between beats and 1.5 seconds hold after key reveals.
- **Zero Em Dashes:** Strict compliance with typography rules. No em dashes or en dashes anywhere in copy, prompts, or code.

### 0.3 Directing, Pacing & Audio-Driven Timing
- **Audio Drives Time:** Narration audio duration (measured via `ffprobe` per cue) determines screen dwell and transition triggers. Actions never run on rigid arbitrary sleeps.
- **Visual Hygiene:** 1920 x 1080 resolution, smooth easing, no intermediate loading flashes, visible cursor with soft spotlight focus on interactive controls, header and nav bars stay visible.
- **Scene Crossfades:** 0.5 to 0.7 second crossfades between major scenes; direct cuts inside scenes. A 4.0 second hold on the final slide before video termination ensures clean fade-out.

### 0.4 Four-Level Presentation Backup Chain
- **Backup 1 (Primary):** Master 1080p MP4 / WebM with synchronized ElevenLabs cloned voice track.
- **Backup 2 (Live App):** Pre-seeded local / web runtime ready at `http://localhost:5173/` or Vercel.
- **Backup 3 (Keyframes):** 12 high-resolution slide keyframes embedded directly in `pitch.html`.
- **Backup 4 (Muted Voiceover):** Clean video track with verbatim script in presenter speaker notes for live presenter voiceover if venue audio fails.

---

## 1. Studio & Environment Configuration

### 1.1 Claude Chrome Session Parameters
- **Window Resolution:** 1920 x 1080 (16:9 Full HD).
- **Viewport Layout:** Centered application viewport at 1920 x 1080 desktop mode (or 412 x 915 mobile frame emulation centered with dark theater backdrop).
- **Base Application URL:** `http://localhost:5173/` (or `https://ai-assistor-sales-execution.vercel.app/`)
- **Presentation Deck URL:** `http://localhost:5173/pitch.html` (or `docs/pitch.html`)
- **Browser State Hygiene:** Fresh session profile, local storage reset before run, clean navigation history, bookmarks and URL bars hidden.

### 1.2 ElevenLabs Voice Clone Settings
- **Voice Model:** Eleven Multilingual v2 or Eleven English v1.
- **Voice Preset:** Cloned user voice (Verity project calibration).
- **Stability:** 55% (expressive and dynamic cadence).
- **Clarity / Similarity:** 85% (high fidelity to original voice clone).
- **Style Exaggeration:** 15% (confident, authoritative executive delivery).
- **Target Master Loudness:** -14 to -16 LUFS integrated, -1.0 dB true peak.

---

## 2. Master Storyboard & Scene Architecture

| Scene # | Time Slot | Screen Route | Focus Persona & System Proof |
|---|---|---|---|
| **Scene 1** | 0:00 - 0:45 (45s) | `pitch.html` (Slides 1 & 2) | Executive Hook: Closed-Loop Solver & The C R M Form Trap |
| **Scene 2** | 0:45 - 1:20 (35s) | `index.html#/setup` | Config-Driven Core: 20 Industries x 11 Countries |
| **Scene 3** | 1:20 - 2:30 (70s) | `#/today` -> `#/brief/A01` | Frontline Rep: 5-Decision Solver, 7 Outcomes & Exact Wording |
| **Scene 4** | 2:30 - 3:25 (55s) | `#/account/A01` -> `#/order/A01` | In-Visit Execution: Gap Detection, Orders & Margin Guardrails |
| **Scene 5** | 3:25 - 4:10 (45s) | `#/companion` | Sales Companion: Growth, Safety, Voice Debrief & Learning |
| **Scene 6** | 4:10 - 5:05 (55s) | `#/manager` | District Manager: Target Cockpit, Readiness & Exception Queue |
| **Scene 7** | 5:05 - 6:05 (60s) | `#/agents` | Agent Fleet: 5 Layers, Knapsack Solver Slider & Memory |
| **Scene 8** | 6:05 - 7:00 (55s) | `#/quality` | Quality Hierarchy: Golden Suite, Blind Eval & 1M Checks |
| **Scene 9** | 7:00 - 8:00 (60s) | Portfolio Lab (`button[data-act="open-lab"]`) | Portfolio Lab: A B Rollout, R O I Calculator & Model Gateway |
| **Scene 10** | 8:00 - 8:55 (55s) | `#/pm` | Product Manager: Metric Tree, Parity Monitor & Latency |
| **Scene 11** | 8:55 - 9:45 (50s) | `?industry=pharma&country=IN#/today` | Regulated Agility: Indian Pharma & Clinical Guardrail Refusal |
| **Scene 12** | 9:45 - 10:30 (45s) | `pitch.html` (Slide 12) | Commercial Blueprint: The 90-Day Bounded Pilot |

**Total Estimated Runtime:** 10 minutes 30 seconds.

---

## 3. Scene-by-Scene Grounded Script & Automation Protocol

### Scene 1: Executive Hook & The Enterprise Dilemma
- **Timing:** 0:00 to 0:45 (45 seconds)
- **URL:** `http://localhost:5173/pitch.html` (Slide 1 & Slide 2)

#### Spoken Narration (Phonetic ElevenLabs Form)
"Welcome. Today we are demonstrating A I Assistor for Sales Execution.
Global manufacturers spend over two thousand dollars per rep each year on enterprise C R M, yet frontline field teams still spend over two-thirds of their day manually navigating static forms and disconnected instructions.
Coverage planning, route navigation, in-store actions, order drafting, and manager exception handling operate in isolated silos.
A I Assistor solves this by functioning as a closed-loop intelligence overlay on your existing Salesforce, StayinFront, Veeva, and S A P investments.
It requires zero system replacement, deploys in three to five weeks, and connects all five core commercial decisions into a single real-time constraint graph."

#### Claude Chrome Session Action Steps
1. `goto("http://localhost:5173/pitch.html")`
2. `wait(1500)`
3. Hover over the top pill badges: `Enterprise Intelligence Overlay`, `Offline P W A Runtime`, `Closed-Loop Solver`.
4. `wait(2000)`
5. Click next slide: `click("button#btn-next")` transitioning to Slide 2 ("The $2,100/Rep CRM Form Trap").
6. Hover over the left card ("The 5 Disconnected Silos Today") and right card ("The AI Assistor Difference").
7. `wait(3000)`

---

### Scene 2: Dynamic Multi-Domain Engine
- **Timing:** 0:45 to 1:20 (35 seconds)
- **URL:** `http://localhost:5173/#/setup`

#### Spoken Narration (Phonetic ElevenLabs Form)
"Let us step inside the live application.
One of the most powerful architectural achievements of this platform is that it is completely config-driven.
A single codebase powers twenty distinct industries across eleven countries.
There is not a single hardcoded industry noun, currency symbol, or date format in any screen.
Whether you are deploying in Consumer Packaged Goods in North America, Paints and Building Materials in the United Kingdom, or Pharmaceuticals in India, the application instantly adapts its vocabulary, compliance guardrails, and commercial math.
Let us launch the demo for Consumer Packaged Goods in the United States, operating as Alex Morgan, our frontline field rep."

#### Claude Chrome Session Action Steps
1. `goto("http://localhost:5173/#/setup")`
2. `wait(1500)`
3. Smoothly scroll through the industry grid showcasing tiles: C P G, Pharma, Med Devices, Beverages, Building Materials, Telecom, Financial Services.
4. `wait(1000)`
5. Click quick-start preset: `click('button[data-act="preset-demo"][data-ind="cpg"]')`.
6. `wait(1200)`
7. Click start demo: `click('button[data-act="setup-start"]')`.
8. `wait(2500)`

---

### Scene 3: Frontline Field Rep: Morning Brief & The 5-Decision Constraint Graph
- **Timing:** 1:20 to 2:30 (70 seconds)
- **URL:** `http://localhost:5173/?industry=cpg&country=US&persona=rep#/today` -> `#/brief/A01`

#### Spoken Narration (Phonetic ElevenLabs Form)
"Alex opens the Today screen.
At the top, the context bar establishes that every recommendation is strictly bounded by market, segment, channel, and rep role.
The five-decision constraint graph has already synchronized territory quotas, route drive time, dock receiving hours, and depot stock levels.
Notice the Blitz mode toggle, designed for rapid forty-five second visits when a store manager is rushed.
Alex taps into the first visit brief.
Here you see enterprise governance in action. Every recommendation card resolves into one of seven deterministic outcomes: Suggest, Needs clarification, Missing evidence, Conflict, Data is stale, Not allowed, or Compliance escalation.
On this card, the data is stale. Alex taps Refresh, and the system recalculates in real time.
Tapping the chip row opens the Rule Drawer, providing complete auditability: rule version, owner, legal approver, and effective dates.
Notice the exact-wording gate. For regulated compliance disclosures, the execution action stays locked until the rep confirms they have read the approved wording.
Every approved trace generates an immutable Record Kept receipt, guaranteeing legal reproducibility."

#### Claude Chrome Session Action Steps
1. On `#/today`, pause to highlight territory quota progress, route drive sequence, and accounts ranked by expected margin.
2. Hover over the context bar: "Recommendations apply to this context: US Modern Trade, Hypermarkets...".
3. Click `button[data-act="toggle-blitz"]` on and off to show blitz mode rapid execution.
4. Click the first account card to navigate to `#/brief/A01`.
5. `wait(2000)`
6. Scroll down to show recommendation cards with status chips: `Approved`, `In date`, `Applies here`.
7. On a stale card, click `button[data-act="refresh-stale"]` ("Refresh"). Observe state transition to green Approved.
8. Click status chips row: `click('[data-act="open-rule-drawer"]')` to open the modal **Rule Drawer**.
9. `wait(2000)`: Hover over rule owner, named legal approver, effective dates, and "Why this applied".
10. Close the drawer: `click('[data-act="close-rule-drawer"]')`.
11. Scroll to the exact-wording gate card. Notice the action button is hidden.
12. Click checkbox `click('input[data-change="confirm-exact-wording"]')` ("I have read this wording").
13. Observe the action button unlock immediately.
14. Click the card trace to expand the **Record Kept** audit receipt showing rule version, data age, and audit event I D.
15. Click `button[data-act="open-flag-sheet"]` on a card, select reason chip, and submit. Show the flagged chip.
16. `wait(2000)`

---

### Scene 4: In-Visit Execution: Account 360, Order Builder & Margin Guardrails
- **Timing:** 2:30 to 3:25 (55 seconds)
- **URL:** `http://localhost:5173/?industry=cpg&country=US&persona=rep#/account/A01` -> `#/order/A01`

#### Spoken Narration (Phonetic ElevenLabs Form)
"Next, Alex moves to the Account 360 view.
The system displays past order velocity, compliance history, and open revenue gaps.
Every gap detected has an explicit revenue estimate and confidence level.
When the buyer agrees, Alex transitions directly into the Order and Proposal Suggestion engine.
Unlike generic ordering tools, A I Assistor calculates line-level margins and depot availability live.
Notice what happens when Alex adjusts order quantities.
If a proposed quantity exceeds credit limits or triggers an unbudgeted trade rebate, the system enforces a supervisory hold gate.
The rep can also log Return Material Authorizations with photo evidence, routing damaged goods directly to Accounts Receivable without bypassing segregation of duties.
And where store policies prohibit photography, an authorized camera exemption protects the rep compliance score."

#### Claude Chrome Session Action Steps
1. Navigate via bottom nav or link to Account 360 (`#/account/A01`).
2. `wait(1500)`
3. Scroll through Account K P Is, contact profile, and revenue gap pills.
4. Click "Draft Order" navigating to `#/order/A01`.
5. `wait(2000)`
6. Point to suggested order lines, unit prices, and estimated margin contribution.
7. Click `+` on an order line quantity to increase volume.
8. Observe margin calculation update and note supervisory approval rule badge.
9. Scroll down to show Return Claim R M A button and Account Camera Exemption toggle.
10. `wait(2000)`

---

### Scene 5: Sales Companion: Growth, Productivity, and Voice Debrief
- **Timing:** 3:25 to 4:10 (45 seconds)
- **URL:** `http://localhost:5173/?industry=cpg&country=US&persona=rep#/companion`

#### Spoken Narration (Phonetic ElevenLabs Form)
"Field reps should never have to juggle multiple disconnected applications.
The Sales Companion brings daily operational workflows into one unified workspace organized across three pillars: Growth, Productivity, and Learning.
Under Growth, the rep sees route safety alerts, traffic prompts, and customer pitch dossiers.
Under Productivity, reps submit leave requests, log travel mileage, and submit expense receipts with automatic policy checks against local limits.
The simulated voice debrief allows reps to dictate visit notes hands-free in the car.
The rule-based parser automatically extracts outcomes, follow-up commitments, and order intent, ready for rep confirmation.
And under Learning, compliance certifications due within thirty days are highlighted with bite-sized training modules."

#### Claude Chrome Session Action Steps
1. Click `Companion` in the bottom navigation (`#/companion`).
2. `wait(1500)`
3. Under the **Growth** tab, highlight the Safety Strip (weather, drive fatigue prompt) and Pre-call brief card.
4. Click the **Voice Debrief** simulation button, trigger sample dictation, and show parsed outcomes.
5. `wait(2000)`
6. Switch tab to **Productivity**: `click('button[data-act="companion-tab"][data-tab="productivity"]')`. Show Expense claim mock with automated policy threshold check and Leave balance.
7. Switch tab to **Learning**: `click('button[data-act="companion-tab"][data-tab="learning"]')`. Show Certification renewal tracker with 30-day countdown badge.
8. `wait(2000)`

---

### Scene 6: District Field Manager: Team Operations & Anti-Gaming Governance
- **Timing:** 4:10 to 5:05 (55 seconds)
- **URL:** `http://localhost:5173/?industry=cpg&country=US&persona=manager#/manager`

#### Spoken Narration (Phonetic ElevenLabs Form)
"Now let us switch to Jordan Taylor, our District Field Manager.
The Manager Home screen delivers a live command cockpit.
At the top, the Season Readiness banner shows that twelve of fourteen readiness items are green, highlighting pending rule approvals and stale data accounts before the cycle begins.
The district performance trend line tracks actual revenue against quarterly targets, complete with regional inflection points and realistic sales velocity.
Below, the Exception Queue centralizes all rep overrides and supervisor hold gates.
A I Assistor treats rep overrides not as disobedience, but as valuable ground-truth training signals.
The manager can review the rep's rationale, approve the exception in one tap, and dispatch constructive coaching prompts.
Built-in supervisory anti-gaming algorithms protect German Works Council B E T R V G eighty-seven compliance, ensuring rep telemetry is never used for punitive surveillance."

#### Claude Chrome Session Action Steps
1. Switch persona to `manager`: navigate to `#/manager`.
2. `wait(1500)`
3. Hover over the **Season Readiness Banner**: "Season readiness: 12 of 14 items ready". Click to expand the checklist.
4. Scroll to view the realistic district revenue trend chart with target vs actual lines and milestone markers.
5. Scroll down to the **Exception Queue**.
6. Hover over a pending rep override with reason "Competitor launched unannounced promotion".
7. Click `click('button[data-act="approve-override"]')` ("Approve Exception"). Notice the queue count decrements instantly.
8. Hover over the coaching prompts section.
9. `wait(2000)`

---

### Scene 7: Autonomous Agent Fleet Architecture
- **Timing:** 5:05 to 6:05 (60 seconds)
- **URL:** `http://localhost:5173/?industry=cpg&country=US&persona=admin#/agents`

#### Spoken Narration (Phonetic ElevenLabs Form)
"For enterprise architects and commercial operations leaders, transparency is non-negotiable.
The Agents screen opens the hood on the five-layer autonomous fleet: Experiences, Orchestration, Product Agents, Interfaces, and Shared Foundations.
Every agent contract is inspectable.
In the One Visit Trace view, we can adjust the visit time budget slider from fifteen to ninety minutes.
Watch as the knapsack solver dynamically refits high-value actions to maximize margin per minute.
The Gap Lifecycle view tracks every revenue opportunity from initial discovery through execution, supervisor unlock, and cash realization.
In the Tools and Guardrails catalog, we classify every tool as read-only or write-guarded.
Tapping the test raw write button demonstrates that unauthorized writes are blocked at the perimeter and logged to the security audit trail.
And the Memory Timeline gives reps and managers full control over episodic account memory, complete with retention expiry sliders and G D P R-compliant forget actions."

#### Claude Chrome Session Action Steps
1. Navigate to the `Agents` screen (`#/agents`).
2. `wait(1500)`
3. In the **Layers View** (A1), click on each layer card (Experiences, Orchestration, Product Agents) to show contract details.
4. Switch tab to **One Visit Trace** (A2): `click('button[data-act="set-agents-view"][data-view="trace"]')`.
5. Drag the visit budget slider from 45 min down to 20 min, then up to 75 min. Watch tool calls and knapsack action selections update live.
6. Switch tab to **Gap Lifecycle** (A3): `click('button[data-act="set-agents-view"][data-view="gap"]')`. Show 6-step discovery-to-cash stepper. Click the "Supervisor Hold Gate" and demonstrate unlock.
7. Switch tab to **Tools & Guardrails** (A4): `click('button[data-act="set-agents-view"][data-view="tools"]')`. Click test raw write and observe the red security denial toast and audit receipt.
8. Switch tab to **Memory Timeline** (A6): `click('button[data-act="set-agents-view"][data-view="memory"]')`. Adjust the retention slider (30 to 180 days) and toggle "Do not use".
9. `wait(2000)`

---

### Scene 8: Enterprise Quality, Evaluation & Release Gate System
- **Timing:** 6:05 to 7:00 (55 seconds)
- **URL:** `http://localhost:5173/?industry=cpg&country=US&persona=admin#/quality`

#### Spoken Narration (Phonetic ElevenLabs Form)
"A I systems cannot be deployed to enterprise sales forces without rigorous quality assurance.
The Quality screen presents our six-layer testing hierarchy.
The Golden Suite validates canonical cases against strict gate criteria: one hundred percent pass rate on critical compliance rules, and at least eighty percent on non-critical recommendations.
The Blind Set evaluation tests models against hold-out data, enforcing an automated tripwire if the performance gap exceeds five percentage points.
Our live regression table pulls directly from build metrics, verifying over one million assertions across twenty industries and eleven countries.
Operational error budgets limit safety and hallucination risks to near-zero tolerances per one thousand suggestions.
Finally, the Composite Release Gate synthesizes all sub-gates into an unequivocal Go, Fix, or Stop decision, with one-click export of the signed release charter."

#### Claude Chrome Session Action Steps
1. Navigate to the `Quality` screen (`#/quality`).
2. `wait(1500)`
3. Scroll through the **Six Test Layers** table (Data contracts, Golden suite, Regression, Journey, Authority, Offline).
4. Review the **Golden Suite** section, highlighting the 100% critical pass rule.
5. Highlight the **Blind Set Evaluation** card and the 5 percentage point gap limit indicator.
6. Point to the **Regression Table**, showing real counts read from `test-counts.json` (over 1,000,000 assertions).
7. Hover over the **Error Rate Budgets** per 1,000 suggestions and test the breach simulation toggle.
8. Scroll to the **Composite Release Gate Summary** showing overall `RELEASE CLEARED: GO`.
9. Click export release charter to show markdown download.
10. `wait(2000)`

---

### Scene 9: Portfolio Lab & Economic Impact Simulator
- **Timing:** 7:00 to 8:00 (60 seconds)
- **URL:** Click floating `Portfolio Lab` button (`button[data-act="open-lab"]`)

#### Spoken Narration (Phonetic ElevenLabs Form)
"Commercial leadership needs to forecast financial returns before approving deployment.
Tapping the floating Lab button opens the Portfolio Lab overlay.
In the A B testing simulator, commercial teams can model lift ranges, sample sizes, and rollout criteria under a pre-registered ninety-five percent confidence gate.
The R O I calculator models net gross-margin expansion.
Crucially, it includes an capability overlap discount slider, ensuring revenue uplifts from visit planning, gap detection, and suggested ordering are not double-counted.
The Outcomes Precedence simulator allows operators to toggle safety conditions to see which rule wins deterministically.
And the Model Gateway demonstrates our three-tier inference architecture: free deterministic rules for eighty percent of operational decisions, lightweight local models for summarization, and frontier models only when handling complex unstructured notes."

#### Claude Chrome Session Action Steps
1. Click floating `Portfolio Lab` button: `click('button[data-act="open-lab"]')` (or press `Shift+L`).
2. Modal opens smoothly with dark backdrop.
3. On the **A B Testing** tab (`L-AB`), drag the lift slider and sample size slider. Point to the 95% confidence rollout status.
4. Click the **R O I Calculator** tab: `click('button[data-act="set-lab-tab"][data-tab="roi"]')`. Adjust capability overlap discount slider from 15% to 35%. Show net annual value update.
5. Click the **Outcomes Precedence** tab: `click('button[data-act="set-lab-tab"][data-tab="outcomes"]')`. Toggle "Conflict detected" and "Data stale" checkboxes to show winning outcome change deterministically.
6. Click the **Model Gateway** tab: `click('button[data-act="set-lab-tab"][data-tab="decisions"]')`. Highlight 3-tier cost hierarchy: Tier 1 Rules ($0.00), Tier 2 Fast Model, Tier 3 Frontier.
7. Close the Lab modal: `click('button[data-act="close-lab-modal"]')`.
8. `wait(2000)`

---

### Scene 10: Product Manager Operations & Algorithmic Fairness
- **Timing:** 8:00 to 8:55 (55 seconds)
- **URL:** `http://localhost:5173/?industry=cpg&country=US&persona=admin#/pm`

#### Spoken Narration (Phonetic ElevenLabs Form)
"The Product Manager cockpit provides governance tools tailored for product leaders and algorithmic auditors.
The Metric Tree decomposes sales velocity into four multiplicative levers: Reach times Acceptance times Completion times Uplift.
Moving the what-if sliders immediately highlights the weakest lever in yellow, showing product teams exactly where adoption friction is eroding value.
The Market Decision Ledger records every policy rollout, pilot adjustment, and rollback with timestamped rationale.
In the Demographic Parity and Fairness section, the platform monitors recommendation density across account tiers and urban versus rural territories.
If allocation disparity crosses the configurable threshold, an automated disparity alert is triggered.
And the Cost and Speed economics card tracks model token expenses against a strict sub-two-hundred millisecond p95 latency budget."

#### Claude Chrome Session Action Steps
1. Navigate to the `PM` screen (`#/pm`).
2. `wait(1500)`
3. At the **Metric Tree** (P1), adjust the `Acceptance Rate` slider from 68% down to 50%, then `Completion Rate` slider up.
4. Point to the "Weakest Lever Detected" diagnostic highlight.
5. Scroll down to the **Market Decision Ledger** (P2). Filter by status: `Production`, `Pilot`, `Rollback`.
6. Scroll to **Demographic Parity & Fairness Checks** (P3). Adjust the `Review Threshold` slider from 80% to 90%, triggering the disparity inspection alert.
7. Scroll to **Cost and Speed Economics** (P4). Highlight the 142 ms p95 response time well below the 200 ms budget.
8. `wait(2000)`

---

### Scene 11: Cross-Domain Agility: The Regulated Pharma Pivot
- **Timing:** 8:55 to 9:45 (50 seconds)
- **URL:** `http://localhost:5173/?industry=pharma&country=IN&persona=rep#/today`

#### Spoken Narration (Phonetic ElevenLabs Form)
"To demonstrate the true flexibility of this platform, let us perform a live domain switch.
In one click, we transition from Consumer Packaged Goods in the U S to Pharmaceuticals in India.
Instantly, the entire application transforms.
Store visits become Doctor and Clinic details.
Reorder quantities become medical sample distribution with mandatory signature capture.
Financial values are formatted in Indian rupees, lakhs, and crores.
Let us test the A I Assistant with a forbidden query.
When asked to recommend an off-label clinical dosage, the assistant issues a plain refusal, cites the medical compliance guardrail, and logs the event to the audit trail.
Clinical and agronomic claims remain strictly human.
The software enforces governance by design."

#### Claude Chrome Session Action Steps
1. Navigate directly to `?industry=pharma&country=IN&persona=rep#/today` (or use Shift+D Presenter menu).
2. `wait(1500)`
3. Show Today screen with Indian clinic names ("Dr. Sharma Clinic"), I N R currency symbols, and medical rep metrics.
4. Click the bottom-right **Ask A I** launcher button: `click('button[data-act="open-assistant"]')`.
5. In the bottom sheet, click restricted prompt chip: `click('button[data-act="assistant-chip"]')`.
6. Observe immediate refusal: "I cannot answer clinical or off-label dosage questions per medical compliance guardrail G-PHARMA-02."
7. Point to the "Why can't you answer that?" explanation and audit log confirmation.
8. Close the Ask A I sheet: `click('button[data-act="close-assistant"]')`.
9. `wait(2000)`

---

### Scene 12: Executive Close & Call to Action
- **Timing:** 9:45 to 10:30 (45 seconds)
- **URL:** `http://localhost:5173/pitch.html` (Slide 12: The 90-Day Bounded Pilot Blueprint)

#### Spoken Narration (Phonetic ElevenLabs Form)
"In summary, A I Assistor is not another C R M system asking your reps to enter more data.
It is an intelligent, constraint-coupled decision engine that operates cleanly over your existing software stack.
We engage through a disciplined ninety-day bounded pilot program.
Thirty days for data ingestion and vocabulary pack configuration.
Thirty days running matched-territory trials against synthetic control groups.
And thirty days of audited difference-in-differences financial measurement to prove net gross-margin expansion before enterprise rollout.
The technology is built, tested across more than one million assertions, and ready to deploy.
Thank you for your time. Let us partner to unleash the full potential of your commercial field organization."

#### Claude Chrome Session Action Steps
1. Navigate back to `pitch.html` on Slide 12 ("The 90-Day Bounded Pilot Blueprint").
2. `wait(1500)`
3. Hover over the three pilot phases: Month 1 Calibration, Month 2 Matched-Territory Execution, Month 3 Causal Margin Audit.
4. Highlight the commercial terms: $18 per rep per month, zero capital expenditure, zero C R M disruption.
5. Hold on the closing slide for 5 seconds as audio finishes.
6. End recording.

---

## 4. Claude Chrome Session Automated Execution Runner (Node/Playwright)

To execute this exact walkthrough automatically with timed pauses matching ElevenLabs audio narration, run:

```bash
node scripts/record-demo-walkthrough.mjs
```

*(See [`scripts/record-demo-walkthrough.mjs`](file:///c:/Users/nitin/Desktop/FracsNet/Claude%20Projects/AI%20Assistor%20Sales%20Execution/AI-assistor-sales-execution/scripts/record-demo-walkthrough.mjs) for the executable runner).*
