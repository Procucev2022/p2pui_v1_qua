const fs = require('fs');
const path = require('path');

const files = JSON.parse(fs.readFileSync('.coverage-work/fail-big.json', 'utf8'));
const report = [];

function findHtml(rel) {
  const candidates = [
    path.join('coverage', 'src', rel + '.html'),
    path.join('coverage', rel + '.html'),
    path.join('coverage', 'app', rel.replace(/^src\/app\//, '') + '.html'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  // walk
  const base = path.basename(rel) + '.html';
  function walk(dir) {
    if (!fs.existsSync(dir)) return null;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        const hit = walk(p);
        if (hit) return hit;
      } else if (ent.name === base) return p;
    }
    return null;
  }
  return walk('coverage');
}

for (const f of files) {
  const htmlPath = findHtml(f);
  if (!htmlPath) {
    report.push({ file: f, html: null });
    continue;
  }
  const html = fs.readFileSync(htmlPath, 'utf8');
  // uncovered: class="cstat-no" or "cbranch-no" with data-line or id="lineN"
  const uncovered = new Set();
  // istanbul html: <span class="cstat-no" title="statement not covered">
  // line numbers often in <a name="L42"> or id="line42" or in gutter
  const lineRe =
    /<(?:tr|span|a)[^>]*(?:id|name|data-line)=["']?(?:line)?(\d+)["']?[^>]*class=["'][^"']*cstat-no/gi;
  let m;
  while ((m = lineRe.exec(html))) uncovered.add(+m[1]);

  // alternate: class first then id
  const lineRe2 =
    /class=["'][^"']*cstat-no[^"']*["'][^>]*(?:id|name|data-line)=["']?(?:line)?(\d+)/gi;
  while ((m = lineRe2.exec(html))) uncovered.add(+m[1]);

  // istanbul classic: <td class="line-count quiet"><a name='L42'>... then next row has cstat-no
  const blocks = html.split(/<a name=['"]L(\d+)['"]>/);
  for (let i = 1; i < blocks.length; i += 2) {
    const line = +blocks[i];
    const chunk = blocks[i + 1] || '';
    if (/cstat-no|cbranch-no/.test(chunk.slice(0, 800))) uncovered.add(line);
  }

  // fraction from header
  const frac = html.match(/(\d+(?:\.\d+)?)\s*%/);
  report.push({
    file: f,
    html: htmlPath,
    pctHint: frac ? frac[1] : null,
    uncovered: [...uncovered].sort((a, b) => a - b),
  });
}

fs.writeFileSync('.coverage-work/fail-big-uncovered.json', JSON.stringify(report, null, 2));
report.forEach((r) => {
  console.log(
    `${r.file}\n  html=${r.html || 'MISSING'} uncov=${(r.uncovered || []).length} lines=${(r.uncovered || []).slice(0, 40).join(',')}`
  );
});
