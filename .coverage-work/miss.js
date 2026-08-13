const f = require('../coverage/coverage-final.json');
function show(name) {
  const e = Object.entries(f).find(([k]) => k.replace(/\\/g, '/').endsWith(name));
  if (!e) {
    console.log('no', name);
    return;
  }
  const [, d] = e;
  const missFn = Object.entries(d.fnMap)
    .filter(([id]) => d.f[id] === 0)
    .map(([, m]) => m.name + '@' + m.decl.start.line);
  const missBr = Object.entries(d.branchMap)
    .filter(([id]) => d.b[id].some((h) => h === 0))
    .map(([id, m]) => ({ line: m.loc.start.line, type: m.type, hits: d.b[id] }));
  console.log('\n', name, 'missFn', missFn);
  console.log('missBr', JSON.stringify(missBr, null, 2));
}
show('po/po-create/po-create.component.ts');
show('live-auction-for-itemwise.component.ts');
show('quot-view-details.component.ts');
