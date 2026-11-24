import { rolePanel } from './role-panel.js';
// Enterprise Integration & System Telemetry modal.
// Bi-Directional CRM & ERP Gateway Simulator, Payload Inspection, Conflict Resolution, Offline Durability & Identity.

import { esc, icon, pill, initials } from './ui.js';
import { PERSONA_INFO, personasFor, personFor } from './personas.js';
import { getDataProvider, setDataProvider, CustomerDataProvider, SyntheticDataProvider, RemoteApiDataProvider } from './data/data-provider.js';
import { getTenantManager } from './tenant/tenant-config.js';
import { getSession } from './state.js';
import { renderConnectorHub, crmConnectorActions } from './connectors/crm-erp.js';

export const SAMPLE_POC_CLIENT = {
  tenantId: 'client-poc-01',
  clientName: 'Apex Commercial Group',
  rep: { id: 'rep-101', name: 'Taylor Jordan', target: 85000 },
  accounts: [
    {
      id: 'ACC-001',
      name: 'Apex Central Complex',
      segment: 'enterprise',
      tier: 'A',
      key: true,
      geo: { lat: 41.8781, lng: -87.6298 },
      address: '100 South Michigan Ave',
      city: 'Chicago',
      annualValue: 240000,
      hours: [510, 1080],
      contacts: [{ name: 'Sarah Connor', role: 'Executive Lead', lead: true }],
    },
    {
      id: 'ACC-002',
      name: 'Beacon Regional Facility',
      segment: 'regional',
      tier: 'B',
      key: false,
      geo: { lat: 41.8819, lng: -87.6324 },
      address: '220 West Wacker Dr',
      city: 'Chicago',
      annualValue: 120000,
      hours: [540, 1020],
      contacts: [{ name: 'David Evans', role: 'Director', lead: true }],
    },
    {
      id: 'ACC-003',
      name: 'Crestview Care Group',
      segment: 'independent',
      tier: 'A',
      key: false,
      geo: { lat: 41.8902, lng: -87.6256 },
      address: '500 North Michigan Ave',
      city: 'Chicago',
      annualValue: 185000,
      hours: [480, 1020],
      contacts: [{ name: 'Elena Ramos', role: 'Purchasing Lead', lead: true }],
    },
    {
      id: 'ACC-004',
      name: 'Downtown Commercial Associates',
      segment: 'independent',
      tier: 'C',
      key: false,
      geo: { lat: 41.8835, lng: -87.6401 },
      address: '600 West Adams St',
      city: 'Chicago',
      annualValue: 60000,
      hours: [540, 960],
      contacts: [{ name: 'James Miller', role: 'Office Manager', lead: true }],
    },
  ],
  offerings: [
    { id: 'OFF-100', name: 'CardioStat Extended Release', price: 120, unit: 'box', status: 'core', category: 'Therapeutics' },
    { id: 'OFF-101', name: 'CardioStat Rapid Release', price: 95, unit: 'box', status: 'core', category: 'Therapeutics' },
    { id: 'OFF-102', name: 'EndoShield Pro Infusion', price: 450, unit: 'vial', status: 'focus', category: 'Advanced Care' },
    { id: 'OFF-103', name: 'Vascuflow Anti-inflammatory', price: 75, unit: 'pack', status: 'new', category: 'Specialty' },
  ],
};

export function renderSyncModal(app, ctx) {
  if (!app.ui || !app.ui.syncModalOpen) return '';
  const lastSync = app.ui.lastSyncTime || '4 minutes ago';
  const syncSuccess = app.ui.syncJustRan;
  const tab = app.ui.gwTab || 'connectors';
  const connector = app.ui.gwConnector || 'fieldcrm';

  // Sample payload models keyed by active connector and scenario
  const getPayloads = () => {
    const city = ctx ? ctx.data.city.name : 'Chicago';
    const repName = ctx ? ctx.data.rep.name : 'Field Sales Rep';
    const acc = ctx && ctx.data.planned[0] ? ctx.data.byId[ctx.data.planned[0].accountId] : null;
    const accName = acc ? acc.name : 'Sample Account';
    const accId = acc ? acc.id : 'ACC-01';

    const inbound = {
      source: connector === 'fieldcrm' ? 'Field CRM (REST)'
        : connector === 'lscrm' ? 'Life-sciences CRM (REST)'
        : connector === 'bizcrm' ? 'Business CRM (OData)'
        : 'ERP (OData)',
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
      target: connector === 'erp' ? 'ERP sales order API'
        : connector === 'lscrm' ? 'Life-sciences CRM call activity API'
        : 'CRM Field Activity Webhook (POST /api/v2/orders/batch)',
      status: '201 Created',
      idempotencyKey: `IDEMP-${Date.now()}-8821`,
      dispatchedBy: repName,
      dispatchTimestamp: new Date().toISOString(),
      payload: {
        accountId: accId,
        accountName: accName,
        totalEstimatedValue: ctx && accId ? ctx.m.orderLines(accId).reduce((t, l) => t + (l.total || 0), 0) : 0,
        submissionMode: app.offline ? 'Offline Outbox (AES-256)' : 'Online REST',
        gpsCoordinates: { lat: acc?.geo?.lat ?? 41.8781, lng: acc?.geo?.lng ?? -87.6298 },
        auditReceiptHash: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        orderLinesCount: ctx && accId ? ctx.m.orderLines(accId).length : 0
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
        <button class="seg ${tab === 'poc' ? 'on' : ''}" data-act="set-gw-tab" data-tab="poc" role="tab" style="min-height:var(--tap)">
          5. Client PoC &amp; Export
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
            <button class="seg ${connector === 'fieldcrm' ? 'on' : ''}" data-act="set-gw-connector" data-conn="fieldcrm" style="min-height:var(--tap);flex:1;font-size:11px">
              Field CRM
            </button>
            <button class="seg ${connector === 'lscrm' ? 'on' : ''}" data-act="set-gw-connector" data-conn="lscrm" style="min-height:var(--tap);flex:1;font-size:11px">
              Life-sciences CRM
            </button>
            <button class="seg ${connector === 'bizcrm' ? 'on' : ''}" data-act="set-gw-connector" data-conn="bizcrm" style="min-height:var(--tap);flex:1;font-size:11px">
              Business CRM
            </button>
            <button class="seg ${connector === 'erp' ? 'on' : ''}" data-act="set-gw-connector" data-conn="erp" style="min-height:var(--tap);flex:1;font-size:11px">
              ERP
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
                <button class="btn secondary sm" data-act="test-gw-inbound" style="font-size:11px;min-height:44px;min-width:44px;padding:6px 12px">
                  ${icon('sync', 12)} Test Inbound Delta
                </button>
              </div>
              <pre style="background:var(--surface-inset,#0f172a);color:#e2e8f0;padding:8px 10px;border-radius:4px;font-size:10px;line-height:1.4;overflow-x:auto;max-height:140px;margin:0;border:1px solid var(--line)">${esc(JSON.stringify(inbound, null, 2))}</pre>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                <small style="font-weight:600">Outbound Transaction Webhook (Field Edge &rarr; Cloud):</small>
                <button class="btn secondary sm" data-act="test-gw-outbound" style="font-size:11px;min-height:44px;min-width:44px;padding:6px 12px">
                  ${icon('check', 12)} Test Order Webhook
                </button>
              </div>
              <pre style="background:var(--surface-inset,#0f172a);color:#e2e8f0;padding:8px 10px;border-radius:4px;font-size:10px;line-height:1.4;overflow-x:auto;max-height:140px;margin:0;border:1px solid var(--line)">${esc(JSON.stringify(outbound, null, 2))}</pre>
            </div>
          </div>

          <!-- Live Real-Time External Webhook Dispatcher -->
          <div style="margin-top:10px;padding:8px 10px;background:var(--surface-subtle);border:1px solid var(--line);border-radius:6px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <b style="font-size:11px">Live External Webhook Dispatcher:</b>
              ${app.ui?.webhookStatus ? pill(app.ui.webhookStatus, app.ui.webhookOk ? 'good' : 'warn') : pill('Ready', 'info')}
            </div>
            <p class="small muted" style="margin:0 0 6px 0;font-size:10px">
              Dispatch real-time HTTP POST webhooks to any external HTTPS URL (e.g. Webhook.site, Zapier, or customer staging).
            </p>
            <div style="display:flex;gap:4px;margin-bottom:6px">
              <input type="url" id="live-webhook-url" class="input" style="flex:1;font-size:11px;padding:4px 6px;min-height:44px" placeholder="https://webhook.site/your-unique-endpoint" value="${esc(app.ui?.webhookUrl || '')}" data-change="set-webhook-url">
              <button class="btn primary sm" data-act="dispatch-live-webhook" style="min-height:44px;min-width:44px;font-size:11px;padding:6px 12px">
                ${icon('sync', 12)} Send Live Webhook
              </button>
            </div>
            ${app.ui?.webhookLog ? `
              <div style="font-size:10px;font-family:monospace;padding:4px 6px;background:var(--surface-inset);border-radius:4px;border:1px solid var(--line-soft);color:var(--ink)">
                ${esc(app.ui.webhookLog)}
              </div>` : ''}
          </div>

          <!-- Enterprise CRM & ERP Schema Mapper Hub -->
          ${renderConnectorHub(app, ctx)}

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
                    <th style="padding:6px;background:var(--good-bg)">Cloud master (ERP)</th>
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
          <button class="btn primary sm" data-act="open-security-console" style="min-height:var(--tap);width:100%;margin-top:6px">${icon('shield', 14)} Open Enterprise Security &amp; Legal Console</button>
          ${app.ui?.ssoToast ? `<div class="notice good" style="margin-top:8px">${icon('check', 14)}<span>${esc(app.ui.ssoToast)}</span></div>` : ''}
        </section>
      ` : ''}

      <!-- Tab 5: Client PoC & Export -->
      ${tab === 'poc' ? `
        <section class="card" style="margin:0">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <b>Client PoC Onboarding &amp; Pilot Exporter</b>
            ${ctx?.data?.isPoCActive ? pill('Client PoC Active', 'good') : pill('Synthetic Demo', 'muted')}
          </div>
          <p class="small muted" style="margin-bottom:8px">
            Configure client-specific datasets and export complete decision audit logs for pilot evaluation.
          </p>

          <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr));margin-bottom:10px">
            <div><small>Data Provider</small><b>${ctx?.data?.isRemoteActive ? 'Cloud API' : ctx?.data?.isPoCActive ? 'Customer' : 'Synthetic'}</b></div>
            <div><small>Storage Layer</small><b class="good-text">Persistent</b></div>
            <div><small>Logged Decisions</small><b>${Object.keys(getSession(ctx?.data?.seedKey || '').decisions || {}).length} records</b></div>
          </div>

          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px">
            <button class="btn primary sm" data-act="open-csv-mapper" style="min-height:var(--tap);width:100%">
              ${icon('sync', 14)} Launch Visual CSV Column Mapper
            </button>
            <button class="btn secondary sm" data-act="load-sample-poc-data" style="min-height:var(--tap);width:100%">
              ${icon('sync', 14)} Load Sample Client PoC Dataset
            </button>
            <button class="btn secondary sm" data-act="connect-remote-api" style="min-height:var(--tap);width:100%">
              ${icon('sync', 14)} Connect Enterprise Cloud API (/api/v1)
            </button>
            <button class="btn secondary sm" data-act="revert-synthetic-data" style="min-height:var(--tap);width:100%">
              ${icon('config', 14)} Revert to Synthetic Demonstration Data
            </button>
          </div>

          <div style="border-top:1px solid var(--line-soft);padding-top:10px;margin-top:6px">
            <b style="font-size:12px;display:block;margin-bottom:4px">Pilot Audit &amp; Activity Export:</b>
            <div class="btn-row" style="gap:6px">
              <button class="btn secondary sm" data-act="download-poc-decisions-csv" style="min-height:var(--tap);flex:1;font-size:11px">
                ${icon('note', 14)} Export Decisions CSV
              </button>
              <button class="btn secondary sm" data-act="download-poc-full-json" style="min-height:var(--tap);flex:1;font-size:11px">
                ${icon('note', 14)} Export Full Session JSON
              </button>
            </div>
          </div>
          ${app.ui?.pocToast ? `<div class="notice good" style="margin-top:8px">${icon('check', 14)}<span>${esc(app.ui.pocToast)}</span></div>` : ''}
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

export function exportPocDecisionsCsv(ctx) {
  if (!ctx || !ctx.m) return;
  const s = getSession(ctx.data.seedKey);
  const decisions = s.decisions || {};
  const headers = ['Action_ID', 'Account_ID', 'Account_Name', 'Status', 'Choice_or_Reason', 'Note', 'Timestamp_Minutes'];
  const rows = Object.entries(decisions).map(([id, d]) => {
    let accName = 'Unknown';
    let accId = 'Unknown';
    for (const p of ctx.data.planned || []) {
      const it = (p.brief || []).find((b) => b.id === id);
      if (it) {
        accId = it.accountId;
        accName = ctx.data.byId[it.accountId]?.name || it.accountId;
        break;
      }
    }
    return [
      id,
      accId,
      `"${String(accName).replace(/"/g, '""')}"`,
      d.status,
      `"${String(d.choice || d.reason || '').replace(/"/g, '""')}"`,
      `"${String(d.note || '').replace(/"/g, '""')}"`,
      d.at,
    ];
  });
  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `poc-field-decisions-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportPocFullJson(ctx) {
  if (!ctx || !ctx.data) return;
  const s = getSession(ctx.data.seedKey);
  const payload = {
    exportedAt: new Date().toISOString(),
    seedKey: ctx.data.seedKey,
    industry: ctx.industry.id,
    country: ctx.country.id,
    rep: ctx.data.rep,
    sessionState: s,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `poc-session-full-${ctx.data.seedKey}-${new Date().toISOString().slice(0, 10)}.json`);
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
    const name = data.conn === 'fieldcrm' ? 'Field CRM'
      : data.conn === 'lscrm' ? 'Life-sciences CRM'
      : data.conn === 'bizcrm' ? 'Business CRM'
      : 'ERP';
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
  'set-webhook-url': ({ app, value }) => {
    (app.ui ||= {}).webhookUrl = value.trim();
  },
  'dispatch-live-webhook': async ({ app, ctx }) => {
    const inputEl = document.getElementById('live-webhook-url');
    const url = (inputEl ? inputEl.value : app.ui?.webhookUrl) || 'https://httpbin.org/post';
    app.ui ||= {};
    app.ui.webhookUrl = url;
    const payload = {
      event: 'order.created',
      timestamp: new Date().toISOString(),
      tenantId: ctx?.tenantId || 'acme-global',
      industry: ctx?.industry?.id || 'cpg',
      country: ctx?.country?.id || 'US',
      samplePayload: true,
      data: {
        orderId: `ORD-${Date.now().toString().slice(-6)}`,
        total: 3750,
        currency: ctx?.country?.currency || 'USD',
        rep: ctx?.data?.rep?.name || 'Field Representative',
      },
    };
    try {
      const t0 = Date.now();
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const t1 = Date.now();
      const latency = Math.round(t1 - t0);
      app.ui.webhookOk = res.ok;
      app.ui.webhookStatus = `${res.status} ${res.statusText || 'OK'} (${latency} ms)`;
      app.ui.webhookLog = `HTTP ${res.status} in ${latency}ms -> ${url}`;
      app.ui.gwToast = `Live webhook successfully delivered (${res.status} OK in ${latency}ms).`;
      if (ctx?.m?.logAudit) {
        ctx.m.logAudit('Live Integration', `Dispatched live HTTP webhook to ${url} (status: ${res.status})`);
      }
    } catch (err) {
      app.ui.webhookOk = false;
      app.ui.webhookStatus = 'Connection Error';
      app.ui.webhookLog = `Error dispatching to ${url}: ${err.message}`;
      app.ui.gwToast = `Webhook dispatch failed: ${err.message}`;
    }
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
  'load-sample-poc-data': ({ app, ctx }) => {
    setDataProvider(new CustomerDataProvider(SAMPLE_POC_CLIENT));
    const tm = getTenantManager();
    tm.registerTenant({
      tenantId: SAMPLE_POC_CLIENT.tenantId,
      name: SAMPLE_POC_CLIENT.clientName,
    });
    tm.setTenant(SAMPLE_POC_CLIENT.tenantId);
    if (app.cache) app.cache.clear();
    app.ui.pocToast = 'Client PoC dataset loaded with 4 accounts and 4 offerings. Session persisted.';
    if (ctx?.m?.logAudit) {
      ctx.m.logAudit('PoC Ingestion', 'Loaded client PoC customer dataset with local storage persistence.');
    }
  },
  'connect-remote-api': ({ app, ctx }) => {
    const provider = new RemoteApiDataProvider('/api/v1', { tenantId: 'tenant-acme-global' });
    setDataProvider(provider);
    if (app.cache) app.cache.clear();
    app.ui.pocToast = 'Connected to Enterprise Cloud API endpoint (/api/v1).';
    if (ctx?.m?.logAudit) {
      ctx.m.logAudit('Cloud Integration', 'Switched data provider to Enterprise Remote API mode (/api/v1).');
    }
  },
  'revert-synthetic-data': ({ app, ctx }) => {
    setDataProvider(new SyntheticDataProvider());
    const tm = getTenantManager();
    tm.setTenant('standard');
    if (app.cache) app.cache.clear();
    app.ui.pocToast = 'Reverted to synthetic demonstration data.';
    if (ctx?.m?.logAudit) {
      ctx.m.logAudit('PoC Ingestion', 'Reverted data provider to synthetic demonstration mode.');
    }
  },
  'download-poc-decisions-csv': ({ ctx }) => {
    exportPocDecisionsCsv(ctx);
  },
  'download-poc-full-json': ({ ctx }) => {
    exportPocFullJson(ctx);
  },
  ...crmConnectorActions,
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
