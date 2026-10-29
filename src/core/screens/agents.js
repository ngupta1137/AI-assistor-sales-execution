// G1 and G2 Agent controls: scope, owner, what each agent does alone, what needs approval,
// what is never its call (with the industry guardrails), authority level, stop and resume.

import { esc, icon, pill, LEVELS } from '../ui.js';

const SCOPE = {
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
    return `<article class="card agent${stopped ? ' stopped' : ''}" data-agent="${ag.id}">
      <header class="agent-head">
        <span class="agent-ic">${icon('agent', 22)}</span>
        <span class="row-main"><b>${esc(ag.name)}</b><small>Owner: ${esc(ag.owner.name)}, ${esc(t(ag.owner.title))}</small></span>
        ${pill(stopped ? 'Stopped' : 'Running', stopped ? 'bad' : 'good')}
      </header>
      <p>${esc(t(s.scope))}</p>
      <div class="level"><small>Authority level ${ag.level} of 4</small><div class="level-bar">${[1, 2, 3, 4].map((n) => `<span class="${n <= ag.level ? 'on' : ''}"></span>`).join('')}</div><small class="muted">${esc(LEVELS[ag.level])}</small></div>
      <dl class="scope">
        <dt>Does alone</dt><dd><ul>${li(s.alone)}</ul></dd>
        <dt>Needs approval</dt><dd><ul>${li(s.approval)}</ul></dd>
        <dt>Never its call</dt><dd><ul>${li(s.never)}${guards.map((g) => `<li class="guard-li">${icon('shield', 14)} ${esc(t(g.text))}</li>`).join('')}</ul></dd>
      </dl>
      <button class="btn ${stopped ? 'primary' : 'danger'} block" data-act="toggle-agent" data-id="${ag.id}" id="toggle-${ag.id}">
        ${icon(stopped ? 'play' : 'stop', 18)} ${stopped ? 'Resume' : 'Stop'} ${esc(ag.name)}</button>
    </article>`;
  }).join('');

  return `
  <section class="hello">
    <h1>Agent controls</h1>
    <p class="muted">Agents start with narrow authority and earn wider scope on evidence. Any person with the right role can stop one at any time.</p>
  </section>
  ${cards}
  <section class="card">
    <h2>${esc(industry.name)} guardrails</h2>
    <ul class="guards">${industry.guardrails.map((g) => `<li>${icon('shield', 16)} ${esc(t(g.text))}</li>`).join('')}</ul>
  </section>
  <section class="card" id="audit">
    <h2>Audit log</h2>
    <p class="small muted">Every approval, override, outcome and agent stop in this session.</p>
    ${m.audit().length ? `<ul class="audit">${m.audit().slice(0, 30).map((x) => `<li><time>${esc(ctx.fmt.time(x.at))}</time><span><b>${esc(x.actor)}</b> ${esc(x.text)}</span></li>`).join('')}</ul>` : '<p class="empty">Nothing yet in this session.</p>'}
  </section>
  <p class="foot-note">Sample data. Agents in this demo are rule-based.</p>`;
}

export const actions = {
  'toggle-agent': ({ ctx, data }) => { ctx.m.toggleAgent(data.id); },
};
