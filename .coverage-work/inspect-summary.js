const path = require('path');
const root = path.join(__dirname, '..');
const s = require(path.join(root, 'coverage/coverage-check-summary.json'));
console.log('overall', JSON.stringify(s.overall));
console.log('failures', s.failures.length);
console.log(JSON.stringify(s.failures.slice(0, 8), null, 2));
const cov = require(path.join(root, 'coverage/coverage-final.json'));
const keys = Object.keys(cov);
console.log('cov keys', keys.length);
console.log(keys.slice(0, 8));
const loader = keys.filter((k) => k.includes('loader.component'));
console.log('loader keys', loader);
const fails = require(path.join(root, '.coverage-work/fail-small.json'));
const failSet = new Set(fails.map((f) => f.replace(/\\/g, '/')));
const matching = s.failures.filter((f) => {
  const p = (f.file || f.path || f).toString().replace(/\\/g, '/');
  return (
    failSet.has(p) ||
    [...failSet].some((x) => p.endsWith(x) || p.includes(x.replace(/^src\//, '')))
  );
});
console.log('matching fail-small in summary', matching.length);
console.log(JSON.stringify(matching.slice(0, 20), null, 2));
