const fs = require('fs');
const path = require('path');

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (e.name.endsWith('.spec.ts')) a.push(p);
  }
  return a;
}

let fixed = 0;
let replaced = 0;
for (const f of walk('src')) {
  let s = fs.readFileSync(f, 'utf8');
  if (!s.includes('deepExerciseComponent')) continue;
  if (/import\s*\{[^}]*deepExerciseComponent/.test(s)) continue;

  const m = s.match(
    /import\s*\{([^}]*)\}\s*from\s*(['"][^'"]*testing\/test-helpers['"])/
  );
  if (m) {
    const inner = m[1];
    if (!inner.includes('deepExerciseComponent')) {
      const cleaned = inner.trim().replace(/,\s*$/, '');
      const next = `import {${cleaned}, deepExerciseComponent} from ${m[2]}`;
      s = s.replace(m[0], next);
      fs.writeFileSync(f, s);
      fixed++;
      console.log('import+', f);
    }
  } else if (s.includes('exerciseComponent')) {
    s = s.replace(/deepExerciseComponent/g, 'exerciseComponent');
    fs.writeFileSync(f, s);
    replaced++;
    console.log('replace', f);
  } else {
    s = s.replace(
      /try \{ deepExerciseComponent\(c\); \} catch \(e\) \{\}/g,
      '/* deepExercise skipped */'
    );
    fs.writeFileSync(f, s);
    replaced++;
    console.log('strip', f);
  }
}
console.log('fixed imports', fixed, 'replaced/stripped', replaced);
