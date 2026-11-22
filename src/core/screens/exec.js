// Executive (X16): the eight capabilities and whether each is on in this market, adoption and
// execution from this session, a value calculator where every input is the buyer's own,
// the activation path, the adoption plan and the risks. No value figure is supplied by us.

import { esc, icon, pill } from '../ui.js';
import { roles } from '../execution/roles.js';
import { CAPS, CAP_ORDER, TIERS, readiness, exOf } from '../execution/model.js';

const DEFAULT_READY = { history: 12, master: 95, evidence: 'manual', partner: 'weekly', plan: true, geo: true, app: true };
const CHECK = [
  ['train', 'Field training: two short sessions, then coaching on real {visits}'],
  ['champions', 'One champion {rep} per team'],
  ['incentive', 'Incentives reward actions done with evidence, not app use'],
  ['nopolice', 'Written rule: adoption data is never used to rank or police {reps}'],
  ['finance', 'Test design and the go, fix or stop rule agreed with finance'],
  ['owner', 'A named owner for each capability and for partner data'],
];
const RISKS = [
  ['Poor data at launch', 'Run the readiness check. Pause in the red zone.'],
  ['Low trust in the field', 'Explain every suggestion. Start at rung 1 of the trust ladder.'],
  ['Partner data gaps', 'Pick the integration model before the pilot. Name an owner.'],
  ['Claiming value too early', 'Report adoption, execution and value separately. Value only against control.'],
  ['Too many capabilities at once', 'Activate by tier. Foundation first.'],
];

export const actions = {
  'exec-input': ({ ctx, el }) => {
    const R = roles(ctx);
    const v = Number(el.value);
    R.x.valueInputs = { ...(R.x.valueInputs || {}), [el.dataset.key]: Number.isFinite(v) && v >= 0 ? v : 0 };
  },
  'exec-check': ({ ctx, data }) => { const R = roles(ctx); R.x.checklist[data.id] = !R.x.checklist[data.id]; },
};

export function render(ctx) {
  const { t, data, fmt, industry, m } = ctx;
  const R = roles(ctx);
  const ex = exOf(industry);
  const avgValue = Math.round(data.accounts.reduce((s, a) => s + a.current, 0) / data.accounts.length);
  const inp = { accounts: data.accounts.length, value: avgValue, lift: 0, adoption: 0, cost: 0, ...(R.x.valueInputs || {}) };
  const result = Math.round(inp.accounts * inp.value * (inp.lift / 100) * (inp.adoption / 100) - inp.cost);
  const s = m.selfStats();
  const R0 = readiness({ ...DEFAULT_READY, ...(ctx.ui.ready || {}) });
  const cards = CAP_ORDER.map((c) => {
    const off = (c === 'offers' && ex.offers.mode === 'off');
    const on = R.capOn(c) && !off;
    return `<div class="exec-cap" data-exec-cap="${c}"><b class="small">${esc(t(CAPS[c].name))}</b>${off ? pill(t('Not used'), 'muted') : on ? pill(t('On'), 'good') : pill(t('Off'), 'warn')}</div>`;
  }).join('');
  const field = (key, label, unit) => `<label class="ready-row"><span class="small">${esc(t(label))}</span><input type="number" min="0" inputmode="decimal" data-change="exec-input" data-key="${key}" id="vin-${key}" value="${inp[key]}" style="min-height:var(--tap);max-width:160px"> <span class="small muted">${esc(unit)}</span></label>`;
  return `
  <section class="page-head"><h1>${esc(t('Executive overview'))}</h1>
    <p class="muted">${esc(t('{industry} in {country}. What is live, how it is used, and how to size the value case yourself.', { industry: industry.name, country: ctx.country.name }))}</p></section>
  <section class="card" id="exec-caps"><div class="section-head"><h2>${esc(t('Eight capabilities in this market'))}</h2></div>
    <div class="exec-grid">${cards}</div>
    <p class="small muted">${esc(t('Switched on or off by sales ops on the Activation tab.'))}</p></section>
  <section class="card" id="exec-adoption"><h2>${esc(t('This session'))}</h2>
    <div class="facts"><div><small>${esc(t('Actions done'))}</small><b>${s.actionsDone}</b></div><div><small>${esc(t('Overrides with a reason'))}</small><b>${s.overrides}</b></div><div><small>${esc(t('{Orders} sent by the order-led {rep}'))}</small><b>${R.salesSubmitted().length}</b></div></div>
    <p class="small muted">${esc(t('From this demo session only. Value is measured against control in a pilot. No result yet.'))}</p>
    <a class="btn secondary sm" href="#/system/scorecard" style="min-height:var(--tap)">${esc(t('Full scorecard'))} ${icon('chevron', 14)}</a></section>
  <section class="card" id="value-calc"><div class="section-head"><h2>${esc(t('Value case calculator'))}</h2>${pill(t('Your inputs'), 'info')}</div>
    <p class="small">${esc(t('Every input is yours. The improvement and adoption start at zero on purpose: we do not supply a result.'))}</p>
    ${field('accounts', 'Number of {accounts}', '')}
    ${field('value', 'Average yearly value per {account}', ctx.country.currency)}
    ${field('lift', 'Improvement you expect', '%')}
    ${field('adoption', 'Share of {reps} using it', '%')}
    ${field('cost', 'Yearly cost', ctx.country.currency)}
    <p class="small"><b>${esc(t('Formula'))}:</b> ${esc(t('{accounts} × value × improvement × adoption − cost'))}</p>
    <p id="value-result" data-value="${result}"><b>${esc(t('Result'))}: ${esc(fmt.money(result))}</b></p>
    <p class="small muted">${esc(t('Illustrative calculator, not a forecast. Defaults for {accounts} and value come from the sample territory.'))}</p></section>
  <section class="card" id="exec-path"><h2>${esc(t('Activation path'))}</h2>
    <ol class="rungs">${TIERS.map((T) => `<li class="rung${R0.tier >= T.n ? '' : ' muted'}" data-path="${T.n}"><b>${esc(t('Tier {n}: {name}', { n: T.n, name: T.name }))}</b><span class="small">${esc(t(T.outcome))}. ${esc(t('To move up'))}: ${esc(t(T.advance))}</span></li>`).join('')}</ol>
    <p class="small muted">${esc(R0.red ? t('This market is in the red zone. Pause until the data is fixed.') : t('This market is ready for tier {n} on the readiness answers set by sales ops. Each market moves on evidence, not a date.', { n: R0.tier }))}</p></section>
  <section class="card" id="exec-adoption-plan"><h2>${esc(t('Adoption plan'))}</h2>
    <ul class="check-list">${CHECK.map(([id, label]) => `<li><label class="tap-check"><input type="checkbox" data-act="exec-check" data-id="${id}"${R.x.checklist[id] ? ' checked' : ''}><span class="small">${esc(t(label))}</span></label></li>`).join('')}</ul></section>
  <section class="card" id="exec-risks"><h2>${esc(t('Risks and how they are handled'))}</h2>
    <ul class="bullets small">${RISKS.map(([r, h]) => `<li><b>${esc(t(r))}:</b> ${esc(t(h))}</li>`).join('')}</ul></section>`;
}
