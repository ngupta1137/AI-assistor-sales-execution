// Assistant content for financial services. The assistant never sets a price or a rate and never approves credit.
// Suitability and consent come before any product. Collections follow the fair treatment policy.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which {accounts} need a terminal check?', intent: 'answer:todayTerminal' }] },
    brief: { rep: [{ q: 'What is a needs review?', intent: 'answer:briefNeeds' }] },
    account: { rep: [{ q: 'How do I talk to the {contact} here?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What should I say to the {contact}?', intent: 'action.talk' }] },
    order: { rep: [{ q: 'Why is the price not shown on these lines?', intent: 'answer:orderPrice' }] },
    complete: { rep: [{ q: 'What does a good {visit} look like?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'When is a good time to see a {contact}?', intent: 'answer:routeOffpeak' }] },
    manager: { manager: [{ q: 'Which {accounts} need a {kam} conversation?', intent: 'answer:managerKam' }] },
    agents: {
      rep: [{ q: 'Who decides on credit?', intent: 'answer:agentsCredit' }],
      manager: [{ q: 'Who decides on credit?', intent: 'answer:agentsCredit' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'Ask about the business before you mention a product. Listen for cash flow, payments and staffing. Explain fees and terms from the approved sheet, get consent before any application, and never hint at an outcome, a rate or an amount.',
    goodVisit: 'A good {visit} fits the trading day, usually outside the lunch peak. You test the terminal, refresh any KYC document that is due, run a needs review only if something suggests a fit, record the signed consent, and leave the {contact} clear about what happens next.',
    guardrailWhy: 'This assistant never sets a price or rate, never approves credit, and never offers a product before suitability and consent.',
    todayTerminal: '{Accounts} with repeated failed connections this week come first. A reset and a network check take about five minutes. A device that keeps failing is logged for a swap.',
    briefNeeds: 'A needs review is a short, documented conversation about what the business needs. A product is offered only if it shows a fit, and the {contact} signs consent before any application. Without it, a line priced by people cannot be sent.',
    orderPrice: 'Credit, pricing and insurance terms are decided by the credit and underwriting teams. A {order} line records interest only. Lines with a monthly fee show it. The agent never sets a price.',
    routeOffpeak: 'Outside the lunch peak and the end-of-day cash count. Owners can focus when customers are not waiting, and a needs review takes about twenty quiet minutes.',
    managerKam: 'The ones with a credit file under review, an {account} frozen by compliance, and small businesses with missed repayments. Those need a decision at account level.',
    agentsCredit: 'The credit and underwriting teams decide. The agent never approves credit, sets a rate or pre-approves anything. It can help collect documents and record interest with consent.',
  },
  assistantRefusals: [
    {
      id: 'ref-credit', guardrail: 'all1',
      patterns: ['set the rate', 'interest rate to', 'what rate', 'approve the loan', 'approve credit', 'will they approve', 'will it be approved', 'loan be approved', 'get the loan', 'get approved', 'how much can they borrow', 'credit limit of', 'lower the rate'],
      refusal: 'I never set a price or a rate, and I never approve credit. The credit team decides.',
      allowed: 'I can list the documents to collect and record the owner\'s interest with consent.',
    },
    {
      id: 'ref-suitability', guardrail: 'all2',
      patterns: ['without consent', 'skip the needs review', 'skip suitability', 'no consent', 'push the loan', 'sell insurance', 'without the signature'],
      refusal: 'Suitability and consent come before any product, so I cannot suggest skipping them.',
      allowed: 'I can show what a needs review covers and where the consent is signed.',
    },
    {
      id: 'ref-collections', guardrail: 'gap1',
      patterns: ['threaten', 'pressure them', 'bully', 'forgive the debt', 'waive the arrears', 'write off', 'guarantee relief'],
      refusal: 'Collections follow the fair treatment policy. I do not suggest pressure, and relief is decided by people.',
      allowed: 'I can show the fair treatment steps for an early arrears conversation.',
    },
    {
      id: 'ref-promise', guardrail: 'order1',
      patterns: ['guarantee approval', 'promise approval', 'pre-approve', 'preapprove', 'confirm the loan'],
      refusal: 'A {order} records interest and consent only. I cannot promise or confirm an outcome.',
      allowed: 'I can show where the {order} goes next and who decides.',
    },
  ],
};
