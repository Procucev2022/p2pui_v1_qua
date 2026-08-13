const fs = require('fs');
const mid = new Set(JSON.parse(fs.readFileSync('.coverage-work/fail-mid.json', 'utf8')));
const summary = JSON.parse(fs.readFileSync('coverage/coverage-check-summary.json', 'utf8'));
const cov = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf8'));
const byFile = {};
for (const f of summary.failures) {
  if (!mid.has(f.file)) continue;
  if (!byFile[f.file]) byFile[f.file] = { file: f.file };
  byFile[f.file][f.metric] = f.percent;
}
for (const [k, v] of Object.entries(cov)) {
  if (k === 'total') continue;
  const norm = k.replace(/\\/g, '/').replace(/^.*?src\//, 'src/');
  if (!mid.has(norm)) continue;
  byFile[norm] = byFile[norm] || { file: norm };
  byFile[norm].statements = v.statements.pct;
  byFile[norm].branches = v.branches.pct;
  byFile[norm].functions = v.functions.pct;
  byFile[norm].lines = v.lines.pct;
  byFile[norm].s = `${v.statements.covered}/${v.statements.total}`;
  byFile[norm].b = `${v.branches.covered}/${v.branches.total}`;
  byFile[norm].f = `${v.functions.covered}/${v.functions.total}`;
  byFile[norm].l = `${v.lines.covered}/${v.lines.total}`;
}
const arr = Object.values(byFile).sort((a, b) => (b.statements || 0) - (a.statements || 0));
const high = arr.filter((a) => (a.statements || 0) >= 70);
const low = arr.filter((a) => (a.statements || 0) < 70);
console.log('HIGH (>=70% stmts):', high.length);
for (const a of high) {
  console.log(
    `${(a.statements || 0).toFixed(1).padStart(6)} ${(a.branches || 0).toFixed(1).padStart(6)} ${(a.functions || 0).toFixed(1).padStart(6)} ${(a.lines || 0).toFixed(1).padStart(6)}  ${a.file}`
  );
}
console.log('\nLOW (<70% stmts):', low.length);
for (const a of low) {
  console.log(
    `${(a.statements || 0).toFixed(1).padStart(6)} ${(a.branches || 0).toFixed(1).padStart(6)} ${(a.functions || 0).toFixed(1).padStart(6)} ${(a.lines || 0).toFixed(1).padStart(6)}  ${a.file}`
  );
}
fs.writeFileSync('.coverage-work/mid-ranked.json', JSON.stringify({ high, low }, null, 2));
