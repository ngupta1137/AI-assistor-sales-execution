# Prompt: add more industry domains

Paste everything below the line into Antigravity.

---

You are working in the repository `ngupta1137/ai-assistor-sales-execution`. Read `CLAUDE.md`, `AGENTS.md`, `PRD.md` and `README.md` first. Their rules bind you.

## Objective
Add six new industry packs to the existing product, each complete (pack, assistant content, Companion content), working in all 11 country packs. Result: 20 industries x 11 countries = 220 combinations, all tests green, no change to screens or core code unless a test proves a defect.

## The six domains
Add exactly these. Do not add others in this task.

| id | Name | Accounts | Segments (2 or 3) | Regulated or sensitive point to encode as a guardrail |
|---|---|---|---|---|
| `insurance` | Insurance distribution | Independent agencies, brokers, bank branches | Agencies, brokers, branch partners | Agents never give personal advice, quote a premium or approve a claim. Product facts come from the approved brochure only. |
| `animalhealth` | Animal health | Vet clinics, livestock farms, pet stores | Clinics, farms, pet retail | No dosage, diagnosis or efficacy claims. Prescription items only through a vet. Follow the label. |
| `hygiene` | Hygiene and cleaning supplies | Hotels, offices, care homes, contract cleaners | Hospitality, facilities, cleaning contractors | Chemical safety questions go to the technical desk and the safety data sheet. No mixing advice. |
| `logistics` | Logistics and courier services | Online sellers, SMEs, wholesalers | E-commerce sellers, SMEs, distributors | Rates come from the rate card. Agents never promise delivery times or claims outcomes. |
| `education` | School and education supplies | Schools, training providers, bookshops | Schools, training providers, retail | Child data stays out of the product. No claims about learning outcomes. Tenders follow procurement rules. |
| `packaging` | Packaging and print | Food makers, retailers, manufacturers | Food and drink makers, retail brands, industrial | Food-contact claims only from the certificate on file. No sustainability claims without a test report. |

## Step 1. Plan before you code (short, written in your reply)
State: objective, the decision (why these six), options you rejected, recommendation, risks, success measures, what you are not doing. Flag any domain you think is a poor fit and say why. Do not change the list without saying so.

## Step 2. Study the pattern
Read one complete existing industry end to end: `src/packs/industries/foodservice.js`, `foodservice.assistant.js`, `foodservice.companion.js`, plus `src/packs/schema.js`, `src/packs/assistant-base.js`, `src/packs/index.js`. Copy the structure, never the sentences.

## Step 3. For each domain create three files
`src/packs/industries/<id>.js`, `<id>.assistant.js`, `<id>.companion.js`, then register in `src/packs/index.js`.

Each pack must have:
- 2 or 3 segments, one with `key: true`. Account `types` need `words` for `en`, `pt`, `es`, `de`, `fr`, `id`.
- 8 to 12 offerings (fictional names, a status of core, focus or new), 8 to 12 actions covering all three agents (planner, gap, order), 6 problems, an 8-step storyline, 5 or 6 KPIs (each segment needs 3 or more), 4 guardrails with ids like `all1`, `gap1`, `order1`, `planner1`, 4 assistant refusals, 8 suggested assistant questions, and a complete Companion block.
- A unique accent colour (contrast with white at least 4.5, none already used) and an icon from `src/core/icons.js`.
- A `forbidden` list of 5 or more words that must never appear in that pack's output.

## Step 4. Rules that already caused failures. Check each before you run the full tests.
1. **No copied prose.** Any sentence of 30 or more characters must be unique across all packs. Do not reuse standard lines like "Record the reason code, the name of the {contact} and the date" or the mileage line. Rewrite them in your own words per pack. `node tests/static.mjs` finds copies.
2. **US spelling in source.** Write `center`, `catalog`, `organize`, `program`. Words such as `centre`, `programme` and `tyre` fail the static test. French or other names in `words` must also avoid these.
3. **No self-trips.** A suggested assistant question must not match that pack's own refusal patterns, and a Companion knowledge title or text must not contain a phrase from that pack's own `companion.guardrails[].blocked` list. Both fail as "no real answer" or "restricted claim". Check with `node tests/assistant-unit.mjs` and `node tests/companion-unit.mjs`.
4. **Segments with only samples or restricted items.** If a segment's offerings are all `kind` items or priced zero, the pitch and story code must still work. A unit check already builds pitch and stories for every account. Keep it green.
5. **Vocabulary tokens only.** Use `{account}`, `{contact}`, `{visit}` and friends in shared copy. Never hard-code an industry noun in `src/core` or `src/data`.
6. **Fictional names only.** No real brands, chains, insurers, vets, couriers or schools. Add any real names you worry about to the `BRANDS` list in `tests/static.mjs`.
7. **No em dashes, no hype words, plain short sentences.** No performance claims. All numbers are sample data.
8. **Guardrail wording.** Each regulated point in the table above must appear in `guardrails` and in at least one `assistantRefusals` entry with 3 or more lowercase patterns of 4 or more characters.

## Step 5. Update the tests and docs
- `tests/static.mjs`: industry count (`expected 14 industries` becomes 20).
- `tests/e2e.mjs`: header comment and the setup counts (14 industries becomes 20).
- `tests/companion.mjs`: add one entry per new industry to `GUARDS`: a typed claim that triggers that pack's blocked pattern, and its guardrail id.
- `README.md`: counts, the industry id list under URL patterns, the last full run line.
- `PRD.md`: add a row per industry in section 6 and update the counts in the acceptance criteria.

## Step 6. Verify
Run in this order and fix before moving on:
```bash
node tests/static.mjs
node tests/assistant-unit.mjs
node tests/companion-unit.mjs
npm run build
npm test
```
`npm test` runs about 50 minutes at 220 combinations. Run it as one background command and do not rebuild `docs/` while it runs. Then look at the setup screen and Today on the phone width (390 px) for two new industries in two countries and check for text overflow.

## Step 7. Deliver
- Work on a branch, never on `main`. Commit after each domain and push at once. Never force-push.
- Commit the rebuilt `docs/index.html`.
- Open one pull request into `main` with: what changed, the test counts, and the gaps below.
- Report plainly: what is built, what is only designed, what you did not verify. Do not invent numbers.

## Known gaps to state in the PR
- Guardrail text is demo content, not reviewed by compliance, legal or a domain practitioner. Insurance, animal health and hygiene need that review before any customer sees them.
- The setup screen lists 20 industries in one long column. If it is hard to use, propose grouping or search as a separate change, do not mix it into this one.
- Companion hub, assistant and screens are unchanged.

Live demo (deploys from `main`): https://ai-assistor-sales-execution.vercel.app
