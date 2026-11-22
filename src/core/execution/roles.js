// Cross-role state for the execution system (X11 to X18). What one role does here changes
// what another role sees: a retention visit assigned by the manager lands on the rep's day,
// offer targets released by the key account lead reach the field, capabilities switched
// off by sales ops leave the reps' briefs, and the partner's integration model sets when
// {orders} arrive. Lives in the same per-scenario session as the rest of the demo.

import { getSession } from '../state.js';
import { createRng } from '../rng.js';
import { localPrice } from '../../data/generate.js';
import { signals, exOf, archetypeOf, cycleDays, CAPS } from './model.js';
import { personFor } from '../personas.js';

/** Capability dependencies: a capability needs these on to run. */
export const DEPENDS = {
  potential: [], tiering: ['potential'], diagnostics: [], retention: [],
  actions: ['diagnostics', 'tiering'], planning: ['potential', 'tiering'], order: ['diagnostics'], offers: ['potential', 'diagnostics'],
};

/** Partner integration models: when {orders} reach the partner and invoices come back. */
export const MODELS = {
  A: { name: 'Direct link', orders: 'Real time', invoices: 'Daily', lag: 0, note: 'For large partners with their own system. The best option.' },
  B: { name: 'Plug-in', orders: 'Within the hour', invoices: 'Daily', lag: 1, note: 'A small module inside the partner system.' },
  C: { name: 'Shared app', orders: 'Real time', invoices: 'Weekly', lag: 2, note: 'For partners without a system. Higher adoption risk.' },
  D: { name: 'File bridge', orders: 'Next day', invoices: 'Weekly, a week behind', lag: 3, note: 'Spreadsheet exchange. Temporary only.' },
};
export const FEEDS = [
  ['invoices', 'Invoices by {account} and {offering}', ['diagnostics', 'retention', 'potential']],
  ['delivery', 'Delivery confirmations', ['order', 'diagnostics']],
  ['stock', 'Partner stock levels', ['order', 'offers']],
  ['returns', 'Returns and credit notes', ['order', 'retention']],
];

/** Lifecycle stages for a new {account} found in the field. */
export const LIFE = ['Found', 'Scored', 'Diagnosed', 'First {visit}', 'First feedback', 'Full loop'];

function state(ctx) {
  const s = getSession(ctx.data.seedKey);
  if (!s.x) {
    s.x = {
      assigned: [],           // accountIds: retention visits assigned by the manager
      tierApproved: {},       // accountId -> new tier
      released: false,        // offer targets released by the key account lead
      included: {},           // accountId -> reason: held-back account included by the key account lead
      pendingOff: null,       // capabilities switched off but not yet applied
      off: [],                // capabilities applied off in this market
      season: false,          // seasonal event mode on
      model: 'B',             // partner integration model
      feeds: { invoices: true, delivery: true, stock: true, returns: true },
      sales: {},              // accountId -> { qty: {offeringId: n}, submitted, at, tier }
      newAccounts: [],        // [{ id, name, area, segmentId, stage, ... }]
      flowRun: {},            // flowId -> { step }
      checklist: {},          // exec adoption checklist item -> true
      valueInputs: null,      // exec value calculator inputs
    };
  }
  return s.x;
}

const actor = (ctx, persona) => personFor(ctx, persona).name;

export function roles(ctx) {
  const x = state(ctx);
  const { data, industry, country, t } = ctx;
  const sg = signals(ctx);
  const log = (persona, text) => ctx.m.logAudit(actor(ctx, persona), text);

  // ---- Manager: retention watch, tier changes --------------------------------
  const watch = () => data.accounts
    .filter((a) => sg[a.id].risk.band !== 'Low')
    .sort((a, b) => sg[b.id].risk.score - sg[a.id].risk.score);
  const assign = (accountId) => {
    if (x.assigned.includes(accountId)) return;
    x.assigned.push(accountId);
    log('manager', `Assigned a retention visit to ${data.rep.name} for ${data.byId[accountId].name}`);
  };
  const assigned = () => x.assigned.map((id) => data.byId[id]).filter(Boolean);
  /** Tier changes the tiering capability proposes: captured share far from what the tier expects. */
  const tierProposals = () => data.accounts.map((a) => {
    const c = sg[a.id].captured;
    const to = a.tier !== 'A' && c >= 78 ? { B: 'A', C: 'B' }[a.tier]
      : a.tier !== 'C' && c < 35 && sg[a.id].risk.band === 'High' ? { A: 'B', B: 'C' }[a.tier] : null;
    return to && to !== a.tier ? { a, from: a.tier, to, why: to < a.tier ? 'Captures {pct}% of potential, above the tier norm' : 'Captures only {pct}% and risk is high', v: { pct: c } } : null;
  }).filter(Boolean).slice(0, 5);
  const approveTier = (accountId, to) => { x.tierApproved[accountId] = to; log('manager', `Approved a tier change for ${data.byId[accountId].name} to tier ${to}`); };
  const tierOf = (accountId) => x.tierApproved[accountId] || data.byId[accountId]?.tier;

  // ---- Key account lead: offer targeting --------------------------------------
  const offerMode = exOf(industry).offers.mode;
  const offerOf = (accountId) => {
    const o = sg[accountId]?.offer;
    if (!o) return null;
    if (x.included[accountId] && o.decision === 'hold') return { ...o, decision: offerMode === 'limited' ? 'eligible' : 'target', tier: exOf(industry).offers.tiers?.[0], t: 'Included by {kam}: {reason}', v: { reason: x.included[accountId] }, included: true };
    return o;
  };
  const release = () => { x.released = true; log('kam', `Released offer targets to the field (${targets().length} ${t('{accounts}')})`); };
  const include = (accountId, reason) => { x.included[accountId] = reason; log('kam', `Included held-back ${data.byId[accountId].name}: ${reason}`); };
  const targets = () => data.accounts.filter((a) => ['target', 'eligible'].includes(offerOf(a.id).decision));
  const held = () => data.accounts.filter((a) => offerOf(a.id).decision === 'hold');
  /** The offer the field sees: only after release, and only if the capability is on. */
  const fieldOffer = (accountId) => (x.released && capOn('offers') && offerMode !== 'off' ? offerOf(accountId) : null);

  // ---- Sales ops: capabilities, season ----------------------------------------
  const capOn = (c) => !x.off.includes(c);
  const pending = () => x.pendingOff || [...x.off];
  const toggleCap = (c) => {
    const p = new Set(pending());
    if (p.has(c)) p.delete(c); else p.add(c);
    x.pendingOff = [...p];
  };
  /** Capabilities that would break: on, but depending on one switched off. */
  const broken = (offList = pending()) => Object.keys(DEPENDS).filter((c) => !offList.includes(c) && DEPENDS[c].some((d) => offList.includes(d)));
  const apply = () => {
    const p = pending();
    for (const k of Object.keys(x.sales)) if (!x.sales[k].submitted) delete x.sales[k];
    const off = [...new Set([...p, ...broken(p)])];
    x.off = off; x.pendingOff = null;
    log('admin', off.length ? `Applied capability settings: ${off.map((c) => CAPS[c].name).join(', ')} off` : 'Applied capability settings: all capabilities on');
    return off;
  };
  const setSeason = (on) => { x.season = !!on; for (const k of Object.keys(x.sales)) if (!x.sales[k].submitted) delete x.sales[k]; log('admin', `${on ? 'Turned on' : 'Turned off'} event mode for ${data.event.name}`); };

  // ---- Partner: integration model and data feeds ------------------------------
  const setModel = (m) => { x.model = m; log('partner', `Changed the integration model to ${MODELS[m].name}`); };
  const toggleFeed = (f) => { x.feeds[f] = !x.feeds[f]; log('partner', `${x.feeds[f] ? 'Switched on' : 'Switched off'} the ${f} feed`); };
  const lost = () => {
    const out = {};
    for (const [id, , caps] of FEEDS) if (!x.feeds[id]) for (const c of caps) (out[c] ||= []).push(id);
    return out;
  };

  // ---- Order-led rep: route, {orders} with offer tiers, new {accounts} --------
  const salesStops = () => {
    if (data._salesStops) return data._salesStops;
    const rng = createRng(`sales|${data.seedKey}`);
    const repPlan = new Set(data.planned.map((p) => p.accountId));
    let pool = data.accounts.filter((a) => archetypeOf(industry, a.segmentId) === 'orderLed' && !repPlan.has(a.id));
    if (pool.length < 4) pool = data.accounts.filter((a) => archetypeOf(industry, a.segmentId) === 'orderLed');
    if (pool.length < 4) pool = data.accounts.filter((a) => !repPlan.has(a.id));
    const stops = pool
      .sort((a, b) => (b.lastVisitDays - cycleDays(b.tier)) - (a.lastVisitDays - cycleDays(a.tier)) || b.score - a.score)
      .slice(0, 8)
      .map((a, i) => {
        const seg = industry.segments.find((s) => s.id === a.segmentId);
        const offs = industry.offerings.filter((o) => (!o.segments || o.segments.includes(seg.id)) && !o.kind);
        const lines = rng.shuffle(offs.map((o) => o.id)).slice(0, Math.min(offs.length, rng.int(3, 5))).map((id) => {
          const o = industry.offerings.find((y) => y.id === id);
          const range = o.qty || seg.orderQty || [1, 6];
          const qty = rng.int(range[0], range[1]);
          return { offeringId: id, suggested: qty, price: localPrice(o.price, country) };
        });
        const acts = industry.actions.filter((d) => d.agent === 'gap' && (!d.segments || d.segments.includes(seg.id))).slice(0, 2);
        return { accountId: a.id, start: 8 * 60 + 30 + i * 35, minutes: Math.min(25, a.visitMinutes || 20), lines, actions: acts.map((d) => d.id) };
      });
    data._salesStops = stops;
    return stops;
  };
  const salesOrder = (accountId) => {
    if (!x.sales[accountId]) {
      const st = salesStops().find((s) => s.accountId === accountId);
      const blank = x.off.includes('order');
      x.sales[accountId] = { qty: Object.fromEntries((st?.lines || []).map((l) => [l.offeringId, blank ? 0 : Math.ceil(l.suggested * seasonFactor())])), submitted: false };
    }
    return x.sales[accountId];
  };
  const seasonFactor = () => (x.season ? 1.2 : 1);
  const lineValue = (accountId) => {
    const st = salesStops().find((s) => s.accountId === accountId);
    const o = salesOrder(accountId);
    return (st?.lines || []).reduce((sum, l) => sum + (l.price || 0) * (o.qty[l.offeringId] || 0), 0);
  };
  /** Offer tiers on an {order}: thresholds relative to the suggested {order}. Sample values. */
  const tiersFor = (accountId) => {
    const st = salesStops().find((s) => s.accountId === accountId);
    const base = (st?.lines || []).reduce((sum, l) => sum + (l.price || 0) * l.suggested, 0);
    const names = exOf(industry).offers.tiers || [];
    return names.map((name, i) => ({ name, min: Math.round(base * [1, 1.3, 1.6][i]) }));
  };
  const raiseToNext = (accountId) => {
    const tiers = tiersFor(accountId);
    const cur = lineValue(accountId);
    const next = tiers.find((tt) => tt.min > cur);
    if (!next || !cur) return null;
    const o = salesOrder(accountId);
    const f = next.min / cur;
    for (const k of Object.keys(o.qty)) o.qty[k] = Math.ceil(o.qty[k] * f);
    log('salesman', `Raised the ${t('{order}')} at ${data.byId[accountId].name} to reach ${next.name}`);
    return next;
  };
  const submitSales = (accountId) => {
    const o = salesOrder(accountId);
    o.submitted = true; o.at = ctx.fmt?.time ? ctx.fmt.time(9 * 60 + Object.values(x.sales).filter((y) => y.submitted).length * 35) : '';
    log('salesman', `Sent the ${t('{order}')} for ${data.byId[accountId].name}${exOf(industry).partner ? ` to the ${exOf(industry).partner}` : ''}`);
  };
  const salesSubmitted = () => salesStops().filter((s) => x.sales[s.accountId]?.submitted);
  const addNew = ({ name, area, segmentId }) => {
    const peers = data.accounts.filter((a) => a.segmentId === segmentId && a.area === area);
    const ref = peers.length ? peers : data.accounts.filter((a) => a.segmentId === segmentId);
    const pot = Math.round(ref.reduce((s, a) => s + a.potential, 0) / Math.max(1, ref.length));
    const tiers = ref.map((a) => a.tier).sort();
    const tier = tiers[Math.floor(tiers.length / 2)] || 'C';
    const seg = industry.segments.find((s) => s.id === segmentId);
    const starters = industry.actions.filter((d) => d.agent === 'gap' && (!d.segments || d.segments.includes(segmentId))).slice(0, 2).map((d) => d.id);
    const intro = industry.offerings.filter((o) => (!o.segments || o.segments.includes(segmentId)) && !o.kind && o.status === 'core').slice(0, 3).map((o) => o.id);
    const n = { id: `N${x.newAccounts.length + 1}`, name, area, segmentId, segment: seg.name, potential: pot, tier, peers: ref.length, stage: 1, starters, intro };
    x.newAccounts.push(n);
    log('salesman', `Added a new ${t('{account}')}: ${name} in ${area}. Provisional tier ${tier} from ${ref.length} similar ${t('{accounts}')}`);
    return n;
  };
  const advance = (id) => {
    const n = x.newAccounts.find((y) => y.id === id);
    if (n && n.stage < LIFE.length) { n.stage += 1; log('salesman', `${n.name} moved to stage ${n.stage}: ${t(LIFE[n.stage - 1])}`); }
    return n;
  };

  // ---- Flows in action --------------------------------------------------------
  const flowStep = (flowId) => x.flowRun[flowId]?.step || 0;
  const stepFlow = (flowId) => { x.flowRun[flowId] = { step: Math.min(4, flowStep(flowId) + 1) }; };
  const resetFlow = (flowId) => { x.flowRun[flowId] = { step: 0 }; };

  return {
    x, log,
    watch, assign, assigned, tierProposals, approveTier, tierOf,
    offerMode, offerOf, release, released: () => x.released, include, targets, held, fieldOffer,
    capOn, pending, toggleCap, broken, apply, off: () => [...x.off], season: () => x.season, setSeason,
    model: () => x.model, setModel, feeds: () => ({ ...x.feeds }), toggleFeed, lost,
    salesStops, salesOrder, lineValue, tiersFor, raiseToNext, submitSales, salesSubmitted, seasonFactor,
    newAccounts: () => x.newAccounts, addNew, advance,
    flowStep, stepFlow, resetFlow,
  };
}
