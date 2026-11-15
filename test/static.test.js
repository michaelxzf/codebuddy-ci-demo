import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { handler } from '../src/server.js';

test('GET /static/hello.txt serves the file', async () => {
  const body = await new Promise((resolve) => {
    const srv = http.createServer(handler).listen(0, () => {
      http.get({ port: srv.address().port, path: '/static/hello.txt' }, (res) => {
        let b = ''; res.on('data', (d) => (b += d)); res.on('end', () => { srv.close(); resolve(b); });
      });
    });
  });
  assert.match(body, /hello from tinyshop/);
});
