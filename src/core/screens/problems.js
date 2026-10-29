// C2 Problems we solve: six problems in the prospect's language, each linked to the capability that solves it.

import { esc, icon, pill, CAPABILITIES } from '../ui.js';

export function render(ctx) {
  const { t, industry, data } = ctx;
  const first = data.planned.slice().sort((a, b) => a.rank - b.rank)[0];
  const LINK = {
    potential: `#/account/${data.accounts[0].id}`,
    gaps: `#/brief/${first.accountId}`,
    ranking: `#/brief/${first.accountId}`,
    planning: '#/today',
    order: `#/order/${first.accountId}`,
    evidence: '#/manager',
  };
  const cards = industry.problems.map((p, i) => {
    const cap = CAPABILITIES[p.capability];
    return `<article class="card problem" data-capability="${p.capability}">
      <small class="eyebrow">Problem ${i + 1}</small>
      <h3>${esc(t(p.title))}</h3>
      <p>${esc(t(p.text))}</p>
      <div class="problem-foot">${pill(t(cap.name), 'accent')}<small class="muted">${esc(t(cap.decides))}</small></div>
      <a class="btn ghost sm" href="${LINK[p.capability]}">See it ${icon('chevron', 14)}</a>
    </article>`;
  }).join('');
  return `
  <section class="hello">
    <h1>Problems we solve</h1>
    <p class="muted">${esc(t(`Six problems ${industry.name.toLowerCase()} field teams describe, and the capability that answers each one.`))}</p>
  </section>
  ${cards}
  <p class="foot-note">Sample data. No results are claimed before a pilot against matched control territories.</p>`;
}
