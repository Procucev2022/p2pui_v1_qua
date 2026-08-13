const cov = require('../coverage/coverage-final.json');
const keys = Object.keys(cov);
console.log('keys', keys.length);
const want = [
  'edit-client-ref',
  'product-edit',
  'loader',
  'page-info',
  'cancel-po',
  'vendor-quality',
  'accept-pr',
  'vendor-registration-pending',
  'linked-client',
  'vendor-contacts',
  'timeout-modal',
];
for (const k of keys) {
  const base = k.replace(/\\/g, '/').split('/').pop();
  if (!want.some((w) => base.includes(w))) continue;
  const e = cov[k];
  const st = Object.values(e.s || {});
  const fn = Object.values(e.f || {});
  let bt = 0,
    bh = 0;
  for (const a of Object.values(e.b || {})) {
    bt += a.length;
    bh += a.filter((x) => x > 0).length;
  }
  const S = ((100 * st.filter((x) => x > 0).length) / Math.max(st.length, 1)).toFixed(1);
  const B = bt ? ((100 * bh) / bt).toFixed(1) : '100';
  const F = ((100 * fn.filter((x) => x > 0).length) / Math.max(fn.length, 1)).toFixed(1);
  console.log(base, 'S' + S, 'B' + B, 'F' + F);
}
