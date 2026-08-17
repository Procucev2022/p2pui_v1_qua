const cov = require('../coverage/coverage-final.json');
const files = process.argv.slice(2);
for (const k of Object.keys(cov)) {
  const norm = k.replace(/\\/g, '/');
  if (!files.some((f) => norm.endsWith(f))) continue;
  const e = cov[k];
  const lines = [];
  for (const [id, arr] of Object.entries(e.b || {})) {
    const loc = e.branchMap[id];
    if (!loc) continue;
    arr.forEach((hits, i) => {
      if (hits === 0) {
        const locI = loc.locations && loc.locations[i] ? loc.locations[i] : loc.loc;
        lines.push((locI && locI.start && locI.start.line) || loc.loc.start.line);
      }
    });
  }
  const uniq = [...new Set(lines)].sort((a, b) => a - b);
  console.log('\n' + norm.split('/src/')[1]);
  console.log('uncovered branch lines:', uniq.join(', '));
}
