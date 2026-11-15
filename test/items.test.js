import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { handler } from '../src/server.js';

function req(srv, method, path, body) {
  return new Promise((resolve) => {
    const r = http.request({ port: srv.address().port, method, path, headers: { 'content-type': 'application/json' } }, (res) => {
      let b = ''; res.on('data', (d) => (b += d)); res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(b) }));
    });
    r.end(body ? JSON.stringify(body) : undefined);
  });
}

test('POST /carts/:id/items adds an item and returns the total', async () => {
  const srv = http.createServer(handler).listen(0);
  await new Promise((r) => srv.once('listening', r));
  const { body: cart } = await req(srv, 'POST', '/carts');
  const r = await req(srv, 'POST', `/carts/${cart.id}/items`, { sku: 'mug-logo', qty: 2 });
  srv.close();
  assert.equal(r.status, 200);
  assert.equal(r.body.total, 27);
});
