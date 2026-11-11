// Governance pack content for agri: rules, rights, readiness, outcomes,
// clarify questions, account features, memory notes, golden cases and blind evaluation suites.
// Plain language, short sentences, zero em dashes, fictional sample data throughout.

import { buildGovernance } from '../governance-base.js';

export default {
  governance: buildGovernance({
    // Which rule governs each action. '_' means no specific rule applies; the card shows the general standard.
    ruleFor: {
      "preseason": "r_ag_credit",
      "demo": "r_ag_label",
      "meeting": "r_ag_label",
      "dues": "r_ag_credit",
      "advice": "r_ag_label",
      "counter": "r_ag_label",
      "program": "_",
      "genuine": "_",
      "cropstage": "_",
      "newseed": "r_ag_seed",
      "$order": "r_ag_credit",
      "$plan": "_",
    },
    legalApprover: "Regulatory Agronomy Counsel",
    rules: [
      {
            "id": "r_ag_label",
            "approvedWording": "Use this product only for the crops, rates and intervals printed on the label. I cannot recommend any other use.",
            "title": "Mandatory pesticide and crop protection label rate adherence",
            "owner": "Regulatory Agronomy Lead",
            "approver": "Head of Agronomy",
            "exactWording": true,
            "scope": "All crop protection chemical recommendations",
            "neverDecides": "Never advises off-label tank mixes, higher rates or unapproved target crops"
      },
      {
            "id": "r_ag_phi",
            "title": "Statutory pre-harvest interval and grazing restriction enforcement",
            "owner": "Stewardship Specialist",
            "approver": "Environmental Safety Director",
            "exactWording": false,
            "scope": "Food crops and pasture applications",
            "neverDecides": "Never recommends harvest prior to statutory withholding period expiration"
      },
      {
            "id": "r_ag_seed",
            "title": "Patented seed trait licensing and stewardship compliance",
            "owner": "Seed Stewardship Lead",
            "approver": "Legal Counsel",
            "exactWording": false,
            "scope": "All hybrid and proprietary trait seed varieties",
            "neverDecides": "Never authorizes seed transfer without executed technology stewardship agreement"
      },
      {
            "id": "r_ag_buffer",
            "title": "Waterway environmental buffer zone and pollinator protection",
            "owner": "Ecosystem Specialist",
            "approver": "Regulatory Affairs Manager",
            "exactWording": false,
            "scope": "Aerial and ground boom chemical applications",
            "neverDecides": "Never waives mandatory aquatic buffer zones or spray drift restrictions"
      },
      {
            "id": "r_ag_storage",
            "title": "Dealer hazardous chemical storage and bunding verification",
            "owner": "Health & Safety Officer",
            "approver": "Distribution Operations Lead",
            "exactWording": false,
            "scope": "Commercial agricultural dealer warehouses",
            "neverDecides": "Never authorizes shipment to uncertified chemical storage facilities"
      },
      {
            "id": "r_ag_credit",
            "title": "Pre-season input financing and harvest repayment terms",
            "owner": "Agri Credit Analyst",
            "approver": "Regional Credit Director",
            "exactWording": false,
            "scope": "Seasonal crop input financing agreements",
            "neverDecides": "Never extends credit without verified acreage and yield insurance coverage"
      },
      {
            "id": "r_ag_resistance",
            "title": "Fungicide and herbicide resistance management rotation protocol",
            "owner": "Plant Pathology Specialist",
            "approver": "Agronomic Research Lead",
            "exactWording": false,
            "scope": "Repeated application spray programs",
            "neverDecides": "Never suggests consecutive applications of same chemical mode-of-action"
      },
      {
            "id": "r_ag_disposal",
            "title": "Drum recycling and chemical container disposal standards",
            "owner": "Environmental Operations Lead",
            "approver": "Community Relations Director",
            "exactWording": false,
            "scope": "Empty agricultural chemical packaging",
            "neverDecides": "Never approves improper burning or burying of chemical containers"
      }
    ],
    outcomeCopy: {
      suggest: 'Recommended action ready for {rep} review',
      clarify: 'Action clarification required before {visit} recommendation',
      evidence: 'Insufficient field evidence on file to justify action',
      conflict: 'Policy conflict detected between approved commercial rules',
      stale: 'Data is stale and requires refresh before action',
      role: 'Action outside assigned authority for this role',
      compliance: 'Mandatory compliance review and escalation required',
    },
    readiness: [
      {
            "id": "rd_epa_labels",
            "title": "Current registered pesticide label library updated",
            "ready": true,
            "owner": "Regulatory Affairs",
            "detail": "All active crop chemical formulations synchronized with regulatory registry"
      },
      {
            "id": "rd_stewardship_cert",
            "title": "Field agronomist spray drift and stewardship certification",
            "ready": true,
            "owner": "Technical Training",
            "detail": "100% field agronomists certified in environmental buffer compliance"
      },
      {
            "id": "rd_seed_licenses",
            "title": "Proprietary trait seed grower license agreements active",
            "ready": true,
            "owner": "Commercial Legal",
            "detail": "Grower technology use agreements digitized and verified"
      },
      {
            "id": "rd_credit_harvest",
            "title": "Seasonal harvest credit facility limits reviewed",
            "ready": false,
            "owner": "Agricultural Credit",
            "detail": "Awaiting crop insurance yield guarantees for 8 regional cooperatives"
      },
      {
            "id": "rd_chemical_warehouses",
            "title": "Dealer chemical bunding and spill containment inspections",
            "ready": true,
            "owner": "EHS Safety",
            "detail": "All primary retail warehouses certified for secure chemical storage"
      },
      {
            "id": "rd_weather_feed",
            "title": "Field weather station micro-climate API integration",
            "ready": true,
            "owner": "Digital Agronomy",
            "detail": "Live wind speed and delta-T inversion warning system operating"
      }
    ],
    clarifyQuestions: [
      {
            "id": "cq_crop_stage",
            "q": "What is the current phenological growth stage of the crop?",
            "chips": [
      "Pre-emergence seedling",
                  "Early vegetative tillering",
                  "Flowering reproductive stage",
                  "Late grain fill maturity"
    ],
            "resolvedType": "Agronomic timing"
      },
      {
            "id": "cq_pressure_level",
            "q": "What is the verified weed or pest threshold count per square meter?",
            "chips": [
      "Sub-economic cosmetic presence",
                  "Moderate economic threshold reached",
                  "Severe outbreak requiring immediate control"
    ],
            "resolvedType": "Intervention threshold"
      },
      {
            "id": "cq_water_soil",
            "q": "What are the current soil moisture and weather conditions?",
            "chips": [
      "Optimal moisture and dry forecast",
                  "Waterlogged soil: vehicle compaction risk",
                  "High winds: spray drift hazard"
    ],
            "resolvedType": "Environmental suitability"
      }
    ],
    staleLimitDays: 14,
    holdReasons: ["Seasonal harvest payment term extension requires regional credit committee sanction"],
    goldenCases: [
      {
            "id": "gc-potential-1",
            "capability": "potential",
            "scenario": "High confidence potential opportunity with verified field evidence in agri",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-2",
            "capability": "potential",
            "scenario": "Ambiguous customer context requires clarification question before potential recommendation in agri",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-3",
            "capability": "potential",
            "scenario": "Historical record missing required field documentation; asks for evidence update in agri",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-4",
            "capability": "potential",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this potential in agri",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-5",
            "capability": "potential",
            "scenario": "Source data for potential is older than agreed freshness threshold; flags stale and offers refresh in agri",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-6",
            "capability": "potential",
            "scenario": "Attempted action on potential falls outside current user assigned role authority in agri",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-7",
            "capability": "potential",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in agri",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-8",
            "capability": "potential",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in agri",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-1",
            "capability": "gaps",
            "scenario": "High confidence gaps opportunity with verified field evidence in agri",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-2",
            "capability": "gaps",
            "scenario": "Ambiguous customer context requires clarification question before gaps recommendation in agri",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-3",
            "capability": "gaps",
            "scenario": "Historical record missing required field documentation; asks for evidence update in agri",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-4",
            "capability": "gaps",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this gaps in agri",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-5",
            "capability": "gaps",
            "scenario": "Source data for gaps is older than agreed freshness threshold; flags stale and offers refresh in agri",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-6",
            "capability": "gaps",
            "scenario": "Attempted action on gaps falls outside current user assigned role authority in agri",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-7",
            "capability": "gaps",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in agri",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-8",
            "capability": "gaps",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in agri",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-1",
            "capability": "ranking",
            "scenario": "High confidence ranking opportunity with verified field evidence in agri",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-2",
            "capability": "ranking",
            "scenario": "Ambiguous customer context requires clarification question before ranking recommendation in agri",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-3",
            "capability": "ranking",
            "scenario": "Historical record missing required field documentation; asks for evidence update in agri",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-4",
            "capability": "ranking",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this ranking in agri",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-5",
            "capability": "ranking",
            "scenario": "Source data for ranking is older than agreed freshness threshold; flags stale and offers refresh in agri",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-6",
            "capability": "ranking",
            "scenario": "Attempted action on ranking falls outside current user assigned role authority in agri",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-7",
            "capability": "ranking",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in agri",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-8",
            "capability": "ranking",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in agri",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-1",
            "capability": "planning",
            "scenario": "High confidence planning opportunity with verified field evidence in agri",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-2",
            "capability": "planning",
            "scenario": "Ambiguous customer context requires clarification question before planning recommendation in agri",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-3",
            "capability": "planning",
            "scenario": "Historical record missing required field documentation; asks for evidence update in agri",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-4",
            "capability": "planning",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this planning in agri",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-5",
            "capability": "planning",
            "scenario": "Source data for planning is older than agreed freshness threshold; flags stale and offers refresh in agri",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-6",
            "capability": "planning",
            "scenario": "Attempted action on planning falls outside current user assigned role authority in agri",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-7",
            "capability": "planning",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in agri",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-8",
            "capability": "planning",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in agri",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-1",
            "capability": "order",
            "scenario": "High confidence order opportunity with verified field evidence in agri",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-2",
            "capability": "order",
            "scenario": "Ambiguous customer context requires clarification question before order recommendation in agri",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-3",
            "capability": "order",
            "scenario": "Historical record missing required field documentation; asks for evidence update in agri",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-4",
            "capability": "order",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this order in agri",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-5",
            "capability": "order",
            "scenario": "Source data for order is older than agreed freshness threshold; flags stale and offers refresh in agri",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-6",
            "capability": "order",
            "scenario": "Attempted action on order falls outside current user assigned role authority in agri",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-7",
            "capability": "order",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in agri",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-8",
            "capability": "order",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in agri",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      }
    ],
    blindCases: [
      {
            "id": "bc-1",
            "capability": "potential",
            "scenario": "High volume account with unverified regional footprint",
            "expected": "clarify",
            "actual": "clarify",
            "missType": "none"
      },
      {
            "id": "bc-2",
            "capability": "potential",
            "scenario": "New branch with zero operating history; safe conservative fallback",
            "expected": "declined",
            "actual": "declined",
            "missType": "none"
      },
      {
            "id": "bc-3",
            "capability": "gaps",
            "scenario": "Assortment void with active customer category exclusion",
            "expected": "declined",
            "actual": "declined",
            "missType": "declined"
      },
      {
            "id": "bc-4",
            "capability": "gaps",
            "scenario": "Core line shelf void with confirmed warehouse stockout",
            "expected": "conflict",
            "actual": "conflict",
            "missType": "none"
      },
      {
            "id": "bc-5",
            "capability": "ranking",
            "scenario": "Urgent restocking needed during restricted dock receiving window",
            "expected": "planning",
            "actual": "planning",
            "missType": "none"
      },
      {
            "id": "bc-6",
            "capability": "ranking",
            "scenario": "High value task exceeding rep daily allowable drive time",
            "expected": "declined",
            "actual": "declined",
            "missType": "declined"
      },
      {
            "id": "bc-7",
            "capability": "planning",
            "scenario": "Emergency customer request on scheduled route rest day",
            "expected": "clarify",
            "actual": "clarify",
            "missType": "none"
      },
      {
            "id": "bc-8",
            "capability": "planning",
            "scenario": "Vehicle maintenance issue redistributes stops to nearby representative",
            "expected": "suggest",
            "actual": "suggest",
            "missType": "none"
      },
      {
            "id": "bc-9",
            "capability": "order",
            "scenario": "Proposed volume inadvertently trips unbudgeted rebate bracket",
            "expected": "compliance",
            "actual": "compliance",
            "missType": "none"
      },
      {
            "id": "bc-10",
            "capability": "order",
            "scenario": "Suggested order exceeds local warehouse safety buffer threshold",
            "expected": "conflict",
            "actual": "conflict",
            "missType": "none"
      },
      {
            "id": "bc-11",
            "capability": "order",
            "scenario": "Substitute offering pricing mismatch against master agreement",
            "expected": "wrong",
            "actual": "wrong",
            "missType": "wrong"
      },
      {
            "id": "bc-12",
            "capability": "gaps",
            "scenario": "Promotional display suggested after campaign window close",
            "expected": "wrong",
            "actual": "wrong",
            "missType": "wrong"
      }
    ],
  }),
};
