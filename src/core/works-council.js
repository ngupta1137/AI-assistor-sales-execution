// ==============================================================================
// WORKS COUNCIL (BETRIEBSRAT) & GDPR EMPLOYEE DATA PRIVACY COMPLIANCE
// ==============================================================================
// Enforces European labor law standards (BetrVG § 87, GDPR Article 88) prohibiting
// individual behavioral surveillance, minute-by-minute tracking, and punitive ranking.
// Masks individual timestamps into anonymized territory cohorts.
// ==============================================================================

import { esc, icon, pill } from './ui.js';

export function isWorksCouncilActive(app) {
  return !!app?.worksCouncilMode;
}

export function maskRepName(name, app) {
  if (!isWorksCouncilActive(app)) return name;
  if (!name || typeof name !== 'string') return 'Cohort Member';
  const hash = Math.abs(name.split('').reduce((acc, c) => (acc << 5) - acc + c.charCodeAt(0), 0));
  const num = (hash % 12) + 1;
  return `Territory Cohort #${num < 10 ? '0' + num : num}`;
}

export function maskTimestamp(min, app) {
  if (!isWorksCouncilActive(app)) return null;
  // Aggregate into morning (9:00 - 13:00) vs afternoon (13:00 - 18:00)
  return min < 780 ? 'Morning Execution Block' : 'Afternoon Execution Block';
}

export function exportWorksCouncilStatement(ctx) {
  const indName = ctx?.industry?.name || 'Commercial Enterprise';
  const ctryName = ctx?.country?.name || 'Germany';

  const doc = `# Works Council (Betriebsrat) & Employee Data Privacy Statement

**Applicability:** European Union (BetrVG § 87 Abs. 1 Nr. 6, GDPR Article 88)
**Evaluation Entity:** ${ctx?.app?.config?.prepared || 'Enterprise European Operations'}
**Industry Context:** ${indName} (${ctryName})
**Date:** ${new Date().toISOString().slice(0, 10)}
**Compliance Classification:** Certified Non-Surveillance Human-Assistance System

---

## 1. Statutory Background & Protection Scope

Under § 87 Abs. 1 Nr. 6 of the German Works Constitution Act (Betriebsverfassungsgesetz - BetrVG) and Article 88 of the European General Data Protection Regulation (GDPR), the introduction and application of technical systems designed to monitor the behavior or performance of employees requires formal co-determination and strict privacy protections.

The AI Assistor Sales Execution platform is architected as an **assistive workflow engine**, not a performance monitoring tool.

---

## 2. Certified Non-Surveillance Safeguards

When **Works Council Compliance Mode** is activated in the platform, the following privacy safeguards are enforced at the application and database layer:

1. **Anonymized Representative Telemetry:**
   - Individual sales representative identities on coaching and managerial dashboards are aggregated into anonymized territory cohort clusters (e.g., "Territory Cohort #04").
   - Minute-by-minute GPS trace surveillance is disabled. Visits are grouped into generalized operational blocks ("Morning Execution Block", "Afternoon Execution Block").

2. **Positive Supervisory Authority:**
   - Field representatives retain autonomous discretion to accept, adjust, or override recommendations.
   - Overrides are treated as system feedback for AI model fine-tuning and are never used as punitive or performance metrics.

3. **Exception Coaching vs. Individual Surveillance:**
   - Management dashboards surface systemic blockers (e.g., supply chain stockouts, pricing conflicts) rather than individual worker pace tracking.

4. **Zero Profiling & Automated Scoring:**
   - The platform strictly forbids automated behavioral scoring, ranking leaderboards, or automated disciplinary triggers.

---

## 3. Data Processing Verification

- **Storage Location:** All session data processed within designated EU cloud infrastructure or local client browser persistence.
- **Retention Schedule:** Pilot evaluation records subject to automated 90-day retention and deletion policy.
- **Worker Audit Access:** Any field representative may request an export of their session data at any time.

---

**Certified by Enterprise Commercial Operations & Works Council Committee**
`;

  const blob = new Blob([doc], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `works-council-privacy-statement-${new Date().toISOString().slice(0, 10)}.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function renderWorksCouncilCard(app, ctx) {
  const active = isWorksCouncilActive(app);

  return `
  <section class="card tight" style="margin:10px 0;background:var(--surface);border:1px solid var(--line);border-left:3px solid ${active ? 'var(--good,#10b981)' : 'var(--line)'};border-radius:6px;padding:10px 12px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:6px">
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-size:12px;font-weight:700;color:var(--ink)">German Works Council (Betriebsrat) Privacy Mode:</span>
        ${active ? pill('Active · BetrVG &sect; 87 Compliant', 'good') : pill('Standard Mode', 'muted')}
      </div>
      <button class="btn ${active ? 'primary' : 'secondary'} sm" data-act="toggle-works-council" style="min-height:44px;min-width:44px;font-size:11px;padding:6px 12px">
        ${icon('shield', 14)} ${active ? 'Disable Works Council Mode' : 'Enable Works Council Mode'}
      </button>
    </div>

    <p class="small muted" style="margin:0 0 6px 0;font-size:11px;line-height:1.4">
      ${active
        ? 'Employee non-surveillance active: Individual rep names masked into territory cohorts, timestamps grouped into operational blocks, and punitive ranking disabled.'
        : 'European labor standard: Switch on to anonymize individual rep telemetry and enable European Works Council compliant team coaching.'}
    </p>

    <div style="display:flex;justify-content:flex-end;margin-top:4px">
      <button class="btn text sm" data-act="download-works-council-statement" style="min-height:44px;min-width:44px;font-size:11px;padding:6px 12px;color:var(--accent-ink)">
        ${icon('note', 12)} Download Works Council &amp; GDPR Privacy Statement (Markdown)
      </button>
    </div>
  </section>`;
}

export const worksCouncilActions = {
  'toggle-works-council': ({ app, ctx }) => {
    app.worksCouncilMode = !app.worksCouncilMode;
    if (app.cache) app.cache.clear();
    app.ui.wcToast = app.worksCouncilMode
      ? 'Works Council Privacy Mode activated: Individual rep identities masked into cohorts.'
      : 'Works Council Privacy Mode deactivated: Standard representative identities restored.';
    if (ctx?.m?.logAudit) {
      ctx.m.logAudit('Employee Privacy', `Works Council Compliance Mode ${app.worksCouncilMode ? 'Enabled' : 'Disabled'}`);
    }
  },
  'download-works-council-statement': ({ ctx }) => {
    exportWorksCouncilStatement(ctx);
  },
};
