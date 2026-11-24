import { globalStore } from './store.mjs';
import { signJwt, verifyJwt, generateSamlMetadata, parseSamlResponse, verifyScimToken } from './auth.mjs';

function json(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Tenant-ID',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  });
  res.end(JSON.stringify(data));
}

function xml(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/xml',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(data);
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

  // 2b. Auth: SAML 2.0 SP Metadata
  if (method === 'GET' && path === '/api/v1/auth/saml/metadata') {
    return xml(res, 200, generateSamlMetadata());
  }

  // 2c. Auth: SAML 2.0 Assertion Consumer Service (ACS)
  if (method === 'POST' && path === '/api/v1/auth/saml/acs') {
    const samlResponse = body?.SAMLResponse || body?.samlResponse || '';
    const parsed = parseSamlResponse(samlResponse);
    if (!parsed) {
      return json(res, 400, { error: 'Invalid or missing SAML assertion' });
    }
    const tenantId = body?.tenantId || 'tenant-acme-global';
    let user = globalStore.getUserByEmail(parsed.email, tenantId);
    if (!user) {
      user = globalStore.createOrUpdateUser(tenantId, {
        email: parsed.email,
        fullName: parsed.fullName,
        role: parsed.role,
      });
    }
    const token = signJwt({
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
      name: user.fullName,
      authMethod: 'saml2',
    });
    return json(res, 200, {
      token,
      user,
      idpSession: true,
    });
  }

  // 2d. Auth: OIDC Token Exchange
  if (method === 'POST' && path === '/api/v1/auth/oidc/token') {
    const { code, tenantId = 'tenant-acme-global' } = body || {};
    if (!code) {
      return json(res, 400, { error: 'Authorization code required' });
    }
    const mockUser = globalStore.getUserByEmail('rep@acme.com', tenantId);
    const token = signJwt({
      sub: mockUser?.id || 'usr-oidc-101',
      tenantId,
      email: mockUser?.email || 'rep@acme.com',
      role: mockUser?.role || 'rep',
      name: mockUser?.fullName || 'Federated OIDC User',
      authMethod: 'oidc',
    });
    return json(res, 200, {
      access_token: token,
      id_token: token,
      token_type: 'Bearer',
      expires_in: 86400,
    });
  }

  // 2e. SCIM 2.0 Core Endpoints (RFC 7643 / RFC 7644)
  if (path.startsWith('/api/v1/scim/v2')) {
    const authHeader = req.headers['authorization'] || '';
    const scimToken = authHeader.replace(/^Bearer\s+/i, '');
    const scimSession = verifyScimToken(scimToken) || parseAuth(req);
    if (!scimSession) {
      return json(res, 401, {
        schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
        detail: 'Valid SCIM Bearer token required',
        status: '401',
      });
    }
    const tenantId = scimSession.tenantId || 'tenant-acme-global';

    if (method === 'GET' && path === '/api/v1/scim/v2/Schemas') {
      return json(res, 200, {
        schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
        totalResults: 1,
        Resources: [{
          id: 'urn:ietf:params:scim:schemas:core:2.0:User',
          name: 'User',
          description: 'Core User Schema',
        }],
      });
    }

    if (method === 'GET' && path === '/api/v1/scim/v2/Users') {
      const users = globalStore.getAllUsers(tenantId);
      const resources = users.map((u) => ({
        schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
        id: u.id,
        userName: u.email,
        name: { formatted: u.fullName },
        emails: [{ value: u.email, primary: true }],
        active: u.status === 'active',
        roles: [{ value: u.role }],
      }));
      return json(res, 200, {
        schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
        totalResults: resources.length,
        itemsPerPage: resources.length,
        startIndex: 1,
        Resources: resources,
      });
    }

    if (method === 'POST' && path === '/api/v1/scim/v2/Users') {
      const email = body?.userName || body?.emails?.[0]?.value || 'user@company.com';
      const fullName = body?.name?.formatted || body?.displayName || email;
      const role = body?.roles?.[0]?.value || 'rep';
      const user = globalStore.createOrUpdateUser(tenantId, {
        email,
        fullName,
        role,
        active: body?.active !== false,
      });
      return json(res, 201, {
        schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
        id: user.id,
        userName: user.email,
        name: { formatted: user.fullName },
        active: user.status === 'active',
        roles: [{ value: user.role }],
      });
    }

    const userMatch = path.match(/^\/api\/v1\/scim\/v2\/Users\/([^/]+)$/);
    if (userMatch) {
      const userId = userMatch[1];
      if (method === 'GET') {
        const u = globalStore.getUserById(userId);
        if (!u || u.tenantId !== tenantId) {
          return json(res, 404, {
            schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
            detail: 'User not found',
            status: '404',
          });
        }
        return json(res, 200, {
          schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
          id: u.id,
          userName: u.email,
          name: { formatted: u.fullName },
          active: u.status === 'active',
          roles: [{ value: u.role }],
        });
      }
      if (method === 'PATCH' || method === 'PUT') {
        const active = body?.active ?? (body?.Operations?.find((o) => o.path === 'active')?.value !== false);
        let u;
        if (active === false) {
          u = globalStore.deactivateUser(tenantId, userId);
        } else {
          u = globalStore.getUserById(userId);
          if (u) u.status = 'active';
        }
        if (!u) {
          return json(res, 404, {
            schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
            detail: 'User not found',
            status: '404',
          });
        }
        return json(res, 200, {
          schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
          id: u.id,
          userName: u.email,
          name: { formatted: u.fullName },
          active: u.status === 'active',
          roles: [{ value: u.role }],
        });
      }
    }
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
