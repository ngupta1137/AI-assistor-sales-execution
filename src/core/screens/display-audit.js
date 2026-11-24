// Merchandising Display & Planogram Audit Simulator.
// Simulates computer vision / image recognition audits on primary merchandising fixtures.
// Analyzes facings, out-of-stock gaps, competitor presence, and compliance scores.
// Sample data concept. Does not make external AI vision API calls.

import { icon, pill } from '../ui.js';

export function renderDisplayAudit(ctx) {
  const { app, data, text: t, esc } = ctx;
  const auditState = app.displayAuditState || {
    fixtureName: 'Primary Ambient Endcap Fixture',
    targetFacings: 10,
    detectedFacings: 8,
    outOfStockCount: 2,
    competitorFacings: 4,
    complianceScore: 80,
    items: [
      { name: 'Core Flagship Line 500ml', target: 4, detected: 4, status: 'Compliant', color: 'var(--good,#10b981)' },
      { name: 'Premium Reserve Line 330ml', target: 3, detected: 3, status: 'Compliant', color: 'var(--good,#10b981)' },
      { name: 'New Seasonal Variant 250ml', target: 3, detected: 1, status: 'Gap Detected', color: 'var(--warn-ink,#b45309)' },
      { name: 'Competitor Alternate Pack', target: 0, detected: 4, status: 'Competitor Share', color: 'var(--accent-ink,#2563eb)' },
    ],
    remediated: false,
  };

  const totalFixtureFacings = auditState.detectedFacings + auditState.competitorFacings;
  const shareOfDisplay = Math.round((auditState.detectedFacings / totalFixtureFacings) * 100);

  return `
  <section class="card" data-screen="display-audit">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <div>
        <div style="display:flex;align-items:center;gap:6px">
          <a href="#/brief" class="btn text sm" style="min-height:44px;min-width:44px;padding:6px 8px;display:inline-flex;align-items:center">
            ${icon('chevronLeft', 16)} Back to Brief
          </a>
          <h2 style="margin:0;font-size:16px;font-weight:700">Display and Planogram Vision Audit</h2>
        </div>
        <p class="small muted" style="margin:4px 0 0 0">
          Automated visual recognition for fixture compliance, share of display, and out-of-stock gap detection.
        </p>
      </div>
      <div style="display:flex;align-items:center;gap:6px">
        ${pill(`Compliance: ${auditState.complianceScore}%`, auditState.complianceScore >= 80 ? 'good' : 'warn')}
        ${pill(`Share of Display: ${shareOfDisplay}%`, 'info')}
      </div>
    </div>

    <!-- Visual Fixture Inspection Simulator Canvas -->
    <div class="card tight" style="border:1px solid var(--line);border-radius:6px;padding:12px;margin-bottom:14px;background:var(--surface)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span style="font-size:12px;font-weight:700">${esc(auditState.fixtureName)}</span>
        <button class="btn secondary sm" data-act="resimulate-vision-audit" style="min-height:44px;min-width:44px;font-size:11px;padding:6px 12px">
          ${icon('sync', 12)} Re-scan Display Fixture
        </button>
      </div>

      <!-- Schematic Fixture Grid with Bounding Recognition Boxes -->
      <div style="border:2px dashed var(--line);border-radius:6px;background:var(--surface-subtle);padding:14px 10px;margin-bottom:10px">
        <div style="display:grid;grid-template-columns:repeat(6, 1fr);gap:6px;min-height:90px;align-items:end">
          <!-- Tier 1: Compliant Flagship Facings -->
          <div style="background:rgba(16,185,129,0.15);border:2px solid var(--good,#10b981);border-radius:4px;height:70px;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:2px">
            <span style="font-size:9px;font-weight:700;color:var(--good,#10b981)">FLAGSHIP</span>
            <small style="font-size:8px">Facing 1</small>
          </div>
          <div style="background:rgba(16,185,129,0.15);border:2px solid var(--good,#10b981);border-radius:4px;height:70px;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:2px">
            <span style="font-size:9px;font-weight:700;color:var(--good,#10b981)">FLAGSHIP</span>
            <small style="font-size:8px">Facing 2</small>
          </div>
          <div style="background:rgba(16,185,129,0.15);border:2px solid var(--good,#10b981);border-radius:4px;height:70px;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:2px">
            <span style="font-size:9px;font-weight:700;color:var(--good,#10b981)">PREMIUM</span>
            <small style="font-size:8px">Facing 3</small>
          </div>
          <div style="background:rgba(16,185,129,0.15);border:2px solid var(--good,#10b981);border-radius:4px;height:70px;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:2px">
            <span style="font-size:9px;font-weight:700;color:var(--good,#10b981)">PREMIUM</span>
            <small style="font-size:8px">Facing 4</small>
          </div>
          <!-- Gap Detected Box -->
          <div style="background:rgba(239,68,68,0.12);border:2px dashed var(--bad,#ef4444);border-radius:4px;height:70px;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:2px">
            <span style="font-size:9px;font-weight:700;color:var(--bad,#ef4444)">GAP</span>
            <small style="font-size:8px;color:var(--bad,#ef4444)">Empty (0)</small>
          </div>
          <!-- Competitor Facing Box -->
          <div style="background:rgba(59,130,246,0.12);border:2px solid var(--accent-ink,#2563eb);border-radius:4px;height:70px;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:2px">
            <span style="font-size:9px;font-weight:700;color:var(--accent-ink,#2563eb)">RIVAL</span>
            <small style="font-size:8px">Competitor</small>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:10px;color:var(--ink-secondary)">
          <span>&larr; Eye-Level Merchandising Row &rarr;</span>
          <span style="color:var(--bad,#ef4444);font-weight:600">2 Gaps Detected</span>
        </div>
      </div>

      <!-- Facings Breakdown Table -->
      <table style="width:100%;font-size:11px;border-collapse:collapse;line-height:1.6">
        <thead>
          <tr style="border-bottom:1px solid var(--line);color:var(--ink-secondary);text-align:left">
            <th style="padding:4px 0">Merchandised Item</th>
            <th style="padding:4px;text-align:center">Planogram Target</th>
            <th style="padding:4px;text-align:center">Vision Detected</th>
            <th style="padding:4px;text-align:right">Audit Status</th>
          </tr>
        </thead>
        <tbody>
          ${auditState.items.map((it) => `
            <tr style="border-bottom:1px solid var(--line-soft)">
              <td style="padding:6px 0;font-weight:600">${esc(it.name)}</td>
              <td style="padding:6px;text-align:center">${it.target} facings</td>
              <td style="padding:6px;text-align:center"><b>${it.detected}</b> facings</td>
              <td style="padding:6px;text-align:right">
                <span class="badge" style="color:${it.color};font-weight:700;font-size:10px">${esc(it.status)}</span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Remediation Workflow -->
    <div class="card tight" style="border:1px solid var(--line);border-radius:6px;padding:12px;margin-bottom:14px;background:var(--surface)">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div>
          <b style="font-size:12px;display:block">Automated Replenishment Trigger:</b>
          <p class="small muted" style="margin:2px 0 0 0;font-size:11px">
            Transfer detected fixture voids directly into the visit order proposal to prevent revenue loss.
          </p>
        </div>
        <button class="btn ${auditState.remediated ? 'secondary' : 'primary'}" data-act="remediate-display-gaps" style="min-height:44px;min-width:44px;font-size:12px;padding:6px 14px">
          ${icon('box', 14)} ${auditState.remediated ? 'Gap Order Transferred' : 'Add Missing Lines to Order'}
        </button>
      </div>
    </div>

    <!-- Actions Bar -->
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;padding-top:8px;border-top:1px solid var(--line)">
      <button class="btn secondary" data-act="export-display-audit" style="min-height:44px;min-width:44px;font-size:12px">
        ${icon('note', 14)} Export Vision Audit JSON
      </button>
      <a href="#/order" class="btn primary" style="min-height:44px;min-width:44px;font-size:12px;display:inline-flex;align-items:center;padding:6px 14px">
        ${icon('check', 14)} Proceed to Order Proposal
      </a>
    </div>
  </section>`;
}

export const actions = {
  'resimulate-vision-audit': ({ app }) => {
    app.displayAuditState = {
      fixtureName: 'Primary Ambient Endcap Fixture',
      targetFacings: 10,
      detectedFacings: 9,
      outOfStockCount: 1,
      competitorFacings: 3,
      complianceScore: 90,
      items: [
        { name: 'Core Flagship Line 500ml', target: 4, detected: 4, status: 'Compliant', color: 'var(--good,#10b981)' },
        { name: 'Premium Reserve Line 330ml', target: 3, detected: 3, status: 'Compliant', color: 'var(--good,#10b981)' },
        { name: 'New Seasonal Variant 250ml', target: 3, detected: 2, status: 'Partial Facing', color: 'var(--accent-ink,#2563eb)' },
        { name: 'Competitor Alternate Pack', target: 0, detected: 3, status: 'Competitor Share', color: 'var(--accent-ink,#2563eb)' },
      ],
      remediated: false,
    };
  },
  'remediate-display-gaps': ({ app }) => {
    app.displayAuditState = app.displayAuditState || { remediated: false };
    app.displayAuditState.remediated = true;
  },
  'export-display-audit': ({ app }) => {
    const data = app.displayAuditState || {};
    if (typeof window !== 'undefined' && window.Blob) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `display-audit-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    }
    return false;
  },
};

export const render = renderDisplayAudit;
