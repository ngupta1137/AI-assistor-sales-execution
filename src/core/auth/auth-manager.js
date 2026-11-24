// Authentication and role-based access control (RBAC) foundation.
// Provides permission boundaries and session identity for client PoC and Production.

export const ROLES = {
  REP: 'rep',
  SALESMAN: 'salesman',
  MANAGER: 'manager',
  KAM: 'kam',
  PARTNER: 'partner',
  ADMIN: 'admin',
  EXEC: 'exec',
};

/**
 * Access permissions mapped by role.
 * Restricts sensitive administrative and configuration operations.
 */
const ROLE_PERMISSIONS = {
  [ROLES.REP]: [
    'today', 'brief', 'account', 'action', 'order', 'complete',
    'route', 'companion', 'companion-plan', 'companion-work',
    'companion-sell', 'companion-learn', 'companion-more', 'ask',
  ],
  [ROLES.SALESMAN]: [
    'route', 'stop', 'order', 'companion', 'companion-work', 'ask',
  ],
  [ROLES.MANAGER]: [
    'manager', 'health', 'brief', 'account', 'action', 'order',
    'audit-trail', 'ask', 'rule-health', 'quality',
  ],
  [ROLES.KAM]: [
    'kam', 'account', 'order', 'brief', 'ask',
  ],
  [ROLES.PARTNER]: [
    'partner', 'order', 'brief',
  ],
  [ROLES.ADMIN]: [
    'config', 'system', 'quality', 'domains', 'rule-health',
    'pm', 'agents', 'audit-trail', 'setup', 'problems',
  ],
  [ROLES.EXEC]: [
    'exec', 'system', 'quality', 'rule-health',
  ],
};

export class AuthManager {
  constructor(options = {}) {
    this.enforcePermissions = options.enforcePermissions ?? false;
    this.currentUser = options.currentUser || {
      id: 'default-user',
      role: ROLES.REP,
      tenantId: 'default-tenant',
      displayName: 'Field User',
    };
  }

  setCurrentUser(user) {
    this.currentUser = { ...this.currentUser, ...user };
  }

  getCurrentUser() {
    return this.currentUser;
  }

  hasPermission(role, screenId) {
    if (!this.enforcePermissions) return true;
    const allowedScreens = ROLE_PERMISSIONS[role] || [];
    return allowedScreens.includes(screenId);
  }

  canAccessScreen(screenId) {
    const role = this.currentUser?.role || ROLES.REP;
    return this.hasPermission(role, screenId);
  }
}

let activeAuth = null;

export function getAuthManager() {
  if (!activeAuth) {
    activeAuth = new AuthManager({ enforcePermissions: false });
  }
  return activeAuth;
}

export function setAuthManager(manager) {
  activeAuth = manager;
}
