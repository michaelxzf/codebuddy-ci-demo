import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import * as inventory from './inventory.js';
import { Cart } from './cart.js';

const carts = new Map();
const PUBLIC_DIR = path.resolve('public');

function json(res, code, body) {
  res.writeHead(code, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

export function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'GET' && url.pathname === '/health') return json(res, 200, { ok: true });
  if (req.method === 'GET' && url.pathname === '/products') return json(res, 200, inventory.list());
  const m = url.pathname.match(/^\/products\/([\w-]+)$/);
  if (req.method === 'GET' && m) {
    const p = inventory.get(m[1]);
    return p ? json(res, 200, p) : json(res, 404, { error: 'not found' });
  }
  if (req.method === 'GET' && url.pathname.startsWith('/static/')) {
    const file = path.join(PUBLIC_DIR, decodeURIComponent(url.pathname.slice('/static/'.length)));
    return fs.readFile(file, (err, data) => {
      if (err) return json(res, 404, { error: 'not found' });
      res.writeHead(200);
      res.end(data);
    });
  }
  if (req.method === 'POST' && url.pathname === '/carts') {
    const id = String(carts.size + 1);
    carts.set(id, new Cart());
    return json(res, 201, { id });
  }
  return json(res, 404, { error: 'not found' });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT || 3000);
  http.createServer(handler).listen(port, () => console.log(`tinyshop listening on :${port}`));
}
