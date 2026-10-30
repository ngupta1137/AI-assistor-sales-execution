// Dynamic pitch and customer value story. Built from the account's sample performance, the current range
// and the trend, with the source of every point shown. Every line is scanned for restricted claims.

import { kpiValue } from '../ui.js';
import { safe } from './claims.js';

const pctWord = (n) => (Math.abs(n) < 3 ? 'level with the one before' : `${Math.abs(n)}% ${n > 0 ? 'higher' : 'lower'} than the one before`);

/** The values pitch and story templates read. */
export function pitchVars(ctx, acct) {
  const { industry, fmt, data, m } = ctx;
  let worst = null;
  for (const k of industry.kpis) {
    const v = acct.kpis[k.id];
    if (v == null) continue;
    const gap = k.lowerIsBetter ? (v - k.target) / Math.max(1, k.target) : (k.target - v) / Math.max(1, k.target);
    if (!worst || gap > worst.gap) worst = { k, v, gap };
  }
  const seg = industry.segments.find((s) => s.id === acct.segmentId);
  const inOrder = new Set((m.plannedFor(acct.id)?.order || []).map((l) => l.offeringId));
  const forSeg = industry.offerings.filter((o) => !o.segments || o.segments.includes(seg.id));
  // A segment can list only samples (pharma clinics), so fall back to what the segment has, then to the range.
  const pool = [forSeg.filter((o) => !o.kind && o.price !== 0), forSeg, industry.offerings].find((l) => l.length);
  const offer = pool.find((o) => (o.status === 'new' || o.status === 'focus') && !inOrder.has(o.id)) || pool.find((o) => o.status === 'new' || o.status === 'focus') || pool[0];
  const [a, b] = acct.orderHistory;
  const change = Math.round(((a.total - b.total) / b.total) * 100);
  return {
    name: acct.name, person: acct.contacts[0].name,
    kpi: ctx.t(worst.k.label), kpiValue: kpiValue(worst.k, worst.v, fmt), kpiTarget: kpiValue(worst.k, worst.k.target, fmt),
    offer: ctx.t(offer.name), trend: pctWord(change),
    event: data.event.name, eventDays: data.event.days,
    share: `${Math.round((acct.current / acct.potential) * 100)}%`, potential: fmt.moneyShort(acct.potential), current: fmt.moneyShort(acct.current), whitespace: fmt.moneyShort(acct.whiteSpace),
    orderCount: acct.orderHistory.length,
    _kpi: worst.k.label, _offer: offer.name,
  };
}

const SOURCE = {
  kpi: (ctx, v) => `KPI "${ctx.t(v._kpi)}" on the {account} record (sample data)`,
  offer: () => 'The current focus and new {offerings} for this segment',
  trend: () => 'The last two {orders} of this {account}',
  event: (ctx) => `Local events calendar for ${ctx.country.name} (dates approximate)`,
  share: () => 'Current and potential yearly value on the {account} record (sample estimate)',
  potential: () => 'Potential score and yearly value on the {account} record (sample estimate)',
  orderCount: () => 'The {order} history of this {account}',
};

/** Three talking points, each with its sources. */
export function buildPitch(ctx, acct) {
  const v = pitchVars(ctx, acct);
  return ctx.industry.companion.pitchTemplates.map((tpl) => {
    const s = safe(ctx, ctx.t(tpl.text, v));
    return { id: tpl.id, ...s, sources: tpl.uses.map((u) => ctx.t(SOURCE[u](ctx, v))) };
  });
}

/** One value story per template: a short narrative in the account's terms, and the data it used. */
export function buildStories(ctx, acct) {
  const v = pitchVars(ctx, acct);
  return ctx.industry.companion.valueStoryTemplates.map((tpl) => {
    const s = safe(ctx, ctx.t(tpl.text, v));
    const used = [...new Set(['share', 'potential', ...tpl.uses])].filter((u) => SOURCE[u]).map((u) => ({
      label: { share: 'Share of potential', potential: 'Potential and current value', trend: 'Order trend', offer: 'Range', orderCount: 'Orders on record' }[u],
      value: { share: v.share, potential: `${v.current} of ${v.potential}`, trend: v.trend, offer: v.offer, orderCount: String(v.orderCount) }[u],
      source: ctx.t(SOURCE[u](ctx, v)),
    }));
    return { id: tpl.id, title: ctx.t(tpl.title), ...s, used };
  });
}
