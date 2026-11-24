// Regulated Sample & Chain-of-Custody Tracking.
// Supports PDMA, lot/batch tracking, practitioner entitlement checks, and on-glass signatures.
// Sample data concept. Does not alter external regulatory registers.

import { icon, pill } from '../ui.js';

export function renderSampleCustody(ctx) {
  const { app, data, text: t, esc } = ctx;
  const sampleLog = app.sampleCustodyState || {
    contactName: 'Dr. Jane Morgan, MD',
    licenseNumber: 'MED-REG-847291',
    licenseStatus: 'Verified Active',
    maxAllowance: 4,
    transfers: [
      { id: 'SMP-101', name: 'CardioGuard Starter Pack 10mg', lot: 'LOT-992-B4', expiry: '2028-06-30', qty: 2 },
      { id: 'SMP-102', name: 'GlycoControl Starter Kit 500mg', lot: 'LOT-881-A2', expiry: '2027-12-31', qty: 1 },
    ],
    signedBy: '',
    signedAt: '',
    isSubmitted: false,
  };

  const totalUnits = sampleLog.transfers.reduce((sum, item) => sum + item.qty, 0);
  const withinQuota = totalUnits <= sampleLog.maxAllowance;

  return `
  <section class="card" data-screen="sample-custody">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <div>
        <div style="display:flex;align-items:center;gap:6px">
          <a href="#/brief" class="btn text sm" style="min-height:44px;min-width:44px;padding:6px 8px;display:inline-flex;align-items:center">
            ${icon('chevronLeft', 16)} Back to Brief
          </a>
          <h2 style="margin:0;font-size:16px;font-weight:700">Regulated Sample and Chain-of-Custody Log</h2>
        </div>
        <p class="small muted" style="margin:4px 0 0 0">
          Traceable distribution documentation with lot validation and electronic practitioner signature capture.
        </p>
      </div>
      <div style="display:flex;align-items:center;gap:6px">
        ${sampleLog.isSubmitted ? pill('Signature Verified and Recorded', 'good') : pill('Awaiting Signature', 'warn')}
        ${withinQuota ? pill(`Quota: ${totalUnits}/${sampleLog.maxAllowance} Allocated`, 'info') : pill('Quota Exceeded', 'bad')}
      </div>
    </div>

    <!-- License Verification Banner -->
    <div class="card tight" style="background:var(--surface-subtle);border:1px solid var(--line);border-radius:6px;padding:10px 12px;margin-bottom:14px">
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));gap:8px;font-size:11px">
        <div>
          <span class="muted" style="display:block">Licensed Practitioner:</span>
          <b>${esc(sampleLog.contactName)}</b>
        </div>
        <div>
          <span class="muted" style="display:block">Credential / License:</span>
          <b>${esc(sampleLog.licenseNumber)}</b>
        </div>
        <div>
          <span class="muted" style="display:block">Registry Status:</span>
          <span style="color:var(--good,#10b981);font-weight:700">${esc(sampleLog.licenseStatus)}</span>
        </div>
        <div>
          <span class="muted" style="display:block">Custody Standard:</span>
          <b>PDMA / GxP Traceable</b>
        </div>
      </div>
    </div>

    <!-- Distributed Sample Lots Table -->
    <div class="card tight" style="border:1px solid var(--line);border-radius:6px;padding:12px;margin-bottom:14px;background:var(--surface)">
      <h3 style="font-size:13px;font-weight:700;margin:0 0 8px 0;display:flex;align-items:center;gap:6px">
        ${icon('box', 14)} Allocated Sample Lots and Verification
      </h3>
      <table style="width:100%;font-size:11px;border-collapse:collapse;line-height:1.6">
        <thead>
          <tr style="border-bottom:1px solid var(--line);color:var(--ink-secondary);text-align:left">
            <th style="padding:6px 0">Sample Offering</th>
            <th style="padding:6px">Batch / Lot</th>
            <th style="padding:6px">Expiration</th>
            <th style="padding:6px;text-align:right">Disbursed Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${sampleLog.transfers.map((item, idx) => `
            <tr style="border-bottom:1px solid var(--line-soft)">
              <td style="padding:8px 0">
                <b>${esc(item.name)}</b>
                <span class="muted" style="display:block;font-size:10px">${esc(item.id)}</span>
              </td>
              <td style="padding:8px 6px">
                <span class="badge" style="font-family:monospace;font-size:10px">${esc(item.lot)}</span>
              </td>
              <td style="padding:8px 6px;color:var(--ink-secondary)">${esc(item.expiry)}</td>
              <td style="padding:8px 0;text-align:right">
                <div style="display:inline-flex;align-items:center;gap:4px">
                  <button class="btn secondary sm" data-act="adjust-sample-qty" data-idx="${idx}" data-delta="-1" style="min-height:44px;min-width:44px;font-size:12px">-</button>
                  <b style="min-width:24px;text-align:center">${item.qty}</b>
                  <button class="btn secondary sm" data-act="adjust-sample-qty" data-idx="${idx}" data-delta="1" style="min-height:44px;min-width:44px;font-size:12px">+</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Practitioner Signature Pad & Legal Acknowledgement -->
    <div class="card tight" style="border:1px solid var(--line);border-radius:6px;padding:12px;margin-bottom:14px;background:var(--surface)">
      <h3 style="font-size:13px;font-weight:700;margin:0 0 4px 0;display:flex;align-items:center;gap:6px">
        ${icon('check', 14)} Digital Recipient Receipt and Signature
      </h3>
      <p class="small muted" style="margin:0 0 10px 0;font-size:11px">
        I acknowledge receipt of the stated professional sample packages for complimentary distribution to individuals under professional care in accordance with applicable medical regulations.
      </p>

      <div style="border:2px dashed var(--line);border-radius:6px;padding:16px;text-align:center;background:var(--surface-subtle);margin-bottom:8px">
        ${sampleLog.isSubmitted ? `
          <div style="color:var(--good,#10b981);font-weight:700;font-size:13px">
            ${icon('check', 16)} Signed electronically by ${esc(sampleLog.contactName)}
          </div>
          <small class="muted" style="font-size:10px">Cryptographic Hash: SHA256-4b92f7... Recorded at ${esc(sampleLog.signedAt || new Date().toISOString())}</small>
        ` : `
          <div style="font-style:italic;color:var(--ink-secondary);margin-bottom:8px">Sign on glass:</div>
          <button class="btn primary sm" data-act="sign-sample-receipt" style="min-height:44px;min-width:44px;padding:8px 16px;font-size:12px">
            ${icon('note', 14)} Capture Electronic Signature
          </button>
        `}
      </div>
    </div>

    <!-- Actions Bar -->
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;padding-top:8px;border-top:1px solid var(--line)">
      <button class="btn secondary" data-act="export-sample-manifest" style="min-height:44px;min-width:44px;font-size:12px">
        ${icon('note', 14)} Export Sample Manifest (CSV)
      </button>
      <button class="btn primary" data-act="finalize-sample-custody" style="min-height:44px;min-width:44px;font-size:12px">
        ${icon('check', 14)} Commit Custody Log
      </button>
    </div>
  </section>`;
}

export const actions = {
  'adjust-sample-qty': ({ app, data }) => {
    app.sampleCustodyState = app.sampleCustodyState || {
      contactName: 'Dr. Jane Morgan, MD', licenseNumber: 'MED-REG-847291', licenseStatus: 'Verified Active', maxAllowance: 4,
      transfers: [{ id: 'SMP-101', name: 'CardioGuard Starter Pack 10mg', lot: 'LOT-992-B4', expiry: '2028-06-30', qty: 2 }, { id: 'SMP-102', name: 'GlycoControl Starter Kit 500mg', lot: 'LOT-881-A2', expiry: '2027-12-31', qty: 1 }],
      isSubmitted: false,
    };
    const idx = Number(data.idx);
    const delta = Number(data.delta);
    if (app.sampleCustodyState.transfers[idx]) {
      const next = app.sampleCustodyState.transfers[idx].qty + delta;
      if (next >= 0 && next <= 10) app.sampleCustodyState.transfers[idx].qty = next;
    }
  },
  'sign-sample-receipt': ({ app }) => {
    app.sampleCustodyState = app.sampleCustodyState || {
      contactName: 'Dr. Jane Morgan, MD', licenseNumber: 'MED-REG-847291', licenseStatus: 'Verified Active', maxAllowance: 4,
      transfers: [{ id: 'SMP-101', name: 'CardioGuard Starter Pack 10mg', lot: 'LOT-992-B4', expiry: '2028-06-30', qty: 2 }, { id: 'SMP-102', name: 'GlycoControl Starter Kit 500mg', lot: 'LOT-881-A2', expiry: '2027-12-31', qty: 1 }],
      isSubmitted: false,
    };
    app.sampleCustodyState.isSubmitted = true;
    app.sampleCustodyState.signedBy = app.sampleCustodyState.contactName;
    app.sampleCustodyState.signedAt = new Date().toISOString();
  },
  'finalize-sample-custody': ({ app }) => {
    if (app.sampleCustodyState) app.sampleCustodyState.isSubmitted = true;
  },
  'export-sample-manifest': ({ app }) => {
    const state = app.sampleCustodyState || { transfers: [] };
    const csv = 'SampleId,Name,Lot,Expiry,Qty\n' +
      (state.transfers || []).map((t) => `"${t.id}","${t.name}","${t.lot}","${t.expiry}",${t.qty}`).join('\n');
    if (typeof window !== 'undefined' && window.Blob) {
      const blob = new Blob([csv], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `sample-manifest-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
    }
    return false;
  },
};

export const render = renderSampleCustody;
