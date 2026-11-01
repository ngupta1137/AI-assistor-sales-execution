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
    <div style="margin-top:10px">
      <button class="btn secondary sm" data-act="download-dossier" data-id="${a.id}" style="min-height:var(--tap);width:100%;display:flex;align-items:center;justify-content:center;gap:6px">${icon('note', 16)} Export Account 360 executive dossier (Text)</button>
    </div>
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

    <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--line-soft)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <small class="muted" style="font-weight:600">Category whitespace breakdown:</small>
        ${pill('Whitespace opportunity', 'info')}
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:6px">
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px">
          <span>Core lines</span>
          <span style="display:flex;align-items:center;gap:6px"><b>74% penetrated</b>${pill('Established', 'good')}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px">
          <span>Focus lines</span>
          <span style="display:flex;align-items:center;gap:6px"><b>38% penetrated</b>${pill('Growth potential', 'warn')}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px">
          <span>New introductions</span>
          <span style="display:flex;align-items:center;gap:6px"><b>12% penetrated</b>${pill('Whitespace void', 'accent')}</span>
        </div>
      </div>
      <button class="btn secondary sm" data-act="convert-whitespace" data-id="${a.id}" style="min-height:var(--tap);margin-top:10px;width:100%">${icon('agent', 14)} Convert white space to prioritized action</button>
    </div>
  </section>

  <details class="fold" id="acc-intel"><summary>Competitive intelligence and local market share</summary>
    <div style="padding:var(--s2) 0">
      <div class="facts" style="margin-bottom:8px;grid-template-columns:repeat(auto-fit,minmax(80px,1fr))">
        <div><small>Our portfolio share</small><b class="good-text">64%</b></div>
        <div><small>Competing share</small><b class="warn-text">36%</b></div>
        <div><small>Price index</small><b>1.02 vs market</b></div>
      </div>
      <p class="small muted" style="margin-bottom:8px">Account-level brand penetration and competing promotional activity tracking.</p>
      <div style="display:flex;flex-direction:column;gap:4px;font-size:12px;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between">
          <span>Primary competitor</span>
          <b>Regional Brand Competitor (15% promo campaign active)</b>
        </div>
        <div style="display:flex;justify-content:space-between">
          <span>Counter-strategy</span>
          <b>Leverage volume rebate tier schedule and faster logistics delivery</b>
        </div>
      </div>
      <button class="btn secondary sm" data-act="log-competitor-intel" data-acc="${esc(a.name)}" style="min-height:var(--tap);width:100%">${icon('flag', 14)} Log competitor field activity</button>
    </div>
  </details>
  <details class="fold" id="acc-assets"><summary>Field equipment and asset verification<span class="sum-end">1 asset</span></summary>
    <div style="padding:var(--s2) 0">
      <div class="facts" style="margin-bottom:8px;grid-template-columns:repeat(auto-fit,minmax(80px,1fr))">
        <div><small>Asset tag</small><b>EQ-9821</b></div>
        <div><small>Asset type</small><b>Branded display unit</b></div>
        <div><small>Condition</small><b class="good-text">Operational</b></div>
        <div><small>Purity</small><b class="good-text">96% compliant</b></div>
      </div>
      <p class="small muted" style="margin-bottom:8px">Company-owned commercial equipment assigned to this account. Purity audit verified against contractual standards.</p>
      <button class="btn secondary sm" data-act="log-asset-audit" data-id="${a.id}" style="min-height:var(--tap);width:100%">${icon('wrench', 14)} Log asset inspection and maintenance check</button>
    </div>
  </details>
  <details class="fold" id="acc-agreement"${ctx.ui?.agreementOpen === a.id ? ' open' : ''}>
    <summary>Commercial agreement and credit terms<span class="sum-end">Tier ${a.tier}</span></summary>
    <div style="padding:var(--s2) 0">
      <div class="facts" style="margin-bottom:8px;grid-template-columns:repeat(auto-fit,minmax(80px,1fr))">
        <div><small>Master agreement</small><b>AGR-${1000 + (a.name.length * 97) % 9000}</b></div>
        <div><small>Credit limit</small><b class="money">${esc(fmt.money(a.potential * 0.25))}</b></div>
        <div><small>Available credit</small><b class="money good-text">${esc(fmt.money(a.potential * 0.25 - a.current * 0.15))}</b></div>
        <div><small>Payment terms</small><b>Net 30</b></div>
      </div>
      <p class="small muted" style="margin-bottom:8px">Active enterprise master purchasing agreement with pre-approved volume discount thresholds.</p>
      <div style="display:flex;flex-direction:column;gap:4px;font-size:12px;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between">
          <span>Tier schedule</span>
          <b>Tier ${a.tier} (5% at ${esc(fmt.money(500))}, 10% at ${esc(fmt.money(2000))})</b>
        </div>
        <div style="display:flex;justify-content:space-between">
          <span>YTD Rebate accrual</span>
          <b class="money">${esc(fmt.money(a.current * 0.025))} accrued</b>
        </div>
        <div style="display:flex;justify-content:space-between">
          <span>Freight policy</span>
          <b>Prepaid on standard deliveries</b>
        </div>
      </div>
      <div class="btn-row" style="gap:8px;flex-wrap:wrap">
        <button class="btn secondary sm" data-act="view-contract-doc" data-id="${a.id}" style="min-height:var(--tap);flex:1;min-width:140px">${icon('note', 14)} Export contract summary</button>
        <button class="btn secondary sm" data-act="request-credit-increase" data-id="${a.id}" style="min-height:var(--tap);flex:1;min-width:140px">${icon('wallet', 14)} Request credit review</button>
      </div>
    </div>
  </details>
        <details class="fold" id="acc-jbp">
    <summary>Joint Business Plan (JBP) and trade promotions<span class="sum-end">Q4 Active</span></summary>
    <div style="padding:var(--s2) 0">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <b>Annual Joint Business Plan (JBP)</b>
        ${pill('On Target (+14%)', 'good')}
      </div>
      <p class="small muted" style="margin-bottom:8px">Co-investment agreement establishing joint turnover targets, trade promotion funding, and milestone verification.</p>
      <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr));margin-bottom:8px">
        <div><small>JBP Target</small><b class="money">${esc(fmt.money(a.potential * 2.5))}</b></div>
        <div><small>Co-op fund</small><b class="money">${esc(fmt.money(a.potential * 0.15))}</b></div>
        <div><small>Fund used</small><b class="money good-text">${esc(fmt.money(a.potential * 0.10))}</b></div>
        <div><small>Baseline vol</small><b class="money">${esc(fmt.money(a.current * 1.8))}</b></div>
      </div>
      <div style="font-size:12px;padding:6px 8px;background:var(--surface-subtle);border-radius:4px;border:1px solid var(--line-soft);margin-bottom:8px">
        <b>Quarterly execution milestones:</b>
        <div style="display:flex;justify-content:space-between;margin-top:4px">
          <span>1. Eye-level feature placement (Week 44)</span>
          <b class="good-text">Verified</b>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:2px">
          <span>2. Volume promotional bundle (Week 46)</span>
          <b class="good-text">Active (10% Co-op)</b>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:2px">
          <span>3. Commercial staff product briefing (Week 48)</span>
          <b class="muted">Scheduled</b>
        </div>
      </div>
      <button class="btn secondary sm" data-act="download-jbp-charter" data-id="${a.id}" style="min-height:var(--tap);width:100%">${icon('note', 14)} Export Joint Business Plan (JBP) charter</button>
      ${ctx.ui?.jbpToast ? `<div class="notice good" style="margin-top:8px">${icon('check', 14)}<span>${esc(ctx.ui.jbpToast)}</span></div>` : ''}
    </div>
  </details>
  <details class="fold" id="acc-entity">
    <summary>Commercial trade network and multi-tier structure<span class="sum-end">Multi-Tier</span></summary>
    <div style="padding:var(--s2) 0">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <b>Enterprise Commercial Hierarchy</b>
        ${pill('Trade Network Mapped', 'good')}
      </div>
      <p class="small muted" style="margin-bottom:8px">Multi-tier mapping of contracting entity, invoice payer, physical delivery site, and wholesale fulfillment stockist.</p>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:12px;margin-bottom:8px">
        <div style="padding:6px 8px;background:var(--surface-subtle);border-radius:4px;border:1px solid var(--line-soft)">
          <span class="muted">1. Contracting Parent / Legal Entity:</span>
          <b>${esc(a.name.split(' ')[0])} Corporate Group LLC (Master Agreement AGR-9821)</b>
        </div>
        <div style="padding:6px 8px;background:var(--surface-subtle);border-radius:4px;border:1px solid var(--line-soft)">
          <span class="muted">2. Invoicing Payer Account:</span>
          <b>Central Invoicing ACC-${10000 + (a.name.length * 47) % 90000} · Credit: Net 30 Days</b>
        </div>
        <div style="padding:6px 8px;background:var(--surface-subtle);border-radius:4px;border:1px solid var(--line-soft)">
          <span class="muted">3. Physical Delivery Ship-To Site:</span>
          <b>${esc(a.name)} (${esc(a.address)}) · Dock 2 (08:00 - 15:30)</b>
        </div>
        <div style="padding:6px 8px;background:var(--surface-subtle);border-radius:4px;border:1px solid var(--line-soft)">
          <span class="muted">4. Wholesale Stockist Channel:</span>
          <b>Regional Distribution Partner Depot #402 · Standard Beat 4B Delivery</b>
        </div>
      </div>
      <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr))">
        <div><small>Trade flow</small><b>Direct contract</b></div>
        <div><small>Fulfillment</small><b>Wholesale depot</b></div>
        <div><small>Sell-in</small><b class="good-text">Invoiced</b></div>
        <div><small>Sell-out</small><b>POS tracked</b></div>
      </div>
    </div>
  </details>
  <details class="fold" id="acc-group"${ctx.ui?.groupOpen === a.id ? ' open' : ''}>
    <summary>Key account banner and multi-location rollup<span class="sum-end">Network Group</span></summary>
    <div style="padding:var(--s2) 0">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:6px">
        <div>
          <b style="font-size:14px">${esc(a.name.split(' ')[0])} Enterprise Network</b>
          <div class="small muted">Multi-location account rollup &amp; JBP commitments</div>
        </div>
        <div class="seg-ctl" role="group" aria-label="KAM analytics timeframe">
          <button class="seg ${(ctx.ui?.kamTf || 'monthly') === 'daily' ? 'on' : ''}" data-act="set-kam-tf" data-tf="daily" style="min-height:var(--tap);min-width:44px;font-size:11px">Daily</button>
          <button class="seg ${ctx.ui?.kamTf === 'weekly' ? 'on' : ''}" data-act="set-kam-tf" data-tf="weekly" style="min-height:var(--tap);min-width:44px;font-size:11px">Weekly</button>
          <button class="seg ${(ctx.ui?.kamTf || 'monthly') === 'monthly' ? 'on' : ''}" data-act="set-kam-tf" data-tf="monthly" style="min-height:var(--tap);min-width:44px;font-size:11px">Monthly</button>
        </div>
      </div>

      ${(() => {
        const tf = ctx.ui?.kamTf || 'monthly';
        if (tf === 'daily') {
          return `
          <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(75px,1fr));margin-bottom:8px">
            <div><small>Locations</small><b>14 sites</b></div>
            <div><small>Dock dispatch</small><b class="good-text">100% met</b></div>
            <div><small>Stock status</small><b class="good-text">Allocated</b></div>
            <div><small>Daily replenishment</small><b>${esc(fmt.moneyShort(a.current * 0.1))}</b></div>
          </div>
          <div style="padding:10px 12px;background:var(--surface-inset);border-radius:var(--radius-sm);border:1px solid var(--line-soft);margin-top:6px">
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;margin-bottom:6px">
              <span class="muted">14-branch daily delivery &amp; replenishment pacing</span>
              <span class="good-text"><b>100% on-time</b> (<div><small>Daily replenishment</small><b>${esc(fmt.moneyShort(a.current * 0.1))}</b></div>
          </div>6,800 received)</span>
            </div>
            <svg viewBox="0 0 320 80" style="width:100%;height:auto;overflow:visible" role="img" aria-label="KAM daily replenishment pacing">
              <defs>
                <linearGradient id="kamDailyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--good)" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="var(--good)" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <line x1="38" y1="18" x2="310" y2="18" stroke="var(--line-soft)" stroke-dasharray="2,2"/>
              <text x="32" y="21" font-size="8" fill="var(--muted)" text-anchor="end">$20k</text>
              <line x1="38" y1="44" x2="310" y2="44" stroke="var(--line-soft)" stroke-dasharray="2,2"/>
              <text x="32" y="47" font-size="8" fill="var(--muted)" text-anchor="end"><div><small>Daily replenishment</small><b>${esc(fmt.moneyShort(a.current * 0.1))}</b></div>
          </div>0k</text>
              <line x1="38" y1="68" x2="310" y2="68" stroke="var(--line-soft)"/>
              <text x="32" y="70" font-size="8" fill="var(--muted)" text-anchor="end">$0</text>
              
              <polygon points="45,68 100,52 165,36 230,28 295,22 295,68 45,68" fill="url(#kamDailyGrad)"/>
              <polyline points="45,68 100,52 165,36 230,28 295,22" fill="none" stroke="var(--good)" stroke-width="2.5"/>
              
              <circle cx="100" cy="52" r="3.5" fill="var(--good)"/>
              <text x="100" y="46" font-size="7" fill="var(--muted)" text-anchor="middle">Dock 1 ($5.2k)</text>
              
              <circle cx="165" cy="36" r="3.5" fill="var(--good)"/>
              <text x="165" y="30" font-size="7" fill="var(--muted)" text-anchor="middle">Dock 2 (<div><small>Daily replenishment</small><b>${esc(fmt.moneyShort(a.current * 0.1))}</b></div>
          </div>0.8k)</text>
              
              <circle cx="295" cy="22" r="4.5" fill="var(--good)"/>
              <text x="295" y="15" font-size="8" font-weight="700" fill="var(--good)" text-anchor="middle">Completed (<div><small>Daily replenishment</small><b>${esc(fmt.moneyShort(a.current * 0.1))}</b></div>
          </div>6.8k)</text>
              
              <text x="45" y="78" font-size="8" fill="var(--muted)">08:00</text>
              <text x="165" y="78" font-size="8" fill="var(--muted)">12:00</text>
              <text x="295" y="78" font-size="8" font-weight="700" fill="var(--good)">Current</text>
            </svg>
          </div>`;
        } else if (tf === 'weekly') {
          return `
          <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(75px,1fr));margin-bottom:8px">
            <div><small>Weekly target</small><b>${esc(fmt.moneyShort((a.potential * 4) / 12))}</b></div>
            <div><small>Wholesale sell-in</small><b class="good-text">${esc(fmt.moneyShort((a.current * 3.8) / 11))}</b></div>
            <div><small>Sell-out POS</small><b class="good-text">96% scan</b></div>
            <div><small>Rebate accrual</small><b>4.0%</b></div>
          </div>
          <div style="padding:10px 12px;background:var(--surface-inset);border-radius:var(--radius-sm);border:1px solid var(--line-soft);margin-top:6px">
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;margin-bottom:6px">
              <span class="muted">Wholesale sell-in vs site sell-out POS scan</span>
              <span class="good-text"><b>96.2% scan match</b> ($31,200 sell-out)</span>
            </div>
            <svg viewBox="0 0 320 85" style="width:100%;height:auto;overflow:visible" role="img" aria-label="KAM weekly sell-in vs sell-out">
              <line x1="38" y1="18" x2="310" y2="18" stroke="var(--line-soft)" stroke-dasharray="2,2"/>
              <text x="32" y="21" font-size="8" fill="var(--muted)" text-anchor="end">$40k</text>
              <line x1="38" y1="44" x2="310" y2="44" stroke="var(--line-soft)" stroke-dasharray="2,2"/>
              <text x="32" y="47" font-size="8" fill="var(--muted)" text-anchor="end">$25k</text>
              <line x1="38" y1="70" x2="310" y2="70" stroke="var(--line-soft)"/>
              <text x="32" y="72" font-size="8" fill="var(--muted)" text-anchor="end"><div><small>Rebate accrual</small><b>4.0%</b></div>
          </div>0k</text>
              
              <!-- Sell-in line (dashed muted) -->
              <polyline points="45,54 105,42 170,46 235,32 295,24" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="4,4"/>
              
              <!-- Sell-out POS line (solid accent) -->
              <polyline points="45,58 105,46 170,38 235,28 295,22" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
              
              <circle cx="170" cy="38" r="3.5" fill="var(--good)"/>
              <text x="170" y="32" font-size="7" fill="var(--good)" text-anchor="middle">W3 Promo: $28k</text>
              
              <circle cx="295" cy="22" r="4.5" fill="var(--accent)"/>
              <text x="295" y="15" font-size="8" font-weight="700" fill="var(--accent)" text-anchor="middle">$31.2k (Current)</text>
              
              <text x="45" y="80" font-size="8" fill="var(--muted)">W1</text>
              <text x="105" y="80" font-size="8" fill="var(--muted)">W2</text>
              <text x="170" y="80" font-size="8" fill="var(--muted)">W3</text>
              <text x="235" y="80" font-size="8" fill="var(--muted)">W4</text>
              <text x="295" y="80" font-size="8" font-weight="700" fill="var(--accent)">W5 (MTD)</text>
            </svg>
            <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);margin-top:4px">
              <span><span style="color:var(--accent)">●</span> In-Market POS Sell-Out</span>
              <span><span style="color:var(--muted)">---</span> Wholesale Sell-In Depot</span>
              <span class="good-text">Low stockout risk</span>
            </div>
          </div>`;
        } else {
          return `
          <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr));margin-bottom:8px">
            <div><small>Network size</small><b>14 branches</b></div>
            <div><small>Compliance</small><b class="good-text">94% on-target</b></div>
            <div><small>Commitment</small><b class="money">${esc(fmt.money(a.potential * 4))}</b></div>
            <div><small>Total volume</small><b class="money good-text">${esc(fmt.money(a.current * 3.8))}</b></div>
          </div>
          <div style="padding:10px 12px;background:var(--surface-inset);border-radius:var(--radius-sm);border:1px solid var(--line-soft);margin-top:6px">
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;margin-bottom:6px">
              <b>Multi-month JBP trajectory vs commitment</b>
              ${pill('Commitment pacing 94.1%', 'good')}
            </div>
            <svg viewBox="0 0 320 95" style="width:100%;height:auto;overflow:visible" role="img" aria-label="JBP quarterly trajectory">
              <defs>
                <linearGradient id="jbpAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="var(--accent)" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <line x1="38" y1="20" x2="310" y2="20" stroke="var(--line-soft)" stroke-dasharray="2,2"/>
              <text x="32" y="23" font-size="8" fill="var(--muted)" text-anchor="end"><div><small>Total volume</small><b class="money good-text">${esc(fmt.money(a.current * 3.8))}</b></div>
          </div>20k</text>
              <line x1="38" y1="48" x2="310" y2="48" stroke="var(--line-soft)" stroke-dasharray="2,2"/>
              <text x="32" y="51" font-size="8" fill="var(--muted)" text-anchor="end">$80k</text>
              <line x1="38" y1="76" x2="310" y2="76" stroke="var(--line-soft)"/>
              <text x="32" y="78" font-size="8" fill="var(--muted)" text-anchor="end">$40k</text>
              
              <!-- Monthly Target Commitment (stair-step line) -->
              <line x1="42" y1="44" x2="120" y2="44" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="3,3"/>
              <line x1="120" y1="36" x2="210" y2="36" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="3,3"/>
              <line x1="210" y1="26" x2="300" y2="26" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="3,3"/>
              
              <!-- Shaded Area -->
              <polygon points="45,50 82,46 120,48 165,30 210,26 255,32 295,28 295,76 45,76" fill="url(#jbpAreaGrad)"/>
              
              <!-- Realistic In-Market POS sell-out curve -->
              <polyline points="45,50 82,46 120,48 165,30 210,26 255,32 295,28" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
              
              <!-- Month 1: $88k vs $95k target -->
              <circle cx="82" cy="46" r="3.5" fill="var(--muted)"/>
              <text x="82" y="40" font-size="7" fill="var(--muted)" text-anchor="middle">$88k (M1)</text>
              
              <!-- Month 2: <div><small>Total volume</small><b class="money good-text">${esc(fmt.money(a.current * 3.8))}</b></div>
          </div>16k vs <div><small>Total volume</small><b class="money good-text">${esc(fmt.money(a.current * 3.8))}</b></div>
          </div>05k target (Promo lift) -->
              <circle cx="165" cy="30" r="4" fill="var(--good)"/>
              <text x="165" y="24" font-size="7" font-weight="700" fill="var(--good)" text-anchor="middle"><div><small>Total volume</small><b class="money good-text">${esc(fmt.money(a.current * 3.8))}</b></div>
          </div>16k (Promo surge)</text>
              
              <!-- Month 3 QTD: <div><small>Total volume</small><b class="money good-text">${esc(fmt.money(a.current * 3.8))}</b></div>
          </div>01k vs <div><small>Total volume</small><b class="money good-text">${esc(fmt.money(a.current * 3.8))}</b></div>
          </div>20k target -->
              <circle cx="295" cy="28" r="4.5" fill="var(--accent)"/>
              <text x="295" y="20" font-size="8" font-weight="700" fill="var(--accent)" text-anchor="middle">$301k QTD (94.1%)</text>
              
              <text x="82" y="88" font-size="8" fill="var(--muted)" text-anchor="middle">Month 1 (92.6%)</text>
              <text x="165" y="88" font-size="8" fill="var(--muted)" text-anchor="middle">Month 2 (110.5%)</text>
              <text x="295" y="88" font-size="8" font-weight="700" fill="var(--good)" text-anchor="middle">Month 3 (QTD)</text>
            </svg>
            <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);margin-top:4px">
              <span><span style="color:var(--accent)">●</span> In-Market POS Sell-Out: $301,000</span>
              <span><span style="color:var(--muted)">---</span> Contract Commitment: $320,000</span>
              <span class="good-text">On track for Tier 1 rebate</span>
            </div>
          </div>`;
        }
      })()}
      <p class="small muted" style="margin-bottom:8px">Affiliated commercial chain. Compliance and volume commitments roll up across all operating branches.</p>
      <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr));margin-bottom:8px">
        <div><small>Locations</small><b>14 branches</b></div>
        <div><small>Compliance</small><b class="good-text">94% on-target</b></div>
        <div><small>Commitment</small><b class="money">${esc(fmt.money(a.potential * 4))}</b></div>
        <div><small>Total volume</small><b class="money good-text">${esc(fmt.money(a.current * 3.8))}</b></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:12px;margin-bottom:8px">
        <div style="padding:6px 8px;background:var(--surface-subtle);border-radius:4px;border:1px solid var(--line-soft);display:flex;justify-content:space-between;align-items:center">
          <div>
            <b>Central Flagship Location</b>
            <div class="small muted">${esc(a.address)} (Current)</div>
          </div>
          <span class="good-text" style="font-weight:600">Active</span>
        </div>
        <div style="padding:6px 8px;background:var(--surface-subtle);border-radius:4px;border:1px solid var(--line-soft);display:flex;justify-content:space-between;align-items:center">
          <div>
            <b>North Regional Branch #2</b>
            <div class="small muted">Highway Corridor · Tier 2</div>
          </div>
          <span class="muted" style="font-weight:600">Compliant</span>
        </div>
        <div style="padding:6px 8px;background:var(--surface-subtle);border-radius:4px;border:1px solid var(--line-soft);display:flex;justify-content:space-between;align-items:center">
          <div>
            <b>East Metro Express Branch #5</b>
            <div class="small muted">Commercial Boulevard · Tier 1</div>
          </div>
          <span class="muted" style="font-weight:600">Compliant</span>
        </div>
      </div>
      <button class="btn secondary sm" data-act="download-kam-summary" data-id="${a.id}" style="min-height:var(--tap);width:100%">${icon('note', 14)} Export KAM group business review summary</button>
      ${ctx.ui?.kamToast ? `<div class="notice good" style="margin-top:8px">${icon('check', 14)}<span>${esc(ctx.ui.kamToast)}</span></div>` : ''}
    </div>
  </details>
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
  'set-kam-tf': ({ ctx, data }) => {
    (ctx.ui ||= {}).kamTf = data.tf;
  },

  'download-jbp-charter': ({ ctx, data }) => {
    const a = ctx.data.byId[data.id];
    const fmt = ctx.fmt;
    (ctx.ui ||= {}).jbpToast = `Joint Business Plan charter exported for ${a ? a.name : 'account'}.`;
    if (ctx.m?.logAudit) ctx.m.logAudit('JBP Governance', `Exported Joint Business Plan charter for ${a ? a.name : data.id}`);
    const content = [
      '========================================================================',
      'ANNUAL JOINT BUSINESS PLAN (JBP) CHARTER',
      `Commercial Account: ${a ? a.name : 'Customer'} (${a ? a.address : ''})`,
      `Agreement ID: JBP-2026-${1000 + (a ? a.name.length * 97 : 50) % 9000}`,
      '========================================================================',
      '',
      '1. MUTUALLY AGREED COMMERCIAL COMMITMENTS',
      `   - Annual Target Turnover: ${fmt.money(a.potential * 2.5)} (+14% year-on-year expansion)`,
      `   - Baseline Contract Volume: ${fmt.money(a.current * 1.8)}`,
      `   - Incremental Trade Spend Uplift Target: ${fmt.money(a.whiteSpace * 0.8)}`,
      `   - Co-Investment Trade Marketing Pool: ${fmt.money(a.potential * 0.15)} (67% deployed)`,
      '',
      '2. CONTRACTED EXECUTION MILESTONES',
      '   - Feature Placement: Confirmed eye-level placement on primary fixture',
      '   - Promotional Schedule: 10% volume discount tier co-funded via trade spend pool',
      '   - Proof of Performance: Electronic photo audit and scan reconciliation',
      '',
      '3. FINANCIAL REBATE ACCRUAL SCHEDULE',
      '   - 5% retrospective bonus earned upon achieving 90% of annual turnover target',
      '   - Direct settlement via credit note issued within 15 days of quarter close',
      '========================================================================',
      'CONFIDENTIAL - JOINT COMMERCIAL GOVERNANCE DOCUMENT',
      `Generated: ${new Date().toISOString()}`
    ].join('\r\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `JBP-Charter-${(a ? a.name : 'Customer').replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  'download-kam-summary': ({ ctx, data }) => {
    const a = ctx.data.byId[data.id];
    const fmt = ctx.fmt;
    (ctx.ui ||= {}).kamToast = `KAM Group review exported for ${a ? a.name : 'account'}.`;
    if (ctx.m?.logAudit) ctx.m.logAudit('KAM Portfolio', `Exported group business review summary for ${a ? a.name : data.id}`);
    const content = [
      '========================================================================',
      'KEY ACCOUNT MANAGEMENT (KAM) MULTI-LOCATION GROUP REVIEW',
      `Group Entity: ${a ? a.name.split(' ')[0] : 'Enterprise'} Network Group`,
      `Lead Location: ${a ? a.name : 'Central'} (${a ? a.address : ''})`,
      `Master Group Contract: AGR-KAM-2026-${1000 + (a ? a.name.length * 97 : 50) % 9000}`,
      '========================================================================',
      '',
      '1. GROUP-WIDE ATTAINMENT AND COMPLIANCE',
      '   - Total Network Operating Locations: 14 branches',
      '   - Network Execution Compliance Score: 94%',
      `   - Master Commitment: ${fmt.money(a.potential * 4)} | Attained YTD: ${fmt.money(a.current * 3.8)} (95%)`,
      '   - Payment Performance: AAA / Net 30 Days (0 days overdue)',
      '',
      '2. AFFILIATED REGIONAL LOCATIONS',
      `   - Flagship Central: ${a.address} (Tier 1, Current Territory)`,
      '   - North Regional Branch #2: Highway Corridor (Tier 2, Active)',
      '   - East Metro Express Branch #5: Commercial Boulevard (Tier 1, Compliant)',
      '',
      '3. CROSS-BRANCH GAP ANALYSIS AND OBJECTIVES',
      '   - Core distribution compliance verified across 100% of network branches',
      '   - Target void conversions: Expand focus lines into secondary suburban locations',
      '   - Volume discount rebate tracking: 95% progress toward 5% annual retrospective bonus',
      '========================================================================',
      'CONFIDENTIAL - FOR INTERNAL COMMERCIAL OPERATIONS REVIEW ONLY',
      `Generated on: ${new Date().toISOString()}`
    ].join('\r\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KAM-Group-Review-${(a ? a.name : 'Group').replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  'log-asset-audit': ({ ctx, data }) => {
    const a = ctx.data.byId[data.id];
    (ctx.ui ||= {}).accountToast = `Asset inspection EQ-9821 verified for ${a ? a.name : 'account'}.`;
    if (ctx.m?.logAudit) ctx.m.logAudit('Asset Management', `Verified operating status and 96% purity for asset EQ-9821 at ${a ? a.name : data.id}`);
  },
  'download-dossier': ({ ctx, data }) => {
    const a = ctx.data.byId[data.id];
    const fmt = ctx.fmt;
    const hist = a.orderHistory || [];
    const totalSpend = hist.reduce((sum, o) => sum + o.total, 0);
    const avgOrder = hist.length ? Math.round(totalSpend / hist.length) : 0;
    const content = [
      '========================================================================',
      'EXECUTIVE ACCOUNT 360 DOSSIER',
      `Customer: ${a.name}`,
      `Address: ${a.address}, ${a.city}`,
      `Category Tier: Tier ${a.tier} | CRM ID: ACC-${10000 + (a.name.length * 47) % 90000} | ERP Master: KNA1-${20000 + (a.name.length * 83) % 90000}`,
      `Operating Hours: ${fmt.time(a.hours[0])} - ${fmt.time(a.hours[1])}`,
      '========================================================================',
      '',
      '1. COMMERCIAL VALUE AND VELOCITY',
      `   - Annual Potential: ${fmt.money(a.potential)}`,
      `   - Current Captured Volume: ${fmt.money(a.current)}`,
      `   - Identified Whitespace Opportunity: ${fmt.money(a.whiteSpace)}`,
      `   - Average Order Value: ${fmt.money(avgOrder)} across ${hist.length} orders`,
      `   - Total Lifetime Invoiced: ${fmt.money(totalSpend)}`,
      '',
      '2. MASTER CONTRACT AND CREDIT FACILITY',
      `   - Master Contract: AGR-2026-${1000 + (a.name.length * 97) % 9000}`,
      `   - Credit Limit: ${fmt.money(a.potential * 0.25)} | Utilized: ${fmt.money(a.current * 0.15)}`,
      '   - Payment Terms: Net 30 Days (Prepaid freight terms)',
      `   - Volume Schedule: 5% at ${fmt.money(500)}, 10% at ${fmt.money(2000)}`,
      '',
      '3. BUYER INFLUENCE AND CONTACT MATRIX',
      ...a.contacts.map((c) => `   - ${c.name} (${c.role}): ${c.primary ? 'Decision Maker' : 'Influencer'}, Phone: ${c.phone}, Preference: ${c.preference}`),
      '',
      '4. COMPETITIVE INTELLIGENCE AND MARKET SHARE',
      '   - Our Portfolio Penetration: 64%',
      '   - Competing Brand Share: 36% (Regional Competitor)',
      '   - Strategic Focus: Convert focus lines and capture non-core whitespace voids',
      '========================================================================',
      'CONFIDENTIAL - FOR INTERNAL COMMERCIAL EXECUTION ONLY',
      `Generated on: ${new Date().toISOString()}`
    ].join('\r\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Account-360-Dossier-${a.name.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    (ctx.ui ||= {}).accountToast = `Exported Account 360 executive dossier for ${a.name}.`;
    if (ctx.m?.logAudit) ctx.m.logAudit('Account 360', `Exported full executive dossier for ${a.name}`);
  },
  'log-competitor-intel': ({ ctx, data }) => {
    (ctx.ui ||= {}).accountToast = `Competitor field observation logged for ${data.acc}.`;
    if (ctx.m?.logAudit) ctx.m.logAudit('Market Intelligence', `Logged competitor promotion and pricing observation at ${data.acc}`);
  },
  'view-contract-doc': ({ ctx, data }) => {
    const a = ctx.data.byId[data.id];
    const poNum = 'AGR-' + String(1000 + (a.name.length * 97) % 9000);
    const content = `MASTER COMMERCIAL AGREEMENT SUMMARY\nReference: ${poNum}\nAccount: ${a.name}\nTier: ${a.tier}\nTerms: Net 30\nStatus: Active\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Contract-${poNum}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (ctx.m?.logAudit) ctx.m.logAudit('Commercial Desk', `Exported master agreement summary for ${a.name}`);
  },
  'request-credit-increase': ({ ctx, data }) => {
    const a = ctx.data.byId[data.id];
    (ctx.ui ||= {}).accountToast = `Credit review request for ${a ? a.name : 'account'} dispatched to Commercial Finance.`;
    if (ctx.m?.logAudit) ctx.m.logAudit('Credit Operations', `Submitted credit line review request for ${a ? a.name : data.id}`);
  },
  'convert-whitespace': ({ ctx, data }) => {
    const a = ctx.data.byId[data.id];
    (ctx.ui ||= {}).accountToast = `Category whitespace converted to prioritized action for ${a ? a.name : 'account'}.`;
    if (ctx.m?.logAudit) ctx.m.logAudit('Gap agent', `Converted category whitespace to prioritized action for ${a ? a.name : data.id}`);
  },
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
