import crypto from 'node:crypto';

/**
 * Enterprise Multi-Tenant In-Memory Data Store with RLS Emulation.
 * Provides the persistent state repository for API routes and sync reconciler.
 */
export class EnterpriseStore {
  constructor() {
    this.tenants = new Map();
    this.users = new Map();
    this.accounts = new Map();
    this.offerings = new Map();
    this.visits = new Map();
    this.decisions = new Map();
    this.orders = new Map();
    this.auditLogs = [];

    this._seedInitialData();
  }

  _seedInitialData() {
    // 1. Tenants
    const tenantAcme = {
      id: 'tenant-acme-global',
      slug: 'acme-global',
      name: 'Acme Global Manufacturing',
      industry: 'manufacturing',
      country: 'US',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    this.tenants.set(tenantAcme.id, tenantAcme);

    // 2. Users
    const repUser = {
      id: 'usr-rep-101',
      tenantId: tenantAcme.id,
      email: 'rep@acme.com',
      fullName: 'Alex Vance',
      role: 'rep',
      status: 'active',
    };
    const mgrUser = {
      id: 'usr-mgr-201',
      tenantId: tenantAcme.id,
      email: 'manager@acme.com',
      fullName: 'Sarah Connor',
      role: 'manager',
      status: 'active',
    };
    this.users.set(repUser.id, repUser);
    this.users.set(mgrUser.id, mgrUser);

    // 3. Accounts
    const accList = [
      { id: 'ACC-101', tenantId: tenantAcme.id, name: 'Precision Turbines Ltd', tier: 'A', isKey: true, annualValue: 320000, current: 240000, whiteSpace: 80000, address: '400 Industrial Way, Detroit, MI' },
      { id: 'ACC-102', tenantId: tenantAcme.id, name: 'Midwest Heavy Casting', tier: 'A', isKey: true, annualValue: 280000, current: 190000, whiteSpace: 90000, address: '850 Foundry Rd, Gary, IN' },
      { id: 'ACC-103', tenantId: tenantAcme.id, name: 'Great Lakes Machining', tier: 'B', isKey: false, annualValue: 150000, current: 110000, whiteSpace: 40000, address: '220 Lake Ave, Toledo, OH' },
      { id: 'ACC-104', tenantId: tenantAcme.id, name: 'Apex Robotics Assembly', tier: 'B', isKey: false, annualValue: 180000, current: 130000, whiteSpace: 50000, address: '15 Robotics Dr, Ann Arbor, MI' },
    ];
    for (const a of accList) this.accounts.set(`${a.tenantId}:${a.id}`, a);

    // 4. Offerings
    const offList = [
      { id: 'OFF-101', tenantId: tenantAcme.id, name: 'Industrial Turbine Bearing Pack', category: 'Bearings', price: 1850, margin: 42 },
      { id: 'OFF-102', tenantId: tenantAcme.id, name: 'High-Temp Synthetic Lubricant', category: 'Lubrication', price: 420, margin: 38 },
      { id: 'OFF-103', tenantId: tenantAcme.id, name: 'Digital Vibration Sensor Node', category: 'Sensors', price: 950, margin: 45 },
    ];
    for (const o of offList) this.offerings.set(`${o.tenantId}:${o.id}`, o);

    // 5. Visits for Today
    const visitList = [
      {
        id: 'vis-1',
        tenantId: tenantAcme.id,
        accountId: 'ACC-101',
        repId: repUser.id,
        sequence: 1,
        plannedStartMin: 540,
        plannedEndMin: 600,
        status: 'planned',
        briefItems: [
          { id: 'act-101-1', title: 'Review Q4 maintenance contract expansion', priority: 'high', type: 'contract' },
          { id: 'act-101-2', title: 'Verify sensor node uptime telemetry', priority: 'medium', type: 'compliance' },
        ],
      },
      {
        id: 'vis-2',
        tenantId: tenantAcme.id,
        accountId: 'ACC-102',
        repId: repUser.id,
        sequence: 2,
        plannedStartMin: 630,
        plannedEndMin: 690,
        status: 'planned',
        briefItems: [
          { id: 'act-102-1', title: 'Introduce High-Temp Synthetic Lubricant', priority: 'high', type: 'pitch' },
        ],
      },
    ];
    for (const v of visitList) this.visits.set(`${v.tenantId}:${v.id}`, v);
  }

  // Multi-Tenant Isolation Helpers
  getTenant(tenantId) {
    return this.tenants.get(tenantId) || null;
  }

  getUserByEmail(email, tenantId) {
    for (const u of this.users.values()) {
      if (u.email === email && (!tenantId || u.tenantId === tenantId)) {
        return u;
      }
    }
    return null;
  }

  getTodaySchedule(tenantId, repId) {
    const visits = [];
    for (const v of this.visits.values()) {
      if (v.tenantId === tenantId && (!repId || v.repId === repId)) {
        const acc = this.accounts.get(`${tenantId}:${v.accountId}`);
        visits.push({ ...v, account: acc });
      }
    }
    visits.sort((a, b) => a.sequence - b.sequence);
    return visits;
  }

  getAccounts(tenantId) {
    const list = [];
    for (const a of this.accounts.values()) {
      if (a.tenantId === tenantId) list.push(a);
    }
    return list;
  }

  getOfferings(tenantId) {
    const list = [];
    for (const o of this.offerings.values()) {
      if (o.tenantId === tenantId) list.push(o);
    }
    return list;
  }

  recordDecision(tenantId, visitId, payload) {
    const id = payload.id || crypto.randomUUID();
    const decision = {
      id,
      tenantId,
      visitId,
      actionId: payload.actionId,
      status: payload.status,
      choice: payload.choice || null,
      reason: payload.reason || null,
      note: payload.note || null,
      atMin: payload.atMin || 0,
      clientMutationId: payload.clientMutationId || null,
      createdAt: new Date().toISOString(),
    };
    this.decisions.set(`${tenantId}:${id}`, decision);

    this.logAudit(tenantId, payload.userId || 'system', 'RECORD_DECISION', 'decision', id, decision);
    return decision;
  }

  getDecisions(tenantId, visitId) {
    const list = [];
    for (const d of this.decisions.values()) {
      if (d.tenantId === tenantId && (!visitId || d.visitId === visitId)) {
        list.push(d);
      }
    }
    return list;
  }

  createOrder(tenantId, payload) {
    const id = payload.id || crypto.randomUUID();
    const order = {
      id,
      tenantId,
      accountId: payload.accountId,
      visitId: payload.visitId || null,
      repId: payload.repId || null,
      items: payload.items || [],
      totalAmount: payload.totalAmount || 0,
      currency: payload.currency || 'USD',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.orders.set(`${tenantId}:${id}`, order);

    this.logAudit(tenantId, payload.repId || 'system', 'CREATE_ORDER', 'order', id, order);
    return order;
  }

  getOrders(tenantId, accountId) {
    const list = [];
    for (const o of this.orders.values()) {
      if (o.tenantId === tenantId && (!accountId || o.accountId === accountId)) {
        list.push(o);
      }
    }
    return list;
  }

  reconcileBatchSync(tenantId, userId, mutations) {
    const results = {
      processed: 0,
      decisionsCreated: 0,
      ordersCreated: 0,
      conflicts: 0,
    };

    for (const m of mutations) {
      if (m.type === 'decision') {
        this.recordDecision(tenantId, m.visitId, {
          ...m.payload,
          userId,
        });
        results.decisionsCreated++;
      } else if (m.type === 'order') {
        this.createOrder(tenantId, {
          ...m.payload,
          repId: userId,
        });
        results.ordersCreated++;
      }
      results.processed++;
    }

    return results;
  }

  logAudit(tenantId, userId, actionType, entityType, entityId, payload) {
    const entry = {
      id: crypto.randomUUID(),
      tenantId,
      userId,
      actionType,
      entityType,
      entityId,
      payload,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.push(entry);
    return entry;
  }

  // SCIM 2.0 User Provisioning
  getAllUsers(tenantId) {
    const list = [];
    for (const u of this.users.values()) {
      if (!tenantId || u.tenantId === tenantId) list.push(u);
    }
    return list;
  }

  getUserById(userId) {
    return this.users.get(userId) || null;
  }

  createOrUpdateUser(tenantId, data) {
    const existing = this.getUserByEmail(data.email, tenantId);
    const id = existing?.id || data.id || `usr-${crypto.randomUUID().slice(0, 8)}`;
    const user = {
      id,
      tenantId: tenantId || 'tenant-acme-global',
      email: data.email,
      fullName: data.fullName || data.name?.formatted || data.email,
      role: data.role || 'rep',
      status: data.active !== false ? 'active' : 'inactive',
      updatedAt: new Date().toISOString(),
      createdAt: existing?.createdAt || new Date().toISOString(),
    };
    this.users.set(id, user);
    return user;
  }

  deactivateUser(tenantId, userId) {
    const u = this.users.get(userId);
    if (!u || u.tenantId !== tenantId) return null;
    u.status = 'inactive';
    u.updatedAt = new Date().toISOString();
    return u;
  }
}

export const globalStore = new EnterpriseStore();
