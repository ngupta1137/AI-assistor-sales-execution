// Trade Promotion Management (TPM) & Commercial Scheme Engine.
// Evaluates volume slabs, promotional bonus bundles, and buyer margin impact.
// Sample data concept. Does not alter contractual distributor pricing schedules.

import { icon, pill } from '../ui.js';

export function renderTradePromotions(ctx) {
  const { app, data, text: t, esc, fmt } = ctx;
  const promoState = app.tradePromoState || {
    selectedSchemeId: 'SCH-VOL-10',
    schemes: [
      {
        id: 'SCH-VOL-10',
        name: 'Tier-2 Volume Slab Allowance',
        type: 'Off-Invoice Discount',
        rule: 'Order 15+ cases for 8% immediate invoice deduction',
        minOrder: 15,
        discountPct: 8,
        freeUnits: 0,
        active: true,
      },
      {
        id: 'SCH-BOGO-1',
        name: 'Innovation Trial Bonus (Buy 10 Get 1)',
        type: 'Free Product Bonus',
        rule: 'Buy 10 flagship units, receive 1 new launch unit complimentary',
        minOrder: 10,
        discountPct: 0,
        freeUnits: 1,
        active: false,
      },
      {
        id: 'SCH-BND-5',
        name: 'Range Expansion Basket Bundle',
        type: 'Cross-Category Incentive',
        rule: 'Include 3 distinct product categories for 5% overall rebate',
        minOrder: 20,
        discountPct: 5,
        freeUnits: 1,
        active: false,
      },
    ],
    orderCases: 18,
    basePricePerUnit: 45,
    resalePricePerUnit: 65,
    applied: false,
  };

  const activeScheme = promoState.schemes.find((s) => s.id === promoState.selectedSchemeId) || promoState.schemes[0];
  const grossValue = promoState.orderCases * promoState.basePricePerUnit;
  const discountVal = (grossValue * (activeScheme.discountPct / 100));
  const netInvoice = grossValue - discountVal;
  const totalRevenueAtResale = (promoState.orderCases + activeScheme.freeUnits) * promoState.resalePricePerUnit;
  const buyerProfit = totalRevenueAtResale - netInvoice;
  const buyerMarginPct = Math.round((buyerProfit / totalRevenueAtResale) * 100);

  return `
  <section class="card" data-screen="trade-promotions">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <div>
        <div style="display:flex;align-items:center;gap:6px">
          <a href="#/order" class="btn text sm" style="min-height:44px;min-width:44px;padding:6px 8px;display:inline-flex;align-items:center">
            ${icon('chevronLeft', 16)} Back to Order
          </a>
          <h2 style="margin:0;font-size:16px;font-weight:700">Trade Promotions and Commercial Scheme Calculator</h2>
        </div>
        <p class="small muted" style="margin:4px 0 0 0">
          Simulate trade discounts, volume threshold allowances, and customer gross profit margins.
        </p>
      </div>
      <div style="display:flex;align-items:center;gap:6px">
        ${promoState.applied ? pill('Scheme Applied to Order', 'good') : pill('Simulation Mode', 'info')}
        ${pill(`Buyer Profit: ${buyerMarginPct}% Margin`, 'good')}
      </div>
    </div>

    <!-- Active Available Trade Schemes Selector -->
    <div style="margin-bottom:14px">
      <h3 style="font-size:13px;font-weight:700;margin:0 0 8px 0;display:flex;align-items:center;gap:6px">
        ${icon('box', 14)} Qualified Commercial Schemes
      </h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:8px">
        ${promoState.schemes.map((s) => `
          <div class="card tight" 
            data-act="select-scheme" 
            data-scheme-id="${esc(s.id)}"
            style="cursor:pointer;border:2px solid ${s.id === activeScheme.id ? 'var(--accent-ink,#2563eb)' : 'var(--line)'};border-radius:6px;padding:10px 12px;background:${s.id === activeScheme.id ? 'var(--surface-subtle)' : 'var(--surface)'}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px">
              <b style="font-size:11px;color:var(--ink)">${esc(s.name)}</b>
              ${s.id === activeScheme.id ? pill('Selected', 'good') : pill(s.type, 'muted')}
            </div>
            <p class="small muted" style="margin:0 0 6px 0;font-size:10px">${esc(s.rule)}</p>
            <div style="font-size:10px;color:var(--ink-secondary)">
              <span>Min Volume: <b>${s.minOrder} cases</b></span> &bull; 
              <span>Allowance: <b>${s.discountPct > 0 ? `${s.discountPct}% Off` : `+${s.freeUnits} Free`}</b></span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Interactive Margin and Customer ROI Simulator -->
    <div class="card tight" style="border:1px solid var(--line);border-radius:6px;padding:12px;margin-bottom:14px;background:var(--surface)">
      <h3 style="font-size:13px;font-weight:700;margin:0 0 10px 0;display:flex;align-items:center;gap:6px">
        ${icon('target', 14)} Customer Commercial Value and Margin Simulation
      </h3>
      
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));gap:10px;margin-bottom:12px">
        <div>
          <label for="promo-order-qty" style="display:block;font-size:10px;text-transform:uppercase;color:var(--ink-secondary);margin-bottom:2px">Order Volume (Cases)</label>
          <input type="number" id="promo-order-qty" class="input" style="width:100%;font-size:12px;padding:6px;box-sizing:border-box;min-height:36px" value="${promoState.orderCases}" data-change="set-promo-qty">
        </div>
        <div>
          <label style="display:block;font-size:10px;text-transform:uppercase;color:var(--ink-secondary);margin-bottom:2px">Base Invoice Rate</label>
          <div style="font-size:13px;font-weight:700;padding:6px 0">${fmt ? fmt.currency(promoState.basePricePerUnit) : `$${promoState.basePricePerUnit}`} / case</div>
        </div>
        <div>
          <label style="display:block;font-size:10px;text-transform:uppercase;color:var(--ink-secondary);margin-bottom:2px">Expected Resale Price</label>
          <div style="font-size:13px;font-weight:700;padding:6px 0;color:var(--good,#10b981)">${fmt ? fmt.currency(promoState.resalePricePerUnit) : `$${promoState.resalePricePerUnit}`} / case</div>
        </div>
        <div>
          <label style="display:block;font-size:10px;text-transform:uppercase;color:var(--ink-secondary);margin-bottom:2px">Promotional Bonus</label>
          <div style="font-size:13px;font-weight:700;padding:6px 0;color:var(--accent-ink)">+${activeScheme.freeUnits} bonus cases</div>
        </div>
      </div>

      <!-- Financial Calculation Summary Table -->
      <table style="width:100%;font-size:11px;border-collapse:collapse;line-height:1.6">
        <tbody>
          <tr style="border-bottom:1px solid var(--line-soft)">
            <td style="padding:6px 0">Gross Order Subtotal (${promoState.orderCases} cases)</td>
            <td style="text-align:right;font-weight:600;padding:6px 0">${fmt ? fmt.currency(grossValue) : `$${grossValue}`}</td>
          </tr>
          <tr style="border-bottom:1px solid var(--line-soft)">
            <td style="padding:6px 0">Commercial Allowance (${activeScheme.discountPct}% off-invoice)</td>
            <td style="text-align:right;font-weight:600;color:var(--good,#10b981);padding:6px 0">- ${fmt ? fmt.currency(discountVal) : `$${discountVal}`}</td>
          </tr>
          <tr style="border-bottom:1px solid var(--line-soft)">
            <td style="padding:6px 0"><b>Net Invoice Payable by Customer</b></td>
            <td style="text-align:right;font-weight:700;padding:6px 0"><b>${fmt ? fmt.currency(netInvoice) : `$${netInvoice}`}</b></td>
          </tr>
          <tr style="border-bottom:1px solid var(--line-soft)">
            <td style="padding:6px 0">Gross Realized Value at Resale (${promoState.orderCases + activeScheme.freeUnits} cases sold)</td>
            <td style="text-align:right;font-weight:600;padding:6px 0">${fmt ? fmt.currency(totalRevenueAtResale) : `$${totalRevenueAtResale}`}</td>
          </tr>
          <tr style="background:var(--surface-subtle)">
            <td style="padding:8px 6px"><b>Customer Gross Profit and Margin</b></td>
            <td style="text-align:right;font-weight:700;padding:8px 6px;color:var(--good,#10b981)">
              <b>${fmt ? fmt.currency(buyerProfit) : `$${buyerProfit}`} (${buyerMarginPct}% margin)</b>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Actions Bar -->
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;padding-top:8px;border-top:1px solid var(--line)">
      <button class="btn secondary" data-act="export-promo-breakdown" style="min-height:44px;min-width:44px;font-size:12px">
        ${icon('note', 14)} Export Margin Sheet (JSON)
      </button>
      <button class="btn primary" data-act="apply-scheme-to-order" style="min-height:44px;min-width:44px;font-size:12px">
        ${icon('check', 14)} ${promoState.applied ? 'Scheme Applied' : 'Apply Scheme to Visit Order'}
      </button>
    </div>
  </section>`;
}

export const actions = {
  'select-scheme': ({ app, data }) => {
    app.tradePromoState = app.tradePromoState || {
      selectedSchemeId: 'SCH-VOL-10',
      schemes: [
        { id: 'SCH-VOL-10', name: 'Tier-2 Volume Slab Allowance', type: 'Off-Invoice Discount', rule: 'Order 15+ cases for 8% immediate invoice deduction', minOrder: 15, discountPct: 8, freeUnits: 0, active: true },
        { id: 'SCH-BOGO-1', name: 'Innovation Trial Bonus (Buy 10 Get 1)', type: 'Free Product Bonus', rule: 'Buy 10 flagship units, receive 1 new launch unit complimentary', minOrder: 10, discountPct: 0, freeUnits: 1, active: false },
        { id: 'SCH-BND-5', name: 'Range Expansion Basket Bundle', type: 'Cross-Category Incentive', rule: 'Include 3 distinct product categories for 5% overall rebate', minOrder: 20, discountPct: 5, freeUnits: 1, active: false },
      ],
      orderCases: 18, basePricePerUnit: 45, resalePricePerUnit: 65, applied: false,
    };
    app.tradePromoState.selectedSchemeId = data.schemeId;
  },
  'set-promo-qty': ({ app, el }) => {
    app.tradePromoState = app.tradePromoState || { orderCases: 18 };
    app.tradePromoState.orderCases = Number(el.value) || 1;
  },
  'apply-scheme-to-order': ({ app }) => {
    app.tradePromoState = app.tradePromoState || {};
    app.tradePromoState.applied = true;
  },
  'export-promo-breakdown': ({ app }) => {
    const data = app.tradePromoState || {};
    if (typeof window !== 'undefined' && window.Blob) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `trade-promotions-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    }
    return false;
  },
};

export const render = renderTradePromotions;
