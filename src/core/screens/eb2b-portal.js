// ==============================================================================
// eB2B CUSTOMER SELF-SERVICE REORDER PORTAL PREVIEW
// ==============================================================================
// Simulates the customer-facing mobile commerce application.
// Allows independent commercial accounts and institutions to place digital
// replenishment orders between representative visits and request field visits.
// ==============================================================================

import { esc, icon, pill } from '../ui.js';

export function renderEb2bPortalModal(app, ctx) {
  if (!app.ui?.eb2bModalOpen) return '';

  const account = ctx?.data?.accounts?.[0] || {
    id: 'ACC-001',
    name: 'Apex Commercial Account',
    city: 'Metropolis',
    tier: 'A',
    address: '100 Business Center',
  };

  const offerings = ctx?.industry?.offerings?.slice(0, 4) || [
    { id: 'OFF-1', name: 'Core Commercial Volume Pack', price: 120 },
    { id: 'OFF-2', name: 'High-Demand Replenishment Unit', price: 85 },
    { id: 'OFF-3', name: 'Premium Display Standard Line', price: 210 },
  ];

  const state = (app.ui.eb2bState ||= {
    quantities: { [offerings[0]?.id || 'OFF-1']: 4, [offerings[1]?.id || 'OFF-2']: 2 },
    submitted: false,
    visitRequested: false,
  });

  const currency = ctx?.country?.currency || '$';
  let total = 0;
  offerings.forEach((off) => {
    const qty = state.quantities[off.id] || 0;
    total += qty * (off.price || 100);
  });

  return `
  <div class="scrim" role="dialog" aria-modal="true" aria-labelledby="eb2b-title" style="display:flex;align-items:center;justify-content:center;z-index:9000;background:rgba(0,0,0,0.65);position:fixed;inset:0;padding:12px;overflow-y:auto">
    <section class="card" style="width:100%;max-width:520px;max-height:92vh;display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:16px;box-shadow:0 20px 40px rgba(0,0,0,0.3);position:relative">
      
      <!-- Customer App Frame Header -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid var(--line);padding-bottom:10px">
        <div>
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:10px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;color:var(--accent-ink)">Customer Mobile Touchpoint</span>
            ${pill('Sample Data · Concept', 'muted')}
          </div>
          <b id="eb2b-title" style="font-size:14px;color:var(--ink)">${esc(account.name)}</b>
        </div>
        <button class="icon-btn sm" data-act="close-eb2b-portal" aria-label="Close eB2B Portal">${icon('x', 18)}</button>
      </div>

      <!-- Commercial Account Status -->
      <div style="background:var(--surface-subtle);border:1px solid var(--line);border-radius:6px;padding:10px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div>
          <small class="muted" style="display:block;font-size:10px">Channel &amp; Terms:</small>
          <span style="font-size:11px;font-weight:600">eB2B Assisted &middot; Net 30 Commercial Credit</span>
        </div>
        <div style="text-align:right">
          <small class="muted" style="display:block;font-size:10px">Available Headroom:</small>
          <span class="good-text" style="font-size:11px;font-weight:700">${esc(currency)} 8,400</span>
        </div>
      </div>

      <!-- Offering Replenishment List -->
      <div style="flex:1;overflow-y:auto;padding-right:4px;margin-bottom:12px">
        <b style="font-size:11px;color:var(--ink);display:block;margin-bottom:6px">Quick Replenishment Order:</b>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${offerings.map((off) => {
            const qty = state.quantities[off.id] || 0;
            return `
              <div style="padding:8px 10px;background:var(--surface);border:1px solid var(--line-soft);border-radius:6px;display:flex;justify-content:space-between;align-items:center">
                <div style="flex:1;padding-right:8px">
                  <span style="font-size:11px;font-weight:600;display:block;color:var(--ink)">${esc(off.name)}</span>
                  <span class="small muted" style="font-size:10px">${esc(currency)} ${esc(String(off.price || 100))} per unit</span>
                </div>
                <div style="display:flex;align-items:center;gap:6px">
                  <button class="btn secondary sm" data-act="eb2b-qty" data-id="${esc(off.id)}" data-delta="-1" style="min-width:28px;height:28px;padding:0;display:inline-flex;align-items:center;justify-content:center">-</button>
                  <span style="font-size:12px;font-weight:700;min-width:24px;text-align:center">${esc(String(qty))}</span>
                  <button class="btn secondary sm" data-act="eb2b-qty" data-id="${esc(off.id)}" data-delta="1" style="min-width:28px;height:28px;padding:0;display:inline-flex;align-items:center;justify-content:center">+</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Scheduled Delivery Window -->
      <div style="padding:8px 10px;background:var(--surface-subtle);border:1px solid var(--line);border-radius:6px;margin-bottom:12px">
        <small class="muted" style="display:block;font-size:10px">Fulfillment Schedule:</small>
        <span style="font-size:11px;font-weight:600">Next Available Dispatch: Tomorrow 09:00 - 12:00</span>
      </div>

      <!-- Action Buttons -->
      <div style="display:flex;flex-direction:column;gap:8px">
        <button class="btn primary" data-act="eb2b-submit" style="min-height:36px;display:flex;justify-content:space-between;align-items:center">
          <span>${icon('check', 16)} Submit Digital Replenishment</span>
          <b>${esc(currency)} ${esc(String(total))}</b>
        </button>

        <button class="btn secondary" data-act="eb2b-request-visit" style="min-height:32px;font-size:11px">
          ${icon('ask', 14)} Request Representative On-Site Visit
        </button>
      </div>

      ${app.ui?.eb2bToast ? `<div class="notice good" style="margin-top:8px">${icon('check', 14)}<span>${esc(app.ui.eb2bToast)}</span></div>` : ''}
    </section>
  </div>`;
}

export const eb2bPortalActions = {
  'open-eb2b-portal': ({ app }) => {
    (app.ui ||= {}).eb2bModalOpen = true;
    app.presenterOpen = false;
  },
  'close-eb2b-portal': ({ app }) => {
    if (app.ui) app.ui.eb2bModalOpen = false;
  },
  'eb2b-qty': ({ app, data }) => {
    const state = (app.ui.eb2bState ||= { quantities: {} });
    state.quantities ||= {};
    const cur = state.quantities[data.id] || 0;
    const next = Math.max(0, cur + Number(data.delta));
    state.quantities[data.id] = next;
  },
  'eb2b-submit': ({ app, ctx }) => {
    const state = app.ui?.eb2bState;
    if (!state) return;
    state.submitted = true;
    (app.ui ||= {}).eb2bToast = 'Replenishment order transmitted to dispatch queue via eB2B API.';
    if (ctx?.m?.logAudit) {
      ctx.m.logAudit('eB2B Commerce', 'Customer self-service replenishment order placed');
    }
  },
  'eb2b-request-visit': ({ app, ctx }) => {
    const state = (app.ui.eb2bState ||= {});
    state.visitRequested = true;
    (app.ui ||= {}).eb2bToast = 'Visit request routed to territory representative schedule.';
    if (ctx?.m?.logAudit) {
      ctx.m.logAudit('eB2B Request', 'Customer requested in-person representative visit');
    }
  },
};
