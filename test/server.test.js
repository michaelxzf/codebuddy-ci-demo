import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { handler } from '../src/server.js';

function call(path, method = 'GET') {
  return new Promise((resolve) => {
    const srv = http.createServer(handler).listen(0, () => {
      const { port } = srv.address();
      const req = http.request({ port, path, method }, (res) => {
        let body = ''; res.on('data', (d) => (body += d));
        res.on('end', () => { srv.close(); resolve({ status: res.statusCode, body: JSON.parse(body) }); });
      });
      req.end();
    });
  });
}

test('GET /health', async () => {
  const r = await call('/health');
  assert.equal(r.status, 200);
  assert.deepEqual(r.body, { ok: true });
});

test('GET /products/:sku 404 for unknown sku', async () => {
  const r = await call('/products/nope');
  assert.equal(r.status, 404);
});
