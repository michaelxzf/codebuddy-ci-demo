import { applyCoupon, round2, TAX_RATE } from './pricing.js';

export class Cart {
  constructor() {
    this.items = new Map(); // sku -> { sku, price, qty }
    this.coupon = null;
  }

  add(sku, price, qty = 1) {
    if (qty <= 0) throw new RangeError('qty must be positive');
    const cur = this.items.get(sku);
    if (cur) cur.qty += qty;
    else this.items.set(sku, { sku, price, qty });
    return this;
  }

  remove(sku) {
    this.items.delete(sku);
    return this;
  }

  useCoupon(coupon) {
    this.coupon = coupon;
    return this;
  }

  subtotal() {
    let s = 0;
    for (const { price, qty } of this.items.values()) s += price * qty;
    return round2(s);
  }

  total() {
    const subtotal = this.subtotal();
    const tax = subtotal * TAX_RATE;
    return round2(applyCoupon(subtotal, this.coupon) + tax);
  }
}
