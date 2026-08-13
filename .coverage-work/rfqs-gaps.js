const cov = require('../coverage/coverage-final.json');
const fs = require('fs');
const k = Object.keys(cov).find((x) =>
  x.replace(/\\/g, '/').endsWith('cat-mgr-vendor-rfqs.component.ts')
);
const e = cov[k];
const src = fs.readFileSync(
  'src/app/layout/category-mgr/cat-mgr-vendor-rfqs/cat-mgr-vendor-rfqs.component.ts',
  'utf8'
).split(/\r?\n/);
const missL = [];
for (const [id, h] of Object.entries(e.s || {})) {
  if (h === 0) missL.push(e.statementMap[id].start.line);
}
const uniq = [...new Set(missL)].sort((a, b) => a - b);
console.log('miss lines', uniq.join(','));
for (const ln of uniq.slice(0, 40)) {
  console.log(String(ln).padStart(4), src[ln - 1] && src[ln - 1].trim().slice(0, 120));
}
const missBr = [];
for (const [id, hits] of Object.entries(e.b || {})) {
  hits.forEach((h, i) => {
    if (h === 0) {
      const m = e.branchMap[id];
      missBr.push(m.loc.start.line + ':' + m.type + '#' + i);
    }
  });
}
console.log('miss branches', missBr.slice(0, 30).join(', '));
