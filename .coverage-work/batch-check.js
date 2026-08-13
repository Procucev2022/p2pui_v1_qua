/**
 * Run focused coverage on mid+big fail lists in batches; report pass/fail.
 * Usage: node .coverage-work/batch-check.js mid|big|both [batchSize]
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const mode = process.argv[2] || 'mid';
const batchSize = +(process.argv[3] || 8);
const root = path.resolve(__dirname, '..');

function loadList(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, name), 'utf8'));
}

let files = [];
if (mode === 'mid' || mode === 'both') files = files.concat(loadList('fail-mid.json'));
if (mode === 'big' || mode === 'both') files = files.concat(loadList('fail-big.json'));

// Prefer highest prior statement% first when ranked data exists
let rank = {};
try {
  const midR = loadList('mid-ranked.json');
  [...(midR.high || []), ...(midR.low || [])].forEach((h) => {
    rank[h.file] = h.statements || 0;
  });
} catch (_) {}
try {
  const bigU = loadList('fail-big-uncovered.json');
  bigU.forEach((h) => {
    if (h.file) rank[h.file] = h.statements || 0;
  });
} catch (_) {}

files = [...new Set(files)].sort((a, b) => (rank[b] || 0) - (rank[a] || 0));

function norm(k) {
  return k.replace(/\\/g, '/').replace(/^.*?src\//, 'src/');
}

const results = { ok: [], fail: [], missing: [], errors: [] };

for (let i = 0; i < files.length; i += batchSize) {
  const batch = files.slice(i, i + batchSize);
  const includes = [];
  for (const f of batch) {
    const spec = f.replace(/\.ts$/, '.spec.ts');
    if (!fs.existsSync(path.join(root, spec))) {
      results.missing.push(f);
      continue;
    }
    includes.push(`--include=${spec}`);
  }
  if (!includes.length) continue;

  console.log(`\n=== BATCH ${i / batchSize + 1} (${includes.length} specs) ===`);
  const cmd = [
    'node',
    'scripts/with-chrome.js',
    'npx',
    'cross-env',
    'CI=true',
    'TEST_CI=true',
    'ng',
    'test',
    '--watch=false',
    '--browsers=ChromeHeadlessNoSandbox',
    '--code-coverage',
    ...includes,
  ];
  const r = spawnSync(cmd[0], cmd.slice(1), {
    cwd: root,
    encoding: 'utf8',
    shell: true,
    timeout: 420000,
  });
  if (r.status !== 0 && /Error: src\//.test(r.stdout + r.stderr)) {
    const err = (r.stdout + r.stderr).match(/Error: src\/[^\n]+/g);
    results.errors.push({ batch, err });
    console.log('COMPILE ERROR', err && err.slice(0, 3));
    continue;
  }

  let cov;
  try {
    cov = JSON.parse(fs.readFileSync(path.join(root, 'coverage/coverage-summary.json'), 'utf8'));
  } catch (e) {
    results.errors.push({ batch, err: ['no summary'] });
    continue;
  }

  const byFile = {};
  for (const [k, v] of Object.entries(cov)) {
    if (k === 'total') continue;
    byFile[norm(k)] = v;
  }

  for (const f of batch) {
    const v = byFile[f];
    if (!v) {
      results.missing.push(f);
      console.log('MISS', f);
      continue;
    }
    const ok =
      v.statements.pct >= 90 &&
      v.branches.pct >= 90 &&
      v.functions.pct >= 90 &&
      v.lines.pct >= 90;
    const row = {
      f,
      s: +v.statements.pct.toFixed(1),
      b: +v.branches.pct.toFixed(1),
      fn: +v.functions.pct.toFixed(1),
      l: +v.lines.pct.toFixed(1),
    };
    if (ok) {
      results.ok.push(row);
      console.log('OK ', row.s, row.b, row.fn, row.l, f.replace('src/app/', ''));
    } else {
      results.fail.push(row);
      console.log('FAIL', row.s, row.b, row.fn, row.l, f.replace('src/app/', ''));
    }
  }
}

fs.writeFileSync(path.join(__dirname, `status-${mode}.json`), JSON.stringify(results, null, 2));
console.log('\n==== SUMMARY ====');
console.log('OK', results.ok.length, 'FAIL', results.fail.length, 'MISSING', results.missing.length, 'ERR_BATCHES', results.errors.length);
results.fail
  .sort((a, b) => b.s - a.s)
  .forEach((r) => console.log('STILL', r.s, r.b, r.fn, r.l, r.f.replace('src/app/', '')));
