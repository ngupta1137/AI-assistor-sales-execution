// Joint-Visit Coaching Scorecard: structured field accompaniment rubric.
// Used by field managers during joint visits to observe, rate, and coach reps.
// Sample data concept. Does not alter real HR records.

import { icon, pill } from '../ui.js';

const RUBRIC_DIMENSIONS = [
  {
    id: 'opening',
    title: 'Visit Opening and Agenda Alignment',
    desc: 'States commercial purpose, confirms available time, and engages the primary decision-maker.',
    anchors: ['Unclear purpose; rushed agenda', 'States purpose but lacks clear time check', 'Role-model opening with joint agenda'],
  },
  {
    id: 'discovery',
    title: 'Need Discovery and Inquiry',
    desc: 'Explores inventory levels, commercial blockers, and competitive activity using structured questions.',
    anchors: ['No questions asked; immediate pitch', 'Basic inventory checks without commercial depth', 'Deep inquiry uncovering root operational gaps'],
  },
  {
    id: 'value_prop',
    title: 'Value Proposition and Objection Handling',
    desc: 'Presents ranked actions with supporting evidence and addresses objections with data.',
    anchors: ['Defensive or unprepared for pushback', 'Answers questions but relies on discounts', 'Confident handling supported by account history'],
  },
  {
    id: 'closing',
    title: 'Closing and Commercial Commitment',
    desc: 'Secures explicit agreement on order quantities, scheduled follow-ups, and agreed next steps.',
    anchors: ['Leaves without firm next steps', 'Partial agreement without delivery date', 'Firm commercial commitment with confirmed schedule'],
  },
  {
    id: 'compliance',
    title: 'Governance and Integrity Standards',
    desc: 'Accurate record keeping, truth in reporting, and strict adherence to commercial guardrails.',
    anchors: ['Incomplete visit notes; missed evidence', 'Meets minimum reporting criteria', 'Exemplary transparency and audit-ready records'],
  },
];

export function renderCoachingScorecard(ctx) {
  const { app, data, text: t, esc } = ctx;
  const repName = app.coachingRep || (data.reps && data.reps[0] ? data.reps[0].name : 'Field Representative');
  const scores = app.coachingScores || {
    opening: 4,
    discovery: 4,
    value_prop: 3,
    closing: 4,
    compliance: 5,
  };
  const strengths = app.coachingStrengths || 'Strong commercial rapport and disciplined adherence to visit time budget.';
  const growthArea = app.coachingGrowth || 'Explore secondary opportunities before presenting the final order draft.';
  const status = app.coachingSubmitted ? 'Saved to Coaching Log' : 'Draft in Progress';

  const avgScore = (Object.values(scores).reduce((a, b) => a + b, 0) / RUBRIC_DIMENSIONS.length).toFixed(1);

  return `
  <section class="card" data-screen="coaching-scorecard">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <div>
        <div style="display:flex;align-items:center;gap:6px">
          <a href="#/manager" class="btn text sm" style="min-height:44px;min-width:44px;padding:6px 8px;display:inline-flex;align-items:center">
            ${icon('chevronLeft', 16)} Back to Team
          </a>
          <h2 style="margin:0;font-size:16px;font-weight:700">Joint-Visit Coaching Scorecard</h2>
        </div>
        <p class="small muted" style="margin:4px 0 0 0">
          Structured field accompaniment observation rubric for coaching and professional development.
        </p>
      </div>
      <div style="display:flex;align-items:center;gap:6px">
        ${pill(status, app.coachingSubmitted ? 'good' : 'info')}
        <span class="badge" style="font-weight:700;font-size:12px;padding:4px 8px">Score: ${avgScore} / 5.0</span>
      </div>
    </div>

    <!-- Rep and Visit Context Banner -->
    <div class="card tight" style="background:var(--surface-subtle);border:1px solid var(--line);border-radius:6px;padding:10px 12px;margin-bottom:14px">
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));gap:8px;font-size:11px">
        <div>
          <span class="muted" style="display:block">Coached Representative:</span>
          <b>${esc(repName)}</b>
        </div>
        <div>
          <span class="muted" style="display:block">Observation Focus:</span>
          <b>Commercial Value Delivery</b>
        </div>
        <div>
          <span class="muted" style="display:block">Session Date:</span>
          <b>${esc(new Date().toISOString().slice(0, 10))}</b>
        </div>
        <div>
          <span class="muted" style="display:block">Accompaniment:</span>
          <b>Quarterly Field Review</b>
        </div>
      </div>
    </div>

    <!-- Competency Rubric Dimensions -->
    <div style="margin-bottom:16px">
      <h3 style="font-size:13px;font-weight:700;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:0.04em;color:var(--ink-secondary)">
        Observation Competency Rubric
      </h3>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${RUBRIC_DIMENSIONS.map((dim) => {
          const curVal = scores[dim.id] || 3;
          return `
          <div class="card tight" style="border:1px solid var(--line);border-radius:6px;padding:10px 12px;background:var(--surface)">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;flex-wrap:wrap;gap:4px">
              <span style="font-size:12px;font-weight:700;color:var(--ink)">${esc(dim.title)}</span>
              <span class="badge" style="font-size:11px;font-weight:600">Rating: ${curVal} / 5</span>
            </div>
            <p class="small muted" style="margin:0 0 8px 0;font-size:11px">${esc(dim.desc)}</p>
            
            <!-- Rating Stepper (1 to 5) with minimum 44px tap targets -->
            <div style="display:flex;gap:6px;align-items:center" role="group" aria-label="${esc(dim.title)} rating">
              ${[1, 2, 3, 4, 5].map((val) => `
                <button class="btn ${curVal === val ? 'primary' : 'secondary'} sm" 
                  data-act="set-coaching-score" 
                  data-dim="${esc(dim.id)}" 
                  data-val="${val}" 
                  style="min-height:44px;min-width:44px;flex:1;font-size:12px;font-weight:700">
                  ${val}
                </button>
              `).join('')}
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:4px;font-size:10px;color:var(--ink-tertiary)">
              <span>${esc(dim.anchors[0])}</span>
              <span>${esc(dim.anchors[2])}</span>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <!-- Qualitative Feedback & Action Commitments -->
    <div style="display:grid;grid-template-columns:1fr;gap:10px;margin-bottom:14px">
      <div class="card tight" style="border:1px solid var(--line);border-radius:6px;padding:10px 12px">
        <label for="coach-strengths" style="display:block;font-size:11px;font-weight:700;margin-bottom:4px">
          Observed Strengths and Best Practices:
        </label>
        <textarea id="coach-strengths" class="input" rows="2" style="width:100%;font-size:11px;font-family:inherit;padding:6px;box-sizing:border-box" data-change="set-coaching-strengths">${esc(strengths)}</textarea>
      </div>

      <div class="card tight" style="border:1px solid var(--line);border-radius:6px;padding:10px 12px">
        <label for="coach-growth" style="display:block;font-size:11px;font-weight:700;margin-bottom:4px">
          Priority Developmental Growth Goal (Next 30 Days):
        </label>
        <textarea id="coach-growth" class="input" rows="2" style="width:100%;font-size:11px;font-family:inherit;padding:6px;box-sizing:border-box" data-change="set-coaching-growth">${esc(growthArea)}</textarea>
      </div>
    </div>

    <!-- Actions & Submission Bar -->
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;padding-top:8px;border-top:1px solid var(--line)">
      <button class="btn secondary" data-act="export-coaching-summary" style="min-height:44px;min-width:44px;font-size:12px">
        ${icon('note', 14)} Export Coaching Note (Markdown)
      </button>
      <button class="btn primary" data-act="submit-coaching-scorecard" style="min-height:44px;min-width:44px;font-size:12px">
        ${icon('check', 14)} Finalize and Save Scorecard
      </button>
    </div>
  </section>`;
}

export const actions = {
  'set-coaching-score': ({ app, data }) => {
    app.coachingScores = app.coachingScores || { opening: 4, discovery: 4, value_prop: 3, closing: 4, compliance: 5 };
    if (data.dim && data.val) {
      app.coachingScores[data.dim] = Number(data.val);
    }
  },
  'set-coaching-strengths': ({ app, el }) => {
    app.coachingStrengths = el.value;
  },
  'set-coaching-growth': ({ app, el }) => {
    app.coachingGrowth = el.value;
  },
  'submit-coaching-scorecard': ({ app }) => {
    app.coachingSubmitted = true;
  },
  'export-coaching-summary': ({ app, ctx }) => {
    const scores = app.coachingScores || { opening: 4, discovery: 4, value_prop: 3, closing: 4, compliance: 5 };
    const md = `# Joint-Visit Coaching Scorecard\nDate: ${new Date().toISOString().slice(0, 10)}\nRepresentative: ${app.coachingRep || 'Field Rep'}\n\n## Scores\n` +
      Object.entries(scores).map(([k, v]) => `- ${k}: ${v}/5`).join('\n') +
      `\n\n## Observed Strengths\n${app.coachingStrengths || 'Disciplined execution.'}\n\n## Development Priority\n${app.coachingGrowth || 'Advance commercial inquiry.'}\n`;
    if (typeof window !== 'undefined' && window.Blob) {
      const blob = new Blob([md], { type: 'text/markdown' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `coaching-scorecard-${new Date().toISOString().slice(0, 10)}.md`;
      a.click();
    }
    return false;
  },
};

export const render = renderCoachingScorecard;
