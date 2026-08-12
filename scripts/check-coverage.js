#!/usr/bin/env node
/**
 * Enforce >=90% statements / branches / functions / lines for EVERY
 * application TypeScript file under src/ (excluding specs and typings).
 * Files missing from the Istanbul report are treated as 0% and fail.
 *
 * Usage:
 *   node scripts/check-coverage.js [--coverage-file coverage/coverage-final.json] [--threshold 90]
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_COVERAGE = path.join(ROOT, 'coverage', 'coverage-final.json');
const DEFAULT_SUMMARY = path.join(ROOT, 'coverage', 'coverage-summary.json');
const SOURCE_ROOT = path.join(ROOT, 'src');
const THRESHOLD_DEFAULT = 90;

const SKIP_NAME_RE = /\.spec\.ts$/;
const SKIP_BASENAMES = new Set(['typings.d.ts', 'test.ts']);

function parseArgs(argv) {
  const args = {
    coverageFile: DEFAULT_COVERAGE,
    threshold: THRESHOLD_DEFAULT,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--coverage-file') args.coverageFile = path.resolve(argv[++i]);
    else if (a === '--threshold') args.threshold = Number(argv[++i]);
    else if (a === '--help' || a === '-h') {
      console.log(
        'Usage: node scripts/check-coverage.js [--coverage-file path] [--threshold 90]'
      );
      process.exit(0);
    }
  }
  if (Number.isNaN(args.threshold)) {
    console.error('Invalid --threshold value');
    process.exit(2);
  }
  return args;
}

function walkTsFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      walkTsFiles(full, out);
      continue;
    }
    if (!entry.name.endsWith('.ts')) continue;
    if (SKIP_NAME_RE.test(entry.name)) continue;
    if (SKIP_BASENAMES.has(entry.name)) continue;
    if (entry.name.endsWith('.d.ts')) continue;
    out.push(full);
  }
  return out;
}

function normalize(p) {
  return path.normalize(p).replace(/\\/g, '/');
}

function toPosixRelative(abs) {
  return normalize(path.relative(ROOT, abs));
}

function pct(covered, total) {
  if (!total) return 100;
  return (covered * 100) / total;
}

function metricFromSummary(s, coveredKey, totalKey) {
  const covered = Number(s?.[coveredKey] ?? 0);
  const total = Number(s?.[totalKey] ?? 0);
  return { covered, total, percent: pct(covered, total) };
}

function findCoverageEntry(files, absPath) {
  const rel = toPosixRelative(absPath);
  const candidates = new Set([
    normalize(absPath),
    rel,
    `./${rel}`,
    normalize(path.resolve(absPath)),
  ]);

  for (const [key, entry] of Object.entries(files)) {
    const n = normalize(key);
    if (candidates.has(n)) return entry;
    if (n.endsWith('/' + rel) || n.endsWith(rel)) return entry;
  }
  return null;
}

function emptyMetrics() {
  return {
    statements: { covered: 0, total: 0, percent: 0 },
    branches: { covered: 0, total: 0, percent: 0 },
    functions: { covered: 0, total: 0, percent: 0 },
    lines: { covered: 0, total: 0, percent: 0 },
  };
}

function metricsFromIstanbulFile(entry) {
  if (!entry) return emptyMetrics();
  const s = entry.s || {};
  const b = entry.b || {};
  const f = entry.f || {};
  const statementHits = Object.values(s);
  const functionHits = Object.values(f);
  const branchHits = Object.values(b).flat();

  const statements = {
    covered: statementHits.filter((n) => n > 0).length,
    total: statementHits.length,
  };
  statements.percent = pct(statements.covered, statements.total);

  const functions = {
    covered: functionHits.filter((n) => n > 0).length,
    total: functionHits.length,
  };
  functions.percent = pct(functions.covered, functions.total);

  const branches = {
    covered: branchHits.filter((n) => n > 0).length,
    total: branchHits.length,
  };
  branches.percent = pct(branches.covered, branches.total);

  const lineMap = entry.statementMap || {};
  const lineHits = new Map();
  for (const [id, loc] of Object.entries(lineMap)) {
    const line = loc.start.line;
    const hit = s[id] || 0;
    lineHits.set(line, (lineHits.get(line) || 0) + hit);
  }
  const lines = {
    covered: [...lineHits.values()].filter((n) => n > 0).length,
    total: lineHits.size,
  };
  lines.percent = pct(lines.covered, lines.total);

  return { statements, branches, functions, lines };
}

function metricsFromSummaryFile(summaryEntry) {
  if (!summaryEntry) return emptyMetrics();
  return {
    statements: metricFromSummary(summaryEntry.statements, 'covered', 'total'),
    branches: metricFromSummary(summaryEntry.branches, 'covered', 'total'),
    functions: metricFromSummary(summaryEntry.functions, 'covered', 'total'),
    lines: metricFromSummary(summaryEntry.lines, 'covered', 'total'),
  };
}

function formatMetric(m) {
  return `${m.percent.toFixed(2)}% (${m.covered}/${m.total})`;
}

function main() {
  const args = parseArgs(process.argv);

  if (!fs.existsSync(args.coverageFile)) {
    console.error(`Coverage report not found: ${args.coverageFile}`);
    console.error('Run: npm run test:coverage');
    process.exit(2);
  }

  const raw = JSON.parse(fs.readFileSync(args.coverageFile, 'utf8'));

  let summary = null;
  if (fs.existsSync(DEFAULT_SUMMARY)) {
    summary = JSON.parse(fs.readFileSync(DEFAULT_SUMMARY, 'utf8'));
  }

  const sourceFiles = walkTsFiles(SOURCE_ROOT).sort((a, b) =>
    toPosixRelative(a).localeCompare(toPosixRelative(b))
  );

  const rows = [];
  const failures = [];
  const totals = {
    statements: { covered: 0, total: 0 },
    branches: { covered: 0, total: 0 },
    functions: { covered: 0, total: 0 },
    lines: { covered: 0, total: 0 },
  };

  for (const abs of sourceFiles) {
    const rel = toPosixRelative(abs);
    const entry = findCoverageEntry(raw, abs);
    let metrics = metricsFromIstanbulFile(entry);

    // Prefer summary counters when available (more stable across reporters)
    if (summary) {
      const summaryEntry =
        summary[rel] ||
        summary['./' + rel] ||
        summary[path.resolve(abs)] ||
        Object.entries(summary).find(([k]) => normalize(k).endsWith(rel))?.[1];
      if (summaryEntry && summaryEntry !== summary.total) {
        metrics = metricsFromSummaryFile(summaryEntry);
      }
    }

    if (!entry && !(summary && (summary[rel] || summary['./' + rel]))) {
      metrics = emptyMetrics();
      // Treat missing instrumentation as failing with unknown totals
      metrics.statements = { covered: 0, total: 1, percent: 0 };
      metrics.branches = { covered: 0, total: 1, percent: 0 };
      metrics.functions = { covered: 0, total: 1, percent: 0 };
      metrics.lines = { covered: 0, total: 1, percent: 0 };
    }

    rows.push({ rel, metrics, missing: !entry });

    for (const key of ['statements', 'branches', 'functions', 'lines']) {
      totals[key].covered += metrics[key].covered;
      totals[key].total += metrics[key].total;
      if (metrics[key].percent < args.threshold) {
        failures.push({
          file: rel,
          metric: key,
          percent: metrics[key].percent,
        });
      }
    }
  }

  console.log('');
  console.log(
    `Per-file coverage (threshold: ${args.threshold.toFixed(2)}%, files: ${rows.length})`
  );
  console.log(
    'file | statements | branches | functions | lines | status'
  );
  console.log('--- | ---: | ---: | ---: | ---: | ---');

  for (const row of rows) {
    const { metrics: m } = row;
    const ok =
      m.statements.percent >= args.threshold &&
      m.branches.percent >= args.threshold &&
      m.functions.percent >= args.threshold &&
      m.lines.percent >= args.threshold;
    console.log(
      `${row.rel} | ${formatMetric(m.statements)} | ${formatMetric(
        m.branches
      )} | ${formatMetric(m.functions)} | ${formatMetric(m.lines)} | ${
        ok ? 'PASS' : 'FAIL'
      }${row.missing ? ' (missing from report)' : ''}`
    );
  }

  const overall = {
    statements: {
      ...totals.statements,
      percent: pct(totals.statements.covered, totals.statements.total),
    },
    branches: {
      ...totals.branches,
      percent: pct(totals.branches.covered, totals.branches.total),
    },
    functions: {
      ...totals.functions,
      percent: pct(totals.functions.covered, totals.functions.total),
    },
    lines: {
      ...totals.lines,
      percent: pct(totals.lines.covered, totals.lines.total),
    },
  };

  console.log('');
  console.log('Overall coverage');
  console.log(
    `statements: ${formatMetric(overall.statements)} | branches: ${formatMetric(
      overall.branches
    )} | functions: ${formatMetric(
      overall.functions
    )} | lines: ${formatMetric(overall.lines)}`
  );

  const summaryOut = {
    threshold: args.threshold,
    fileCount: rows.length,
    overall,
    failures,
    generatedAt: new Date().toISOString(),
  };
  const outPath = path.join(ROOT, 'coverage', 'coverage-check-summary.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(summaryOut, null, 2));

  if (failures.length) {
    console.log('');
    console.log('Coverage contract failed:');
    for (const f of failures) {
      console.log(
        `- ${f.file}: ${f.metric}=${f.percent.toFixed(2)}% (< ${args.threshold}%)`
      );
    }
    process.exit(1);
  }

  console.log('');
  console.log(
    `Coverage contract passed for every src/**/*.ts file (>= ${args.threshold}% statements/branches/functions/lines).`
  );
  process.exit(0);
}

main();
