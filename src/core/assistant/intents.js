// Intent catalogue for the assistant. An intent is a question the assistant can answer from data.
// phrases: matched as text inside the normalised question (3 points each).
// words: matched as whole words or word starts (1 point each).
// screens: the intent gets +1 on these screens, so context breaks ties.
// The question is normalised first: the pack's own words (clinic, HCP, call, proposal) become the
// generic ones used here (account, contact, visit, order), so one catalogue serves every industry.

export const SCREEN_IDS = ['today', 'brief', 'account', 'action', 'order', 'complete', 'route', 'manager', 'agents', 'config', 'problems'];

export const INTENTS = [
  // Today
  { id: 'today.first', screens: ['today'], phrases: ['do first', 'start with', 'where do i start', 'top priority', 'most important', 'first account', 'which account first', 'visit first', 'start first'], words: ['first', 'start', 'priority'] },
  { id: 'today.order', screens: ['today'], phrases: ['why this order', 'why is this ranked', 'how is the day ranked', 'how was it ranked', 'what is the sequence', 'ranked by'], words: ['order', 'ranked', 'ranking', 'sequence'] },
  { id: 'today.wait', screens: ['today'], phrases: ['can wait', 'what can i skip', 'least important', 'lowest priority', 'if time allows'], words: ['wait', 'skip', 'later', 'lowest'] },
  { id: 'today.budget', screens: ['today'], phrases: ['time budget', 'how long', 'how much time', 'time was used', 'day end', 'end of day'], words: ['budget', 'minutes', 'hours', 'time'] },
  // Visit brief
  { id: 'brief.whyfirst', screens: ['brief'], phrases: ['ranked first', 'why is this action', 'why first', 'why this action', 'top action', 'first action'], words: ['ranked', 'why', 'top'] },
  { id: 'brief.compared', screens: ['brief'], phrases: ['compare against', 'compared against', 'compared with', 'what did the agent compare', 'baseline'], words: ['compare', 'compared', 'comparison', 'against', 'peers'] },
  { id: 'brief.sure', screens: ['brief', 'action'], phrases: ['how sure', 'how confident', 'confidence level', 'how certain'], words: ['sure', 'confident', 'confidence', 'certain'] },
  { id: 'brief.override', screens: ['brief'], phrases: ['if i override', 'what happens when i override', 'override an item', 'overrides go'], words: ['override', 'overrides', 'overridden'] },
  { id: 'brief.evidence', screens: ['brief', 'action'], phrases: ['evidence is missing', 'missing evidence', 'what evidence', 'still need evidence'], words: ['evidence', 'proof', 'photo', 'signature'] },
  // Account 360
  { id: 'account.summary', screens: ['account'], phrases: ['summary of this', 'summarise this', 'summarize this', 'tell me about this', 'about this account', 'overview of this'], words: ['summary', 'summarise', 'summarize', 'overview'] },
  { id: 'account.changed', screens: ['account'], phrases: ['what changed', 'since the last visit', 'since last visit', 'last visit', 'what is new'], words: ['changed', 'since', 'new'] },
  { id: 'account.gaps', screens: ['account'], phrases: ['offering gap', 'offerings are gaps', 'what is missing', 'not stocked', 'white space'], words: ['offering', 'gap', 'gaps', 'missing'] },
  { id: 'account.contact', screens: ['account'], phrases: ['who is the contact', 'who do i talk to', 'who should i speak', 'main contact'], words: ['contact', 'who', 'decision'] },
  // Action
  { id: 'action.value', screens: ['action'], phrases: ['how was the value', 'value estimated', 'value estimate', 'how much is it worth', 'where does the value'], words: ['value', 'worth', 'estimated', 'estimate'] },
  { id: 'action.evidence', screens: ['action'], phrases: ['what evidence supports', 'evidence supports', 'why does it matter', 'why it matters'], words: ['supports', 'support', 'evidence', 'why'] },
  { id: 'action.effort', screens: ['action'], phrases: ['how long will it take', 'how long does it take', 'how much effort'], words: ['effort', 'minutes', 'long', 'time'] },
  { id: 'action.guardrail', screens: ['action'], phrases: ['what is the guardrail', 'guardrail on this', 'what are the limits', 'what rule applies to this action'], words: ['guardrail', 'guardrails', 'limit', 'limits', 'allowed'] },
  { id: 'action.talk', screens: ['action'], phrases: ['talking points', 'what should i say', 'what do i say', 'how do i raise'], words: ['talking', 'say', 'raise', 'points'] },
  // Order
  { id: 'order.why', screens: ['order'], phrases: ['why these lines', 'why these', 'where do the lines come from', 'how were the lines', 'why this quantity'], words: ['lines', 'quantity', 'quantities', 'suggested'] },
  { id: 'order.blocking', screens: ['order'], phrases: ['blocking send', 'what is blocking', 'can i send', 'why cannot i send', 'why can i not send', 'why is submit', 'cannot submit', 'not allowed to send'], words: ['blocking', 'blocked', 'send', 'submit', 'stuck'] },
  { id: 'order.rule', screens: ['order'], phrases: ['what rule applies', 'which rule', 'approval rule', 'approval limit', 'who approves', 'why is there a'], words: ['rule', 'rules', 'approval', 'approve', 'limit', 'threshold', 'cap', 'capped', 'maximum'] },
  { id: 'order.edit', screens: ['order'], phrases: ['if i edit', 'change a line', 'what changes if', 'if i change the quantity', 'raise a line'], words: ['edit', 'change', 'changes', 'raise', 'increase'] },
  // Visit complete
  { id: 'complete.log', screens: ['complete'], phrases: ['what should i log', 'what do i log', 'what to record', 'what do i record'], words: ['log', 'record', 'outcome', 'outcomes'] },
  { id: 'complete.carry', screens: ['complete'], phrases: ['carry to next', 'carries to next', 'next time', 'follow up next', 'what carries'], words: ['carry', 'carries', 'next', 'follow'] },
  { id: 'complete.manager', screens: ['complete'], phrases: ['manager will see', 'what will my manager', 'what does my manager see'], words: ['manager', 'see', 'sees'] },
  // Route
  { id: 'route.why', screens: ['route'], phrases: ['why this sequence', 'why this route', 'why this order of', 'how was the route'], words: ['sequence', 'route', 'sequenced'] },
  { id: 'route.skip', screens: ['route'], phrases: ['if i skip', 'skip one', 'skip a stop', 'if an account closes', 'if it is closed'], words: ['skip', 'closes', 'closed'] },
  { id: 'route.late', screens: ['route'], phrases: ['if i run late', 'running late', 'run late', 'am i late', 'behind schedule'], words: ['late', 'delay', 'delayed', 'behind'] },
  // Manager
  { id: 'mgr.attention', screens: ['manager'], phrases: ['needs my attention', 'need my attention', 'what needs attention', 'which overrides need', 'what should i look at', 'open exceptions'], words: ['attention', 'exception', 'exceptions', 'overrides', 'urgent'] },
  { id: 'mgr.drift', screens: ['manager'], phrases: ['reps drifting', 'who is drifting', 'who is behind', 'which reps are'], words: ['drifting', 'drift', 'behind', 'reps'] },
  { id: 'mgr.coach', screens: ['manager'], phrases: ['what should i coach', 'what to coach', 'coaching prompts', 'who needs coaching'], words: ['coach', 'coaching'] },
  { id: 'mgr.patterns', screens: ['manager'], phrases: ['override reasons', 'patterns in override', 'common reasons', 'why are reps overriding'], words: ['patterns', 'pattern', 'reasons', 'trend'] },
  // Agents
  { id: 'agents.what', screens: ['agents'], phrases: ['what does each agent', 'what do the agents do', 'what does the agent do'], words: ['agent', 'agents', 'does'] },
  { id: 'agents.cannot', screens: ['agents'], phrases: ['cannot do', 'can not do', 'never its call', 'what is off limits'], words: ['cannot', 'never', 'forbidden'] },
  { id: 'agents.stop', screens: ['agents'], phrases: ['press stop', 'when i stop', 'what happens when i stop', 'if i stop', 'stop button', 'kill switch'], words: ['stop', 'stopped', 'pause', 'paused'] },
  // Configuration and problems
  { id: 'config.explain', screens: ['config', 'problems'], phrases: ['how is this configured', 'how does this fit', 'what is configured', 'configuration not a custom build'], words: ['configured', 'configuration', 'pack', 'packs'] },
  { id: 'config.vocab', screens: ['config'], phrases: ['which words change', 'what words change', 'vocabulary'], words: ['words', 'vocabulary', 'terms', 'rename'] },
  { id: 'config.country', screens: ['config'], phrases: ['what changes by country', 'country pack', 'what changes in this country'], words: ['country', 'currency', 'locale', 'format'] },
  { id: 'config.add', screens: ['config', 'problems'], phrases: ['add an industry', 'add a new industry', 'add an pack', 'new industry', 'add a country', 'add a pack'], words: ['add', 'extend', 'new'] },
  { id: 'problems.map', screens: ['problems', 'config'], phrases: ['which problem', 'problem maps', 'maps to which capability', 'which capability'], words: ['problem', 'problems', 'capability', 'capabilities', 'solves'] },
  { id: 'problems.prove', screens: ['problems'], phrases: ['how would a pilot', 'measure this', 'how do we prove', 'pilot measure'], words: ['pilot', 'measure', 'prove', 'success'] },
  // Global
  { id: 'global.target', screens: ['today'], phrases: ['my target', 'month to date', 'how am i doing', 'against target'], words: ['target', 'month', 'kpi', 'achieved'] },
  { id: 'global.coverage', screens: ['manager', 'today'], phrases: ['not been visited', 'not visited', 'not been seen', 'longest gap', 'overdue visit', 'tier a'], words: ['coverage', 'overdue', 'neglected', 'visited'] },
  { id: 'global.blocked', screens: ['order'], phrases: ['cannot be sent', 'which orders are blocked', 'what is blocked'], words: ['blocked', 'prerequisite', 'consent'] },
  { id: 'global.talk', screens: ['account', 'action'], phrases: ['how do i talk to', 'how to talk to', 'how should i speak to', 'how do i approach'], words: ['approach', 'speak', 'talk'] },
  { id: 'global.goodvisit', screens: ['brief', 'complete', 'today'], phrases: ['good visit', 'what does a good', 'what good looks like', 'how should a visit go'], words: ['good', 'great', 'ideal'] },
  { id: 'nav.biggestgap', screens: ['today', 'account'], phrases: ['biggest gap', 'largest gap', 'most white space', 'biggest white space'], words: [] },
  { id: 'nav.draftorder', screens: ['account', 'brief', 'order'], phrases: ['draft the order', 'draft an order', 'draft the proposal', 'prepare the order', 'open the order', 'open the builder', 'build the order'], words: ['draft'] },
  // Setup screen
  { id: 'about.what', screens: ['setup'], phrases: ['what is ai assistor', 'what is this', 'what does this do', 'what is this app'], words: ['what', 'product', 'app'] },
  { id: 'about.sample', screens: ['setup'], phrases: ['real data', 'is this real', 'sample data', 'is the data real'], words: ['real', 'sample', 'fictional', 'fake'] },
  { id: 'about.config', screens: ['setup'], phrases: ['how does it change', 'different industries', 'my industry', 'how does it work for'], words: ['industry', 'industries', 'country', 'countries', 'change'] },
  { id: 'about.custom', screens: ['setup'], phrases: ['custom build', 'configuration', 'how long to set up'], words: ['custom', 'build', 'integration', 'integrate'] },
];

export const INTENT_IDS = new Set(INTENTS.map((i) => i.id));

/** True for ids that need a pack key (answer:<key>) or a canned Q&A index (qa:<n>). */
export const isDynamicIntent = (id) => /^answer:[A-Za-z0-9]+$/.test(id) || /^qa:\d+$/.test(id);
export const isKnownIntent = (id) => INTENT_IDS.has(id) || isDynamicIntent(id);
