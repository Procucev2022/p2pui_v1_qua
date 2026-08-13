const fs = require('fs');
const fails = JSON.parse(fs.readFileSync('.coverage-work/fail-small.json', 'utf8'));
const cov = JSON.parse(fs.readFileSync('coverage/coverage-final.json', 'utf8'));
const keys = Object.keys(cov);
function norm(p) {
  return p.replace(/\\/g, '/').toLowerCase();
}
const nkeys = keys.map((k) => ({ k, n: norm(k) }));
function metrics(f) {
  const nf = norm(f);
  const hit = nkeys.find((x) => x.n.endsWith(nf) || x.n.endsWith(nf.replace(/^src\//, '')));
  if (!hit) return { missing: true };
  const e = cov[hit.k];
  const s = e.s || {};
  const b = e.b || {};
  const f2 = e.f || {};
  const st = Object.values(s);
  const stHit = st.filter((x) => x > 0).length;
  const fn = Object.values(f2);
  const fnHit = fn.filter((x) => x > 0).length;
  let bTot = 0,
    bHit = 0;
  for (const arr of Object.values(b)) {
    for (const x of arr) {
      bTot++;
      if (x > 0) bHit++;
    }
  }
  const sm = e.statementMap || {};
  const lineHit = new Set();
  const lineTot = new Set();
  for (const id of Object.keys(sm)) {
    const line = sm[id].start.line;
    lineTot.add(line);
    if (s[id] > 0) lineHit.add(line);
  }
  // uncovered branch locs
  const uncovered = [];
  for (const [id, arr] of Object.entries(b)) {
    arr.forEach((v, i) => {
      if (v === 0) {
        const loc = (e.branchMap || {})[id];
        uncovered.push({
          id,
          i,
          line: loc && loc.loc ? loc.loc.start.line : null,
          type: loc && loc.type,
        });
      }
    });
  }
  return {
    statements: st.length ? +(100 * (stHit / st.length)).toFixed(1) : 100,
    branches: bTot ? +(100 * (bHit / bTot)).toFixed(1) : 100,
    functions: fn.length ? +(100 * (fnHit / fn.length)).toFixed(1) : 100,
    lines: lineTot.size ? +(100 * (lineHit.size / lineTot.size)).toFixed(1) : 100,
    uncoveredBranches: uncovered.slice(0, 12),
    key: hit.k,
  };
}
const rows = fails.map((f) => ({
  f,
  m: metrics(f),
  hasSpec: fs.existsSync(f.replace(/\.ts$/, '.spec.ts')),
}));
rows.sort((a, b) => {
  const am = a.m.missing
    ? 0
    : Math.min(a.m.statements, a.m.branches, a.m.functions, a.m.lines);
  const bm = b.m.missing
    ? 0
    : Math.min(b.m.statements, b.m.branches, b.m.functions, b.m.lines);
  return am - bm;
});
for (const r of rows) {
  const min = r.m.missing
    ? 0
    : Math.min(r.m.statements, r.m.branches, r.m.functions, r.m.lines);
  console.log(
    JSON.stringify({
      file: r.f,
      min,
      s: r.m.statements,
      b: r.m.branches,
      f: r.m.functions,
      l: r.m.lines,
      hasSpec: r.hasSpec,
      ub: r.m.uncoveredBranches,
    })
  );
}
