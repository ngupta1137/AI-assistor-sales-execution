// R3 Account 360: current work first (open gaps, recorded outcomes), then potential, KPIs, contacts and history.

import { esc, icon, pill, bar, kpiValue, kpiOk, typeLine } from '../ui.js';

export function render(ctx, [accountId]) {
  const { t, fmt, data, m, industry } = ctx;
  const a = data.byId[accountId] || data.accounts[0];
  const p = m.plannedFor(a.id);
  const open = p ? m.openGaps(a.id) : [];
  const recorded = p ? m.doneGaps(a.id) : [];
  const last = m.lastVisitDays(a.id);

  const gapRow = (g) => {
    const o = m.outcome(g.id);
    const st = o?.status === 'not_done' ? pill(`Not done: ${t(o.reason)}`, 'bad') : m.decision(g.id)?.status === 'overridden' ? pill('Overridden', 'muted') : '';
    return `<li><a class="row" href="#/action/${g.id}"><span class="row-main"><b>${esc(t(g.title, g.vars))}</b>
      <small>${esc(t(g.type))} · Est. ${esc(fmt.money(g.value))} · ${g.effort} min</small>${st ? `<span class="row-line">${st}</span>` : ''}</span>${icon('chevron', 20, 'row-chev')}</a></li>`;
  };
  const gapList = !p ? `<li class="empty">${esc(t('This {account} is not on today\'s plan.'))}</li>`
    : open.length ? open.map(gapRow).join('') : `<li class="empty">${esc(t('No open gaps. Every action here has a recorded outcome.'))}</li>`;

  const kpis = industry.kpis.filter((k) => a.kpis[k.id] != null).map((k) => {
    const v = a.kpis[k.id];
    const okk = kpiOk(k, v);
    return `<li><span class="small">${esc(t(k.label))}</span><span class="kv"><b>${esc(kpiValue(k, v, fmt))}</b>
      <small class="${okk ? 'ok-text' : 'warn-text'}">${icon(okk ? 'check' : 'flag', 14)} ${okk ? 'On target' : k.lowerIsBetter ? 'Above limit' : 'Below target'} · ${esc(kpiValue(k, k.target, fmt))}</small></span></li>`;
  }).join('');

  const contacts = a.contacts.map((c) => `<li class="row" style="flex-direction:column;align-items:stretch">
    <div style="display:flex;align-items:center;gap:10px">
      <span class="avatar">${esc(c.name.replace(/^\S+\.\s/, '').split(' ').map((w) => w[0]).slice(0, 2).join(''))}</span>
      <span class="row-main"><b>${esc(c.name)}</b>
        <small>${esc(t(c.role))} · ${c.primary ? pill('Decision Maker', 'accent') : pill('Influencer', 'info')}</small>
        <small>${esc(c.phone)} · ${esc(t(c.preference))} · last spoke ${esc(fmt.daysAgo(c.lastContactDays))}</small></span>
    </div>
    <div style="margin-top:6px;display:flex;justify-content:flex-end">
      <button class="btn secondary sm" data-act="log-touchpoint" data-contact="${esc(c.name)}" data-acc="${esc(a.name)}" style="min-height:var(--tap)">${icon('note', 14)} Log touchpoint</button>
    </div></li>`).join('');

  const visits = a.history.map((h) => `<li class="row"><span class="row-main">
    <b>${esc(fmt.date(fmt.dayOffset(-h.daysAgo)))}</b><small>${esc(t(h.note, h.vars))}</small></span>
    <small>${esc(fmt.daysAgo(h.daysAgo))}</small></li>`).join('');

  const hist = a.orderHistory || [];
  const totalSpend = hist.reduce((sum, o) => sum + o.total, 0);
  const avgOrder = hist.length ? Math.round(totalSpend / hist.length) : 0;
  const maxVal = Math.max(...hist.map((o) => o.total), 1);
  const chartW = 320;
  const chartH = 64;
  const barW = 32;
  const numBars = hist.length;
  const totalBarWidth = numBars * barW;
  const gap = numBars > 1 ? (chartW - totalBarWidth) / (numBars - 1) : 0;

  const chartSvg = hist.length ? `
    <div style="margin-top:10px;margin-bottom:12px;padding:var(--s3);background:var(--surface-inset);border-radius:var(--radius-sm);border:1px solid var(--line-soft)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <b>Spend velocity trend</b>
        ${pill('ERP verified', 'good')}
      </div>
      <div class="facts" style="margin-bottom:8px">
        <div><small>AOV</small><b>${esc(fmt.money(avgOrder))}</b></div>
        <div><small>Total volume</small><b>${esc(fmt.moneyShort(totalSpend))}</b></div>
        <div><small>Orders</small><b>${hist.length}</b></div>
      </div>
      <svg viewBox="0 0 ${chartW} ${chartH}" style="width:100%;height:auto;overflow:visible" role="img" aria-label="Order spend velocity">
        ${hist.map((o, i) => {
          const h = Math.max(6, Math.round((o.total / maxVal) * (chartH - 20)));
          const x = Math.round(i * (barW + gap));
          const y = chartH - h - 14;
          return `
            <g>
              <rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="3" fill="var(--accent)" opacity="0.85"/>
              <text x="${x + barW / 2}" y="${y - 3}" text-anchor="middle" font-size="9" font-weight="600" fill="var(--ink)">${esc(fmt.moneyShort(o.total))}</text>
              <text x="${x + barW / 2}" y="${chartH - 2}" text-anchor="middle" font-size="8" fill="var(--muted)">-${o.daysAgo}d</text>
            </g>`;
        }).join('')}
      </svg>
    </div>` : '';

  const orders = chartSvg + a.orderHistory.map((o) => `<li class="row"><span class="row-main">
    <b class="money">${esc(fmt.money(o.total))}</b><small>${o.lines} lines</small></span>
    <small>${esc(fmt.date(fmt.dayOffset(-o.daysAgo)))}</small></li>`).join('');

  const crmNoteModal = ctx.ui?.crmNoteOpen === a.id ? `
  <div class="presenter-backdrop" data-act="close-crm-note" aria-hidden="true"></div>
  <section class="as-sheet" role="dialog" aria-modal="true" aria-labelledby="crm-note-title" style="height:auto;max-height:85%;overflow-y:auto;z-index:90">
    <header class="as-head">
      <div>
        <h2 id="crm-note-title">${icon('note', 18)} Add CRM visit note</h2>
        <small>${esc(a.name)} · Activity Timeline Logger</small>
      </div>
      <button class="icon-btn" data-act="close-crm-note" aria-label="Close dialog">${icon('x', 20)}</button>
    </header>
    <div style="padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)">
      <label class="field"><span>Interaction type</span>
        <select id="crm-note-type" style="height:var(--tap)">
          <option>In-person visit</option>
          <option>Phone check-in</option>
          <option>Commercial review</option>
        </select>
      </label>
      <label class="field"><span>Customer sentiment</span>
        <select id="crm-note-sentiment" style="height:var(--tap)">
          <option>Positive - Ready to expand</option>
          <option>Neutral - Standard replenishment</option>
          <option>Cautious - Budget constraint</option>
        </select>
      </label>
      <label class="field"><span>Key discussion and commitments</span>
        <textarea class="input" rows="3" id="crm-note-text" placeholder="Record key customer insights, commercial commitments, and agreed follow-ups..."></textarea>
      </label>
      <div class="btn-row">
        <button class="btn secondary" data-act="close-crm-note" style="min-height:var(--tap);flex:1">Cancel</button>
        <button class="btn primary" data-act="save-crm-note" data-id="${a.id}" style="min-height:var(--tap);flex:1">Save to CRM</button>
      </div>
    </div>
  </section>` : '';

  return `${crmNoteModal}
  <a class="back" href="${p ? `#/brief/${a.id}` : '#/today'}">${icon('back', 18)} ${p ? esc(t('{Visit} brief')) : 'Back'}</a>
  ${ctx.ui?.accountToast ? `<div class="notice good" style="margin-bottom:var(--s3)">${icon('check', 16)}<span>${esc(ctx.ui.accountToast)}</span></div>` : ''}
  <section class="page-head">
    <span class="eyebrow">${esc(t('{Account} 360'))}</span>
    <h1>${esc(a.name)}</h1>
    <p class="small muted">${esc(typeLine(t, a))} · Tier ${a.tier}</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin:4px 0 6px;font-size:11px;color:var(--muted)">
      <span>${icon('sync', 12)} CRM ID: ACC-${10000 + (a.name.length * 47) % 90000}</span>
      <span>${icon('note', 12)} ERP Master: KNA1-${20000 + (a.name.length * 83) % 90000}</span>
      <span>${icon('check', 12)} Terms: Approved 30-day</span>
    </div>
    <p class="small">${esc(a.address)} · Open ${esc(fmt.time(a.hours[0]))} to ${esc(fmt.time(a.hours[1]))} · ${last === 0 ? esc(t('Visited today')) : `last ${esc(t('{visit}'))} ${esc(fmt.daysAgo(last))}`}</p>
  </section>

  <section><div class="section-head"><h2>Open gaps</h2>${p ? pill(`${open.length} open`, open.length ? 'warn' : 'good') : ''}</div>
    <ul class="group" id="open-gaps">${gapList}</ul></section>
  ${recorded.length ? `<section><h2>Recorded this visit</h2><ul class="group" style="margin-top:12px" id="recorded-gaps">${recorded.map((g) => `<li><a class="row" href="#/action/${g.id}"><span class="row-main"><b>${esc(t(g.title, g.vars))}</b><span class="row-line">${pill('Done', 'good')}</span></span>${icon('chevron', 20, 'row-chev')}</a></li>`).join('')}</ul></section>` : ''}

  <section class="card">
    <div class="section-head"><h2>Potential</h2>${pill(`Score ${a.score} of 100`, 'info')}</div>
    <div class="stat-row"><span class="small muted">Potential a year</span><b class="stat-md">${esc(fmt.moneyShort(a.potential))}</b></div>
    <div class="facts">
      <div><small>Current a year</small><b>${esc(fmt.moneyShort(a.current))}</b></div>
      <div><small>White space</small><b>${esc(fmt.moneyShort(a.whiteSpace))}</b></div>
    </div>
    ${bar(a.current, a.potential)}
    <small>${fmt.pct(Math.round((a.current / a.potential) * 100))} of potential captured. Medium confidence, based on similar ${esc(t('{accounts}'))} in ${esc(a.city)}.</small>
  </section>

  <details class="fold" id="acc-kpis"><summary>KPIs</summary><ul class="kpi-list">${kpis}</ul></details>
  <details class="fold" id="acc-contacts"><summary>${esc(t('{Contacts}'))}<span class="sum-end">${a.contacts.length}</span></summary><ul class="group">${contacts}</ul></details>
  <details class="fold" id="acc-visits"><summary>${esc(t('Last {visits}'))}<span class="sum-end">${a.history.length}</span></summary>
    <ul class="group">${visits}</ul>
    <div style="margin-top:8px">
      <button class="btn secondary sm" data-act="open-crm-note" data-id="${a.id}" style="min-height:var(--tap);width:100%">${icon('note', 16)} Add CRM visit note</button>
    </div>
  </details>
  <details class="fold" id="acc-orders"><summary>${esc(t('{Order} history'))}<span class="sum-end">${a.orderHistory.length}</span></summary><ul class="group">${orders}</ul></details>`;
}

export const actions = {
  'open-crm-note': ({ ctx, data }) => { (ctx.ui ||= {}).crmNoteOpen = data.id; },
  'close-crm-note': ({ ctx }) => { (ctx.ui ||= {}).crmNoteOpen = null; },
  'save-crm-note': ({ ctx, data }) => {
    const textEl = document.getElementById('crm-note-text');
    const typeEl = document.getElementById('crm-note-type');
    const text = (textEl?.value || '').trim() || 'Completed interaction review.';
    const type = typeEl?.value || 'Visit';
    const a = ctx.data.byId[data.id];
    if (a) {
      a.history.unshift({ daysAgo: 0, note: `${type}: ${text.slice(0, 80)}`, vars: {} });
      (ctx.ui ||= {}).accountToast = `CRM note recorded for ${a.name}.`;
      if (ctx.m?.logAudit) ctx.m.logAudit('CRM Activity', `Logged ${type} for ${a.name}: "${text.slice(0, 60)}"`);
    }
    ctx.ui.crmNoteOpen = null;
  },
  'log-touchpoint': ({ ctx, data }) => {
    (ctx.ui ||= {}).accountToast = `Touchpoint with ${data.contact} logged to CRM activity timeline.`;
    if (ctx.m?.logAudit) ctx.m.logAudit('CRM Connector', `Logged touchpoint with ${data.contact} at ${data.acc}`);
  },
};
