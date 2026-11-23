# Agent Guidelines

Read CLAUDE.md first. Its rules apply to every agent (Claude, Antigravity, Gemini, Codex or any other).

## How changes reach main

- Never push to `main`. Work on a branch and open a pull request into `main`.
- `main` is protected: a pull request merges only when the CI check "Build and tests" passes.
- Before you open the pull request, run `npm run build`, commit `docs/index.html`, then run `npm run test:static`, `npm run test:floating` and `npm run test:e2e`. Report the real counts. Do not set a target count.
- If a test fails, fix the cause. Do not loosen a test to make it pass unless the test itself is wrong, and say so in the pull request.

## Claims

- Every number on screen is sample data or comes from the session. Label sample data.
- Never show a result as measured: no "lift", "growth", "reduced by" with a percentage, no p-values, no "verified", "audited" or "proven". Impact is measured in a pilot; the app shows the method. `tests/static.mjs` enforces this.
- Never hard-code a figure that can be computed from the data. A screen must not contradict another screen.

## Industry packs

- Copy that depends on the industry comes from the pack (vocabulary tokens, `execution.fulfillment`, `execution.briefFrame`). Never hard-code one industry's objectives, agent names or nouns in `src/core`.
- There are 21 industry packs and 11 country packs. Changes must work for all of them.
