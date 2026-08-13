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
  const hasLet = /let\s+component\s*[:=]/.test(s);
  const usesBare =
    /(?:^|[^\w])component\s*\./m.test(s) ||
    /\(component as any\)/.test(s) ||
    /const c: any = component/.test(s) ||
    /expect\(component\)/.test(s);
  // ignore locals like `const component =`
  const hasConstInIts = /const\s+component\s*=/.test(s);
  if (usesBare && !hasLet && !hasConstInIts) {
    broken.push(f.replace(/\\/g, '/'));
  } else if (usesBare && !hasLet && hasConstInIts) {
    // const only inside some its — bare use outside those scopes?
    // check if harness uses component at describe level without let
    if (
      /it\([^)]*\)[^{]*\{[\s\S]*?(?:const c: any = component|\(component as any\)|expect\(component\))/.test(
        s
      ) &&
      !/let\s+component/.test(s)
    ) {
      // Find it blocks that use component without declaring const component inside
      const its = [...s.matchAll(/it\((['"`])([\s\S]*?)\1\s*,\s*(?:async\s*)?\(\)\s*=>\s*\{/g)];
      // simpler heuristic: file has expect(component) or const c = component outside of lines with const component =
      const lines = s.split(/\n/);
      let scopeConst = false;
      let depth = 0;
      let problem = false;
      // just flag if any line uses bare component and file has no let component
      if (!/let\s+component/.test(s)) {
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (/const\s+component\s*=/.test(line)) continue;
          if (
            /\(component as any\)|const c: any = component|expect\(component\)/.test(line) &&
            !/const\s+component/.test(line)
          ) {
            // may still be in same it as const - rough check: look back 40 lines for const component
            const back = lines.slice(Math.max(0, i - 40), i).join('\n');
            if (!/const\s+component\s*=/.test(back)) {
              problem = true;
              break;
            }
          }
        }
      }
      if (problem) broken.push(f.replace(/\\/g, '/') + ' (scoped)');
    }
  }
}
console.log('broken', broken.length);
broken.forEach((b) => console.log(b));
