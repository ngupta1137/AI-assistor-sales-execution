// ==============================================================================
// MULTI-TERRITORY DISTRICT MANAGER ROLLUP & REBALANCING SIMULATOR
// ==============================================================================
// For District Sales Managers, Commercial Operations, and Regional Directors.
// Enables cross-territory workload balancing, coverage health monitoring,
// and automated account redistribution during representative absence.
// ==============================================================================

import { esc, icon, pill } from '../ui.js';

export function renderDistrictRollupModal(app, ctx) {
  if (!app.ui?.districtModalOpen) return '';

  const reps = ctx?.data?.reps || [
    { id: 'rep-1', name: 'Jordan Taylor' },
    { id: 'rep-2', name: 'Morgan Lee' },
    { id: 'rep-3', name: 'Casey Rivera' },
    { id: 'rep-4', name: 'Riley Chen' },
  ];

  const state = (app.ui.districtState ||= {
    absentRepId: null,
    rebalanced: false,
  });

  const baseTerritories = [
    { id: 'T-1', repId: reps[0]?.id || 'rep-1', name: reps[0]?.name || 'Territory 1', accounts: 28, tierA: 8, visitsWeek: 35 },
    { id: 'T-2', repId: reps[1]?.id || 'rep-2', name: reps[1]?.name || 'Territory 2', accounts: 30, tierA: 9, visitsWeek: 38 },
    { id: 'T-3', repId: reps[2]?.id || 'rep-3', name: reps[2]?.name || 'Territory 3', accounts: 26, tierA: 7, visitsWeek: 32 },
    { id: 'T-4', repId: reps[3]?.id || 'rep-4', name: reps[3]?.name || 'Territory 4', accounts: 29, tierA: 8, visitsWeek: 36 },
  ];

  const territories = baseTerritories.map((t) => {
    const isAbsent = state.absentRepId === t.repId;
    if (isAbsent) {
      return { ...t, status: 'On Leave', accounts: 0, tierA: 0, visitsWeek: 0 };
    }
    if (state.rebalanced && state.absentRepId) {
      // Reallocate accounts from absent rep to remaining active reps
      return {
        ...t,
        status: 'Active · Rebalanced',
        accounts: t.accounts + 10,
        tierA: t.tierA + 3,
        visitsWeek: t.visitsWeek + 6,
      };
    }
    return { ...t, status: 'Active Normal' };
  });

  return `
  <div class="scrim" role="dialog" aria-modal="true" aria-labelledby="district-title" style="display:flex;align-items:center;justify-content:center;z-index:9000;background:rgba(0,0,0,0.65);position:fixed;inset:0;padding:12px;overflow-y:auto">
    <section class="card" style="width:100%;max-width:680px;max-height:92vh;display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:16px;box-shadow:0 20px 40px rgba(0,0,0,0.3);position:relative">
      
      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid var(--line);padding-bottom:10px">
        <div>
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:10px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;color:var(--accent-ink)">Commercial Operations</span>
            ${pill('Multi-Territory District', 'info')}
          </div>
          <b id="district-title" style="font-size:14px;color:var(--ink)">District Rollup &amp; Territory Rebalancer:</b>
        </div>
        <button class="icon-btn sm" data-act="close-district-modal" aria-label="Close District View">${icon('x', 18)}</button>
      </div>

      <!-- District Summary Metrics -->
      <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(110px,1fr));margin-bottom:12px">
        <div><small>Territories</small><b>4 Sectors</b></div>
        <div><small>Assigned Accounts</small><b>113 Total</b></div>
        <div><small>Tier-A Accounts</small><b class="good-text">32 Key</b></div>
        <div><small>Weekly Capacity</small><b>141 Calls</b></div>
      </div>

      <!-- Territory Comparison Table -->
      <div style="flex:1;overflow-y:auto;padding-right:4px;margin-bottom:12px">
        <table class="table" style="width:100%;font-size:11px;border-collapse:collapse">
          <thead>
            <tr style="background:var(--surface-subtle);text-align:left;border-bottom:1px solid var(--line)">
              <th style="padding:6px 8px">Territory &amp; Representative</th>
              <th style="padding:6px 8px">Assigned</th>
              <th style="padding:6px 8px">Tier-A</th>
              <th style="padding:6px 8px">Weekly Visits</th>
              <th style="padding:6px 8px">Status</th>
              <th style="padding:6px 8px">Action</th>
            </tr>
          </thead>
          <tbody>
            ${territories.map((t) => `
              <tr style="border-bottom:1px solid var(--line-soft)">
                <td style="padding:6px 8px"><b>${esc(t.name)}</b> <span class="small muted">(${esc(t.id)})</span></td>
                <td style="padding:6px 8px">${esc(String(t.accounts))}</td>
                <td style="padding:6px 8px"><span class="good-text" style="font-weight:600">${esc(String(t.tierA))}</span></td>
                <td style="padding:6px 8px">${esc(String(t.visitsWeek))}</td>
                <td style="padding:6px 8px">${pill(t.status, t.status.includes('Active') ? 'good' : 'warn')}</td>
                <td style="padding:6px 8px">
                  <button class="btn secondary sm" data-act="toggle-rep-absence" data-rep="${esc(t.repId)}" style="font-size:10px;min-height:24px;padding:2px 6px">
                    ${state.absentRepId === t.repId ? 'Restore' : 'Mark Leave'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Rebalance Controls Banner -->
      <div style="padding:10px 12px;background:var(--surface-subtle);border:1px solid var(--line);border-radius:6px;margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <div>
            <b style="font-size:11px;color:var(--ink)">Automated Capacity Rebalancer:</b>
            <span class="small muted" style="display:block;font-size:10px">
              ${state.absentRepId
                ? 'Absence detected. Algorithm redistributes priority accounts to nearest available representatives.'
                : 'All representatives active. Workload variance within acceptable 8% operational threshold.'}
            </span>
          </div>
          ${state.absentRepId ? `
            <button class="btn primary sm" data-act="apply-district-rebalance" style="font-size:11px;min-height:30px">
              ${icon('sync', 14)} ${state.rebalanced ? 'Rebalancing Active' : 'Run Smart Redistribution'}
            </button>` : ''}
        </div>
      </div>

      <!-- Footer Buttons -->
      <div style="display:flex;justify-content:flex-end;gap:8px">
        <button class="btn secondary" data-act="close-district-modal" style="min-height:32px">Close</button>
      </div>

      ${app.ui?.districtToast ? `<div class="notice good" style="margin-top:8px">${icon('check', 14)}<span>${esc(app.ui.districtToast)}</span></div>` : ''}
    </section>
  </div>`;
}

export const districtRollupActions = {
  'open-district-modal': ({ app }) => {
    (app.ui ||= {}).districtModalOpen = true;
    app.presenterOpen = false;
  },
  'close-district-modal': ({ app }) => {
    if (app.ui) app.ui.districtModalOpen = false;
  },
  'toggle-rep-absence': ({ app, data, ctx }) => {
    const state = (app.ui.districtState ||= {});
    if (state.absentRepId === data.rep) {
      state.absentRepId = null;
      state.rebalanced = false;
      (app.ui ||= {}).districtToast = 'Representative marked active. District workload normalized.';
    } else {
      state.absentRepId = data.rep;
      state.rebalanced = false;
      (app.ui ||= {}).districtToast = 'Representative marked on leave. Rebalancing recommendation available.';
    }
    if (ctx?.m?.logAudit) {
      ctx.m.logAudit('District Operations', `Representative availability toggled for ${data.rep}`);
    }
  },
  'apply-district-rebalance': ({ app, ctx }) => {
    const state = (app.ui.districtState ||= {});
    state.rebalanced = true;
    (app.ui ||= {}).districtToast = 'Priority accounts redistributed to adjacent territories based on driving distance.';
    if (ctx?.m?.logAudit) {
      ctx.m.logAudit('District Operations', 'Automated territory rebalancing applied');
    }
  },
};
