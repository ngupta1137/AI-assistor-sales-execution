// Direct Store Delivery (DSD) Van Sales & Route Cash Settlement.
// Balances beginning vehicle load, delivered orders, returns, and payment collections.
// Sample data concept. Does not move real funds.

import { icon, pill } from '../ui.js';

export function renderDsdReconciliation(ctx) {
  const { app, data, text: t, esc, fmt } = ctx;
  const settlementState = app.dsdSettlement || {
    startingUnits: 240,
    deliveredUnits: 185,
    damagedUnits: 5,
    countedUnits: 50,
    cashCollected: 1420,
    checksCollected: 850,
    creditExtended: 680,
    depositRef: 'DEP-98214',
    isClosed: false,
  };

  const expectedUnits = settlementState.startingUnits - settlementState.deliveredUnits - settlementState.damagedUnits;
  const unitVariance = settlementState.countedUnits - expectedUnits;
  const totalCollections = settlementState.cashCollected + settlementState.checksCollected;
  const totalInvoiced = totalCollections + settlementState.creditExtended;

  return `
  <section class="card" data-screen="dsd-reconciliation">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <div>
        <div style="display:flex;align-items:center;gap:6px">
          <a href="#/sales" class="btn text sm" style="min-height:44px;min-width:44px;padding:6px 8px;display:inline-flex;align-items:center">
            ${icon('chevronLeft', 16)} Back to Route
          </a>
          <h2 style="margin:0;font-size:16px;font-weight:700">DSD Route and Shift Settlement</h2>
        </div>
        <p class="small muted" style="margin:4px 0 0 0">
          Direct Field Delivery end-of-shift reconciliation for vehicle inventory, damage credits, and payment collections.
        </p>
      </div>
      <div style="display:flex;align-items:center;gap:6px">
        ${settlementState.isClosed ? pill('Shift Settled and Closed', 'good') : pill('Reconciliation In Progress', 'warn')}
        ${unitVariance === 0 ? pill('Inventory Balanced', 'good') : pill(`Variance: ${unitVariance > 0 ? '+' : ''}${unitVariance} units`, 'bad')}
      </div>
    </div>

    <!-- Summary Metrics Grid -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));gap:8px;margin-bottom:14px">
      <div class="card tight" style="padding:10px;border:1px solid var(--line);border-radius:6px;background:var(--surface)">
        <span class="muted" style="font-size:10px;text-transform:uppercase;display:block">Initial Vehicle Load</span>
        <b style="font-size:16px">${settlementState.startingUnits}</b> <span class="small muted">units</span>
      </div>
      <div class="card tight" style="padding:10px;border:1px solid var(--line);border-radius:6px;background:var(--surface)">
        <span class="muted" style="font-size:10px;text-transform:uppercase;display:block">Delivered and Billed</span>
        <b style="font-size:16px;color:var(--accent-ink)">${settlementState.deliveredUnits}</b> <span class="small muted">units</span>
      </div>
      <div class="card tight" style="padding:10px;border:1px solid var(--line);border-radius:6px;background:var(--surface)">
        <span class="muted" style="font-size:10px;text-transform:uppercase;display:block">Returns and Credits</span>
        <b style="font-size:16px;color:var(--warn-ink,#b45309)">${settlementState.damagedUnits}</b> <span class="small muted">units</span>
      </div>
      <div class="card tight" style="padding:10px;border:1px solid var(--line);border-radius:6px;background:var(--surface)">
        <span class="muted" style="font-size:10px;text-transform:uppercase;display:block">Total Shift Revenue</span>
        <b style="font-size:16px;color:var(--good,#10b981)">${fmt ? fmt.currency(totalInvoiced) : `$${totalInvoiced}`}</b>
      </div>
    </div>

    <!-- Section 1: Physical Vehicle Stock Reconciliation -->
    <div class="card tight" style="border:1px solid var(--line);border-radius:6px;padding:12px;margin-bottom:14px;background:var(--surface)">
      <h3 style="font-size:13px;font-weight:700;margin:0 0 8px 0;display:flex;align-items:center;gap:6px">
        ${icon('route', 14)} Physical Vehicle Inventory Reconciliation
      </h3>
      <table style="width:100%;font-size:11px;border-collapse:collapse;line-height:1.6">
        <tbody>
          <tr style="border-bottom:1px solid var(--line-soft)">
            <td style="padding:6px 0">Morning Warehouse Load Out</td>
            <td style="text-align:right;font-weight:600;padding:6px 0">${settlementState.startingUnits} units</td>
          </tr>
          <tr style="border-bottom:1px solid var(--line-soft)">
            <td style="padding:6px 0">Delivered Across Route Stops</td>
            <td style="text-align:right;font-weight:600;color:var(--accent-ink);padding:6px 0">- ${settlementState.deliveredUnits} units</td>
          </tr>
          <tr style="border-bottom:1px solid var(--line-soft)">
            <td style="padding:6px 0">Damaged / Expired Returns Picked Up (Credit Memo)</td>
            <td style="text-align:right;font-weight:600;color:var(--warn-ink,#b45309);padding:6px 0">- ${settlementState.damagedUnits} units</td>
          </tr>
          <tr style="border-bottom:1px solid var(--line)">
            <td style="padding:6px 0"><b>Expected Remaining in Vehicle</b></td>
            <td style="text-align:right;font-weight:700;padding:6px 0"><b>${expectedUnits} units</b></td>
          </tr>
          <tr style="background:var(--surface-subtle)">
            <td style="padding:8px 6px"><b>Actual Physical End Count</b></td>
            <td style="text-align:right;padding:8px 6px">
              <input type="number" id="dsd-actual-count" class="input" style="width:80px;text-align:right;font-weight:700;font-size:12px;padding:4px;min-height:36px" value="${settlementState.countedUnits}" data-change="set-dsd-count">
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Section 2: Cash & Payment Collections Reconciliation -->
    <div class="card tight" style="border:1px solid var(--line);border-radius:6px;padding:12px;margin-bottom:14px;background:var(--surface)">
      <h3 style="font-size:13px;font-weight:700;margin:0 0 8px 0;display:flex;align-items:center;gap:6px">
        ${icon('check', 14)} Payment Collections and Deposit Reconciliation
      </h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:10px;margin-bottom:10px">
        <div>
          <label for="dsd-cash" style="display:block;font-size:10px;text-transform:uppercase;color:var(--ink-secondary);margin-bottom:2px">Cash in Hand</label>
          <input type="number" id="dsd-cash" class="input" style="width:100%;font-size:12px;padding:6px;box-sizing:border-box;min-height:36px" value="${settlementState.cashCollected}" data-change="set-dsd-cash">
        </div>
        <div>
          <label for="dsd-checks" style="display:block;font-size:10px;text-transform:uppercase;color:var(--ink-secondary);margin-bottom:2px">Checks / Digital Collected</label>
          <input type="number" id="dsd-checks" class="input" style="width:100%;font-size:12px;padding:6px;box-sizing:border-box;min-height:36px" value="${settlementState.checksCollected}" data-change="set-dsd-checks">
        </div>
        <div>
          <label for="dsd-deposit-ref" style="display:block;font-size:10px;text-transform:uppercase;color:var(--ink-secondary);margin-bottom:2px">Bank Deposit Slip Reference</label>
          <input type="text" id="dsd-deposit-ref" class="input" style="width:100%;font-size:12px;padding:6px;box-sizing:border-box;min-height:36px" value="${esc(settlementState.depositRef)}" data-change="set-dsd-ref">
        </div>
      </div>
      <div style="background:var(--surface-subtle);border-radius:4px;padding:8px 10px;display:flex;justify-content:space-between;align-items:center;font-size:11px">
        <span>Total Remitted to Depot / Bank:</span>
        <b>${fmt ? fmt.currency(totalCollections) : `$${totalCollections}`}</b>
      </div>
    </div>

    <!-- Settlement Actions Bar -->
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;padding-top:8px;border-top:1px solid var(--line)">
      <button class="btn secondary" data-act="export-dsd-settlement" style="min-height:44px;min-width:44px;font-size:12px">
        ${icon('note', 14)} Export Settlement Sheet (JSON)
      </button>
      <button class="btn primary" data-act="finalize-dsd-settlement" style="min-height:44px;min-width:44px;font-size:12px">
        ${icon('check', 14)} Sign and Close Daily Shift
      </button>
    </div>
  </section>`;
}

export const actions = {
  'set-dsd-count': ({ app, el }) => {
    app.dsdSettlement = app.dsdSettlement || { startingUnits: 240, deliveredUnits: 185, damagedUnits: 5, countedUnits: 50, cashCollected: 1420, checksCollected: 850, creditExtended: 680, depositRef: 'DEP-98214', isClosed: false };
    app.dsdSettlement.countedUnits = Number(el.value) || 0;
  },
  'set-dsd-cash': ({ app, el }) => {
    app.dsdSettlement = app.dsdSettlement || { startingUnits: 240, deliveredUnits: 185, damagedUnits: 5, countedUnits: 50, cashCollected: 1420, checksCollected: 850, creditExtended: 680, depositRef: 'DEP-98214', isClosed: false };
    app.dsdSettlement.cashCollected = Number(el.value) || 0;
  },
  'set-dsd-checks': ({ app, el }) => {
    app.dsdSettlement = app.dsdSettlement || { startingUnits: 240, deliveredUnits: 185, damagedUnits: 5, countedUnits: 50, cashCollected: 1420, checksCollected: 850, creditExtended: 680, depositRef: 'DEP-98214', isClosed: false };
    app.dsdSettlement.checksCollected = Number(el.value) || 0;
  },
  'set-dsd-ref': ({ app, el }) => {
    app.dsdSettlement = app.dsdSettlement || { startingUnits: 240, deliveredUnits: 185, damagedUnits: 5, countedUnits: 50, cashCollected: 1420, checksCollected: 850, creditExtended: 680, depositRef: 'DEP-98214', isClosed: false };
    app.dsdSettlement.depositRef = el.value;
  },
  'finalize-dsd-settlement': ({ app }) => {
    app.dsdSettlement = app.dsdSettlement || { startingUnits: 240, deliveredUnits: 185, damagedUnits: 5, countedUnits: 50, cashCollected: 1420, checksCollected: 850, creditExtended: 680, depositRef: 'DEP-98214', isClosed: false };
    app.dsdSettlement.isClosed = true;
  },
  'export-dsd-settlement': ({ app }) => {
    const data = app.dsdSettlement || { startingUnits: 240, deliveredUnits: 185, damagedUnits: 5, countedUnits: 50, cashCollected: 1420, checksCollected: 850, creditExtended: 680, depositRef: 'DEP-98214', isClosed: true };
    if (typeof window !== 'undefined' && window.Blob) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `dsd-settlement-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    }
    return false;
  },
};

export const render = renderDsdReconciliation;
