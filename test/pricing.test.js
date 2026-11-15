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

test('applyCoupon accepts a coupon that has not expired yet', () => {
  const coupon = { code: 'FUTURE', percent: 10, expiresAt: '2999-01-01T00:00:00.000Z' };
  assert.equal(applyCoupon(50, coupon), 45);
});

test('applyCoupon rejects an expired coupon', () => {
  const coupon = { code: 'OLD', percent: 10, expiresAt: '2000-01-01T00:00:00.000Z' };
  assert.throws(() => applyCoupon(50, coupon), /coupon expired: OLD/);
});

test('applyCoupon rejects a non-ISO expiresAt', () => {
  const coupon = { code: 'BADDATE', percent: 10, expiresAt: 'not-a-date' };
  assert.throws(() => applyCoupon(50, coupon), RangeError);
});

test('applyCoupon checks expiry against a supplied clock', () => {
  const coupon = { code: 'SOON', percent: 10, expiresAt: '2024-06-01T00:00:00.000Z' };
  const before = new Date('2024-05-31T00:00:00.000Z');
  const after = new Date('2024-06-02T00:00:00.000Z');
  assert.equal(applyCoupon(50, coupon, before), 45);
  assert.throws(() => applyCoupon(50, coupon, after), /coupon expired: SOON/);
});
