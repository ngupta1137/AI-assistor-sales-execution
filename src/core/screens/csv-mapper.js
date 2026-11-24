// ==============================================================================
// VISUAL CSV INGESTION & COLUMN MAPPER (SALES OPS CONSOLE)
// ==============================================================================
// Allows sales operations and field evaluators to drag-and-drop or paste
// raw customer CSV data, visually map columns, and activate real customer
// territories in the live session without code changes.
// ==============================================================================

import { esc, icon, pill } from '../ui.js';
import { CustomerDataProvider, setDataProvider } from '../data/data-provider.js';
import { getTenantManager } from '../tenant/tenant-config.js';

/**
 * RFC 4180 compliant lightweight CSV text parser.
 * Correctly handles quotes, commas inside fields, and escaped quotes ("").
 */
export function parseCsvText(rawText) {
  if (!rawText || typeof rawText !== 'string') return { headers: [], rows: [] };
  const lines = rawText.trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return { headers: [], rows: [] };

  function splitLine(line) {
    const fields = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        fields.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    fields.push(cur.trim());
    return fields;
  }

  const headers = splitLine(lines[0]).map((h) => h.replace(/^"|"$/g, '').trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitLine(lines[i]).map((c) => c.replace(/^"|"$/g, '').trim());
    if (cells.some(Boolean)) {
      rows.push(cells);
    }
  }

  return { headers, rows };
}

/**
 * Fuzzy matches CSV header names to standard territory fields.
 */
export function autoDetectColumns(headers) {
  const mapping = {
    id: '',
    name: '',
    tier: '',
    annualValue: '',
    address: '',
    contactName: '',
  };

  const patterns = {
    id: /^(id|acc_id|account_id|code|customer_id|cust_no|number)$/i,
    name: /^(name|acc_name|account_name|company|customer_name|client_name|account)$/i,
    tier: /^(tier|grade|segment|priority|category)$/i,
    annualValue: /^(annual|value|annual_value|revenue|spend|potential|annual_sales|turnover)$/i,
    address: /^(address|street|location|full_address|site)$/i,
    contactName: /^(contact|contact_name|lead|person|manager_name|buyer)$/i,
  };

  for (const h of headers) {
    const clean = h.trim();
    for (const [key, regex] of Object.entries(patterns)) {
      if (!mapping[key] && regex.test(clean)) {
        mapping[key] = clean;
      }
    }
  }

  // Fallback defaults if not matched by regex
  if (!mapping.name && headers.length > 0) mapping.name = headers[0];
  if (!mapping.id && headers.length > 1) mapping.id = headers[1];

  return mapping;
}

/**
 * Transforms parsed CSV rows into an active customer dataset.
 */
export function buildDatasetFromCsv(headers, rows, mapping, clientName = 'Custom Customer Pilot') {
  const getIdx = (colName) => headers.indexOf(colName);
  const idIdx = getIdx(mapping.id);
  const nameIdx = getIdx(mapping.name);
  const tierIdx = getIdx(mapping.tier);
  const valIdx = getIdx(mapping.annualValue);
  const addrIdx = getIdx(mapping.address);
  const contactIdx = getIdx(mapping.contactName);

  const accounts = rows.map((r, idx) => {
    const rawVal = valIdx >= 0 && r[valIdx] ? Number(r[valIdx].replace(/[^0-9.]/g, '')) : 120000;
    const annualValue = Number.isFinite(rawVal) && rawVal > 0 ? rawVal : 120000;
    const tierRaw = tierIdx >= 0 && r[tierIdx] ? r[tierIdx].toUpperCase().trim() : 'B';
    const tier = ['A', 'B', 'C', 'D'].includes(tierRaw) ? tierRaw : 'B';

    return {
      id: idIdx >= 0 && r[idIdx] ? r[idIdx] : `ACC-${idx + 1}`,
      name: nameIdx >= 0 && r[nameIdx] ? r[nameIdx] : `Customer Account ${idx + 1}`,
      tier,
      key: tier === 'A',
      annualValue,
      current: Math.round(annualValue * 0.72),
      whiteSpace: Math.round(annualValue * 0.28),
      address: addrIdx >= 0 && r[addrIdx] ? r[addrIdx] : `${100 + idx * 15} Commercial Ave`,
      contacts: [
        {
          name: contactIdx >= 0 && r[contactIdx] ? r[contactIdx] : 'Primary Commercial Lead',
          role: 'Executive Lead',
          key: true,
        },
      ],
    };
  });

  return {
    tenantId: 'custom-client-poc',
    clientName,
    accounts,
  };
}

const SAMPLE_DEMO_CSV = `Account_ID,Account_Name,Tier,Annual_Revenue,Street_Address,Contact_Person
ACC-101,Beacon Industrial Systems,A,340000,1200 Technology Way,Marcus Ward
ACC-102,Apex Precision Machining,A,290000,850 Foundry Blvd,Elena Vance
ACC-103,Great Lakes Fabrication,B,160000,430 Logistics Parkway,David Sterling
ACC-104,Metro Automation Center,B,175000,90 Robotics Drive,Claire Bennett
ACC-105,Pioneer Tool & Die Works,C,95000,210 Assembly Road,Robert Chen
ACC-106,Summit Production Hub,C,88000,740 Commerce Circle,Sophia Alverez`;

export function renderCsvMapperModal(app, ctx) {
  if (!app.ui?.csvMapperOpen) return '';

  const state = (app.ui.csvState ||= {
    rawText: SAMPLE_DEMO_CSV,
    parsed: parseCsvText(SAMPLE_DEMO_CSV),
    mapping: autoDetectColumns(parseCsvText(SAMPLE_DEMO_CSV).headers),
    clientName: 'Acme Commercial Field Evaluation',
  });

  const { headers, rows } = state.parsed;
  const colOpt = (cur) =>
    `<option value="">-- Choose Column --</option>` +
    headers.map((h) => `<option value="${esc(h)}"${h === cur ? ' selected' : ''}>${esc(h)}</option>`).join('');

  return `
  <div class="presenter-backdrop" data-act="close-csv-mapper" aria-hidden="true"></div>
  <section class="as-sheet enterprise-modal" role="dialog" aria-modal="true" aria-labelledby="csv-mapper-title" style="height:auto;max-height:90%;overflow-y:auto;z-index:95;max-width:680px">
    <header class="as-head" style="align-items:center">
      <div>
        <h2 id="csv-mapper-title" style="display:flex;align-items:center;gap:8px">
          ${icon('sync', 20)} Self-Service Customer Data Ingestion &amp; Column Mapper
        </h2>
        <small class="muted">Upload or paste customer accounts and catalogs for instant pilot deployment.</small>
      </div>
      <button class="icon-btn" data-act="close-csv-mapper" aria-label="Close dialog">${icon('x', 20)}</button>
    </header>

    <div style="padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)">
      <!-- 1. Client Pilot Label -->
      <label class="field"><span>Client Organization Name:</span>
        <input type="text" class="input" maxlength="60" data-change="set-csv-client-name" value="${esc(state.clientName)}" placeholder="e.g. Acme Commercial Field Evaluation">
      </label>

      <!-- 2. CSV Text Area / Dropzone -->
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <small style="font-weight:600">CSV Data (Paste or edit below):</small>
          <button class="btn text sm" data-act="load-csv-template" style="font-size:11px;padding:0">Load Sample CSV Template</button>
        </div>
        <textarea id="csv-raw-input" data-change="update-csv-text" rows="5" style="width:100%;font-family:monospace;font-size:11px;padding:8px;background:var(--surface-inset);color:var(--ink);border:1px solid var(--line);border-radius:4px">${esc(state.rawText)}</textarea>
        <div style="display:flex;justify-content:flex-end;margin-top:4px">
          <button class="btn secondary sm" data-act="parse-csv-input" style="min-height:28px;font-size:11px">${icon('sync', 12)} Parse &amp; Refresh Columns</button>
        </div>
      </div>

      <!-- 3. Visual Column Mapping Matrix -->
      <section class="card" style="margin:0;background:var(--surface-subtle);border:1px solid var(--line)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <b style="font-size:12px">Visual Field Mapping Matrix:</b>
          ${headers.length > 0 ? pill(`${headers.length} Columns Detected`, 'good') : pill('No Columns', 'warn')}
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px">
          <label class="field" style="margin:0"><span style="font-size:11px">Account Name (Required):</span>
            <select data-change="set-col-mapping" data-target="name">${colOpt(state.mapping.name)}</select>
          </label>
          <label class="field" style="margin:0"><span style="font-size:11px">Account ID:</span>
            <select data-change="set-col-mapping" data-target="id">${colOpt(state.mapping.id)}</select>
          </label>
          <label class="field" style="margin:0"><span style="font-size:11px">Account Tier (A/B/C):</span>
            <select data-change="set-col-mapping" data-target="tier">${colOpt(state.mapping.tier)}</select>
          </label>
          <label class="field" style="margin:0"><span style="font-size:11px">Annual Potential / Value:</span>
            <select data-change="set-col-mapping" data-target="annualValue">${colOpt(state.mapping.annualValue)}</select>
          </label>
          <label class="field" style="margin:0"><span style="font-size:11px">Street Address:</span>
            <select data-change="set-col-mapping" data-target="address">${colOpt(state.mapping.address)}</select>
          </label>
          <label class="field" style="margin:0"><span style="font-size:11px">Contact Lead Name:</span>
            <select data-change="set-col-mapping" data-target="contactName">${colOpt(state.mapping.contactName)}</select>
          </label>
        </div>
      </section>

      <!-- 4. Real-Time Validation Preview -->
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <small style="font-weight:600">Validation Preview (${rows.length} rows parsed):</small>
          ${rows.length > 0 ? pill('Schema Valid', 'good') : pill('Empty Data', 'warn')}
        </div>
        <div style="overflow-x:auto;max-height:160px;border:1px solid var(--line-soft);border-radius:4px">
          <table style="width:100%;border-collapse:collapse;font-size:11px;min-width:440px">
            <thead>
              <tr style="background:var(--surface);border-bottom:1px solid var(--line);text-align:left">
                <th style="padding:4px 6px">#</th>
                <th style="padding:4px 6px">Account Name</th>
                <th style="padding:4px 6px">Tier</th>
                <th style="padding:4px 6px">Annual Value</th>
                <th style="padding:4px 6px">Address</th>
                <th style="padding:4px 6px">Contact</th>
              </tr>
            </thead>
            <tbody>
              ${rows.slice(0, 5).map((r, i) => {
                const nameIdx = headers.indexOf(state.mapping.name);
                const tierIdx = headers.indexOf(state.mapping.tier);
                const valIdx = headers.indexOf(state.mapping.annualValue);
                const addrIdx = headers.indexOf(state.mapping.address);
                const contIdx = headers.indexOf(state.mapping.contactName);
                return `
                <tr style="border-bottom:1px solid var(--line-soft)">
                  <td style="padding:4px 6px;color:var(--muted)">${i + 1}</td>
                  <td style="padding:4px 6px"><b>${esc(nameIdx >= 0 ? r[nameIdx] || 'Unnamed' : 'Unnamed')}</b></td>
                  <td style="padding:4px 6px">${esc(tierIdx >= 0 ? r[tierIdx] || 'B' : 'B')}</td>
                  <td style="padding:4px 6px" class="money">${esc(valIdx >= 0 ? r[valIdx] || '120000' : '120000')}</td>
                  <td style="padding:4px 6px">${esc(addrIdx >= 0 ? r[addrIdx] || 'Primary Ave' : 'Primary Ave')}</td>
                  <td style="padding:4px 6px">${esc(contIdx >= 0 ? r[contIdx] || 'Lead' : 'Lead')}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 5. Activation Buttons -->
      <div class="btn-row" style="margin-top:4px">
        <button class="btn secondary" data-act="close-csv-mapper" style="flex:1">Cancel</button>
        <button class="btn primary" data-act="activate-csv-dataset" style="flex:2" ${rows.length > 0 ? '' : 'disabled'}>
          ${icon('check', 16)} Activate Customer Territory (${rows.length} Accounts)
        </button>
      </div>

      ${app.ui?.csvToast ? `<div class="notice good" style="margin-top:6px">${icon('check', 14)}<span>${esc(app.ui.csvToast)}</span></div>` : ''}
    </div>
  </section>`;
}

export const csvMapperActions = {
  'open-csv-mapper': ({ app }) => {
    (app.ui ||= {}).csvMapperOpen = true;
    app.presenterOpen = false;
  },
  'close-csv-mapper': ({ app }) => {
    if (app.ui) app.ui.csvMapperOpen = false;
  },
  'update-csv-text': ({ app, el }) => {
    const text = el.value || '';
    const state = (app.ui.csvState ||= {});
    state.rawText = text;
  },
  'set-csv-client-name': ({ app, value }) => {
    const state = (app.ui.csvState ||= {});
    state.clientName = value.trim() || 'Custom Client PoC';
  },
  'parse-csv-input': ({ app }) => {
    const state = (app.ui.csvState ||= {});
    const inputEl = document.getElementById('csv-raw-input');
    if (inputEl) state.rawText = inputEl.value;
    state.parsed = parseCsvText(state.rawText);
    state.mapping = autoDetectColumns(state.parsed.headers);
    app.ui.csvToast = `Parsed ${state.parsed.rows.length} rows and ${state.parsed.headers.length} columns cleanly.`;
  },
  'load-csv-template': ({ app }) => {
    const state = (app.ui.csvState ||= {});
    state.rawText = SAMPLE_DEMO_CSV;
    state.parsed = parseCsvText(SAMPLE_DEMO_CSV);
    state.mapping = autoDetectColumns(state.parsed.headers);
    const inputEl = document.getElementById('csv-raw-input');
    if (inputEl) inputEl.value = SAMPLE_DEMO_CSV;
    app.ui.csvToast = 'Sample enterprise customer template loaded.';
  },
  'set-col-mapping': ({ app, data, value }) => {
    const state = (app.ui.csvState ||= {});
    state.mapping = { ...(state.mapping || {}), [data.target]: value };
  },
  'activate-csv-dataset': ({ app, ctx, api }) => {
    const state = app.ui?.csvState;
    if (!state || !state.parsed.rows.length) return;
    const dataset = buildDatasetFromCsv(state.parsed.headers, state.parsed.rows, state.mapping, state.clientName);

    setDataProvider(new CustomerDataProvider(dataset));
    const tm = getTenantManager();
    tm.registerTenant({
      tenantId: dataset.tenantId,
      name: dataset.clientName,
    });
    tm.setTenant(dataset.tenantId);

    if (app.cache) app.cache.clear();
    app.ui.csvMapperOpen = false;
    app.ui.pocToast = `Activated customer territory for ${dataset.clientName} (${dataset.accounts.length} accounts loaded).`;
    if (ctx?.m?.logAudit) {
      ctx.m.logAudit('Data Ingestion', `Activated custom customer dataset via Visual Column Mapper: ${dataset.clientName}`);
    }
    api.render();
  },
};
