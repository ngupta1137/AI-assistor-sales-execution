// Insurance distribution: independent agencies, commercial brokers and bank branches.
// All policy product, firm and individual names are fictional.

import assistant from './insurance.assistant.js';
import companion from './insurance.companion.js';

/** @type {import('../schema.js').IndustryPack} */
export default {
  ...assistant,
  ...companion,
  id: 'insurance',
  name: 'Insurance distribution',
  tagline: 'Independent agencies, brokers and branch partners',
  icon: 'shield',
  accent: '#1E3A8A',
  vocab: {
    account: 'agency', accounts: 'agencies',
    contact: 'principal', contacts: 'principals',
    rep: 'agency development manager', reps: 'agency development managers',
    manager: 'territory sales director', kam: 'broker network director',
    offering: 'policy product', offerings: 'policy products',
    order: 'allocation', orders: 'allocations',
    visit: 'agency review', visits: 'agency reviews',
  },
  personas: {
    rep: 'Agency development manager',
    manager: 'Territory sales director',
    admin: 'Distribution operations lead',
  },
  segments: [
    {
      id: 'agencies', name: 'Independent agencies', share: 0.45, visitMinutes: [30, 45],
      style: 'Quarterly review with the agency principal, focusing on commercial lines production and binder conversion.',
      annualValue: [140000, 550000], hours: [9 * 60, 17 * 60], orderQty: [4, 20],
      types: [
        { type: 'Independent agency', naming: 'business', words: { en: ['Insurance Group', 'Risk Partners', 'Underwriters'], pt: ['Corretora', 'Seguros'], es: ['Agencia de Seguros', 'Asesores'], de: ['Assekuranz', 'Versicherungsbüro'], id: ['Pialang Asuransi', 'Agen Asuransi'], fr: ['Cabinet Assurance', 'Courtage'] } },
      ],
      roles: ['Principal agent', 'Commercial lines manager', 'Senior producer'],
    },
    {
      id: 'brokers', name: 'Corporate brokerage firms', share: 0.3, key: true, visitMinutes: [40, 60],
      style: 'Structured meeting with the corporate broker team on complex risk placements and portfolio underwriting appetite.',
      annualValue: [350000, 1400000], hours: [9 * 60, 18 * 60], orderQty: [8, 35],
      types: [
        { type: 'Commercial brokerage', naming: 'institution', words: { en: ['Broking Services', 'Risk Advisory', 'Commercial Brokers'], pt: ['Corretora Corporativa', 'Gestão de Risco'], es: ['Correduría', 'Brokers Comerciales'], de: ['Maklerhaus', 'Risikoberatung'], id: ['Broker Komersial', 'Konsultan Risiko'], fr: ['Courtier Entreprises', 'Conseil Risque'] } },
      ],
      roles: ['Managing partner', 'Corporate account director', 'Placement specialist'],
    },
    {
      id: 'branches', name: 'Bank branch partners', share: 0.25, visitMinutes: [20, 35],
      style: 'Monthly cadence with branch loan officers and personal bankers on bancassurance product activation.',
      annualValue: [75000, 320000], hours: [9 * 60, 16 * 60], orderQty: [2, 12],
      types: [
        { type: 'Bank branch partner', naming: 'institution', words: { en: ['Branch Hub', 'Financial Center', 'Community Banking'], pt: ['Agência Bancária', 'Ponto Financeiro'], es: ['Sucursal Bancaria', 'Centro Financiero'], de: ['Bankfiliale', 'Finanzpunkt'], id: ['Kantor Cabang', 'Mitra Bank'], fr: ['Agence Bancaire', 'Pôle Financier'] } },
      ],
      roles: ['Branch manager', 'Bancassurance officer', 'Client relationship lead'],
    },
  ],
  offerings: [
    { id: 'commprop', name: 'Northshield Commercial Property', category: 'Property', price: 4200, unit: 'binder', status: 'core' },
    { id: 'genliab', name: 'Broadguard General Liability Plan', category: 'Casualty', price: 2800, unit: 'binder', status: 'core' },
    { id: 'fleetauto', name: 'Fleetwatch Commercial Auto', category: 'Commercial Auto', price: 3400, unit: 'binder', status: 'core' },
    { id: 'profliab', name: 'Apexshield Professional Indemnity', category: 'Professional', price: 1950, unit: 'binder', status: 'core' },
    { id: 'cybercov', name: 'Datafortress Cyber Risk Policy', category: 'Specialty', price: 2200, unit: 'binder', status: 'focus' },
    { id: 'tradecred', name: 'Horizon Trade Credit Coverage', category: 'Financial Lines', price: 3100, unit: 'binder', status: 'focus' },
    { id: 'smebundle', name: 'Cornerstone Enterprise Business Suite', category: 'Packaged', price: 1600, unit: 'binder', status: 'focus' },
    { id: 'termbanca', name: 'Lifeguard Credit Life Bancassurance', category: 'Life', price: 950, unit: 'binder', status: 'new' },
    { id: 'inlandmar', name: 'Wayfarer Inland Marine Transit', category: 'Marine', price: 2400, unit: 'binder', status: 'new' },
  ],
  actions: [
    {
      id: 'quoteconv', type: 'Examine quoted submission conversion', agent: 'gap', effort: 14, evidence: 'note', value: [220, 1100], uses: 'core',
      title: 'Analyze quote turnaround on {product}',
      saw: 'The producer submitted {n} quotes for {product} with low binder issuance in the past 60 days.',
      compared: 'Peer distribution partners in {city} converting quotes into bound coverage at higher rates.',
      why: [
        'Unbound quotes expire and represent unmonetized underwriting effort.',
        'Identifying competitive rate gaps helps clarify current carrier appetite.',
        'Targeted follow-up on outstanding quotes recovers active pipeline value.',
      ],
      talk: [
        'Review open commercial quotes with {person} to pinpoint binding hurdles.',
        'Explain current carrier flexibility on risk engineering requirements.',
        'Schedule an underwriter call for complex commercial submissions.',
      ],
    },
    {
      id: 'cyberapp', type: 'Clarify underwriting appetite', agent: 'gap', effort: 12, evidence: 'note', value: [180, 850], uses: 'focus',
      title: 'Present underwriting appetite guidelines for {product}',
      saw: 'The agency submitted {n} out-of-appetite applications that were declined this quarter.',
      compared: 'Agencies using the digital risk intake guide that experience minimal declination.',
      why: [
        'Declined submissions consume agency staff time and create producer friction.',
        'Clear criteria direct producer attention toward target industry classes.',
        'Expanding eligible risk classes increases profitable premium volume.',
      ],
      talk: [
        'Walk through the target risk classification sheet with {person}.',
        'Highlight newly admitted industry categories and preferred deductible tiers.',
      ],
      guardrail: 'Underwriting eligibility follows published carrier appetite rules. Reps never bind coverage or waive exclusions.',
    },
    {
      id: 'brochuredel', type: 'Distribute approved brochure', agent: 'gap', effort: 8, evidence: 'signature', value: [90, 420], uses: 'new',
      title: 'Provide approved policy brochure for {product}',
      saw: 'Producer inquiries indicate client interest in {product} without current marketing documentation on file.',
      compared: 'Partner agencies displaying approved literature that generate three times more client inquiries.',
      why: [
        'Producers require compliance-cleared literature to present coverage options accurately.',
        'Signed distribution receipts document that regulatory consumer disclosures were provided.',
        'Clear product summaries accelerate customer decision cycles during policy reviews.',
      ],
      talk: [
        'Hand over the latest compliance-approved marketing collateral to {person}.',
        'Point out the summary of covered perils and standard policy exceptions.',
        'Collect a signed acknowledgment of promotional material receipt.',
      ],
      guardrail: 'Product facts come strictly from the approved brochure. Agents never formulate custom coverage promises.',
    },
    {
      id: 'volplan', type: 'Establish quarterly binder plan', agent: 'order', effort: 15, evidence: 'note', value: [300, 1600], uses: 'core', segments: ['agencies', 'brokers'],
      title: 'Establish seasonal binder plan for {product}',
      saw: 'Commercial policy renewals and property additions peak around {event}, {eventDays} days away.',
      compared: 'Historical binder activity for this partner during corresponding prior renewal seasons.',
      why: [
        'Proactive capacity reservation ensures underwriting bandwidth during peak renewal weeks.',
        'Agreed binder projections assist regional reinsurance allocation planning.',
        'Structured planning helps the agency attain top-tier commission bonus tiers.',
      ],
      talk: [
        'Review the expiration ledger with {person} to map anticipated premium volume.',
        'Confirm underwriting support commitments for accounts above threshold premium.',
      ],
    },
    {
      id: 'bancatrain', type: 'Conduct product briefing session', agent: 'order', effort: 18, evidence: 'note', value: [140, 720], uses: 'new', segments: ['branches'],
      title: 'Deliver bancassurance product briefing on {product}',
      saw: 'New retail banking personnel joined this branch within the last {weeks} weeks without carrier orientation.',
      compared: 'Branch locations where staff completed carrier product training showing elevated attachment rates.',
      why: [
        'Frontline loan officers must recognize eligible borrower coverage triggers.',
        'Accurate referral hand-offs maintain full consumer compliance standards.',
        'Consistent briefing strengthens carrier presence within bank retail networks.',
      ],
      talk: [
        'Review the simplified eligibility checklist with the branch manager.',
        'Demonstrate the digital referral portal submission workflow.',
      ],
    },
    {
      id: 'bookrecon', type: 'Conduct annual retention audit', agent: 'order', effort: 12, evidence: 'note', value: [160, 950], uses: 'core',
      title: 'Review book retention metrics for {product}',
      saw: 'Policy renewal retention fell by {pct} percent across maturing accounts over the prior two months.',
      compared: 'Benchmark agency retention standards across the regional commercial territory.',
      why: [
        'Retaining existing policyholders requires significantly lower operational effort than winning new accounts.',
        'Early identification of lapsing accounts enables competitive pricing reviews.',
        'Protecting renewal cash flows stabilizes agency and carrier profitability.',
      ],
      talk: [
        'Examine upcoming expirations with {person} to flag accounts shopping coverage.',
        'Evaluate whether multi-policy package endorsements can improve account stickiness.',
      ],
    },
    {
      id: 'cadenceopt', type: 'Optimize agency consultation rhythm', agent: 'planner', effort: 5, evidence: 'note', value: [40, 180], uses: 'none',
      title: 'Adjust consultation schedule to avoid producer rush',
      saw: 'Recent meetings conflicted with Monday morning underwriting submission cutoffs.',
      compared: 'Agency operating hours and preferred commercial intake windows.',
      why: [
        'Holding reviews during calmer windows yields undivided principal attention.',
        'Respecting agency workflow enhances partner trust and collaboration.',
        'Optimized sequencing reduces travel downtime across the territory.',
      ],
      talk: [
        'Verify the most effective weekday slot with {person} for ongoing strategy calls.',
        'Update route coordination notes for subsequent field itinerary cycles.',
      ],
    },
    {
      id: 'licenselog', type: 'Verify credential registry', agent: 'gap', effort: 6, evidence: 'note', value: [30, 150], uses: 'none',
      title: 'Verify producer licensing and regulatory compliance records',
      saw: 'State insurance department registry indicates upcoming license renewals for agency staff.',
      compared: 'Carrier compliance guidelines requiring valid broker credentials on file.',
      why: [
        'Carrier appointments cannot legally process commissions for expired licenses.',
        'Maintaining active records protects both agency and carrier from audit sanctions.',
        'Documenting credential currency is required prior to processing bound business.',
      ],
      talk: [
        'Check renewal submission dates with {person} for active agency producers.',
        'Remind the agency administrator to upload newly issued appointment certificates.',
      ],
      guardrail: 'The system logs credential verification status. It never dispenses legal advice or waives state filing requirements.',
    },
  ],
  orderReasons: {
    core: ['Reflects quarterly commercial renewal pipeline across maturing accounts.', 'Supports historical binder volume across maturing property accounts.', 'Matches agency production capacity across core risk classes.'],
    focus: ['Expands specialty line adoption among corporate commercial clients.', 'Addresses uninsured balance sheet vulnerabilities highlighted by recent claims trends.'],
    new: ['Trial placement volume agreed for the introductory commercial release.', 'Initial bancassurance retail allocation for qualified borrower profiles.'],
  },
  orderRules: [
    { kind: 'totalAbove', amount: 35000, route: 'manager', text: '{Orders} with projected premium commitments above {limit} require {manager} endorsement.' },
    { kind: 'info', text: 'Premium ratings and commission tiers adhere to carrier schedule filings. Reps cannot alter contract rates.' },
  ],
  overrideReasons: [
    { label: 'Agency principal away at broker conference', route: 'manager' },
    { label: 'Agency maintains exclusive placement treaty with another carrier', route: 'kam' },
    { label: 'Commercial risk outside carrier underwriting appetite', route: 'manager' },
    { label: 'State producer credentials pending renewal certification', route: 'manager' },
    { label: 'Insufficient review time during scheduled appointment', route: 'manager' },
    { label: 'Other operational reason', route: 'manager' },
  ],
  outcomeReasons: [
    { label: 'Principal declined product allocation', blocked: false },
    { label: 'Carrier underwriting appetite suspended for category', blocked: true },
    { label: 'Agency license status inactive or suspended', blocked: true, route: 'kam' },
    { label: 'Producer occupied with emergency client claim settlement', blocked: false },
  ],
  visitNotes: [
    'Quarterly production review completed, agreed on target pipeline volume.',
    'Underwriting appetite guidelines presented to commercial producers.',
    'Principal unavailable; conducted portfolio audit with commercial lines supervisor.',
    'Product brochures delivered with signed distributor acknowledgment.',
    'Credential documentation reviewed and logged for annual carrier compliance.',
  ],
  kpis: [
    { id: 'retention', label: 'Commercial retention rate', format: 'pct', range: [70, 98], target: 88 },
    { id: 'quoteconv', label: 'Submission bind ratio', format: 'pct', range: [15, 60], target: 35 },
    { id: 'boundvol', label: 'Quarterly bound policies', format: 'count', range: [8, 45], target: 25 },
    { id: 'crosssell', label: 'Multi-line penetration', format: 'pct', range: [20, 65], target: 45, segments: ['agencies', 'brokers'] },
    { id: 'activeprods', label: 'Active producing agents', format: 'pct', range: [40, 95], target: 75 },
  ],
  guardrails: [
    { id: 'all1', agent: 'all', text: 'Agents never give personal financial advice, quote binding rates, or approve claims. Product details come from the approved brochure only.' },
    { id: 'gap1', agent: 'gap', text: 'Underwriting appetite guidance references published carrier guidelines without binding exceptions.' },
    { id: 'order1', agent: 'order', text: 'Binder volume allocations reflect producer capacity and historical submissions, never mandatory sales quotas.' },
    { id: 'planner1', agent: 'planner', text: 'Corporate brokerage reviews require joint participation with the broker network director.' },
  ],
  problems: [
    { title: 'Agency development reps visit out of habit rather than portfolio potential', text: 'Territory reps drop into familiar neighborhood offices while high-volume corporate brokerages with significant commercial risk portfolios remain underserved.', capability: 'potential' },
    { title: 'Submissions stall in underwriting because appetite is misunderstood', text: 'Producers spend hours drafting applications that fall outside carrier parameters, learning of declinations only after commercial prospects shop elsewhere.', capability: 'gaps' },
    { title: 'Agency visits lack structured agendas tailored to production gaps', text: 'Field managers hold informal coffee catch-ups rather than presenting data-driven recommendations on lagging line conversion or renewal protection.', capability: 'ranking' },
    { title: 'Territory schedules clash with commercial renewal cycles', text: 'Field visits are plotted on rigid calendar rotations rather than aligning with major policy expiration windows when commercial clients renew.', capability: 'planning' },
    { title: 'Premium targets are arbitrary numbers detached from pipeline reality', text: 'Management demands round premium quotas without visibility into actual expiration lists, quote backlogs or local market capacity.', capability: 'order' },
    { title: 'Carrier agreements and distribution commitments leave no audit trail', text: 'Co-op advertising commitments, product training deliveries and underwriting understandings remain scattered across notebooks and memory.', capability: 'evidence' },
  ],
  assistant: [
    { q: 'Why is this agency prioritized on today schedule?', a: 'It represents substantial bound premium potential and has several high-value quotes approaching expiration that require producer coordination.' },
    { q: 'Which partners need an underwriting appetite refresher?', a: 'Agencies with declining bind ratios or multiple recent declinations in commercial specialty lines should receive the updated appetite sheet.' },
    { q: 'How should I present a newly released policy line?', a: 'Provide the compliance-approved product brochure, walk through eligible industry classifications, and review sample rating benchmarks.' },
    { q: 'Can I quote a custom premium rate for a prospective client?', a: 'No. Rates and terms are determined exclusively by authorized underwriters. Reps explain appetite and collect submission data.' },
    { q: 'How are binder allocations calculated?', a: 'Projections derive from historical submission volume, local commercial renewal calendars, and verified producer headcount.' },
    { q: 'Where does an agency override notification route?', a: 'It routes to your territory sales director with your logged explanation to refine future pipeline expectations.' },
    { q: 'Which commercial brokers have not been visited this quarter?', a: 'Check the brokerage accounts showing extended contact gaps. The Visit Planner schedules them for upcoming executive itineraries.' },
    { q: 'What does a low confidence rating indicate on an action?', a: 'Low confidence indicates sparse historical submission data for that line, so verify commercial interest with the principal before pitching.' },
  ],
  storyline: [
    'Select Insurance distribution and the prospect home country. Note that figures represent sample demonstration data.',
    'Today screen: the agency development manager territory overview, ranked by premium opportunity with local financial terminology.',
    'Open the premier agency review brief. Approve the quote conversion task. Override the marketing collateral task with reason code.',
    'Examine an action detail card: review the strategic context, talking points, and the strict underwriting appetite guardrail.',
    'Allocation builder: review projected binder lines, adjust target volume, and observe the director approval threshold trigger.',
    'Complete the agency review. Switch to the territory sales director persona to view the logged override in the oversight queue.',
    'Agent controls view: demonstrate the stop control on the Order agent and verify that suggested allocations pause cleanly.',
    'Configuration overview: demonstrate how agency tiers, broker terminology, and commercial KPIs adapt as configured parameters.',
  ],
  forbidden: ['patient', 'clinic', 'hospital', 'physician', 'dosage', 'prescription', 'harvest', 'crop', 'fertilizer', 'pesticide', 'mechanic', 'repair shop'],
};
