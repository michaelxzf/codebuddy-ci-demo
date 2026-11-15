const stock = new Map([
  ['tee-blue', { sku: 'tee-blue', name: 'Blue Tee', price: 19.99, qty: 25 }],
  ['mug-logo', { sku: 'mug-logo', name: 'Logo Mug', price: 12.5, qty: 40 }],
  ['cap-navy', { sku: 'cap-navy', name: 'Navy Cap', price: 24.0, qty: 0 }],
]);

export function list() {
  return [...stock.values()];
}

export function get(sku) {
  return stock.get(sku) ?? null;
}

export function reserve(sku, qty) {
  const item = stock.get(sku);
  if (!item) throw new Error(`unknown sku: ${sku}`);
  if (item.qty < qty) throw new Error(`insufficient stock for ${sku}`);
  item.qty -= qty;
  return item.qty;
}
