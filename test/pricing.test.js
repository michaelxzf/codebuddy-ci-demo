import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyCoupon, round2 } from '../src/pricing.js';

test('round2 rounds to cents', () => {
  assert.equal(round2(1.005 + 1.115), 2.12);
});

test('applyCoupon applies percentage', () => {
  assert.equal(applyCoupon(50, { code: 'HALF', percent: 50 }), 25);
});

test('applyCoupon rejects invalid percent', () => {
  assert.throws(() => applyCoupon(50, { code: 'BAD', percent: 120 }), RangeError);
});
