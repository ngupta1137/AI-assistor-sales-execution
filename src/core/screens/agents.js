// G1 and G2 Agent controls: scope, owner, what each agent does alone, what needs approval,
// what is never its call (with the industry guardrails), authority level, stop and resume.

import { esc, icon, pill, LEVELS } from '../ui.js';

export const SCOPE = {
  planner: {
    scope: 'Which {accounts} to visit today, in what order, and how long to spend at each.',
    alone: ['Orders the day by value, opening hours and travel time', 'Re-plans the day when a {visit} runs long'],
    approval: ['Dropping a key {account} from the plan', 'Adding a {visit} outside the {territory}'],
    never: ['Changing coverage targets', 'Judging a {rep}\'s performance'],
  },
  gap: {
    scope: 'What is missing or wrong at each {account}, from {visit} records, history and peers.',
    alone: ['Flags gaps with evidence and a confidence level', 'Ranks actions by value and effort'],
    approval: ['Every action in the {visit} brief'],
    never: ['Contacting a {contact} directly'],
  },
  order: {
    scope: 'What to suggest in each {order}, and how much, with a reason for every line.',
    alone: ['Drafts lines and quantities with a reason for each'],
    approval: ['Every line and quantity', 'Anything above the approval limit'],
    never: ['Setting prices or terms', 'Submitting without the {rep}'],
  },
};

export function render(ctx) {
  const { t, data, m, industry } = ctx;
  const cards = data.agents.map((ag) => {
    const s = SCOPE[ag.id];
    const stopped = m.agentStopped(ag.id);
    const guards = industry.guardrails.filter((g) => g.agent === ag.id || g.agent === 'all');
    const li = (arr) => arr.map((x) => `<li>${esc(t(x))}</li>`).join('');
    return `<article class="card agent" data-agent="${ag.id}">
      <header class="agent-head">
        <span class="agent-ic">${icon('agent', 22)}</span>
        <span class="row-main"><b>${esc(ag.name)}</b><small>Owner: ${esc(ag.owner.name)}, ${esc(t(ag.owner.title))}</small></span>
        ${pill(stopped ? 'Stopped' : 'Running', stopped ? 'bad' : 'good')}
      </header>
      <div class="agent-body">
        <p class="small">${esc(t(s.scope))}</p>
        <p class="small"><b>Authority level ${ag.level} of 4.</b> ${esc(LEVELS[ag.level])}.</p>
        ${stopped ? `<div class="notice warn">${icon('stop', 18)}<span>${esc(t(ag.id === 'order' ? 'Stopped. Drafts stay editable. Submission is paused.' : 'Stopped. Its brief items are paused.'))}</span></div>` : ''}
        <details>
          <summary>Scope and limits</summary>
          <dl class="scope">
            <dt>Does alone</dt><dd><ul>${li(s.alone)}</ul></dd>
            <dt>Needs approval</dt><dd><ul>${li(s.approval)}</ul></dd>
            <dt>Never its call</dt><dd><ul>${li(s.never)}${guards.map((g) => `<li class="guard-li">${icon('shield', 16)} ${esc(t(g.text))}</li>`).join('')}</ul></dd>
          </dl>
        </details>
        <button class="btn ${stopped ? 'primary' : 'danger'} block" data-act="toggle-agent" data-id="${ag.id}" id="toggle-${ag.id}">
          ${icon(stopped ? 'play' : 'stop', 20)} ${stopped ? 'Resume' : 'Stop'} ${esc(ag.name)}</button>
      </div>
    </article>`;
  }).join('');

  return `
  <section class="page-head">
    <h1>Agent controls</h1>
    <p class="small muted">Agents start with narrow authority and earn wider scope on evidence. Anyone with the right role can stop one at any time.</p>
  </section>
  <div class="items tight">${cards}</div>
  <details class="fold" id="guardrails" open>
    <summary>${esc(industry.name)} guardrails<span class="sum-end">${industry.guardrails.length}</span></summary>
    <ul class="guards">${industry.guardrails.map((g) => `<li>${icon('shield', 16)} ${esc(t(g.text))}</li>`).join('')}</ul>
  </details>
  <section class="card" id="sandbox" style="margin-top:var(--s4)">
    <div class="section-head">
      <h2>Guardrail verification sandbox</h2>
      ${pill('Policy inspector', 'info')}
    </div>
    <p class="small muted">Test sensitive prompts or out-of-bounds questions to verify autonomous agent guardrails and regulatory refusals.</p>
    <div style="margin-top:8px">
      <small class="muted" style="font-weight:600">Sample evaluation prompts:</small>
      <div class="chips-q" style="margin-top:6px;display:flex;flex-wrap:wrap;gap:6px">
        ${[
          ...(industry.assistantRefusals ? industry.assistantRefusals.slice(0, 3).map((r) => r.patterns[0]) : []),
          'What strategy should I suggest to the contact?',
        ].map((q) => `<button class="chip-q" data-act="test-prompt" data-q="${esc(q)}" style="min-height:var(--tap);font-size:12px">${esc(q)}</button>`).join('')}
      </div>
    </div>
    <div style="margin-top:10px">
      ${(() => {
        const activeTest = ctx.ui?.guardrailTest || '';
        if (!activeTest) return '<p class="small muted">Select a sample test prompt above to evaluate agent guardrail compliance in real time.</p>';
        const testRefusal = industry.assistantRefusals ? industry.assistantRefusals.find((r) => r.patterns.some((p) => activeTest.toLowerCase().includes(p.toLowerCase()))) : null;
        if (testRefusal) {
          return `<div class="notice bad" style="margin-top:8px">
            <div>
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
                ${pill('Policy violation intercepted', 'bad')}
                <small class="muted">Guardrail: ${esc(testRefusal.guardrail || 'Industry Policy')}</small>
              </div>
              <p style="font-size:13px;line-height:18px;margin-bottom:4px"><b>Agent refusal:</b> ${esc(testRefusal.refusal)}</p>
              <p style="font-size:12px;line-height:16px;color:var(--good)"><b>Approved alternative:</b> ${esc(testRefusal.allowed)}</p>
              <small class="muted" style="display:block;margin-top:4px">${icon('shield', 12)} Recorded in compliance audit trail.</small>
            </div>
          </div>`;
        }
        return `<div class="notice good" style="margin-top:8px">
          <div>
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
              ${pill('Verified: Compliant', 'good')}
            </div>
            <p style="font-size:13px;line-height:18px">Prompt verified against all ${industry.guardrails.length} active agent guardrails. No regulatory or pricing boundaries breached.</p>
          </div>
        </div>`;
      })()}
    </div>
  </section>
  <details class="fold" id="audit"${m.audit().length ? ' open' : ''}>
    <summary>Audit log<span class="sum-end">${m.audit().length}</span></summary>
    <p class="small muted">Approvals, overrides, outcomes, evidence and agent stops in this session.</p>
    ${m.audit().length ? `<ul class="audit">${m.audit().slice(0, 30).map((x) => `<li><time>${esc(ctx.fmt.time(x.at))}</time><span><b>${esc(x.actor)}</b> ${esc(x.text)}</span></li>`).join('')}</ul>` : '<p class="small muted">Nothing yet in this session.</p>'}
  </details>
  <p class="foot-note">Agents in this demo are rule-based.</p>`;
}

export const actions = {
  'toggle-agent': ({ ctx, data }) => { ctx.m.toggleAgent(data.id); },
  'test-prompt': ({ ctx, data }) => {
    (ctx.ui ||= {}).guardrailTest = data.q;
    const ref = ctx.industry.assistantRefusals?.find((r) => r.patterns.some((p) => data.q.toLowerCase().includes(p.toLowerCase())));
    if (ref) {
      if (ctx.m?.logAudit) ctx.m.logAudit('Compliance Policy', `Intercepted test prompt for guardrail ${ref.guardrail}: "${data.q}"`);
    } else {
      if (ctx.m?.logAudit) ctx.m.logAudit('Compliance Policy', `Verified compliant prompt: "${data.q}"`);
    }
  },
};
