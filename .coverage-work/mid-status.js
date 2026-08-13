const fs = require('fs');
const mid = JSON.parse(fs.readFileSync('.coverage-work/fail-mid.json', 'utf8'));
const cov = require('../coverage/coverage-summary.json');
const high = new Set(
  JSON.parse(fs.readFileSync('.coverage-work/mid-ranked.json', 'utf8')).high.map((h) => h.file)
);
function norm(k) {
  return k.replace(/\\/g, '/').replace(/^.*?src\//, 'src/');
}
const rows = [];
for (const [k, v] of Object.entries(cov)) {
  if (k === 'total') continue;
  const f = norm(k);
  if (!mid.includes(f)) continue;
  const ok =
    v.statements.pct >= 90 &&
    v.branches.pct >= 90 &&
    v.functions.pct >= 90 &&
    v.lines.pct >= 90;
  rows.push({
    f,
    s: v.statements.pct,
    b: v.branches.pct,
    fn: v.functions.pct,
    l: v.lines.pct,
    ok,
    wasHigh: high.has(f),
  });
}
rows.sort((a, b) => Number(b.ok) - Number(a.ok) || b.s - a.s);
console.log('PASS', rows.filter((r) => r.ok).length);
for (const r of rows.filter((r) => r.ok)) {
  console.log(
    'OK',
    r.s.toFixed(1),
    r.b.toFixed(1),
    r.fn.toFixed(1),
    r.l.toFixed(1),
    r.f.replace('src/app/', '')
  );
}
console.log('\nSTILL FAIL (instrumented in this run)');
for (const r of rows.filter((r) => !r.ok)) {
  console.log(
    r.wasHigh ? 'H' : 'L',
    r.s.toFixed(1).padStart(6),
    r.b.toFixed(1).padStart(6),
    r.fn.toFixed(1).padStart(6),
    r.l.toFixed(1).padStart(6),
    r.f.replace('src/app/', '')
  );
}
const missing = mid.filter((f) => !rows.some((r) => r.f === f));
console.log('\nNOT INSTRUMENTED THIS RUN', missing.length);
