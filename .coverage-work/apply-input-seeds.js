const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function walkSpecs(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkSpecs(full, out);
    else if (entry.name.endsWith('.component.spec.ts')) out.push(full);
  }
  return out;
}

function cleanSpec(absPath) {
  let content = fs.readFileSync(absPath, 'utf8');

  // Remove mis-ordered property setter lines
  content = content.replace(/\(component as any\)\.ppoData\s*=\s*\{ ppoItems: \[sampleRow\], id: "1", ppoNumber: "PPO1", ppoId: "1", prId: "1" \};\r?\n/g, '');
  content = content.replace(/\(component as any\)\.ppoItems\s*=\s*\[sampleRow\];\r?\n/g, '');
  content = content.replace(/\(component as any\)\.prDetails\s*=\s*\{ id: "1", lineItems: \[sampleRow\] \};\r?\n/g, '');

  const seedMarker = 'seedComponent(component as any);';
  if (!content.includes(seedMarker)) {
    fs.writeFileSync(absPath, content);
    return false;
  }

  const initSnippet = `
    const sampleRow: any = {
      id: '1', vendorId: 'v1', ID: '1', name: 'n', status: 'Open', status_ui_display: 'Open',
      description: 'desc1', projectCategory: 'cat1', projectSubCategory: 'subcat1', brand: 'b1',
      quantity: 10, unitofMeasures: 'KG', unitprice: 100, excludetaxamount: 1000, gstValue: 180, totalamount: 1180,
      uom: { description: 'KG', id: 'u1' }, vendorData: ['v1'], action: null, org: { id: 'o1', companyName: 'Org1' },
      certificates: [{ fileName: 'c.pdf', file: 'AAA' }], clientStatus: { uiDisplay: 'Open' },
      createdTS: new Date().toISOString(), query: 'a|b', pricePerUnit: 10, rank: 1, city: 'City1',
      vendorName: 'Vendor1', companyId: 'comp1', lineItems: [], documents: [], items: [],
      rfqData: { id: '1' }, vendorRequest: { id: '1' }, vendorDataObj: { id: '1' },
    };
    (component as any).ppoItems = [sampleRow];
    (component as any).ppoData = { ppoItems: [sampleRow], id: '1', ppoNumber: 'PPO1', ppoId: '1', prId: '1' };
    (component as any).prDetails = { id: '1', lineItems: [sampleRow] };
    (component as any).data = (component as any).data || { ppoId: '1', prId: '1', id: '1', status: 'Success', items: [sampleRow], lineItems: [sampleRow], vendorProduct: [sampleRow], vendorService: [sampleRow], rfqData: sampleRow, vendors: [sampleRow] };
    (component as any).rfqDataList = [sampleRow];
    (component as any).cache_rfqDataList = [sampleRow];
    (component as any).clientList = [sampleRow];
`;

  if (!content.includes('const sampleRow: any = {')) {
    content = content.replace(seedMarker, `${initSnippet}\n    ${seedMarker}`);
  }
  fs.writeFileSync(absPath, content);
  return true;
}

const specs = walkSpecs(path.join(ROOT, 'src'));
let count = 0;
for (const s of specs) {
  if (cleanSpec(s)) count++;
}

console.log(`Cleaned and correctly ordered input seeds in ${count} specs.`);
