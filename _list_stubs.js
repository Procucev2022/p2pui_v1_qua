const fs = require('fs');
const path = require('path');

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (e.name.endsWith('.component.spec.ts')) a.push(p);
  }
  return a;
}

const root = 'src/app/layout';
const stubs = [];
for (const sp of walk(root)) {
  const c = fs.readFileSync(sp, 'utf8');
  const its = [...c.matchAll(/\bit\s*\(/g)].length;
  if (its <= 1 && c.includes('should create')) {
    const ts = sp.replace(/\.spec\.ts$/, '.ts');
    let lines = 0;
    if (fs.existsSync(ts)) lines = fs.readFileSync(ts, 'utf8').split(/\r?\n/).length;
    stubs.push({ lines, sp: sp.split(path.sep).join('/') });
  }
}
stubs.sort((a, b) => a.lines - b.lines);
console.log('Total stubs:', stubs.length);
stubs.forEach((s) => console.log(String(s.lines).padStart(5), s.sp));
