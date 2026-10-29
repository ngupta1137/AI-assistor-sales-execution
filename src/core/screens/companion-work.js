// Sales Companion, Productivity: leave, expense claims, HR and pay slips.
// All sample data. Approvals are real inside the demo: the rep submits, the manager decides, the rep sees it.
// No real HR or pay information: pay slip amounts are generated and labelled as samples.

import { esc, icon, pill } from '../ui.js';
import { head } from './companion-ui.js';
import { iso, addDays } from '../companion/data.js';

const TONE = { pending: 'warn', approved: 'good', rejected: 'bad' };
const LABEL = { pending: 'Pending approval', approved: 'Approved', rejected: 'Rejected' };

const dateText = (ctx, s) => { const [y, m, d] = s.split('-').map(Number); return ctx.fmt.date(new Date(y, m - 1, d)); };

// ---- Leave --------------------------------------------------------------------
export function leave(ctx) {
  const { t, fmt, comp, cm, country, ui, persona } = ctx;
  const f = (ui.leave ||= { type: country.leaveTypes[0].id, from: '', to: '', note: '', error: '', done: null });
  const mgr = persona !== 'rep';
  const bal = comp.balances.map((b) => `<div><small>${esc(b.label)}</small><b>${cm.remaining(b.id)} of ${b.total}</b><small>days left</small></div>`).join('');
  const mine = cm.myLeave().slice().reverse().map((r) => `<li class="row" data-leave="${esc(r.id)}" data-status="${r.status}"><span class="row-main"><b>${esc(cm.leaveType(r.type).label)}, ${r.days} day${r.days === 1 ? '' : 's'}</b>
    <small>${esc(dateText(ctx, r.from))} to ${esc(dateText(ctx, r.to))}${r.note ? ` · ${esc(r.note)}` : ''}</small></span><span class="row-end">${pill(LABEL[r.status], TONE[r.status])}</span></li>`).join('');
  const pending = cm.pendingTeamLeave();
  const queue = pending.length ? pending.map((r) => `<li class="row" data-approval="${esc(r.id)}"><span class="row-main"><b>${esc(r.rep)}</b>
    <small>${esc(cm.leaveType(r.type).label)}, ${r.days} day${r.days === 1 ? '' : 's'}: ${esc(dateText(ctx, r.from))} to ${esc(dateText(ctx, r.to))}</small>
    <span class="btn-row" style="margin-top:8px"><button class="btn primary sm" data-act="leave-decide" data-id="${esc(r.id)}" data-approve="1">Approve</button><button class="btn secondary sm" data-act="leave-decide" data-id="${esc(r.id)}" data-approve="0">Reject</button></span></span></li>`).join('')
    : '<li class="empty">No leave requests are waiting.</li>';
  const form = `
  <section class="card" data-card="leave-form"><h2>Request leave</h2>
    <label class="field">Type<select id="leave-type" data-input="leave-field" data-field="type">${country.leaveTypes.map((x) => `<option value="${esc(x.id)}"${f.type === x.id ? ' selected' : ''}>${esc(x.label)}</option>`).join('')}</select></label>
    <div class="facts"><label class="field">From<input type="date" id="leave-from" min="${iso(comp.today)}" value="${esc(f.from)}" data-input="leave-field" data-field="from"></label>
      <label class="field">To<input type="date" id="leave-to" min="${iso(comp.today)}" value="${esc(f.to)}" data-input="leave-field" data-field="to"></label></div>
    <label class="field">Note (optional)<input type="text" id="leave-note" maxlength="120" value="${esc(f.note)}" data-input="leave-field" data-field="note"></label>
    <p class="small muted">Weekends and public holidays are not counted. Your ${esc(t('{manager}'))} approves.</p>
    ${f.error ? `<div class="notice warn" id="leave-error" role="alert">${icon('flag', 18)}<span>${esc(f.error)}</span></div>` : ''}
    ${f.done ? `<div class="notice good" id="leave-done" role="status">${icon('check', 18)}<span>${esc(f.done)}</span></div>` : ''}
    <button class="btn primary block" data-act="leave-submit" id="leave-submit">Submit request</button>
  </section>`;
  const hol = comp.holidays.slice(0, 4).map((h) => `<li class="row"><span class="row-main"><b>${esc(h.name)}</b></span><small>${esc(fmt.date(h.date))}</small></li>`).join('');
  return head(ctx, { title: 'Leave', lead: 'Request leave, track it, and approve it as a manager. Sample data.' }) + `
  <section class="card tight"><div class="facts">${bal}</div></section>
  ${mgr ? '' : form}
  ${mgr ? `<section id="leave-approvals"><div class="section-head"><h2>Waiting for your approval</h2>${pill(`${pending.length} open`, pending.length ? 'warn' : 'good')}</div><ul class="group">${queue}</ul></section>` : `<section><h2>Your requests</h2><ul class="group" style="margin-top:12px" id="leave-list">${mine}</ul></section>`}
  <section><h2>Next public holidays</h2><ul class="group" style="margin-top:12px">${hol}</ul><p class="small muted" style="margin-top:8px">${esc(country.name)} sample calendar. Dates are approximate.</p></section>
  <p class="foot-note">Sample data. Not a real HR system.</p>`;
}

// ---- Expenses ------------------------------------------------------------------
function policyHtml(ctx, f) {
  const { fmt, cm } = ctx;
  const amt = Number(String(f.amount || '').replace(',', '.'));
  if (!f.category || !Number.isFinite(amt) || amt <= 0) return '<p class="small muted">Enter a category and an amount to see the policy check.</p>';
  const p = cm.policy(f.category, amt);
  return p.over
    ? `<div class="notice warn" data-policy="over">${icon('flag', 18)}<span>Over the sample limit of ${esc(fmt.price(p.limit))} for this category by ${esc(fmt.price(amt - p.limit))}. It can still be sent, and your ${esc(ctx.t('{manager}'))} decides.</span></div>`
    : `<div class="notice good" data-policy="within">${icon('check', 18)}<span>Within the sample limit of ${esc(fmt.price(p.limit))} for this category.</span></div>`;
}

export function expenses(ctx) {
  const { t, fmt, comp, cm, industry, ui, persona } = ctx;
  const f = (ui.exp ||= { category: industry.companion.expenseCategories[0].id, amount: '', date: iso(comp.today), note: '', receipt: false, error: '', done: null });
  const mgr = persona !== 'rep';
  const rows = (list, withActions) => list.map((e) => `<li class="row" data-expense="${esc(e.id)}" data-status="${e.status}"><span class="row-main"><b>${esc(cm.category(e.category).label)}</b>
    <small>${esc(withActions ? `${e.rep} · ` : '')}${esc(dateText(ctx, e.date))}${e.over ? ' · over the sample limit' : ''}</small>
    ${withActions ? `<span class="btn-row" style="margin-top:8px"><button class="btn primary sm" data-act="exp-decide" data-id="${esc(e.id)}" data-approve="1">Approve</button><button class="btn secondary sm" data-act="exp-decide" data-id="${esc(e.id)}" data-approve="0">Reject</button></span>` : ''}</span>
    <span class="row-end"><b class="money small">${esc(fmt.price(e.amount))}</b>${withActions ? '' : pill(LABEL[e.status], TONE[e.status])}</span></li>`).join('');
  const pending = cm.pendingExpenses();
  const form = `
  <section class="card" data-card="expense-form"><h2>New claim</h2>
    <label class="field">Category<select id="exp-category" data-input="exp-field" data-field="category">${industry.companion.expenseCategories.map((c) => `<option value="${esc(c.id)}"${f.category === c.id ? ' selected' : ''}>${esc(t(c.label))}</option>`).join('')}</select></label>
    <div class="facts"><label class="field">Amount<input type="text" inputmode="decimal" id="exp-amount" value="${esc(f.amount)}" data-input="exp-field" data-field="amount" autocomplete="off"></label>
      <label class="field">Date<input type="date" id="exp-date" max="${iso(comp.today)}" value="${esc(f.date)}" data-input="exp-field" data-field="date"></label></div>
    <p class="small muted">Amounts are in ${esc(ctx.country.currency)}.</p>
    <label class="field">Note (optional)<input type="text" id="exp-note" maxlength="120" value="${esc(f.note)}" data-input="exp-field" data-field="note"></label>
    ${f.receipt ? `<div class="photo-ph" role="img" aria-label="Receipt preview, mock" id="exp-receipt">${icon('camera', 28)}<span>Receipt preview (mock). No image is stored.</span></div>` : `<button class="btn secondary block" data-act="exp-receipt" id="exp-receipt-btn">${icon('camera', 20)}Add receipt photo (mock)</button>`}
    <div id="exp-policy" aria-live="polite">${policyHtml(ctx, f)}</div>
    ${f.error ? `<div class="notice warn" id="exp-error" role="alert">${icon('flag', 18)}<span>${esc(f.error)}</span></div>` : ''}
    ${f.done ? `<div class="notice good" id="exp-done" role="status">${icon('check', 18)}<span>${esc(f.done)}</span></div>` : ''}
    <button class="btn primary block" data-act="exp-submit" id="exp-submit">Submit claim</button>
  </section>`;
  return head(ctx, { title: 'Expense claims', lead: 'Add a claim, see the policy check, and approve claims as a manager. Sample data.' }) + `
  ${mgr ? `<section id="expense-approvals"><div class="section-head"><h2>Waiting for your approval</h2>${pill(`${pending.length} open`, pending.length ? 'warn' : 'good')}</div><ul class="group">${pending.length ? rows(pending, true) : '<li class="empty">No claims are waiting.</li>'}</ul></section>` : `${form}<section><h2>Your claims</h2><ul class="group" style="margin-top:12px" id="expense-list">${rows(cm.myExpenses().slice().reverse(), false)}</ul></section>`}
  <p class="foot-note">Sample data. Limits are sample amounts in local currency. Not a real expense system.</p>`;
}

// ---- HR and pay slips ----------------------------------------------------------------
export function hr(ctx) {
  const { t, fmt, comp, data, industry, country, cm } = ctx;
  const slips = comp.payslips.map((p) => `<li data-slip="${esc(p.id)}"><details class="row" style="display:block"><summary>${esc(country.payslipLabel)}, ${esc(p.month)}</summary>
    <table class="tbl" style="margin-top:8px"><tbody><tr><td>Base pay</td><td>${esc(fmt.money(p.base))}</td></tr><tr><td>Allowances</td><td>${esc(fmt.money(p.allowance))}</td></tr><tr><td>Deductions</td><td>-${esc(fmt.money(p.deduct))}</td></tr><tr><td><b>Net</b></td><td><b>${esc(fmt.money(p.net))}</b></td></tr></tbody></table>
    <p class="small muted">Sample amounts. Not real pay.</p></details></li>`).join('');
  const docs = comp.documents.map((d) => `<li class="row"><span class="tile-ic">${icon('note', 20)}</span><span class="row-main"><b>${esc(d.title)}</b><small>${esc(d.kind)}</small></span></li>`).join('');
  const bal = comp.balances.map((b) => `${esc(b.label)}: ${cm.remaining(b.id)} of ${b.total}`).join(' · ');
  return head(ctx, { title: 'HR and pay', lead: 'Sample pay slips and documents. Generated for the demo, never real pay information.' }) + `
  <div class="notice">${icon('flag', 18)}<span>Every amount and document here is sample data. The ${esc(country.payslipLabel.toLowerCase())} wording is generic and has no legal meaning.</span></div>
  <section class="card"><h2>${esc(data.rep.name)}</h2><p class="small muted">${esc(t(industry.companion.roles.rep))} · ${esc(data.city.name)} · Sample ID E-${String(1000 + (data.rep.name.length * 37) % 9000)}</p>
    <p class="small">${bal}</p><a class="btn secondary sm" href="#/companion/leave">Open leave</a></section>
  <section><h2>${esc(country.payslipLabel)}s</h2><ul class="group" style="margin-top:12px" id="payslips">${slips}</ul></section>
  <section><h2>Documents</h2><ul class="group" style="margin-top:12px">${docs}</ul></section>
  <p class="foot-note">Sample data. Not a real HR or payroll system.</p>`;
}

// ---- Actions ----------------------------------------------------------------------------
export const actions = {
  'leave-field': ({ ctx, data, value }) => { ((ctx.ui.leave ||= {}))[data.field] = value; return false; },
  'leave-submit': ({ ctx }) => {
    const f = ctx.ui.leave;
    const get = (id, fb) => document.getElementById(id)?.value ?? fb;
    Object.assign(f, { type: get('leave-type', f.type), from: get('leave-from', f.from), to: get('leave-to', f.to), note: get('leave-note', f.note) });
    const r = ctx.cm.requestLeave(f);
    f.error = r.ok ? '' : r.error;
    f.done = r.ok ? `Request sent to your ${ctx.t('{manager}')}: ${r.request.days} working day${r.request.days === 1 ? '' : 's'}.` : null;
    if (r.ok) Object.assign(f, { from: '', to: '', note: '' });
  },
  'leave-decide': ({ ctx, data }) => { ctx.cm.decideLeave(data.id, data.approve === '1', ctx.persona); },
  'exp-field': ({ ctx, data, value }) => {
    const f = ctx.ui.exp; f[data.field] = value;
    const box = document.getElementById('exp-policy');
    if (box && (data.field === 'amount' || data.field === 'category')) box.innerHTML = policyHtml(ctx, f);
    return false;
  },
  'exp-receipt': ({ ctx }) => { ctx.ui.exp.receipt = true; },
  'exp-submit': ({ ctx }) => {
    const f = ctx.ui.exp;
    const get = (id, fb) => document.getElementById(id)?.value ?? fb;
    Object.assign(f, { category: get('exp-category', f.category), amount: get('exp-amount', f.amount), date: get('exp-date', f.date), note: get('exp-note', f.note) });
    const r = ctx.cm.submitExpense(f);
    f.error = r.ok ? '' : r.error;
    f.done = r.ok ? `Claim sent to your ${ctx.t('{manager}')}. ${r.policy.over ? 'It is over the sample limit and needs a decision.' : 'It is within the sample limit.'}` : null;
    if (r.ok) Object.assign(f, { amount: '', note: '', receipt: false });
  },
  'exp-decide': ({ ctx, data }) => { ctx.cm.decideExpense(data.id, data.approve === '1', ctx.persona); },
};
void addDays;
