// Screen registry. A screen exports render(ctx, args), optional actions and mounted().
import * as setup from './setup.js';
import * as today from './today.js';
import * as brief from './brief.js';
import * as account from './account.js';
import * as action from './action.js';
import * as order from './order.js';
import * as complete from './complete.js';
import * as manager from './manager.js';
import * as agents from './agents.js';
import * as config from './config.js';
import * as problems from './problems.js';

export const SCREENS = { setup, today, brief, account, action, order, complete, manager, agents, config, problems };

export const ACTIONS = Object.assign({}, ...Object.values(SCREENS).map((s) => s.actions || {}));
