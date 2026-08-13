const fs = require('fs');
const path = require('path');

function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.spec.ts')) acc.push(p);
  }
  return acc;
}

const broken = [];
for (const f of walk('src')) {
  const s = fs.readFileSync(f, 'utf8');
  if (!s.includes('branch-path coverage harness')) continue;
  const hasLet = /let\s+component\s*:/.test(s);
  const usesComponent = /\(component as any\)|const c: any = component/.test(s);
  if (usesComponent && !hasLet) broken.push(f.replace(/\\/g, '/'));
}
console.log('broken', broken.length);
broken.forEach((b) => console.log(b));
