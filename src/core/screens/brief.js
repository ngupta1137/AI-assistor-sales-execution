// R2 Overnight visit brief: the agents' ranked plan. Each item shows what the agent saw,
// what it compared against, how sure it is, and who prepared it. Approve, adjust or override.

import { esc, icon, pill, confBadge, agentTag, typeLine, AGENT_LABEL } from '../ui.js';

const ADJUST = {
  action: ['Do it first', 'Do it later in the {visit}', 'Only if time allows', 'Smaller scope today'],
  plan: ['Start earlier', 'Start later', 'Shorter {visit}', 'Longer {visit}'],
  order: ['Change quantities in the builder', 'Review lines with the {contact}', 'Split into two {orders}'],
};

function itemLink(it) {
  if (it.kind === 'action') return { href: `#/action/${it.id}`, label: 'Open action' };
  if (it.kind === 'order') return { href: `#/order/${it.accountId}`, label: 'Open {order}' };
  return { href: `#/account/${it.accountId}`, label: 'Open {account}' };
}

/** Where an override goes: the reason's route, or the KAM for key tier A accounts. Same rule as the queue. */
function overrideRecipient(ctx, it, reasonLabel) {
  const acc = ctx.data.byId[it.accountId];
  const r = ctx.industry.overrideReasons.find((x) => x.label === reasonLabel);
  const low = String(reasonLabel || '').toLowerCase();
  if (/supply|stock|inventory|depot|allocation/i.test(low)) return 'Supply Chain Operations';
  if (/price|cost|competitor|margin|discount/i.test(low)) return 'Commercial Pricing Desk';
  if (/absent|closed|away|reschedule/i.test(low)) return 'Territory Dispatcher (Rescheduled)';
  if (/space|planogram|display/i.test(low)) return 'Category Merchandising Desk';
  return ctx.t(r?.route === 'kam' || (acc.key && acc.tier === 'A') ? '{kam}' : '{manager}');
}

function sheet(ctx, it, open) {
  const { t } = ctx;
  const isOverride = open.kind === 'override';
  const name = isOverride ? `reason-${it.id}` : `adj-${it.id}`;
  const options = isOverride ? ctx.industry.overrideReasons.map((r) => r.label) : ADJUST[it.kind];
  const picked = isOverride ? open.reason : open.choice;
  const radios = options.map((label) => `
    <label class="radio"><input type="radio" name="${name}" value="${esc(label)}" data-change="${isOverride ? 'pick-reason' : 'pick-adjust'}" ${picked === label ? 'checked' : ''}><span>${esc(t(label))}</span></label>`).join('');
  const titleId = `sheet-title-${it.id}`;
  return `<div class="sheet-backdrop" data-act="panel-close" aria-hidden="true"></div>
    <div class="sheet panel" role="dialog" aria-modal="true" aria-labelledby="${titleId}" data-panel="${open.kind}" data-region="decision-sheet">
      <div class="sheet-head">
        <div><h2 id="${titleId}">${isOverride ? 'Override this item' : 'Adjust this item'}</h2><small>${esc(t(it.title, it.vars))}</small></div>
        <button class="icon-btn" data-act="panel-close" aria-label="Close">${icon('x', 20)}</button>
      </div>
      <div class="sheet-body">
        ${isOverride ? `<p class="small">${esc(picked ? `Routed to your ${overrideRecipient(ctx, it, picked)} with your reason.` : 'Pick a reason. It is feedback for the agents, never a penalty.')}</p>` : ''}
        <fieldset class="radios"><legend class="sr-only">${isOverride ? 'Reason' : 'Adjustment'}</legend>${radios}</fieldset>
        <label class="field">Note (optional)
          <textarea class="input" rows="2" maxlength="300" data-change="panel-note" data-input="panel-note">${esc(open.note || '')}</textarea></label>
      </div>
      <div class="sheet-foot">
        <button class="btn secondary" data-act="panel-close">Cancel</button>
        ${isOverride
    ? `<button class="btn danger" data-act="save-override" data-id="${it.id}" ${picked ? '' : 'disabled'}>Override</button>`
    : `<button class="btn primary" data-act="save-adjust" data-id="${it.id}" ${picked ? '' : 'disabled'}>Save adjustment</button>`}
      </div>
    </div>`;
}


function renderRuleDrawer(ctx) {
  const rd = ctx.ui?.ruleDrawerOpen;
  if (!rd) return '';
  const it = ctx.m.findAction(rd.id);
  const rule = it ? ctx.m.ruleForItem(it) : (ctx.industry.governance?.rules?.find((r) => r.id === rd.ruleId) || { id: rd.ruleId, title: 'Governance Rule' });
  const market = ctx.country.market || ctx.country.name;

  return `
  <div class="presenter-backdrop" data-act="close-rule-drawer" aria-hidden="true"></div>
  <section class="as-sheet enterprise-modal" role="dialog" aria-modal="true" aria-labelledby="rule-drawer-title" style="height:auto;max-height:85%;overflow-y:auto;z-index:90">
    <header class="as-head">
      <div>
        <h2 id="rule-drawer-title" style="display:flex;align-items:center;gap:6px">
          ${icon('shield', 20)} Policy Rule Details
        </h2>
        <small>${esc(rule.id)} · Version ${esc(rule.version || 'v2.4')}</small>
      </div>
      <button class="icon-btn" data-act="close-rule-drawer" aria-label="Close rule details">${icon('x', 20)}</button>
    </header>
    <div style="padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)">
      <div class="card" style="margin:0;background:var(--surface-subtle)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <b style="font-size:13px">${esc(rule.title)}</b>
          ${pill(rule.status || 'Healthy', rule.status === 'Healthy' ? 'good' : 'warn')}
        </div>
        <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(120px,1fr));margin-top:8px">
          <div><small>Policy owner</small><b>${esc(rule.owner)}</b></div>
          <div><small>Named approver</small><b>${esc(rule.approver)}</b></div>
          <div><small>Effective dates</small><b>${esc(rule.effectiveDates || '2026-01-01 to 2026-12-31')}</b></div>
          <div><small>Last reviewed</small><b>${esc(rule.lastReviewed || '2026-09-15')}</b></div>
        </div>
      </div>

      <section class="card" style="margin:0">
        <h3>Policy scope</h3>
        <p class="small muted" style="margin-top:4px">${esc(rule.scope || 'All commercial territory accounts')}</p>
        <h3 style="margin-top:10px">What this rule is never allowed to decide</h3>
        <p class="small warn-text" style="margin-top:4px">${esc(rule.neverDecides || 'Never overrides commercial credit limits, margin floors, or statutory compliance standards')}</p>
      </section>

      <section class="card" style="margin:0;border-left:3px solid var(--accent)">
        <h3>${esc(ctx.t('Why this applied to this {account}'))}</h3>
        <ul style="margin:8px 0 0 16px;padding:0;font-size:12px;line-height:1.6">
          <li><b>Approved:</b> Verified sign-off by named approver (${esc(rule.approver)}).</li>
          <li><b>In date:</b> Policy active in ${esc(market)} for current commercial cycle.</li>
          <li><b>Applies here:</b> ${rule.general
            ? 'No specific policy rule covers this type of action in this market, so the general standard applies.'
            : `This rule governs "${esc(it ? ctx.t(it.type || '', it.vars) : 'this action')}" actions in this market. Scope: ${esc(rule.scope)}.`}</li>
        </ul>
      </section>

      <div style="display:flex;justify-content:flex-end">
        <button class="btn primary sm" data-act="close-rule-drawer" style="min-height:var(--tap);min-width:100px">Done</button>
      </div>
    </div>
  </section>`;
}

function renderFlagSheet(ctx) {
  const fs = ctx.ui?.flagSheet;
  if (!fs) return '';
  const it = ctx.m.findAction(fs.id);
  const rule = it ? ctx.m.ruleForItem(it) : { title: 'Recommendation', owner: 'Policy Owner' };
  const reasons = [
    'Not true here',
    'Out of date',
    'Wrong wording',
    'Not allowed',
    'Other',
  ];

  return `
  <div class="presenter-backdrop" data-act="close-flag-sheet" aria-hidden="true"></div>
  <section class="as-sheet enterprise-modal" role="dialog" aria-modal="true" aria-labelledby="flag-sheet-title" style="height:auto;max-height:85%;overflow-y:auto;z-index:90">
    <header class="as-head">
      <div>
        <h2 id="flag-sheet-title" style="display:flex;align-items:center;gap:6px">
          ${icon('flag', 18)} Flag this recommendation
        </h2>
        <small>${it ? esc(ctx.t(it.title, it.vars)) : 'Recommendation'}</small>
      </div>
      <button class="icon-btn" data-act="close-flag-sheet" aria-label="Close flag form">${icon('x', 20)}</button>
    </header>
    <div style="padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)">
      <p class="small muted">Flagging creates a ticket in the gap backlog and sends feedback to the rule owner (<b>${esc(rule.owner)}</b>). It is feedback for improving policies, never a penalty.</p>
      
      <fieldset class="radios" style="margin:4px 0">
        <legend class="sr-only">Flag reason</legend>
        ${reasons.map((r) => `
          <label class="radio" style="display:flex;align-items:center;gap:8px;padding:4px 0">
            <input type="radio" name="flag-reason-${fs.id}" value="${esc(r)}" data-change="pick-flag-reason" ${fs.reason === r ? 'checked' : ''}>
            <span style="font-size:12px">${esc(r)}</span>
          </label>
        `).join('')}
      </fieldset>

      <label class="field">Note (optional)
        <textarea class="input" rows="2" maxlength="300" data-change="flag-note" data-input="flag-note" placeholder="Add specific local context...">${esc(fs.note || '')}</textarea>
      </label>

      <div class="btn-row" style="margin-top:8px">
        <button class="btn secondary" data-act="close-flag-sheet">Cancel</button>
        <button class="btn primary" data-act="submit-flag" data-id="${fs.id}" ${fs.reason ? '' : 'disabled'}>Submit flag</button>
      </div>
    </div>
  </section>`;
}

function renderItem(ctx, it, isNext, a, itemIndex) {
  const { t, fmt, m, ui, data } = ctx;
  const v = it.vars;
  const d = m.decision(it.id);
  const paused = m.agentStopped(it.agent);
  const link = itemLink(it);
  const open = ui.panel && ui.panel.id === it.id ? ui.panel : null;
  const state = paused ? 'paused' : d ? d.status : 'pending';
  const valueText = it.value > 0 ? `Est. ${fmt.money(it.value)}` : it.kind === 'plan' ? `${v.fits} of ${v.total} actions fit` : 'Value set by people';
  const stateLabel = { pending: ['To review', 'warn'], approved: ['Approved', 'good'], adjusted: ['Adjusted', 'info'], overridden: ['Overridden', 'muted'], paused: ['Paused', 'muted'] }[state];

  // G2 Rule metadata and status chips
  const rule = m.ruleForItem(it);
  const flag = m.getFlag(it.id);
  const exactRead = m.isExactWordingRead(rule.id, it.id);
  const isExact = rule.exactWording || false;

  // G1 Deterministic seven outcomes
  const gov = m.itemOutcome(it, a, itemIndex);
  const outcome = gov.outcome || 'suggest';

  let outcomeUi = '';
  if (outcome === 'clarify') {
    const cq = ctx.industry.governance?.clarifyQuestions?.[0] || { q: 'Clarify execution format before proceeding', chips: ['Standard visit', 'Priority audit', 'Follow-up call'] };
    const qText = ctx.t(cq.q || cq.question || 'Clarify execution format before proceeding');
    const chips = cq.chips || cq.options || ['Standard visit', 'Priority audit', 'Follow-up call'];
    outcomeUi = `<div class="gov-outcome clarify" style="margin:8px 0;padding:10px;border-left:3px solid var(--accent);background:var(--surface-subtle);border-radius:var(--radius-sm)">
      <div style="font-weight:600;font-size:12px;margin-bottom:4px;color:var(--ink)">Needs clarification</div>
      <p class="small" style="margin-bottom:8px">${esc(qText)}</p>
      <div class="btn-row" style="gap:6px;flex-wrap:wrap">
        ${chips.map((opt) => `<button class="btn secondary sm" data-act="resolve-clarify" data-id="${it.id}" data-choice="${esc(opt)}" style="min-height:var(--tap);display:inline-flex;align-items:center">${esc(opt)}</button>`).join('')}
      </div>
      <div class="next-step-line" style="margin-top:8px;font-size:11px;color:var(--muted)"><b>Next step:</b> Select a clarification option above to generate the final recommendation.</div>
    </div>`;
  } else if (outcome === 'evidence') {
    outcomeUi = `<div class="gov-outcome evidence" style="margin:8px 0;padding:10px;border-left:3px solid var(--line-warn, #f59e0b);background:var(--surface-subtle);border-radius:var(--radius-sm)">
      <div style="font-weight:600;font-size:12px;margin-bottom:4px;color:var(--ink)">Not enough evidence on file</div>
      <p class="small" style="margin-bottom:8px">${esc(ctx.t('Missing baseline field verification data for this {account}. Recommendation engine does not guess without verified evidence.'))}</p>
      <button class="btn secondary sm" data-act="add-evidence-note" data-id="${it.id}" style="min-height:var(--tap)">${icon('camera', 14)} Add a photo or note</button>
      <div class="next-step-line" style="margin-top:8px;font-size:11px;color:var(--muted)"><b>Next step:</b> Capture required field evidence to unlock automated recommendation.</div>
    </div>`;
  } else if (outcome === 'conflict') {
    const otherRule = ctx.industry.governance?.rules?.[1] || { title: 'Standard category quota distribution', owner: 'Field Operations Lead' };
    outcomeUi = `<div class="gov-outcome conflict" style="margin:8px 0;padding:10px;border-left:3px solid var(--line-warn, #f59e0b);background:var(--surface-subtle);border-radius:var(--radius-sm)">
      <div style="font-weight:600;font-size:12px;margin-bottom:4px;color:var(--ink)">Policy conflict detected</div>
      <p class="small" style="margin-bottom:6px">${esc(ctx.t('Two approved rules disagree on this {account}. The system never picks between conflicting policies:'))}</p>
      <ul style="margin:0 0 8px 16px;padding:0;font-size:11px">
        <li><b>Rule 1:</b> ${esc(rule.title)} (Owner: ${esc(rule.owner)})</li>
        <li><b>Rule 2:</b> ${esc(otherRule.title)} (Owner: ${esc(otherRule.owner)})</li>
      </ul>
      <button class="btn secondary sm" data-act="ask-manager-conflict" data-id="${it.id}" style="min-height:var(--tap)">${icon('team', 14)} Ask your manager</button>
      <div class="next-step-line" style="margin-top:8px;font-size:11px;color:var(--muted)"><b>Next step:</b> Escalate to field sales manager to establish policy precedence.</div>
    </div>`;
  } else if (outcome === 'stale') {
    outcomeUi = `<div class="gov-outcome stale" style="margin:8px 0;padding:10px;border-left:3px solid var(--muted);background:var(--surface-subtle);border-radius:var(--radius-sm)">
      <div style="font-weight:600;font-size:12px;margin-bottom:4px;color:var(--ink)">Data is stale</div>
      <p class="small" style="margin-bottom:8px">Account metrics were last refreshed 18 days ago (threshold: ${ctx.industry.governance?.staleLimitDays || 14} days).</p>
      <button class="btn primary sm" data-act="refresh-stale" data-id="${it.id}" style="min-height:var(--tap)">${icon('sync', 14)} Refresh</button>
      <div class="next-step-line" style="margin-top:8px;font-size:11px;color:var(--muted)"><b>Next step:</b> Tap Refresh to sync current depot inventory and return to active recommendation.</div>
    </div>`;
  } else if (outcome === 'role') {
    outcomeUi = `<div class="gov-outcome role" style="margin:8px 0;padding:10px;border-left:3px solid var(--muted);background:var(--surface-subtle);border-radius:var(--radius-sm)">
      <div style="font-weight:600;font-size:12px;margin-bottom:4px;color:var(--ink)">Action not allowed for this role</div>
      <p class="small" style="margin-bottom:6px">This recommendation requires Key Account Lead authority. Outside permissions for ${esc(ctx.persona === 'rep' ? (ctx.industry.personas?.rep || 'Sales Rep') : ctx.persona)}.</p>
      <div class="small muted">Owning team: Key Account Management Desk</div>
      <div class="next-step-line" style="margin-top:8px;font-size:11px;color:var(--muted)"><b>Next step:</b> Assigned to Key Account Management Desk for centralized execution.</div>
    </div>`;
  } else if (outcome === 'compliance') {
    outcomeUi = `<div class="gov-outcome compliance" style="margin:8px 0;padding:10px;border-left:3px solid #ef4444;background:var(--surface-subtle);border-radius:var(--radius-sm)">
      <div style="font-weight:600;font-size:12px;margin-bottom:4px;color:var(--ink)">Compliance escalation hold</div>
      <p class="small" style="margin-bottom:6px">Recommendation placed on supervisory hold pending regulatory verification. Stops execution before field suggestion.</p>
      <div class="small muted">Routed to: <b>${esc(ctx.industry.governance?.rights?.legalApprover || 'Legal Counsel')}</b></div>
      <div class="next-step-line" style="margin-top:8px;font-size:11px;color:var(--muted)"><b>Next step:</b> Awaiting sign-off from named legal approver before field presentation.</div>
    </div>`;
  }

  // G7 Exact wording box
  let exactBox = '';
  if (outcome === 'suggest' && isExact && !exactRead) {
    exactBox = `<div class="exact-wording-box" style="margin:8px 0;padding:8px 10px;border:2px solid var(--accent);border-radius:var(--radius-sm);background:var(--surface)">
      <div style="font-weight:600;font-size:11px;color:var(--accent);margin-bottom:4px;display:flex;align-items:center;gap:4px">
        ${icon('shield', 14)} Approved wording: read before you act
      </div>
      <blockquote style="margin:0 0 6px 0;font-size:11px;font-style:italic;line-height:1.4">
        "${esc(rule.approvedWording || 'Use only the approved wording for this rule.')}"
      </blockquote>
      <small class="muted" style="display:block;margin-bottom:6px;font-size:10px">Rule: ${esc(rule.title)} · approved by ${esc(rule.approver || 'Legal Counsel')}</small>
      <label class="tap-check" style="font-size:12px;font-weight:600">
        <input type="checkbox" data-change="read-exact-wording" data-id="${it.id}" data-rule="${rule.id}">
        <span>I have read this wording</span>
      </label>
    </div>`;
  }

  let controls;
  if (paused) {
    controls = `<div class="paused-note">${icon('stop', 16)} ${esc(AGENT_LABEL[it.agent])} is stopped. This item is paused. <a href="#/agents">Agent controls</a></div>`;
  } else if (d) {
    const detail = d.status === 'adjusted' ? t(d.choice) : d.status === 'overridden' ? `${t(d.reason)}. Routed to ${overrideRecipient(ctx, it, d.reason)}.` : '';
    controls = `<div class="decided">
      ${detail ? `<span class="note">${esc(detail)}</span>` : ''}
      ${d.note ? `<span class="note">Note: ${esc(d.note)}</span>` : ''}
      <button class="btn secondary sm" data-act="undo" data-id="${it.id}">Undo</button>
      <span class="spacer"></span>
      ${d.status !== 'overridden' ? `<a class="btn text sm" href="${link.href}">${esc(t(link.label))} ${icon('chevron', 16)}</a>` : ''}
    </div>`;
  } else if (outcome === 'suggest') {
    if (isExact && !exactRead) {
      controls = `<div class="decide-row">
        <span class="small muted" style="align-self:center;font-size:11px">Read wording above to approve.</span>
        <button class="btn secondary" data-act="panel" data-id="${it.id}" data-kind="adjust">Adjust</button>
        <button class="btn secondary" data-act="panel" data-id="${it.id}" data-kind="override">Override</button>
      </div>`;
    } else {
      controls = `<div class="decide-row">
        <button class="btn primary" data-act="decide" data-id="${it.id}" data-status="approved">Approve</button>
        <button class="btn secondary" data-act="panel" data-id="${it.id}" data-kind="adjust">Adjust</button>
        <button class="btn secondary" data-act="panel" data-id="${it.id}" data-kind="override">Override</button>
      </div>`;
    }
  } else {
    controls = `<div class="decide-row">
      <button class="btn secondary sm" data-act="panel" data-id="${it.id}" data-kind="override">Override</button>
    </div>`;
  }

  // G4 Flag status or trigger
  const flagHtml = flag
    ? `<div style="margin:4px 0;display:flex;align-items:center;gap:6px">${pill(`Flagged: ${flag.reason}`, 'warn')}<span class="small muted" style="font-size:11px">Sent to rule owner (${esc(flag.owner)})</span></div>`
    : `<div style="margin:4px 0"><button class="btn text sm flag-link" data-act="open-flag-sheet" data-id="${it.id}" style="min-height:var(--tap);display:inline-flex;align-items:center;padding:0 8px;font-size:11px;color:var(--muted)">${icon('flag', 12)} Flag this recommendation</button></div>`;

  // G2 Chips row
  const chipsRow = `<div class="rule-chips" data-act="open-rule-drawer" data-id="${it.id}" data-rule="${rule.id}" role="button" tabindex="0" aria-label="Rule details" style="cursor:pointer;display:flex;gap:4px;flex-wrap:wrap;align-items:center;margin:6px 0;min-height:var(--tap)">
    ${pill('Rule approved', 'good')}
    ${pill('In date', 'info')}
    ${pill('Applies here', 'good')}
    ${pill(rule.version || 'v2.4', 'muted')}
    ${isExact ? pill('Exact wording', 'warn') : ''}
    ${isExact ? pill('Wording approved', 'good') : ''}
  </div>`;

  // G6 Record kept
  const evtId = 1000 + (Math.abs(rule.id.length * 37 + it.id.length * 13) % 9000);
  const recordKept = `<div class="record-kept" style="margin-top:8px;padding:8px 10px;background:var(--surface-subtle);border-radius:4px;border:1px dashed var(--line);font-size:11px">
    <div style="font-weight:600;color:var(--ink);display:flex;align-items:center;gap:4px">
      ${icon('shield', 14)} Record kept (audit receipt)
    </div>
    <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(110px,1fr));margin-top:6px">
      <div><small>Rule version</small><b>${esc(rule.version || 'v2.4')}</b></div>
      <div><small>Data used &amp; age</small><b>14-day depot CRM</b></div>
      <div><small>Outcome</small><b>${esc(outcome)}</b></div>
      <div><small>Model use</small><b>Rules decide; model words reason</b></div>
      <div><small>Audited viewer</small><b>${esc(ctx.persona)} (${esc(data.rep.name)})</b></div>
      <div><small>Audit event ID</small><b>EVT-${evtId}</b></div>
    </div>
  </div>`;

  const lead = it.kind === 'plan' ? icon('route', 16) : it.kind === 'order' ? icon('cart', 16) : it.rank;
  return `<article class="item ${state}${isNext ? ' next' : ''}" id="item-${it.id}" data-item="${it.id}" data-kind="${it.kind}" data-state="${state}">
    <div class="item-head">${agentTag(it.agent)}${it.overBudget ? pill('If time allows', 'muted') : ''}<span class="state">${pill(stateLabel[0], stateLabel[1])}</span></div>
    <div class="item-title"><span class="rank">${lead}</span><h3>${esc(t(it.title, v))}</h3></div>
    ${chipsRow}
    <div style="margin:4px 0 6px 0;padding:4px 6px;background:var(--surface-subtle);border-radius:4px;border-left:3px solid var(--accent);font-size:11px">
      <b>Rationale:</b> ${esc(t(it.saw, v).replace(/\.+\s*$/, '')).slice(0, 110)}.
    </div>
    <div class="metrics"><span>${esc(valueText)}</span>${it.effort ? `<span>${icon('clock', 16)} ${it.effort} min</span>` : ''}${confBadge(it.confidence)}</div>
    ${outcomeUi}
    ${exactBox}
    <details class="evi"${isNext ? ' open' : ''}><summary>What the agent saw</summary>
      <dl class="evidence">
        <dt>Saw</dt><dd>${esc(t(it.saw, v))}</dd>
        <dt>Compared</dt><dd>${esc(t(it.compared, v))}</dd>
      </dl>
      ${recordKept}
    </details>
    ${flagHtml}
    ${ctx.app?.simpleView ? `<div style="margin-top:6px"><button class="btn secondary sm talk-mgr-btn" data-act="talk-to-manager" data-id="${it.id}" style="min-height:var(--tap);display:inline-flex;align-items:center;gap:4px">${icon('team', 14)} Talk to my manager</button></div>` : ''}
    ${controls}
    ${open && !paused && !d ? sheet(ctx, it, open) : ''}
  </article>`;
}

export function render(ctx, [accountId]) {
  const { t, fmt, data, m, ui } = ctx;
  const p = m.plannedFor(accountId) || data.planned[0];
  const a = data.byId[p.accountId];
  const c = m.counts(a.id);
  const items = m.briefItems(a.id);
  const contact = a.contacts[0];
  const firstPending = items.find((it) => !m.decision(it.id) && !m.agentStopped(it.agent));
  const prev = ui.prevCounts?.[a.id];
  const bump = (k) => (prev && prev[k] !== c[k] ? ' class="bump"' : '');
  ui.prevCounts = { ...(ui.prevCounts || {}), [a.id]: c };

  const collateralModal = ui.collateralOpen ? `
  <div class="presenter-backdrop" data-act="close-collateral" aria-hidden="true"></div>
  <section class="as-sheet" role="dialog" aria-modal="true" aria-labelledby="collateral-title" style="height:auto;max-height:85%;overflow-y:auto;z-index:90">
    <header class="as-head">
      <div>
        <h2 id="collateral-title">${icon('brief', 18)} Sales collateral and documents</h2>
        <small>${esc(ctx.industry.name)} · Approved Commercial Collateral</small>
      </div>
      <button class="icon-btn" data-act="close-collateral" aria-label="Close collateral">${icon('x', 20)}</button>
    </header>
    <div style="padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)">
      <div class="card" style="margin:0">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <b>Commercial Catalog and Specification</b>
          ${pill('PDF · 1.4 MB', 'info')}
        </div>
        <p class="small muted" style="margin-top:4px">Quarterly approved price schedules, technical specifications, and bulk volume terms.</p>
        <button class="btn secondary sm" data-act="share-doc" data-doc="Commercial Catalog" data-to="${esc(contact.name)}" style="min-height:var(--tap);margin-top:8px;width:100%">${icon('brief', 14)} Share with ${esc(contact.name)}</button>
      </div>
      <div class="card" style="margin:0">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <b>Regulatory Compliance and Certificate</b>
          ${pill('PDF · 820 KB', 'good')}
        </div>
        <p class="small muted" style="margin-top:4px">Certificate of analysis, safety compliance data sheets, and verified regulatory clearances.</p>
        <button class="btn secondary sm" data-act="share-doc" data-doc="Compliance Certificate" data-to="${esc(contact.name)}" style="min-height:var(--tap);margin-top:8px;width:100%">${icon('shield', 14)} Share with ${esc(contact.name)}</button>
      </div>
      <button class="btn primary block" data-act="close-collateral" style="min-height:var(--tap)">Close</button>
    </div>
  </section>` : '';


  const deckSlide = ui.deckSlide || 1;
  const deckModal = ui.pitchDeckOpen ? `
  <div class="presenter-backdrop" data-act="close-deck" aria-hidden="true"></div>
  <section class="as-sheet enterprise-modal" role="dialog" aria-modal="true" aria-labelledby="deck-title" style="height:auto;max-height:88%;overflow-y:auto;z-index:90">
    <header class="as-head" style="align-items:center">
      <div>
        <h2 id="deck-title" style="display:flex;align-items:center;gap:8px">
          ${icon('screen', 20)} Commercial Growth Proposal
        </h2>
        <small>${esc(a.name)} · Prepared for ${esc(contact.name)}</small>
      </div>
      <button class="icon-btn" data-act="close-deck" aria-label="Close presentation" style="min-height:var(--tap);min-width:var(--tap)">${icon('x', 20)}</button>
    </header>

    <div style="padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)">
      <div style="display:flex;justify-content:space-between;align-items:center">
        ${pill(`Slide ${deckSlide} of 3`, 'info')}
        <div class="btn-row" style="gap:6px">
          <button class="btn secondary sm" data-act="deck-prev" style="min-height:var(--tap);min-width:var(--tap)" ${deckSlide <= 1 ? 'disabled' : ''}>${icon('back', 16)} Prev</button>
          <button class="btn secondary sm" data-act="deck-next" style="min-height:var(--tap);min-width:var(--tap)" ${deckSlide >= 3 ? 'disabled' : ''}>Next ${icon('chevron', 16)}</button>
        </div>
      </div>

      ${deckSlide === 1 ? `
        <section class="card" style="margin:0;background:var(--surface-subtle)">
          <div class="section-head">
            <h3>Customer category growth potential</h3>
            ${pill('Territory benchmark', 'good')}
          </div>
          <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr));margin-top:8px">
            <div><small>Annual turnover</small><b class="money">${esc(fmt.moneyShort(a.current))}</b></div>
            <div><small>Market potential</small><b class="money good-text">${esc(fmt.moneyShort(a.potential))}</b></div>
            <div><small>Growth upside</small><b class="money">+${esc(fmt.moneyShort(a.whiteSpace))}</b></div>
          </div>
          <p class="small muted" style="margin-top:10px">Based on comparable commercial accounts in ${esc(a.city)}, this customer can expand category throughput by +12.4% with optimized assortment allocation.</p>
        </section>
      ` : deckSlide === 2 ? `
        <section class="card" style="margin:0;background:var(--surface-subtle)">
          <div class="section-head">
            <h3>Prioritized portfolio expansion</h3>
            ${pill('High margin velocity', 'good')}
          </div>
          <div class="card tight" style="margin-top:8px">
            <b>${esc(t(items[0]?.title || 'Featured Commercial Offering', items[0]?.vars))}</b>
            <p class="small muted" style="margin-top:4px">Optimizes category display density and captures immediate unmet buyer demand.</p>
            <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr));margin-top:6px">
              <div><small>Margin uplift</small><b class="good-text">+14.8%</b></div>
              <div><small>Estimated upside</small><b class="money">${esc(fmt.money(items[0]?.value || 1200))}</b></div>
              <div><small>Risk profile</small><b>Low</b></div>
            </div>
          </div>
        </section>
      ` : `
        <section class="card" style="margin:0;background:var(--surface-subtle)">
          <div class="section-head">
            <h3>Commercial pricing terms and fulfillment</h3>
            ${pill('Approved contract', 'good')}
          </div>
          <ul class="bullets small" style="margin-top:8px">
            <li><b>Volume Rebate Schedule:</b> 5% discount at ${esc(fmt.money(500))}, 10% discount at ${esc(fmt.money(2000))}.</li>
            <li><b>Payment Facility:</b> Approved Net 30 payment terms with zero credit surcharge.</li>
            <li><b>Logistics Guarantee:</b> 48-hour distribution dispatch with prepaid freight.</li>
          </ul>
          <div style="margin-top:10px">
            <a class="btn primary block" href="#/order/${a.id}" style="min-height:var(--tap);display:flex;align-items:center;justify-content:center">${icon('cart', 16)} Open order draft</a>
          </div>
        </section>
      `}

      <button class="btn secondary block" data-act="close-deck" style="min-height:var(--tap);margin-top:4px">Exit presentation mode</button>
    </div>
  </section>` : '';

  return `${collateralModal}${deckModal}${renderRuleDrawer(ctx)}${renderFlagSheet(ctx)}
  ${ui.briefToast ? `<div class="notice good" style="margin-bottom:var(--s3)">${icon('check', 16)}<span>${esc(ui.briefToast)}</span></div>` : ''}
  <a class="back" href="#/today">${icon('back', 18)} ${esc(t('Today'))}</a>
  <section class="brief-head">
    <span class="eyebrow">${esc(t('{Visit} brief'))} · prepared overnight</span>
    <h1>${esc(a.name)}</h1>
    <p class="small muted">${esc(typeLine(t, a))} · ${esc(a.area)} · Tier ${a.tier}</p>
    <p class="small">${esc(fmt.time(p.start))} · ${a.visitMinutes} min · ${esc(contact.name)}, ${esc(t(contact.role))}</p>
    <div style="margin-top:10px;padding:8px 10px;background:var(--surface-subtle);border-radius:var(--radius-sm);border:1px solid var(--line-soft)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <small style="font-weight:600">Primary call objective:</small>
        ${pill(ui.callObjective || 'Expand whitespace', 'good')}
      </div>
      <div class="seg-ctl" role="group" aria-label="Call objective" style="margin-top:4px">
        <button class="seg ${(ui.callObjective || 'Expand whitespace') === 'Expand whitespace' ? 'on' : ''}" data-act="set-objective" data-obj="Expand whitespace" style="min-height:var(--tap);min-width:var(--tap)">Expand whitespace</button>
        <button class="seg ${ui.callObjective === 'Volume reorder' ? 'on' : ''}" data-act="set-objective" data-obj="Volume reorder" style="min-height:var(--tap);min-width:var(--tap)">Volume reorder</button>
        <button class="seg ${ui.callObjective === 'Merchandising' ? 'on' : ''}" data-act="set-objective" data-obj="Merchandising" style="min-height:var(--tap);min-width:var(--tap)">Merchandising</button>
      </div>
    </div>
    <!-- Commercial Shared Constraints Verification Strip -->
    <div style="margin-top:10px;padding:8px 10px;background:var(--surface-subtle);border-radius:var(--radius-sm);border:1px solid var(--line-soft)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <small style="font-weight:600;display:flex;align-items:center;gap:4px">
          ${icon('shield', 14)} Commercial constraints verified
        </small>
        ${pill('All constraints passed', 'good')}
      </div>
      <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(70px,1fr));margin-bottom:4px">
        <div><small>Receiving</small><b class="good-text">Open</b></div>
        <div><small>Depot stock</small><b class="good-text">Allocated</b></div>
        <div><small>Credit</small><b class="good-text">Available</b></div>
        <div><small>Contract</small><b>Active</b></div>
      </div>
      <p class="small muted" style="margin:0;font-size:11px">Recommendations hard-filtered against receiving dock windows, distributor depot inventory, and customer credit limits.</p>
    </div>

    
    <div style="margin-top:8px">
      ${ui.accountAbsentRescheduled ? `
        <div class="notice good">
          ${icon('check', 14)}
          <span><b>Account closed / Buyer absent.</b> First reschedule within 14-day SLA window confirmed. Rep score protected.</span>
        </div>
        ${ui.rescheduleChainWarning ? `
          <div class="notice warn" style="margin-top:4px">
            ${icon('shield', 14)}
            <span><b>Second reschedule attempted:</b> Requires District Field Manager approval. Score protection suspended until approved.</span>
          </div>
        ` : `
          <button class="btn text sm" data-act="try-second-reschedule" data-id="${a.id}" style="font-size:10px;min-height:var(--tap);display:inline-flex;align-items:center;padding:0;color:var(--muted)">
            Need to reschedule again? (Requires manager approval)
          </button>
        `}
      ` : `
        <button class="btn secondary sm" data-act="record-absent" data-id="${a.id}" style="min-height:var(--tap);width:100%;font-size:11px">
          ${icon('clock', 12)} Account closed / Buyer absent? Reschedule with SLA protection
        </button>
      `}
    </div>

    
    <!-- Multi-Role Visit Coordination Hub -->
    <div class="card tight" style="margin-top:8px;background:var(--surface-subtle);border:1px solid var(--line-soft)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <b>Multi-role location coordination</b>
        ${pill('Synchronized', 'good')}
      </div>
      <p class="small muted" style="margin:0 0 6px 0;font-size:11px">Shared graph across merchandiser, pre-sell rep, and delivery driver to prevent conflicting execution.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(95px,1fr));gap:4px;font-size:11px">
        <div style="padding:4px 6px;background:var(--surface);border-radius:4px;border:1px solid var(--line-soft)">
          <span class="muted">Merchandiser:</span>
          <b style="display:block" class="good-text">Display set (07:30)</b>
        </div>
        <div style="padding:4px 6px;background:var(--surface);border-radius:4px;border:1px solid var(--line-soft)">
          <span class="muted">Pre-Sell (You):</span>
          <b style="display:block;color:var(--accent)">Active in-visit</b>
        </div>
        <div style="padding:4px 6px;background:var(--surface);border-radius:4px;border:1px solid var(--line-soft)">
          <span class="muted">Driver Route:</span>
          <b style="display:block">ETA 14:15 (Tomorrow)</b>
        </div>
      </div>
    </div>

    <!-- Rapid In-Visit Blitz Mode Bar -->
    <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center;gap:8px">
      <button class="btn ${ui.blitzMode ? 'primary' : 'secondary'} sm" data-act="toggle-blitz" style="min-height:var(--tap);flex:1;display:flex;align-items:center;justify-content:center;gap:6px">
        ${icon('clock', 14)} ${ui.blitzMode ? 'Exit Rapid Blitz Mode' : 'Rapid In-Visit Blitz Mode (45s)'}
      </button>
    </div>
    ${ui.blitzMode ? `
      <div class="card tight" style="margin-top:8px;border:2px solid var(--accent);background:var(--accent-soft)">
        <div class="section-head" style="margin-bottom:4px">
          <b style="color:var(--ink)">Rapid execution priority</b>
          ${pill('Highest feasible yield', 'good')}
        </div>
        <p class="small" style="margin-bottom:8px">Streamlined for rushed buyer interactions. Single high-yield verified action and fast replenishment reorder.</p>
        <small class="muted" style="display:block;margin-bottom:8px;font-size:10px">Supervisory threshold: Reps exceeding 25% Blitz mode over 14 days flagged for territory coaching review.</small>
        <div style="padding:6px 8px;background:var(--surface);border-radius:4px;margin-bottom:8px;border:1px solid var(--line-soft)">
          <b>${esc(t(items[0]?.title || 'Core Priority Action', items[0]?.vars))}</b>
          <div class="small muted">Distributor stock verified · Estimated upside: ${esc(fmt.money(items[0]?.value || 500))}</div>
        </div>
        <div class="btn-row" style="gap:6px">
          <a class="btn primary sm" href="#/action/${items[0]?.id || ''}" style="min-height:var(--tap);flex:1;display:flex;align-items:center;justify-content:center">Execute priority action</a>
          <a class="btn secondary sm" href="#/order/${a.id}" style="min-height:var(--tap);flex:1;display:flex;align-items:center;justify-content:center">Quick reorder</a>
        </div>
      </div>
    ` : ''}

  </section>
  <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
    <button class="btn secondary sm" data-act="open-deck" style="flex:1;min-height:var(--tap);min-width:140px">${icon('screen', 16)} In-call pitch mode</button>
    <button class="btn secondary sm" data-act="open-collateral" style="flex:1;min-height:var(--tap);min-width:140px">${icon('brief', 16)} Sales collateral</button>
    <a class="btn secondary sm" href="#/account/${a.id}" style="flex:1;min-height:var(--tap);min-width:140px;display:flex;align-items:center;justify-content:center">${icon('note', 16)} ${esc(t('{Account} 360'))}</a>
  </div>

  <div class="counts tight" id="counts" aria-live="polite">
    <span data-count="approved"${bump('approved')}><b>${c.approved}</b>Approved</span>
    <span data-count="adjusted"${bump('adjusted')}><b>${c.adjusted}</b>Adjusted</span>
    <span data-count="overridden"${bump('overridden')}><b>${c.overridden}</b>Overridden</span>
    <span data-count="pending"${bump('pending')}><b>${c.pending}</b>To review</span>
  </div>
  <p class="small muted tight guard">${esc(t('Reviewing this brief does not submit an {order}.'))}${c.paused ? ` ${c.paused} paused.` : ''}</p>

  <div class="items tight">${items.map((it, idx) => renderItem(ctx, it, it === firstPending, a, idx)).join('')}</div>

  <div class="btn-row">
    ${c.pending > 0 ? `<button class="btn secondary block" data-act="approve-all" data-id="${a.id}">Approve all remaining (${c.pending})</button>` : ''}
    <a class="btn secondary" style="flex:1" href="#/account/${a.id}">${esc(t('{Account} 360'))}</a>
    <a class="btn secondary" style="flex:1" href="#/order/${a.id}">${esc(t('Open {order}'))}</a>
    <a class="btn primary block" href="#/complete/${a.id}" id="finish-visit">${esc(t('Finish {visit}'))}</a>
  </div>
  <p class="foot-note">Rule-based scoring on generated data. Confidence describes the rules, not a chance of a sale.</p>`;
}

export function mounted(ctx) {
  const sheetEl = document.querySelector('.sheet');
  if (!sheetEl) return;
  // The sheet re-renders when a reason is picked; keep typing at the end of the note, not the start.
  const note = sheetEl.querySelector('textarea');
  note?.addEventListener('focus', () => { const n = note.value.length; note.setSelectionRange(n, n); });
  if (!sheetEl.contains(document.activeElement)) (sheetEl.querySelector('input:checked') || sheetEl.querySelector('input'))?.focus({ preventScroll: true });
}

/** Reads the note straight from the textarea at save time, so no input method can lose it. */
const currentNote = (ctx, id) => {
  const el = document.querySelector(`#item-${CSS.escape(id)} textarea`);
  return (el ? el.value : ctx.ui.panel?.note || '').trim().slice(0, 300);
};

export const actions = {
  'open-rule-drawer': ({ ctx, data }) => { (ctx.ui ||= {}).ruleDrawerOpen = { id: data.id, ruleId: data.rule }; },
  'close-rule-drawer': ({ ctx }) => { (ctx.ui ||= {}).ruleDrawerOpen = null; },
  'open-flag-sheet': ({ ctx, data }) => { (ctx.ui ||= {}).flagSheet = { id: data.id, reason: '', note: '' }; },
  'close-flag-sheet': ({ ctx }) => { (ctx.ui ||= {}).flagSheet = null; },
  'pick-flag-reason': ({ ctx, value }) => { if (ctx.ui?.flagSheet) ctx.ui.flagSheet.reason = value; },
  'flag-note': ({ ctx, value }) => { if (ctx.ui?.flagSheet) ctx.ui.flagSheet.note = value.slice(0, 300); return false; },
  'submit-flag': ({ ctx, data }) => {
    const fs = ctx.ui?.flagSheet;
    if (fs && fs.reason) {
      ctx.m.flagRecommendation(data.id, { reason: fs.reason, note: fs.note });
      ctx.ui.flagSheet = null;
      ctx.ui.briefToast = 'Recommendation flagged and logged to gap backlog.';
    }
  },
  'resolve-clarify': ({ ctx, data }) => {
    ctx.m.resolveClarify(data.id, data.choice);
    ctx.ui.briefToast = 'Clarification resolved: ' + data.choice;
  },
  'refresh-stale': ({ ctx, data }) => {
    ctx.m.refreshStale(data.id);
    ctx.ui.briefToast = 'Data refreshed. Recommendation updated.';
  },
  'read-exact-wording': ({ ctx, data }) => {
    ctx.m.readExactWording(data.rule, data.id);
  },
  'add-evidence-note': ({ ctx, data }) => {
    ctx.m.setEvidence(data.id, { type: 'note', text: 'Field observation recorded during brief review', at: Date.now() });
    ctx.m.resolveClarify(data.id, 'Verified field evidence');
    ctx.ui.briefToast = 'Field evidence note attached.';
  },
  'ask-manager-conflict': ({ ctx, data }) => {
    ctx.m.logAudit(ctx.data.rep?.name || 'Field Rep', 'Escalated policy conflict to territory sales manager');
    ctx.ui.briefToast = 'Policy conflict escalated to sales manager.';
  },

  'try-second-reschedule': ({ ctx }) => {
    (ctx.ui ||= {}).rescheduleChainWarning = true;
  },

  'record-absent': ({ ctx, data }) => {
    const ui = (ctx.ui ||= {});
    ui.accountAbsentRescheduled = true;
    ui.briefToast = 'Account closed recorded. Stop rescheduled for Thursday Route 02-C within SLA window.';
    for (const it of ctx.m.briefItems(data.id)) {
      if (!ctx.m.decision(it.id)) {
        ctx.m.decide(it.id, { status: 'overridden', reason: 'Buyer absent', note: 'Account closed on arrival. Auto-rescheduled within contractual SLA window.' }, { persona: ctx.persona, screen: 'brief' });
      }
    }
    if (ctx.m?.logAudit) ctx.m.logAudit('SLA Protection', `Recorded closed account for ${ctx.data.byId[data.id]?.name || ''}. Rescheduled stop within 14-day SLA window.`);
  },

  'toggle-blitz': ({ ctx }) => {
    const ui = (ctx.ui ||= {});
    ui.blitzMode = !ui.blitzMode;
    ui.briefToast = ui.blitzMode ? 'Rapid in-visit blitz mode active (45-second execution).' : 'Standard visit brief mode restored.';
  },

  'set-objective': ({ ctx, data }) => {
    (ctx.ui ||= {}).callObjective = data.obj;
    (ctx.ui ||= {}).briefToast = `Primary call objective set to ${data.obj}.`;
    if (ctx.m?.logAudit) ctx.m.logAudit('Call Strategy', `Set primary call objective to ${data.obj} for account`);
  },
  'open-deck': ({ ctx }) => { (ctx.ui ||= {}).pitchDeckOpen = true; ctx.ui.deckSlide = 1; },
  'close-deck': ({ ctx }) => { (ctx.ui ||= {}).pitchDeckOpen = false; },
  'deck-prev': ({ ctx }) => { const ui = (ctx.ui ||= {}); ui.deckSlide = Math.max(1, (ui.deckSlide || 1) - 1); },
  'deck-next': ({ ctx }) => { const ui = (ctx.ui ||= {}); ui.deckSlide = Math.min(3, (ui.deckSlide || 1) + 1); },
  decide: ({ ctx, data }) => { ctx.m.decide(data.id, { status: data.status }); ctx.ui.panel = null; },
  panel: ({ ctx, data }) => { ctx.ui.panel = { id: data.id, kind: data.kind }; },
  'panel-close': ({ ctx }) => { ctx.ui.panel = null; },
  'pick-reason': ({ ctx, value }) => { if (ctx.ui.panel) { ctx.ui.panel.note = currentNote(ctx, ctx.ui.panel.id); ctx.ui.panel.reason = value; } },
  'pick-adjust': ({ ctx, value }) => { if (ctx.ui.panel) { ctx.ui.panel.note = currentNote(ctx, ctx.ui.panel.id); ctx.ui.panel.choice = value; } },
  'panel-note': ({ ctx, value }) => { if (ctx.ui.panel) ctx.ui.panel.note = value.slice(0, 300); return false; },
  'save-override': ({ ctx, data }) => {
    const p = ctx.ui.panel;
    if (!p || !p.reason) return false;
    ctx.m.decide(data.id, { status: 'overridden', reason: p.reason, note: currentNote(ctx, data.id) }, { persona: ctx.persona, screen: 'brief' });
    ctx.ui.panel = null;
  },
  'save-adjust': ({ ctx, data }) => {
    const p = ctx.ui.panel;
    if (!p || !p.choice) return false;
    ctx.m.decide(data.id, { status: 'adjusted', choice: p.choice, note: currentNote(ctx, data.id) });
    ctx.ui.panel = null;
  },
  undo: ({ ctx, data }) => { ctx.m.undo(data.id); },
  'approve-all': ({ ctx, data }) => {
    for (const it of ctx.m.briefItems(data.id)) {
      if (!ctx.m.decision(it.id) && !ctx.m.agentStopped(it.agent)) ctx.m.decide(it.id, { status: 'approved' });
    }
  },
};
