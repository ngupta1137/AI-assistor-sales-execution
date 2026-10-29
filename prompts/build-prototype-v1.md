Build the demo prototype described in PRD.md (in the repo root). Read PRD.md fully before writing any code; it is the source of truth. Where this prompt and PRD.md differ, PRD.md wins.

## What we are building
A cross-industry AI field sales execution app called "AI Assistor Sales Execution" (short form "AI Assistor"; use the full name on the setup screen and the short form in the app header). One product, configured by industry pack and country pack, so a prospect in pharma sees clinics, physicians and medical reps, and a prospect in paints sees dealers, contractors and territory sales officers, with the same workflow. I will demo it to prospective customers in many industries and keep extending it, so code quality and extensibility matter as much as looks.

## Scope for this session
- All P0 requirements in PRD section 9 (rep, manager, agents, configuration screens).
- 10 industry packs (PRD section 6) and 8 country packs (PRD section 7). All 80 combinations must work.
- Demo setup screen, shareable URL parameters, hidden presenter menu (Shift+D and long-press on logo), deterministic seeded data (PRD sections 8 and 11).
- P1 items only if all P0 work is done and tested.

## Technical approach
- Static app, no backend, no framework required (vanilla JS with ES modules is fine; a light framework only if you justify it). No CDN dependencies at runtime.
- Structure for extensibility:
  - `src/core/` screens, router, state, formatting, seeded random generator
  - `src/packs/industries/<industry>.js` one file per industry: vocabulary tokens, personas, segments, offerings, action catalogue (type, title template, why templates, effort minutes, evidence type, value range), KPIs, guardrails, six problem statements, assistant Q&A, demo storyline hints, accent colour and icon
  - `src/packs/countries/<country>.js` one file per country: currency and number formatting (Intl where possible; Indian lakh and crore grouping), date format, distance unit, cities with coordinates, first and last name pools, account-name patterns, address and phone formats, local events, price-level factor
  - `src/data/generate.js` builds territory, accounts, visits, actions, orders, reps and agents from (industry pack, country pack, seed)
- All UI copy uses vocabulary tokens ({account}, {accounts}, {contact}, {rep}, {offering}, {order}, {visit}, etc.). No industry noun hard-coded in any screen.
- Build script (`npm run build`) that bundles everything into ONE self-contained HTML file at `docs/index.html` (for GitHub Pages and for sending as an offline file). Also `npm run dev` for local serving.
- Tests: a Playwright script (`npm test`) that opens every industry x country x persona combination via URL parameters, visits every P0 screen, runs the visit-brief approve/adjust/override flow and the agent stop button, and fails on any console error or any leftover unreplaced token or wrong-industry noun (for example the word "store" visible in pharma or financial services).

## Design
- Mobile-first: on desktop, show the app inside a centred phone frame with a slim presenter-only side panel hidden by default. Clean, modern, professional, brand-neutral; each industry pack sets one accent colour. No real company logos.
- Screens per PRD: Setup, Today, Visit brief, Account 360, Action detail, Order or proposal builder, Visit complete, Manager home with exception queue, Agent controls, How this is configured, Problems we solve.
- The visit brief is the hero: each item shows what the agent saw, what it compared against, how sure it is, which agent prepared it, and approve / adjust / override (with reason). Counts update live. Overrides appear in the manager's exception queue in the same session.
- Labels must say "Sample data" on the setup screen and in the presenter menu.

## Content rules
- Fictional data only. Never use real company, brand, chain, hospital, retailer or product names. Build names from patterns and country name pools.
- Make each industry feel authentic: realistic offerings, action types, KPIs and guardrails from PRD section 6, written the way a practitioner in that industry talks.
- Regulated industries: pharma and medical devices never show clinical claims; financial services never shows an agent setting price or approving credit; agri crop-protection advice follows the label. Show these as guardrails in the agent scope.
- Plain language, short sentences, no em dashes, no hype words in UI copy.
- No performance claims anywhere; numbers are sample data.

## Git and GitHub (required)
- This repository is new and dedicated to this prototype. Every piece of work must end up pushed to it on GitHub, not only committed locally.
- Before writing code, add a `.gitignore` (node_modules, test reports, OS files) and push an initial commit, to confirm pushing works. If pushing fails, stop and tell me exactly what failed and what access you need.
- Commit after each phase below with a clear message, and push immediately after every commit. Never end a phase with unpushed work.
- Branch: push to `main` if this session allows it. If the session only allows a working branch, push every commit to that branch, and at the end open a pull request into `main` titled "AI Assistor prototype v1" with a summary of what was built and the test results.
- Commit the built `docs/index.html` too, so GitHub Pages can serve it.
- Never force-push and never rewrite history.
- In your final summary, list the branch, the last commit, the pull request link if one was opened, and confirm `git status` is clean and nothing is unpushed.

## How to work
1. First, reply with a short plan: file structure, pack schema (show the industry and country pack TypeScript-style interface or JSDoc), screen list, and test approach. Then proceed without waiting for me.
2. Build in phases; commit and push after each with a clear message:
   a. core + one industry (consumer goods) + one country (US), all P0 screens working end to end
   b. pack schema hardened; remaining 9 industries
   c. remaining 7 countries, formatting and localisation
   d. setup screen, URL parameters, presenter menu, prospect branding if time allows
   e. build script producing docs/index.html, Playwright tests over all 80 combinations, fix every failure
3. Do not stop at "works for one industry". Every pack must have complete, distinct content (no copy-paste between industries apart from structure).
4. At the end, write `README.md`: how to run, how to add a new industry or country pack (step by step), demo script per PRD section 14, and the URL patterns. Then give me a summary: what is done, test results, known gaps, and the exact steps to enable GitHub Pages so I can share a link.
