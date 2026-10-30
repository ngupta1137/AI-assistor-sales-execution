// C2 Problems we solve: six problems in the prospect's language, each linked to the capability that solves it.

import { esc, icon, CAPABILITIES } from '../ui.js';

export function render(ctx) {
  const { t, industry, data } = ctx;
  const first = data.planned.slice().sort((a, b) => a.rank - b.rank)[0];
  const LABEL = {
    potential: 'Open {account} potential', gaps: 'Open the {visit} brief', ranking: 'Open the ranked brief',
    planning: 'Open Today and the route', order: 'Open the {order} builder', evidence: 'Open the exception queue',
  };
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
    return `<details class="fold problem" data-capability="${p.capability}"${i === 0 ? ' open' : ''}>
      <summary><span><span class="num">Problem ${i + 1}</span> ${esc(t(p.title))}</span></summary>
      <p>${esc(t(p.text))}</p>
      <small>Capability: <b>${esc(t(cap.name))}</b>. ${esc(t(cap.decides))}.</small>
      <a class="btn secondary sm" href="${LINK[p.capability]}">${esc(t(LABEL[p.capability]))} ${icon('chevron', 16)}</a>
    </details>`;
  }).join('');
  return `
  <section class="page-head">
    <h1>Problems we solve</h1>
    <p class="muted">${esc(t(`Six problems ${industry.name.toLowerCase()} field teams describe, and the capability that answers each one.`))}</p>
  </section>
  ${cards}
  <p class="foot-note">Sample data. No results are claimed before a pilot against matched control territories.</p>`;
}
