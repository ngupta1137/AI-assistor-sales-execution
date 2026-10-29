Add a context-aware AI assistant to every screen of AI Assistor Sales Execution. Read PRD.md and CLAUDE.md first. Where this prompt and PRD.md differ, tell me, then follow this prompt for the assistant only.

## Why
Today the assistant exists only on one screen (`src/core/screens/ask.js`, PRD R9). A prospect should see an assistant on every screen, that knows what they are looking at, answers in their industry's words and their country's formats, and can take them to the next step. Same pattern for all 10 industries and 8 countries, with no per-screen hard-coding of industry nouns.

## What to build

### 1. Floating assistant on every screen
- A launcher button (bottom right of the phone frame, above the dock) on every screen except Setup. On Setup, show a small "About this demo" version with 3 questions.
- Tap opens a bottom sheet (chat panel) that keeps its history while the user moves between screens. Close with a button, Escape, or a tap outside. Focus is trapped while open and returned to the launcher on close. Fully keyboard and screen-reader usable.
- Header shows "AI Assistor" and a plain line: "Sample data. Answers come from configured rules and this scenario's data, not a live model."
- Keep the existing Ask AI screen as the full-page view of the same chat. Both views share one conversation and one engine.

### 2. Context awareness
The assistant receives a context object on every open: `{screen, persona, accountId?, actionId?, visitId?, orderId?, filters?}`. Suggested questions and answers change with it.

Cover at least these screens, each with 4 to 6 suggested questions per persona (rep, manager) in a new pack section `assistantContext`:
- Today: what to do first, why this order, what can wait, how the time budget was used.
- Visit brief: why is this action ranked first, what did the agent compare against, how sure is it, what happens if I override, what evidence is missing.
- Account 360: summary of this {account}, what changed since the last {visit}, which {offerings} are gaps, who is the {contact}.
- Action detail: how was the value estimated, what evidence supports it, what is the effort, what is the guardrail on this action.
- Order or proposal builder: why these lines, what is blocking send, what rule applies, what changes if I edit a line.
- Visit complete: what to log, what carries to next time, what the manager will see.
- Route plan: why this sequence, what if I skip one, what if I run late.
- Manager home and exception queue: which overrides need attention, which reps are drifting, what to coach, patterns in override reasons.
- Agent controls: what each agent does, what it cannot do, what happens when I press stop.
- How this is configured and Problems we solve: explain the packs, how to add an industry, which problem maps to which capability.

### 3. Answer engine (rule-based, grounded, honest)
- Put the engine in `src/core/assistant/` (`engine.js`, `intents.js`, `router.js`, `ui.js`). Refactor `ask.js` to use it. No answer logic inside screen files.
- Flow: normalise question, detect intent (keyword and phrase scoring plus the current context), pick a handler, build the answer from real generated data for the current persona and territory, then format with vocabulary tokens and country formatting.
- Every answer shows a short "Based on" line naming what it used (for example "today's plan, 6 {accounts}, last 90 days of {visits}") and, where it applies, links such as "Open this {account}" or "Go to the visit brief" that navigate in the app.
- Handlers read live app state: if the user approved, adjusted or overrode an item, the next answer reflects that. Numbers must match what the screen shows.
- Fallback: if no intent matches, say so plainly, list what the assistant can answer on this screen, and show the suggested questions. Never invent an answer.
- Typing indicator for 400 to 700 ms before the reply (respect reduced-motion). Responses are deterministic for a given seed, so demos repeat.

### 4. Guardrails
- Read each pack's `guardrails`. A question that asks for something outside scope gets a refusal in plain language plus the allowed alternative. Examples:
  - Pharma and medical devices: no clinical, dosing, efficacy or safety claims.
  - Financial services: the assistant never sets price, rate or approves credit.
  - Agri: crop-protection advice follows the label only, and points to the label and the agronomist.
  - All: no promises of results, no performance claims, no real company names.
- Add a "Why can't you answer that?" explanation that shows which guardrail applied.
- Overrides and refusals are logged to the audit log with persona and screen.

### 5. Actions the assistant can take (P1, only after the above passes)
- Navigate: "show me the {account} with the biggest gap" opens Account 360.
- Prefill: "draft the {order} for this {account}" opens the builder with the suggested lines (the user still confirms).
- Never approve, send or override on the user's behalf. Always hand back to the user to confirm.

### 6. Pack changes
Extend the pack schema and the validator (`scripts/` and the pack check in tests) with:
- `assistantContext`: map of screen to persona to list of `{q, intent}` using vocabulary tokens.
- `assistantAnswers`: industry-specific phrasing for the intents that need it (guardrail explanations, "how to talk to the {contact}", "what does a good {visit} look like").
- `assistantRefusals`: 4 to 6 out-of-scope question patterns with refusal text, each tied to a guardrail id.
Write distinct content for all 10 industries, in the words a practitioner would use. No copy-paste between industries apart from structure. Country packs need no new fields; the engine must use country formatting for money, dates and distances.

### 7. Presenter menu
Add a toggle "Show assistant" (default on) and a "Reset chat" button. URL parameter `assistant=off` hides it for a cleaner screenshot.

## Content rules (same as CLAUDE.md)
Fictional data only. Plain language, short sentences, no em dashes, no hype words. No performance claims. Label sample data. No hard-coded industry nouns; use tokens.

## Tests
- Extend the Playwright suite: for every industry x country combination and both personas, open every screen, open the assistant, click each suggested question, and assert: an answer appears, no console error, no leftover `{token}`, no wrong-industry noun (for example "store" in pharma or financial services), and the "Based on" line is present.
- Guardrail tests: ask one out-of-scope question per regulated industry (pharma, meddevices, finserv, agri) and assert the refusal text and the audit log entry.
- State test: override an item in the brief, open the manager exception queue, ask "what needs my attention", assert the answer mentions that override.
- Accessibility smoke test: focus trap, Escape closes, launcher is reachable by keyboard.
- `npm test` and `npm run build` must pass, and `docs/index.html` must be rebuilt and committed.

## Optional hook for a live model (do not enable by default)
Add an adapter interface `src/core/assistant/provider.js` with `rule` (default) and `live` (calls a user-supplied endpoint). The live provider must be off in the shipped build, must never contain an API key in the repo, and must send only the generated sample data and the question. Document how to turn it on in the README. If you think this is a bad idea for a static demo, say so and skip it.

## Git
Work on a branch, commit after each step below, push after each commit, never force-push. Open a pull request into `main` titled "Add AI assistant across all screens" with a summary and test results. Steps:
a. Engine, schema and validator, one industry (consumer goods) and one country (US) on 3 screens
b. Launcher and bottom sheet on all screens, shared history, Ask AI page refactor
c. Context content for all 10 industries and both personas
d. Guardrails, refusals, audit log entries
e. Tests across all combinations, fix every failure, update README (how to add assistant content to a new pack) and PRD (extend R9, add the context table), rebuild `docs/index.html`

## First reply
Give me a short plan: file list, the new pack schema (JSDoc), the context table of screens and questions for the consumer goods pack, and the test approach. Then proceed without waiting. At the end, give me: what is done, test results, known gaps, the PR link, and confirm `git status` is clean.
