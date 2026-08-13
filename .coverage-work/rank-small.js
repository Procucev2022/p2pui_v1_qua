const path = require('path');
const root = path.join(__dirname, '..');
const s = require(path.join(root, 'coverage/coverage-check-summary.json'));
const fails = require(path.join(root, '.coverage-work/fail-small.json'));
const byFile = {};
for (const f of s.failures) {
  if (!byFile[f.file]) byFile[f.file] = {};
  byFile[f.file][f.metric] = f.percent;
}
const rows = fails.map((f) => {
  const m = byFile[f] || {};
  const vals = ['statements', 'branches', 'functions', 'lines'].map((k) =>
    m[k] == null ? 100 : m[k]
  );
  return {
    file: f,
    statements: m.statements ?? 100,
    branches: m.branches ?? 100,
    functions: m.functions ?? 100,
    lines: m.lines ?? 100,
    min: Math.min(...vals),
  };
});
rows.sort((a, b) => a.min - b.min);
for (const r of rows) {
  console.log(
    `${r.min.toFixed(1).padStart(6)} s=${r.statements.toFixed(1).padStart(6)} b=${r.branches.toFixed(1).padStart(6)} f=${r.functions.toFixed(1).padStart(6)} l=${r.lines.toFixed(1).padStart(6)}  ${r.file}`
  );
}
console.log('---');
console.log('count', rows.length, 'below90', rows.filter((r) => r.min < 90).length);
