import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Cart } from '../src/cart.js';

test('subtotal sums price x qty', () => {
  const c = new Cart().add('tee-blue', 19.99, 2).add('mug-logo', 12.5);
  assert.equal(c.subtotal(), 52.48);
});

test('adding the same sku merges quantity', () => {
  const c = new Cart().add('mug-logo', 12.5).add('mug-logo', 12.5, 2);
  assert.equal(c.items.get('mug-logo').qty, 3);
});

test('total without coupon adds 8% tax', () => {
  const c = new Cart().add('cap-navy', 24.0);
  assert.equal(c.total(), 25.92);
});

test('tax is charged on the discounted amount', () => {
  const c = new Cart().add('tee-blue', 100).useCoupon({ code: 'SAVE20', percent: 20 });
  // 100 - 20% = 80; 80 * 1.08 = 86.40
  assert.equal(c.total(), 86.4);
});

test('total() throws when the coupon has expired', () => {
  const c = new Cart()
    .add('tee-blue', 100)
    .useCoupon({ code: 'OLD20', percent: 20, expiresAt: '2000-01-01T00:00:00.000Z' });
  assert.throws(() => c.total(), /coupon expired: OLD20/);
});
