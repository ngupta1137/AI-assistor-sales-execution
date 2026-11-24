import http from 'node:http';
import { handleApiRoute } from './routes.mjs';

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';

export function createServer() {
  return http.createServer(async (req, res) => {
    // 1. CORS Preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Tenant-ID',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Max-Age': '86400',
      });
      return res.end();
    }

    const host = req.headers.host || `localhost:${PORT}`;
    const url = new URL(req.url, `http://${host}`);

    // 2. Parse JSON body for POST/PUT requests
    let body = null;
    if (req.method === 'POST' || req.method === 'PUT') {
      try {
        const buffers = [];
        for await (const chunk of req) {
          buffers.push(chunk);
        }
        const text = Buffer.concat(buffers).toString('utf8');
        if (text) {
          body = JSON.parse(text);
        }
      } catch (err) {
        res.writeHead(400, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        return res.end(JSON.stringify({ error: 'Malformed JSON payload', details: err.message }));
      }
    }

    // 3. Delegate to API Router
    try {
      await handleApiRoute(req, res, url, body);
    } catch (err) {
      console.error('[API Error]:', err);
      res.writeHead(500, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({ error: 'Internal server error', message: err.message }));
    }
  });
}

// Auto-start if executed directly via CLI
if (process.argv[1] && process.argv[1].endsWith('server.mjs')) {
  const server = createServer();
  server.listen(PORT, HOST, () => {
    console.log(`[AI Assistor Sales Execution] Enterprise API server listening on http://${HOST}:${PORT}`);
  });
}
