// Comprehensive Domain Intelligence for all 20 industry verticals.
// Captures authentic route-to-market channels, frontline friction, decision trees,
// regulatory firewalls, and deep operational use cases.
// Fictional demonstration content. Plain language, short sentences, zero em dashes.

export const DOMAIN_INTELLIGENCE = {
  cpg: {
    id: 'cpg',
    name: 'Consumer Goods',
    tagline: 'Supermarkets, convenience stores and independent shops',
    icon: 'cart',
    accent: '#0F766E',
    channelModel: 'Direct-Store-Delivery (DSD) and Two-Tier Distributor Wholesale',
    decisionMakers: ['Category Merchant', 'Store General Manager', 'Receiving Department Lead', 'Independent Shop Owner'],
    economicDrivers: 'Share of shelf, trade promotion allowance lift, shrinkage control, distributor reorder velocity',
    frontlinePainPoints: [
      {
        title: 'Phantom inventory and back-room disconnect',
        friction: 'Retailer inventory systems report stock present, but the shelf sits empty while cases gather dust in the stockroom.',
        costOfFailure: 'Shoppers substitute the competitor brand within 8 seconds. Up to 15% of promotional lift is lost.',
        solvedBy: 'Diagnostics agent flags out-of-stock from computer vision shelf scans and prompts stockroom retrieval before ordering.'
      },
      {
        title: 'Unenforced planogram agreements and lost facings',
        friction: 'Agreed eye-level facings negotiated at head office are quietly squeezed out by store staff or competitor reps.',
        costOfFailure: 'Permanent erosion of brand baseline sales. Breaches joint business planning contractual space commitments.',
        solvedBy: 'Computer vision shelf audit matches photo against agreed cluster planogram and prepares facing restoration talking points.'
      },
      {
        title: 'Secondary display compliance leakage',
        friction: 'Paid trade marketing end-caps and lobby dump bins are either never erected or delayed by several critical days.',
        costOfFailure: 'Wasted trade spend allowance with zero incremental volume lift during peak promotional windows.',
        solvedBy: 'Visit planner tracks promotional cycle calendars and schedules pre-stocked display build tasks on the start date.'
      },
      {
        title: 'Habitual reordering of core lines only',
        friction: 'Reps re-enter the previous order quantity rather than selling high-margin NPD innovations or seasonal packs.',
        costOfFailure: 'Category stagnation. Competitors capture white-space growth in adjacent snacking and wellness categories.',
        solvedBy: 'Order suggestion engine computes whitespace from peer clusters and suggests pre-sized introductory trial cases.'
      },
      {
        title: 'Rushed distributor delivery friction and invoice disputes',
        friction: 'Delivery trucks arrive during store rush hours or receiving bay lockouts, leading to refused deliveries.',
        costOfFailure: 'Return logistics expenses, restocking charges, and immediate out-of-stocks on high-velocity items.',
        solvedBy: 'Route planner enforces account receiving bay operating windows and pre-fills delivery confirmation slips.'
      }
    ],
    coreDecisions: {
      coverage: {
        question: 'Which stores get rep visits versus telesales or distributor pass-through?',
        traditionalFlaw: 'Reps visit the friendliest store owners weekly while high-velocity hypermarkets get inadequate attention.',
        assistorSolution: 'Dynamic potential scoring calculates store throughput, category growth rate, and display capacity.',
        kpi: 'High-potential store coverage rate'
      },
      route: {
        question: 'What route schedule minimizes travel while hitting receiving dock cutoffs?',
        traditionalFlaw: 'Fixed geographic cycles that ignore delivery schedules, morning restocking rushes, and peak shopper hours.',
        assistorSolution: 'Sequence visits to arrive during morning restocking windows when managers have authority to sign displays.',
        kpi: 'Restocking window adherence'
      },
      inVisit: {
        question: 'What physical tasks must the rep complete in the first 15 minutes?',
        traditionalFlaw: 'Reps chat with the owner, inspect random shelves, and write down an order without fixing gaps.',
        assistorSolution: 'Prioritized task stack: 1. Fix out-of-stock from backroom; 2. Correct planogram facings; 3. Build display; 4. Propose order.',
        kpi: 'In-visit task execution rate'
      },
      order: {
        question: 'What exact quantities of core, focus, and new lines should be ordered today?',
        traditionalFlaw: 'Reps ask the store owner "what do you need today?" and take whatever small reorder is offered.',
        assistorSolution: 'Algorithmic rate-of-sale forecasting calculates safety stock, promotional uplift, and warehouse lead time.',
        kpi: 'Lines per order and order fill rate'
      },
      evidence: {
        question: 'Did the promotional display get built and does the shelf match the contract?',
        traditionalFlaw: 'Self-reported tick boxes with zero objective proof or time-stamped visual audit.',
        assistorSolution: 'Time-stamped photo capture with planogram bounding box analysis and manager sign-off.',
        kpi: 'Audit-verified execution rate'
      }
    },
    complianceFirewalls: [
      {
        rule: 'Trade promotion allowance cap',
        rationale: 'Reps must never exceed pre-allocated trade funding limits or offer unauthorized free goods.',
        enforcement: 'Order engine hard-blocks free-case or discount overrides exceeding the agreed promotional contract.'
      },
      {
        rule: 'Retailer head-office listing adherence',
        rationale: 'Reps cannot introduce unauthorized SKUs into national supermarket chains without central authorization.',
        enforcement: 'Offering catalog restricts available lines by account segment and banner tier.'
      }
    ],
    deepUseCases: [
      {
        title: 'Secondary end-cap activation before bank holiday weekend',
        scenario: 'A major supermarket has paid promotion space booked for sparkling beverages starting Thursday morning.',
        agentPreparation: 'Planner identifies the promotional start date, confirms POS material in the rep vehicle, and generates display task.',
        repExecution: 'Rep arrives at 8:00 AM, confirms pallet delivery at the dock, builds the aisle-end display, and captures verification photo.',
        verifiedOutcome: 'Display live 24 hours before weekend traffic surge; 34% volume lift captured with verified photo proof.'
      },
      {
        title: 'Independent grocer whitespace expansion',
        scenario: 'An independent grocer sells high volumes of staple tea but stocks zero premium granola bars or lentil crisps.',
        agentPreparation: 'Whitespace algorithm spots 12 peer stores in the neighborhood generating 22% incremental basket revenue from healthy snacks.',
        repExecution: 'Rep shows the peer sell-through benchmark, offers a single-case introductory tier, and secures counter-adjacent space.',
        verifiedOutcome: 'Account range expands by 2 lines; reorder triggered on next scheduled visit cycle.'
      }
    ]
  },

  pharma: {
    id: 'pharma',
    name: 'Pharmaceuticals',
    tagline: 'Hospitals, clinics and pharmacies',
    icon: 'pill',
    accent: '#6D28D9',
    channelModel: 'Tender-Based Hospital Procurement, Specialist HCP Detailing, and Retail Pharmacy Distribution',
    decisionMakers: ['Head of Hospital Pharmacy', 'Formulary Committee Chair', 'Consultant Physician', 'Community Pharmacist'],
    economicDrivers: 'Formulary inclusion tier, script decile adoption, patient therapy continuity, pharmacy shelf availability',
    frontlinePainPoints: [
      {
        title: 'Formulary tier restrictions and protocol delays',
        friction: 'New therapies are approved centrally but remain blocked at hospital formulary and value committees for months.',
        costOfFailure: 'Delayed patient access, stalled therapy adoption, and lost tender cycles.',
        solvedBy: 'Account 360 tracks formulary review milestones and prompts medical liaison dossier submissions.'
      },
      {
        title: 'HCP access restrictions and 90-second hallway detailing',
        friction: 'Physicians have severe time constraints and zero patience for generic product pitches.',
        costOfFailure: 'Cancelled calls, superficial interactions, and no change in prescribing habits.',
        solvedBy: 'Action ranker synthesizes the physician specialty, previous inquiries, and approved leave-behind into 2 crisp points.'
      },
      {
        title: 'Strict sample accountability and regulatory audit risk',
        friction: 'Physical sample drops require meticulous batch tracking, physical signatures, and strict per-call limits.',
        costOfFailure: 'Regulatory inspection penalties, personal compliance liability, and severe corporate sanctions.',
        solvedBy: 'Automated sample policy validation locks quantities to the compliant per-call cap and captures physical digital signatures.'
      },
      {
        title: 'Retail pharmacy prescription leakage',
        friction: 'Hospitals prescribe the therapy, but local retail pharmacies do not stock it, forcing patient substitution.',
        costOfFailure: 'Up to 30% first-fill abandonment; wasted specialist detailing effort.',
        solvedBy: 'Route planner links high-prescribing clinic clusters to surrounding dispensing pharmacies for immediate stocking calls.'
      },
      {
        title: 'Off-label promotion liability',
        friction: 'Reps under commercial pressure risk answering off-label clinical efficacy questions or making comparative claims.',
        costOfFailure: 'Catastrophic regulatory fines, criminal compliance investigations, and reputation loss.',
        solvedBy: 'Rigid assistant refusal guardrail refuses clinical claims and routes off-label inquiries to Medical Information.'
      }
    ],
    coreDecisions: {
      coverage: {
        question: 'Which HCPs and clinic departments should be prioritized in this therapy cycle?',
        traditionalFlaw: 'Reps visit friendly physicians who prescribe low volumes while decile 9 and 10 prescribers are under-called.',
        assistorSolution: 'Prescriber decile ranking and patient flow mapping direct rep calls to high-impact clinical practitioners.',
        kpi: 'Decile 8 to 10 HCP reach frequency'
      },
      route: {
        question: 'How do we schedule calls around physician clinic operating hours and grand rounds?',
        traditionalFlaw: 'Turning up during patient consultation blocks, resulting in waiting room churn and missed calls.',
        assistorSolution: 'HCP consultation scheduling windows schedule calls during morning department coffee breaks or between clinic slots.',
        kpi: 'Successful HCP interaction rate'
      },
      inVisit: {
        question: 'What is the primary scientific and educational objective for this specific call?',
        traditionalFlaw: 'Rep delivers a standard memorized slide deck regardless of what the physician discussed last time.',
        assistorSolution: 'Contextual call brief recalls previous physician inquiries and highlights the latest approved clinical reprint.',
        kpi: 'Target message delivery compliance'
      },
      order: {
        question: 'What sample requests and commercial pharmacy stocking orders should be booked?',
        traditionalFlaw: 'Loose sample handoffs without signed receipts or haphazard pharmacy reorders.',
        assistorSolution: 'Sample reconciliation within strict compliance quotas; pharmacy inventory replenishment based on script run rate.',
        kpi: 'Pharmacy stocking depth and sample compliance'
      },
      evidence: {
        question: 'How is call completion and medical compliance verified?',
        traditionalFlaw: 'Vague post-call notes typed hours later in the car park.',
        assistorSolution: 'Signed electronic sample receipts, structured objection logging, and medical inquiry ticket generation.',
        kpi: 'Audit-ready call documentation'
      }
    },
    complianceFirewalls: [
      {
        rule: 'Zero clinical or comparative efficacy claims by sales agents',
        rationale: 'Sales reps are strictly prohibited from generating clinical advice, dosage modifications, or off-label indications.',
        enforcement: 'Hard-coded refusal engine blocks any query involving off-label usage, clinical claims, or therapeutic comparisons.'
      },
      {
        rule: 'Sample drop limits and physician signature requirement',
        rationale: 'Drug enforcement and anti-kickback laws mandate exact physical sample accounting.',
        enforcement: 'Order screen limits sample quantities to 2 units per approved prescriber and requires mandatory signature before submission.'
      }
    ],
    deepUseCases: [
      {
        title: 'Cardiometabolic therapy hospital formulary pull-through',
        scenario: 'A major hospital added Zentrova to its formulary 3 weeks ago, but ward junior doctors still prescribe the old generic.',
        agentPreparation: 'System alerts rep that formulary listing is active and schedules calls with department registrars.',
        repExecution: 'Rep details the approved hospital protocol changes with the lead registrar and leaves approved pocket dosing guides.',
        verifiedOutcome: 'First hospital pharmacy bulk reorder triggered within 10 days; 100% adherence to approved medical leave-behinds.'
      },
      {
        title: 'Surrounding pharmacy buffer stock replenishment',
        scenario: 'A specialist diabetic clinic increased prescriptions of Kalvexa, but local high-street pharmacies have zero shelf buffer.',
        agentPreparation: 'Diagnostic engine identifies script surge from clinic A02 and flags three neighboring retail pharmacies as stockout risks.',
        repExecution: 'Rep visits pharmacies, explains anticipated prescription demand from the clinic, and assists with 3-pack initial orders.',
        verifiedOutcome: 'First-fill prescription abandonment reduced to zero; pharmacy order confirmed with electronic signature.'
      }
    ]
  },

  meddevices: {
    id: 'meddevices',
    name: 'Medical Devices',
    tagline: 'Hospitals, surgery centers and labs',
    icon: 'pulse',
    accent: '#0369A1',
    channelModel: 'Surgical Consignment, OR Case Support, and Value Analysis Committee (VAC) Contracting',
    decisionMakers: ['Chief of Surgery', 'OR Materials Manager', 'Value Analysis Committee Director', 'Sterile Processing Lead'],
    economicDrivers: 'Consignment inventory turns, procedure pull-through, tray turnaround efficiency, capital equipment amortization',
    frontlinePainPoints: [
      {
        title: 'Surgeon preference card drift and instrument mismatch',
        friction: 'Surgical preference cards are out of date, leading to incorrect implant trays being delivered to the operating room.',
        costOfFailure: 'Delayed surgery start times, emergency tray sterilizations, and surgeon frustration.',
        solvedBy: 'System synchronizes OR scheduling feeds with verified implant kit configurations 48 hours prior to procedure.'
      },
      {
        title: 'Consignment inventory shrinkage and untracked sterile kits',
        friction: 'High-value implants stored on consignment in hospital storage cabinets expire or disappear without billing.',
        costOfFailure: 'Massive annual inventory write-offs and delayed replenishment for emergency trauma cases.',
        solvedBy: 'In-visit consignment reconciliation scans lot numbers, identifies expiring sterile seals, and generates reorders.'
      },
      {
        title: 'Value Analysis Committee (VAC) approval bottlenecks',
        friction: 'New implants and instrumentation kits sit in procurement limbo awaiting health economics justification.',
        costOfFailure: 'Surgeons cannot use modern technology; reps lose commercial momentum.',
        solvedBy: 'Prepares validated health economic dossier summaries and procedural time-saving benchmarks for committee reviews.'
      },
      {
        title: 'Sterile processing turnaround failures',
        friction: 'Loaner instrument sets arrive late for decontamination, leaving sterile processing staff unable to sterilize in time.',
        costOfFailure: 'Cancelled elective procedures and hospital penalty charges levied against the vendor.',
        solvedBy: 'Route planner enforces 24-hour pre-procedure instrument delivery milestones with proof of sterile dock receipt.'
      },
      {
        title: 'Unbilled surgical consumable pull-through',
        friction: 'Consumable skin staplers, drapes, and specialty sutures used during surgery are not recorded on hospital billing sheets.',
        costOfFailure: 'Unrecovered device costs and unbilled hospital patient accounts.',
        solvedBy: 'Post-case reconciliation tool records exact lot numbers consumed and generates instantaneous billing authorization.'
      }
    ],
    coreDecisions: {
      coverage: {
        question: 'Which surgical suites and specialty surgical centers require on-site technical case coverage?',
        traditionalFlaw: 'Reps attend routine cases for comfortable surgeons rather than supporting high-complexity new adoptions.',
        assistorSolution: 'OR calendar integration prioritizes cases involving newly certified surgeons or first-time instrument systems.',
        kpi: 'High-complexity case support coverage'
      },
      route: {
        question: 'How do we coordinate instrument tray transfers between regional surgical centers?',
        traditionalFlaw: 'Reps crisscross the city carrying heavy loaner trays in trunks, risking contamination or late arrival.',
        assistorSolution: 'Tray logistics planner optimizes courier dispatch and rep trunk inventory against scheduled surgery timestamps.',
        kpi: 'On-time tray sterilization rate'
      },
      inVisit: {
        question: 'What is the required workflow inside the surgical department?',
        traditionalFlaw: 'Rep hangs around the surgeon lounge waiting for casual conversation.',
        assistorSolution: 'Structured protocol: 1. Verify tray sterilization; 2. Support surgical setup; 3. Log consumed lots; 4. Check cabinet expiry.',
        kpi: 'Procedural support checklist completion'
      },
      order: {
        question: 'What sterile consignment replenishment or consumable purchase orders must be drafted?',
        traditionalFlaw: 'Quarterly manual counts that lead to surprise stock shortages during emergency cases.',
        assistorSolution: 'Automatic consumption-driven reorder suggestion matching replacement lots to hospital procurement contracts.',
        kpi: 'Consignment replenishment speed'
      },
      evidence: {
        question: 'What evidence validates that case support and consignment audit took place?',
        traditionalFlaw: 'Handwritten scrap notes on surgical drape wrappers.',
        assistorSolution: 'Barcoded lot scans, digital receiving signatures, and surgeon case sign-off records.',
        kpi: 'Audit-compliant implant traceability'
      }
    },
    complianceFirewalls: [
      {
        rule: 'Zero clinical advice or surgical decision-making',
        rationale: 'Medical device specialists provide technical instrumentation guidance only; all surgical choices belong to the physician.',
        enforcement: 'Guardrails strictly forbid clinical outcome guarantees or patient-specific surgical recommendations.'
      },
      {
        rule: 'Fixed hospital contract pricing',
        rationale: 'Reps cannot negotiate spot pricing or alter hospital tier contracts in the field.',
        enforcement: 'Pricing engine enforces pre-approved GPO and hospital tender schedules with supervisor sign-off on exceptions.'
      }
    ],
    deepUseCases: [
      {
        title: 'Complex revision arthroplasty instrument staging',
        scenario: 'A major hospital has an orthopedic revision procedure booked for Wednesday 8:00 AM.',
        agentPreparation: 'Identifies scheduled procedure, flags that the surgeon requested specialized locking plate trial kit, and schedules delivery.',
        repExecution: 'Delivers sterile tray 24 hours in advance, inspects sterilization indicator strips, and briefs the scrub nurse.',
        verifiedOutcome: 'Case begins on schedule with zero instrument delay; procedural consumption logged for hospital billing.'
      },
      {
        title: 'Consignment sterile expiry audit and rotation',
        scenario: 'Hospital consignment locker contains trauma screw kits approaching 90-day sterile packaging expiration.',
        agentPreparation: 'Diagnostic agent scans inventory timestamps and alerts rep to rotate 4 expiring sets to high-volume trauma center.',
        repExecution: 'Rep inspects sterile blister packs, arranges swap with materials management, and replenishes fresh lot numbers.',
        verifiedOutcome: 'Avoided \$4,800 inventory write-down; zero sterile expiry incidents during regulatory audit.'
      }
    ]
  },

  beverages: {
    id: 'beverages',
    name: 'Beverages & Draught',
    tagline: 'Modern trade, on-premise bars and traditional retail',
    icon: 'glass',
    accent: '#B45309',
    channelModel: 'Direct-Store-Delivery (DSD), Foodservice Wholesale, and Direct Keg Logistics',
    decisionMakers: ['Bar Operations Manager', 'Head Mixologist / Beverage Director', 'Convenience Store Buyer', 'Distributor Route Lead'],
    economicDrivers: 'Cold vault purity, draught line velocity, keg deposit reconciliation, festival surge inventory',
    frontlinePainPoints: [
      {
        title: 'Cold-vault contamination and lost brand purity',
        friction: 'Retailers stock third-party or competitor beverage cans inside company-financed branded glass-door coolers.',
        costOfFailure: 'Breach of chiller placement contract; immediate loss of impulse cold-drink purchase conversions.',
        solvedBy: 'Computer vision cooler scan detects non-authorized SKUs and drafts chiller compliance warning for store manager.'
      },
      {
        title: 'Draught beer line hygiene and tap handle abandonment',
        friction: 'Bar taps suffer from poor line sanitation, temperature variance, or bartenders hiding tap handles behind competing brands.',
        costOfFailure: 'Off-flavor beer, poured foam wastage, bad consumer experience, and brand reputation degradation.',
        solvedBy: 'Rep inspects tap line cleanliness, verifies pouring temperature with probe, and secures front-row tap handle placement.'
      },
      {
        title: 'Empty keg and returnable glass container leakage',
        friction: 'Bar accounts fail to return empty kegs and crates, tying up capital and creating distributor invoice disputes.',
        costOfFailure: 'Severe container replacement charges and delayed delivery of fresh batches.',
        solvedBy: 'In-visit keg count reconciles empties ready for collection and applies container credit to the delivery manifest.'
      },
      {
        title: 'Weekend and sports event stock-outs',
        friction: 'Bars and convenience stores order average weekly volume before major local sporting events, running dry by Saturday night.',
        costOfFailure: 'Unrecoverable revenue loss during peak celebration consumption hours.',
        solvedBy: 'Planner ingests local event calendars (matches, festivals) and computes surge inventory multipliers 7 days prior.'
      },
      {
        title: 'Draft menu and back-bar display obscurity',
        friction: 'Premium spirits and craft draught lines are omitted from printed table menus and chalkboards.',
        costOfFailure: 'Zero trial from patrons seeking premium offerings; sales revert to low-margin house pours.',
        solvedBy: 'Rep audits cocktail menus, provides branded table tents, and confirms chalkboard draught listings.'
      }
    ],
    coreDecisions: {
      coverage: {
        question: 'Which on-premise venues and convenience stores warrant weekly draught and cooler audits?',
        traditionalFlaw: 'Visiting sleepy pubs during weekday afternoons while high-velocity nightlife venues are neglected.',
        assistorSolution: 'Volume throughput and tap count weighting prioritize high-pouring venues before weekend delivery cutoffs.',
        kpi: 'High-volume on-premise coverage'
      },
      route: {
        question: 'How do we schedule calls to match delivery windows and bar opening hours?',
        traditionalFlaw: 'Arriving at night venues before noon when doors are locked and managers are asleep.',
        assistorSolution: 'Operating hour filtering routes morning calls to retail grocers and afternoon calls to bar managers.',
        kpi: 'Effective contact strike rate'
      },
      inVisit: {
        question: 'What physical checks ensure perfect serve quality and display compliance?',
        traditionalFlaw: 'Rep drinks a casual soda and checks stock levels without inspecting equipment.',
        assistorSolution: '1. Scan cold vault purity; 2. Inspect draught line pressure; 3. Reconcile empty kegs; 4. Propose weekend order.',
        kpi: 'Equipment and display compliance score'
      },
      order: {
        question: 'What mix of kegs, returnable glass, and cans should be ordered for the weekend?',
        traditionalFlaw: 'Repeating last week order without factoring in weather forecasts or event schedules.',
        assistorSolution: 'Event-driven demand algorithm forecasts draught pints and can cases with safety stock buffers.',
        kpi: 'Order accuracy and stockout avoidance'
      },
      evidence: {
        question: 'How is chiller purity and tap handle presence objectively verified?',
        traditionalFlaw: 'Unverifiable rep notes asserting that cooler looks great.',
        assistorSolution: 'Time-stamped wide-angle cooler photos with SKU bounding boxes and bar manager signed receipts.',
        kpi: 'Photo-verified cooler compliance'
      }
    },
    complianceFirewalls: [
      {
        rule: 'Zero commercial inducements or illegal tap buyouts',
        rationale: 'Alcohol regulatory authorities strictly prohibit commercial bribery or paying cash to exclude competitor taps.',
        enforcement: 'Governance rules flag any unauthorized discount, rebate, or equipment inducement for legal review.'
      },
      {
        rule: 'Strict legal drinking age and licensed premises verification',
        rationale: 'Sales reps can only deliver or promote alcohol to venues with current, verified liquor licenses.',
        enforcement: 'System checks account license validity dates and freezes order processing on expired licenses.'
      }
    ],
    deepUseCases: [
      {
        title: 'Chiller purity restoration at urban convenience chain',
        scenario: 'A city-center mini-mart placed dairy products and competitor energy drinks into the company-owned beverage cooler.',
        agentPreparation: 'Computer vision identifies 3 non-authorized SKUs occupying 40% of the middle shelf in last week photo.',
        repExecution: 'Rep shows the store manager the contract chiller terms, assists in relocating dairy items, and restocks cold tea.',
        verifiedOutcome: '100% brand purity restored; cold beverage impulse sales increased by 28% over 14 days.'
      },
      {
        title: 'Festival weekend draught surge buffer preparation',
        scenario: 'A riverside pub is hosting a 3-day music festival next weekend with 5,000 anticipated attendees.',
        agentPreparation: 'Calendar intelligence flags event and recommends a 3.5x draught keg surge order 5 days in advance.',
        repExecution: 'Rep reviews expected tap velocity with the bar director, secures cellar space, and submits advance keg order.',
        verifiedOutcome: 'Venue poured record draught volume with zero tap runouts; empty keg return scheduled smoothly for Monday.'
      }
    ]
  },

  building: {
    id: 'building',
    name: 'Building Materials',
    tagline: 'Trade merchants, lumberyards and contractors',
    icon: 'tool',
    accent: '#EA580C',
    channelModel: 'Two-Tier Pro Lumberyards, Specialty Trade Distributors, and Direct Job-Site Delivery',
    decisionMakers: ['Pro Yard General Manager', 'General Contractor Estimator', 'Commercial Drywall / Framing Subcontractor', 'Yard Staging Lead'],
    economicDrivers: 'Takeoff accuracy, contractor rebate tier progression, yard inventory turns, project milestone cash flow',
    frontlinePainPoints: [
      {
        title: 'Blueprint takeoff estimation errors and material shortages',
        friction: 'Contractors miscalculate square footage or fastener counts, causing costly project delays and emergency hot-shots.',
        costOfFailure: 'Construction framing crews sit idle; contractors switch to local competitors to keep crews working.',
        solvedBy: 'Proposal engine matches architectural blueprint specs to validated bill-of-materials packages with waste factors.'
      },
      {
        title: 'Contractor credit exposure and lien milestone holds',
        friction: 'General contractors exceed credit limits as construction draws get delayed by banks or architects.',
        costOfFailure: 'Bad debt write-offs or halted material shipments on critical-path construction schedules.',
        solvedBy: 'Credit governance engine alerts rep to milestone draw dates and suggests secured split-delivery releases.'
      },
      {
        title: '7:00 AM job-site staging and crane delivery failures',
        friction: 'Heavy drywall sheets or roofing pallets arrive after 8:00 AM when job-site crane access is closed.',
        costOfFailure: 'Materials left in mud on ground; weather damage and massive contractor delay penalties.',
        solvedBy: 'Route planner synchronizes dispatch with pro-yard pre-dawn loading docks and crane hoist schedules.'
      },
      {
        title: 'Contractor loyalty rebate threshold confusion',
        friction: 'Subcontractors do not know how close they are to the next annual rebate tier, shifting orders to competitors.',
        costOfFailure: 'Loss of annual contractor account share and diminished volume retention.',
        solvedBy: 'Account dashboard displays real-time rebate tier pacing and shows exact incremental orders needed to unlock rebates.'
      },
      {
        title: 'Weather-induced schedule disruption and staged stock rot',
        friction: 'Rain or freeze delays outdoor framing, leaving ordered lumber and drywall exposed on open flatbeds.',
        costOfFailure: 'Damaged building materials and contentious return/credit claims.',
        solvedBy: 'Automated weather radar integration holds outdoor delivery dispatch and shifts rep calls to indoor finish trades.'
      }
    ],
    coreDecisions: {
      coverage: {
        question: 'Which commercial job-sites and pro yards require active project management this week?',
        traditionalFlaw: 'Reps hang around the lumberyard retail counter instead of visiting active commercial construction job-sites.',
        assistorSolution: 'Permit filing data and project milestone tracking prioritize job-sites entering structural framing phases.',
        kpi: 'Active commercial project coverage'
      },
      route: {
        question: 'How do we sequence yard visits and job-site trailer meetings efficiently?',
        traditionalFlaw: 'Visiting job-sites mid-day when project managers are inspecting concrete pours and unavailable.',
        assistorSolution: 'Early morning trailer meeting routing catches site superintendents before daily subcontractor standups.',
        kpi: 'Site superintendent contact rate'
      },
      inVisit: {
        question: 'What inspection tasks must be executed on site and at the dealer yard?',
        traditionalFlaw: 'Reps exchange pleasantries and collect random complaints about lumber bowing.',
        assistorSolution: '1. Inspect staged material weather covers; 2. Review next week takeoff schedule; 3. Verify contractor credit line.',
        kpi: 'Project milestone checklist adherence'
      },
      order: {
        question: 'What full truckload or split-pallet delivery should be staged for the next phase?',
        traditionalFlaw: 'Contractors ordering piecemeal day-by-day, incurring multiple delivery fees.',
        assistorSolution: 'Phase-locked order builder bundles drywall, fasteners, and framing packs for consolidated scheduled delivery.',
        kpi: 'Full truckload delivery efficiency'
      },
      evidence: {
        question: 'How do we confirm materials arrived undamaged and on specification?',
        traditionalFlaw: 'Lost paper delivery manifests with illegible pencil signatures.',
        assistorSolution: 'Digital geofenced delivery photo proof showing staged material pallets at the specified job-site bay.',
        kpi: 'Dispute-free delivery confirmation'
      }
    },
    complianceFirewalls: [
      {
        rule: 'Strict credit hold enforcement',
        rationale: 'Reps cannot override credit limits for contractors with overdue 60-day invoices without credit manager sign-off.',
        enforcement: 'Order submission is automatically blocked when contractor credit exposure exceeds approved threshold.'
      },
      {
        rule: 'Building code compliance specification',
        rationale: 'Materials supplied must match structural engineer fire-rating and load-bearing requirements.',
        enforcement: 'Catalog restricts substitution of non-rated drywall or undersized structural lumber on commercial permits.'
      }
    ],
    deepUseCases: [
      {
        title: 'Commercial multi-family framing takeoff bundle',
        scenario: 'A general contractor begins framing on a 40-unit residential build in 10 days.',
        agentPreparation: 'Takeoff module calculates required dimensional lumber, structural fasteners, and sheathing panels.',
        repExecution: 'Rep reviews delivery phases with the site superintendent, confirms crane staging area, and locks 3-truck delivery schedule.',
        verifiedOutcome: 'First truck staged at 6:45 AM; zero framing downtime; \$68,000 commercial order booked on time.'
      },
      {
        title: 'Contractor annual rebate tier acceleration',
        scenario: 'A major framing contractor is \$12,000 short of unlocking their 3% annual rebate tier before fiscal year-end.',
        agentPreparation: 'Account intelligence identifies the gap and matches it to upcoming sheathing orders on their secondary build.',
        repExecution: 'Rep presents the rebate ROI calculation to the owner, showing that consolidating orders earns \$8,400 in rebate savings.',
        verifiedOutcome: 'Contractor consolidates all dry-in materials; annual account retention secured for another 12 months.'
      }
    ]
  },

  agri: {
    id: 'agri',
    name: 'Agri Inputs',
    tagline: 'Farms, retail co-ops and distributors',
    icon: 'leaf',
    accent: '#15803D',
    channelModel: 'Ag Retail Co-operatives, Independent Agronomy Dealers, and Commercial Grower Direct',
    decisionMakers: ['Commercial Farm Operator / Agronomist', 'Retail Co-op General Manager', 'Certified Crop Advisor (CCA)', 'Chemical Application Lead'],
    economicDrivers: 'Yield per acre, spray window timing, pest emergence thresholds, dealer floor-plan financing',
    frontlinePainPoints: [
      {
        title: 'Narrow weather and growth-stage spray windows',
        friction: 'Fungicide and herbicide applications must occur within exact 72-hour crop development windows or efficacy drops drastically.',
        costOfFailure: 'Catastrophic yield reduction, uncontrolled weed resistance, and grower dissatisfaction.',
        solvedBy: 'Planner combines satellite vegetative index (NDVI), local degree-day models, and rainfall forecasts to trigger visits.'
      },
      {
        title: 'EPA and pesticide label stewardship violations',
        friction: 'Reps risk recommending chemical tank mixes or buffer distances that violate regulatory labels and environmental laws.',
        costOfFailure: 'Drift damage lawsuits, regulatory fines, and license revocations.',
        solvedBy: 'Label stewardship engine checks crop, pest, pre-harvest intervals, and tank-mix compatibility against registered labels.'
      },
      {
        title: 'Seasonal dealer floor-plan credit exposure',
        friction: 'Retail dealers order seed and chemical pallets on 9-month extended crop-lien terms, risking massive post-harvest defaults.',
        costOfFailure: 'Uncollectible seasonal receivables following drought or crop failure.',
        solvedBy: 'Pre-season financing governance verifies crop insurance documentation and dealer credit security before dispatch.'
      },
      {
        title: 'Demonstration plot yield trial skepticism',
        friction: 'Growers resist switching to premium hybrid seed without localized, side-by-side yield and moisture proof.',
        costOfFailure: 'Perpetual commoditization and inability to capture high-margin seed trait premiums.',
        solvedBy: 'Field trial tracker logs harvest weigh-wagon results and generates localized yield comparison sheets.'
      },
      {
        title: 'Counterfeit chemical and expired seed germination loss',
        friction: 'Carryover seed batches suffer reduced germination rates, and counterfeit generic chemistries infiltrate the market.',
        costOfFailure: 'Uneven crop emergence, re-planting expenses, and customer litigation.',
        solvedBy: 'Barcoded seed bag verification and certified dealer chain-of-custody tracking in the app.'
      }
    ],
    coreDecisions: {
      coverage: {
        question: 'Which commercial growers and co-op branch locations need agronomic scouting this week?',
        traditionalFlaw: 'Visiting local co-op coffee shops while large acreage commercial growers are scouting fields alone.',
        assistorSolution: 'Acreage potential, crop heat units, and localized insect trap counts target high-risk grower fields.',
        kpi: 'High-acreage grower scouting coverage'
      },
      route: {
        question: 'How do we sequence farm gate visits to match field inspection hours?',
        traditionalFlaw: 'Driving long rural miles with back-and-forth travel between opposite ends of the county.',
        assistorSolution: 'Geographic cluster routing groups farm headquarters and adjacent field parcels to reduce driving hours.',
        kpi: 'Field inspection travel efficiency'
      },
      inVisit: {
        question: 'What agronomic diagnosis must be conducted in the field?',
        traditionalFlaw: 'Casual tailgate chat about the weather with no structured crop diagnosis.',
        assistorSolution: '1. Weed and insect pressure staging; 2. Soil moisture probe check; 3. Spray tank mix recommendation; 4. Co-op dispatch order.',
        kpi: 'Agronomic scouting checklist completion'
      },
      order: {
        question: 'What seed hybrids, chemical totes, and micronutrient packs should be dispatched?',
        traditionalFlaw: 'Growers buying spot chemicals at retail counter when weeds have already outgrown label height.',
        assistorSolution: 'Pre-planned crop protection program calculates application rates per acre and schedules batch delivery.',
        kpi: 'Acre-rate order accuracy'
      },
      evidence: {
        question: 'How do we verify field pest pressure and chemical recommendation safety?',
        traditionalFlaw: 'Handwritten notes left on tractor cabs without chemical safety instructions.',
        assistorSolution: 'Geotagged crop photos, signed grower agronomic recommendations, and automated EPA label compliance receipts.',
        kpi: 'Stewardship-compliant agronomy records'
      }
    },
    complianceFirewalls: [
      {
        rule: 'Strict pesticide label application fidelity',
        rationale: 'Recommending rates, tank mixes, or target crops not explicitly stated on the registered label is illegal.',
        enforcement: 'Assistant refuses any recommendation that deviates from registered label rates, intervals, or target species.'
      },
      {
        rule: 'Pre-harvest interval (PHI) and buffer zone enforcement',
        rationale: 'Chemical residues must not exceed legal thresholds before food crop harvest.',
        enforcement: 'Order engine checks projected harvest dates against product pre-harvest intervals and blocks non-compliant orders.'
      }
    ],
    deepUseCases: [
      {
        title: 'Emergency fungal leaf rust intervention in corn',
        scenario: 'Degree-day modeling and scout alerts detect early fungal pressure in high-yield irrigated cornfields.',
        agentPreparation: 'Identifies 8 high-acreage growers in the humidity corridor and verifies fungicide tote availability at the local co-op.',
        repExecution: 'Rep scouts field leaf canopy, confirms fungal pustules, and issues a 48-hour aerial spray recommendation with label specs.',
        verifiedOutcome: 'Treatment completed before infection spread; estimated 18 bushels per acre yield protected across 2,400 acres.'
      },
      {
        title: 'Early seed booking with financing terms',
        scenario: 'A 3,500-acre soybean producer is finalizing seed hybrid selections for next spring planting.',
        agentPreparation: 'Synthesizes weigh-wagon harvest data from neighboring test plots showing a 4.2 bushel advantage for the new trait.',
        repExecution: 'Rep presents the localized yield comparison, structures an early-order volume discount, and secures financing sign-off.',
        verifiedOutcome: 'Grower commits 100% of soybean acreage to priority hybrid seed; delivery scheduled for early spring.'
      }
    ]
  },

  autoparts: {
    id: 'autoparts',
    name: 'Automotive Aftermarket',
    tagline: 'Repair shops, jobbers and fleet workshops',
    icon: 'tool',
    accent: '#DC2626',
    channelModel: 'Two-Step Warehouse Distributors, Independent Parts Jobbers, and Commercial Service Bays',
    decisionMakers: ['Independent Repair Shop Owner', 'Service Bay Lead Technician', 'Fleet Maintenance Director', 'Jobber Counter Manager'],
    economicDrivers: '30-minute hot delivery SLA, bay turnaround time, core return reconciliation, mechanic diagnostic tool adoption',
    frontlinePainPoints: [
      {
        title: 'The 30-minute bay turnaround delivery crisis',
        friction: 'Vehicles sit hoisted on hydraulic lifts; if replacement brake pads or alternators do not arrive within 30 minutes, the bay is blocked.',
        costOfFailure: 'Mechanic loses labor revenue; shop calls the next parts jobber on speed dial and cancels future orders.',
        solvedBy: 'Route planner synchronizes jobber inventory checks with hot-delivery dispatch vans and rep technician visits.'
      },
      {
        title: 'VIN-specific fitment verification errors and high return rates',
        friction: 'Reps and counter staff order parts without precise VIN verification, resulting in a 25% return rate of opened, greasy boxes.',
        costOfFailure: 'Restocking costs, damaged packaging write-offs, and wasted hot-shot delivery runs.',
        solvedBy: 'Integrated VIN scanner and fitment engine verifies exact sub-model, engine code, and brake rotor diameter before order.'
      },
      {
        title: 'Unreconciled core deposit returns and missing rebuild cores',
        friction: 'Shops fail to return old remanufactured starter motors, steering racks, and calipers, accumulating thousands in core debt.',
        costOfFailure: 'Jobber withholds future credit lines; cash flow gets tied up in scrap metal.',
        solvedBy: 'In-visit core audit scans return cores, checks serial tags, and immediately credits the shop account on screen.'
      },
      {
        title: 'Technician resistance to new diagnostic scan tools',
        friction: 'Technicians refuse to sell advanced ADAS calibrations or synthetic fluid flushes because they lack equipment training.',
        costOfFailure: 'Low-ticket service tickets; missed high-margin diagnostic equipment and specialized fluid sales.',
        solvedBy: 'Rep conducts hands-on bay in-service training demonstrations with technicians during mid-morning lull.'
      },
      {
        title: 'Fleet preventive maintenance inventory dry-outs',
        friction: 'Commercial delivery fleets run out of heavy-duty filters and synthetic oil during mandatory 5,000-mile service intervals.',
        costOfFailure: 'Commercial delivery vans taken off the road; expensive fleet downtime penalties.',
        solvedBy: 'Fleet telematics integration tracks cumulative mileage and automatically triggers stockroom filter cage replenishment.'
      }
    ],
    coreDecisions: {
      coverage: {
        question: 'Which independent repair shops and commercial fleet garages yield the highest parts turn?',
        traditionalFlaw: 'Calling on small two-bay garages that buy cheap white-box parts while multi-bay fleet centers are ignored.',
        assistorSolution: 'Bay count, technician count, and vehicle demographic density prioritize high-volume repair operations.',
        kpi: 'High-bay repair shop coverage'
      },
      route: {
        question: 'How do we time workshop visits so technicians are actually able to talk?',
        traditionalFlaw: 'Arriving at 8:00 AM during morning customer check-in or 4:30 PM during vehicle pickup pandemonium.',
        assistorSolution: 'Visits scheduled between 10:30 AM and 2:30 PM when cars are on lifts and diagnostic recommendations are finalized.',
        kpi: 'Technician engagement rate'
      },
      inVisit: {
        question: 'What technical and commercial checks must be performed in the shop?',
        traditionalFlaw: 'Dropping off paper catalogs and sharing gossip with the service writer.',
        assistorSolution: '1. Inspect fast-mover stocking cabinet; 2. Reconcile core returns; 3. Demo diagnostic scan tool; 4. Book replenishment order.',
        kpi: 'Workshop inspection completion rate'
      },
      order: {
        question: 'What mix of fast-moving filters, brake pads, fluids, and shop consumables should be stocked?',
        traditionalFlaw: 'Shops ordering single parts only when a car arrives on the lift, losing hours waiting for deliveries.',
        assistorSolution: 'Consignment cabinet replenishment suggestions ensure top 20 vehicle fitments are already on the shop shelf.',
        kpi: 'Immediate bay-fill rate'
      },
      evidence: {
        question: 'How do we verify core return collection and warranty returns?',
        traditionalFlaw: 'Greasy cores tossed in bins with no paperwork, leading to lost credit disputes.',
        assistorSolution: 'Scanned core barcode tags, photo of return condition, and digital counter receipt signature.',
        kpi: 'Dispute-free core reconciliation'
      }
    },
    complianceFirewalls: [
      {
        rule: 'OEM fitment and safety certification adherence',
        rationale: 'Installing uncertified aftermarket brake or steering components creates severe product liability risks.',
        enforcement: 'Catalog engine strictly blocks non-compliant or uncertified parts from safety-critical assemblies.'
      },
      {
        rule: 'Commercial trade credit limits',
        rationale: 'Repair shops carry high bankruptcy risks; parts delivered on open account must respect strict credit ceilings.',
        enforcement: 'Automated credit block freezes hot-shot dispatch when shop accounts exceed 30-day balance limits.'
      }
    ],
    deepUseCases: [
      {
        title: 'Fast-mover brake and rotor consignment cabinet restock',
        scenario: 'A busy 6-bay foreign auto specialist is frequently delaying brake jobs waiting for rotor deliveries.',
        agentPreparation: 'Analyzes shop work order history and identifies 12 brake pad and rotor sets covering 70% of their European vehicle intake.',
        repExecution: 'Rep proposes a branded consignment wall rack, stocks top European fitments, and trains technicians on warranty registration.',
        verifiedOutcome: 'Shop cuts brake job cycle time by 45 minutes per vehicle; parts spend with distributor triples in 60 days.'
      },
      {
        title: 'Core deposit recovery and credit release',
        scenario: 'A major transmission shop has \$4,200 in pending core deductions blocking their open credit line.',
        agentPreparation: 'Generates core audit manifest listing 8 unreturned remanufactured transmissions and steering racks.',
        repExecution: 'Rep inspects scrap pallets, scans serial tags on 6 valid cores, and issues instant electronic credit release.',
        verifiedOutcome: 'Credit hold cleared on the spot; shop orders \$7,800 in new commercial fleet parts for immediate dispatch.'
      }
    ]
  },

  foodservice: {
    id: 'foodservice',
    name: 'Foodservice & HoReCa',
    tagline: 'Restaurants, hotels and catering',
    icon: 'cart',
    accent: '#D97706',
    channelModel: 'Broadline Food Distributors, Specialist Fresh Wholesalers, and Direct Restaurant Group Supply',
    decisionMakers: ['Executive Chef', 'Food & Beverage Director', 'Restaurant General Manager', 'Commissary Kitchen Lead'],
    economicDrivers: 'Food cost percentage per cover, kitchen prep labor savings, walk-in par levels, delivery cutoff precision',
    frontlinePainPoints: [
      {
        title: 'Late afternoon delivery cutoffs and kitchen prep panic',
        friction: 'Chefs must place next-day produce, meat, and dairy orders before the strict 4:00 PM warehouse order cutoffs.',
        costOfFailure: 'Missed delivery slots, emergency high-cost retail runs, and 86-ed signature menu items on a Friday night.',
        solvedBy: 'Route planner prompts digital par-level pantry sweeps before 2:00 PM and automates one-tap kitchen reorders.'
      },
      {
        title: 'Recipe portion cost inflation and food cost leakage',
        friction: 'Wholesale protein and dairy commodity price spikes destroy restaurant gross margins on fixed printed menus.',
        costOfFailure: 'Restaurant operating losses; chefs blame the supplier and shop around for cheap substitutes.',
        solvedBy: 'App provides live plate cost calculators and suggests pre-portioned, labor-saving value cuts with identical yield.'
      },
      {
        title: 'Walk-in cooler spoilage and inventory shrinkage',
        friction: 'Perishable ingredients get pushed to the back of the walk-in cooler, expiring before use due to improper FIFO rotation.',
        costOfFailure: 'Direct food waste, kitchen odor issues, and health inspection demerits.',
        solvedBy: 'In-visit walk-in audit inspects dating stickers, verifies FIFO rotation, and right-sizes suggested reorder quantities.'
      },
      {
        title: 'Chef skepticism toward pre-prepped and frozen innovations',
        friction: 'Executive chefs pride themselves on scratch cooking and resist value-added sauces or sous-vide meats.',
        costOfFailure: 'Kitchens struggle with extreme kitchen labor shortages while suppliers miss out on high-margin value-add lines.',
        solvedBy: 'Rep brings hot kitchen tasting samples during post-lunch lull (2:30 PM to 4:00 PM) to prove scratch-quality taste.'
      },
      {
        title: 'High restaurant turnover and erratic payment terms',
        friction: 'Independent restaurants have high failure rates, with cash flow crunches leading to bounced weekly checks.',
        costOfFailure: 'Supplier write-offs and COD delivery restrictions that kill account sales.',
        solvedBy: 'Governance model monitors payment velocity and auto-toggles accounts to automated credit card authorization.'
      }
    ],
    coreDecisions: {
      coverage: {
        question: 'Which restaurants, hotels, and institutional caterers deserve consultative culinary rep calls?',
        traditionalFlaw: 'Spending hours chatting with small diners while 200-cover banquet hotels are left to phone order desks.',
        assistorSolution: 'Seat count, menu pricing tier, and weekly case velocity rank top commercial kitchen opportunities.',
        kpi: 'High-cover commercial kitchen coverage'
      },
      route: {
        question: 'How do we navigate restaurant kitchen schedules without getting thrown out of the kitchen?',
        traditionalFlaw: 'Walking into kitchens during 12:00 PM lunch service or 6:30 PM dinner rush when chefs are in high-stress service.',
        assistorSolution: 'Strict kitchen lull windowing schedules rep visits exclusively between 2:15 PM and 4:30 PM.',
        kpi: 'Kitchen chef consultation success rate'
      },
      inVisit: {
        question: 'What structured checks must be executed in the back of house?',
        traditionalFlaw: 'Standing by the kitchen door asking the chef what they need for tomorrow.',
        assistorSolution: '1. Walk-in cooler par count; 2. Live chef sample demo; 3. Plate cost calculation; 4. Pre-cutoff order transmission.',
        kpi: 'Back-of-house checklist adherence'
      },
      order: {
        question: 'What exact case quantities of proteins, produce, dry goods, and cleaning chemicals are required?',
        traditionalFlaw: 'Chefs guessing quantities from memory without checking freezer or dry storage par levels.',
        assistorSolution: 'Par-level subtraction engine calculates exact replenishment cases needed to reach weekend service buffers.',
        kpi: 'Order accuracy and emergency run elimination'
      },
      evidence: {
        question: 'How is kitchen delivery acceptance and culinary tasting verified?',
        traditionalFlaw: 'Paper delivery tickets signed with chef grease on a wet stainless table.',
        assistorSolution: 'Digital temperature log verification at receiving, photo of staged delivery, and chef electronic signature.',
        kpi: 'Dispute-free culinary delivery'
      }
    },
    complianceFirewalls: [
      {
        rule: 'Food safety and cold-chain temperature compliance',
        rationale: 'Refrigerated and frozen proteins must never be accepted or delivered if temperature thresholds are breached.',
        enforcement: 'Receiving audit forces entry of calibrated probe temperatures before allowing delivery confirmation.'
      },
      {
        rule: 'Credit limit and COD governance',
        rationale: 'Reps cannot deliver new food inventory to accounts with unresolved returned checks without finance clearance.',
        enforcement: 'System automatically suspends delivery order transmission for accounts on credit stop.'
      }
    ],
    deepUseCases: [
      {
        title: 'Labor-saving sous-vide braised beef chef demonstration',
        scenario: 'A high-volume gastropub is struggling with cook turnover and cannot keep up with slow-braised short rib demand.',
        agentPreparation: 'Synthesizes plate cost economics showing a \$3.20 per portion labor saving using fully cooked sous-vide ribs.',
        repExecution: 'Rep visits at 2:45 PM with portable induction burner, plates hot samples for the chef, and reviews portion yield.',
        verifiedOutcome: 'Chef adds sous-vide ribs to weekly specials; converts account to 15 cases per week standing delivery.'
      },
      {
        title: 'Pre-weekend walk-in par replenishment before 4:00 PM cutoff',
        scenario: 'A boutique hotel has a 150-guest wedding banquet on Saturday and risk running out of heavy cream and butter.',
        agentPreparation: 'Flags banquet calendar booking and compares current inventory against required recipe scaling.',
        repExecution: 'Rep conducts physical pantry count at 1:30 PM, identifies 8 missing ingredient lines, and submits order at 2:15 PM.',
        verifiedOutcome: 'Order delivered on Friday morning truck; banquet execution flawless with zero menu substitutions.'
      }
    ]
  },

  finserv: {
    id: 'finserv',
    name: 'Financial Services',
    tagline: 'Retail merchants, SME commercial and broker networks',
    icon: 'bank',
    accent: '#0D9488',
    channelModel: 'Merchant Acquiring Field Sales, Commercial Bank Branch SME Officers, and Independent Broker Channels',
    decisionMakers: ['Retail Business Owner', 'Corporate Chief Financial Officer', 'Commercial Loan Broker', 'POS Terminal Fleet Manager'],
    economicDrivers: 'Merchant Discount Rate (MDR) interchange spread, payment processing volume, loan origination balance, terminal retention',
    frontlinePainPoints: [
      {
        title: 'Merchant terminal switching churn to fintech competitors',
        friction: 'Square, Clover, or regional fintech disrupters lure high-volume retail merchants with sleek hardware and flat processing rates.',
        costOfFailure: 'Immediate loss of high-margin card processing interchange fees and linked commercial treasury deposits.',
        solvedBy: 'Retention diagnostics detect declining card swipe velocity and trigger proactive merchant retention visits.'
      },
      {
        title: 'Excessive chargeback ratios and fraud risk freezes',
        friction: 'Merchants suffer fraud spikes, breaching 1% chargeback thresholds and triggering sudden account freezes by risk underwriting.',
        costOfFailure: 'Merchant business disruption, furious customer escalation, and merchant cancellation.',
        solvedBy: 'App flags chargeback ratio warnings early and prompts rep to install 3D-Secure or chip/PIN terminal upgrades.'
      },
      {
        title: 'Complex KYC/AML document collection stalling onboardings',
        friction: 'SME loan and merchant acquiring applications stall for weeks because reps fail to collect certified beneficial ownership documents.',
        costOfFailure: 'Applicants abandon the onboarding pipeline to digital-first fintech lenders.',
        solvedBy: 'Mobile document scanner validates photo ID, business registration, and bank statements in real time during visit.'
      },
      {
        title: 'Interchange fee margin erosion and rate resistance',
        friction: 'Savvy merchants demand lower basis points on payment processing, eroding bank acquirer profit margins.',
        costOfFailure: 'Reps give away margin unnecessarily or lose accounts because they cannot explain total cost of acceptance.',
        solvedBy: 'Interchange optimizer generates transparent total-cost-of-acceptance comparison sheets highlighting hidden competitor fees.'
      },
      {
        title: 'Zero autonomous agent authority for credit or pricing decisions',
        friction: 'Regulatory banking laws strictly forbid software or AI agents from approving loans or setting binding credit terms.',
        costOfFailure: 'Severe regulatory banking sanctions, compliance penalties, and credit risk losses.',
        solvedBy: 'Strict authority matrix requires human underwriter credit sign-off; AI suggests packaging but never approves.'
      }
    ],
    coreDecisions: {
      coverage: {
        question: 'Which retail merchants and commercial businesses warrant in-person acquiring sales calls?',
        traditionalFlaw: 'Cold-calling low-volume bodegas while multi-location restaurant groups and luxury boutiques are overlooked.',
        assistorSolution: 'Card transaction volume density, average ticket size, and footfall heatmaps identify high-interchange targets.',
        kpi: 'High-processing-volume merchant coverage'
      },
      route: {
        question: 'How do we schedule merchant owner visits without interrupting peak register hours?',
        traditionalFlaw: 'Entering retail stores during lunch or evening shopper rushes when owners are busy working the cash register.',
        assistorSolution: 'Mid-morning lull routing (9:30 AM to 11:30 AM) catches store owners when daily cash reconciliations are done.',
        kpi: 'Merchant owner consultation strike rate'
      },
      inVisit: {
        question: 'What structured compliance and commercial audit must be performed?',
        traditionalFlaw: 'Dropping off paper brochures and promising vague savings on credit card fees.',
        assistorSolution: '1. Inspect POS terminal firmware; 2. Review previous month processing statement; 3. Collect KYC; 4. Propose rate bundle.',
        kpi: 'Merchant onboarding audit completion'
      },
      order: {
        question: 'What payment terminal models, contactless accessories, and working capital limits should be proposed?',
        traditionalFlaw: 'Quoting arbitrary processing discounts that fail underwriting approval.',
        assistorSolution: 'Pre-packaged merchant bundles matching industry risk profiles with human underwriting validation.',
        kpi: 'First-pass underwriting approval rate'
      },
      evidence: {
        question: 'How is merchant identity and KYC compliance verified?',
        traditionalFlaw: 'Unsecured photocopies of driver licenses texted over personal phones.',
        assistorSolution: 'Encrypted document capture, live photo verification of merchant premises, and digital electronic signature.',
        kpi: 'Audit-ready KYC compliance rate'
      }
    },
    complianceFirewalls: [
      {
        rule: 'Zero autonomous credit approval or pricing power',
        rationale: 'Banking and financial regulation mandates licensed human underwriters approve all credit lines and loan terms.',
        enforcement: 'System strictly blocks automated loan approvals or pricing discounts; all proposals route to credit risk committee.'
      },
      {
        rule: 'Anti-Money Laundering (AML) and Beneficial Ownership compliance',
        rationale: 'Merchant accounts must verify ultimate beneficial owners (UBO) holding 25% or more equity before activation.',
        enforcement: 'Application cannot be submitted until mandatory KYC identity verification documents are cryptographically uploaded.'
      }
    ],
    deepUseCases: [
      {
        title: 'High-volume restaurant group POS terminal upgrade and retention',
        scenario: 'A premier 3-location bistro group is considering switching card processing to a cloud tablet competitor.',
        agentPreparation: 'Identifies processing volume (\$1.8M annual card turnover) and generates total-cost-of-acceptance comparison.',
        repExecution: 'Rep visits during afternoon lull, presents smart 4G pay-at-table terminals, and demonstrates tableside tip optimization.',
        verifiedOutcome: 'Merchant signs 3-year processing extension; 12 new smart terminals deployed with full KYC verification.'
      },
      {
        title: 'SME commercial merchant cash advance application packaging',
        scenario: 'A retail boutique needs \$45,000 in seasonal working capital for inventory ahead of holiday shopping.',
        agentPreparation: 'Analyzes merchant 12-month terminal card swipe velocity and calculates compliant loan sizing options.',
        repExecution: 'Rep reviews loan repayment mechanics tied to daily card settlement and collects updated tax filings on mobile app.',
        verifiedOutcome: 'Complete document package submitted to underwriting; human credit officer issues loan approval within 24 hours.'
      }
    ]
  },

  industrial: {
    id: 'industrial',
    name: 'Industrial & MRO',
    tagline: 'Manufacturing plants, engineering workshops and tool cribs',
    icon: 'tool',
    accent: '#475569',
    channelModel: 'Direct Industrial Accounts, Integrated Supply Contracts, and Technical Distributor Tool Cribs',
    decisionMakers: ['Plant Maintenance Director (VP Ops)', 'Reliability Engineer', 'Procurement Purchasing Manager', 'Tool Crib Lead'],
    economicDrivers: 'Mean Time Between Failures (MTBF), unplanned downtime avoidance, vendor consolidation, tool crib inventory holding cost',
    frontlinePainPoints: [
      {
        title: 'Unplanned production line downtime crises',
        friction: 'Critical pump bearings or conveyor motors fail unexpectedly, shutting down automotive or food packaging lines at \$10k/hr.',
        costOfFailure: 'Catastrophic manufacturing downtime, unfulfilled production quotas, and emergency courier expenses.',
        solvedBy: 'Telemetry integration flags vibration sensor anomalies and generates proactive replacement motor delivery.'
      },
      {
        title: 'Tool crib hoarding and unmanaged indirect spend',
        friction: 'Plant technicians stash specialty cutting tools, PPE, and welding tips in personal lockers, causing phantom stockouts.',
        costOfFailure: 'Excessive tool crib working capital, duplicate orders, and untracked consumable usage.',
        solvedBy: 'Smart RFID consignment locker audits track user-level badge pulls and trigger automated replenishment.'
      },
      {
        title: 'Vendor sprawl and fragmented procurement contracts',
        friction: 'Plant managers purchase fasteners, lubricants, and belts from 40 different local suppliers with zero volume pricing.',
        costOfFailure: 'Inflated invoice processing costs, unstandardized parts, and missed corporate volume rebates.',
        solvedBy: 'Vendor consolidation analysis maps fragmented supplier spend into single-source core contract savings.'
      },
      {
        title: 'Improper lubricant application and contamination failure',
        friction: 'Maintenance crews mix incompatible grease formulations or allow particulate contamination in gearboxes.',
        costOfFailure: 'Premature bearing seizure, gearbox rebuilds, and equipment warranty voiding.',
        solvedBy: 'Rep inspects color-coded lube dispensing points, pulls oil samples for lab analysis, and verifies lubrication schedules.'
      },
      {
        title: 'Safety compliance (OSHA/HSE) and PPE inspection violations',
        friction: 'Worn respirator filters, expired eye-wash stations, and non-compliant fall protection harnesses on the shop floor.',
        costOfFailure: 'Regulatory safety shutdown orders, worker injury compensation liabilities, and severe OSHA fines.',
        solvedBy: 'In-visit safety audit inspects PPE stations, validates inspection dates, and auto-replenishes certified safety kits.'
      }
    ],
    coreDecisions: {
      coverage: {
        question: 'Which manufacturing facilities and heavy industrial plants warrant weekly technical reliability calls?',
        traditionalFlaw: 'Calling on small machine shops while 24/7 continuous process chemical and manufacturing plants are underserved.',
        assistorSolution: 'Connected horsepower, equipment density, and maintenance budget size prioritize high-reliability accounts.',
        kpi: 'Continuous-process plant coverage rate'
      },
      route: {
        question: 'How do we time plant visits around planned maintenance shutdowns and shift handovers?',
        traditionalFlaw: 'Arriving during unexpected plant breakdowns or production shift handover meetings when engineers cannot talk.',
        assistorSolution: 'Maintenance schedule integration routes rep visits during planned preventive maintenance (PM) turnaround windows.',
        kpi: 'Reliability engineering consultation rate'
      },
      inVisit: {
        question: 'What technical audit tasks must be performed on the factory floor?',
        traditionalFlaw: 'Sitting in purchasing offices negotiating 2% discounts on drill bits.',
        assistorSolution: '1. Inspect tool crib vending inventory; 2. Pull oil samples from critical gearboxes; 3. Review PM downtime schedule; 4. Draft order.',
        kpi: 'Plant floor inspection completion rate'
      },
      order: {
        question: 'What preventive maintenance kits, belts, bearings, and lubricants should be staged?',
        traditionalFlaw: 'Waiting for emergency breakdowns before ordering replacement mechanical components.',
        assistorSolution: 'Operating hour MTBF calculations generate pre-kitted overhaul packages delivered 48 hours before scheduled PM.',
        kpi: 'Preventive maintenance kit delivery rate'
      },
      evidence: {
        question: 'How is mechanical condition and vendor consolidation verified?',
        traditionalFlaw: 'Unverifiable oral updates between plant buyer and sales rep.',
        assistorSolution: 'Barcode asset scans, certified oil analysis laboratory reports, and plant maintenance manager digital signatures.',
        kpi: 'Documented maintenance cost savings'
      }
    },
    complianceFirewalls: [
      {
        rule: 'Safety certification and plant PPE access protocols',
        rationale: 'Sales reps must possess certified safety accreditations (OSHA 10, confined space awareness) before entering plant floors.',
        enforcement: 'Companion tracks required plant safety certifications and blocks visit check-in if safety credentials have lapsed.'
      },
      {
        rule: 'Contract procurement pricing adherence',
        rationale: 'Industrial master services agreements (MSA) fix contract margins and forbid unauthorized spot markups.',
        enforcement: 'Pricing engine locks orders to MSA tier schedules with human corporate account manager override approval.'
      }
    ],
    deepUseCases: [
      {
        title: 'Automotive assembly plant conveyor bearing overhaul staging',
        scenario: 'A major assembly plant has a planned 24-hour weekend shutdown for conveyor maintenance in 14 days.',
        agentPreparation: 'Identifies scheduled PM window and generates bill-of-materials kit for 32 precision pillow block bearings and seals.',
        repExecution: 'Rep walks the conveyor line with the reliability engineer, verifies shaft diameters, and delivers staged kits on Friday.',
        verifiedOutcome: 'Weekend overhaul completed 3 hours ahead of schedule; zero unplanned line stops during Monday production restart.'
      },
      {
        title: 'Tool crib RFID vending machine deployment and spend consolidation',
        scenario: 'A heavy machinery manufacturer is losing \$18,000 annually in unreturned carbide cutting inserts and grinding wheels.',
        agentPreparation: 'Analyzes 6 months of fragmented purchase orders and proposes a managed smart dispensing locker solution.',
        repExecution: 'Rep presents the consignment vending model to the VP of Operations, proving a 22% reduction in indirect tool spend.',
        verifiedOutcome: 'Contract signed; two smart vending lockers installed; 100% automated replenishment with zero stockouts.'
      }
    ]
  },

  telecom: {
    id: 'telecom',
    name: 'Telecom & Connectivity',
    tagline: 'Carrier stores, franchised outlets and enterprise accounts',
    icon: 'signal',
    accent: '#0284C7',
    channelModel: 'Exclusive Franchised Carrier Outlets, National Retailer Big-Box Chains, and Enterprise B2B Accounts',
    decisionMakers: ['Franchise Dealer Principal', 'Store Operations Manager', 'Carrier Retail Merchandising Lead', 'Enterprise Telecom Buyer'],
    economicDrivers: 'Gross postpaid subscriber additions, device financing attachment, prepaid airtime wallet turns, 5G handset trade-ins',
    frontlinePainPoints: [
      {
        title: 'Live interactive display security wire and power failures',
        friction: 'Expensive flagship 5G smartphones on display tables have disconnected power tethers or dead interactive demo loops.',
        costOfFailure: 'Shoppers cannot test camera or UI features; walk away to competitor carrier stores to buy.',
        solvedBy: 'Computer vision display scan checks live screen illumination, security tether tension, and retail merchandising strips.'
      },
      {
        title: 'IMEI serialization tracking and shrinkage reconciliation',
        friction: 'High-value flagship smartphones stored in back-room safes suffer internal theft, unrecorded swaps, or inventory drift.',
        costOfFailure: 'Massive insurance deductibles, dealer audit penalties, and missing inventory write-offs.',
        solvedBy: 'In-visit high-security safe audit scans individual IMEI barcodes and reconciles instantly with carrier billing systems.'
      },
      {
        title: 'Dealer airtime wallet depletion and prepaid transaction stops',
        friction: 'Franchised outlets run out of digital wallet balance on Friday afternoon, unable to sell prepaid top-ups all weekend.',
        costOfFailure: 'Lost commission, furious walk-in customers, and permanent defection to competitor payment kiosks.',
        solvedBy: 'Airtime balance telemetry monitors dealer credit thresholds and prompts automatic wallet re-loads before weekends.'
      },
      {
        title: 'Frontline store rep incentive confusion and low accessory attach',
        friction: 'Retail store staff push basic device sales without pitching high-margin screen protectors, cases, and smartwatches.',
        costOfFailure: 'Sub-optimal store profit margins; dealer misses carrier tier bonus thresholds.',
        solvedBy: 'Companion provides live incentive trackers and flash 3-minute accessory bundling training modules.'
      },
      {
        title: 'Postpaid plan migration bottlenecks and churn to MVNOs',
        friction: 'Prepaid subscribers ready for postpaid contract conversion defect to low-cost mobile virtual network operators (MVNOs).',
        costOfFailure: 'Loss of high-ARPU customer lifetime value and increased customer acquisition costs.',
        solvedBy: 'Account analytics identifies high-recharge prepaid clusters and provides dealers with targeted postpaid trade-in offers.'
      }
    ],
    coreDecisions: {
      coverage: {
        question: 'Which dealer locations and big-box electronics stores need physical retail compliance audits?',
        traditionalFlaw: 'Focusing on company-owned flagship stores while high-volume franchised strip mall dealers run out of stock.',
        assistorSolution: 'Activation velocity, footfall location indexing, and IMEI inventory turns prioritize dealer visits.',
        kpi: 'High-volume dealer coverage rate'
      },
      route: {
        question: 'How do we time dealer store visits to conduct staff coaching without disrupting customer lines?',
        traditionalFlaw: 'Arriving during lunchtime or weekend shopping rushes when reps are busy activating phones.',
        assistorSolution: 'Morning quiet-hour routing (10:00 AM to 11:30 AM) catches store teams before foot traffic picks up.',
        kpi: 'Store associate training reach'
      },
      inVisit: {
        question: 'What technical and merchandising checks must be executed on the retail floor?',
        traditionalFlaw: 'Casual check-in with the store manager without verifying device security or plan promo compliance.',
        assistorSolution: '1. Audit live demo power and security wires; 2. Scan back-room safe IMEIs; 3. Verify window promo banners; 4. Restock top cases.',
        kpi: 'Retail compliance audit score'
      },
      order: {
        question: 'What quantities of flagship smartphones, budget handsets, SIM cards, and accessories should be shipped?',
        traditionalFlaw: 'Dealers over-ordering slow-moving high-tier colors while running out of base storage models.',
        assistorSolution: 'Color and storage SKU sell-through algorithm balances inventory against local customer demographic preferences.',
        kpi: 'Device inventory turn velocity'
      },
      evidence: {
        question: 'How is retail merchandising compliance and IMEI safe balance verified?',
        traditionalFlaw: 'Self-attested tick sheets filled out in the parking lot.',
        assistorSolution: 'Time-stamped photos of display fixtures, scanned safe inventory logs, and dealer principal digital signature.',
        kpi: 'Audit-ready store compliance'
      }
    },
    complianceFirewalls: [
      {
        rule: 'Strict IMEI serial activation and anti-money laundering compliance',
        rationale: 'Prepaid SIM cards and serialized handsets must comply with telecommunications identity verification laws.',
        enforcement: 'System blocks device distribution and activation if identity verification documents are unverified.'
      },
      {
        rule: 'Co-op marketing fund brand guidelines',
        rationale: 'Dealers cannot use carrier marketing funds for unauthorized local advertisements or non-compliant signage.',
        enforcement: 'Marketing claims require photographic verification of approved carrier logo placement before funds release.'
      }
    ],
    deepUseCases: [
      {
        title: 'Flagship 5G nationwide launch display compliance sweep',
        scenario: 'A major carrier launches its latest 5G flagship phone with nationwide marketing campaign starting Friday.',
        agentPreparation: 'Identifies 14 authorized franchised stores in the territory and generates display installation priority tasks.',
        repExecution: 'Rep visits stores on Thursday, verifies security wire power, activates interactive demo software, and mounts window poster.',
        verifiedOutcome: '100% launch compliance verified by 6:00 PM Thursday; zero demo fixture blackouts during launch weekend.'
      },
      {
        title: 'Franchise dealer safe IMEI audit and accessory expansion',
        scenario: 'A 3-store dealer franchise has high device sales but bottom-decile accessory and protection plan attach rates.',
        agentPreparation: 'Calculates \$4,200 monthly margin loss from missing accessory bundles compared to regional peers.',
        repExecution: 'Rep runs safe IMEI inventory audit, shows dealer margin simulator, and conducts 15-minute sales team bundling huddle.',
        verifiedOutcome: 'Accessory attach rate increases from 14% to 38%; dealer commits to premium protective case display end-cap.'
      }
    ]
  },

  electronics: {
    id: 'electronics',
    name: 'Consumer Electronics',
    tagline: 'Retail chains, independent dealers and repair integrators',
    icon: 'device',
    accent: '#4F46E5',
    channelModel: 'National Consumer Electronics Chains, Independent Audio/Video Specialists, and Custom Integrators',
    decisionMakers: ['Store Merchandise Manager', 'Floor Category Sales Lead', 'Custom AV Integrator', 'Repair Center Supervisor'],
    economicDrivers: 'Demo fixture compliance, floor sales incentive (spiff) engagement, warranty attachment, end-of-life clearance markdown',
    frontlinePainPoints: [
      {
        title: 'Dark interactive display fixtures and missing demo remotes',
        friction: 'High-end OLED TVs and soundbars sit powered off, with missing demo remotes or severed HDMI cables on retail tables.',
        costOfFailure: 'Shoppers cannot experience picture quality or Dolby Atmos audio; sales revert to discounted entry-level models.',
        solvedBy: 'In-visit fixture audit checks 4K video loop playback, remote control tether, and soundbar optical connection.'
      },
      {
        title: 'Store associate lack of technical product confidence',
        friction: 'Retail floor sales reps lack understanding of refresh rates, HDMI 2.1 specs, or multi-room audio protocols.',
        costOfFailure: 'Floor staff steer customers toward whatever competing brand they personally own or understand.',
        solvedBy: 'Companion delivers 3-minute micro-training videos with objection handling tips and live associate spiff rewards.'
      },
      {
        title: 'Open-box clearance accumulation and showroom clutter',
        friction: 'Returned open-box monitors and laptops pile up in customer service corners, tying up floor space and working capital.',
        costOfFailure: 'Depreciating hardware value, inventory aging write-offs, and an unkempt retail showroom.',
        solvedBy: 'Rep audits open-box cages, assigns certified refurb grading labels, and establishes discounted clearance end-caps.'
      },
      {
        title: 'Extended warranty and premium cable attach failure',
        friction: 'Customers buy \$2,000 televisions but leave without high-speed HDMI cables, surge protectors, or accidental damage plans.',
        costOfFailure: 'Loss of highest-margin retail basket add-ons; customers experience sub-par 4K HDR performance at home.',
        solvedBy: 'Order engine suggests pre-bundled accessory packages placed directly beside display pallets.'
      },
      {
        title: 'Gray-market parallel imports and price erosion',
        friction: 'Unauthorized gray-market distributors dump non-warranty units online, undercutting authorized dealer retail pricing.',
        costOfFailure: 'Authorized dealers refuse to display products; brand equity degrades.',
        solvedBy: 'Serial number verification audits store inventory to guarantee authentic local warranty coverage and MAP compliance.'
      }
    ],
    coreDecisions: {
      coverage: {
        question: 'Which retail store locations and independent AV specialty showrooms drive category volume?',
        traditionalFlaw: 'Visiting low-traffic suburban strip stores while flagship downtown electronics superstores are uninspected.',
        assistorSolution: 'Store square footage, footfall traffic, and premium audio/video category sales volume prioritize visits.',
        kpi: 'High-tier electronics store coverage'
      },
      route: {
        question: 'How do we schedule retail visits to coincide with floor staff shift changes?',
        traditionalFlaw: 'Arriving during weekend retail rushes when staff cannot step away from the cash registers.',
        assistorSolution: 'Weekday morning scheduling conducts associate product briefings 45 minutes before store doors open.',
        kpi: 'Retail sales associate training reach'
      },
      inVisit: {
        question: 'What structured physical inspection ensures the brand shines on the showroom floor?',
        traditionalFlaw: 'Browsing products like a consumer and asking the store manager how business is going.',
        assistorSolution: '1. Inspect 4K demo video loops; 2. Test audio soundbar power; 3. Verify promotional price tags; 4. Train floor staff.',
        kpi: 'Showroom display compliance score'
      },
      order: {
        question: 'What inventory of premium displays, soundbars, mounting brackets, and cables should be restocked?',
        traditionalFlaw: 'Allowing stockouts of essential wall mounts and cables that prevent TV delivery installations.',
        assistorSolution: 'Attach-rate algorithmic replenishment balances TV screen units with corresponding brackets, cables, and soundbars.',
        kpi: 'Accessory attach inventory balance'
      },
      evidence: {
        question: 'How is brand fixture compliance and staff training objectively proved?',
        traditionalFlaw: 'Subjective rep claims that displays look great.',
        assistorSolution: 'Wide-angle fixture photos with AI screen illumination detection and signed training attendance logs.',
        kpi: 'Verified merchandising compliance'
      }
    },
    complianceFirewalls: [
      {
        rule: 'Minimum Advertised Price (MAP) policy enforcement',
        rationale: 'Dealers must respect contractual MAP pricing to prevent destructive retail price wars and protect brand equity.',
        enforcement: 'Price tag audit scans shelf tags; deviations immediately alert territory manager and freeze co-op advertising funds.'
      },
      {
        rule: 'Certified serial warranty traceability',
        rationale: 'Retailers can only stock authorized regional units backed by manufacturer warranties.',
        enforcement: 'In-visit serial scanning cross-references regional distribution databases and flags parallel gray-market imports.'
      }
    ],
    deepUseCases: [
      {
        title: 'Holiday Black Friday soundbar and OLED TV staging',
        scenario: 'A major electronics chain is preparing for Black Friday weekend doorbuster sales in 10 days.',
        agentPreparation: 'Identifies promotional pallet drops and generates pre-Black Friday fixture readiness checklists.',
        repExecution: 'Rep visits store, mounts updated 4K Dolby Vision demo flash drives, tunes soundbars, and briefs 12 floor associates.',
        verifiedOutcome: '100% fixture functionality verified; store achieves #1 regional sell-through on premium soundbars.'
      },
      {
        title: 'Independent custom AV integrator project package',
        scenario: 'A high-end smart home integrator is designing custom whole-home audio and home theater installations.',
        agentPreparation: 'Packs project bill-of-materials featuring multi-zone architectural amplifiers and in-ceiling speakers.',
        repExecution: 'Rep reviews architectural blueprints with the integrator, demonstrates room-calibration software, and locks order.',
        verifiedOutcome: 'Integrator specifies brand for 4 luxury residential builds; \$32,000 commercial equipment order confirmed.'
      }
    ]
  },

  energy: {
    id: 'energy',
    name: 'Energy & Lubricants',
    tagline: 'Commercial fleets, fuel depots and service dealers',
    icon: 'zap',
    accent: '#B91C1C',
    channelModel: 'Commercial Fleet B2B Direct, Bulk Fuel Distributors, and Franchised Service Station Dealers',
    decisionMakers: ['Fleet Operations Director', 'Bulk Fuel Plant Manager', 'Station Dealer Principal', 'Industrial Lube Engineer'],
    economicDrivers: 'Fleet fuel card volume, lubricant drain interval extension, bulk storage tank telemetry, pump uptime',
    frontlinePainPoints: [
      {
        title: 'Bulk storage tank water contamination and sludge build-up',
        friction: 'Underground diesel tanks and bulk lube reservoirs accumulate condensation water and fungal growth at the bottom.',
        costOfFailure: 'Clogged vehicle fuel injectors, catastrophic engine failures, and environmental contamination fines.',
        solvedBy: 'Rep conducts physical water-paste dipstick tests or reads tank telemetry sensors and logs filtration service.'
      },
      {
        title: 'Commercial fleet customer defection to competing fuel card networks',
        friction: 'Fleet managers defect to competitor fuel networks offering slightly lower spot diesel prices or easier driver app expense tracking.',
        costOfFailure: 'Immediate loss of millions in annual diesel volume and linked heavy-duty engine oil purchases.',
        solvedBy: 'Account monitoring flags declining weekly fleet pump transactions and prompts commercial discount renegotiation.'
      },
      {
        title: 'Heavy-duty engine oil premature drain intervals',
        friction: 'Fleets dump expensive full-synthetic engine oil at 10,000 miles instead of running lab-verified 40,000-mile drain cycles.',
        costOfFailure: 'Excessive fleet maintenance costs and failure to prove high-margin synthetic lubricant ROI.',
        solvedBy: 'Used oil analysis (UOA) laboratory sampling tracks Total Base Number (TBN) and soot to safely extend drain intervals.'
      },
      {
        title: 'Fuel dispensing pump nozzle and calibration downtime',
        friction: 'Service station commercial high-flow diesel nozzles suffer seal leaks, meter calibration drift, or defective card readers.',
        costOfFailure: 'Truck drivers bypass the station for the next travel plaza; immediate loss of high-margin convenience store sales.',
        solvedBy: 'In-visit pump inspection audits meter calibration seals, nozzle shutoff mechanisms, and dispenser cleanliness.'
      },
      {
        title: 'Hazardous chemical transport and environmental spill compliance',
        friction: 'Bulk oil tote deliveries without certified secondary containment berms or missing SDS sheets violate EPA/OSHA standards.',
        costOfFailure: 'Catastrophic environmental cleanup liability, regulatory shutdown, and severe corporate reputational damage.',
        solvedBy: 'Safety compliance audit inspects containment spill kits, bund integrity, and SDS binders before tank drops.'
      }
    ],
    coreDecisions: {
      coverage: {
        question: 'Which commercial trucking fleets, mining quarries, and franchised fuel stations warrant direct technical visits?',
        traditionalFlaw: 'Calling on low-volume local delivery fleets while 100-truck regional line-haul carriers are neglected.',
        assistorSolution: 'Fleet vehicle count, annual fuel gallonage, and heavy-duty lubricant consumption rank top accounts.',
        kpi: 'High-gallonage commercial fleet coverage'
      },
      route: {
        question: 'How do we schedule depot visits to catch fleet managers during maintenance shift changes?',
        traditionalFlaw: 'Arriving during early morning truck dispatch when yard supervisors are frantically clearing trucks onto highways.',
        assistorSolution: 'Mid-morning depot scheduling visits maintenance bays while trucks are on the road and shop managers are free.',
        kpi: 'Fleet maintenance manager contact rate'
      },
      inVisit: {
        question: 'What environmental and mechanical audits must be performed on site?',
        traditionalFlaw: 'Checking invoice copies in the front office without inspecting bulk tanks or shop maintenance bays.',
        assistorSolution: '1. Dipstick test bulk fuel tanks for water; 2. Pull engine oil samples for lab analysis; 3. Inspect pump nozzle seals; 4. Reorder drums.',
        kpi: 'Technical site audit completion score'
      },
      order: {
        question: 'What bulk transport drops of ultra-low sulfur diesel, DEF, and 55-gallon oil drums should be scheduled?',
        traditionalFlaw: 'Fleets running dry on Diesel Exhaust Fluid (DEF), causing engine computers to de-rate truck horsepower.',
        assistorSolution: 'Telemetry-driven replenishment models reorder bulk DEF and lubricants before tanks reach 25% safety reserve.',
        kpi: 'Unplanned fuel runout avoidance'
      },
      evidence: {
        question: 'How is environmental compliance and lubricant health verified?',
        traditionalFlaw: 'Handwritten delivery receipts with no verification of tank dip levels.',
        assistorSolution: 'Certified laboratory used-oil reports, time-stamped dipstick photos, and signed safety compliance logs.',
        kpi: 'Documented fleet maintenance savings'
      }
    },
    complianceFirewalls: [
      {
        rule: 'Environmental spill containment and hazardous transport certification',
        rationale: 'Petroleum products require certified secondary containment and hazmat handling protocols.',
        enforcement: 'System blocks bulk transport dispatch if customer site does not have verified, inspected containment berms.'
      },
      {
        rule: 'Commercial credit exposure limits on bulk fuel drops',
        rationale: 'Bulk fuel tanker loads carry massive dollar values (\$40,000+ per drop); credit limits must be strictly honored.',
        enforcement: 'Automated fuel terminal loading lock prevents tanker dispatch if customer credit balance is exceeded.'
      }
    ],
    deepUseCases: [
      {
        title: 'Regional freight fleet used oil analysis drain interval extension',
        scenario: 'A logistics fleet with 85 Class-8 diesel tractors is changing engine oil every 15,000 miles at high annual cost.',
        agentPreparation: 'Analyzes previous lab oil results showing low soot and high TBN reserve, supporting extended 35,000-mile drains.',
        repExecution: 'Rep pulls 6 hot oil samples from tractors, presents certified lab data to the Maintenance Director, and adjusts PM schedule.',
        verifiedOutcome: 'Fleet safely extends drain interval to 35,000 miles, saving \$42,000 annually while upgrading to premium synthetic oil.'
      },
      {
        title: 'Highway travel plaza underground bulk tank water mitigation',
        scenario: 'Routine telemetry flags 1.5 inches of water phase separation in the premium underground diesel tank.',
        agentPreparation: 'Issues high-priority environmental alert and schedules emergency site remediation call.',
        repExecution: 'Rep performs physical water-finding paste test, verifies containment sumps, and coordinates fuel polishing contractor.',
        verifiedOutcome: 'Water evacuated before reaching dispensing suction lines; avoided engine damage to over 200 commercial trucks.'
      }
    ]
  },

  insurance: {
    id: 'insurance',
    name: 'Insurance & Brokerage',
    tagline: 'Independent agencies, corporate brokers and affinity partners',
    icon: 'shield',
    accent: '#0891B2',
    channelModel: 'Independent Insurance Agency Distribution, Corporate Commercial Brokerages, and Affinity Group Partnerships',
    decisionMakers: ['Agency Principal / Managing Broker', 'Commercial Lines Producer', 'Personal Lines Account Manager', 'Underwriting Territory Lead'],
    economicDrivers: 'Loss ratio profitability, commercial book retention, quote-to-bind conversion velocity, cross-sell policy density',
    frontlinePainPoints: [
      {
        title: 'Slow underwriting quote turnaround losing business to competitors',
        friction: 'Commercial lines quotes take 10 business days to return from underwriter desks, causing brokers to bind with faster carriers.',
        costOfFailure: 'Lost commercial account premiums and producer frustration with carrier responsiveness.',
        solvedBy: 'Pre-underwriting intake assistant validates risk parameters on mobile app and issues conditional rapid-bind indications.'
      },
      {
        title: 'Commercial policy renewal window leakage and silent attrition',
        friction: 'Carriers wait until 30 days before policy expiration to review renewals, when brokers have already shopped the account elsewhere.',
        costOfFailure: 'Massive loss of profitable renewal book premiums and increased customer acquisition costs.',
        solvedBy: 'Account retention agent surfaces high-value commercial renewals 90 days in advance with rate defense talking points.'
      },
      {
        title: 'Agency book imbalance and adverse loss ratio spikes',
        friction: 'Agencies write low-margin, high-risk commercial auto or property risks that blow out the carrier regional loss ratio.',
        costOfFailure: 'Agency profit-sharing bonus cancelled; carrier forced to place agency on restrictive underwriting rehabilitation.',
        solvedBy: 'Agency dashboard highlights loss ratio heatmaps and steers producers toward profitable professional liability and cyber risks.'
      },
      {
        title: 'Single-policy account vulnerability and low cross-sell density',
        friction: 'Commercial clients hold general liability policies but place their workers compensation and commercial umbrella with competitors.',
        costOfFailure: 'Account retention drops by 40% compared to clients with 3 or more bundled policies.',
        solvedBy: 'Whitespace engine scans agency commercial client lists and suggests targeted multi-line policy bundling proposals.'
      },
      {
        title: 'Producer binder authority overreach and regulatory compliance',
        friction: 'Brokers exceed their binding authority limits or bind non-admitted risks without signed surplus lines disclosures.',
        costOfFailure: 'Catastrophic regulatory fines, insurance department license suspension, and carrier coverage disputes.',
        solvedBy: 'Strict authority matrix enforces binder caps and blocks policy issuance without mandatory signed regulatory disclosures.'
      }
    ],
    coreDecisions: {
      coverage: {
        question: 'Which independent insurance agencies and commercial brokerages produce profitable growth?',
        traditionalFlaw: 'Visiting non-productive legacy agencies out of habit while high-growth commercial brokerages are neglected.',
        assistorSolution: 'Written premium volume, commercial policy retention rate, and loss ratio profitability rank agency tiering.',
        kpi: 'High-performing agency partner coverage'
      },
      route: {
        question: 'How do we schedule agency visits around commercial producer marketing meetings?',
        traditionalFlaw: 'Dropping into agency offices unannounced when producers are on commercial client site visits.',
        assistorSolution: 'Agency calendar coordination schedules visits during Monday morning all-hands commercial lines production meetings.',
        kpi: 'Producer commercial lines meeting attendance'
      },
      inVisit: {
        question: 'What structured pipeline and book review must be conducted with the agency principal?',
        traditionalFlaw: 'Taking agency principals to lunch without reviewing renewal books or active commercial submission pipelines.',
        assistorSolution: '1. Review 90-day commercial renewal risks; 2. Unblock stalled underwriting quotes; 3. Train on cyber liability rider.',
        kpi: 'Commercial pipeline review completion'
      },
      order: {
        question: 'What commercial policy binders, surplus lines proposals, and multi-line bundles should be targeted?',
        traditionalFlaw: 'Waiting passively for whatever random risks the broker chooses to email into the inbox.',
        assistorSolution: 'Targeted policy appetites and commercial package recommendations pre-screened for carrier underwriting appetite.',
        kpi: 'Underwriting submission appetite fit'
      },
      evidence: {
        question: 'How is broker licensing and binding authority verified?',
        traditionalFlaw: 'Scattered paper binder slips and expired agency state insurance license files.',
        assistorSolution: 'Digital verification of active state insurance licenses, signed surplus lines disclosures, and underwriter binder sign-offs.',
        kpi: 'Audit-compliant insurance policy binding'
      }
    },
    complianceFirewalls: [
      {
        rule: 'Strict underwriter binding authority limits',
        rationale: 'Field reps and brokers cannot bind insurance policies exceeding authorized reinsurance treaty limits.',
        enforcement: 'System automatically blocks policy binding when property values or liability limits exceed field delegation authority.'
      },
      {
        rule: 'Insurance fraud and anti-money laundering (AML) verification',
        rationale: 'Commercial policies and annuity accounts must comply with FinCEN and insurance department fraud guidelines.',
        enforcement: 'Mandatory beneficiary background check and corporate entity verification required before policy release.'
      }
    ],
    deepUseCases: [
      {
        title: 'Commercial manufacturing 90-day renewal defense and cyber cross-sell',
        scenario: 'A \$120,000 manufacturing commercial package policy is up for renewal in 90 days with aggressive competitor shopping.',
        agentPreparation: 'Identifies account, prepares 3-year loss-free credit justification, and packages an integrated cyber liability rider.',
        repExecution: 'Rep meets with the agency producer, reviews the rate defense story, and provides co-branded renewal proposal for the client.',
        verifiedOutcome: 'Client binds 100% renewal 45 days prior to expiration; adds \$14,000 cyber liability policy to package.'
      },
      {
        title: 'Stalled commercial fleet underwriting quote rescue',
        scenario: 'A top broker submitted a 40-vehicle commercial contractor fleet application that has been stalled in underwriting for 8 days.',
        agentPreparation: 'Identifies missing vehicle maintenance telematics and driver MVR records that caused the underwriter hold.',
        repExecution: 'Rep visits broker, helps collect telematics safety logs, and presents the risk package directly to the senior underwriter.',
        verifiedOutcome: 'Underwriter releases competitive quote within 4 hours; broker successfully binds \$84,000 commercial auto policy.'
      }
    ]
  },

  animalhealth: {
    id: 'animalhealth',
    name: 'Animal Health',
    tagline: 'Veterinary clinics, livestock farms and agri-vet dealers',
    icon: 'heart',
    accent: '#059669',
    channelModel: 'Veterinary Practice Direct Supply, Corporate Vet Consolidator Networks, and Livestock Agri-Dealer Distribution',
    decisionMakers: ['Chief Veterinary Officer / Practice Owner', 'Veterinary Practice Manager', 'Livestock Feedlot General Manager', 'Veterinary Technician Lead'],
    economicDrivers: 'Companion animal pharmacy pull-through, livestock herd health compliance, parasiticides dispensing velocity, surgical consumable turns',
    frontlinePainPoints: [
      {
        title: 'Online pet pharmacy prescription leakage',
        friction: 'Pet owners take veterinary prescription scripts to low-cost online pet pharmacy websites rather than buying at the clinic desk.',
        costOfFailure: 'Veterinary clinic loses its highest-margin pharmacy revenue stream (30% of total clinic profit).',
        solvedBy: 'Clinic home-delivery platform integration empowers clinics to dispense directly to client doorsteps at competitive margins.'
      },
      {
        title: 'Seasonal livestock parasite pressure and herd vaccination delays',
        friction: 'Cattle ranchers and hog farms delay critical seasonal deworming and respiratory vaccines, leading to feedlot disease outbreaks.',
        costOfFailure: 'Devastating herd mortality, poor feed conversion efficiency, and emergency veterinary intervention costs.',
        solvedBy: 'Degree-day parasite emergence tracking triggers rancher outreach 3 weeks before seasonal fly and larval peaks.'
      },
      {
        title: 'Veterinary practice clinic staff burnout and training fatigue',
        friction: 'Vet technicians face intense burnout and lack time to educate pet parents on preventative dental health or flea/tick protocols.',
        costOfFailure: 'Pet owners skip preventative care; clinic sales stay restricted to sick-pet emergency visits.',
        solvedBy: 'Companion provides 2-minute client education scripts and digital pet owner discharge guides.'
      },
      {
        title: 'Controlled veterinary substance logbook and DEA compliance risks',
        friction: 'Anesthetic agents and pain medications kept in veterinary clinic safes suffer logbook discrepancies and diversion risks.',
        costOfFailure: 'Severe DEA / veterinary board audits, license revocations, and heavy financial fines.',
        solvedBy: 'In-visit controlled substance audit reconciles physical safe vial counts against practice management billing logs.'
      },
      {
        title: 'Corporate veterinary consolidator formulary standardization friction',
        friction: 'Corporate veterinary hospital chains mandate standardized therapeutic formularies, blocking rep access to individual clinic doctors.',
        costOfFailure: 'Immediate loss of dozens of clinics when corporate headquarters signs an exclusive competitor contract.',
        solvedBy: 'Key account module manages corporate HQ agreements while supporting local clinic practice managers with implementation.'
      }
    ],
    coreDecisions: {
      coverage: {
        question: 'Which veterinary companion clinics and commercial livestock operations warrant on-site consultation?',
        traditionalFlaw: 'Visiting rural mixed-animal practices that buy minimal pharmaceuticals while 8-doctor hospital groups are underserved.',
        assistorSolution: 'Active veterinarian headcount, surgical suite count, and herd head counts prioritize high-dispensing accounts.',
        kpi: 'High-volume veterinary clinic coverage'
      },
      route: {
        question: 'How do we schedule veterinary calls around morning surgical hours?',
        traditionalFlaw: 'Walking into vet clinics at 9:00 AM when veterinarians are scrubbing into sterile surgeries or doing dental cleanings.',
        assistorSolution: 'Afternoon post-surgery scheduling catches doctors between 1:30 PM and 3:30 PM before evening outpatient appointments.',
        kpi: 'Veterinarian face-to-face consultation rate'
      },
      inVisit: {
        question: 'What structured clinical and pharmacy checks must be performed in the clinic?',
        traditionalFlaw: 'Dropping off branded pet pens and asking the front desk receptionist how things are going.',
        assistorSolution: '1. Inspect clinic pharmacy dispensary par levels; 2. Demo new dental preventative chew; 3. Reconcile vaccine refrigeration logs.',
        kpi: 'Veterinary practice audit completion'
      },
      order: {
        question: 'What mix of vaccines, parasiticides, surgical fluids, and chronic care therapeutics should be restocked?',
        traditionalFlaw: 'Clinics ordering small emergency batches from distributors with exorbitant freight charges.',
        assistorSolution: 'Seasonal herd health and preventative care algorithms generate consolidated monthly clinic stocking orders.',
        kpi: 'Clinic pharmacy inventory availability'
      },
      evidence: {
        question: 'How is veterinary cold-chain compliance and authorized dispensing verified?',
        traditionalFlaw: 'Unrecorded vaccine drops with zero proof of refrigeration stability.',
        assistorSolution: 'Continuous digital data-logger temperature verification, licensed veterinarian signature, and DEA compliance logs.',
        kpi: 'Audit-ready veterinary compliance'
      }
    },
    complianceFirewalls: [
      {
        rule: 'Prescription-only veterinary medicine dispensing limits',
        rationale: 'Veterinary prescription pharmaceuticals can only be shipped to licensed veterinary practitioners with valid DEA/state licenses.',
        enforcement: 'Order engine checks veterinary state medical board license expiration and freezes order submission if license has lapsed.'
      },
      {
        rule: 'Livestock meat and milk withdrawal time compliance',
        rationale: 'Livestock therapeutics must strictly adhere to regulatory withdrawal times to prevent antibiotic residues in food supply.',
        enforcement: 'System automatically flags withdrawal intervals on livestock orders and provides mandatory regulatory documentation.'
      }
    ],
    deepUseCases: [
      {
        title: 'Spring flea and tick clinic pharmacy advance stocking program',
        scenario: 'A 5-doctor suburban companion animal hospital is entering peak spring flea and tick season in 3 weeks.',
        agentPreparation: 'Analyzes previous year clinic dispensing history and forecasts a 40% surge in parasiticide demand.',
        repExecution: 'Rep reviews seasonal pet parent footfall with the practice manager and presents a clinic volume rebate bundle.',
        verifiedOutcome: 'Practice secures 3-month inventory at preferred tier; clinic captures \$28,000 in direct pharmacy sales.'
      },
      {
        title: 'Commercial beef feedlot respiratory vaccine protocol implementation',
        scenario: 'A 15,000-head commercial cattle feedlot is receiving autumn calf shipments with high shipping fever risk.',
        agentPreparation: 'Identifies arrival dates, checks vaccine lot availability at the distributor, and prepares protocol briefing.',
        repExecution: 'Rep walks the processing chutes with the feedlot manager, inspects vaccine chillers, and demonstrates low-stress injection.',
        verifiedOutcome: 'Calf processing completed with 100% vaccination compliance; feedlot bovine respiratory disease incidence reduced by 22%.'
      }
    ]
  },

  hygiene: {
    id: 'hygiene',
    name: 'Facility Services & Hygiene',
    tagline: 'Hospital facilities, contract cleaners and food plants',
    icon: 'sparkle',
    accent: '#065F46',
    channelModel: 'Building Service Contractors (BSC), Commercial Facility Direct Contracts, and Hygiene Chemical Distributors',
    decisionMakers: ['Director of Environmental Services (EVS)', 'Contract Cleaning Operations VP', 'Food Plant Sanitation Lead', 'Facility Purchasing Director'],
    economicDrivers: 'Dispenser dilution chemical accuracy, pathogen infection control (HAI), labor cleaning speed per square foot, SDS compliance',
    frontlinePainPoints: [
      {
        title: 'Chemical dispenser dilution calibration drift and chemical waste',
        friction: 'Automated wall dilution units get clogged by hard water minerals, either overdosing chemical (wasting money) or underdosing (failing sanitation).',
        costOfFailure: 'Hospital surface disinfection fails health inspections; cleaning contractor chemical costs rise by 35%.',
        solvedBy: 'In-visit titration check measures active chemical parts per million (PPM) with test strips and recalibrates metering tips.'
      },
      {
        title: 'Commercial restroom dispenser battery and refill runouts',
        friction: 'Touchless hand soap and paper towel dispensers in corporate office buildings run empty, causing angry tenant complaints.',
        costOfFailure: 'Property managers issue breach notices to cleaning contractors, threatening multimillion-dollar janitorial contracts.',
        solvedBy: 'IoT smart restroom sensor integration alerts rep and cleaning supervisor to high-traffic dispenser depletion in real time.'
      },
      {
        title: 'Hazard Communication (OSHA) and missing SDS station fines',
        friction: 'Cleaning closets lack required Safety Data Sheet (SDS) binders or secondary spray bottles have missing OSHA secondary labels.',
        costOfFailure: 'Immediate OSHA inspection fines, employee chemical burn liabilities, and failed facility accreditations.',
        solvedBy: 'Rep inspects janitorial closets, prints OSHA compliant color-coded secondary labels on site, and audits SDS binders.'
      },
      {
        title: 'Hospital Healthcare-Associated Infections (HAI) protocol compliance',
        friction: 'Hospital cleaning crews do not observe mandatory contact dwell times for disinfectant wipes on surgical bed rails.',
        costOfFailure: 'Outbreaks of resistant pathogens, loss of hospital quality accreditation, and CMS reimbursement financial penalties.',
        solvedBy: 'Rep conducts fluorescent UV surface marking audits to objectively measure whether high-touch surfaces were sanitized.'
      },
      {
        title: 'High janitorial staff turnover and chemical safety training gaps',
        friction: 'Cleaning contractors experience 200% annual janitorial turnover; new hires mix bleach and ammonia with catastrophic results.',
        costOfFailure: 'Toxic chlorine gas exposure emergencies, emergency room visits, and facility evacuations.',
        solvedBy: 'Companion provides multilingual, pictographic 90-second chemical safety training modules completed on phone.'
      }
    ],
    coreDecisions: {
      coverage: {
        question: 'Which hospital facilities, food processing plants, and commercial towers warrant high-frequency technical hygiene audits?',
        traditionalFlaw: 'Visiting quiet suburban elementary schools while major acute-care hospital complexes are neglected.',
        assistorSolution: 'Square footage, patient bed count, cleanroom classification, and sanitization audit scores prioritize visits.',
        kpi: 'High-risk facility hygiene coverage'
      },
      route: {
        question: 'How do we schedule facility visits around janitorial cleaning shift changes?',
        traditionalFlaw: 'Arriving at corporate towers mid-day when office staff are at desks and night cleaning crews are off duty.',
        assistorSolution: 'Shift handover windowing schedules visits at 3:30 PM to meet day facility managers and night cleaning supervisors.',
        kpi: 'EVS and cleaning supervisor contact rate'
      },
      inVisit: {
        question: 'What chemical, mechanical, and safety audits must be performed in the facility?',
        traditionalFlaw: 'Dropping off paper catalogs in purchasing and walking away without inspecting janitor closets.',
        assistorSolution: '1. Titrate chemical dilution dispensers; 2. Verify secondary OSHA spray labels; 3. Inspect dispenser batteries; 4. Draft refill order.',
        kpi: 'Facility sanitation audit completion score'
      },
      order: {
        question: 'What concentrated chemical drums, disinfectant wipes, paper rolls, and hand soaps should be dispatched?',
        traditionalFlaw: 'Custodians running out of floor finish or disinfectant during weekend deep-cleaning shutdowns.',
        assistorSolution: 'Consumable usage algorithm calculates exact chemical concentrate dilution yields based on facility cleanable square footage.',
        kpi: 'Zero janitorial runouts'
      },
      evidence: {
        question: 'How is disinfection compliance and dispenser calibration objectively verified?',
        traditionalFlaw: 'Subjective custodial logs claiming everything was cleaned.',
        assistorSolution: 'Fluorescent UV marker inspection photos, calibrated chemical titration test strip photos, and EVS director digital sign-off.',
        kpi: 'Audit-ready facility infection compliance'
      }
    },
    complianceFirewalls: [
      {
        rule: 'EPA registered hospital disinfectant efficacy claims',
        rationale: 'Disinfectant chemicals must strictly comply with EPA-approved master label kill claims and contact dwell times.',
        enforcement: 'System blocks non-approved efficacy claims and mandates that reps provide registered EPA dwell time tables.'
      },
      {
        rule: 'OSHA Hazard Communication chemical labeling',
        rationale: 'All secondary chemical dispensing bottles must bear GHS pictograms, chemical names, and manufacturer warnings.',
        enforcement: 'In-visit safety audit forces photographic proof of secondary label compliance before sign-off.'
      }
    ],
    deepUseCases: [
      {
        title: 'Regional acute care hospital EVS disinfection validation audit',
        scenario: 'A 400-bed hospital is facing an upcoming Joint Commission accreditation review and needs zero HAI sanitation findings.',
        agentPreparation: 'Identifies 6 high-touch patient wards, loads UV fluorescent audit tool, and prepares dilution testing kit.',
        repExecution: 'Rep inspects 12 chemical dilution dispensers, titrates disinfectant PPM, audits SDS binders, and marks 20 high-touch surfaces.',
        verifiedOutcome: 'All dispensers calibrated to perfect 800 PPM; EVS director signs off on audit-ready infection control report.'
      },
      {
        title: 'Food processing plant sanitation shift change chemical overhaul',
        scenario: 'A poultry processing facility has a 4-hour nightly sanitation shift that is failing ATP bioluminescence bacterial swabs.',
        agentPreparation: 'Analyzes plant cleaning chemical usage and spots under-diluted chlorinated alkaline foam dispensers.',
        repExecution: 'Rep meets night sanitation superintendent at 10:30 PM, demonstrates correct foam tip metering, and verifies surface dwell.',
        verifiedOutcome: 'Post-cleaning ATP swab scores drop to near-zero; plant passes USDA food safety inspection with zero demerits.'
      }
    ]
  },

  logistics: {
    id: 'logistics',
    name: 'Logistics & Freight',
    tagline: 'Shippers, freight forwarders and fulfillment hubs',
    icon: 'truck',
    accent: '#0369A1',
    channelModel: 'Third-Party Logistics (3PL) Brokerage, Dedicated Contract Carriage, and Regional Freight Forwarding',
    decisionMakers: ['VP of Supply Chain / Logistics', 'Plant Shipping & Receiving Director', 'Corporate Freight Buyer', 'Warehouse Operations Lead'],
    economicDrivers: 'Cost per pallet lane, tender rejection rate, backhaul asset utilization, dwell/detention penalty avoidance',
    frontlinePainPoints: [
      {
        title: 'Spot market freight rate volatility and tender rejection surges',
        friction: 'Contracted carriers reject shipper freight tenders when spot rates surge, leaving pallets stranded on shipping docks.',
        costOfFailure: 'Shippers pay exorbitant emergency spot rates; delayed retail deliveries trigger massive on-time/in-full (OTIF) fines.',
        solvedBy: 'Dynamic lane pricing engine predicts spot-to-contract market rate spreads and locks dedicated capacity commitments.'
      },
      {
        title: 'Truck driver detention time and staging bay congestion',
        friction: 'Trailers sit waiting for hours at congested warehouse loading docks, incurring \$75/hour detention fees and angry driver walk-offs.',
        costOfFailure: 'Astronomical detention accessorial bills and carriers blacklisting the shipper facility.',
        solvedBy: 'Visit planner tracks warehouse dock appointment adherence and coordinates drop-and-hook trailer pre-staging.'
      },
      {
        title: 'Empty backhaul miles destroying transport operating margins',
        friction: 'Delivery trucks return empty after delivering outward loads, burning expensive diesel fuel and driver hours with zero revenue.',
        costOfFailure: 'Carriers operating at loss-making 15% empty mile ratios, dragging down fleet profitability.',
        solvedBy: 'Freight matchmaking engine matches outbound shippers with reverse-logistics backhaul accounts along the return corridor.'
      },
      {
        title: 'Freight cargo damage, improper pallet securement, and claims disputes',
        friction: 'Crushed corrugated boxes and shifted pallets arrive at destination due to poor trailer strapping or fork-truck puncture.',
        costOfFailure: 'Protracted freight claim disputes, rejected deliveries, and damaged customer relationships.',
        solvedBy: 'In-visit dock inspection audits pallet stretch-wrap tension, load lock bars, and photo-documents trailer departure.'
      },
      {
        title: 'Strict carrier authority and insurance binder expiration risks',
        friction: 'Shippers unknowingly broker loads to unauthorized carriers whose cargo insurance or federal operating authority has lapsed.',
        costOfFailure: 'Complete uninsurable loss in the event of major highway rollover or cargo theft.',
        solvedBy: 'Automated carrier compliance integration checks FMCSA safety scores and insurance certificates before load dispatch.'
      }
    ],
    coreDecisions: {
      coverage: {
        question: 'Which industrial manufacturers and retail shippers generate consistent weekly freight lane volume?',
        traditionalFlaw: 'Chasing sporadic one-off spot loads from small shippers while major multi-plant enterprise freight buyers are ignored.',
        assistorSolution: 'Outbound pallet volume, lane predictability, and annual freight spend rank top commercial shipping accounts.',
        kpi: 'High-volume contract shipper coverage'
      },
      route: {
        question: 'How do we sequence distribution center visits without getting stuck in shipping yard truck traffic?',
        traditionalFlaw: 'Visiting distribution hubs during 4:00 PM outbound dispatch pandemonium when yard masters cannot talk.',
        assistorSolution: 'Mid-morning scheduling visits shipping directors between 10:00 AM and 1:30 PM after morning inbound cross-dock rushes.',
        kpi: 'Supply chain director consultation rate'
      },
      inVisit: {
        question: 'What physical logistics and dock safety checks must be performed on site?',
        traditionalFlaw: 'Sitting in shipping trailers drinking coffee with dispatch clerks.',
        assistorSolution: '1. Audit trailer staging bay queue; 2. Inspect pallet stretch-wrap containment; 3. Review lane tender acceptance; 4. Lock lane contract.',
        kpi: 'Shipping dock audit score'
      },
      order: {
        question: 'What dedicated tractor capacity, refrigerated trailers, and dry van lane commitments should be booked?',
        traditionalFlaw: 'Brokering loads verbally without written lane volume commitments or defined accessorial terms.',
        assistorSolution: 'Structured lane contract builder locks weekly load volume, fuel surcharge schedules, and detention SLA agreements.',
        kpi: 'Contracted lane volume commitment'
      },
      evidence: {
        question: 'How is freight tender acceptance, cargo securement, and delivery confirmed?',
        traditionalFlaw: 'Lost paper Bills of Lading (BOL) with illegible carbon-copy pencil signatures.',
        assistorSolution: 'Digital geofenced trailer gate photos, electronic signed Bills of Lading (e-BOL), and GPS delivery timestamps.',
        kpi: 'Dispute-free freight documentation'
      }
    },
    complianceFirewalls: [
      {
        rule: 'Federal carrier operating authority and cargo insurance verification',
        rationale: 'Freight can only be tendered to carriers holding active DOT authority and verified \$100k+ cargo insurance binders.',
        enforcement: 'System automatically locks load tender dispatch if carrier operating status or insurance has expired.'
      },
      {
        rule: 'Driver Hours of Service (HOS) route compliance',
        rationale: 'Scheduled delivery lanes must mathematically comply with federal driver rest and driving hour limits.',
        enforcement: 'Route planner enforces mandatory rest breaks and flags unrealistic transit schedules that breach HOS safety laws.'
      }
    ],
    deepUseCases: [
      {
        title: 'Major food manufacturing multi-lane contract tender consolidation',
        scenario: 'A national food manufacturer is preparing its annual freight RFP across 12 high-volume distribution corridors.',
        agentPreparation: 'Synthesizes historical tender rejection data and models dedicated fleet capacity with committed 98% acceptance.',
        repExecution: 'Rep presents the lane reliability model to the VP of Supply Chain, proving a \$180,000 annual reduction in spot-market exposure.',
        verifiedOutcome: 'Shipper awards 4 primary dedicated lanes (45 loads per week); \$2.4M annual freight contract secured.'
      },
      {
        title: 'Warehouse loading dock detention time crisis intervention',
        scenario: 'A beverage bottling plant has driver detention times averaging 3.2 hours, causing major carriers to refuse tenders.',
        agentPreparation: 'Identifies dock congestion bottlenecks during afternoon shift changes and models a drop-and-hook trailer pool.',
        repExecution: 'Rep meets with the plant shipping manager, presents the drop-trailer staging plan, and re-allocates 8 staging spots.',
        verifiedOutcome: 'Detention dropped to under 30 minutes; carrier tender acceptance restored to 99% with zero detention penalties.'
      }
    ]
  },

  packaging: {
    id: 'packaging',
    name: 'Industrial & Packaging',
    tagline: 'Food packaging plants, industrial shippers and box makers',
    icon: 'box',
    accent: '#B45309',
    channelModel: 'Direct Corrugated Converters, Flexible Packaging Converters, and Industrial Packaging Distributors',
    decisionMakers: ['Packaging Engineering Director', 'Plant Operations Manager', 'Procurement Category Lead', 'Automation Packaging Line Tech'],
    economicDrivers: 'Corrugated flute edge-crush test (ECT) strength, minimum order quantity (MOQ) run lengths, pallet cube utilization, film gauge optimization',
    frontlinePainPoints: [
      {
        title: 'Pallet stack collapse and crushed corrugated transit failures',
        friction: 'Shippers down-gauge box flute strength to cut costs; pallets stacked 3-high in humid warehouses crush and collapse under load.',
        costOfFailure: 'Catastrophic inventory crushing, rejected retailer deliveries, and massive damage claims against the packaging supplier.',
        solvedBy: 'Packaging engineering diagnostic calculates dynamic compression strength (BCT) matching humidity and warehouse stacking specs.'
      },
      {
        title: 'High Minimum Order Quantity (MOQ) cash flow friction',
        friction: 'Converters require 10,000-box minimum factory production runs, forcing smaller food manufacturers to tie up cash and warehouse space.',
        costOfFailure: 'Prospects abandon quotes for short-run digital box competitors or regional distributor warehouses.',
        solvedBy: 'Run-length optimizer groups shared paperboard caliper widths across neighboring accounts to unlock tiered volume pricing.'
      },
      {
        title: 'Automated case erector line jam shutdowns',
        friction: 'Inconsistent die-cut box scores or warped corrugated blanks jam automated case erectors on high-speed food packaging lines.',
        costOfFailure: 'Packaging line stops at \$5,000/hour while operators manually clear jammed cardboard blanks.',
        solvedBy: 'In-visit line audit inspects case erector suction cups, measures cardboard caliper scoring, and replaces warped bundles.'
      },
      {
        title: 'Stretch film puncture and loose pallet wrap transit shifting',
        friction: 'Warehouse shipping docks use cheap, uncalibrated hand stretch film that punctures on pallet corners, allowing cargo to shift in transit.',
        costOfFailure: 'Loads rejected at supermarket distribution centers; expensive restacking and repalletizing fees.',
        solvedBy: 'Rep demonstrates high-performance multi-layer nano-stretch film with mechanical pre-stretch tension meters.'
      },
      {
        title: 'Sustainability mandates and plastic-to-paper conversion pressure',
        friction: 'Consumer brand customers face corporate ESG mandates to eliminate virgin plastic and polystyrene clamshells by year-end.',
        costOfFailure: 'Brands switch packaging suppliers to innovative molded-fiber or recyclable barrier paperboard converters.',
        solvedBy: 'Sustainability calculator models plastic elimination metrics and proposes certified recyclable barrier paper alternatives.'
      }
    ],
    coreDecisions: {
      coverage: {
        question: 'Which food manufacturing plants and industrial e-commerce fulfillment hubs buy high-volume packaging?',
        traditionalFlaw: 'Visiting small commercial shops while 24/7 food processing and beverage canning plants are uncalled on.',
        assistorSolution: 'Line speed, annual corrugated tonnage, and automated packaging equipment density prioritize accounts.',
        kpi: 'High-tonnage industrial packaging coverage'
      },
      route: {
        question: 'How do we schedule packaging converter visits around factory changeover windows?',
        traditionalFlaw: 'Arriving during full-speed production runs when packaging engineers are occupied on the plant floor.',
        assistorSolution: 'Plant scheduling coordination visits maintenance and engineering teams during scheduled product line changeovers.',
        kpi: 'Packaging engineering consultation rate'
      },
      inVisit: {
        question: 'What physical packaging and machinery checks must be executed on the line?',
        traditionalFlaw: 'Dropping off printed box sample kits in the purchasing lobby.',
        assistorSolution: '1. Inspect automated case erector feeder; 2. Measure pallet stretch-wrap tension; 3. Check warehouse stack compression; 4. Draft order.',
        kpi: 'Packaging line audit score'
      },
      order: {
        question: 'What custom corrugated run lengths, barrier films, and strapping tape should be ordered?',
        traditionalFlaw: 'Ordering piecemeal lots that incur expensive machine setup charges and freight surcharges.',
        assistorSolution: 'Consolidated production run optimization aligns seasonal box sizing with mill corrugator deckle scheduling.',
        kpi: 'Optimized production run efficiency'
      },
      evidence: {
        question: 'How is structural packaging integrity and sustainable material compliance verified?',
        traditionalFlaw: 'Unverifiable claims that the boxes seem strong enough.',
        assistorSolution: 'Certified Edge Crush Test (ECT) lab certificates, pallet stack deflection photos, and plant manager digital sign-off.',
        kpi: 'Documented packaging damage reduction'
      }
    },
    complianceFirewalls: [
      {
        rule: 'FDA direct food contact packaging compliance',
        rationale: 'Packaging contacting food products must hold certified FDA / BRCGS food-grade certifications without toxic ink migration.',
        enforcement: 'System automatically blocks non-certified paperboard or recycled resins from food manufacturing accounts.'
      },
      {
        rule: 'Hazardous materials UN performance packaging certification',
        rationale: 'Packaging for industrial chemicals must bear certified UN specification markings and burst-strength ratings.',
        enforcement: 'Catalog restricts hazardous material packaging to certified, drop-tested structural designs with valid test certificates.'
      }
    ],
    deepUseCases: [
      {
        title: 'Frozen food processor case erector jamming elimination',
        scenario: 'A high-speed frozen pizza packaging facility is experiencing 14 case erector jams per shift with high scrap waste.',
        agentPreparation: 'Identifies scoring caliper defects in competitor box blanks and designs precision die-cut test samples.',
        repExecution: 'Rep runs trial test bundle on the customer case erector, adjusts vacuum cup timing, and proves 10,000 jam-free cycles.',
        verifiedOutcome: 'Customer converts entire annual corrugated box contract (1.2M cases annually); \$340,000 order secured.'
      },
      {
        title: 'Heavy equipment parts pallet compression redesign',
        scenario: 'An industrial machinery manufacturer is suffering 8% pallet stack collapse in overseas ocean freight shipping containers.',
        agentPreparation: 'Calculates dynamic moisture degradation in tropical ocean freight and recommends heavy-duty double-wall BC flute.',
        repExecution: 'Rep presents structural compression calculations to the packaging engineer and conducts drop-testing on site.',
        verifiedOutcome: 'New structural boxes eliminate transit crushing completely; customer signs 2-year sole-source supply contract.'
      }
    ]
  },

  apparel: {
    id: 'apparel',
    name: 'Apparel & Footwear',
    tagline: 'Department stores, boutiques and sporting goods',
    icon: 'bag',
    accent: '#BE185D',
    channelModel: 'Department Store Concessions, Multi-Brand Specialty Boutiques, and Sporting Goods Retail Chains',
    decisionMakers: ['Retail Store General Manager', 'Apparel Merchandise Buyer', 'Visual Merchandising Director', 'Footwear Department Lead'],
    economicDrivers: 'Full-price sell-through rate, size-run stockout avoidance, visual mannequin merchandising lift, markdown cadence',
    frontlinePainPoints: [
      {
        title: 'Broken size runs and lost high-margin full-price sales',
        friction: 'Racks hold excess extra-small and extra-large sizes while high-velocity medium and large core sizes run out completely.',
        costOfFailure: 'Shoppers cannot find their size and leave without buying; remaining odd sizes are dumped at heavy 50% discount markdowns.',
        solvedBy: 'Size-curve replenishment algorithm identifies broken size runs from inventory photos and suggests pre-packed core size assortments.'
      },
      {
        title: 'Visual merchandising mannequin non-compliance',
        friction: 'Store associates dress mannequins haphazardly with non-promotional or out-of-stock garments instead of corporate campaign looks.',
        costOfFailure: 'Loss of visual storytelling impulse footfall; marketing campaign conversions drop by 30%.',
        solvedBy: 'Computer vision mannequin photo audit compares display against seasonal visual merchandising lookbook guidelines.'
      },
      {
        title: 'Fitting room congestion and unhung garment floor clutter',
        friction: 'Garments tried on in fitting rooms pile up on return racks instead of being swiftly steamed, hung, and returned to sales racks.',
        costOfFailure: 'High-demand sizes sit hidden in fitting rooms where shoppers on the sales floor cannot find or buy them.',
        solvedBy: 'In-visit retail floor sweep prioritizes fitting room return rack reconciliation before order placement.'
      },
      {
        title: 'Slow-moving seasonal inventory clogging prime retail real estate',
        friction: 'Winter coats and heavy knits linger on entrance tables well into spring shopping season, blocking fresh seasonal collections.',
        costOfFailure: 'Store feels stale to repeat shoppers; new spring collections fail to achieve initial full-price velocity.',
        solvedBy: 'Assistor surfaces sell-through velocity aging alerts and recommends timely markdown clearance staging.'
      },
      {
        title: 'Footwear stockroom box chaos and long customer try-on wait times',
        friction: 'Stockrooms are unorganized; store staff spend 8 minutes searching for a single pair of shoes while the customer waits on the bench.',
        costOfFailure: 'Shoppers abandon try-ons due to long wait times; store loses high-ticket footwear conversions.',
        solvedBy: 'Stockroom audit inspects barcode scanning organization and establishes fast-runner shoe shelving bays.'
      }
    ],
    coreDecisions: {
      coverage: {
        question: 'Which department stores and high-fashion specialty boutiques drive apparel volume?',
        traditionalFlaw: 'Visiting low-traffic neighborhood boutiques while high-footfall downtown flagship stores lack merchandising attention.',
        assistorSolution: 'Store square footage, footfall density, and apparel sell-through velocity prioritize store visits.',
        kpi: 'High-volume apparel door coverage'
      },
      route: {
        question: 'How do we schedule boutique visits before store opening or during quiet morning retail hours?',
        traditionalFlaw: 'Arriving during weekend afternoon shopping peaks when sales staff cannot leave customer dressing rooms.',
        assistorSolution: 'Pre-opening scheduling (8:30 AM to 10:00 AM) allows reps to steam garments and reset mannequins without shopper disruption.',
        kpi: 'Pre-opening visual merchandising window rate'
      },
      inVisit: {
        question: 'What merchandising and size-curve audits must be executed on the sales floor?',
        traditionalFlaw: 'Casually chatting with sales associates and browsing clothing racks.',
        assistorSolution: '1. Audit mannequin styling against lookbook; 2. Identify broken size curves; 3. Inspect fitting room returns; 4. Propose size fill.',
        kpi: 'Visual merchandising compliance score'
      },
      order: {
        question: 'What pre-pack size assortments and seasonal focus styles should be restocked?',
        traditionalFlaw: 'Ordering equal quantities across all sizes, guaranteeing leftover unsold XS and XXL garments.',
        assistorSolution: 'Demographic size-curve engine suggests tailored size ratios (e.g., 1-S, 2-M, 3-L, 2-XL) matching store history.',
        kpi: 'Full-price sell-through rate'
      },
      evidence: {
        question: 'How is visual merchandising and display execution verified?',
        traditionalFlaw: 'Self-reported rep notes stating store looks fashionable.',
        assistorSolution: 'Time-stamped wide-angle floor photos, mannequin styling match verification, and store manager signed receipt.',
        kpi: 'Photo-verified visual execution'
      }
    },
    complianceFirewalls: [
      {
        rule: 'Seasonal markdown and promotional timing adherence',
        rationale: 'Retailers cannot discount current-season collections before the contractual brand clearance window starts.',
        enforcement: 'Pricing engine flags unauthorized early markdowns and locks wholesale reorders to contractual MSRP tiers.'
      },
      {
        rule: 'Brand visual presentation guidelines',
        rationale: 'Brand apparel must not be co-mingled on rounders with off-brand or clearance merchandise.',
        enforcement: 'In-visit photo audit requires dedicated branded rack separation before approving trade marketing credits.'
      }
    ],
    deepUseCases: [
      {
        title: 'Autumn outerwear collection mannequin and window reset',
        scenario: 'A major department store is launching its seasonal autumn outerwear marketing campaign on Thursday.',
        agentPreparation: 'Identifies store location, confirms delivery of new wool coats, and loads official visual styling guide.',
        repExecution: 'Rep arrives at 8:30 AM, steams coats, dresses two display mannequins to campaign lookbook specs, and verifies lighting.',
        verifiedOutcome: '100% visual compliance verified; coat category full-price sell-through increases by 32% in opening week.'
      },
      {
        title: 'Running footwear broken size-curve rapid replenishment',
        scenario: 'A premier specialty running shop is out of stock in men sizes 9.5 and 10 in the best-selling marathon shoe.',
        agentPreparation: 'Computer vision stockroom scan spots missing core sizes while slower-moving sizes 7 and 13 sit untouched.',
        repExecution: 'Rep reviews size curve velocity with the footwear buyer and submits a tailored 24-pair core-size reorder.',
        verifiedOutcome: 'Stock delivered within 48 hours; shop captures full weekend marathon runner sales with zero size stockouts.'
      }
    ]
  },

  education: {
    id: 'education',
    name: 'Education & Publishing',
    tagline: 'University departments, schools and campus bookstores',
    icon: 'brief',
    accent: '#4338CA',
    channelModel: 'Higher Education Faculty Adoptions, K-12 School District Procurement, and Campus Bookstore Distribution',
    decisionMakers: ['Academic Department Chair', 'Course Coordinator / Lead Professor', 'School District Curriculum Director', 'Campus Bookstore General Manager'],
    economicDrivers: 'Course adoption enrollment volume, digital platform (LMS) access code attach, student bookstore sell-through, institutional renewals',
    frontlinePainPoints: [
      {
        title: 'Faculty course adoption inertia and syllabus copy deadlines',
        friction: 'Professors stick with outdated textbooks by habit, missing syllabus submission deadlines for new semester course adoptions.',
        costOfFailure: 'Campus bookstore does not order books in time; students rent used copies online, resulting in zero new edition sales.',
        solvedBy: 'Course adoption calendar alerts reps to syllabus decision dates 60 days ahead with tailored digital curriculum samples.'
      },
      {
        title: 'Student pirated PDF downloads and low bookstore sell-through',
        friction: 'College students bypass campus bookstores, downloading unauthorized PDF scans or sharing single copies across dorm rooms.',
        costOfFailure: 'Drastic drop in print book sales despite massive 500-student university lecture course adoptions.',
        solvedBy: 'Digital courseware integration bundles homework grading, quizzes, and e-textbooks into mandatory LMS course fees.'
      },
      {
        title: 'K-12 school district adoption cycle bureaucracy',
        friction: 'District curriculum committees follow rigid 5-to-7-year adoption cycles with complex state standards crosswalk requirements.',
        costOfFailure: 'Missing a single state adoption window shuts the publisher out of district textbook funding for seven years.',
        solvedBy: 'System aligns state curriculum standards crosswalk documents directly to committee evaluation scoring rubrics.'
      },
      {
        title: 'Sample desk-copy waste without verified course review',
        friction: 'Publishers mail expensive printed desk copies to hundreds of professors who never open the box or teach the course.',
        costOfFailure: 'Massive printing and shipping expenses with zero attributable course adoption return.',
        solvedBy: 'Digital sampling platform tracks faculty login activity, chapter reading time, and triggers consultative follow-up calls.'
      },
      {
        title: 'Campus bookstore inventory overstock and costly return freight',
        friction: 'Bookstores order 400 textbooks for a class of 400 students, but only 120 buy, resulting in massive return freight costs.',
        costOfFailure: 'High restocking fees, damaged book covers, and tied-up publisher working capital.',
        solvedBy: 'Historical enrollment sell-through forecasting calculates realistic purchase ratios and promotes digital direct access.'
      }
    ],
    coreDecisions: {
      coverage: {
        question: 'Which university academic departments and K-12 school districts represent the largest student enrollments?',
        traditionalFlaw: 'Calling on boutique elective humanities seminars while 1,500-student introductory STEM courses are unvisited.',
        assistorSolution: 'Course catalog student enrollment data, introductory course sizes, and adoption renewal cycles prioritize faculty calls.',
        kpi: 'High-enrollment course coordinator coverage'
      },
      route: {
        question: 'How do we schedule faculty office visits around teaching lecture schedules and office hours?',
        traditionalFlaw: 'Knocking on professor office doors during lectures or student examination grading periods.',
        assistorSolution: 'Faculty office-hour synchronization schedules consultative meetings during posted academic consultation hours.',
        kpi: 'Faculty course coordinator meeting strike rate'
      },
      inVisit: {
        question: 'What academic and institutional reviews must be conducted during the meeting?',
        traditionalFlaw: 'Dropping off printed book catalogs and asking the professor to review them later.',
        assistorSolution: '1. Demo interactive digital homework platform; 2. Match syllabus learning objectives; 3. Verify bookstore order number.',
        kpi: 'Faculty curriculum demonstration completion'
      },
      order: {
        question: 'What course adoption codes, print bookstore shipments, and institutional site licenses should be executed?',
        traditionalFlaw: 'Relying on professors to remember to notify the campus bookstore manager.',
        assistorSolution: 'Dual-action adoption engine confirms faculty course selection and automatically transmits ISBN adoption to bookstore.',
        kpi: 'Bookstore verified adoption confirmation'
      },
      evidence: {
        question: 'How is course adoption commitment and institutional purchase verified?',
        traditionalFlaw: 'Vague faculty promises that they might use the textbook next term.',
        assistorSolution: 'Official course syllabus copy listing mandatory textbook ISBN and bookstore purchase order requisition.',
        kpi: 'Audit-ready course adoption documentation'
      }
    },
    complianceFirewalls: [
      {
        rule: 'Higher education textbook pricing and student affordability disclosures',
        rationale: 'Federal Higher Education Opportunity Act (HEOA) mandates transparent pricing and unbundled textbook disclosures to faculty.',
        enforcement: 'System requires presentation of student retail pricing and unbundled formats before recording adoption.'
      },
      {
        rule: 'K-12 student data privacy (FERPA / COPPA) compliance',
        rationale: 'Digital learning software used in schools must strictly protect student personally identifiable information.',
        enforcement: 'Digital courseware proposals enforce verified institutional privacy agreements and compliance certifications.'
      }
    ],
    deepUseCases: [
      {
        title: 'Introductory chemistry 1,200-student digital courseware adoption',
        scenario: 'A major state university is reviewing course materials for its multi-section General Chemistry sequence.',
        agentPreparation: 'Identifies 1,200 annual enrollments, loads homework platform demo, and maps learning objectives to existing syllabus.',
        repExecution: 'Rep conducts live demo for the 4-member course committee, proving automatic grading integration with university Canvas LMS.',
        verifiedOutcome: 'Department adopts digital courseware for all sections; \$108,000 annual digital access revenue secured.'
      },
      {
        title: 'Campus bookstore semester inventory reconciliation',
        scenario: 'Campus bookstore is preparing course packet orders 6 weeks before autumn semester classes begin.',
        agentPreparation: 'Cross-references faculty adoption confirmations against actual enrolled student seat counts.',
        repExecution: 'Rep reviews enrollment caps with the bookstore textbook buyer and adjusts print versus digital code split.',
        verifiedOutcome: 'Bookstore stocks optimal mix; bookstore achieves 94% sell-through with zero return freight charges.'
      }
    ]
  }
};
