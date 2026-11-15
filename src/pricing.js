// Pricing rules for tinyshop.
export const TAX_RATE = 0.08;

/** Round to 2 decimals (currency). */
export function round2(n) {
  return Math.round(n * 100) / 100;
}

/**
 * Apply a percentage coupon to a subtotal.
 * @param {number} subtotal
 * @param {{code: string, percent: number, expiresAt?: string}} coupon
 * @param {Date} [now] - clock to check expiry against (defaults to current time)
 */
export function applyCoupon(subtotal, coupon, now = new Date()) {
  if (!coupon) return subtotal;
  if (coupon.percent <= 0 || coupon.percent > 100) {
    throw new RangeError(`invalid coupon percent: ${coupon.percent}`);
  }
  if (coupon.expiresAt && now > new Date(coupon.expiresAt)) {
    throw new Error(`coupon expired: ${coupon.code} (expired ${coupon.expiresAt})`);
  }
  return subtotal - subtotal * (coupon.percent / 100);
}
