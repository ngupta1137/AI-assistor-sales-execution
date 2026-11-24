// ==============================================================================
// NO-CODE PACK & RULE CUSTOMIZER STUDIO (SALES OPS CONSOLE)
// ==============================================================================
// Allows commercial operations leaders, IT administrators, and prospect teams
// to visually adjust vocabulary tokens, add custom actions to the active catalog,
// and configure governance guardrails without changing application code.
// ==============================================================================

import { esc, icon, pill } from '../ui.js';

export function renderPackStudioModal(app, ctx) {
  if (!app.ui?.packStudioOpen) return '';

  const tab = app.ui?.packStudioTab || 'vocab';
  const ind = ctx?.industry || {};
  const currentTokens = ind.vocab || {};

  return `
  <div class="scrim" role="dialog" aria-modal="true" aria-labelledby="studio-title" style="display:flex;align-items:center;justify-content:center;z-index:9000;background:rgba(0,0,0,0.65);position:fixed;inset:0;padding:12px;overflow-y:auto">
    <section class="card" style="width:100%;max-width:680px;max-height:92vh;display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:16px;box-shadow:0 20px 40px rgba(0,0,0,0.3);position:relative">
      
      <!-- Studio Header -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid var(--line);padding-bottom:10px">
        <div style="display:flex;align-items:center;gap:8px">
          ${icon('config', 22)}
          <div>
            <b id="studio-title" style="font-size:14px;color:var(--ink)">No-Code Pack &amp; Rule Studio:</b>
            <span class="small muted" style="display:block;font-size:11px">${esc(ind.name || 'Commercial')} &middot; ${esc(ctx?.country?.name || 'Operating Market')}</span>
          </div>
        </div>
        <button class="icon-btn sm" data-act="close-pack-studio" aria-label="Close Pack Studio">${icon('x', 18)}</button>
      </div>

      <!-- Studio Navigation Tabs -->
      <div class="seg-ctl" role="tablist" style="margin-bottom:12px">
        <button class="seg ${tab === 'vocab' ? 'on' : ''}" data-act="set-studio-tab" data-tab="vocab" role="tab" style="min-height:var(--tap);flex:1;font-size:11px">
          1. Vocabulary Tokens
        </button>
        <button class="seg ${tab === 'actions' ? 'on' : ''}" data-act="set-studio-tab" data-tab="actions" role="tab" style="min-height:var(--tap);flex:1;font-size:11px">
          2. Action Catalog Builder
        </button>
        <button class="seg ${tab === 'guardrails' ? 'on' : ''}" data-act="set-studio-tab" data-tab="guardrails" role="tab" style="min-height:var(--tap);flex:1;font-size:11px">
          3. Governance Guardrails
        </button>
      </div>

      <!-- Studio Body -->
      <div style="flex:1;overflow-y:auto;padding-right:4px">
        
        <!-- Tab 1: Vocabulary Tokens -->
        ${tab === 'vocab' ? `
          <div style="display:flex;flex-direction:column;gap:10px">
            <p class="small muted" style="margin:0;font-size:11px;line-height:1.4">
              All user-facing screens use token variables. Modify the nouns below to adapt the platform immediately to your enterprise terminology.
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px">
              ${[
                ['account', 'Single Account Noun', currentTokens.account || 'Account'],
                ['accounts', 'Plural Accounts Noun', currentTokens.accounts || 'Accounts'],
                ['contact', 'Primary Contact Role', currentTokens.contact || 'Decision Maker'],
                ['offering', 'Offering / Product Item', currentTokens.offering || 'Item'],
                ['offerings', 'Offerings Plural', currentTokens.offerings || 'Items'],
                ['order', 'Order or Proposal Noun', currentTokens.order || 'Order'],
                ['visit', 'Field Engagement Noun', currentTokens.visit || 'Visit'],
                ['rep', 'Sales Representative Title', currentTokens.rep || 'Field Executive'],
              ].map(([key, label, val]) => `
                <label class="field" style="margin:0">
                  <span style="font-size:11px;font-weight:600;color:var(--ink)">${esc(label)} ({${esc(key)}}):</span>
                  <input type="text" class="input" style="font-size:11px;padding:5px 8px" data-change="update-studio-token" data-token="${esc(key)}" value="${esc(val)}">
                </label>
              `).join('')}
            </div>
            <div class="notice info" style="font-size:11px;padding:8px">
              ${icon('check', 14)} <span>Changes apply immediately across all screens and reports in this session.</span>
            </div>
          </div>
        ` : ''}

        <!-- Tab 2: Action Catalog Builder -->
        ${tab === 'actions' ? `
          <div style="display:flex;flex-direction:column;gap:10px">
            <p class="small muted" style="margin:0;font-size:11px;line-height:1.4">
              Add custom commercial, merchandising, or compliance actions to the active pack catalog.
            </p>

            <div style="background:var(--surface-subtle);border:1px solid var(--line);border-radius:6px;padding:10px;display:flex;flex-direction:column;gap:8px">
              <b style="font-size:11px;color:var(--ink)">Add New Custom Action:</b>
              <label class="field" style="margin:0">
                <span style="font-size:11px">Action Title:</span>
                <input type="text" id="custom-action-title" class="input" style="font-size:11px;padding:4px 6px" placeholder="e.g. Audit display execution and verify primary placement">
              </label>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                <label class="field" style="margin:0">
                  <span style="font-size:11px">Default Duration (min):</span>
                  <input type="number" id="custom-action-effort" class="input" style="font-size:11px;padding:4px 6px" value="15" min="5" max="90">
                </label>
                <label class="field" style="margin:0">
                  <span style="font-size:11px">Evidence Requirement:</span>
                  <select id="custom-action-evidence" class="input" style="font-size:11px;padding:4px 6px">
                    <option value="photo">Photo Verification</option>
                    <option value="note">Written Confirmation Note</option>
                    <option value="signature">Physical or Digital Signature</option>
                  </select>
                </label>
              </div>
              <label class="field" style="margin:0">
                <span style="font-size:11px">Commercial Rationale (Why):</span>
                <input type="text" id="custom-action-why" class="input" style="font-size:11px;padding:4px 6px" placeholder="e.g. Target accounts exhibit high stock-turn rate">
              </label>
              <button class="btn primary sm" data-act="add-custom-action" style="align-self:flex-start;min-height:30px;font-size:11px">
                ${icon('check', 14)} Add Action to Catalog
              </button>
            </div>

            <div>
              <b style="font-size:11px;color:var(--ink)">Active Catalog Items (${esc(String(ind.actions?.length || 0))} actions):</b>
              <div style="max-height:160px;overflow-y:auto;margin-top:6px;border:1px solid var(--line);border-radius:4px">
                ${(ind.actions || []).map((a, i) => `
                  <div style="padding:6px 8px;border-bottom:1px solid var(--line-soft);font-size:11px;display:flex;justify-content:space-between;align-items:center">
                    <div>
                      <b>${i + 1}. ${esc(a.title)}</b>
                      <span class="small muted" style="display:block">${esc(String(a.effort || 15))} min &middot; Evidence: ${esc(a.evidence || 'note')}</span>
                    </div>
                    ${pill('Active', 'good')}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Tab 3: Governance Guardrails -->
        ${tab === 'guardrails' ? `
          <div style="display:flex;flex-direction:column;gap:10px">
            <p class="small muted" style="margin:0;font-size:11px;line-height:1.4">
              Enterprise policy rules that govern autonomous suggestion limits, approval gates, and supervisor oversight.
            </p>

            <div style="display:flex;flex-direction:column;gap:8px">
              <div style="padding:8px 10px;background:var(--surface-subtle);border:1px solid var(--line);border-radius:6px">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <b style="font-size:11px">Exact-Wording Gate for Regulated Items:</b>
                  ${pill('Enforced', 'good')}
                </div>
                <p class="small muted" style="margin:4px 0 0 0;font-size:10px">
                  Requires affirmative reading confirmation before detailing or sampling regulated portfolio materials.
                </p>
              </div>

              <div style="padding:8px 10px;background:var(--surface-subtle);border:1px solid var(--line);border-radius:6px">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <b style="font-size:11px">Credit &amp; Price Hold Threshold:</b>
                  ${pill('Strict', 'warn')}
                </div>
                <p class="small muted" style="margin:4px 0 0 0;font-size:10px">
                  Discounts exceeding standard territory policy automatically route to manager exception queue.
                </p>
              </div>

              <div style="padding:8px 10px;background:var(--surface-subtle);border:1px solid var(--line);border-radius:6px">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <b style="font-size:11px">European Non-Surveillance Standard:</b>
                  ${pill('Available', 'info')}
                </div>
                <p class="small muted" style="margin:4px 0 0 0;font-size:10px">
                  Conforms to German BetrVG &sect; 87 works council privacy rules by anonymizing individual rep performance.
                </p>
              </div>
            </div>
          </div>
        ` : ''}

      </div>

      <!-- Studio Footer -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;border-top:1px solid var(--line);padding-top:10px;flex-wrap:wrap;gap:8px">
        <button class="btn secondary sm" data-act="export-custom-pack" style="min-height:32px;font-size:11px">
          ${icon('note', 14)} Export Customized Pack Definition (JSON)
        </button>
        <button class="btn primary sm" data-act="close-pack-studio" style="min-height:32px;font-size:11px">
          Apply &amp; Return to Workspace
        </button>
      </div>

      ${app.ui?.studioToast ? `<div class="notice good" style="margin-top:6px">${icon('check', 14)}<span>${esc(app.ui.studioToast)}</span></div>` : ''}
    </section>
  </div>`;
}

export const packStudioActions = {
  'open-pack-studio': ({ app }) => {
    (app.ui ||= {}).packStudioOpen = true;
    app.presenterOpen = false;
  },
  'close-pack-studio': ({ app }) => {
    if (app.ui) app.ui.packStudioOpen = false;
  },
  'set-studio-tab': ({ app, data }) => {
    (app.ui ||= {}).packStudioTab = data.tab;
  },
  'update-studio-token': ({ app, ctx, data, value }) => {
    if (!ctx?.industry) return;
    const token = data.token;
    const clean = value.trim();
    if (!clean) return;
    ctx.industry.vocab = { ...(ctx.industry.vocab || {}), [token]: clean };
    if (app.cache) app.cache.clear();
    (app.ui ||= {}).studioToast = `Updated token {${token}} to "${clean}".`;
  },
  'add-custom-action': ({ app, ctx }) => {
    if (!ctx?.industry) return;
    const titleEl = document.getElementById('custom-action-title');
    const effortEl = document.getElementById('custom-action-effort');
    const evidenceEl = document.getElementById('custom-action-evidence');
    const whyEl = document.getElementById('custom-action-why');

    const title = titleEl?.value?.trim();
    if (!title) return;

    const newAction = {
      id: `custom_act_${Date.now().toString().slice(-4)}`,
      title,
      effort: Number(effortEl?.value) || 15,
      evidence: evidenceEl?.value || 'note',
      why: [whyEl?.value?.trim() || 'Custom commercial initiative defined in Studio'],
      talk: ['Review with customer representative during visit'],
      confidence: 0.95,
      saw: 'Custom sales operations prioritization',
      compared: 'Standard territorial commercial schedule',
    };

    ctx.industry.actions = [...(ctx.industry.actions || []), newAction];
    if (app.cache) app.cache.clear();

    if (titleEl) titleEl.value = '';
    if (whyEl) whyEl.value = '';

    (app.ui ||= {}).studioToast = `Added action "${title}" to the live catalog.`;
    if (ctx?.m?.logAudit) {
      ctx.m.logAudit('Pack Studio', `Added custom action to catalog: ${title}`);
    }
  },
  'export-custom-pack': ({ app, ctx }) => {
    const ind = ctx?.industry || {};
    const packExport = {
      industryId: ind.id,
      name: ind.name,
      vocab: ind.vocab,
      actionsCount: ind.actions?.length || 0,
      actions: ind.actions,
      exportedAt: new Date().toISOString(),
      tenant: 'Enterprise Custom Studio',
    };

    const jsonStr = JSON.stringify(packExport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `custom-pack-${ind.id || 'commercial'}-definition.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    (app.ui ||= {}).studioToast = 'Exported customized industry pack definition.';
  },
};
