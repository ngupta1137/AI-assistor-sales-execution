// ==============================================================================
// ENTERPRISE CRM & ERP CONNECTOR HUB & SCHEMA MAPPER
// ==============================================================================
// Bi-directional schema mapping for Tier-1 Enterprise CRM, Regulated Life Sciences
// CRM, and Enterprise ERP. Provides field mapping matrices, payload generation,
// and exportable JSON representations for IT procurement evaluation.
// ==============================================================================

import { esc, icon, pill } from '../ui.js';

export const CRM_SCHEMAS = {
  field_crm: {
    id: 'field_crm',
    title: 'Standard Enterprise CRM (sObject Architecture)',
    protocol: 'REST / Bulk API 2.0',
    description: 'Bi-directional synchronization with standard enterprise customer relationship platforms.',
    mappings: [
      { source: '{account}.id', target: 'Account.External_Id__c', type: 'String (64)', direction: 'Bidirectional' },
      { source: '{account}.name', target: 'Account.Name', type: 'String (255)', direction: 'Inbound' },
      { source: '{account}.tier', target: 'Account.Customer_Tier__c', type: 'Picklist (A/B/C)', direction: 'Bidirectional' },
      { source: '{visit}.start', target: 'Event.StartDateTime', type: 'DateTime', direction: 'Bidirectional' },
      { source: '{visit}.duration', target: 'Event.DurationInMinutes', type: 'Integer', direction: 'Outbound' },
      { source: 'action.status', target: 'Task.Status', type: 'Picklist (Completed/Deferred)', direction: 'Outbound' },
      { source: 'action.evidence', target: 'ContentVersion.VersionData', type: 'Base64 Attachment', direction: 'Outbound' },
      { source: '{order}.total', target: 'Order.TotalAmount', type: 'Currency', direction: 'Outbound' },
      { source: '{order}.lines', target: 'OrderItem.Records', type: 'Line Item Array', direction: 'Outbound' },
    ],
    generatePayload: (ctx, account) => ({
      attributes: { type: 'Account', referenceId: account?.id || 'ACC-001' },
      External_Id__c: account?.id || 'ACC-001',
      Name: account?.name || 'Commercial Account',
      BillingStreet: account?.address || '100 Business Parkway',
      BillingCity: account?.city || 'Chicago',
      Customer_Tier__c: account?.tier || 'A',
      Annual_Potential__c: account?.annualValue || 120000,
      CurrencyIsoCode: ctx?.country?.currency || 'USD',
      Last_AI_Visit_Summary__c: {
        timestamp: new Date().toISOString(),
        outcome: 'Visit executed with approved replenishment order',
        actions_completed: 3,
        governance_status: 'Compliant',
      },
      Associated_Orders__r: {
        records: [
          {
            attributes: { type: 'Order' },
            Status: 'Draft',
            EffectiveDate: new Date().toISOString().slice(0, 10),
            Order_Channel__c: ctx?.app?.config?.channel || 'Modern',
            TotalAmount: 3450.0,
          },
        ],
      },
    }),
  },

  regulated_crm: {
    id: 'regulated_crm',
    title: 'Regulated Life-Sciences CRM (Call & Compliance Schema)',
    protocol: 'Validated Cloud API v3',
    description: 'Designed for strictly audited healthcare prescribers, institutions, and sample logging.',
    mappings: [
      { source: '{account}.id', target: 'Account.Id', type: 'String (18)', direction: 'Inbound' },
      { source: '{contact}.name', target: 'Call2_vod__c.Account_vod__c', type: 'Lookup (Contact/Account)', direction: 'Bidirectional' },
      { source: '{visit}.outcomes', target: 'Call2_vod__c.Status_vod__c', type: 'Picklist (Submitted)', direction: 'Outbound' },
      { source: 'action.discussion', target: 'Call2_Key_Message_vod__c.Key_Message_vod__c', type: 'Approved Monograph', direction: 'Outbound' },
      { source: 'evidence.signature', target: 'Call2_vod__c.Signature_Date_vod__c', type: 'Biometric DateTime', direction: 'Outbound' },
      { source: 'sample.allocation', target: 'Sample_Drop_vod__c.Quantity_vod__c', type: 'Integer (Capped)', direction: 'Outbound' },
    ],
    generatePayload: (ctx, account) => ({
      Call2_vod__c: {
        Account_vod__c: account?.name || 'Regional Healthcare Facility',
        Call_Date_vod__c: new Date().toISOString().slice(0, 10),
        Call_Type_vod__c: 'Detailing with In-Service Discussion',
        Status_vod__c: 'Submitted',
        Regulatory_Affirmation__c: true,
        Signature_Date_vod__c: new Date().toISOString(),
        Key_Messages_vod__r: [
          { Key_Message_vod__c: 'Approved Product Portfolio Monograph Rev 4.2', Reaction_vod__c: 'Positive' },
        ],
        Sample_Drops_vod__r: [
          { Sample_vod__c: 'Evaluation Unit Lot #2026-B', Quantity_vod__c: 2, Lot_vod__c: 'LOT-9821' },
        ],
      },
    }),
  },

  enterprise_erp: {
    id: 'enterprise_erp',
    title: 'Tier-1 Enterprise ERP (OData / BAPI Sales Order Schema)',
    protocol: 'OData v4 / RFC / IDoc',
    description: 'Direct transaction dispatch to centralized enterprise supply chain and billing engines.',
    mappings: [
      { source: '{account}.erpId', target: 'SoldToParty', type: 'Char (10)', direction: 'Bidirectional' },
      { source: '{order}.poNumber', target: 'PurchaseOrderByCustomer', type: 'Char (35)', direction: 'Outbound' },
      { source: '{order}.channel', target: 'DistributionChannel', type: 'Char (2)', direction: 'Outbound' },
      { source: '{order}.lines.id', target: 'to_Item.Material', type: 'Char (18)', direction: 'Outbound' },
      { source: '{order}.lines.qty', target: 'to_Item.RequestedQuantity', type: 'Decimal (13,3)', direction: 'Outbound' },
      { source: 'credit.status', target: 'CreditManagementAccount.CreditLimit', type: 'Currency', direction: 'Inbound' },
    ],
    generatePayload: (ctx, account) => ({
      d: {
        SalesOrderType: 'OR',
        SalesOrganization: '1000',
        DistributionChannel: ctx?.app?.config?.channel === 'traditional' ? '20' : '10',
        OrganizationDivision: '00',
        SoldToParty: '0001092841',
        PurchaseOrderByCustomer: `PO-${Date.now().toString().slice(-6)}`,
        CustomerPaymentTerms: 'NT30',
        to_Item: {
          results: [
            { ItemPosition: '10', Material: 'MAT-80219', RequestedQuantity: '24', RequestedQuantityUnit: 'EA' },
            { ItemPosition: '20', Material: 'MAT-91823', RequestedQuantity: '12', RequestedQuantityUnit: 'EA' },
          ],
        },
      },
    }),
  },
};

/**
 * Renders the interactive Enterprise CRM & ERP Connector Hub modal card.
 */
export function renderConnectorHub(app, ctx) {
  const currentKey = app.ui?.crmConnectorKey || 'field_crm';
  const schema = CRM_SCHEMAS[currentKey] || CRM_SCHEMAS.field_crm;
  const accounts = ctx?.data?.accounts || [];
  const selectedAccount = accounts[0] || { id: 'ACC-001', name: 'Metro Commercial Center', city: 'Metropolis', tier: 'A' };
  const mockPayload = schema.generatePayload(ctx, selectedAccount);

  return `
  <section class="card tight" style="margin:10px 0;background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:12px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px">
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-weight:700;font-size:12px;color:var(--ink)">Enterprise CRM &amp; ERP Schema Hub:</span>
        ${pill(schema.protocol, 'info')}
      </div>
      <button class="btn secondary sm" data-act="download-crm-payload" style="font-size:11px;min-height:28px">
        ${icon('note', 12)} Download Schema Payload (JSON)
      </button>
    </div>

    <p class="small muted" style="margin:0 0 10px 0;font-size:11px;line-height:1.4">
      Inspect live field transformations connecting AI Assistor execution signals directly into core enterprise systems.
    </p>

    <!-- Schema Type Tabs -->
    <div class="seg-ctl" role="group" aria-label="Target Enterprise Architecture" style="margin-bottom:10px;flex-wrap:wrap">
      ${Object.values(CRM_SCHEMAS).map((s) => `
        <button class="seg ${s.id === currentKey ? 'on' : ''}" data-act="select-crm-schema" data-key="${s.id}" style="min-height:var(--tap);flex:1;font-size:11px">
          ${esc(s.id === 'field_crm' ? 'Standard CRM' : s.id === 'regulated_crm' ? 'Regulated CRM' : 'Enterprise ERP')}
        </button>
      `).join('')}
    </div>

    <!-- Field Mapping Table -->
    <div style="margin-bottom:12px;overflow-x:auto">
      <table class="table" style="width:100%;font-size:11px;border-collapse:collapse">
        <thead>
          <tr style="background:var(--surface-subtle);text-align:left;border-bottom:1px solid var(--line)">
            <th style="padding:6px 8px">AI Assistor Field</th>
            <th style="padding:6px 8px">Enterprise Target Field</th>
            <th style="padding:6px 8px">Data Type</th>
            <th style="padding:6px 8px">Sync Flow</th>
          </tr>
        </thead>
        <tbody>
          ${schema.mappings.map((m) => `
            <tr style="border-bottom:1px solid var(--line-soft)">
              <td style="padding:5px 8px;font-family:monospace;font-weight:600;color:var(--accent-ink)">${esc(ctx ? ctx.t(m.source) : m.source)}</td>
              <td style="padding:5px 8px;font-family:monospace">${esc(m.target)}</td>
              <td style="padding:5px 8px;color:var(--ink-muted)">${esc(m.type)}</td>
              <td style="padding:5px 8px">${pill(m.direction, m.direction === 'Bidirectional' ? 'good' : 'muted')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Live Generated Payload Preview -->
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <small style="font-weight:700;color:var(--ink)">Generated Wire Payload (${esc(schema.title)}):</small>
        <span class="small muted" style="font-size:10px">RFC 8259 Standard Validated</span>
      </div>
      <pre style="background:var(--surface-inset,#0f172a);color:#e2e8f0;padding:8px 10px;border-radius:4px;font-size:10px;line-height:1.4;overflow-x:auto;max-height:160px;margin:0;border:1px solid var(--line)">${esc(JSON.stringify(mockPayload, null, 2))}</pre>
    </div>

    ${app.ui?.crmToast ? `<div class="notice good" style="margin-top:8px">${icon('check', 14)}<span>${esc(app.ui.crmToast)}</span></div>` : ''}
  </section>`;
}

export const crmConnectorActions = {
  'select-crm-schema': ({ app, data }) => {
    (app.ui ||= {}).crmConnectorKey = data.key;
  },
  'download-crm-payload': ({ app, ctx }) => {
    const key = app.ui?.crmConnectorKey || 'field_crm';
    const schema = CRM_SCHEMAS[key] || CRM_SCHEMAS.field_crm;
    const account = ctx?.data?.accounts?.[0] || { id: 'ACC-001', name: 'Sample Enterprise Account' };
    const payload = schema.generatePayload(ctx, account);
    const jsonStr = JSON.stringify(payload, null, 2);

    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `enterprise-connector-${key}-schema.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    (app.ui ||= {}).crmToast = `Exported ${schema.title} JSON wire payload.`;
    if (ctx?.m?.logAudit) {
      ctx.m.logAudit('Enterprise Connector', `Exported wire payload for ${schema.title}`);
    }
  },
};
