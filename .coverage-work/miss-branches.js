const final = require('../coverage/coverage-final.json');
const targets = [
  'bfs-my-items.component.ts',
  'vendor-bfs-my-item-bids.component.ts',
  'vendor-registration.component.ts',
  'cat-mgr-item-catalogue.component.ts',
  'cat-mgr-gmt-register-clients.component.ts',
  'approvalpending-tab.component.ts',
];
for (const t of targets) {
  const k = Object.keys(final).find((x) => x.replace(/\\/g, '/').endsWith(t));
  if (!k) {
    console.log('missing', t);
    continue;
  }
  const e = final[k];
  const miss = [];
  for (const [id, hits] of Object.entries(e.b || {})) {
    hits.forEach((h, i) => {
      if (h === 0) {
        const m = e.branchMap[id];
        miss.push(`${m.loc.start.line}:${m.type}#${i}`);
      }
    });
  }
  console.log('\n' + t, 'miss branches', miss.join(', '));
  const missL = [];
  for (const [id, h] of Object.entries(e.s || {})) {
    if (h === 0) missL.push(e.statementMap[id].start.line);
  }
  console.log('miss stmts', [...new Set(missL)].join(','));
}
