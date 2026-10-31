// Sales Companion, Learning: certification tracker (renewals due within 30 days are flagged), learning modules,
// knowledge base search and a rule-based learning chatbot. Sample content in the industry's own words.

import { esc, icon, pill } from '../ui.js';
import { head } from './companion-ui.js';
import { searchKnowledge, askLearning } from '../companion/learning.js';

const kbHtml = (ctx, q) => {
  const list = q.trim() ? searchKnowledge(ctx, q).map((x) => x.e) : ctx.industry.companion.knowledge;
  if (!list.length) return `<p class="empty">${esc(ctx.t('Nothing found. Try a shorter search, or ask the learning chatbot.'))}</p>`;
  return list.map((e) => `<details class="kb-entry" data-kb="${esc(e.id)}"><summary>${esc(ctx.t(e.title))}</summary><p class="small">${esc(ctx.t(e.text))}</p></details>`).join('');
};

export function learning(ctx) {
  const { t, fmt, comp, cm, ui, industry } = ctx;
  const flagged = comp.certs.filter((c) => c.dueIn <= 30);
  const certRows = comp.certs.map((c) => {
    const started = cm.s.renewals[c.id];
    const tone = c.dueIn < 0 ? 'bad' : c.dueIn <= 30 ? 'warn' : 'good';
    const label = c.dueIn < 0 ? `Overdue by ${-c.dueIn} days` : c.dueIn <= 30 ? `Due in ${c.dueIn} days` : `Valid. Due ${fmt.date(c.due)}`;
    return `<li class="row" data-cert="${esc(c.id)}" data-flag="${c.dueIn <= 30}"><span class="row-main"><b>${esc(t(c.label))}</b>
      <small>Renews every ${c.cycleMonths} months. Next due ${esc(fmt.date(c.due))}.</small>
      <span class="btn-row" style="margin-top:8px">${pill(label, tone)}${started ? pill('Renewal started', 'info') : ''}</span>
      ${c.dueIn <= 30 && !started ? `<span class="btn-row" style="margin-top:8px"><button class="btn secondary sm" data-act="cert-renew" data-id="${esc(c.id)}">Start renewal</button></span>` : ''}</span></li>`;
  }).join('');
  const done = comp.modules.filter((m) => cm.moduleStatus(m.id) === 'done').length;
  const mods = comp.modules.map((m) => {
    const st = cm.moduleStatus(m.id);
    return `<li class="row" data-module="${esc(m.id)}" data-status="${st}"><span class="row-main"><b>${esc(t(m.title))}</b><small>${esc(t(m.summary))}</small><small>${m.minutes} minutes</small>
      <span class="btn-row" style="margin-top:8px">${pill(st === 'done' ? 'Done' : st === 'progress' ? 'In progress' : 'Not started', st === 'done' ? 'good' : st === 'progress' ? 'info' : 'muted')}
      ${st === 'new' ? `<button class="btn secondary sm" data-act="mod-set" data-id="${esc(m.id)}" data-status="progress">Start</button>` : ''}
      ${st !== 'done' ? `<button class="btn secondary sm" data-act="mod-set" data-id="${esc(m.id)}" data-status="done">Mark done</button>` : ''}</span></span></li>`;
  }).join('');
  const chat = cm.s.chat.map((c, i) => `<div class="msg me"><small>You</small><div class="bubble">${esc(c.q)}</div></div>
    <div class="msg ai"><small>Learning chatbot</small><div class="bubble" data-lc-answer>${esc(c.r.text)}</div>
      <p class="based" data-based>Based on: ${esc(c.r.basedOn)}</p>
      ${c.r.links?.length ? `<div class="btn-row">${c.r.links.map((l) => `<a class="btn secondary sm" href="${esc(l.href)}" data-act="lc-link">${esc(l.label)}</a>`).join('')}</div>` : ''}
      ${c.r.refusal ? `<div class="guardrail" data-why>${icon('shield', 20)}<span><b>Guardrail ${esc(c.r.refusal.guardrailId)}.</b> ${esc(c.r.refusal.guardrailText)}</span></div>` : ''}</div>`).join('');
  const sugg = ['What is due for renewal?', 'How am I doing on my modules?', t(industry.companion.knowledge[0].title)].map((q) => `<button class="chip-q" data-act="lc-q" data-q="${esc(q)}">${esc(q)}</button>`).join('');
  const team = ctx.persona !== 'rep' ? `<section class="card" id="team-learning"><h2>Team learning progress</h2><p class="small muted">For coaching conversations, not a ranking.</p>
    <ul class="kpi-list">${comp.teamLearning.map((r) => `<li data-team-row><span class="small"><b>${esc(r.rep)}</b>${r.self ? ' (demo rep)' : ''}<br><small>${r.done} of ${r.total} modules${r.certsDue ? `, ${r.certsDue} certification${r.certsDue > 1 ? 's' : ''} due or overdue` : ''}</small></span><span class="kv"><b>${Math.round((r.done / r.total) * 100)}%</b></span></li>`).join('')}</ul></section>` : '';
  const jump = [['cert-tracker', 'Certifications'], ['modules', 'Modules'], ['kb', 'Knowledge base'], ['lc', 'Chatbot']].map(([id, l]) => `<a href="#/companion/learning" data-act="jump" data-id="${id}">${l}</a>`).join('');
  return head(ctx, { title: 'Learning', lead: 'Certifications, modules, a knowledge base and a chatbot that answers only from them.' }) + `
  <nav class="jump tight" aria-label="Sections">${jump}</nav>
  ${team}
  <section class="card" id="cert-tracker"><div class="section-head"><h2>Certification tracker</h2>${pill(`${flagged.length} due or overdue`, flagged.length ? 'warn' : 'good')}</div>
    <p class="small muted">Renewals due within 30 days, and anything overdue, are flagged.</p><ul class="group" style="margin-top:4px">${certRows}</ul></section>
  <section class="card" id="modules"><div class="section-head"><h2>Learning modules</h2>${pill(`${done} of ${comp.modules.length} done`, 'info')}</div><ul class="group">${mods}</ul></section>
  <section class="card" id="kb"><h2>Knowledge base</h2>
    <label class="field">Search<input type="search" id="kb-search" data-input="kb-search" value="${esc(ui.kbQuery || '')}" placeholder="For example: display, expenses, warranty" autocomplete="off"></label>
    <div id="kb-results">${kbHtml(ctx, ui.kbQuery || '')}</div></section>
  <section class="card" id="lc"><h2>Learning chatbot</h2>
    <div class="notice">${icon('flag', 18)}<span>Rule-based. It answers only from the knowledge base, your modules and your certifications. It refuses restricted claims.</span></div>
    <div class="chat" id="lc-log" role="log" aria-live="polite">${chat}</div>
    <div class="chips-q">${sugg}</div>
    <form class="ask-row" onsubmit="return false"><label class="sr-only" for="lc-input">Question</label>
      <input class="input" id="lc-input" type="text" maxlength="200" autocomplete="off" placeholder="Ask about training or how to do something" data-input="lc-draft" value="${esc(ui.lcDraft || '')}">
      <button class="btn primary" data-act="lc-send" id="lc-send">Ask</button></form></section>
  <p class="foot-note">Content is written for the demo and is not approved training material.</p>`;
}

export function mounted(ctx) {
  if (ctx.ui.lcScroll) { ctx.ui.lcScroll = false; document.querySelector('#lc-log .msg:last-child')?.scrollIntoView({ block: 'nearest' }); }
}

export const actions = {
  'cert-renew': ({ ctx, data }) => { ctx.cm.startRenewal(data.id); },
  'mod-set': ({ ctx, data }) => { ctx.cm.setModule(data.id, data.status); },
  'kb-search': ({ ctx, value }) => { ctx.ui.kbQuery = value; const box = document.getElementById('kb-results'); if (box) box.innerHTML = kbHtml(ctx, value); return false; },
  'lc-draft': ({ ctx, value }) => { ctx.ui.lcDraft = value.slice(0, 200); return false; },
  'lc-q': ({ ctx, data }) => { ctx.cm.s.chat.push({ q: data.q, r: askLearning(ctx, data.q) }); ctx.ui.lcScroll = true; },
  'lc-send': ({ ctx }) => {
    const q = (document.getElementById('lc-input')?.value ?? ctx.ui.lcDraft ?? '').trim();
    if (!q) return false;
    ctx.cm.s.chat.push({ q, r: askLearning(ctx, q) });
    ctx.ui.lcDraft = '';
    ctx.ui.lcScroll = true;
  },
  'lc-link': ({ api, el }) => { api.navigate(el.getAttribute('href')); return 'nav'; },
};
