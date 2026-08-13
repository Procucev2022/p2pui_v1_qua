const fs = require('fs');
const path = require('path');

const cov = JSON.parse(fs.readFileSync('coverage/coverage-final.json', 'utf8'));
const files = JSON.parse(fs.readFileSync('.coverage-work/fail-big.json', 'utf8'));
const summary = JSON.parse(fs.readFileSync('coverage/coverage-check-summary.json', 'utf8'));

console.log('summary keys', Object.keys(summary));

function findKey(rel) {
  const norm = rel.split('\\').join('/');
  const keys = Object.keys(cov);
  let k = keys.find((x) => x.split('\\').join('/').endsWith(norm));
  if (k) return k;
  const tail = norm.split('/').slice(-2).join('/');
  return keys.find((x) => x.split('\\').join('/').includes(tail));
}

function pct(hit, tot) {
  return tot ? ((hit / tot) * 100).toFixed(1) : 'n/a';
}

const report = [];

for (const f of files) {
  const key = findKey(f);
  const entry = key && cov[key];
  if (!entry) {
    report.push({ file: f, missing: true });
    continue;
  }
  const s = entry.s || {};
  const b = entry.b || {};
  const fmap = entry.f || {};
  const stmtTot = Object.keys(s).length;
  const stmtHit = Object.values(s).filter((x) => x > 0).length;
  const fnTot = Object.keys(fmap).length;
  const fnHit = Object.values(fmap).filter((x) => x > 0).length;
  let brParts = 0;
  let brHit = 0;
  for (const v of Object.values(b)) {
    for (const x of v) {
      brParts++;
      if (x > 0) brHit++;
    }
  }
  const uncovered = [];
  for (const [id, count] of Object.entries(s)) {
    if (count === 0) {
      const m = entry.statementMap[id];
      if (m) uncovered.push(m.start.line);
    }
  }
  const uniq = [...new Set(uncovered)].sort((a, b) => a - b);

  // uncovered functions
  const uncovFns = [];
  for (const [id, count] of Object.entries(fmap)) {
    if (count === 0) {
      const m = entry.fnMap[id];
      if (m) uncovFns.push({ name: m.name, line: m.decl.start.line });
    }
  }

  report.push({
    file: f,
    stmts: pct(stmtHit, stmtTot),
    fns: pct(fnHit, fnTot),
    branches: pct(brHit, brParts),
    uncoveredLines: uniq,
    uncoveredFns: uncovFns.slice(0, 40),
    loc: uniq.length ? Math.max(...uniq) : 0,
  });
}

fs.writeFileSync('.coverage-work/fail-big-analysis.json', JSON.stringify(report, null, 2));
report.forEach((r) => {
  console.log(
    `\n${r.file}\n  stmts=${r.stmts}% fns=${r.fns}% br=${r.branches}% uncovLines=${(r.uncoveredLines || []).length}`
  );
  if (r.uncoveredFns) {
    console.log(
      '  uncovFns:',
      r.uncoveredFns.map((x) => `${x.name}@${x.line}`).join(', ')
    );
  }
  if (r.uncoveredLines) {
    console.log('  lines:', r.uncoveredLines.slice(0, 60).join(','));
  }
});
