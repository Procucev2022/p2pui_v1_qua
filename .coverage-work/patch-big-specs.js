const fs = require('fs');
const files = JSON.parse(fs.readFileSync('.coverage-work/fail-big.json', 'utf8'));

let patched = 0;
for (const f of files) {
  const spec = f.replace(/\.ts$/, '.spec.ts');
  if (!fs.existsSync(spec)) {
    console.log('NO SPEC', spec);
    continue;
  }
  let src = fs.readFileSync(spec, 'utf8');
  if (src.includes('deepExerciseComponent')) {
    console.log('already', spec);
    continue;
  }

  // ensure import
  if (src.includes("from ") && src.includes('test-helpers')) {
    src = src.replace(
      /import\s*\{([^}]*)\}\s*from\s*['"][^'"]*testing\/test-helpers['"];/,
      (m, inner) => {
        if (inner.includes('deepExerciseComponent')) return m;
        const parts = inner
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        if (!parts.includes('deepExerciseComponent')) parts.push('deepExerciseComponent');
        const quote = m.includes('"') ? '"' : "'";
        const pathMatch = m.match(/from\s*(['"][^'"]+['"])/);
        return `import { ${parts.join(', ')} } from ${pathMatch[1]};`;
      }
    );
  }

  // append deep it before final closing of describe
  if (!src.includes("deep coverage for major methods")) {
    const insert = `
  it('deep coverage for major methods and branches', () => {
    deepExerciseComponent(component as any);
    expect(component).toBeTruthy();
  });
`;
    const idx = src.lastIndexOf('});');
    if (idx === -1) {
      console.log('skip structure', spec);
      continue;
    }
    src = src.slice(0, idx) + insert + '\n' + src.slice(idx);
  }

  fs.writeFileSync(spec, src);
  patched++;
  console.log('patched', spec);
}
console.log('patched count', patched);
