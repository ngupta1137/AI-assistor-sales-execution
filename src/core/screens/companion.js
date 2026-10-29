// Sales Companion: the field enabler. One hub for planning, selling, daily admin and learning.
// It consumes outputs of the five capabilities and links to their screens. It builds no second
// route plan, visit brief or order builder.

import { esc, icon } from '../ui.js';
import { TAGS, powered, accountOf } from './companion-ui.js';
import * as plan from './companion-plan.js';

/** Feature catalogue. powered: the capabilities whose output the feature shows. */
const FEATURES = [
  { id: 'journey', pillar: 'growth', icon: 'route', title: 'Journey planning', text: "Today's route with weather, traffic and a fatigue prompt.", powered: ['planning'], view: plan.journey },
  { id: 'precall', pillar: 'growth', icon: 'brief', title: 'Pre-call brief', text: 'Last actions, open issues and a sentiment tag.', powered: ['gaps', 'ranking'], view: plan.precall, account: true },
  { id: 'debrief', pillar: 'growth', icon: 'mic', title: 'Voice debrief', text: 'Dictate or type, then confirm the fields.', powered: [], view: plan.debrief, account: true },
  { id: 'resources', pillar: 'growth', icon: 'team', title: 'Live resource planning', text: 'Activations against team availability, by week. For managers.', powered: ['planning'], view: plan.resources },
];

const PILLARS = [
  { id: 'growth', title: 'Growth', text: 'Plan and sell.' },
  { id: 'productivity', title: 'Productivity', text: 'Personal and workforce admin.' },
  { id: 'learning', title: 'Learning', text: 'Skills, certifications and know-how.' },
];

function hub(ctx) {
  const { t } = ctx;
  const next = accountOf(ctx, null);
  const cards = PILLARS.map((p) => {
    const rows = FEATURES.filter((f) => f.pillar === p.id).map((f) => `<li><a class="row" href="#/companion/${f.id}${f.account ? `/${esc(next.id)}` : ''}" data-feature="${f.id}">
      <span class="tile-ic">${icon(f.icon, 20)}</span>
      <span class="row-main"><b>${esc(t(f.title))}</b><small>${esc(t(f.text))}</small>${powered(ctx, f.powered)}</span>${icon('chevron', 20, 'row-chev')}</a></li>`).join('');
    return `<section class="card flush pillar" data-pillar="${p.id}">
      <div class="section-head" style="padding:16px 16px 0"><h2>${esc(p.title)}</h2><small>${esc(p.text)}</small></div>
      <ul class="group" style="border:0;border-radius:0">${rows || '<li class="empty">Coming in this build.</li>'}</ul></section>`;
  }).join('');
  return `
  <section class="page-head"><span class="eyebrow">Field enabler</span><h1>Sales Companion</h1>
    <p class="small muted">${esc(t('One place for the {rep} and the {manager}: planning, selling, daily admin and learning. It shows what the five capabilities produce and links to their screens.'))}</p>
    <p class="tags">${TAGS}</p></section>
  <div class="notice">${icon('flag', 18)}<span>Concept. Leave, expenses, pay slips and learning use sample data only. Nothing here is real HR or pay information.</span></div>
  ${cards}
  <p class="foot-note">Sample data.</p>`;
}

const BY_ID = Object.fromEntries(FEATURES.map((f) => [f.id, f]));

export function render(ctx, args) {
  const [sub, id] = args || [];
  if (!ctx.comp) {
    return `<section class="page-head"><span class="eyebrow">Field enabler</span><h1>Sales Companion</h1></section>
    <div class="notice warn">${icon('flag', 18)}<span>Companion content is not available for this industry and country yet.</span></div>`;
  }
  const f = BY_ID[sub];
  return f ? f.view(ctx, id) : hub(ctx);
}

export const actions = { ...plan.actions };
