// Enterprise Integration & System Telemetry modal.
// Displays CRM, ERP, Offline Engine, Security & SSO status, and allows downloading the compliance audit log.

import { esc, icon, pill, initials } from './ui.js';

export function renderSyncModal(app, ctx) {
  if (!app.ui || !app.ui.syncModalOpen) return '';
  const lastSync = app.ui.lastSyncTime || '4 minutes ago';
  const syncSuccess = app.ui.syncJustRan;

  return `
  <div class="presenter-backdrop" data-act="close-sync-modal" aria-hidden="true"></div>
  <section class="as-sheet enterprise-modal" role="dialog" aria-modal="true" aria-labelledby="sync-title" style="height:auto;max-height:88%;overflow-y:auto;z-index:90">
    <header class="as-head" style="align-items:center">
      <div>
        <h2 id="sync-title" style="display:flex;align-items:center;gap:8px">
          ${icon('sync', 20)} Enterprise Integration
        </h2>
        <small>Active session authenticated via Enterprise SAML 2.0 / SSO</small>
      </div>
      <button class="icon-btn" data-act="close-sync-modal" aria-label="Close integration status">${icon('x', 20)}</button>
    </header>

    <div style="padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)">
      ${(() => {
        const user = ctx ? (ctx.persona === 'rep' ? ctx.data.rep : ctx.persona === 'manager' ? ctx.data.manager : ctx.data.admin) : null;
        if (!user) return '';
        return `
        <section class="card" style="margin:0;background:var(--surface-subtle);border:1px solid var(--line)">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
            <div style="display:flex;align-items:center;gap:10px">
              <span class="avatar" style="width:38px;height:38px;font-size:15px">${esc(initials(user.name))}</span>
              <div>
                <b style="font-size:14px;display:block">${esc(user.name)}</b>
                <small class="muted">${esc(ctx.t(user.title))} · ${esc(ctx.data.city.name)}</small>
              </div>
            </div>
            <button class="btn secondary sm" data-act="logout-setup" style="min-height:var(--tap);font-size:12px">${icon('config', 14)} Log out</button>
          </div>
          
          <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--line-soft)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <small class="muted" style="font-weight:600">Switch demo persona:</small>
              ${pill(ctx.persona === 'rep' ? 'Field rep view' : ctx.persona === 'manager' ? 'Manager view' : 'Admin view', 'good')}
            </div>
            <div class="seg-ctl" role="tablist" style="margin-top:4px">
              <button class="seg ${ctx.persona === 'rep' ? 'on' : ''}" data-act="switch-persona" data-persona="rep" role="tab" aria-selected="${ctx.persona === 'rep'}" style="min-height:var(--tap)">
                Field Rep
              </button>
              <button class="seg ${ctx.persona === 'manager' ? 'on' : ''}" data-act="switch-persona" data-persona="manager" role="tab" aria-selected="${ctx.persona === 'manager'}" style="min-height:var(--tap)">
                Manager
              </button>
              <button class="seg ${ctx.persona === 'admin' ? 'on' : ''}" data-act="switch-persona" data-persona="admin" role="tab" aria-selected="${ctx.persona === 'admin'}" style="min-height:var(--tap)">
                Sales Ops
              </button>
            </div>
            <p class="small muted" style="margin-top:6px;font-size:11px">In production, roles are provisioned via enterprise SSO. For demonstrations, switch personas to view rep, manager, and administrative surfaces.</p>
          </div>
        </section>`;
      })()}
      ${syncSuccess ? `<div class="notice good" role="status">${icon('check', 18)}<span>Bi-directional sync completed. Price books, account balances and inventory updated.</span></div>` : ''}

      <section class="card" style="margin:0">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <b>CRM Integration Connector</b>
          ${pill('Active · Connected', 'good')}
        </div>
        <p class="small muted">Bi-directional synchronization of ${esc(ctx ? ctx.t('{Accounts}') : 'Accounts')}, ${esc(ctx ? ctx.t('{contacts}') : 'contacts')} and activity timelines via OAuth 2.0 REST API.</p>
        <div class="facts" style="margin-top:8px">
          <div><small>Status</small><b>Operational</b></div>
          <div><small>Last sync</small><b>${esc(lastSync)}</b></div>
          <div><small>Avg latency</small><b>142 ms</b></div>
        </div>
      </section>

      <section class="card" style="margin:0">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <b>ERP Order Gateway</b>
          ${pill('Active · Streaming', 'good')}
        </div>
        <p class="small muted">Real-time customer pricing agreements, tax calculations, credit limits and direct order dispatch via OData v4 webhooks.</p>
        <div class="facts" style="margin-top:8px">
          <div><small>Gateway</small><b>OData v4</b></div>
          <div><small>Dropped queue</small><b>0 packets</b></div>
          <div><small>Order dispatch</small><b>Immediate</b></div>
        </div>
      </section>

      <section class="card" style="margin:0">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <b>Offline Engine & Local Cache</b>
          ${app.offline ? pill('Offline: Queued', 'warn') : pill('Encrypted: Synced', 'info')}
        </div>
        <p class="small muted">Field-ready offline persistence. Transactions are stored in an AES-256 encrypted local cache and automatically reconcile when connectivity returns.</p>
        <div class="facts" style="margin-top:8px">
          <div><small>Pending queue</small><b>${(app.offlineQueue || []).length} transactions</b></div>
          <div><small>Local storage</small><b>AES-256</b></div>
        </div>
        <div style="margin-top:8px">
          <button class="btn secondary sm" data-act="toggle-offline" style="min-height:var(--tap);width:100%">${app.offline ? 'Restore network connectivity' : 'Simulate offline field mode'}</button>
          <button class="btn secondary sm" data-act="toggle-conflict-sim" style="min-height:var(--tap);width:100%;margin-top:6px">${app.ui?.conflictSimOpen ? 'Hide conflict resolution console' : 'Open sync conflict resolution console'}</button>
          ${app.ui?.conflictSimOpen ? `
          <div style="margin-top:10px;padding:10px;background:var(--surface-subtle);border:1px solid var(--line);border-radius:var(--radius-sm)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <small style="font-weight:600">Simulated synchronization conflict</small>
              ${app.ui?.conflictResolved ? pill('Resolved', 'good') : pill('1 Conflict detected', 'warn')}
            </div>
            ${app.ui?.conflictResolved ? `
              <p class="small good-text" style="margin-bottom:4px">${icon('check', 14)} Agreement #AG-8821 reconciled using Last-Write-Wins policy. Reconciled in ERP gateway.</p>
            ` : `
              <p class="small muted" style="margin-bottom:8px">Agreement #AG-8821 was modified concurrently on local device and cloud ERP.</p>
              <div style="display:flex;flex-direction:column;gap:6px;font-size:12px">
                <div style="padding:6px 8px;background:var(--info-bg);border-radius:4px;border:1px solid var(--line)">
                  <b>Local device (Offline Queue · 14:15):</b>
                  <div>Discount: 12% Partner Preferred · Term: Net 30</div>
                </div>
                <div style="padding:6px 8px;background:var(--good-bg);border-radius:4px;border:1px solid var(--line)">
                  <b>Cloud master (SAP S/4HANA · 14:18):</b>
                  <div>Discount: 10% Standard Volume · Term: Net 30</div>
                </div>
              </div>
              <div style="margin-top:8px">
                <small class="muted" style="font-weight:600;display:block;margin-bottom:4px">Deterministic resolution strategy:</small>
                <div class="seg-ctl" role="group" aria-label="Resolution strategy">
                  <button class="seg ${(app.ui?.conflictStrategy || 'lww') === 'lww' ? 'on' : ''}" data-act="set-conflict-strat" data-strat="lww" style="min-height:var(--tap);min-width:var(--tap)">Last-write-wins</button>
                  <button class="seg ${app.ui?.conflictStrategy === 'cloud' ? 'on' : ''}" data-act="set-conflict-strat" data-strat="cloud" style="min-height:var(--tap);min-width:var(--tap)">Cloud master</button>
                  <button class="seg ${app.ui?.conflictStrategy === 'rep' ? 'on' : ''}" data-act="set-conflict-strat" data-strat="rep" style="min-height:var(--tap);min-width:var(--tap)">Rep override</button>
                </div>
              </div>
              <button class="btn good sm" data-act="resolve-conflict" style="min-height:var(--tap);width:100%;margin-top:8px">${icon('check', 14)} Reconcile conflict and commit to ERP</button>
            `}
          </div>` : ''}
        </div>
      </section>

            <section class="card" style="margin:0">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <b>Enterprise Identity &amp; RBAC Governance</b>
          ${pill('MFA Verified', 'good')}
        </div>
        <div style="margin-bottom:8px">
          <small class="muted" style="font-weight:600;display:block;margin-bottom:4px">Identity Provider:</small>
          <div class="seg-ctl" role="group" aria-label="Identity Provider">
            <button class="seg ${(app.ui?.ssoProvider || 'entra') === 'entra' ? 'on' : ''}" data-act="set-sso-provider" data-provider="entra" style="min-height:var(--tap);min-width:var(--tap)">Microsoft Entra ID</button>
            <button class="seg ${app.ui?.ssoProvider === 'okta' ? 'on' : ''}" data-act="set-sso-provider" data-provider="okta" style="min-height:var(--tap);min-width:var(--tap)">Okta SAML 2.0</button>
            <button class="seg ${app.ui?.ssoProvider === 'ping' ? 'on' : ''}" data-act="set-sso-provider" data-provider="ping" style="min-height:var(--tap);min-width:var(--tap)">Ping Identity</button>
          </div>
        </div>
        <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr));margin-bottom:8px">
          <div><small>Token SHA</small><b>a9f2...84b1</b></div>
          <div><small>Assurance</small><b class="good-text">FIDO2 MFA</b></div>
          <div><small>Validity</small><b>7h 40m left</b></div>
        </div>
        <div style="font-size:11px;padding:6px 8px;background:var(--surface-subtle);border:1px solid var(--line-soft);border-radius:4px;margin-bottom:8px">
          <b>Active RBAC Grants (${ctx ? ctx.persona : 'rep'}):</b>
          <div class="muted">territory.read: ALL · order.create: AUTHORIZED · pricing.override: SUPERVISED</div>
        </div>
        <button class="btn secondary sm" data-act="rotate-sso-token" style="min-height:var(--tap);width:100%">${icon('shield', 14)} Rotate security token &amp; re-authenticate</button>
        ${app.ui?.ssoToast ? `<div class="notice good" style="margin-top:8px">${icon('check', 14)}<span>${esc(app.ui.ssoToast)}</span></div>` : ''}
      </section>

      <section class="card" style="margin:0">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <b>Security, Identity & Governance</b>
          ${pill('SOC 2 Verified', 'good')}
        </div>
        <ul class="bullets small" style="margin-top:4px">
          <li>Identity: Microsoft Entra ID / Okta SSO Authenticated (Token valid for 7h 40m).</li>
          <li>Transport: TLS 1.3 enforced across all API calls with zero plain-text transmissions.</li>
          <li>Compliance: SOC 2 Type II certified, GDPR and HIPAA compliant data retention.</li>
        </ul>
      </section>

      <div class="btn-row" style="margin-top:4px">
        <button class="btn primary" data-act="trigger-sync" style="flex:1">${icon('sync', 18)} Run live sync</button>
        <button class="btn secondary" data-act="download-audit-csv" style="flex:1">${icon('note', 18)} Export audit CSV</button>
      </div>
    </div>
  </section>`;
}

export function exportAuditCsv(ctx) {
  if (!ctx || !ctx.m) return;
  const auditEntries = ctx.m.audit ? ctx.m.audit() : [];
  const headers = ['Timestamp_Minutes', 'Actor', 'Event_Summary'];
  const rows = auditEntries.map((e) => [
    e.at,
    `"${String(e.actor || '').replace(/"/g, '""')}"`,
    `"${String(e.text || '').replace(/"/g, '""')}"`,
  ]);
  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `sales-execution-audit-log-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const syncActions = {
  'set-sso-provider': ({ app, data }) => {
    (app.ui ||= {}).ssoProvider = data.provider;
    app.ui.ssoToast = `Identity provider switched to ${data.provider === 'entra' ? 'Microsoft Entra ID' : data.provider === 'okta' ? 'Okta SAML 2.0' : 'Ping Identity'}.`;
  },
  'rotate-sso-token': ({ app }) => {
    (app.ui ||= {}).ssoToast = 'Enterprise session token rotated. Cryptographic SHA-256 signature renewed.';
  },

  'toggle-conflict-sim': ({ app }) => {
    (app.ui ||= {}).conflictSimOpen = !app.ui.conflictSimOpen;
  },
  'set-conflict-strat': ({ app, data }) => {
    (app.ui ||= {}).conflictStrategy = data.strat;
  },
  'resolve-conflict': ({ app, ctx }) => {
    (app.ui ||= {}).conflictResolved = true;
    app.ui.syncJustRan = true;
    app.ui.lastSyncTime = 'Just now';
    const stratName = app.ui.conflictStrategy === 'cloud' ? 'Cloud Master Authority' : app.ui.conflictStrategy === 'rep' ? 'Field Rep Override' : 'Last-Write-Wins';
    if (ctx?.m?.logAudit) {
      ctx.m.logAudit('Offline Engine', `Resolved synchronization conflict for Agreement #AG-8821 using ${stratName} policy. Reconciled in ERP gateway.`);
    }
  },

  'switch-persona': ({ app, data, api }) => {
    app.ui.syncModalOpen = false;
    api.configure({ persona: data.persona }, { home: true });
    return 'nav';
  },
  'logout-setup': ({ app, api }) => {
    app.ui.syncModalOpen = false;
    api.navigate('#/setup');
    return 'nav';
  },
  'open-sync-modal': ({ app }) => {
    app.ui.syncModalOpen = true;
    app.ui.syncJustRan = false;
  },
  'close-sync-modal': ({ app }) => {
    app.ui.syncModalOpen = false;
    app.ui.syncJustRan = false;
  },
  'trigger-sync': ({ app, ctx }) => {
    app.ui.syncJustRan = true;
    app.ui.lastSyncTime = 'Just now';
    if (ctx && ctx.m && ctx.m.logAudit) {
      ctx.m.logAudit('System Sync', 'Live bi-directional sync completed with CRM and ERP gateways');
    }
  },
  'download-audit-csv': ({ ctx }) => {
    exportAuditCsv(ctx);
  },
  'toggle-offline': ({ app, ctx }) => {
    app.offline = !app.offline;
    if (app.offline) {
      if (ctx?.m?.logAudit) ctx.m.logAudit('Offline Engine', 'Entered offline mode. Local AES-256 encrypted cache active.');
    } else {
      const count = (app.offlineQueue ||= []).length;
      app.offlineQueue = [];
      app.ui.syncJustRan = true;
      if (ctx?.m?.logAudit) ctx.m.logAudit('Offline Engine', `Restored network connectivity. Flushed ${count} transactions to CRM and ERP gateways.`);
    }
  },
};
