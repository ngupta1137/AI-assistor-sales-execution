# Prompt: set up Antigravity to own future changes to this repo

Paste everything below the line into Antigravity as the first message in the project.

---

You are taking over day-to-day development of an existing repository: `ngupta1137/ai-assistor-sales-execution`. Before you change anything, set yourself up and prove you can run the project. Do not edit product code in this first task.

## Objective
Make this repo safe and fast for you to change on your own, and leave a rules file so every future session starts with the same standards.

## Step 1. Read, in this order
1. `CLAUDE.md`: standing rules. These bind you exactly as they bound the previous agent.
2. `PRD.md`: source of truth for scope and behaviour.
3. `README.md`: structure, how to add packs, tests, known gaps.
4. `package.json` scripts, `vercel.json`, `tests/` (names only at first).

## Step 2. Create a rules file for yourself
Antigravity may support a rules or workspace instructions location. If it does, put the rules there. Either way, create `AGENTS.md` at the repo root that says: "Read CLAUDE.md first. Its rules apply to every agent." Do not duplicate the rules, so there is one source of truth. Commit it.

## Step 3. Prove the toolchain
Run, and paste the real output tails:
```bash
npm ci
npm test
npm run build
git status
```
Expected: `npm test` ends with all suites passing (static, assistant unit, Companion unit, browser, assistant, Companion). It takes several minutes. Run it as one command and do not rebuild `docs/` while it runs. If Playwright browsers are missing, run `npx playwright install chromium` once. Report anything that fails. Do not hide or skip a failing test.

## Step 4. Standing rules you must follow on every task
- Cross-industry and cross-country by design. Content lives in pack files: `src/packs/industries/*` and `src/packs/countries/*`. Never hard-code an industry noun in a screen. Use vocabulary tokens such as `{account}`, `{Order}`.
- Fictional data only. No real company, brand, chain, hospital, retailer or product names. No employer material.
- No performance claims. All numbers are sample data and labelled as such.
- UI copy: plain language, short sentences, no em dashes, no hype words.
- Regulated industries: no clinical claims (pharma, medical devices). Agents never set price or approve credit (financial services). Crop-protection advice follows the label (agri).
- Tap targets stay at 44 px or more. No horizontal scroll at 320 and 390 px. The tests enforce both.
- Keep test hooks stable: element ids and `data-*` attributes used by `tests/*.mjs`. If you must rename one, update the tests in the same commit.
- No new runtime dependencies. The product ships as one file, `docs/index.html`.

## Step 5. Workflow for every future task
1. State the objective, the options you considered, your recommendation, the risks, how success is measured, and what you are not doing. Short, before you code.
2. Work on a branch, never on `main`. Commit after each meaningful step and push at once. Never force-push or rewrite history.
3. Before you finish: `npm test` and `npm run build`, commit the rebuilt `docs/index.html`, keep `git status` clean.
4. Open a pull request into `main`. Vercel deploys from `main` and gives a preview per branch.
5. Report: what changed, what you measured before and after, what you did not verify, and what is still open. Label each item as built, designed or proposed. Never invent numbers.

## Step 6. Report back with
- Output tails of `npm ci`, `npm test`, `npm run build`.
- The commit that adds `AGENTS.md`.
- Anything in the repo that blocked you or that you would change about this setup.

Live demo (deploys from `main`): https://ai-assistor-sales-execution.vercel.app . The older address ai-assistor.vercel.app is retired.

---

## Notes for you (not part of the prompt)
- Keep the Claude Code and Antigravity setups aligned by editing only `CLAUDE.md`. `AGENTS.md` just points to it.
- Two agents on one branch will collide. Give each its own branch and merge through pull requests.
- If Antigravity cannot run Playwright in its sandbox, ask it to say so plainly, then run `npm test` yourself before merging.
