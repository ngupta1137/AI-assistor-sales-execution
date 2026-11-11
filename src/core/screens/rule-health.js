// G9 Rule health page: rules lifecycle, acceptance rate, override rate,
// flags count, sample trend sparkline, and retire action with mandatory reason.

import { esc, icon, pill } from '../ui.js';

function sparkline(trend = [88, 90, 89, 93, 91, 94]) {
  const min = 80;
  const max = 100;
  const w = 70;
  const h = 22;
  const pts = trend.map((val, idx) => {
    const x = Math.round((idx / (trend.length - 1)) * w);
    const y = Math.round(h - ((val - min) / (max - min)) * h);
    return `${x},${y}`;
  }).join(' ');

  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="overflow:visible" aria-label="Sample 6-month acceptance rate trend">
    <polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2"/>
    <circle cx="${w}" cy="${Math.round(h - ((trend[trend.length - 1] - min) / (max - min)) * h)}" r="3" fill="var(--good)"/>
  </svg>`;
}

export function render(ctx) {
  const { t, m, industry, country, ui } = ctx;
  const rules = industry.governance?.rules || [];
  const readiness = industry.governance?.readiness || [];
  const readyCount = readiness.filter((r) => r.ready).length;
  const totalCount = readiness.length;
  const pct = Math.round((readyCount / Math.max(1, totalCount)) * 100);

  const filter = ui?.ruleFilter || 'all';
  const filterRules = rules.filter((r) => {
    const retired = m.isRuleRetired(r.id);
    const status = retired ? 'Retired' : (r.status || 'Healthy');
    if (filter === 'all') return true;
    if (filter === 'healthy') return status === 'Healthy';
    if (filter === 'review') return status === 'Review due';
    if (filter === 'retire') return status === 'Retire candidate' || retired;
    return true;
  });

  const retireModal = ui?.retireRuleId ? (() => {
    const r = rules.find((x) => x.id === ui.retireRuleId) || { id: ui.retireRuleId, title: 'Selected Rule' };
    const approver = ui.retireApprover || r.approver || industry.governance?.rights?.legalApprover || 'Commercial Director';
    const reason = ui.retireReason || '';
    const reasons = [
      'Obsolete commercial terms',
      'Superseded by regional trade agreement',
      'Statutory compliance update',
      'Territory coverage restructure',
    ];

    return `
    <div class="presenter-backdrop" data-act="close-retire-modal" aria-hidden="true"></div>
    <section class="as-sheet enterprise-modal" role="dialog" aria-modal="true" aria-labelledby="retire-modal-title" style="height:auto;max-height:85%;overflow-y:auto;z-index:90">
      <header class="as-head">
        <div>
          <h2 id="retire-modal-title" style="display:flex;align-items:center;gap:6px">
            ${icon('shield', 20)} Retire Policy Rule
          </h2>
          <small>${esc(r.id)} · ${esc(r.title)}</small>
        </div>
        <button class="icon-btn" data-act="close-retire-modal" aria-label="Close dialog">${icon('x', 20)}</button>
      </header>
      <div style="padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)">
        <p class="small muted">Retiring removes this rule from active recommendation evaluation. Requires sign-off from a named approver and a mandatory audit reason.</p>
        
        <label class="field"><span>Named approver</span>
          <input class="input" type="text" value="${esc(approver)}" data-change="set-retire-approver" data-input="set-retire-approver" style="height:var(--tap)"/>
        </label>

        <fieldset class="radios" style="margin:4px 0">
          <legend class="small" style="font-weight:600;margin-bottom:6px">Mandatory retirement reason</legend>
          ${reasons.map((opt) => `
            <label class="radio" style="display:flex;align-items:center;gap:8px;padding:4px 0">
              <input type="radio" name="retire-reason" value="${esc(opt)}" data-change="set-retire-reason" ${reason === opt ? 'checked' : ''}/>
              <span style="font-size:12px">${esc(opt)}</span>
            </label>
          `).join('')}
        </fieldset>

        <label class="field"><span>Audit notes (optional)</span>
          <textarea class="input" rows="2" maxlength="240" data-change="set-retire-note" placeholder="Reference compliance change or regional charter...">${esc(ui.retireNote || '')}</textarea>
        </label>

        <div class="btn-row" style="margin-top:8px">
          <button class="btn secondary" data-act="close-retire-modal" style="min-height:var(--tap)">Cancel</button>
          <button class="btn danger" data-act="confirm-retire-rule" data-id="${r.id}" style="min-height:var(--tap)" ${reason ? '' : 'disabled'}>Confirm retirement</button>
        </div>
      </div>
    </section>`;
  })() : '';

  return `${retireModal}
  ${ui?.ruleToast ? `<div class="notice good" style="margin-bottom:var(--s3)">${icon('check', 16)}<span>${esc(ui.ruleToast)}</span></div>` : ''}

  <section class="page-head">
    <span class="eyebrow">${esc(industry.name)} · Market Governance</span>
    <h1>Rule Health &amp; Policy Lifecycle</h1>
    <p class="small muted">Continuous monitoring of policy rules, acceptance trends, override frequencies, and authorized lifecycle retirement.</p>
  </section>

  <!-- G8 Readiness Banner -->
  <section class="card tight" style="margin-bottom:var(--s3);border-left:4px solid ${pct === 100 ? 'var(--good)' : 'var(--accent)'};background:var(--surface)">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
      <div style="display:flex;align-items:center;gap:6px">
        <span style="color:${pct === 100 ? 'var(--good)' : 'var(--accent)'}">${icon('shield', 18)}</span>
        <b style="font-size:12px">Season readiness: ${readyCount} of ${totalCount} items ready (${pct}%)</b>
      </div>
      <button class="btn text sm" data-act="toggle-readiness-details" style="min-height:var(--tap);font-size:11px;text-decoration:underline">
        ${ui?.readinessOpen ? 'Hide details' : 'View checklist'}
      </button>
    </div>
    <div class="bar" style="margin:6px 0 4px 0;height:6px;background:var(--line-soft);border-radius:3px;overflow:hidden">
      <div style="width:${pct}%;height:100%;background:${pct === 100 ? 'var(--good)' : 'var(--accent)'};border-radius:3px"></div>
    </div>
    ${ui?.readinessOpen ? `
      <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--line-soft)">
        <ul class="bullets small" style="margin:0 0 0 16px;padding:0;font-size:11px;line-height:1.6">
          ${readiness.map((item) => `<li><b>${esc(item.title)}:</b> ${esc(item.detail)} (${item.ready ? '<span class="good-text">Ready</span>' : '<span class="warn-text">Pending</span>'})</li>`).join('')}
        </ul>
      </div>
    ` : ''}
  </section>

  <!-- KPI Overview Strip -->
  <section class="facts" style="margin-bottom:var(--s3)">
    <div><small>Active rules</small><b>${rules.length - Object.keys(m.session.retiredRules).length}</b></div>
    <div><small>Avg acceptance</small><b class="good-text">91.4%</b></div>
    <div><small>Avg override rate</small><b>5.6%</b></div>
    <div><small>Flagged items</small><b>${m.getGapBacklog().length}</b></div>
  </section>

  <!-- Filter chips -->
  <div class="seg-ctl" role="group" aria-label="Rule health filters" style="margin-bottom:var(--s3)">
    <button class="seg ${filter === 'all' ? 'on' : ''}" data-act="set-rule-filter" data-filter="all" style="min-height:var(--tap)">All rules (${rules.length})</button>
    <button class="seg ${filter === 'healthy' ? 'on' : ''}" data-act="set-rule-filter" data-filter="healthy" style="min-height:var(--tap)">Healthy</button>
    <button class="seg ${filter === 'review' ? 'on' : ''}" data-act="set-rule-filter" data-filter="review" style="min-height:var(--tap)">Review due</button>
    <button class="seg ${filter === 'retire' ? 'on' : ''}" data-act="set-rule-filter" data-filter="retire" style="min-height:var(--tap)">Retire candidates</button>
  </div>

  <!-- Rules Table -->
  <section class="card" style="padding:0;overflow-x:auto">
    <table style="width:100%;border-collapse:collapse;min-width:680px;font-size:12px">
      <thead>
        <tr style="border-bottom:2px solid var(--line);background:var(--surface-subtle);text-align:left">
          <th style="padding:8px 10px">Rule &amp; ID</th>
          <th style="padding:8px 6px">Version</th>
          <th style="padding:8px 6px">Owner</th>
          <th style="padding:8px 6px">Approver</th>
          <th style="padding:8px 6px">Acceptance</th>
          <th style="padding:8px 6px">Override</th>
          <th style="padding:8px 6px">Trend</th>
          <th style="padding:8px 6px">Status</th>
          <th style="padding:8px 10px;text-align:right">Action</th>
        </tr>
      </thead>
      <tbody>
        ${filterRules.map((r) => {
    const retired = m.isRuleRetired(r.id);
    const flagsCount = m.getGapBacklog().filter((g) => g.owner === r.owner).length;
    const status = retired ? 'Retired' : (r.status || 'Healthy');
    const statusTone = status === 'Healthy' ? 'good' : status === 'Review due' ? 'warn' : 'muted';
    const acceptRate = r.acceptanceRate || 92;
    const overrideRate = r.overrideRate || 5.4;

    return `
          <tr id="rule-row-${esc(r.id)}" style="border-bottom:1px solid var(--line-soft);${ctx.ui?.highlightRuleId === r.id ? 'background:var(--warn-bg, #FFF7E6);outline:2px solid var(--warn, #B45309);outline-offset:-2px' : ''}">
            <td style="padding:8px 10px">
              <b>${esc(r.title)}</b>
              <div class="small muted" style="font-size:10px">${esc(r.id)} · Scope: ${esc(r.scope)}</div>
            </td>
            <td style="padding:8px 6px"><span class="pill muted sm">${esc(r.version || 'v2.4')}</span></td>
            <td style="padding:8px 6px">${esc(r.owner)}</td>
            <td style="padding:8px 6px">${esc(r.approver || 'Commercial Director')}</td>
            <td style="padding:8px 6px"><b class="good-text">${acceptRate}%</b></td>
            <td style="padding:8px 6px">${overrideRate}%</td>
            <td style="padding:8px 6px">${sparkline([acceptRate - 4, acceptRate - 2, acceptRate - 1, acceptRate + 1, acceptRate])}</td>
            <td style="padding:8px 6px">${pill(status, statusTone)}</td>
            <td style="padding:8px 10px;text-align:right">
              ${retired ? `<span class="small muted">Retired by ${esc(m.session.retiredRules[r.id].approver || 'rule owner')}${m.session.retiredRules[r.id].reason ? `: ${esc(m.session.retiredRules[r.id].reason)}` : ''}</span>`
      : `<button class="btn secondary sm" data-act="open-retire-modal" data-id="${r.id}" style="min-height:var(--tap);font-size:11px">Retire with a reason</button>`}
            </td>
          </tr>`;
  }).join('')}
      </tbody>
    </table>
  </section>

  <p class="foot-note">Metrics and sparklines are sample data for governance review. No performance claim is made.</p>`;
}

export const actions = {
  'set-rule-filter': ({ ctx, data }) => {
    (ctx.ui ||= {}).ruleFilter = data.filter;
  },
  'toggle-readiness-details': ({ ctx }) => {
    const ui = (ctx.ui ||= {});
    ui.readinessOpen = !ui.readinessOpen;
  },
  'open-retire-modal': ({ ctx, data }) => {
    const ui = (ctx.ui ||= {});
    ui.retireRuleId = data.id;
    ui.retireReason = '';
    ui.retireNote = '';
  },
  'close-retire-modal': ({ ctx }) => {
    if (ctx.ui) ctx.ui.retireRuleId = null;
  },
  'set-retire-approver': ({ ctx, value }) => {
    (ctx.ui ||= {}).retireApprover = value;
    return false;
  },
  'set-retire-reason': ({ ctx, value }) => {
    (ctx.ui ||= {}).retireReason = value;
  },
  'set-retire-note': ({ ctx, value }) => {
    (ctx.ui ||= {}).retireNote = value;
    return false;
  },
  'confirm-retire-rule': ({ ctx, data }) => {
    const ui = ctx.ui || {};
    const approver = ui.retireApprover || 'Commercial Director';
    const reason = ui.retireReason || 'Obsolete commercial terms';
    ctx.m.retireRule(data.id, { approver, reason });
    ui.retireRuleId = null;
    ui.ruleToast = `Policy rule ${data.id} retired with approval from ${approver}.`;
  },
};

