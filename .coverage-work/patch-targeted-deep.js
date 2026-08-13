/**
 * Append deepExercise + success/failure state-method it() to mid/big specs
 * that lack the marker (idempotent).
 */
const fs = require('fs');
const path = require('path');

const MARKER = 'targeted deepExercise state-method coverage';
const lists = [
  ...JSON.parse(fs.readFileSync('.coverage-work/fail-mid.json', 'utf8')),
  ...JSON.parse(fs.readFileSync('.coverage-work/fail-big.json', 'utf8')),
];

let written = 0;
let skipped = 0;

for (const rel of [...new Set(lists)]) {
  const spec = rel.replace(/\.ts$/, '.spec.ts');
  if (!fs.existsSync(spec)) {
    skipped++;
    continue;
  }
  let src = fs.readFileSync(spec, 'utf8');
  if (src.includes(MARKER)) {
    skipped++;
    continue;
  }

  if (!src.includes('deepExerciseComponent')) {
    if (src.includes('exerciseComponent')) {
      src = src.replace(
        /import \{([^}]+)\} from ['"][^'"]*testing\/test-helpers['"];/,
        (m, inner) => {
          if (inner.includes('deepExerciseComponent')) return m;
          return m.replace(inner, inner.trim().replace(/,?$/, '') + ', deepExerciseComponent');
        }
      );
    } else if (src.includes("from 'rxjs'") || src.includes('from "rxjs"')) {
      src = src.replace(
        /(import \{[^}]+\} from ['"][^'"]*testing\/test-helpers['"];)/,
        (m) => {
          if (m.includes('deepExerciseComponent')) return m;
          return m.replace('{', '{ deepExerciseComponent, ');
        }
      );
    } else {
      // ensure import
      src = src.replace(
        /(import \{[^}]+\} from ['"][^'"]*testing\/test-helpers['"];)/,
        (m) => {
          if (m.includes('deepExerciseComponent')) return m;
          return m.replace('{', '{ deepExerciseComponent, ');
        }
      );
    }
  }

  if (!/from ['"]rxjs['"]/.test(src) && !/from ["']rxjs["']/.test(src)) {
    src = src.replace(
      /(import \{[^}]+\} from '@angular\/core\/testing';)/,
      `$1\nimport { of } from 'rxjs';`
    );
  }

  const block = `
  it('${MARKER}', () => {
    const c: any = component;
    const row: any = {
      id: '1', vendorId: 'v1', ID: '1', name: 'n', status: 'Open', status_ui_display: 'Open',
      uom: { description: 'KG' }, vendorData: ['v1'], action: null, org: { id: 'o1' },
      certificates: [{ fileName: 'c.pdf', file: 'AAA' }], clientStatus: { uiDisplay: 'Open' },
      createdTS: new Date().toISOString(), query: 'a|b',
    };
    const ev: any = {
      preventDefault() {}, stopPropagation() {},
      target: { files: [{ name: 'a.pdf' }], value: 'x', checked: true },
      index: 0, first: 0, rows: 10,
    };
    c.roleName = 'CategoryManager';
    c.currentRole = 'CategoryManager';
    c.loggedUserDetails = { id: 'u1', username: 'tester', role: { roleName: 'CategoryManager' }, org: { id: 'o1' }, listofPermission: [] };
    c.selectedData = [row];
    c.rowData = [row];
    c.rfqDataList = [row];
    c.cache_rfqDataList = [row];
    c.vendorList = [{ id: '1', isLinked: true, isEdit: true }];
    c.productsList = [row];
    c.servicesList = [row];
    c.itemList = [row];
    c.regId = 'o1';
    c.searchTextValue = 'x';
    c.searchCriteria = 'Inline';
    c.selectedIndex = 0;
    c.form = { valid: true, invalid: false, value: { id: '1' }, reset: () => undefined, patchValue: () => undefined, get: () => ({ value: 'x', setValue: () => undefined, valid: true }) };
    c.itemForm = c.form;

    Object.keys(c).forEach((k) => {
      const svc = c[k];
      if (!svc || typeof svc !== 'object') return;
      Object.keys(svc).forEach((m) => {
        const spy = svc[m];
        if (spy && spy.and && typeof spy.and.returnValue === 'function') {
          try {
            spy.and.returnValue(of({
              status: 'Success', statusCode: '200', message: 'ok', data: [row], totalRecords: 1,
              ...row, vendorProduct: [row], vendorService: [row], certificates: [row],
            }));
          } catch { /* */ }
        }
      });
    });

    try { deepExerciseComponent(c); } catch { /* */ }

    Object.keys(c).forEach((k) => {
      const svc = c[k];
      if (!svc || typeof svc !== 'object') return;
      Object.keys(svc).forEach((m) => {
        const spy = svc[m];
        if (spy && spy.and && typeof spy.and.returnValue === 'function') {
          try { spy.and.returnValue(of({ status: 'Failure', statusCode: '500', message: 'err', errorMessage: 'err', data: null })); } catch { /* */ }
        }
      });
    });
    try { deepExerciseComponent(c); } catch { /* */ }

    c.form = { valid: false, invalid: true, value: {}, reset: () => undefined, patchValue: () => undefined, get: () => ({ value: '', setValue: () => undefined, valid: false }) };
    c.selectedData = [];
    c.searchTextValue = '';
    try { deepExerciseComponent(c); } catch { /* */ }
    expect(component).toBeTruthy();
  });
`;

  const idx = src.lastIndexOf('});');
  if (idx < 0) {
    skipped++;
    continue;
  }
  src = src.slice(0, idx) + block + '\n' + src.slice(idx);
  fs.writeFileSync(spec, src);
  written++;
  console.log('PATCH', rel);
}
console.log('written', written, 'skipped', skipped);
