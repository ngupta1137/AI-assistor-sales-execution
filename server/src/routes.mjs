import { globalStore } from './store.mjs';
import { signJwt, verifyJwt } from './auth.mjs';

function json(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Tenant-ID',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  });
  res.end(JSON.stringify(data));
}

function parseAuth(req) {
  const auth = req.headers['authorization'] || '';
  if (auth.startsWith('Bearer ')) {
    const token = auth.slice(7);
    return verifyJwt(token);
  }
  // Also support X-Tenant-ID header for development/PoC mode
  const tenantId = req.headers['x-tenant-id'];
  if (tenantId) {
    return {
      sub: 'usr-dev-guest',
      tenantId,
      role: 'rep',
      email: 'guest@field.internal',
    };
  }
  return null;
}

export async function handleApiRoute(req, res, url, body) {
  const method = req.method;
  const path = url.pathname;

  // 1. Health Probe
  if (method === 'GET' && path === '/api/v1/health') {
    return json(res, 200, {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0-enterprise',
      service: 'ai-assistor-sales-api',
    });
  }

  // 2. Auth: Login
  if (method === 'POST' && path === '/api/v1/auth/login') {
    const { email, tenantId = 'tenant-acme-global' } = body || {};
    const user = globalStore.getUserByEmail(email || 'rep@acme.com', tenantId);
    if (!user) {
      return json(res, 401, { error: 'Invalid credentials or tenant' });
    }
    const token = signJwt({
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
      name: user.fullName,
    });
    return json(res, 200, {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        tenantId: user.tenantId,
      },
    });
  }

  // Authenticated Context for all subsequent routes
  const session = parseAuth(req);
  if (!session) {
    return json(res, 401, { error: 'Authentication required. Provide Bearer token or X-Tenant-ID.' });
  }
  const tenantId = session.tenantId || 'tenant-acme-global';

  // 3. Auth: Current User Profile
  if (method === 'GET' && path === '/api/v1/auth/me') {
    return json(res, 200, {
      user: session,
      tenant: globalStore.getTenant(tenantId),
    });
  }

  // 4. Territory Day Schedule & Stops
  if (method === 'GET' && path === '/api/v1/territories/today') {
    const visits = globalStore.getTodaySchedule(tenantId, session.sub);
    return json(res, 200, {
      tenantId,
      date: new Date().toISOString().slice(0, 10),
      plannedStops: visits,
    });
  }

  // 5. Account Directory
  if (method === 'GET' && path === '/api/v1/territories/accounts') {
    const accounts = globalStore.getAccounts(tenantId);
    return json(res, 200, { accounts });
  }

  // 6. Offering Catalog
  if (method === 'GET' && path === '/api/v1/offerings') {
    const offerings = globalStore.getOfferings(tenantId);
    return json(res, 200, { offerings });
  }

  // 7. Visit Decisions (Approvals, Overrides, Actions)
  const visitDecisionsMatch = path.match(/^\/api\/v1\/visits\/([^/]+)\/decisions$/);
  if (visitDecisionsMatch) {
    const visitId = visitDecisionsMatch[1];
    if (method === 'POST') {
      const decision = globalStore.recordDecision(tenantId, visitId, {
        ...body,
        userId: session.sub,
      });
      return json(res, 201, { decision });
    }
    if (method === 'GET') {
      const decisions = globalStore.getDecisions(tenantId, visitId);
      return json(res, 200, { decisions });
    }
  }

  // 8. Orders
  if (path === '/api/v1/orders') {
    if (method === 'POST') {
      const order = globalStore.createOrder(tenantId, {
        ...body,
        repId: session.sub,
      });
      return json(res, 201, { order });
    }
    if (method === 'GET') {
      const orders = globalStore.getOrders(tenantId);
      return json(res, 200, { orders });
    }
  }

  // 9. Batch Offline Sync & Conflict Reconciliation
  if (method === 'POST' && path === '/api/v1/sync/batch') {
    const mutations = body.mutations || [];
    const results = globalStore.reconcileBatchSync(tenantId, session.sub, mutations);
    return json(res, 200, {
      status: 'synced',
      reconciled: results,
      syncedAt: new Date().toISOString(),
    });
  }

  return json(res, 404, { error: `Route not found: ${method} ${path}` });
}
