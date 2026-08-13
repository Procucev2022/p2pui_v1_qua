/**
 * Extract method names + if-heavy regions for priority big components.
 */
const fs = require('fs');
const path = require('path');

const TARGETS = [
  'src/app/layout/client/item-catalogue/item-catalogue.component.ts',
  'src/app/layout/category-mgr/category-mgr-vendor-summary/category-mgr-vendor-summary.component.ts',
  'src/app/layout/client/client-procure-request/client-procure-request.component.ts',
  'src/app/layout/client/client-procure-request-opex/client-procure-request-opex.component.ts',
  'src/app/layout/client/client-procure-request-capex/client-procure-request-capex.component.ts',
  'src/app/layout/category-mgr/create-rfq-shared/create-rfq-shared.component.ts',
  'src/app/layout/pos/pos/pos.component.ts',
  'src/app/layout/bfs/bfs-items-list/bfs-items-list.component.ts',
  'src/app/layout/vendor/vendor-reg/vendor-reg.component.ts',
];

for (const rel of TARGETS) {
  const src = fs.readFileSync(rel, 'utf8');
  const lines = src.split(/\r?\n/);
  const methods = [];
  for (const line of lines) {
    const m = line.match(
      /^\s*(?:public\s+|protected\s+|async\s+)?([a-zA-Z]\w*)\s*\(([^)]*)\)\s*(?::\s*[^{;]+)?\s*\{?\s*$/
    );
    if (!m) continue;
    const name = m[1];
    if (['constructor', 'if', 'for', 'while', 'switch', 'catch'].includes(name)) continue;
    methods.push(name);
  }
  const ifCount = (src.match(/\bif\s*\(/g) || []).length;
  console.log('\n==', path.basename(rel), 'LOC', lines.length, 'ifs', ifCount);
  console.log('methods:', [...new Set(methods)].join(', '));
}
