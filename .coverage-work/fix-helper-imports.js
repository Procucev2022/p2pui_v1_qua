const fs = require('fs');
const path = require('path');

function walk(d, acc = []) {
  for (const n of fs.readdirSync(d)) {
    const p = path.join(d, n);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (n.endsWith('.spec.ts')) acc.push(p);
  }
  return acc;
}

const specs = walk('src');
let fixed = 0;
for (const sp of specs) {
  let s = fs.readFileSync(sp, 'utf8');
  const m = s.match(/from ['"]([^'"]*testing\/test-helpers)['"]/);
  if (!m) continue;
  let want = path.relative(path.dirname(sp), 'src/testing/test-helpers').replace(/\\/g, '/');
  if (!want.startsWith('.')) want = './' + want;
  const cur = m[1].replace(/\\/g, '/');
  if (cur !== want) {
    s = s.replace(m[0], "from '" + want + "'");
    fs.writeFileSync(sp, s);
    fixed++;
    console.log('FIX', sp, cur, '=>', want);
  }
}
console.log('fixed', fixed);
