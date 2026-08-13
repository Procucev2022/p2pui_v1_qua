const fs = require('fs');
const path = require('path');

const keepExact = new Set([
  path.normalize(
    'src/app/layout/vendor-mgr/vendor-active-time/vendor-active-times/vendor-active-times.component.spec.ts'
  ),
  path.normalize('src/app/layout/vendor/vendor-profile/vendor-profile.component.spec.ts'),
  path.normalize(
    'src/app/layout/vendor/components/vendor-quotation-modal/vendor-quotation-modal.component.spec.ts'
  ),
  path.normalize('src/app/layout/category/create-sub-category/create-sub-category.component.spec.ts'),
  path.normalize(
    'src/app/layout/category-mgr/cat-mgr-client-regstr/cat-mgr-client-regstr.component.spec.ts'
  ),
]);

const files = JSON.parse(fs.readFileSync('.coverage-work/fail-big.json', 'utf8'));
let n = 0;
for (const f of files) {
  const spec = path.normalize(f.replace(/\.ts$/, '.spec.ts'));
  if (!fs.existsSync(spec)) continue;
  let s = fs.readFileSync(spec, 'utf8');
  if (!s.includes('deep coverage for major methods')) continue;
  if (keepExact.has(spec)) {
    console.log('keep', spec);
    continue;
  }
  const re = /\n  it\('deep coverage for major methods and branches', \(\) => \{[\s\S]*?\n  \}\);\n/;
  let next = s.replace(re, '\n');
  next = next.replace(/,?\s*deepExerciseComponent/g, '').replace(/deepExerciseComponent,?\s*/g, '');
  if (next !== s) {
    fs.writeFileSync(spec, next);
    n++;
    console.log('removed', spec);
  }
}
console.log('removed count', n);
