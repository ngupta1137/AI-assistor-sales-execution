// Governance UI components: G11 "Try a case" panel, G12 Guide modal,
// G13 Simple view controls, and G14 Screen states simulator.

import { esc, icon, pill } from './ui.js';

export function renderGuideModal(app, ctx) {
  if (!app.guideOpen || !ctx) return '';
  return `
  <div class="presenter-backdrop" data-act="close-guide" aria-hidden="true"></div>
  <section class="as-sheet enterprise-modal" role="dialog" aria-modal="true" aria-labelledby="guide-modal-title" style="height:auto;max-height:85%;overflow-y:auto;z-index:90">
    <header class="as-head">
      <div>
        <h2 id="guide-modal-title" style="display:flex;align-items:center;gap:6px">
          ${icon('shield', 20)} How AI Assistor Works
        </h2>
        <small>Enterprise Governance Architecture and Policy Principles</small>
      </div>
      <button class="icon-btn" data-act="close-guide" aria-label="Close guide">${icon('x', 20)}</button>
    </header>
    <div style="padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)">
      <div class="card tight" style="margin:0;background:var(--surface-subtle);border-left:4px solid var(--accent)">
        <b style="font-size:13px">Three Plain Principles</b>
        <ol style="margin:8px 0 0 16px;padding:0;font-size:12px;line-height:1.6">
          <li><b>1. Data in:</b> Fresh, verified, tamper-evident source data from enterprise ERP, CRM, and field telemetry. Every recommendation states its data source and age.</li>
          <li><b>2. Rules decide:</b> Every recommendation is governed by approved, scoped, deterministic policy rules. The system never guesses without verified evidence.</li>
          <li><b>3. Rep acts:</b> The field rep is always the final decider with discretion to approve, adjust, or override based on local field reality.</li>
        </ol>
      </div>

      <div class="card tight" style="margin:0">
        <b style="font-size:13px">Status Chips and Meaning</b>
        <ul style="margin:8px 0 0 16px;padding:0;font-size:12px;line-height:1.6">
          <li>${pill('Approved', 'good')} Verified sign-off by named business and compliance approver.</li>
          <li>${pill('In date', 'info')} Policy is active for the current commercial operating cycle.</li>
          <li>${pill('Applies here', 'good')} Account matches policy territory, channel, and segment scope.</li>
          <li>${pill('v2.4', 'muted')} Semantic rule version for auditability and replay.</li>
          <li>${pill('Exact wording', 'warn')} Regulated legal text requiring mandatory rep acknowledgment.</li>
          <li>${pill('Wording approved', 'good')} Exact wording approved by the rule's named approver.</li>
        </ul>
      </div>

      <div class="card tight" style="margin:0">
        <b style="font-size:13px">Deterministic Outcomes</b>
        <p class="small muted" style="margin:4px 0 8px 0">Every suggestion evaluates to exactly one outcome in strict order of precedence:</p>
        <div style="display:flex;flex-direction:column;gap:4px;font-size:11px">
          <div><b>Compliance escalation:</b> Blocked pending legal review.</div>
          <div><b>Not allowed for role:</b> Restricted by rights matrix.</div>
          <div><b>Data is stale:</b> Out of date, refresh required.</div>
          <div><b>Policy conflict:</b> Two approved rules disagree, manager escalation needed.</div>
          <div><b>Not enough evidence:</b> Missing verified baseline field data.</div>
          <div><b>Needs clarification:</b> Short question with choice chips.</div>
          <div><b>Suggest:</b> Approved action with evidence and rationale.</div>
        </div>
      </div>

      <p class="small muted" style="margin-top:4px">
        <b>Sample data:</b> All accounts, offerings, numbers and rules in this environment are fictional and for demonstration only.
      </p>

      <div style="display:flex;justify-content:flex-end;margin-top:8px">
        <button class="btn primary sm" data-act="close-guide" style="min-height:var(--tap);min-width:100px">Done</button>
      </div>
    </div>
  </section>`;
}

export function renderTryCase(app, ctx) {
  if (!ctx) return '';
  const forced = ctx.m.getForcedCase?.();
  const isOpen = !!app.ui?.tryCaseOpen;

  const floatingButtons = `
  <button class="try-case-btn" id="try-case-btn" data-act="toggle-try-case" aria-haspopup="dialog" aria-expanded="${isOpen}" title="Try a case">
    ${icon('wrench', 16)}<span class="btn-text">Try a case</span>${forced ? ' <span class="sync-dot"></span>' : ''}
  </button>
  <button class="lab-btn" id="lab-btn" data-act="open-lab-modal" aria-haspopup="dialog" title="Portfolio Lab">
    ${icon('screen', 16)}<span class="btn-text">Portfolio Lab</span>
  </button>`;

  if (!isOpen) return floatingButtons;

  const cases = [
    { id: 'conflict', title: 'Two rules disagree', desc: 'Sets Conflict outcome on card 3 and opens rule drawer.' },
    { id: 'stale', title: 'Stale data', desc: 'Sets Stale outcome; clicking Refresh updates and pulses card.' },
    { id: 'clarify', title: 'Needs one answer', desc: 'Sets Clarify outcome with choice chips; choice resolves.' },
    { id: 'evidence', title: 'Thin evidence', desc: 'Sets Not enough evidence; Add note returns to Suggest.' },
    { id: 'exactWording', title: 'Exact wording', desc: 'Sets regulated wording gate; checkbox reveals button.' },
    { id: 'flag', title: 'Flag a rule', desc: 'Jumps to card and opens the feedback sheet for rule owner.' },
    { id: 'retired', title: 'Rule retired', desc: 'Jumps to Rule Health and highlights retired policy.' },
    { id: 'role', title: 'Role outside scope', desc: 'Simulates unauthorized action and shows denied notice.' },
  ];

  return `
  ${floatingButtons}
  <div class="presenter-backdrop" data-act="close-try-case" aria-hidden="true"></div>
  <section class="as-sheet enterprise-modal" role="dialog" aria-modal="true" aria-labelledby="try-case-title" style="height:auto;max-height:85%;overflow-y:auto;z-index:90">
    <header class="as-head">
      <div>
        <h2 id="try-case-title" style="display:flex;align-items:center;gap:6px">
          ${icon('wrench', 18)} Try a Case (Deterministic Tester)
        </h2>
        <small>Force governance states to test engine behavior and safety</small>
      </div>
      <button class="icon-btn" data-act="close-try-case" aria-label="Close try case">${icon('x', 20)}</button>
    </header>
    <div style="padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)">
      <p class="small muted">Select any test case below to inspect how the engine enforces enterprise governance rules without guessing.</p>
      
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px">
        ${cases.map((c) => `
          <button class="card tight text-left" data-act="run-try-case" data-case="${c.id}" style="margin:0;cursor:pointer;text-align:left;border:1px solid ${forced?.name === c.title ? 'var(--accent)' : 'var(--line-soft)'};background:${forced?.name === c.title ? 'var(--accent-soft)' : 'var(--surface)'};min-height:var(--tap)">
            <b style="font-size:12px;color:var(--ink);display:block">${esc(c.title)}</b>
            <span class="small muted" style="font-size:11px;line-height:1.3;display:block;margin-top:2px">${esc(c.desc)}</span>
          </button>
        `).join('')}
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;padding-top:8px;border-top:1px solid var(--line-soft)">
        <button class="btn text sm" data-act="reset-case" style="min-height:var(--tap);color:var(--muted)">Reset case to clean state</button>
        <button class="btn secondary sm" data-act="close-try-case" style="min-height:var(--tap);min-width:80px">Close</button>
      </div>
    </div>
  </section>`;
}

export const governanceActions = {
  'open-guide': ({ app }) => { app.guideOpen = true; },
  'close-guide': ({ app }) => { app.guideOpen = false; },
  'toggle-try-case': ({ app }) => { (app.ui ||= {}).tryCaseOpen = !app.ui.tryCaseOpen; },
  'close-try-case': ({ app }) => { if (app.ui) app.ui.tryCaseOpen = false; },

  'run-try-case': ({ ctx, app, data, api }) => {
    const caseId = data.case;
    const a = ctx.data.planned[0];
    const card = a?.actions[2] || a?.actions[0] || { id: 'act_1' };
    if (app.ui) app.ui.tryCaseOpen = false;

    if (caseId === 'conflict') {
      ctx.m.setForcedCase({ targetId: card.id, outcome: 'conflict', name: 'Two rules disagree' });
      ctx.ui.ruleDrawer = { id: card.id, ruleId: ctx.m.ruleForItem(card).id };
      api.navigate(`#/brief/${a.accountId}#item-${card.id}`);
    } else if (caseId === 'stale') {
      ctx.m.setForcedCase({ targetId: card.id, outcome: 'stale', name: 'Stale data' });
      api.navigate(`#/brief/${a.accountId}#item-${card.id}`);
    } else if (caseId === 'clarify') {
      ctx.m.setForcedCase({ targetId: card.id, outcome: 'clarify', name: 'Needs one answer' });
      api.navigate(`#/brief/${a.accountId}#item-${card.id}`);
    } else if (caseId === 'evidence') {
      ctx.m.setForcedCase({ targetId: card.id, outcome: 'evidence', name: 'Thin evidence' });
      api.navigate(`#/brief/${a.accountId}#item-${card.id}`);
    } else if (caseId === 'exactWording') {
      ctx.m.setForcedCase({ targetId: card.id, outcome: 'suggest', exactWording: true, name: 'Exact wording' });
      api.navigate(`#/brief/${a.accountId}#item-${card.id}`);
    } else if (caseId === 'flag') {
      ctx.ui.flagSheet = { id: card.id };
      api.navigate(`#/brief/${a.accountId}#item-${card.id}`);
    } else if (caseId === 'retired') {
      const rule = ctx.industry.governance?.rules?.[0];
      if (rule) {
        ctx.m.retireRule(rule.id, 'Sample demonstration retirement', 'Field Operations Lead');
        ctx.ui.highlightRuleId = rule.id;
      }
      api.navigate('#/rule-health');
    } else if (caseId === 'role') {
      app.deniedNotice = { screen: 'Rule Governance Authoring', role: ctx.persona, team: 'Market Operations' };
      ctx.m.logAudit('Security Access Guard', `Access denied: ${ctx.persona} attempted unauthorized action on Rule Governance Authoring`);
    }
  },

  'reset-case': ({ ctx, app, api }) => {
    ctx.m.clearForcedCase();
    if (ctx.ui) {
      ctx.ui.flagSheet = null;
      ctx.ui.ruleDrawer = null;
      ctx.ui.highlightRuleId = null;
      ctx.ui.tryCaseOpen = false;
    }
    app.deniedNotice = null;
    const a = ctx.data.planned[0];
    if (a) api.navigate(`#/brief/${a.accountId}`);
  },

  'toggle-simple-view': ({ app, api }) => {
    app.simpleView = !app.simpleView;
    api.render();
  },

  'set-text-size': ({ app, data, api }) => {
    app.textSize = data.size || 'sm';
    api.render();
  },

  'reset-screen-state': ({ app, api }) => {
    app.screenState = 'normal';
    api.render();
  },

  'talk-to-manager': ({ ctx, data }) => {
    const it = ctx.m.findAction(data.id);
    const itemTitle = it ? ctx.t(it.title, it.vars) : 'Item discussion';
    ctx.m.createException({
      kind: 'approval',
      title: itemTitle,
      reason: 'Rep requested manager discussion from simple view',
      route: 'manager',
    });
    ctx.ui ||= {};
    ctx.ui.talkNotice = `Discussion request for "${itemTitle}" sent to manager exception queue.`;
  },
};

