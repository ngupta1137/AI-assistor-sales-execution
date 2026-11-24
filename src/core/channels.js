// ==============================================================================
// TRADE CHANNELS & ROUTE-TO-MARKET (RTM) ARCHETYPES
// ==============================================================================
// Configurable trade channels (Modern Trade vs Traditional Trade) and RTM
// archetypes (DSD, Non-DSD, Distributor-Led, Direct, eB2B) dynamically adapted
// across all 21 industry packs via runtime segment and execution mappings.
// ==============================================================================

import { esc, icon } from './ui.js';

export const CHANNELS = {
  modern: {
    id: 'modern',
    name: 'Modern Trade',
    short: 'MT',
    badge: 'Modern Trade (MT)',
    summary: 'Key accounts, organized chains, centralized agreements, and Joint Business Planning (JBP)',
    kpis: ['Display Compliance', 'Agreement Adherence', 'Availability Rate', 'Central Billing'],
    commercialTerms: 'Central Contract Terms (Net 60)',
    stopTag: 'Key Account',
    focusArea: 'Layout compliance, central agreement adherence, space execution, delivery window confirmation',
  },
  traditional: {
    id: 'traditional',
    name: 'Traditional Trade',
    short: 'TT',
    badge: 'Traditional Trade (TT)',
    summary: 'Independent accounts, route distribution, high call frequency, and spot fulfillment',
    kpis: ['Cash Recovery', 'Counter Visibility', 'Visit Speed', 'Replenishment Rate'],
    commercialTerms: 'Payment on Delivery / Weekly Credit',
    stopTag: 'Route Stop',
    focusArea: 'Fast replenishment, counter visibility, cash collection, credit check, bundle incentives',
  },
};

export const RTM_ARCHETYPES = {
  dsd: {
    id: 'dsd',
    name: 'DSD (Direct Field Delivery)',
    short: 'DSD',
    badge: 'DSD (Direct Delivery)',
    summary: 'Direct fulfillment from vehicle inventory with on-the-spot delivery receipts and stock checks',
    fulfillmentMode: 'Off-Truck Delivery',
    fulfillmentDetails: 'Delivered directly from vehicle inventory. Physical delivery receipt recorded on site.',
    evidenceType: 'Vehicle Delivery Receipt',
    orderLeadTime: 'Immediate (Off-Truck)',
  },
  non_dsd: {
    id: 'non_dsd',
    name: 'Non-DSD (Central DC Dispatch)',
    short: 'Non-DSD',
    badge: 'Non-DSD (Central DC)',
    summary: 'Pre-sales order booking with bulk shipment dispatched from central logistics center within 24-48 hours',
    fulfillmentMode: 'Central DC Dispatch',
    fulfillmentDetails: 'Routed to regional distribution center. Scheduled route delivery dispatched in 24-48 hours.',
    evidenceType: 'Central PO Confirmation',
    orderLeadTime: '24-48 Hours',
  },
  distributor: {
    id: 'distributor',
    name: 'Distributor-Led (Secondary Sales)',
    short: 'Distributor',
    badge: 'Distributor-Led',
    summary: 'Secondary sales booking routed through local authorized distribution partners for order delivery',
    fulfillmentMode: 'Distributor Delivery',
    fulfillmentDetails: 'Secondary order routed to authorized distributor partner for scheduled route fulfillment.',
    evidenceType: 'Distributor Partner Handover',
    orderLeadTime: 'Next-Day Route',
  },
  direct: {
    id: 'direct',
    name: 'Direct (Direct-to-Account)',
    short: 'Direct',
    badge: 'Direct (D2A)',
    summary: 'Direct corporate contract billing with factory-to-site delivery and corporate purchasing agreements',
    fulfillmentMode: 'Direct Corporate Dispatch',
    fulfillmentDetails: 'Direct manufacturer billing with verified SLA delivery and corporate purchase order reference.',
    evidenceType: 'Corporate Contract Sign-off',
    orderLeadTime: 'SLA Delivery (3-5 Days)',
  },
  eb2b: {
    id: 'eb2b',
    name: 'eB2B (Digital Assisted Commerce)',
    short: 'eB2B',
    badge: 'eB2B Digital Assist',
    summary: 'Rep-assisted digital ordering with customer mobile app re-orders and digital loyalty rewards',
    fulfillmentMode: 'Digital App Assisted Order',
    fulfillmentDetails: 'Transmitted to customer digital portal with app reward credits and push delivery tracking.',
    evidenceType: 'App Order Confirmation QR',
    orderLeadTime: 'App Scheduled',
  },
};

/**
 * Returns the channel definition, tailored dynamically for the active industry pack.
 */
export function getChannel(id, ctx) {
  const base = CHANNELS[id] || CHANNELS.modern;
  if (!ctx?.industry) return base;

  const ex = ctx.industry.execution || {};
  const segs = ctx.industry.segments || [];
  const activeIds = id === 'modern' ? (ex.consultative || []) : (ex.orderLed || []);
  const matchingSegs = segs.filter((s) => activeIds.includes(s.id));
  const segLabel = matchingSegs.map((s) => s.name).join(' & ');

  if (!segLabel) return base;

  return {
    ...base,
    badge: `${base.short} (${segLabel})`,
    segmentNames: segLabel,
    summary: id === 'modern'
      ? `Organized accounts (${segLabel}), centralized agreements, and Joint Business Planning`
      : `Independent accounts (${segLabel}), route distribution, high call frequency, and spot fulfillment`,
    focusArea: id === 'modern'
      ? `Agreements with ${segLabel}, space execution, scheduled delivery windows`
      : `Replenishment for ${segLabel}, visibility, cash collection, credit check`,
  };
}

/**
 * Returns the RTM archetype definition, tailored dynamically for the active industry pack.
 */
export function getRtm(id, ctx) {
  const base = RTM_ARCHETYPES[id] || RTM_ARCHETYPES.dsd;
  if (!ctx?.industry) return base;

  const ex = ctx.industry.execution || {};
  const f = ex.fulfillment || {};
  const partnerTitle = ex.partner || 'Partner';
  const source = f.sourceShort || 'Central Supply';

  if (id === 'distributor') {
    return {
      ...base,
      fulfillmentMode: `${partnerTitle} Delivery`,
      fulfillmentDetails: `Secondary booking routed to authorized ${partnerTitle} for scheduled route delivery.`,
    };
  }

  if (id === 'non_dsd') {
    return {
      ...base,
      fulfillmentMode: `${source} Dispatch`,
      fulfillmentDetails: `Pre-sales order booked and dispatched from ${f.source || source} in 24-48 hours.`,
    };
  }

  return base;
}

/**
 * Interactive segmented switcher bar for Modern Trade vs Traditional Trade
 * and RTM Archetypes, designed to be embedded directly on the Today screen.
 */
export function renderChannelRtmBar(app, ctx) {
  const currentChannel = app.config?.channel || 'modern';
  const currentRtm = app.config?.rtm || 'dsd';
  const ch = getChannel(currentChannel, ctx);
  const rtm = getRtm(currentRtm, ctx);

  return `
  <section class="card channel-rtm-bar" style="margin:0 0 10px 0;padding:10px 12px;background:var(--surface);border:1px solid var(--line);border-radius:8px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:8px;flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-size:12px;font-weight:700;letter-spacing:0.02em;text-transform:uppercase;color:var(--accent-ink)">Channel &amp; RTM:</span>
        <span class="badge" style="background:var(--surface-subtle);border:1px solid var(--line);padding:2px 6px;border-radius:4px;font-size:11px;font-weight:600">
          ${esc(ch.badge)} · ${esc(rtm.badge)}
        </span>
      </div>
      <small class="muted" style="font-size:10px">Holistic Execution Modes</small>
    </div>

    <!-- 1. Channel Switcher: Modern Trade vs Traditional Trade -->
    <div style="margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
        <span style="font-size:11px;font-weight:600;color:var(--ink-secondary)">Trade Channel:</span>
        <small class="muted" style="font-size:10px">${esc(ch.summary)}</small>
      </div>
      <div class="seg-ctl" role="group" aria-label="Trade Channel Selector" style="display:flex;gap:6px">
        <button class="seg ${currentChannel === 'modern' ? 'on' : ''}" data-act="switch-channel" data-channel="modern" style="min-height:44px;min-width:44px;flex:1;font-size:11px;font-weight:600;border-radius:4px">
          ${icon('brief', 14)} Modern Trade (MT)
        </button>
        <button class="seg ${currentChannel === 'traditional' ? 'on' : ''}" data-act="switch-channel" data-channel="traditional" style="min-height:44px;min-width:44px;flex:1;font-size:11px;font-weight:600;border-radius:4px">
          ${icon('route', 14)} Traditional Trade (TT)
        </button>
      </div>
    </div>

    <!-- 2. RTM Archetype Switcher: DSD, Non-DSD, Distributor, Direct, eB2B -->
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
        <span style="font-size:11px;font-weight:600;color:var(--ink-secondary)">RTM Archetype:</span>
        <small class="muted" style="font-size:10px">${esc(rtm.fulfillmentMode)}</small>
      </div>
      <div style="display:flex;gap:4px;flex-wrap:wrap">
        <button class="btn ${currentRtm === 'dsd' ? 'primary' : 'secondary'} sm" data-act="switch-rtm" data-rtm="dsd" style="min-height:44px;min-width:48px;flex:1 1 48px;font-size:10px;padding:4px 6px">
          DSD
        </button>
        <button class="btn ${currentRtm === 'non_dsd' ? 'primary' : 'secondary'} sm" data-act="switch-rtm" data-rtm="non_dsd" style="min-height:44px;min-width:48px;flex:1 1 48px;font-size:10px;padding:4px 6px">
          Non-DSD
        </button>
        <button class="btn ${currentRtm === 'distributor' ? 'primary' : 'secondary'} sm" data-act="switch-rtm" data-rtm="distributor" style="min-height:44px;min-width:48px;flex:1 1 48px;font-size:10px;padding:4px 6px">
          Distributor
        </button>
        <button class="btn ${currentRtm === 'direct' ? 'primary' : 'secondary'} sm" data-act="switch-rtm" data-rtm="direct" style="min-height:44px;min-width:48px;flex:1 1 48px;font-size:10px;padding:4px 6px">
          Direct
        </button>
        <button class="btn ${currentRtm === 'eb2b' ? 'primary' : 'secondary'} sm" data-act="switch-rtm" data-rtm="eb2b" style="min-height:44px;min-width:48px;flex:1 1 48px;font-size:10px;padding:4px 6px">
          eB2B
        </button>
      </div>
    </div>
  </section>`;
}
