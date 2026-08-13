const fs = require('fs');
const path = require('path');
const mid = JSON.parse(fs.readFileSync('.coverage-work/mid-ranked.json', 'utf8'));
const final = JSON.parse(fs.readFileSync('coverage/coverage-final.json', 'utf8'));

function findEntry(rel) {
  const needle = rel.replace(/\\/g, '/');
  for (const [k, v] of Object.entries(final)) {
    const nk = k.replace(/\\/g, '/');
    if (nk.endsWith(needle) || nk.includes('/' + needle)) return v;
  }
  return null;
}

function analyze(rel) {
  const e = findEntry(rel);
  if (!e) return { rel, error: 'not found' };
  const uncoveredFns = [];
  for (const [id, meta] of Object.entries(e.fnMap || {})) {
    if ((e.f[id] || 0) === 0) {
      uncoveredFns.push({ name: meta.name, line: meta.decl?.start?.line });
    }
  }
  const uncoveredBranches = [];
  for (const [id, meta] of Object.entries(e.branchMap || {})) {
    const hits = e.b[id] || [];
    hits.forEach((h, i) => {
      if (h === 0) {
        uncoveredBranches.push({
          line: meta.loc?.start?.line,
          type: meta.type,
          index: i,
        });
      }
    });
  }
  const uncoveredLines = [];
  for (const [line, hits] of Object.entries(e.s || {})) {
    if (hits === 0) {
      const meta = e.statementMap[line];
      if (meta) uncoveredLines.push(meta.start.line);
    }
  }
  return {
    rel,
    uncoveredFns: uncoveredFns.slice(0, 40),
    uncoveredBranches: uncoveredBranches.slice(0, 40),
    uncoveredLines: [...new Set(uncoveredLines)].slice(0, 50),
  };
}

const targets = mid.high.slice(0, 12);
const out = targets.map((t) => analyze(t.file));
fs.writeFileSync('.coverage-work/uncovered-high.json', JSON.stringify(out, null, 2));
for (const o of out) {
  console.log('\n===', o.rel);
  console.log(
    'fns:',
    (o.uncoveredFns || []).map((f) => `${f.name}@${f.line}`).join(', ')
  );
  console.log('lines:', (o.uncoveredLines || []).join(','));
  console.log(
    'branches@',
    (o.uncoveredBranches || []).map((b) => b.line).join(',')
  );
}
