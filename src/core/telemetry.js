import { rolePanel } from './role-panel.js';
// Enterprise Integration & System Telemetry modal.
// Bi-Directional CRM & ERP Gateway Simulator, Payload Inspection, Conflict Resolution, Offline Durability & Identity.

import { esc, icon, pill, initials } from './ui.js';
import { PERSONA_INFO, personasFor, personFor } from './personas.js';

export function renderSyncModal(app, ctx) {
  if (!app.ui || !app.ui.syncModalOpen) return '';
  const lastSync = app.ui.lastSyncTime || '4 minutes ago';
  const syncSuccess = app.ui.syncJustRan;
  const tab = app.ui.gwTab || 'connectors';
  const connector = app.ui.gwConnector || 'salesforce';

  // Sample payload models keyed by active connector and scenario
  const getPayloads = () => {
    const city = ctx ? ctx.data.city.name : 'Chicago';
    const repName = ctx ? ctx.data.rep.name : 'Field Sales Rep';
    const acc = ctx && ctx.data.planned[0] ? ctx.data.byId[ctx.data.planned[0].accountId] : null;
    const accName = acc ? acc.name : 'Sample Account';
    const accId = acc ? acc.id : 'ACC-01';

    const inbound = {
      source: connector === 'salesforce' ? 'Salesforce Consumer Goods Cloud (REST v58.0)'
        : connector === 'veeva' ? 'Veeva CRM / Vault Life Sciences (v24.1)'
        : connector === 'dynamics' ? 'Microsoft Dynamics 365 Sales (Dataverse OData v9.2)'
        : 'SAP S/4HANA Enterprise ERP (OData v4 BAPI)',
      endpoint: '/api/v2/master/delta?since=2026-11-22T08:00:00Z',
      status: '200 OK',
      timestamp: new Date().toISOString(),
      deltaRecords: [
        {
          id: accId,
          name: accName,
          city,
          creditLimit: 15000,
          currentBalance: 8420,
          tier: acc ? acc.tier : 'A',
          agreementStatus: 'Active',
          inventoryReservations: [
            { lineId: 'L-101', name: 'Core Line Pack', atpQuantity: 140, status: 'Allocated' },
            { lineId: 'L-102', name: 'Secondary Unit', atpQuantity: 85, status: 'In Stock' }
          ]
        }
      ]
    };

    const outbound = {
      target: connector === 'sap' ? 'SAP S/4HANA Sales Order Gateway (BAPI_SALESORDER_CREATEFROMDAT2)'
        : connector === 'veeva' ? 'Veeva Call Activity & Sample Drop Ingestion'
        : 'CRM Field Activity Webhook (POST /api/v2/orders/batch)',
      status: '201 Created',
      idempotencyKey: `IDEMP-${Date.now()}-8821`,
      dispatchedBy: repName,
      dispatchTimestamp: new Date().toISOString(),
      payload: {
        accountId: accId,
        accountName: accName,
        totalEstimatedValue: ctx ? ctx.m.order(accId)?.total || 1420 : 1420,
        submissionMode: app.offline ? 'Offline Outbox (AES-256)' : 'Online REST',
        gpsCoordinates: { lat: acc?.geo?.lat ?? 41.8781, lng: acc?.geo?.lng ?? -87.6298 },
        auditReceiptHash: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        orderLinesCount: ctx ? ctx.m.order(accId)?.lines?.length || 3 : 3
      }
    };

    return { inbound, outbound };
  };

  const { inbound, outbound } = getPayloads();

  return `
  <div class="presenter-backdrop" data-act="close-sync-modal" aria-hidden="true"></div>
  <section class="as-sheet enterprise-modal" role="dialog" aria-modal="true" aria-labelledby="sync-title" style="height:auto;max-height:88%;overflow-y:auto;z-index:90">
    <header class="as-head" style="align-items:center">
      <div>
        <h2 id="sync-title" style="display:flex;align-items:center;gap:8px">
          ${icon('sync', 20)} Profile and integrations
        </h2>
        <small>Bi-directional CRM &amp; ERP synchronization with deterministic conflict resolution</small>
      </div>
      <button class="icon-btn" data-act="close-sync-modal" aria-label="Close integration status">${icon('x', 20)}</button>
    </header>

    <div style="padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)">
      ${(() => {
        const user = ctx ? personFor(ctx, ctx.persona) : null;
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
              ${pill(`${PERSONA_INFO[ctx.persona].label} view`, 'good')}
            </div>
            <div class="seg-ctl" role="tablist" style="margin-top:4px;flex-wrap:wrap">
              ${personasFor(ctx.industry).map((p) => `<button class="seg ${ctx.persona === p ? 'on' : ''}" data-act="switch-persona" data-persona="${p}" role="tab" aria-selected="${ctx.persona === p}" style="min-height:var(--tap)">${esc(PERSONA_INFO[p].label)}</button>`).join('')}
            </div>
          </div>
        </section>
        ${rolePanel(ctx)}`;
      })()}

      ${syncSuccess ? `<div class="notice good" role="status">${icon('check', 18)}<span>Simulated sync completed. Sample price books, account balances and inventory refreshed.</span></div>` : ''}

      <!-- Simulator Navigation Tabs -->
      <div class="seg-ctl" role="tablist" style="margin:0;overflow-x:auto">
        <button class="seg ${tab === 'connectors' ? 'on' : ''}" data-act="set-gw-tab" data-tab="connectors" role="tab" style="min-height:var(--tap)">
          1. Connectors &amp; Payloads
        </button>
        <button class="seg ${tab === 'conflicts' ? 'on' : ''}" data-act="set-gw-tab" data-tab="conflicts" role="tab" style="min-height:var(--tap)">
          2. Conflict Console
        </button>
        <button class="seg ${tab === 'offline' ? 'on' : ''}" data-act="set-gw-tab" data-tab="offline" role="tab" style="min-height:var(--tap)">
          3. Offline Durability
        </button>
        <button class="seg ${tab === 'security' ? 'on' : ''}" data-act="set-gw-tab" data-tab="security" role="tab" style="min-height:var(--tap)">
          4. Identity &amp; RBAC
        </button>
      </div>

      <!-- Tab 1: Connectors & Payload Inspection -->
      ${tab === 'connectors' ? `
        <section class="card" style="margin:0">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px">
            <b>Active Enterprise Gateway Connector:</b>
            <span class="pill info sm">OData / REST v2</span>
          </div>

          <div class="seg-ctl" role="group" aria-label="Connector selector" style="margin-bottom:12px;flex-wrap:wrap">
            <button class="seg ${connector === 'salesforce' ? 'on' : ''}" data-act="set-gw-connector" data-conn="salesforce" style="min-height:var(--tap);flex:1;font-size:11px">
              Salesforce CGC
            </button>
            <button class="seg ${connector === 'veeva' ? 'on' : ''}" data-act="set-gw-connector" data-conn="veeva" style="min-height:var(--tap);flex:1;font-size:11px">
              Veeva Vault CRM
            </button>
            <button class="seg ${connector === 'dynamics' ? 'on' : ''}" data-act="set-gw-connector" data-conn="dynamics" style="min-height:var(--tap);flex:1;font-size:11px">
              Microsoft Dynamics
            </button>
            <button class="seg ${connector === 'sap' ? 'on' : ''}" data-act="set-gw-connector" data-conn="sap" style="min-height:var(--tap);flex:1;font-size:11px">
              SAP S/4HANA ERP
            </button>
          </div>

          <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr));margin-bottom:12px">
            <div><small>Protocol</small><b>mTLS 1.3</b></div>
            <div><small>Roundtrip</small><b class="good-text">142 ms p95</b></div>
            <div><small>Dropped queue</small><b>0 packets</b></div>
            <div><small>Sync status</small><b class="good-text">Healthy (99.99%)</b></div>
          </div>

          <!-- Payload Inspector Viewers -->
          <div style="display:flex;flex-direction:column;gap:10px">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                <small style="font-weight:600">Inbound Master Data Feed (Cloud &rarr; Field Edge):</small>
                <button class="btn secondary sm" data-act="test-gw-inbound" style="font-size:11px;min-height:28px">
                  ${icon('sync', 12)} Test Inbound Delta
                </button>
              </div>
              <pre style="background:var(--surface-inset,#0f172a);color:#e2e8f0;padding:8px 10px;border-radius:4px;font-size:10px;line-height:1.4;overflow-x:auto;max-height:140px;margin:0;border:1px solid var(--line)">${esc(JSON.stringify(inbound, null, 2))}</pre>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                <small style="font-weight:600">Outbound Transaction Webhook (Field Edge &rarr; Cloud):</small>
                <button class="btn secondary sm" data-act="test-gw-outbound" style="font-size:11px;min-height:28px">
                  ${icon('check', 12)} Test Order Webhook
                </button>
              </div>
              <pre style="background:var(--surface-inset,#0f172a);color:#e2e8f0;padding:8px 10px;border-radius:4px;font-size:10px;line-height:1.4;overflow-x:auto;max-height:140px;margin:0;border:1px solid var(--line)">${esc(JSON.stringify(outbound, null, 2))}</pre>
            </div>
          </div>

          ${app.ui?.gwToast ? `<div class="notice good" style="margin-top:10px">${icon('check', 14)}<span>${esc(app.ui.gwToast)}</span></div>` : ''}
        </section>
      ` : ''}

      <!-- Tab 2: Visual Conflict Resolution Console -->
      ${tab === 'conflicts' ? `
        <section class="card" style="margin:0">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <b>Visual Field-Level Conflict Resolution Console</b>
            ${app.ui?.conflictResolved ? pill('Resolved', 'good') : pill('1 Active collision', 'warn')}
          </div>
          <p class="small muted" style="margin-bottom:10px">
            Field-level reconciliation for concurrent updates between offline field decisions and cloud ERP master tables.
          </p>

          ${app.ui?.conflictResolved ? `
            <div class="notice good" style="margin-bottom:10px">
              ${icon('check', 16)}<span>Agreement #AG-8821 reconciled using ${app.ui?.conflictStrategy === 'cloud' ? 'Cloud Master Authority' : app.ui?.conflictStrategy === 'rep' ? 'Field Rep Override' : 'Last-Write-Wins'} policy. Reconciled in ERP gateway.</span>
            </div>
          ` : `
            <div style="overflow-x:auto;margin-bottom:10px">
              <table style="width:100%;border-collapse:collapse;font-size:11px;min-width:380px">
                <thead>
                  <tr style="border-bottom:2px solid var(--line);text-align:left">
                    <th style="padding:6px">Field Name</th>
                    <th style="padding:6px;background:var(--info-bg)">Local Device (Offline Queue)</th>
                    <th style="padding:6px;background:var(--good-bg)">Cloud Master (SAP S/4HANA)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom:1px solid var(--line-soft)">
                    <td style="padding:6px"><b>Agreed Discount %</b></td>
                    <td style="padding:6px;color:var(--info)">12% Partner Preferred</td>
                    <td style="padding:6px;color:var(--good)">10% Standard Policy</td>
                  </tr>
                  <tr style="border-bottom:1px solid var(--line-soft)">
                    <td style="padding:6px"><b>Payment Terms</b></td>
                    <td style="padding:6px;color:var(--info)">Net 45 Days (Rep Request)</td>
                    <td style="padding:6px;color:var(--good)">Net 30 Days (Credit Limit)</td>
                  </tr>
                  <tr style="border-bottom:1px solid var(--line-soft)">
                    <td style="padding:6px"><b>Credit Limit Threshold</b></td>
                    <td style="padding:6px;color:var(--info)">$1,800 Temporary Waiver</td>
                    <td style="padding:6px;color:var(--good)">$1,500 Hard Ceiling</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="margin-bottom:10px">
              <small class="muted" style="font-weight:600;display:block;margin-bottom:4px">Deterministic resolution strategy:</small>
              <div class="seg-ctl" role="group" aria-label="Resolution strategy">
                <button class="seg ${(app.ui?.conflictStrategy || 'lww') === 'lww' ? 'on' : ''}" data-act="set-conflict-strat" data-strat="lww" style="min-height:var(--tap);flex:1;font-size:11px">Last-write-wins</button>
                <button class="seg ${app.ui?.conflictStrategy === 'cloud' ? 'on' : ''}" data-act="set-conflict-strat" data-strat="cloud" style="min-height:var(--tap);flex:1;font-size:11px">Cloud master</button>
                <button class="seg ${app.ui?.conflictStrategy === 'rep' ? 'on' : ''}" data-act="set-conflict-strat" data-strat="rep" style="min-height:var(--tap);flex:1;font-size:11px">Rep override</button>
              </div>
            </div>

            <button class="btn good sm" data-act="resolve-conflict" style="min-height:var(--tap);width:100%">
              ${icon('check', 14)} Reconcile conflict and commit to ERP
            </button>
          `}
        </section>
      ` : ''}

      <!-- Tab 3: Offline Durability & Outbox -->
      ${tab === 'offline' ? `
        <section class="card" style="margin:0">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <b>Offline Durability &amp; Outbox Engine</b>
            ${app.offline ? pill('Offline: Queued', 'warn') : pill('Encrypted: Synced', 'info')}
          </div>
          <p class="small muted" style="margin-bottom:8px">
            Field-ready offline persistence. Transactions are held in an AES-256 encrypted local cache and automatically reconcile when connectivity returns.
          </p>
          <div class="facts" style="margin-bottom:10px">
            <div><small>Pending outbox</small><b>${(app.offlineQueue || []).length} transactions</b></div>
            <div><small>Local storage</small><b>IndexedDB AES-256</b></div>
            <div><small>Durability</small><b class="good-text">Persisted</b></div>
          </div>
          <button class="btn secondary sm" data-act="toggle-offline" style="min-height:var(--tap);width:100%">
            ${app.offline ? 'Restore network connectivity & flush outbox' : 'Simulate offline field mode'}
          </button>
        </section>
      ` : ''}

      <!-- Tab 4: Identity & RBAC -->
      ${tab === 'security' ? `
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
      ` : ''}

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
  'set-gw-tab': ({ app, data }) => {
    (app.ui ||= {}).gwTab = data.tab;
  },
  'set-gw-connector': ({ app, data, ctx }) => {
    const ui = app.ui ||= {};
    ui.gwConnector = data.conn;
    const name = data.conn === 'salesforce' ? 'Salesforce CGC'
      : data.conn === 'veeva' ? 'Veeva Vault CRM'
      : data.conn === 'dynamics' ? 'Microsoft Dynamics 365'
      : 'SAP S/4HANA ERP';
    ui.gwToast = `Switched gateway adapter to ${name}. Protocol: OAuth 2.0 / OData v4.`;
    if (ctx?.m?.logAudit) {
      ctx.m.logAudit('Gateway Adapter', `Switched active connector to ${name}`);
    }
  },
  'test-gw-inbound': ({ app, ctx }) => {
    const ui = app.ui ||= {};
    ui.gwToast = 'Inbound delta received (200 OK): 1 account price tier & 2 inventory ATP reservations updated.';
    if (ctx?.m?.logAudit) {
      ctx.m.logAudit('Gateway Inbound', 'Received master data delta from ERP gateway (200 OK)');
    }
  },
  'test-gw-outbound': ({ app, ctx }) => {
    const ui = app.ui ||= {};
    ui.gwToast = 'Outbound webhook dispatched (201 Created): Order batch idempotency verified.';
    if (ctx?.m?.logAudit) {
      ctx.m.logAudit('Gateway Outbound', 'Dispatched field order webhook to ERP gateway (201 Created)');
    }
  },

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
