const fs = require('fs');
const path = require('path');

const files = JSON.parse(fs.readFileSync('.coverage-work/fail-big.json', 'utf8'));

function findHtml(rel) {
  const c = path.join('coverage', 'src', rel + '.html');
  if (fs.existsSync(c)) return c;
  return null;
}

function uncoveredFromHtml(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const lc = html.match(/<td class="line-count quiet">([\s\S]*?)<\/td>/);
  const lv = html.match(/<td class="line-coverage quiet">([\s\S]*?)<\/td>/);
  if (!lc || !lv) return { uncovered: [], pct: null };
  const lines = [...lc[1].matchAll(/>(\d+)</g)].map((m) => +m[1]);
  const cov = [...lv[1].matchAll(/class="cline-any ([^"]+)"/g)].map((m) => m[1]);
  const uncovered = lines.filter((l, i) => cov[i] && cov[i].includes('cline-no'));
  const pctMatch = html.match(/<span class="strong">([\d.]+)%\s*<\/span>\s*<span class="quiet">Statements<\/span>/);
  const brMatch = html.match(/<span class="strong">([\d.]+)%\s*<\/span>\s*<span class="quiet">Branches<\/span>/);
  const fnMatch = html.match(/<span class="strong">([\d.]+)%\s*<\/span>\s*<span class="quiet">Functions<\/span>/);
  return {
    uncovered,
    statements: pctMatch ? +pctMatch[1] : null,
    branches: brMatch ? +brMatch[1] : null,
    functions: fnMatch ? +fnMatch[1] : null,
  };
}

function methodsNearLines(src, lines) {
  const methodRe = /^\s*(?:public|private|protected)?\s*(?:async\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*\(/gm;
  const methods = [];
  let m;
  while ((m = methodRe.exec(src))) {
    const name = m[1];
    if (['if', 'for', 'while', 'switch', 'catch', 'function', 'return'].includes(name)) continue;
    const line = src.slice(0, m.index).split('\n').length;
    methods.push({ name, line });
  }
  const hit = new Set();
  for (const line of lines) {
    let best = null;
    for (const meth of methods) {
      if (meth.line <= line) best = meth;
      else break;
    }
    if (best) hit.add(best.name);
  }
  return [...hit];
}

const report = [];
for (const f of files) {
  const html = findHtml(f);
  if (!html) {
    report.push({ file: f, missing: true });
    continue;
  }
  const cov = uncoveredFromHtml(html);
  const src = fs.readFileSync(f, 'utf8');
  const methods = methodsNearLines(src, cov.uncovered);
  report.push({ file: f, ...cov, methods });
}

report.sort((a, b) => (b.statements || 0) - (a.statements || 0));
fs.writeFileSync('.coverage-work/fail-big-uncovered.json', JSON.stringify(report, null, 2));
for (const r of report) {
  console.log(
    `${String(r.statements).padStart(5)}% stmt  ${String(r.branches).padStart(5)}% br  methods=[${(r.methods || []).join(', ')}]  ${r.file}`
  );
  console.log(`         lines: ${(r.uncovered || []).slice(0, 50).join(',')}`);
}
