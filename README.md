# AI Assistor Sales Execution

An AI field sales app that tells every field rep which customers to visit, what to do first in each visit and what to sell or order, and shows what happened. One product, configured by an industry pack and a country pack.

- Product requirements: [PRD.md](PRD.md) (source of truth)
- Build brief: [prompts/build-prototype-v1.md](prompts/build-prototype-v1.md)
- Standing rules for AI coding sessions: [CLAUDE.md](CLAUDE.md)

**All data is fictional sample data.** Names, places, products and numbers are generated. Nothing in the prototype describes a real company or a real result.

## Status

| Area | State |
|---|---|
| P0 requirements (PRD section 9): rep R1 to R7, manager M1 and M2, agents G1 and G2, configuration C1 and C2 | Built and tested |
| 10 industry packs, 8 country packs, all 80 combinations | Built and tested |
| Setup screen, URL parameters, presenter menu (Shift+D, long press), seeded data | Built and tested |
| P1: route plan (R8), Ask AI (R9), coaching prompts (M3), coverage (M4), audit log (G3), prospect branding | Built and tested |
| P2: offline sync, pack editor, translated UI, partner view | Not built |
| Real integrations, real models, user accounts | Not built (out of scope for v1) |

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

- **Industries:** `cpg`, `pharma`, `meddevices`, `beverages`, `building` (also `paints`), `agri`, `telecom`, `electronics`, `autoparts`, `finserv` (also `fs`).
- **Countries:** `US`, `UK` (also `GB`), `DE`, `IN`, `BR`, `ID`, `MX`, `AE` (also `UAE`). Case does not matter.
- **Personas:** `rep`, `manager`, `admin`.
- **Hash routes:** `#/today`, `#/brief/<id>`, `#/account/<id>`, `#/action/<actionId>`, `#/order/<id>`, `#/complete/<id>`, `#/route`, `#/ask`, `#/manager`, `#/agents`, `#/config`, `#/problems`, `#/setup`.
- An unknown industry or country opens the setup screen with a short note. It does not show an error.
- Any accent colour is darkened until white text on it reaches 4.5:1 contrast.

**Presenter menu.** Press Shift+D, or long press the logo on a phone or tablet. From there you can switch industry, country or persona, set "Prepared for", copy the share link, show presenter notes beside the phone frame (desktop only) and reset the demo. Switching never logs you out. Decisions are kept per industry and country until you press Reset.

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
4. Define 2 or 3 `segments`. Each needs a visit length, a visit style, a reference annual value in USD, opening hours, account types with name words per language (`en` is required; `pt`, `es`, `de` and `id` are used by Brazil, Mexico, Germany and Indonesia), and contact roles. Mark at least one segment `key: true`; overrides there route to the KAM.
5. Add 8 to 12 `offerings` with fictional names. Set `price` to a reference USD price, `0` for no charge, or `null` when people, not the agent, set the price. Add a `kind` for special classes such as samples or contracts. Only actions that ask for that kind will talk about them.
6. Add 8 to 12 `actions`. Each needs `title`, `saw` (what the agent saw), `compared` (what it compared against), 3 to 5 `why` lines and 2 to 3 `talk` lines. Templates can use `{product} {days} {pct} {qty} {peers} {n} {weeks} {area} {city} {person} {role} {event} {eventDays} {type} {segment} {amount}` plus vocabulary tokens. Include at least one action for each agent (`planner`, `gap`, `order`) and at least 3 actions per segment.
7. Add `orderReasons`, `orderRules` (`totalAbove`, `lineMax`, `humanPrice`, `info`), `overrideReasons` (with `route`), `outcomeReasons` (mark the ones that block), `visitNotes`, 4 to 6 `kpis` (the first is the headline), `guardrails`, exactly 6 `problems`, 8 to 10 `assistant` questions and answers, an 8-step `storyline`, and `forbidden` words that must never appear for this industry.
8. Register the pack in `src/packs/index.js`: import it and add it to the `INDUSTRIES` list.
9. Run `npm test`. The validator reports anything missing. The duplicate-text check fails if you copied sentences from another pack, so rewrite them in the new industry's own words. The browser checks then open the new industry in all 8 countries.
10. Run `npm run build` and commit `docs/index.html`.

Update the count check in `tests/static.mjs` (`expected 10 industries`) when you add one.

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

`npm test` runs three steps and fails on the first failure.

1. **Build** of `docs/index.html`.
2. **Static checks** (`tests/static.mjs`, about 61,000 checks, a few seconds):
   - Every pack against the schema, including accent contrast.
   - Every template token resolves.
   - No em or en dashes and no hype words in shipped source.
   - A blocklist of real brands, chains and companies.
   - No sentence copied between industries.
   - No industry nouns hard-coded in `src/core`.
   - US spelling in source.
   - Generation is deterministic for all 80 combinations: 24 to 30 accounts, 6 to 8 visits, 3 to 6 actions, every visit inside opening hours.
   - Country formatting: lakh and crore, comma decimals, date orders.
3. **Browser checks** (`tests/e2e.mjs`, Playwright against the built file, about 80 seconds with 4 workers). For each of the 80 combinations, the rep flow opens every brief, action, account, order and complete screen. It also:
   - Runs approve, adjust and override and checks the live counts.
   - Captures the typed evidence, including drawing a signature.
   - Triggers the order rules: approval threshold, and the sample limit block.
   - Closes the visit and switches to manager through the presenter menu, then checks the override and its note are in the exception queue.
   - Checks coaching prompts and coverage, then stops and resumes the Order agent and checks paused items and the audit log.
   - Opens config, problems, route re-plan and Ask AI.
   - Opens manager and admin direct links for all 80 combinations, and starts the demo from the setup screen for all 80.
   - Edge cases: bad links, aliases, HTML escaping of "Prepared for", the contrast guard, the same data after a reload, long press, switch time and reset.

Any console error, leftover `{token}`, `undefined` or `NaN`, or one of the pack's forbidden words (for example "store" in pharma or financial services) fails the run. `E2E_ONLY=pharma:IN npm run test:e2e` runs one combination. `E2E_WORKERS=8` runs more in parallel.

Last full run: 80 combinations, 3 personas, 5,768 screens checked, 21,717 assertions, all passing.

## Publish on GitHub Pages

1. Merge the pull request into `main`.
2. On GitHub, open **Settings**, then **Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Set **Branch** to `main`, set the folder to `/docs`, and click **Save**.
5. After a minute or two the site is live at `https://ngupta1137.github.io/AI-assistor-sales-execution/`. Share links such as `https://ngupta1137.github.io/AI-assistor-sales-execution/?industry=pharma&country=IN&persona=rep`.

If the repository is private, GitHub Pages needs a paid plan, and the published site is public unless your organisation has Enterprise access control. Check this before sending links. `docs/.nojekyll` is already in place.

## Known gaps and risks

- **Names are generated, not cleared.** Product and account names are coined from patterns and screened against a blocklist of about 120 real brands. A generated name can still match a small real business or a product somewhere. Screen the names for each country and industry you demo in, and check "AI Assistor" for trademark conflicts (PRD section 16) before any external use.
- **Regulated content is guardrail text only.** The pharma, devices, financial services and agri packs state the rules, but they have not been reviewed by a compliance or regulatory practitioner. PRD section 16 recommends one practitioner review per pack.
- **Numbers are illustrative.** Price factors are rough local price levels, not exchange rates. Event dates for moving holidays are approximate. Travel time is a straight-line estimate.
- **The Ask AI box is rule-based.** It matches keywords to the pack's questions and answers three data questions (first account, coverage gaps, target). It is not a language model, and the screen says so.
- **State lives in memory.** A page reload resets the demo, by design, so every demo starts clean. Decisions survive switching packs and personas through the presenter menu.
- **English UI only.** Names, places, currency and events are local. Right-to-left Arabic and translated UI are P2.
- **Accessibility is partly verified.** Tap targets are at least 44 px and accent colours pass 4.5:1. A full screen-reader audit has not been done.
- **Desktop shows a phone frame.** Tablet layout uses the same mobile layout, wider. A tablet-optimised layout was not designed.
