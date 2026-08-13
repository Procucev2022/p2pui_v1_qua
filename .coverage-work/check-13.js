const cov = require('../coverage/coverage-summary.json');
function norm(k) {
  return k.replace(/\\/g, '/').replace(/^.*?src\//, 'src/');
}
const want = [
  'vendor-rfq',
  'post-auction-compare',
  'invoices-list',
  'create-invoice',
  'accept-pos',
  'linked-pr-ppo-create',
  'po-create',
  'auction-bid-details',
  'po-create-asn',
  'ppo-create',
  'add-or-edit-vendor-modal',
  'live-auction-for-itemwise',
  'quot-view-details',
];
function matchName(f) {
  for (const w of want) {
    if (w === 'po-create') {
      if (f.endsWith('/po/po-create/po-create.component.ts')) return w;
      continue;
    }
    if (w === 'ppo-create') {
      if (f.endsWith('/ppo-create/ppo-create.component.ts')) return w;
      continue;
    }
    if (f.endsWith('/' + w + '/' + w + '.component.ts') || f.endsWith(w + '.component.ts')) return w;
  }
  return null;
}
let okN = 0;
const bad = [];
const seen = new Set();
for (const [k, v] of Object.entries(cov)) {
  if (k === 'total') continue;
  const f = norm(k);
  const name = matchName(f);
  if (!name || seen.has(name)) continue;
  seen.add(name);
  const ok =
    v.statements.pct >= 90 &&
    v.branches.pct >= 90 &&
    v.functions.pct >= 90 &&
    v.lines.pct >= 90;
  console.log(
    (ok ? 'OK' : 'NO') +
      ' ' +
      v.statements.pct.toFixed(1) +
      ' ' +
      v.branches.pct.toFixed(1) +
      ' ' +
      v.functions.pct.toFixed(1) +
      ' ' +
      v.lines.pct.toFixed(1) +
      ' ' +
      name
  );
  if (ok) okN++;
  else bad.push(name);
}
console.log('CLEARED', okN + '/' + want.length, 'BAD', bad.join(',') || '-');
