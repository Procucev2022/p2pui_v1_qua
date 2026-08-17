const cov = require('../coverage/coverage-final.json');
const want = [
  'ppo-items.component.ts',
  'ppo-view-modal.component.ts',
  'ppo-quot-compare-view.component.ts',
  'live-auction-for-rfq-wise.component.ts',
  'login.component.ts',
  'registervendor.component.ts',
  'create-rar-auction.component.ts',
  'client-register.component.ts',
  'quot-compare.component.ts',
  'capex-auctions.component.ts',
  'auctions.component.ts',
  'create-item-category.component.ts',
  'quot-compare-view.component.ts',
  'create-pr-modal.component.ts',
  'create-pr-modal-new.component.ts',
  'edit-rfq-by-id-modal.component.ts',
  'create-rai-auction.component.ts',
  'generated-ppos.component.ts',
  'vendor-req-modal.component.ts',
  'vendor-profile.component.ts',
  'pr-view-modal.component.ts',
  'prevendor.component.ts',
  'vendor-approval-modal.component.ts',
  'cat-mgr-rfq-tab.component.ts',
  'vmgr-vendor-search.component.ts',
  'cat-mgr-client-regstr.component.ts',
  'bfs-items-list.component.ts',
  'vendor-reg.component.ts',
  'create-sub-category.component.ts',
  'client-procure-request-capex.component.ts',
  'client-procure-request.component.ts',
  'client-procure-request-opex.component.ts',
  'item-catalogue.component.ts',
  'correspondence.component.ts',
  'vendor-search.component.ts',
  'pr-items-grid-panel.component.ts',
  'category-mgr-vendor-summary.component.ts',
  'cat-mgr-vendor-rfqs.component.ts',
  'pr-items-grid-panel-capex.component.ts',
  'pos.component.ts',
  'create-rfq-shared.component.ts',
  'cat-mgr-create-rfq-list.component.ts',
  'loader.component.ts',
  'sidebar.component.ts',
];

function pct(hit, tot) {
  return tot ? (100 * hit) / tot : 100;
}

const rows = [];
for (const k of Object.keys(cov)) {
  const norm = k.replace(/\\/g, '/');
  const base = norm.split('/').pop();
  if (!want.includes(base)) continue;
  const e = cov[k];
  const st = Object.values(e.s || {});
  const fn = Object.values(e.f || {});
  let bt = 0;
  let bh = 0;
  for (const a of Object.values(e.b || {})) {
    bt += a.length;
    bh += a.filter((x) => x > 0).length;
  }
  const S = pct(st.filter((x) => x > 0).length, st.length);
  const B = bt ? pct(bh, bt) : 100;
  const F = pct(fn.filter((x) => x > 0).length, fn.length);
  const lineHit = new Map();
  for (const [id, n] of Object.entries(e.s || {})) {
    const loc = e.statementMap[id];
    if (!loc) continue;
    const ln = loc.start.line;
    lineHit.set(ln, (lineHit.get(ln) || 0) + n);
  }
  const Ltot = lineHit.size;
  const Lhit = [...lineHit.values()].filter((x) => x > 0).length;
  const L = pct(Lhit, Ltot);
  const ok = S >= 90 && B >= 90 && F >= 90 && L >= 90;
  rows.push({ base, S, B, F, L, ok });
}

rows.sort(
  (a, b) => Math.min(a.S, a.B, a.F, a.L) - Math.min(b.S, b.B, b.F, b.L)
);
let pass = 0;
let fail = 0;
for (const r of rows) {
  const mark = r.ok ? 'PASS' : 'FAIL';
  if (r.ok) pass++;
  else fail++;
  console.log(
    mark +
      '  S' +
      r.S.toFixed(1) +
      ' B' +
      r.B.toFixed(1) +
      ' F' +
      r.F.toFixed(1) +
      ' L' +
      r.L.toFixed(1) +
      '  ' +
      r.base
  );
}
console.log('---');
console.log('pass', pass, 'fail', fail, 'total', rows.length);
