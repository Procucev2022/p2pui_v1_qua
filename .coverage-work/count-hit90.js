const cov = require('../coverage/coverage-final.json');
const targets = [
  'vendor-registration-pending',
  'vendor-rejected',
  'pro-cpx-vendor-summary-clients',
  'edit-client-linking-to-item-modal',
  'edit-vendor-linking-to-item-modal',
  'view-asn-modal',
  'view-pr-id-details',
  'view-rfq-by-id-modal',
  'cat-mgr-rfqs-line-items-sub-tab',
  'cat-mgr-vendor-rfqs.component',
  'item-catalogue.component',
  'category-mgr-vendor-summary.component',
  'client-procure-request.component',
  'client-procure-request-opex',
  'client-procure-request-capex',
  'create-rfq-shared.component',
  'pos/pos.component',
  'bfs-items-list.component',
  'vendor-reg.component',
];

function metrics(e) {
  const st = Object.values(e.s || {});
  const fn = Object.values(e.f || {});
  let bt = 0,
    bh = 0;
  for (const a of Object.values(e.b || {})) {
    bt += a.length;
    bh += a.filter((x) => x > 0).length;
  }
  const S = st.length ? (100 * st.filter((x) => x > 0).length) / st.length : 100;
  const B = bt ? (100 * bh) / bt : 100;
  const F = fn.length ? (100 * fn.filter((x) => x > 0).length) / fn.length : 100;
  const lines = new Set();
  const covL = new Set();
  for (const [id, sm] of Object.entries(e.statementMap || {})) {
    lines.add(sm.start.line);
    if (e.s[id] > 0) covL.add(sm.start.line);
  }
  const L = lines.size ? (100 * covL.size) / lines.size : 100;
  return {
    S: +S.toFixed(1),
    B: +B.toFixed(1),
    F: +F.toFixed(1),
    L: +L.toFixed(1),
  };
}

let hit = 0;
const cleared = [];
const below = [];
for (const t of targets) {
  const k = Object.keys(cov).find((x) => x.replace(/\\/g, '/').includes(t));
  if (!k) {
    below.push({ t, missing: true });
    continue;
  }
  const r = metrics(cov[k]);
  const ok = r.S >= 90 && r.B >= 90 && r.F >= 90 && r.L >= 90;
  if (ok) {
    hit++;
    cleared.push({ t, ...r });
  } else {
    below.push({ t, ...r });
  }
  console.log(ok ? 'PASS' : 'FAIL', t, JSON.stringify(r));
}
console.log('HIT90', hit);
console.log('CLEARED', cleared.map((c) => c.t).join(', '));
