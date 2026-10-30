# AI Assistor Sales Execution: standing rules for Claude Code

- `PRD.md` is the source of truth for scope and behaviour. Read it before changing features.
- The product is cross-industry and cross-country, driven by pack files: `src/packs/industries/*` and `src/packs/countries/*`. Never hard-code an industry noun in a screen; use vocabulary tokens.
- Fictional data only. Never use real company, brand, chain, hospital, retailer or product names, logos or data, and never material from any employer.
- No performance claims; all numbers are sample data and labelled as such.
- UI copy: plain language, short sentences, no em dashes, no hype words.
- Regulated industries: no clinical claims (pharma, medical devices); agents never set price or approve credit (financial services); crop-protection advice follows the label (agri).
- Git: commit after each meaningful step and push immediately. Never force-push or rewrite history. If you cannot push to `main`, push to your branch and open a pull request into `main`.
- Before finishing any task: run `npm test` (all industry x country combinations) and `npm run build` (refreshes `docs/index.html`), and commit the build.
- Live demo (Vercel, deploys from `main`): https://ai-assistor-sales-execution.vercel.app . Use this link when you tell the user where to look. The older address ai-assistor.vercel.app is retired.
