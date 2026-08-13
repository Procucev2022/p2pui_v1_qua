const fs = require('fs');
const path = require('path');
const files = JSON.parse(fs.readFileSync('.coverage-work/fail-small.json', 'utf8'));
let cov = {};
try {
  cov = JSON.parse(fs.readFileSync('coverage/coverage-final.json', 'utf8'));
} catch (e) {}

function findCov(rel) {
  const norm = rel.replace(/\\/g, '/');
  for (const k of Object.keys(cov)) {
    const kk = k.replace(/\\/g, '/');
    if (kk.endsWith(norm) || kk.includes('/' + norm)) return cov[k];
  }
  return null;
}

function pctS(c) {
  if (!c || !c.s) return null;
  const vals = Object.values(c.s);
  if (!vals.length) return 100;
  return Math.round((vals.filter((v) => v > 0).length / vals.length) * 10000) / 100;
}
function pctB(c) {
  if (!c || !c.b) return null;
  let t = 0,
    hit = 0;
  for (const arr of Object.values(c.b)) {
    t += arr.length;
    hit += arr.filter((v) => v > 0).length;
  }
  return t ? Math.round((hit / t) * 10000) / 100 : 100;
}
function pctF(c) {
  if (!c || !c.f) return null;
  const vals = Object.values(c.f);
  if (!vals.length) return 100;
  return Math.round((vals.filter((v) => v > 0).length / vals.length) * 10000) / 100;
}
function pctL(c) {
  if (!c || !c.statementMap || !c.s) return null;
  const lines = new Set();
  const covLines = new Set();
  for (const [id, st] of Object.entries(c.statementMap)) {
    const ln = st.start.line;
    lines.add(ln);
    if (c.s[id] > 0) covLines.add(ln);
  }
  return lines.size ? Math.round((covLines.size / lines.size) * 10000) / 100 : 100;
}

const rows = [];
for (const rel of files) {
  const src = fs.readFileSync(rel, 'utf8');
  const loc = src.split(/\r?\n/).length;
  const c = findCov(rel);
  const s = pctS(c);
  const b = pctB(c);
  const f = pctF(c);
  const l = pctL(c);
  const hasSpec = fs.existsSync(rel.replace(/\.ts$/, '.spec.ts'));
  const hasHarness = hasSpec && fs.readFileSync(rel.replace(/\.ts$/, '.spec.ts'), 'utf8').includes('branch-path coverage harness');
  rows.push({
    rel,
    loc,
    s,
    b,
    f,
    l,
    hasSpec,
    hasHarness,
    highStmtLowBranch: s != null && s >= 85 && b != null && b < 90,
    priority: loc <= 80 ? 0 : 1,
  });
}
rows.sort((a, b) => a.priority - b.priority || a.loc - b.loc || (b.s || 0) - (a.s || 0) || (a.b || 0) - (b.b || 0));
console.log('PRIORITY (loc<=80 or highStmtLowBranch):');
for (const r of rows.filter((r) => r.loc <= 80 || r.highStmtLowBranch).slice(0, 35)) {
  console.log(
    `${String(r.loc).padStart(3)} | S${r.s} B${r.b} F${r.f} L${r.l} | harness=${r.hasHarness} | ${r.rel}`
  );
}
console.log('---');
console.log('total', rows.length, 'under80', rows.filter((r) => r.loc <= 80).length);
fs.writeFileSync('.coverage-work/fail-small-ranked.json', JSON.stringify(rows, null, 2));
