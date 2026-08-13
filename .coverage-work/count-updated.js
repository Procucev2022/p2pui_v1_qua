const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const fails = require('./fail-small.json');

const handRewritten = [];
const patternOnly = [];
const richExisting = [];

for (const f of fails) {
  const spec = path.join(root, f.replace(/\.ts$/, '.spec.ts'));
  const sp = fs.readFileSync(spec, 'utf8');
  const its = (sp.match(/\bit\(/g) || []).length;
  const hasPattern = /pattern-branch coverage/.test(sp);
  const hasExercise = /exerciseComponent/.test(sp);
  // Heuristic: hand-targeted if multiple expects on spies / status / branches
  const targeted =
    /toHaveBeenCalled/.test(sp) &&
    its >= 3 &&
    (!hasExercise || its >= 4);

  if (targeted) handRewritten.push(f);
  else if (hasPattern && its <= 4) patternOnly.push(f);
  else richExisting.push(f);
}

console.log('handOrStrong', handRewritten.length);
handRewritten.forEach((f) => console.log('  OK', f.split('/').slice(-2).join('/')));
console.log('patternOnly', patternOnly.length);
patternOnly.forEach((f) => console.log('  HARD', f.split('/').slice(-2).join('/')));
console.log('other', richExisting.length);
richExisting.forEach((f) => console.log('  OTHER', f.split('/').slice(-2).join('/')));
