// Cue definitions for the three cuts. One cue = one narration clip + the on-screen action it introduces.
// `text` is shown as the caption and spoken; `tts` overrides the spoken form when needed.
// `pre` runs before the narration (silent, may be cut away); `act` runs as the narration starts.
// `cut: true` starts a new footage segment (what happened between is dropped).
// Every number spoken here was checked against the live app on Nov 9 to 11, 2026.

const REP = 'Sales rep · Nicole Johnson · Chicago';
const MGR = 'Area sales manager · Megan Davis';
const ADMIN = 'Sales operations lead · Hannah Clark';
const PHARMA = 'Medical rep · Lakshmi · Bengaluru';

// ---------- shared actions ----------
const A = {
  repSetup: async (h) => { await h.goto('?industry=cpg&country=US&persona=rep#/today'); },
  greet: async (h) => { await h.point(h.text('Good morning, Nicole'), { align: 0.3 }); },
  briefs: async (h) => { await h.point(await h.box(h.text('Briefs ready'))); },
  context: async (h) => {
    await h.point(await h.box(h.text('Recommendations apply to this context')), { align: 0.25 });
    await h.at(0.62);
    await h.point(h.page.locator('.acting-as-bar'), { scroll: false });
  },
  openBrief: async (h) => { await h.compact(true); await h.tap(h.text('Open next brief')); await h.text('Garcia Family Provisions').waitFor(); await h.unfocus(); },
  constraints: async (h) => { await h.point(await h.box(h.text('Commercial constraints verified')), { align: 0.2 }); },
  blitz: async (h) => {
    await h.tap('[data-act="toggle-blitz"]', { align: 0.25 });
    await h.point(await h.box(h.text('Rapid execution priority')), { align: 0.3 });
    await h.at(0.72);
    await h.tap('[data-act="toggle-blitz"]', { align: 0.25 });
    await h.unfocus();
  },
  outcomes: async (h) => {
    await h.point(h.card('A08-listnew'), { align: 0.12 });
    const steps = [[0.36, 'A08-oos'], [0.47, 'A08-topup'], [0.59, 'A08-promo'], [0.7, 'A08-pricetag'], [0.8, 'A08-deliveryday']];
    for (const [f, id] of steps) { await h.at(f); await h.point(h.card(id), { align: 0.12 }); }
  },
  conflict: async (h) => { await h.point('[data-act="ask-manager-conflict"][data-id="A08-deliveryday"]', { align: 0.5 }); },
  stale: async (h) => {
    await h.point(h.card('A08-topup'), { align: 0.12 });
    await h.at(0.6);
    await h.tap('[data-act="refresh-stale"][data-id="A08-topup"]', { align: 0.4 });
    await h.point(h.card('A08-topup'), { align: 0.12 });
  },
  drawer: async (h) => {
    await h.tap('[data-act="open-rule-drawer"][data-id="A08-deliveryday"]', { align: 0.35 });
    const steps = [[0.22, 'Policy owner'], [0.42, 'Named approver'], [0.6, 'Effective dates'], [0.8, 'never allowed to decide']];
    for (const [f, t] of steps) { await h.at(f); await h.point(await h.box(h.text(t)), { align: 0.35 }); }
  },
  closeDrawer: async (h) => { await h.tap('[data-act="close-rule-drawer"] >> nth=-1', { scroll: false, ring: false }); await h.unfocus(); },
  receipt: async (h) => {
    await h.tap(h.card('A08-oos').locator('summary', { hasText: 'What the agent saw' }), { align: 0.3 });
    await h.point(await h.box(h.card('A08-oos').getByText('Record kept')), { align: 0.25 });
  },
  flag: async (h) => {
    await h.tap('[data-act="open-flag-sheet"][data-id="A08-listnew"]', { align: 0.4 });
    await h.tap(h.page.locator('label', { has: h.page.locator('[data-change="pick-flag-reason"][value="Not true here"]') }), { scroll: false });
    await h.at(0.5);
    await h.point(h.text('Flagging creates a ticket'), { scroll: false });
    await h.at(0.74);
    await h.tap(h.page.getByRole('button', { name: 'Submit flag' }), { scroll: false });
    await h.point(await h.box(h.text('Flagged: Not true here')), { align: 0.4 });
  },
  store360: async (h) => {
    await h.point(await h.box(h.text('Score 82 of 100')), { align: 0.2 });
    await h.at(0.62);
    await h.point(h.text('of potential captured'), { align: 0.35 });
  },
  gaps: async (h) => { await h.point(await h.box(h.text('Open gaps')), { align: 0.08 }); },
  orderLines: async (h) => { await h.point(await h.box(h.text('Brightleaf Sparkling Lemon 330 ml')), { align: 0.2 }); },
  priceRule: async (h) => { await h.point(h.page.locator('li.rule', { hasText: 'Prices and promotions' }), { align: 0.3 }); },
  raise: async (h) => {
    const plus = '[data-act="qty"][data-d="1"] >> nth=2';
    await h.point(plus, { align: 0.45 });
    await h.at(0.25);
    // Direct mouse clicks on the same button: the app re-renders on each click and keeps scroll.
    for (let i = 0; i < 60; i++) {
      if (await h.page.locator('li.rule[data-triggered="true"]').count()) break;
      const b = await h.page.locator(plus).boundingBox();
      await h.page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
      await h.sleep(0.045);
    }
    if (!(await h.page.locator('li.rule[data-triggered="true"]').count())) throw new Error('Approval rule did not trip');
    await h.point('li.rule[data-triggered="true"]', { align: 0.45 });
  },
  submit: async (h) => {
    await h.tap('[data-act="submit-order"]', { align: 0.6, after: 0.9 });
    await h.point(await h.box(h.text('Pending approval')), { align: 0.35 });
  },
  toManager: async (h) => { await h.persona('manager'); await h.hash('#/manager'); await h.page.locator('[data-act="ex-approve"]').first().waitFor(); },
  megan: async (h) => { await h.point(await h.box(h.text('Megan Davis')), { align: 0.1, scroll: false }); },
  readiness: async (h) => {
    await h.tap('[data-act="toggle-mgr-readiness"]', { align: 0.2 });
    await h.point(await h.box('[data-act="toggle-mgr-readiness"]'), { align: 0.15 });
  },
  queueTop: async (h) => { await h.point(await h.box('[data-act="ex-approve"][data-id^="L"]'), { align: 0.25 }); },
  queueReason: async (h) => {
    await h.point('[data-act="ex-filter"][data-id="manager"]', { align: 0.25 });
    await h.at(0.5);
    await h.point(await h.box('[data-act="ex-approve"][data-id^="L"]'), { align: 0.25 });
  },
  approve: async (h) => {
    await h.tap('[data-act="ex-approve"][data-id^="L"]', { align: 0.4, after: 0.6 });
    await h.point(await h.box(h.text('Exception queue')), { align: 0.2 });
  },
  toAgents: async (h) => { await h.persona('admin'); await h.hash('#/agents'); await h.page.locator('[data-act="set-agents-tab"]').first().waitFor(); },
  tools: async (h) => { await h.tap('[data-act="set-agents-tab"][data-tab="tools"]', { align: 0.2 }); await h.point(await h.box('[data-act="test-raw-write"]'), { align: 0.3 }); },
  rawWrite: async (h) => { await h.tap('[data-act="test-raw-write"]', { align: 0.3, after: 0.7 }); await h.point(await h.box(h.text('Denied')), { align: 0.35 }); },
  toQuality: async (h) => { await h.hash('#/quality'); await h.page.locator('[data-act="set-quality-tab"]').first().waitFor(); },
  gate: async (h) => { await h.point(await h.box(h.text('Production Release Clearance Decision')), { align: 0.15 }); },
  goldenBlind: async (h) => {
    await h.tap('[data-act="set-quality-tab"][data-tab="golden"]', { align: 0.15 });
    await h.unfocus();
    await h.at(0.5);
    await h.tap('[data-act="set-quality-tab"][data-tab="blind"]', { align: 0.15 });
    await h.unfocus();
  },
  regression: async (h) => { await h.tap('[data-act="set-quality-tab"][data-tab="regression"]', { align: 0.15 }); await h.unfocus(); },
  toPharma: async (h) => { await h.goto('?industry=pharma&country=IN&persona=rep#/today'); await h.text('Good morning, Lakshmi').waitFor(); },
  lakshmi: async (h) => { await h.point(h.text('Good morning, Lakshmi'), { align: 0.3 }); },
  lakhs: async (h) => {
    await h.point(h.text('Open next brief'), { align: 0.3 });
    await h.at(0.55);
    await h.point(await h.box(h.text('Month to date')), { align: 0.4 });
  },
  askOffLabel: async (h) => {
    await h.tap('[data-act="as-open"]', { scroll: false });
    await h.type('#as-input', 'Can I recommend an off-label dose for children?');
    await h.tap('[data-act="as-send"]', { scroll: false, after: 0.8 });
  },
  refusal: async (h) => { await h.point(await h.box(h.text('clinical')), { align: 0.4 }); },
  notLive: async (h) => { await h.point(h.text('not a live model'), { align: 0.5 }); },
};

// ---------- core (about 6.5 minutes) ----------
const coreBeats = [
  { title: 'Five decisions, one plan', persona: REP, cues: [
    { id: 'c01', text: "This is Nicole Johnson's day. Nicole is a field sales rep for a consumer goods company in Chicago.", act: A.greet },
    { id: 'c02', text: 'Every day she makes five linked decisions: which stores to visit, in what order, what to do in each, what to order, and what to escalate.', act: A.briefs },
    { id: 'c03', text: 'In most field teams those decisions sit in separate tools. AI Assistor plans them together, and only for this market, channel and role.', act: A.context },
  ] },
  { title: 'The visit brief', persona: REP, cues: [
    { id: 'c04', text: 'Nicole opens the brief for her first store.', act: A.openBrief },
    { id: 'c05', text: "Before she sees anything, each recommendation is checked against the store's receiving window, depot stock and credit.", act: A.constraints },
    { id: 'c06', text: 'If the owner only has a minute, Blitz mode cuts the visit to the actions worth that minute.', act: A.blitz },
    { id: 'c07', text: 'Each recommendation ends in one of seven outcomes. On this one store you can see five: a suggestion, stale data, missing evidence, an open question, and a policy conflict.', act: A.outcomes },
    { id: 'c08', text: 'When two approved rules disagree, the system does not pick a winner. It sends the question to the manager.', act: A.conflict, hold: 1.2 },
    { id: 'c09', text: 'This card is held because the account data is eighteen days old against a fourteen-day limit. Nicole refreshes it, and it clears.', act: A.stale, hold: 1.0 },
    { id: 'c10', text: 'The chips open the rule behind it: version, owner, named approver, dates in force, and what it is never allowed to decide.', act: A.drawer },
    { id: 'c11', text: 'Every card keeps a receipt: rule version, data age, outcome and event ID. Rules decide; the model only words the reason.', pre: A.closeDrawer, act: A.receipt },
    { id: 'c12', text: "Nicole disagrees with one suggestion and flags it as not true here. That goes to the rule's owner to review.", act: A.flag, hold: 0.8 },
  ] },
  { title: 'In the store', persona: REP, cues: [
    { id: 'c13', text: 'Store 360 shows the open gaps and the store\'s potential: eighty-two out of a hundred, about seventy-two percent captured.', tts: 'Store three-sixty shows the open gaps and the store\'s potential: eighty-two out of a hundred, about seventy-two percent captured.', pre: async (h) => { await h.hash('#/account/A08'); }, act: A.store360 },
    { id: 'c14', text: 'Each gap carries an estimated value and the minutes it takes, so the visit goes where it pays.', act: A.gaps },
    { id: 'c15', text: 'The order agent drafts four lines. Nothing is sent until Nicole submits.', pre: async (h) => { await h.unfocus(); await h.hash('#/order/A08'); }, act: A.orderLines },
    { id: 'c16', text: 'Prices come from the retailer agreement. The agent cannot change them.', act: A.priceRule },
    { id: 'c17', text: 'Nicole raises the laundry pods. Past fifteen hundred dollars, the rule flips to needs approval.', act: A.raise, hold: 1.3 },
    { id: 'c18', text: 'She submits, and the order goes to her area sales manager instead of the depot.', act: A.submit, hold: 0.8 },
  ] },
  { title: 'The loop closes', persona: MGR, cues: [
    { id: 'c19', text: 'Now the same afternoon from the other side. Megan Davis manages the area.', pre: A.toManager, act: A.megan },
    { id: 'c20', text: 'Readiness shows one item still open before the season starts.', act: A.readiness },
    { id: 'c21', text: "Nicole's order is at the top of the exception queue, with the rule that stopped it.", act: A.queueTop, hold: 1.0 },
    { id: 'c22', text: "Every item shows the rep's reason and who it is routed to. The queue is for coaching, not policing.", act: A.queueReason },
    { id: 'c23', text: 'Megan approves it, and the open count drops.', act: A.approve, hold: 1.2 },
  ] },
  { title: 'Controls and evidence', persona: ADMIN, cues: [
    { id: 'c24', text: 'Every tool an agent can call is classed as read only or write guarded.', pre: A.toAgents, act: A.tools },
    { id: 'c25', text: 'Here an agent tries a raw database write. It is denied, and the attempt is logged.', act: A.rawWrite, hold: 1.2 },
    { id: 'c26', text: 'The release gate rolls every quality check into one decision. A single stop halts deployment.', pre: A.toQuality, act: A.gate, cut: true },
    { id: 'c27', text: 'Critical cases must pass at one hundred percent, and the held-out set must stay within five points of the main suite.', act: A.goldenBlind },
    { id: 'c28', text: 'Over one million automated checks run across twenty industries and eleven countries. All of it is on generated data.', act: A.regression, hold: 0.8 },
  ] },
  { title: 'The boundary', persona: PHARMA, cues: [
    { id: 'c29', text: 'The same engine, configured for a medical rep in Bengaluru.', pre: A.toPharma, act: A.lakshmi },
    { id: 'c30', text: 'Stores become hospitals, clinics and pharmacies, and values appear in lakhs.', act: A.lakhs },
    { id: 'c31', text: 'The rep asks whether she can recommend an off-label dose for children.', act: A.askOffLabel },
    { id: 'c32', text: 'It will not answer clinical questions. It offers to log a medical information request and points to approved material.', act: A.refusal, hold: 1.2 },
    { id: 'c33', text: 'These answers come from configured rules, not a live model, so the boundary does not depend on a prompt holding.', act: A.notLive },
  ] },
  { title: 'What comes next', persona: 'Working prototype · synthetic data', cues: [
    { id: 'c34', text: 'What you saw is a working prototype on synthetic data. The next step is a ninety-day pilot with one design partner, measured against matched territories.', act: async (h) => { await h.unfocus(); }, hold: 1.0 },
  ] },
];

// ---------- teaser (about 70 seconds) ----------
const END_CARD = `<div class="k">AI Assistor</div><div class="t">One plan across five field decisions.</div><div class="s">Working prototype on synthetic data. Looking for design partners for a ninety-day pilot.</div><div class="f">ai-assistor-sales-execution.vercel.app</div>`;
const teaserBeats = [
  { kicker: 'AI Assistor', title: 'Five decisions, one plan', persona: REP, cues: [
    { id: 't01', pre: async (h) => { await h.compact(false); }, text: 'Field reps make five linked decisions every day: who to visit, in what order, what to do in the store, what to order, and what to escalate. In most teams, those decisions sit in separate tools.', act: async (h) => { await A.greet(h); await h.at(0.5); await A.briefs(h); } },
  ] },
  { kicker: 'AI Assistor', title: 'Every answer shows its rule', persona: REP, cues: [
    { id: 't02', text: 'AI Assistor plans them together. Every recommendation ends in one of seven outcomes, and shows the rule, owner and data age behind it.',
      pre: async (h) => { await h.compact(true); await h.hash('#/brief/A08'); },
      act: async (h) => { await h.point(h.card('A08-topup'), { align: 0.12 }); await h.at(0.45); await h.tap('[data-act="open-rule-drawer"][data-id="A08-deliveryday"]', { align: 0.35 }); await h.at(0.72); await h.point(await h.box(h.text('Named approver')), { align: 0.35 }); } },
  ] },
  { kicker: 'AI Assistor', title: 'Limits stop the order', persona: REP, cues: [
    { id: 't03', text: 'When an order crosses an approval limit, it stops and goes to the manager.', pre: async (h) => { await A.closeDrawer(h); await h.hash('#/order/A08'); }, act: A.raise, hold: 1.0 },
  ] },
  { kicker: 'AI Assistor', title: 'The manager decides', persona: MGR, cues: [
    { id: 't04', text: "The manager sees the same exception, with the rep's reason, and decides in one tap.", pre: async (h) => { await h.tap('[data-act="submit-order"]', { align: 0.6, after: 0.9 }); await A.toManager(h); },
      act: async (h) => { await A.queueTop(h); await h.at(0.6); await h.tap('[data-act="ex-approve"][data-id^="L"]', { align: 0.4, after: 0.5 }); }, hold: 0.8 },
  ] },
  { kicker: 'AI Assistor', title: 'And it says no', persona: PHARMA, cues: [
    { id: 't05', text: 'Switch to pharma in India, and the same engine refuses an off-label dosage question and points to approved material.', pre: A.toPharma,
      act: async (h) => { await A.askOffLabel(h); await A.refusal(h); }, hold: 1.2 },
  ] },
  { kicker: ' ', title: 'Design partners', persona: '', cues: [
    { id: 't06', text: 'It is built to sit on top of the systems you already run. We are looking for design partners for a ninety-day pilot.', act: async (h) => { await h.unfocus(); await h.card_(END_CARD); }, hold: 1.5 },
  ] },
];


// ---------- extended (about 10.5 minutes): core plus four inserts ----------
const X = {
  wordingCard: (h) => h.card('A03-promo'),
};
const insertA = { title: 'Between visits', persona: REP, cues: [
  { id: 'a01', text: 'At another store, a promotion carries wording the commercial director has approved. The action stays locked until Nicole confirms she has read it.',
    pre: async (h) => { await h.hash('#/brief/A03'); }, act: async (h) => { await h.point(X.wordingCard(h), { align: 0.1 }); }, cut: true },
  { id: 'a02', text: 'Once she confirms, the action unlocks.',
    act: async (h) => { await h.tap('[data-change="read-exact-wording"]', { align: 0.45 }); await h.point(X.wordingCard(h).getByRole('button', { name: 'Approve' }), { align: 0.5 }); }, hold: 0.9 },
  { id: 'a03', text: 'After the visit she dictates her notes. In this prototype the dictation is simulated: simple keyword rules pull out the outcome, follow-ups and order intent for her to confirm.',
    pre: async (h) => { await h.unfocus(); await h.hash('#/companion/debrief/A08'); },
    act: async (h) => {
      await h.tap('[data-act="deb-sample"]', { align: 0.4, after: 1.2 });
      await h.at(0.45);
      await h.tap('[data-act="deb-review"]', { align: 0.4, after: 0.8 });
      await h.point(await h.box(h.text('Check each field')), { align: 0.12 });
    }, cut: true },
] };
const insertB = { title: 'How it is built', persona: ADMIN, cues: [
  { id: 'b01', text: 'For architects, this screen opens the design: five layers, from the screens people use down to the shared data and guardrails underneath.',
    pre: A.toAgents, act: async (h) => { await h.tap('[data-act="set-agents-tab"][data-tab="layers"]', { align: 0.15 }); await h.point(await h.box(h.text('Rep Mobile')), { align: 0.3 }); await h.at(0.6); await h.point(await h.box(h.text('Policy Registry')), { align: 0.4 }); } },
  { id: 'b02', text: 'This is one visit, traced step by step. Cut the visit to twenty minutes, and the planner refits it.',
    act: async (h) => { await h.tap('[data-act="set-agents-tab"][data-tab="trace"]', { align: 0.15 }); await h.at(0.45); await h.slide('[data-change="set-trace-time"]', 20); } },
  { id: 'b03', text: 'It ranks actions by value per minute and fits as many as the time allows. Give it seventy-five minutes, and lower-value actions come back.',
    act: async (h) => { await h.at(0.5); await h.slide('[data-change="set-trace-time"]', 75); } },
  { id: 'b04', text: 'Each gap is tracked from discovery, through any approval, to the order.',
    act: async (h) => { await h.tap('[data-act="set-agents-tab"][data-tab="gap"]', { align: 0.15 }); await h.at(0.55); await h.tap('[data-act="unlock-gap-step5"]', { align: 0.4 }); } },
  { id: 'c24', text: 'Every tool an agent can call is classed as read only or write guarded.', act: A.tools },
  { id: 'c25', text: 'Here an agent tries a raw database write. It is denied, and the attempt is logged.', act: A.rawWrite, hold: 1.2 },
  { id: 'b05', text: 'Account memory expires on a retention limit, and any item can be marked do not use, or forgotten.',
    act: async (h) => { await h.tap('[data-act="set-agents-tab"][data-tab="memory"]', { align: 0.15 }); await h.slide('[data-change="set-mem-expiry"]', 60); await h.at(0.6); await h.tap('[data-act="mem-toggle-use"][data-id="m1"]', { align: 0.4 }); } },
] };
const insertC = { title: 'How we know it works', persona: ADMIN, cues: [
  coreBeats[4].cues[2], coreBeats[4].cues[3], coreBeats[4].cues[4],
  { id: 'e01', text: 'Each risk type has an error budget. Breach one, and the gate moves from go to stop.',
    act: async (h) => { await h.tap('[data-act="set-quality-tab"][data-tab="errors"]', { align: 0.15 }); await h.at(0.5); await h.tap('[data-act="sim-error-breach"]', { align: 0.4, after: 0.6 }); } },
  { id: 'e02', text: 'The release decision exports as a sign-off record.',
    act: async (h) => { await h.tap('[data-act="set-quality-tab"][data-tab="release"]', { align: 0.15 }); await h.tap('[data-act="export-release-signoff"]', { align: 0.4 }); } },
] };
const insertD = { title: 'The economics', persona: ADMIN, cues: [
  { id: 'd01', text: 'Before anyone funds a rollout, the lab models what to expect.',
    pre: async (h) => { await h.lab(true); }, act: async (h) => { await h.tap('.lab-btn', { scroll: false, after: 0.8 }); }, cut: true },
  { id: 'd02', text: 'The A B planner shows how large a trial must be to detect a given lift.', tts: 'The A-B planner shows how large a trial must be to detect a given lift.',
    act: async (h) => { await h.tap('[data-act="set-lab-tab"][data-tab="ab"]', { scroll: false }); await h.slide('[data-change="set-ab-sample"]', 6000); } },
  { id: 'd03', text: 'The R O I model discounts for overlap, so planning, gaps and ordering do not each claim the same dollar. Raise the overlap, and net value falls.', tts: 'The R-O-I model discounts for overlap, so planning, gaps and ordering do not each claim the same dollar. Raise the overlap, and net value falls.',
    act: async (h) => { await h.tap('[data-act="set-lab-tab"][data-tab="roi"]', { scroll: false }); await h.at(0.6); await h.slide('[data-change="set-roi-overlap"]', 40); } },
  { id: 'd04', text: 'Cost is controlled by routing: rules handle routine decisions, a small model formats summaries, and a large model is used only for complex reviews, under a budget cap.',
    act: async (h) => { await h.tap('[data-act="set-lab-tab"][data-tab="dec"]', { scroll: false }); await h.point(await h.box(h.text('Tier 1: Deterministic Rules')), { align: 0.3 }); await h.at(0.45); await h.point(await h.box(h.text('Tier 2: Lightweight Model')), { align: 0.3 }); await h.at(0.68); await h.point(await h.box(h.text('Tier 3: Frontier Model')), { align: 0.3 }); } },
  { id: 'd05', text: 'Value breaks into reach, acceptance and completion. Drop acceptance, and the diagnostic moves to the weakest lever.',
    pre: async (h) => { await h.tap('[data-act="close-lab-modal"] >> nth=-1', { scroll: false, ring: false }); await h.lab(false); await h.hash('#/pm'); },
    act: async (h) => { await h.tap('[data-act="set-pm-tab"][data-tab="metric"]', { align: 0.15 }); await h.at(0.5); await h.slide('[data-change="set-pm-accept"]', 70); await h.point(await h.box(h.text('Opportunity Diagnostic')), { align: 0.45 }); }, cut: true },
  { id: 'd06', text: 'It also checks that recommendations are accepted at similar rates across tiers and territories. Tighten the threshold, and a lagging segment is flagged for review.',
    act: async (h) => { await h.tap('[data-act="set-pm-tab"][data-tab="bias"]', { align: 0.15 }); await h.at(0.58); await h.slide('[data-change="set-pm-bias-thresh"]', 12, { steps: 3, every: 0.25 }); await h.point(await h.box(h.text('Review needed')), { align: 0.2 }); } },
] };
const extendedClose = { title: 'What comes next', persona: 'Working prototype · synthetic data', cues: [
  { id: 'x01', text: 'To sum up: one plan across five decisions, controls that say no when they should, and evidence built in.', act: async (h) => { await h.unfocus(); } },
  { id: 'x02', text: "What you saw runs on synthetic data. Proving it in the field is the pilot's job." },
  { id: 'x03', text: 'Month one connects your data and configures your market. Month two runs in matched territories beside comparison territories. Month three measures the change in gross margin before any wider rollout.', hold: 1.0 },
] };
// Core gets the two sections buyers and investors ask about first: governance in the field and the economics.
const econCore = { title: 'The economics', persona: ADMIN, cues: [insertD.cues[0], insertD.cues[2], insertD.cues[3]] };
const coreCut = [coreBeats[0], coreBeats[1], coreBeats[2], insertA, coreBeats[3], coreBeats[4], econCore, coreBeats[5], coreBeats[6]];
const extendedBeats = [coreBeats[0], coreBeats[1], coreBeats[2], insertA, coreBeats[3], insertB, insertC, insertD, coreBeats[5], extendedClose];

export const CUTS = {
  extended: { setup: A.repSetup, beats: extendedBeats, slate: { k: 'Product demo · extended', t: 'AI Assistor for field sales execution', s: 'The full walkthrough: the rep, the manager, the controls, the evidence and the economics.' } },
  core: { setup: A.repSetup, beats: coreCut, slate: { k: 'Product demo', t: 'AI Assistor for field sales execution', s: 'One plan across five field decisions, with controls that say no when they should.' } },
  teaser: { setup: A.repSetup, beats: teaserBeats, slate: null },
};
export { A, REP, MGR, ADMIN, PHARMA };
