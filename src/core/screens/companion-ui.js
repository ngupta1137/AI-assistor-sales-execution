// Shared pieces for the Sales Companion screens: heading, account picker, "Powered by" row, links.
// No industry nouns here: vocabulary tokens only.

import { esc, icon, pill, CAPABILITIES } from '../ui.js';

export const TAGS = '<span class="sample-tag">Sample data</span><span class="concept-tag">Concept</span>';

/** Back link to the hub, then the title and a lead line. */
export function head(ctx, { title, lead, back = '#/companion', backLabel = 'Sales Companion' }) {
  return `<a class="back" href="${back}">${icon('back', 18)} ${esc(ctx.t(backLabel))}</a>
  <section class="page-head"><span class="eyebrow">Sales Companion</span><h1>${esc(ctx.t(title))}</h1>
    ${lead ? `<p class="small muted">${esc(ctx.t(lead))}</p>` : ''}<p class="tags">${TAGS}</p></section>`;
}

/** The account this screen is about: the route argument, or the next {account} on today's plan. */
export function accountOf(ctx, id) {
  const a = ctx.data.byId[id];
  if (a) return a;
  const n = ctx.m.nextAccount(null) || ctx.data.planned.slice().sort((x, y) => x.rank - y.rank)[0];
  return ctx.data.byId[n.accountId];
}

/** Select for the {account} in focus. Changing it opens the same view for the other {account}. */
export function picker(ctx, view, acct) {
  const opts = ctx.data.planned.slice().sort((a, b) => a.rank - b.rank).map((p) => {
    const a = ctx.data.byId[p.accountId];
    return `<option value="${esc(a.id)}"${a.id === acct.id ? ' selected' : ''}>${esc(a.name)}</option>`;
  }).join('');
  return `<label class="field picker">${esc(ctx.t('{Account}'))}<select id="comp-account" data-change="comp-account" data-view="${esc(view)}">${opts}</select></label>`;
}

/** "Powered by" row: the capabilities whose output this feature shows. */
export function powered(ctx, keys) {
  if (!keys?.length) return '';
  return `<div class="powered"><small>Powered by</small>${keys.map((k) => pill(ctx.t(CAPABILITIES[k].name), 'accent')).join('')}</div>`;
}

export const dash = '-';
