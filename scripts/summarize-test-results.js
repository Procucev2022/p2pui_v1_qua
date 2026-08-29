#!/usr/bin/env node
/**
 * Build a markdown summary of unit-test results + coverage for PR comments.
 *
 * Reads:
 *   - coverage/junit/test-results.xml (optional)
 *   - coverage/coverage-summary.json (optional)
 *   - coverage/coverage-check-summary.json (optional)
 *
 * Writes:
 *   - coverage/pr-comment.md
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const JUNIT = path.join(ROOT, 'coverage', 'junit', 'test-results.xml');
const SUMMARY = path.join(ROOT, 'coverage', 'coverage-summary.json');
const CHECK = path.join(ROOT, 'coverage', 'coverage-check-summary.json');
const OUT = path.join(ROOT, 'coverage', 'pr-comment.md');

function readJson(p) {
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function parseJunit(xml) {
  const suiteMatch = xml.match(/<testsuite\b([^>]*)>/);
  const attrs = {};
  if (suiteMatch) {
    for (const m of suiteMatch[1].matchAll(/(\w+)="([^"]*)"/g)) {
      attrs[m[1]] = m[2];
    }
  }
  let tests = 0;
  let failures = 0;
  let errors = 0;
  let skipped = 0;
  let time = 0;
  const failedTestList = [];

  for (const m of xml.matchAll(/<testsuite\b([^>]*)>/g)) {
    const a = {};
    for (const am of m[1].matchAll(/(\w+)="([^"]*)"/g)) a[am[1]] = am[2];
    tests += Number(a.tests || 0);
    failures += Number(a.failures || 0);
    errors += Number(a.errors || 0);
    skipped += Number(a.skipped || 0);
    time += Number(a.time || 0);
  }

  const testcaseRegex = /<testcase\b([^>]*)>([\s\S]*?)<\/testcase>/g;
  for (const match of xml.matchAll(testcaseRegex)) {
    const testcaseAttrs = {};
    for (const am of match[1].matchAll(/(\w+)="([^"]*)"/g)) testcaseAttrs[am[1]] = am[2];
    const classname = testcaseAttrs.classname || '';
    const name = testcaseAttrs.name || '';
    const body = match[2];
    if (body.includes('<failure') || body.includes('<error')) {
      const messageAttrMatch = body.match(/<(failure|error)[^>]*message="([^"]*)"/i);
      const messageBodyMatch = body.match(/<(failure|error)[^>]*>([\s\S]*?)<\/\1>/i);
      const message = messageAttrMatch
        ? messageAttrMatch[2].trim()
        : (messageBodyMatch ? messageBodyMatch[2] : 'Assertion failure').trim();
      failedTestList.push({ classname, name, message: message.substring(0, 300) });
    }
  }

  return {
    tests,
    failures,
    errors,
    skipped,
    time,
    passed: Math.max(0, tests - failures - errors - skipped),
    failedTestList,
  };
}

function fmtPct(n) {
  if (n == null || Number.isNaN(n)) return 'n/a';
  return `${Number(n).toFixed(2)}%`;
}

function main() {
  const lines = [];
  lines.push('## Unit test & coverage summary');
  lines.push('');

  let junit = null;
  if (fs.existsSync(JUNIT)) {
    junit = parseJunit(fs.readFileSync(JUNIT, 'utf8'));
    lines.push('### Test results');
    lines.push('');
    lines.push(`| Metric | Count |`);
    lines.push(`| --- | ---: |`);
    lines.push(`| Total | ${junit.tests} |`);
    lines.push(`| Passed | ${junit.passed} |`);
    lines.push(`| Failed | ${junit.failures} |`);
    lines.push(`| Errors | ${junit.errors} |`);
    lines.push(`| Skipped | ${junit.skipped} |`);
    lines.push(`| Duration (s) | ${junit.time.toFixed(2)} |`);
    lines.push('');

    if (junit.failedTestList?.length) {
      lines.push('### ❌ Failing Spec Details');
      lines.push('');
      for (const ft of junit.failedTestList) {
        lines.push(`- **\`${ft.classname}\`** > \`${ft.name}\``);
        lines.push(`  > ${ft.message}`);
        lines.push('');
      }
    }
  } else {
    lines.push('_JUnit report not found (`coverage/junit/test-results.xml`)._');
    lines.push('');
  }

  const summary = readJson(SUMMARY);
  const check = readJson(CHECK);

  lines.push('### Overall coverage');
  lines.push('');
  if (summary?.total) {
    const t = summary.total;
    lines.push('| Statements | Branches | Functions | Lines |');
    lines.push('| ---: | ---: | ---: | ---: |');
    lines.push(
      `| ${fmtPct(t.statements.pct)} | ${fmtPct(t.branches.pct)} | ${fmtPct(
        t.functions.pct
      )} | ${fmtPct(t.lines.pct)} |`
    );
    lines.push('');
  } else if (check?.overall) {
    const t = check.overall;
    lines.push('| Statements | Branches | Functions | Lines |');
    lines.push('| ---: | ---: | ---: | ---: |');
    lines.push(
      `| ${fmtPct(t.statements.percent)} | ${fmtPct(
        t.branches.percent
      )} | ${fmtPct(t.functions.percent)} | ${fmtPct(t.lines.percent)} |`
    );
    lines.push('');
  } else {
    lines.push('_Coverage summary not found._');
    lines.push('');
  }

  if (check) {
    lines.push('### Per-file coverage gate (90%)');
    lines.push('');
    lines.push(`- Files checked: **${check.fileCount}**`);
    lines.push(`- Threshold: **${check.threshold}%**`);
    if (check.failures?.length) {
      lines.push(`- Status: **FAILED** (${check.failures.length} metric failures)`);
      lines.push('');
      lines.push('<details><summary>Failing files (first 50)</summary>');
      lines.push('');
      lines.push('| File | Metric | Coverage |');
      lines.push('| --- | --- | ---: |');
      for (const f of check.failures.slice(0, 50)) {
        lines.push(
          `| \`${f.file}\` | ${f.metric} | ${Number(f.percent).toFixed(2)}% |`
        );
      }
      if (check.failures.length > 50) {
        lines.push(`| … | … | ${check.failures.length - 50} more |`);
      }
      lines.push('');
      lines.push('</details>');
    } else {
      lines.push('- Status: **PASSED** (every file ≥ 90% on statements, branches, functions, lines)');
    }
    lines.push('');
  }

  const statusIcon =
    (junit && (junit.failures > 0 || junit.errors > 0)) ||
    (check && check.failures && check.failures.length)
      ? '❌'
      : '✅';
  lines.unshift(`${statusIcon} Quality gate summary`);
  lines.splice(1, 0, '');

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, lines.join('\n') + '\n');
  console.log(`Wrote ${path.relative(ROOT, OUT)}`);
  console.log(lines.join('\n'));
}

main();
