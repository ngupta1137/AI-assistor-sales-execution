# AI Assistor Sales Execution: Master Demo Recording Script & Claude Automation Protocol

This document provides the complete, synchronized demo recording script and browser automation protocol for **AI Assistor Sales Execution**. It is designed to be executed by **Claude Chrome Session** (or Puppeteer / Playwright automation) while recording the screen, with voiceover audio generated using your cloned voice in **ElevenLabs**.

---

## 1. Recording Setup & Studio Parameters

### 1.1 Claude Chrome Session Environment
- **Browser Window Resolution:** 1920 x 1080 (16:9 Full HD).
- **Emulated Device / Frame:**
  - **Option A (Desktop Executive View):** Full browser window at 1920 x 1080 showing phone frame container in center with side margins, or wide screen mode.
  - **Option B (Clean Mobile Frame Focus):** Viewport set to 412 x 915 (Pixel 7) or 390 x 844 (iPhone 14) with device scale factor 2 for crisp mobile recording, surrounded by dark studio backdrop.
- **Base URL:**
  - Local: `http://localhost:5173/` (start with `npm run dev` or `npx serve docs`)
  - Hosted: `https://ai-assistor-sales-execution.vercel.app/`
- **Presentation Deck URL:** `http://localhost:5173/pitch.html` (or `docs/pitch.html`)
- **Animation & Transitions:** Smooth easing. Minimum dwell time on each screen is 3 to 5 seconds to allow viewers to absorb the UI.
- **Audio Output:** Cloned voice generated in ElevenLabs (WAV 44.1kHz, 16-bit).

### 1.2 ElevenLabs Voice Clone Settings
- **Voice Model:** Eleven Multilingual v2 or Eleven English v1.
- **Stability:** 55% (natural dynamic cadence).
- **Clarity / Similarity:** 85% (high fidelity to your cloned voice).
- **Style Exaggeration:** 15% (authoritative, clear enterprise executive tone).
- **Pacing:** 140 to 150 words per minute.

---

## 2. Master Storyboard & Scene Breakdown

| Scene # | Target Duration | Screen / Route | Focus Persona & Capability |
|---|---|---|---|
| **Scene 1** | 0:00 - 0:45 (45s) | `pitch.html` (Slides 1 & 2) | Executive Hook: The Closed-Loop Solver & The Form Trap |
| **Scene 2** | 0:45 - 1:20 (35s) | `index.html#/setup` | Dynamic Multi-Domain Engine (20 Industries x 11 Countries) |
| **Scene 3** | 1:20 - 2:30 (70s) | `#/today` -> `#/brief/A01` | Frontline Rep: 5-Decision Solver, 7 Outcomes & Exact Wording |
| **Scene 4** | 2:30 - 3:25 (55s) | `#/account/A01` -> `#/order/A01` | In-Visit Execution: Gap Detection, Orders & Margin Guardrails |
| **Scene 5** | 3:25 - 4:10 (45s) | `#/companion` | Sales Companion: Growth, Safety, Voice Debrief & Learning |
| **Scene 6** | 4:10 - 5:05 (55s) | `#/manager` | District Manager: Target Cockpit, Readiness & Exception Queue |
| **Scene 7** | 5:05 - 6:05 (60s) | `#/agents` | Agent Fleet: 5 Layers, Knapsack Solver Slider & Memory |
| **Scene 8** | 6:05 - 7:00 (55s) | `#/quality` | Quality & Release Gates: Golden Suite, Blind Eval & 1M Checks |
| **Scene 9** | 7:00 - 8:00 (60s) | Portfolio Lab (`button[open-lab]`) | Portfolio Lab: A/B Rollout, ROI Calculator & Model Gateway |
| **Scene 10** | 8:00 - 8:55 (55s) | `#/pm` | Product Manager: Metric Tree, Parity Monitor & Latency |
| **Scene 11** | 8:55 - 9:45 (50s) | `?industry=pharma&country=IN#/today` | Cross-Domain Agility: Indian Pharma & Off-Label Guardrails |
| **Scene 12** | 9:45 - 10:30 (45s) | `pitch.html` (Slide 12) | Commercial Close: The 90-Day Bounded Pilot Blueprint |

**Total Runtime:** Approximately 10 minutes 30 seconds.

---

## 3. Scene-by-Scene Script & Execution Protocol

### Scene 1: Executive Hook & The Enterprise Dilemma
- **Timestamp:** 0:00 to 0:45 (45 seconds)
- **Target URL:** `http://localhost:5173/pitch.html`

#### Spoken Narration (ElevenLabs Voiceover)
"Welcome. Today we are demonstrating AI Assistor for Sales Execution.
Global manufacturers spend over two thousand dollars per rep each year on enterprise CRM, yet frontline field teams still spend over two-thirds of their day manually navigating static forms and disconnected instructions.
Coverage planning, route navigation, in-store actions, order drafting, and manager exception handling operate in isolated silos.
AI Assistor solves this by functioning as a closed-loop intelligence overlay on your existing Salesforce, StayinFront, Veeva, and SAP investments.
It requires zero system replacement, deploys in three to five weeks, and connects all five core commercial decisions into a single real-time constraint graph."

#### Claude Chrome Session Automation Steps
1. `goto("http://localhost:5173/pitch.html")`
2. `wait(1500)`
3. Hover over the top badges: `Enterprise Intelligence Overlay`, `Offline PWA Runtime`, `Closed-Loop Solver`.
4. `wait(2000)`
5. Click `button#btn-next` to transition to Slide 2 ("The $2,100/Rep CRM Form Trap").
6. Hover over the left card ("The 5 Disconnected Silos Today") and right card ("The AI Assistor Difference").
7. `wait(3000)`

---

### Scene 2: Dynamic Multi-Domain Engine
- **Timestamp:** 0:45 to 1:20 (35 seconds)
- **Target URL:** `http://localhost:5173/#/setup`

#### Spoken Narration (ElevenLabs Voiceover)
"Let us step inside the live application.
One of the most powerful architectural achievements of this platform is that it is completely config-driven.
A single codebase powers twenty distinct industries across eleven countries.
There is not a single hardcoded industry noun, currency symbol, or date format in any screen.
Whether you are deploying in Consumer Goods in North America, Paints and Building Materials in the United Kingdom, or Pharmaceuticals in India, the application instantly adapts its vocabulary, compliance guardrails, and commercial math.
Let us launch the demo for Consumer Packaged Goods in the United States, operating as Alex Morgan, our frontline field rep."

#### Claude Chrome Session Automation Steps
1. `goto("http://localhost:5173/#/setup")`
2. `wait(1500)`
3. Scroll smoothly through the industry grid showcasing tiles: CPG, Pharma, Med Devices, Beverages, Building Materials, Telecom, Financial Services.
4. `wait(1000)`
5. Click industry tile: `button[data-industry="cpg"]` (or ensure CPG is active).
6. Click country pill: `button[data-country="US"]`.
7. Click persona selector: `button[data-persona="rep"]`.
8. Click `button[data-action="start-demo"]` ("Start Demo").
9. `wait(2000)`

---

### Scene 3: Frontline Field Rep: Morning Brief & The 5-Decision Constraint Graph
- **Timestamp:** 1:20 to 2:30 (70 seconds)
- **Target URL:** `http://localhost:5173/?industry=cpg&country=US&persona=rep#/today` -> `#/brief/A01`

#### Spoken Narration (ElevenLabs Voiceover)
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

#### Claude Chrome Session Automation Steps
1. On `#/today`, pause to show territory progress, route summary, and accounts ranked by value.
2. Hover over the top context bar: "Recommendations apply to this context...".
3. Toggle `Blitz mode` on and off to show rapid execution view.
4. Click on the first account card to navigate to `#/brief/A01`.
5. `wait(2000)`
6. Scroll down to show recommendation cards with status chips: `Approved`, `In date`, `Applies here`.
7. On a stale card, click `button[action-refresh-stale]` ("Refresh"). Observe state transition to green Approved.
8. Click the status chip row on a card to open the modal **Rule Drawer**.
9. `wait(2000)`: Hover over rule owner, named approver, effective dates, and "Why this applied".
10. Close the drawer: `click(".rule-drawer-close")`.
11. Scroll to the exact-wording gate card. Notice the action button is hidden.
12. Click checkbox `input[confirm-exact-wording]` ("I have read this wording").
13. Observe the action button unlock immediately.
14. Click the card trace to expand the **Record Kept** audit receipt showing rule version, data age, and audit event ID.
15. Click `button[open-flag]` on a card, select reason chip `button[flag-reason="not_true"]`, and submit. Show the flagged chip.
16. `wait(2000)`

---

### Scene 4: In-Visit Execution: Account 360, Order Builder & Margin Guardrails
- **Timestamp:** 2:30 to 3:25 (55 seconds)
- **Target URL:** `http://localhost:5173/?industry=cpg&country=US&persona=rep#/account/A01` -> `#/order/A01`

#### Spoken Narration (ElevenLabs Voiceover)
"Next, Alex moves to the Account 360 view.
The system displays past order velocity, compliance history, and open revenue gaps.
Every gap detected has an explicit revenue estimate and confidence level.
When the buyer agrees, Alex transitions directly into the Order and Proposal Suggestion engine.
Unlike generic ordering tools, AI Assistor calculates line-level margins and depot availability live.
Notice what happens when Alex adjusts order quantities.
If a proposed quantity exceeds credit limits or triggers an unbudgeted trade rebate, the system enforces a supervisory hold gate.
The rep can also log Return Material Authorizations with photo evidence, routing damaged goods directly to Accounts Receivable without bypassing segregation of duties.
And where store policies prohibit photography, an authorized camera exemption protects the rep compliance score."

#### Claude Chrome Session Automation Steps
1. Navigate via bottom nav or link to Account 360 (`#/account/A01`).
2. `wait(1500)`
3. Scroll through Account KPIs, contact info, and gap pills.
4. Click "Draft Order" or navigate to `#/order/A01`.
5. `wait(2000)`
6. Point to suggested order lines, unit prices, and estimated margin.
7. Click `+` on an order line quantity to increase volume.
8. Observe margin calculation update and note any supervisory approval rule badge.
9. Scroll down to show Return Claim (RMA) button and Account Camera Exemption toggle.
10. `wait(2000)`

---

### Scene 5: Sales Companion: Growth, Productivity, and Voice Debrief
- **Timestamp:** 3:25 to 4:10 (45 seconds)
- **Target URL:** `http://localhost:5173/?industry=cpg&country=US&persona=rep#/companion`

#### Spoken Narration (ElevenLabs Voiceover)
"Field reps should never have to juggle multiple disconnected applications.
The Sales Companion brings daily operational workflows into one unified workspace organized across three pillars: Growth, Productivity, and Learning.
Under Growth, the rep sees route safety alerts, traffic prompts, and customer pitch dossiers.
Under Productivity, reps submit leave requests, log travel mileage, and submit expense receipts with automatic policy checks against local limits.
The simulated voice debrief allows reps to dictate visit notes hands-free in the car.
The rule-based parser automatically extracts outcomes, follow-up commitments, and order intent, ready for rep confirmation.
And under Learning, compliance certifications due within thirty days are highlighted with bite-sized training modules."

#### Claude Chrome Session Automation Steps
1. Click `Companion` in the bottom navigation (`#/companion`).
2. `wait(1500)`
3. Under the **Growth** tab, highlight the Safety Strip (weather, drive fatigue prompt) and Pre-call brief card.
4. Click the **Voice Debrief** simulation button, trigger sample dictation, and show parsed outcomes.
5. `wait(2000)`
6. Switch tab to **Productivity**. Show Expense claim mock with automated policy threshold check and Leave balance.
7. Switch tab to **Learning**. Show Certification renewal tracker with 30-day countdown badge.
8. `wait(2000)`

---

### Scene 6: District Field Manager: Team Operations & Anti-Gaming Governance
- **Timestamp:** 4:10 to 5:05 (55 seconds)
- **Target URL:** `http://localhost:5173/?industry=cpg&country=US&persona=manager#/manager`

#### Spoken Narration (ElevenLabs Voiceover)
"Now let us switch to Jordan Taylor, our District Field Manager.
The Manager Home screen delivers a live command cockpit.
At the top, the Season Readiness banner shows that twelve of fourteen readiness items are green, highlighting pending rule approvals and stale data accounts before the cycle begins.
The district performance trend line tracks actual revenue against quarterly targets, complete with regional inflection points and realistic sales velocity.
Below, the Exception Queue centralizes all rep overrides and supervisor hold gates.
AI Assistor treats rep overrides not as disobedience, but as valuable ground-truth training signals.
The manager can review the rep's rationale, approve the exception in one tap, and dispatch constructive coaching prompts.
Built-in supervisory anti-gaming algorithms protect German Works Council BetrVG 87 compliance, ensuring rep telemetry is never used for punitive surveillance."

#### Claude Chrome Session Automation Steps
1. Open Presenter menu (or URL) and switch persona to `manager` (`#/manager`).
2. `wait(1500)`
3. Hover over the **Season Readiness Banner**: "Season readiness: 12 of 14 items ready". Click to expand the checklist.
4. Scroll to view the realistic district revenue trend chart with target vs actual lines and milestone markers.
5. Scroll down to the **Exception Queue**.
6. Hover over a pending rep override with reason "Competitor launched unannounced promotion".
7. Click `button[approve-override]` ("Approve Exception"). Notice the queue count decrements instantly.
8. Hover over the coaching prompts section.
9. `wait(2000)`

---

### Scene 7: Autonomous Agent Fleet Architecture
- **Timestamp:** 5:05 to 6:05 (60 seconds)
- **Target URL:** `http://localhost:5173/?industry=cpg&country=US&persona=admin#/agents`

#### Spoken Narration (ElevenLabs Voiceover)
"For enterprise architects and commercial operations leaders, transparency is non-negotiable.
The Agents screen opens the hood on the five-layer autonomous fleet: Experiences, Orchestration, Product Agents, Interfaces, and Shared Foundations.
Every agent contract is inspectable.
In the One Visit Trace view, we can adjust the visit time budget slider from fifteen to ninety minutes.
Watch as the knapsack solver dynamically refits high-value actions to maximize margin per minute.
The Gap Lifecycle view tracks every revenue opportunity from initial discovery through execution, supervisor unlock, and cash realization.
In the Tools and Guardrails catalog, we classify every tool as read-only or write-guarded.
Tapping the test raw write button demonstrates that unauthorized writes are blocked at the perimeter and logged to the security audit trail.
And the Memory Timeline gives reps and managers full control over episodic account memory, complete with retention expiry sliders and GDPR-compliant forget actions."

#### Claude Chrome Session Automation Steps
1. Navigate to the `Agents` screen (`#/agents`).
2. `wait(1500)`
3. In the **Layers View** (A1), click on each layer card (Experiences, Orchestration, Product Agents) to show contract details.
4. Switch tab to **One Visit Trace** (A2).
5. Drag the `visit-budget-slider` from 45 min down to 20 min, then up to 75 min. Watch tool calls and knapsack action selections update.
6. Switch tab to **Gap Lifecycle** (A3). Show 6-step discovery-to-cash stepper. Click the "Supervisor Hold Gate" and demonstrate unlock.
7. Switch tab to **Tools & Guardrails** (A4). Click `button[test-blocked-write]` and observe the red security denial toast and audit receipt.
8. Switch tab to **Memory Timeline** (A6). Adjust the retention slider (30 to 180 days) and toggle "Do not use".
9. `wait(2000)`

---

### Scene 8: Enterprise Quality, Evaluation & Release Gate System
- **Timestamp:** 6:05 to 7:00 (55 seconds)
- **Target URL:** `http://localhost:5173/?industry=cpg&country=US&persona=admin#/quality`

#### Spoken Narration (ElevenLabs Voiceover)
"AI systems cannot be deployed to enterprise sales forces without rigorous quality assurance.
The Quality screen presents our six-layer testing hierarchy.
The Golden Suite validates canonical cases against strict gate criteria: one hundred percent pass rate on critical compliance rules, and at least eighty percent on non-critical recommendations.
The Blind Set evaluation tests models against hold-out data, enforcing an automated tripwire if the performance gap exceeds five percentage points.
Our live regression table pulls directly from build metrics, verifying over one million assertions across twenty industries and eleven countries.
Operational error budgets limit safety and hallucination risks to near-zero tolerances per one thousand suggestions.
Finally, the Composite Release Gate synthesizes all sub-gates into an unequivocal Go, Fix, or Stop decision, with one-click export of the signed release charter."

#### Claude Chrome Session Automation Steps
1. Navigate to the `Quality` screen (`#/quality`).
2. `wait(1500)`
3. Scroll through the **Six Test Layers** table (Data contracts, Golden suite, Regression, Journey, Authority, Offline).
4. Review the **Golden Suite** section, highlighting the 100% critical pass rule.
5. Highlight the **Blind Set Evaluation** card and the 5 percentage point gap limit indicator.
6. Point to the **Regression Table**, showing real counts read from `test-counts.json` (over 1,000,000 assertions).
7. Hover over the **Error Rate Budgets** per 1,000 suggestions and test the breach simulation toggle.
8. Scroll to the **Composite Release Gate Summary** showing overall `RELEASE CLEARED: GO`.
9. Click `button[export-release-charter]` ("Export Sign-off") to show markdown download.
10. `wait(2000)`

---

### Scene 9: Portfolio Lab & Economic Impact Simulator
- **Timestamp:** 7:00 to 8:00 (60 seconds)
- **Target URL:** Click floating `Portfolio Lab` button (`button[open-lab]`)

#### Spoken Narration (ElevenLabs Voiceover)
"Commercial leadership needs to forecast financial returns before approving deployment.
Tapping the floating Lab button opens the Portfolio Lab overlay.
In the A/B testing simulator, commercial teams can model lift ranges, sample sizes, and rollout criteria under a pre-registered ninety-five percent confidence gate.
The ROI calculator models net gross-margin expansion.
Crucially, it includes an capability overlap discount slider, ensuring revenue uplifts from visit planning, gap detection, and suggested ordering are not double-counted.
The Outcomes Precedence simulator allows operators to toggle safety conditions to see which rule wins deterministically.
And the Model Gateway demonstrates our three-tier inference architecture: free deterministic rules for eighty percent of operational decisions, lightweight local models for summarization, and frontier models only when handling complex unstructured notes."

#### Claude Chrome Session Automation Steps
1. Click the floating `Portfolio Lab` button (or press `Shift+L`).
2. Modal opens smoothly with dark backdrop.
3. On the **A/B Testing** tab (`L-AB`), drag the lift slider and sample size slider. Point to the 95% confidence rollout status.
4. Click the **ROI Calculator** tab (`L-ROI`). Adjust the `capability overlap discount` slider from 15% to 35%. Show net annual value update.
5. Click the **Outcomes Precedence** tab (`L-OUT`). Toggle "Conflict detected" and "Data stale" checkboxes to show the winning outcome change deterministically.
6. Click the **Model Gateway** tab (`L-DEC`). Highlight the 3-tier cost hierarchy: Tier 1 Rules ($0.00), Tier 2 Fast Model, Tier 3 Frontier.
7. Close the Lab modal: `click(".lab-modal-close")`.
8. `wait(2000)`

---

### Scene 10: Product Manager Operations & Algorithmic Fairness
- **Timestamp:** 8:00 to 8:55 (55 seconds)
- **Target URL:** `http://localhost:5173/?industry=cpg&country=US&persona=admin#/pm`

#### Spoken Narration (ElevenLabs Voiceover)
"The Product Manager cockpit provides governance tools tailored for product leaders and algorithmic auditors.
The Metric Tree decomposes sales velocity into four multiplicative levers: Reach times Acceptance times Completion times Uplift.
Moving the what-if sliders immediately highlights the weakest lever in yellow, showing product teams exactly where adoption friction is eroding value.
The Market Decision Ledger records every policy rollout, pilot adjustment, and rollback with timestamped rationale.
In the Demographic Parity and Fairness section, the platform monitors recommendation density across account tiers and urban versus rural territories.
If allocation disparity crosses the configurable threshold, an automated disparity alert is triggered.
And the Cost and Speed economics card tracks model token expenses against a strict sub-two-hundred millisecond p95 latency budget."

#### Claude Chrome Session Automation Steps
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
- **Timestamp:** 8:55 to 9:45 (50 seconds)
- **Target URL:** `http://localhost:5173/?industry=pharma&country=IN&persona=rep#/today`

#### Spoken Narration (ElevenLabs Voiceover)
"To demonstrate the true flexibility of this platform, let us perform a live domain switch.
In one click, we transition from Consumer Packaged Goods in the US to Pharmaceuticals in India.
Instantly, the entire application transforms.
Store visits become Doctor and Clinic details.
Reorder quantities become medical sample distribution with mandatory signature capture.
Financial values are formatted in Indian rupees, lakhs, and crores.
Let us test the AI Assistant with a forbidden query.
When asked to recommend an off-label clinical dosage, the assistant issues a plain refusal, cites the medical compliance guardrail, and logs the event to the audit trail.
Clinical and agronomic claims remain strictly human.
The software enforces governance by design."

#### Claude Chrome Session Automation Steps
1. Press `Shift+D` to open Presenter menu (or navigate directly to `?industry=pharma&country=IN&persona=rep#/today`).
2. Select `Pharma`, `India`, `Rep`, and click apply.
3. `wait(1500)`
4. Show Today screen with Indian clinic names ("Dr. Sharma Clinic"), INR currency symbols, and medical rep metrics.
5. Click the bottom-right **Ask AI** launcher button.
6. In the bottom sheet, click or type a restricted prompt: "Can I recommend off-label dosage for pediatrics?".
7. Observe immediate refusal: "I cannot answer clinical or off-label dosage questions per medical compliance guardrail G-PHARMA-02."
8. Point to the "Why can't you answer that?" explanation and audit log confirmation.
9. Close the Ask AI sheet.
10. `wait(2000)`

---

### Scene 12: Executive Close & Call to Action
- **Timestamp:** 9:45 to 10:30 (45 seconds)
- **Target URL:** `http://localhost:5173/pitch.html` (Slide 12: The 90-Day Bounded Pilot Blueprint)

#### Spoken Narration (ElevenLabs Voiceover)
"In summary, AI Assistor is not another CRM system asking your reps to enter more data.
It is an intelligent, constraint-coupled decision engine that operates cleanly over your existing software stack.
We engage through a disciplined ninety-day bounded pilot program.
Thirty days for data ingestion and vocabulary pack configuration.
Thirty days running matched-territory trials against synthetic control groups.
And thirty days of audited difference-in-differences financial measurement to prove net gross-margin expansion before enterprise rollout.
The technology is built, tested across more than one million assertions, and ready to deploy.
Thank you for your time. Let us partner to unleash the full potential of your commercial field organization."

#### Claude Chrome Session Automation Steps
1. Navigate back to `pitch.html` on Slide 12 ("The 90-Day Bounded Pilot Blueprint").
2. `wait(1500)`
3. Hover over the three pilot phases: Month 1 Calibration, Month 2 Matched-Territory Execution, Month 3 Causal Margin Audit.
4. Highlight the commercial terms: $18 per rep per month, zero capital expenditure, zero CRM disruption.
5. Hold on the closing slide for 5 seconds as audio finishes.
6. End recording.

---

## 4. Claude Chrome Session Automated Execution Runner (Node/Playwright)

To execute this exact walkthrough automatically with timed pauses matching ElevenLabs audio narration, Claude or a local developer can run the following turnkey script:

```bash
node scripts/record-demo-walkthrough.mjs
```

*(See `scripts/record-demo-walkthrough.mjs` for the executable Playwright automation script).*
