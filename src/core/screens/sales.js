// Order-led rep (X11): many short {visits} where the {order} leads. Route of stops, an {order}
// with offer tiers and "raise to the next tier", one or two starter actions, and new {accounts}
// found in the field followed through six lifecycle stages. Sample data only.

import { esc, icon, pill } from '../ui.js';
import { roles, LIFE } from '../execution/roles.js';
import { signals, exOf, archetypeOf } from '../execution/model.js';
import { personFor } from '../personas.js';

const offName = (industry, id) => industry.offerings.find((o) => o.id === id)?.name || id;

export const actions = {
  'sales-qty': ({ ctx, data }) => {
    const o = roles(ctx).salesOrder(data.acc);
    if (o.submitted) return;
    o.qty[data.off] = Math.max(0, (o.qty[data.off] || 0) + Number(data.d));
  },
  'sales-raise': ({ ctx, data }) => { roles(ctx).raiseToNext(data.acc); },
  'sales-submit': ({ ctx, data }) => { roles(ctx).submitSales(data.acc); },
  'new-field': ({ ctx, el }) => { ctx.ui.newAcc = { ...(ctx.ui.newAcc || {}), [el.dataset.key]: el.value }; },
  'new-save': ({ ctx, api }) => {
    const f = ctx.ui.newAcc || {};
    const name = (f.name || '').trim().slice(0, 48);
    if (!name) { ctx.ui.newErr = true; return; }
    const segs = ctx.industry.segments.filter((s) => archetypeOf(ctx.industry, s.id) === 'orderLed');
    const n = roles(ctx).addNew({ name, area: f.area || ctx.data.city.areas[0], segmentId: f.seg || (segs[0] || ctx.industry.segments[0]).id });
    ctx.ui.newAcc = null; ctx.ui.newErr = false;
    api.navigate(`#/sales/new/${n.id}`);
    return 'nav';
  },
  'new-advance': ({ ctx, data }) => { roles(ctx).advance(data.id); },
};

function route(ctx) {
  const { t, data, fmt, industry } = ctx;
  const R = roles(ctx);
  const sg = signals(ctx);
  const stops = R.salesStops();
  const me = personFor(ctx, 'salesman');
  const ex = exOf(industry);
  const sent = R.salesSubmitted().length;
  const rows = stops.map((st) => {
    const a = data.byId[st.accountId];
    const o = R.salesOrder(a.id);
    return `<li><a class="row acc-row${o.submitted ? ' done' : ''}" href="#/sales/${a.id}" data-stop="${a.id}">
      <span class="time">${esc(fmt.time(st.start))}</span>
      <span class="row-main"><b>${esc(a.name)}</b><small>${esc(t('{segment} · Tier {tier} · {n} lines · {m} min', { segment: t(a.segment), tier: R.tierOf(a.id), n: st.lines.length, m: st.minutes }))}</small></span>
      ${o.submitted ? pill(t('Sent'), 'good') : sg[a.id].risk.band === 'High' ? pill(t('At risk'), 'bad') : ''}${icon('chevron', 18)}</a></li>`;
  }).join('');
  const news = R.newAccounts();
  return `
  <section class="page-head"><h1>${esc(t('Route for {name}', { name: me.first }))}</h1>
    <p class="muted">${esc(t('{n} short {visits}. The {order} leads; one or two actions fit each {visit}.', { n: stops.length }))}${ex.partner ? ' ' + esc(t('{Orders} go to the {partner}.', { partner: ex.partner })) : ''}</p></section>
  ${fieldNoticesLite(ctx)}
  <section class="card tight" id="sales-summary"><div class="facts"><div><small>${esc(t('Stops'))}</small><b>${stops.length}</b></div><div><small>${esc(t('{Orders} sent'))}</small><b id="sales-sent">${sent}</b></div><div><small>${esc(t('New {accounts}'))}</small><b>${news.length}</b></div></div></section>
  <ol class="group list" id="sales-route">${rows}</ol>
  <a class="btn secondary block" href="#/sales/new" id="add-new" style="min-height:var(--tap);margin-top:var(--s3)">${icon('pin', 18)} ${esc(t('Add a new {account} found today'))}</a>
  ${news.length ? `<section class="card" id="new-list"><h2>${esc(t('New {accounts} you added'))}</h2><ul class="bullets small">${news.map((n) => `<li><a class="tap-link" href="#/sales/new/${n.id}"><b>${esc(n.name)}</b></a> ${esc(t('Stage {s} of 6: {stage}', { s: n.stage, stage: t(LIFE[n.stage - 1]) }))}</li>`).join('')}</ul></section>` : ''}
  <p class="foot-note">${esc(t('Route built by Visit Planning from overdue order-led {accounts}. Sample data.'))}</p>`;
}

function fieldNoticesLite(ctx) {
  const { t, data } = ctx;
  const R = roles(ctx);
  const out = [];
  if (R.season()) out.push(`<div class="notice" id="season-on">${icon('calendar', 18)}<span>${esc(t('Event mode on for {event}: suggested quantities are 20% higher (sample). Set by sales ops.', { event: data.event.name }))}</span></div>`);
  if (R.off().includes('order')) out.push(`<div class="notice warn" id="order-off">${icon('stop', 18)}<span>${esc(t('{Order} Suggestion is switched off in this market. Lines start empty.'))}</span></div>`);
  return out.join('');
}

function stop(ctx, id) {
  const { t, data, fmt, industry } = ctx;
  const R = roles(ctx);
  const st = R.salesStops().find((s) => s.accountId === id);
  if (!st) return `<section class="card"><p>${esc(t('Not on today\'s route.'))}</p><a class="btn secondary" href="#/sales">${esc(t('Back to the route'))}</a></section>`;
  const a = data.byId[id];
  const sg = signals(ctx)[id];
  const ex = exOf(industry);
  const o = R.salesOrder(id);
  const value = R.lineValue(id);
  const hasPrice = st.lines.some((l) => l.price);
  const lines = st.lines.map((l) => {
    const q = o.qty[l.offeringId] ?? 0;
    return `<li class="order-line" data-line="${l.offeringId}"><span class="row-main"><b>${esc(offName(industry, l.offeringId))}</b><small>${l.price ? esc(fmt.money(l.price)) : esc(t('Price from the price list'))} · ${esc(t('suggested {n}', { n: l.suggested }))}</small></span>
      <span class="stepper"><button class="step" data-act="sales-qty" data-acc="${id}" data-off="${l.offeringId}" data-d="-1" aria-label="${esc(t('Fewer'))}"${o.submitted ? ' disabled' : ''}>−</button><b class="qty">${q}</b><button class="step" data-act="sales-qty" data-acc="${id}" data-off="${l.offeringId}" data-d="1" aria-label="${esc(t('More'))}"${o.submitted ? ' disabled' : ''}>+</button></span></li>`;
  }).join('');
  const offer = R.fieldOffer(id);
  let tiersHtml = '';
  if (ex.offers.mode === 'on' && hasPrice) {
    const tiers = R.tiersFor(id);
    const reached = tiers.filter((x) => value >= x.min).pop();
    const next = tiers.find((x) => x.min > value);
    tiersHtml = `<section class="card" id="offer-tiers"><div class="section-head"><h2>${esc(t('Offer tiers'))}</h2>${offer && offer.decision === 'target' ? pill(t('Released'), 'good') : pill(t('Not released'), 'muted')}</div>
      ${offer && offer.decision === 'target' ? `<ul class="tier-ladder">${tiers.map((x) => `<li class="${reached && reached.name === x.name ? 'on' : ''}"><b>${esc(t(x.name))}</b><span class="small muted">${esc(t('from {amount}', { amount: fmt.money(x.min) }))}</span></li>`).join('')}</ul>
      <p class="small">${reached ? esc(t('This {order} reaches {tier}.', { tier: t(reached.name) })) : esc(t('Below the first tier.'))} ${next ? esc(t('{amount} more reaches {tier}.', { amount: fmt.money(next.min - value), tier: t(next.name) })) : ''}</p>
      ${next && value > 0 && !o.submitted ? `<button class="btn secondary block" data-act="sales-raise" data-acc="${id}" id="raise-tier" style="min-height:var(--tap)">${esc(t('Raise to {tier}', { tier: t(next.name) }))}</button>` : ''}`
      : `<p class="small muted">${esc(offer ? t(offer.t, offer.v) : t('Offer targets are not released yet by the {kam}. The {order} goes at base terms.'))}</p>`}
      <p class="small muted">${esc(t('Tiers and thresholds come from the approved plan. Sample values. The {rep} never changes terms.'))}</p></section>`;
  }
  const acts = st.actions.map((did) => industry.actions.find((d) => d.id === did)).filter(Boolean);
  return `
  <section class="page-head"><a class="back" href="#/sales">${icon('back', 18)} ${esc(t('Route'))}</a><h1>${esc(a.name)}</h1>
    <p class="muted">${esc(t('{segment} · {area} · Tier {tier} · {m} min', { segment: t(a.segment), area: a.area, tier: R.tierOf(id), m: st.minutes }))}</p></section>
  ${fieldNoticesLite(ctx)}
  ${sg.risk.band === 'High' ? `<div class="notice warn" id="stop-risk">${icon('flag', 18)}<span>${esc(t('Retention Risk {score} of 100. {driver}.', { score: sg.risk.score, driver: t(sg.risk.drivers[0].t, sg.risk.drivers[0].v) }))}</span></div>` : ''}
  <section class="card" id="sales-order"><div class="section-head"><h2>${esc(t('{Order}'))}</h2>${o.submitted ? pill(t('Sent'), 'good') : pill(t('Draft'), 'warn')}</div>
    <ul class="order-lines">${lines}</ul>
    ${hasPrice ? `<p class="small"><b>${esc(t('Total'))}: <span id="sales-total">${esc(fmt.money(value))}</span></b></p>` : ''}
    ${o.submitted ? `<p class="small good-text" id="sales-done">${esc(t('Sent{to}. The {manager} and partner see it now.', { to: ex.partner ? t(' to the {partner}', { partner: ex.partner }) : '' }))}</p>` : `<button class="btn primary block" data-act="sales-submit" data-acc="${id}" id="sales-send" style="min-height:var(--tap)">${esc(ex.partner ? t('Send to the {partner}', { partner: ex.partner }) : t('Send the {order}'))}</button>`}
  </section>
  ${tiersHtml}
  <section class="card" id="starter-actions"><h2>${esc(t('One or two actions that fit'))}</h2>
    <ul class="bullets small">${acts.map((d) => `<li><b>${esc(t(d.type))}</b>${d.effort ? ` <span class="muted">${esc(t('{m} min', { m: d.effort }))}</span>` : ''}</li>`).join('') || `<li>${esc(t('No extra action today.'))}</li>`}</ul>
    <p class="small muted">${esc(t('Action Ranking keeps the {visit} short: only actions that fit the time.'))}</p></section>`;
}

function newForm(ctx) {
  const { t, data, industry } = ctx;
  const f = ctx.ui.newAcc || {};
  const segs = industry.segments.filter((s) => archetypeOf(industry, s.id) === 'orderLed');
  const list = segs.length ? segs : industry.segments;
  return `
  <section class="page-head"><a class="back" href="#/sales">${icon('back', 18)} ${esc(t('Route'))}</a><h1>${esc(t('New {account}'))}</h1>
    <p class="muted">${esc(t('Found in the field. It is scored from similar {accounts} nearby, so no history is needed.'))}</p></section>
  <section class="card" id="new-form">
    <label class="field"><span class="small">${esc(t('Name'))}</span><input id="new-name" data-change="new-field" data-key="name" value="${esc(f.name || '')}" maxlength="48" placeholder="${esc(t('Name on the sign'))}" style="min-height:var(--tap)"></label>
    ${ctx.ui.newErr ? `<p class="small bad-text" role="alert">${esc(t('Add a name first.'))}</p>` : ''}
    <label class="field"><span class="small">${esc(t('Area'))}</span><select id="new-area" data-change="new-field" data-key="area" style="min-height:var(--tap)">${data.city.areas.map((ar) => `<option${f.area === ar ? ' selected' : ''}>${esc(ar)}</option>`).join('')}</select></label>
    <label class="field"><span class="small">${esc(t('Type'))}</span><select id="new-seg" data-change="new-field" data-key="seg" style="min-height:var(--tap)">${list.map((s) => `<option value="${s.id}"${f.seg === s.id ? ' selected' : ''}>${esc(t(s.name))}</option>`).join('')}</select></label>
    <button class="btn primary block" data-act="new-save" id="new-save" style="min-height:var(--tap)">${esc(t('Add and score'))}</button>
  </section>`;
}

function lifecycle(ctx, id) {
  const { t, fmt, industry } = ctx;
  const R = roles(ctx);
  const n = R.newAccounts().find((y) => y.id === id);
  if (!n) return `<section class="card"><p>${esc(t('Not found. New {accounts} reset when the page reloads.'))}</p><a class="btn secondary" href="#/sales">${esc(t('Back to the route'))}</a></section>`;
  const detail = [
    t('Location checked. Duplicates removed.'),
    t('Account Potential {amount} from {n} similar {accounts}. Provisional tier {tier}.', { amount: fmt.moneyShort(n.potential), n: n.peers, tier: n.tier }),
    t('Gap Diagnostics starts from the tier {tier} benchmark: {acts}.', { tier: n.tier, acts: n.starters.map((d) => t(industry.actions.find((x) => x.id === d).type)).join(', ') || t('no gaps yet') }),
    t('Visit Planning adds it to the next cycle. Intro {order}: {lines}.', { lines: n.intro.map((o) => offName(industry, o)).join(', ') || t('core range') }),
    t('Actual against expected is captured. Every capability updates.'),
    t('After three to five {visits}, the full set runs. Retention Risk starts watching.'),
  ];
  return `
  <section class="page-head"><a class="back" href="#/sales">${icon('back', 18)} ${esc(t('Route'))}</a><h1>${esc(n.name)}</h1>
    <p class="muted">${esc(t('{segment} · {area} · New', { segment: t(n.segment), area: n.area }))}</p></section>
  <section class="card" id="lifecycle-run" data-stage="${n.stage}">
    <ol class="rungs">${LIFE.map((s, i) => `<li class="rung${i < n.stage ? '' : ' muted'}" data-life="${i + 1}"><b>${i < n.stage ? icon('check', 14) : ''} ${esc(t(s))}</b>${i < n.stage ? `<span class="small">${esc(detail[i])}</span>` : ''}</li>`).join('')}</ol>
    ${n.stage < LIFE.length ? `<button class="btn primary block" data-act="new-advance" data-id="${n.id}" id="life-next" style="min-height:var(--tap)">${esc(t('Next stage: {s}', { s: t(LIFE[n.stage]) }))}</button>` : `<p class="small good-text" id="life-done">${esc(t('Full loop. This {account} now gets the same eight capabilities as every other.'))}</p>`}
    <p class="small muted">${esc(t('Stages advance here by tap for the demo. In use they advance on real {visits}. Resets when the page reloads.'))}</p>
  </section>`;
}

export function render(ctx, args = []) {
  if (args[0] === 'new' && args[1]) return lifecycle(ctx, args[1]);
  if (args[0] === 'new') return newForm(ctx);
  if (args[0]) return stop(ctx, args[0]);
  return route(ctx);
}
