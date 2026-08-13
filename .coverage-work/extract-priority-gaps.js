const fs = require('fs');
const path = require('path');
const cov = require('../coverage/coverage-final.json');
const keys = Object.keys(cov);

const targets = [
  'cat-mgr-vendor-rfqs.component.ts',
  'item-catalogue.component.ts',
  'category-mgr-vendor-summary.component.ts',
  'client-procure-request.component.ts',
  'client-procure-request-opex.component.ts',
  'client-procure-request-capex.component.ts',
  'create-rfq-shared.component.ts',
  'vendor-registration-pending.component.ts',
  'vendor-rejected.component.ts',
  'pro-cpx-vendor-summary-clients.component.ts',
  'edit-client-linking-to-item-modal.component.ts',
  'edit-vendor-linking-to-item-modal.component.ts',
  'view-asn-modal.component.ts',
  'view-pr-id-details.component.ts',
  'view-rfq-by-id-modal.component.ts',
  'cat-mgr-rfqs-line-items-sub-tab.component.ts',
  'bfs-items-list.component.ts',
  'pos.component.ts',
  'vendor-reg.component.ts',
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
  const S = st.length ? +((100 * st.filter((x) => x > 0).length) / st.length).toFixed(1) : 100;
  const B = bt ? +((100 * bh) / bt).toFixed(1) : 100;
  const F = fn.length ? +((100 * fn.filter((x) => x > 0).length) / fn.length).toFixed(1) : 100;
  const missStmt = [];
  for (const [id, h] of Object.entries(e.s || {})) {
    if (h === 0) missStmt.push(e.statementMap[id].start.line);
  }
  const missBr = [];
  for (const [id, hits] of Object.entries(e.b || {})) {
    hits.forEach((h, i) => {
      if (h === 0) {
        const m = e.branchMap[id];
        missBr.push(`${m.loc.start.line}:${m.type}#${i}`);
      }
    });
  }
  return {
    S,
    B,
    F,
    missStmt: [...new Set(missStmt)].slice(0, 25),
    missBr: missBr.slice(0, 20),
  };
}

const out = {};
for (const t of targets) {
  const k = keys.find((x) => x.replace(/\\/g, '/').endsWith(t));
  if (!k) {
    out[t] = { missing: true };
    continue;
  }
  out[t] = metrics(cov[k]);
}
fs.writeFileSync(path.join(__dirname, 'priority-gaps.json'), JSON.stringify(out, null, 2));
for (const [t, m] of Object.entries(out)) {
  if (m.missing) console.log(t, 'NO_COV');
  else console.log(t, `S${m.S} B${m.B} F${m.F}`, 'missL', m.missStmt.join(','), 'missBr', m.missBr.join(','));
}
