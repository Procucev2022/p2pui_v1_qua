/**
 * After seedComponent, rebind injected spies onto component instance
 * and configure EncryDecryService + MatDialog + ConvertToBase64 for branch hits.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const WIRE = {
  'src/app/layout/client/item-catalogue/item-catalogue.component.spec.ts': `
    const client = TestBed.inject(ClientService) as any;
    const dialog = TestBed.inject(MatDialog) as any;
    const toaster = TestBed.inject(ToastrService) as any;
    const enc = TestBed.inject(EncryDecryService) as any;
    const convertSer = TestBed.inject(ConvertToBase64Service) as any;
    enc.get.and.returnValue(JSON.stringify({ details: { org: { id: 'o1' }, role: { roleName: 'ClientInitiator' }, listofPermission: [] } }));
    dialog.open.and.returnValue({ afterClosed: () => of(null), close: () => undefined });
    dialog.closeAll.and.stub();
    convertSer.getBase64.and.returnValue(Promise.resolve('data:application/octet-stream;base64,QUFB'));
    client.getItemCatalogue.and.returnValue(of([{ id: '1', description: 'd', price: 1, priceFlag: 'U', subCategoryId: 'sc1', companyId: 'XXXXXXXXXXXabc', linked: false, status: null }]));
    client.getVendorsByItem.and.returnValue(of([{ id: 'v1', companyId: 'XXXXXXXXXXXabc', linked: false, vendorName: 'V', pricePerUnit: 5 }]));
    client.getVendorsByItemForClientInitiator.and.returnValue(of([{ id: 'v1', companyId: 'XXXXXXXXXXXabc', linked: true, vendorName: 'V', pricePerUnit: 5 }]));
    client.createItemCatalogue.and.returnValue(of({ statusCode: '200', message: 'ok' }));
    client.createItemCatalogueByRequestBOQFile.and.returnValue(of({ statusCode: '200', message: 'ok' }));
    client.updateItemCatalogueByRequest.and.returnValue(of({ statusCode: '200', message: 'ok' }));
    client.getItemDetailsById.and.returnValue(of({ id: '1', description: 'd', documents: [] }));
    (component as any).client = client;
    (component as any).clientService = client;
    (component as any).dialog = dialog;
    (component as any).modalDialog = dialog;
    (component as any).toaster = toaster;
    (component as any).encryDecryService = enc;
    (component as any).convertSer = convertSer;
`,
  'src/app/layout/category-mgr/category-mgr-vendor-summary/category-mgr-vendor-summary.component.spec.ts': `
    const rfqservice = TestBed.inject(RfqService) as any;
    const toastrService = TestBed.inject(ToastrService) as any;
    const dialog = TestBed.inject(MatDialog) as any;
    const createRfqService = TestBed.inject(CreateRfqService) as any;
    const enc = TestBed.inject(EncryDecryService) as any;
    enc.get.and.returnValue(JSON.stringify({ details: { org: { id: 'o1' }, role: { roleName: 'Category Manager' }, listofPermission: [] } }));
    dialog.open.and.returnValue({ afterClosed: () => of(null), close: () => undefined });
    dialog.closeAll.and.stub();
    ['getRFQs','fetchRfqById','acceptVendorByCM','rejectVendorByCM','requestForRFQByGMTVendor','ignoreRFQByGTMVendor','riaseQueryRFQByGTMVendor','getVendorsByRFQIdForGMT','getItemsByRFQIdForGMT'].forEach((m) => {
      try { if (rfqservice[m] && rfqservice[m].and) rfqservice[m].and.returnValue(of({ status: 'Success', statusCode: '200', message: 'ok', data: [], id: '1' })); } catch (e) {}
      try { if (createRfqService[m] && createRfqService[m].and) createRfqService[m].and.returnValue(of({ status: 'Success', statusCode: '200', message: 'ok', data: [], id: '1' })); } catch (e) {}
    });
    (component as any).rfqservice = rfqservice;
    (component as any).toastrService = toastrService;
    (component as any).dialog = dialog;
    (component as any).createRfqService = createRfqService;
    (component as any).encryDecryService = enc;
`,
  'src/app/layout/client/client-procure-request/client-procure-request.component.spec.ts': `
    const client = TestBed.inject(ClientService) as any;
    const dialog = TestBed.inject(MatDialog) as any;
    const toaster = TestBed.inject(ToastrService) as any;
    const enc = TestBed.inject(EncryDecryService) as any;
    const approve = TestBed.inject(ApprovePrService) as any;
    enc.get.and.returnValue(JSON.stringify({ details: { org: { id: 'o1' }, role: { roleName: 'ClientInitiator' }, listofPermission: [] } }));
    dialog.open.and.returnValue({ afterClosed: () => of(null), close: () => undefined });
    dialog.closeAll.and.stub();
    ['getPrSummaryData','getStatus','approvePR','getPRitemsByid','getPRById'].forEach((m) => {
      try { if (client[m] && client[m].and) client[m].and.returnValue(of([{ id: '1', status: 'Open' }])); } catch (e) {}
      try { if (approve[m] && approve[m].and) approve[m].and.returnValue(of({ status: 'Success', statusCode: '200', message: 'ok' })); } catch (e) {}
    });
    (component as any).client = client;
    (component as any).clientService = client;
    (component as any).dialog = dialog;
    (component as any).toaster = toaster;
    (component as any).toastr = toaster;
    (component as any).encryDecryService = enc;
    (component as any).approvePrService = approve;
`,
  'src/app/layout/client/client-procure-request-opex/client-procure-request-opex.component.spec.ts': `
    const client = TestBed.inject(ClientService) as any;
    const dialog = TestBed.inject(MatDialog) as any;
    const toaster = TestBed.inject(ToastrService) as any;
    const enc = TestBed.inject(EncryDecryService) as any;
    const approve = TestBed.inject(ApprovePrService) as any;
    enc.get.and.returnValue(JSON.stringify({ details: { org: { id: 'o1' }, role: { roleName: 'ClientInitiator' }, listofPermission: [] } }));
    dialog.open.and.returnValue({ afterClosed: () => of(null), close: () => undefined });
    dialog.closeAll.and.stub();
    ['getPrSummaryData','getStatus','approvePR','getPRitemsByid','getPRById'].forEach((m) => {
      try { if (client[m] && client[m].and) client[m].and.returnValue(of([{ id: '1', status: 'Open' }])); } catch (e) {}
      try { if (approve[m] && approve[m].and) approve[m].and.returnValue(of({ status: 'Success', statusCode: '200', message: 'ok' })); } catch (e) {}
    });
    (component as any).client = client;
    (component as any).clientService = client;
    (component as any).dialog = dialog;
    (component as any).toaster = toaster;
    (component as any).toastr = toaster;
    (component as any).encryDecryService = enc;
    (component as any).approvePrService = approve;
`,
  'src/app/layout/client/client-procure-request-capex/client-procure-request-capex.component.spec.ts': `
    const client = TestBed.inject(ClientService) as any;
    const dialog = TestBed.inject(MatDialog) as any;
    const toaster = TestBed.inject(ToastrService) as any;
    const enc = TestBed.inject(EncryDecryService) as any;
    const approve = TestBed.inject(ApprovePrService) as any;
    enc.get.and.returnValue(JSON.stringify({ details: { org: { id: 'o1' }, role: { roleName: 'ClientInitiator' }, listofPermission: [] } }));
    dialog.open.and.returnValue({ afterClosed: () => of(null), close: () => undefined });
    dialog.closeAll.and.stub();
    ['getPrSummaryData','getStatus','approvePR','getPRitemsByid','getPRById'].forEach((m) => {
      try { if (client[m] && client[m].and) client[m].and.returnValue(of([{ id: '1', status: 'Open' }])); } catch (e) {}
      try { if (approve[m] && approve[m].and) approve[m].and.returnValue(of({ status: 'Success', statusCode: '200', message: 'ok' })); } catch (e) {}
    });
    (component as any).client = client;
    (component as any).clientService = client;
    (component as any).dialog = dialog;
    (component as any).toaster = toaster;
    (component as any).toastr = toaster;
    (component as any).encryDecryService = enc;
    (component as any).approvePrService = approve;
`,
  'src/app/layout/category-mgr/create-rfq-shared/create-rfq-shared.component.spec.ts': `
    const rfqservice = TestBed.inject(RfqService) as any;
    const createRfqService = TestBed.inject(CreateRfqService) as any;
    const dialog = TestBed.inject(MatDialog) as any;
    const toaster = TestBed.inject(ToastrService) as any;
    const enc = TestBed.inject(EncryDecryService) as any;
    const convertSer = TestBed.inject(ConvertToBase64Service) as any;
    enc.get.and.returnValue(JSON.stringify({ details: { org: { id: 'o1' }, role: { roleName: 'Category Manager' }, listofPermission: [] } }));
    dialog.open.and.returnValue({ afterClosed: () => of(null), close: () => undefined });
    dialog.closeAll.and.stub();
    convertSer.getBase64.and.returnValue(Promise.resolve('data:application/octet-stream;base64,QUFB'));
    Object.keys(rfqservice).forEach((m) => { try { if (rfqservice[m] && rfqservice[m].and) rfqservice[m].and.returnValue(of([{ id: '1' }])); } catch (e) {} });
    Object.keys(createRfqService).forEach((m) => { try { if (createRfqService[m] && createRfqService[m].and) createRfqService[m].and.returnValue(of({ status: 'Success', statusCode: '200', id: '1', data: [] })); } catch (e) {} });
    (component as any).rfqservice = rfqservice;
    (component as any).createRfqService = createRfqService;
    (component as any).dialog = dialog;
    (component as any).toaster = toaster;
    (component as any).toastrService = toaster;
    (component as any).encryDecryService = enc;
    (component as any).convertSer = convertSer;
`,
  'src/app/layout/pos/pos/pos.component.spec.ts': `
    const poService = TestBed.inject(PoService) as any;
    const dialog = TestBed.inject(MatDialog) as any;
    const toaster = TestBed.inject(ToastrService) as any;
    const enc = TestBed.inject(EncryDecryService) as any;
    enc.get.and.returnValue(JSON.stringify({ details: { org: { id: 'o1' }, role: { roleName: 'Client' }, listofPermission: [] } }));
    dialog.open.and.returnValue({ afterClosed: () => of(null), close: () => undefined });
    dialog.closeAll.and.stub();
    Object.keys(poService).forEach((m) => { try { if (poService[m] && poService[m].and) poService[m].and.returnValue(of([{ id: '1', status: 'Open' }])); } catch (e) {} });
    (component as any).poService = poService;
    (component as any).dialog = dialog;
    (component as any).toaster = toaster;
    (component as any).toastrService = toaster;
    (component as any).encryDecryService = enc;
`,
  'src/app/layout/bfs/bfs-items-list/bfs-items-list.component.spec.ts': `
    const bfs = TestBed.inject(BfsItemsService) as any;
    const dialog = TestBed.inject(MatDialog) as any;
    const toaster = TestBed.inject(ToastrService) as any;
    const enc = TestBed.inject(EncryDecryService) as any;
    const convertSer = TestBed.inject(ConvertToBase64Service) as any;
    enc.get.and.returnValue(JSON.stringify({ details: { org: { id: 'o1' }, role: { roleName: 'Buyer' }, listofPermission: [] } }));
    dialog.open.and.returnValue({ afterClosed: () => of(null), close: () => undefined });
    dialog.closeAll.and.stub();
    convertSer.getBase64.and.returnValue(Promise.resolve('data:application/octet-stream;base64,QUFB'));
    Object.keys(bfs).forEach((m) => { try { if (bfs[m] && bfs[m].and) bfs[m].and.returnValue(of([{ id: '1' }])); } catch (e) {} });
    (component as any).bfsItemsService = bfs;
    (component as any).service = bfs;
    (component as any).dialog = dialog;
    (component as any).toaster = toaster;
    (component as any).toastrService = toaster;
    (component as any).encryDecryService = enc;
    (component as any).convertSer = convertSer;
`,
  'src/app/layout/vendor/vendor-reg/vendor-reg.component.spec.ts': `
    const vendorReg = TestBed.inject(VendorRegistrationService) as any;
    const vendor = TestBed.inject(VendorService) as any;
    const countries = TestBed.inject(CountriesService) as any;
    const dialog = TestBed.inject(MatDialog) as any;
    const toaster = TestBed.inject(ToastrService) as any;
    const enc = TestBed.inject(EncryDecryService) as any;
    const convertSer = TestBed.inject(ConvertToBase64Service) as any;
    enc.get.and.returnValue(JSON.stringify({ details: { org: { id: 'o1' }, role: { roleName: 'Vendor' }, listofPermission: [] } }));
    dialog.open.and.returnValue({ afterClosed: () => of(null), close: () => undefined });
    dialog.closeAll.and.stub();
    convertSer.getBase64.and.returnValue(Promise.resolve('data:application/octet-stream;base64,QUFB'));
    Object.keys(vendorReg).forEach((m) => { try { if (vendorReg[m] && vendorReg[m].and) vendorReg[m].and.returnValue(of({ status: 'Success', statusCode: '200', id: '1', data: {} })); } catch (e) {} });
    Object.keys(vendor).forEach((m) => { try { if (vendor[m] && vendor[m].and) vendor[m].and.returnValue(of({ status: 'Success', statusCode: '200', id: '1' })); } catch (e) {} });
    Object.keys(countries).forEach((m) => { try { if (countries[m] && countries[m].and) countries[m].and.returnValue(of([{ id: '1', name: 'IN' }])); } catch (e) {} });
    (component as any).vendorRegistrationService = vendorReg;
    (component as any).vendorService = vendor;
    (component as any).countriesService = countries;
    (component as any).dialog = dialog;
    (component as any).toaster = toaster;
    (component as any).toastrService = toaster;
    (component as any).encryDecryService = enc;
    (component as any).convertSer = convertSer;
`,
};

const MARKER = '// big90 service rebind';
let n = 0;
for (const [rel, code] of Object.entries(WIRE)) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) continue;
  let s = fs.readFileSync(p, 'utf8');
  if (s.includes(MARKER)) {
    console.log('SKIP', rel);
    continue;
  }
  if (!s.includes("from 'rxjs'") && !s.includes('from "rxjs"')) {
    s = s.replace(
      /(import \{[^}]+\} from '@angular\/core\/testing';)/,
      `$1\nimport { of } from 'rxjs';`
    );
  }
  const needle = 'seedComponent(component as any);';
  const idx = s.indexOf(needle);
  if (idx < 0) {
    console.log('NO_SEED', rel);
    continue;
  }
  s = s.slice(0, idx + needle.length) + `\n${MARKER}` + code + s.slice(idx + needle.length);
  fs.writeFileSync(p, s);
  n++;
  console.log('WIRE', rel);
}
console.log('Done', n);
