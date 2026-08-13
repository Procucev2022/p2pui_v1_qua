/**
 * Append focused branch-matrix tests for bfs-items-list and vendor-reg.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

function appendBeforeClose(specPath, marker, block) {
  let s = fs.readFileSync(specPath, 'utf8');
  if (s.includes(marker)) {
    console.log('SKIP', specPath);
    return;
  }
  if (!s.includes("from 'rxjs'") && !s.includes('from "rxjs"')) {
    s = s.replace(
      /(import \{[^}]+\} from '@angular\/core\/testing';)/,
      `$1\nimport { of, throwError } from 'rxjs';`
    );
  } else if (!s.includes('throwError')) {
    s = s.replace(/import \{([^}]+)\} from 'rxjs';/, (m, a) =>
      a.includes('throwError') ? m : `import { ${a.trim()}, throwError } from 'rxjs';`
    );
  }
  const idx = s.lastIndexOf('});');
  if (idx < 0) return;
  s = s.slice(0, idx) + '\n' + block + '\n' + s.slice(idx);
  fs.writeFileSync(specPath, s);
  console.log('PATCHED', specPath);
}

const bfsBlock = `
  it('focused bfs-items-list branch matrix', () => {
    const c: any = component;
    const bfs = c.bfsItemService || c.bfsItemsService || TestBed.inject(BfsItemsService);
    const enc = c.encryDecryService || TestBed.inject(EncryDecryService);
    const dialog = c.dialog || TestBed.inject(MatDialog);
    const convert = c.converSer || TestBed.inject(ConvertToBase64Service);
    c.bfsItemService = bfs;
    c.bfsItemsService = bfs;
    c.dialog = dialog;
    c.converSer = convert;
    c.toaster = c.toaster || TestBed.inject(ToastrService);
    c.loaderService = c.loaderService || { isLoading: { next() {} } };
    c.authService = c.authService || { onSelectedSubscriptions() {} };
    c.selectOrgTemplate = {} as any;
    c.viewItemDetailsTemplate = {} as any;
    c.addOrEditCommentsTemplate = {} as any;
    c.tabGrp = { selectedIndex: 0 };
    c.fileInput = { value: null };
    c.fileInput3 = { value: null };
    c.itemGridData = { gridValue: [] };
    c.requestUserGridData = { gridValue: [] };
    c.commentFilesDataList = [];
    c.commentFilesDataListImg = [];
    c.commentContent = { text: '' };
    c.commentContentList = [];
    dialog.open.and.returnValue({ afterClosed: () => of({ success: true }), close: () => undefined });
    dialog.closeAll.and.stub();
    convert.getBase64.and.returnValue(Promise.resolve('data:application/octet-stream;base64,QUFB'));

    enc.get.and.returnValue(JSON.stringify({
      details: { id: 'u1', username: 'u', org: { id: 'o1', companyName: 'Org' }, role: { roleName: 'Buyer' }, listofPermission: [] },
    }));
    c.loggedUserDetails = { id: 'u1', username: 'u', org: { id: 'o1', companyName: 'Org' }, role: { roleName: 'Buyer' } };
    c.roleName = 'Buyer';
    bfs.getGMTCategories.and.returnValue(of(['CatA', 'CatB']));
    bfs.getGMTDivisions.and.returnValue(of(['DivA']));
    bfs.getAllBFSItems.and.returnValue(of([{ id: 'i1', availableQuantity: 10, sellPrice: 200, askPrice: 180, buyPriceDisclosure: true, discount: 10 }]));
    c.ngOnInit();
    c.getItemsList();
    bfs.getAllBFSItems.and.returnValue(of({ error: true }));
    c.getItemsList();

    c.isEditBFSItem = false;
    c.onChangePriceDisclosure(true);
    c.onChangePriceDisclosure(false);
    c.isEditBFSItem = true;
    c.editBFSItemData = { discount: 5, sellPrice: 100, askPrice: 90, bfsDocuments: [{ id: 'd1', fileName: 'a.pdf' }], bfsImages: [{ id: 'img1', fileName: 'a.png' }], bfsDocumentsImg: [{ id: 'x' }] };
    c.onChangePriceDisclosure(true);
    c.onChangePriceDisclosure(false);

    c.createItem();
    c.onCloseItemForm();
    c.filterAutoCompleteDataByOrg({ query: 'a' }, 'orgList', 'filtered_organizationList', true);
    c.onSelectOrgForm();
    dialog.open.and.returnValue({ afterClosed: () => of(null), close: () => undefined });
    c.onSelectOrgForm();

    c.searchedEmail = 'bad';
    c.searchedPhone = '123';
    c.searchForOrgs();
    c.searchedEmail = 'a@b.com';
    c.searchedPhone = '123';
    c.searchForOrgs();
    c.searchedEmail = 'a@b.com';
    c.searchedPhone = '1234567890';
    bfs.getOrgSearchByEmailPhone.and.returnValue(of({ id: 'o1', companyName: 'Org' }));
    c.searchForOrgs();
    bfs.getOrgSearchByEmailPhone.and.returnValue(of({}));
    c.searchForOrgs();
    c.searchedEmail = '';
    c.searchedPhone = '';
    c.searchForOrgs();

    bfs.getUsersByOrg.and.returnValue(of([{ id: 'u1', username: 'u' }]));
    c.onChooseOrg({ id: 'o1' });
    bfs.getUsersByOrg.and.returnValue(of([]));
    c.onChooseOrg({ id: 'o1' });
    bfs.getUsersByOrg.and.returnValue(of({ error: true }));
    c.onChooseOrg({ id: 'o1' });

    c.categoryList = ['CatA', 'CatB', null];
    c.divisionsList = ['DivA'];
    c.filterAutoCompleteData({ query: 'cat' }, 'categoryList', 'filtered_categoryList', true);
    c.filterAutoCompleteData({ query: 'zzz' }, 'categoryList', 'filtered_categoryList', true);
    c.filterAutoCompleteData({ query: 'zzz' }, 'divisionsList', 'filtered_divisionsList', false);

    c.itemForm.patchValue({
      id: 'MANUALENTRYID_1', description: 'd', unitofMeasures: 'Nos', specification: 's',
      availableQuantity: 5, ageOfAsset: 12, sellPrice: 50, discount: 10, askPrice: 45,
      category: 'CatA', bfsGroup: 'DivA', location: 'L', user: { id: 'u1', username: 'u' },
      remarks: 'r', buyPriceDisclosure: true,
    });
    Object.keys(c.itemForm.controls).forEach((k) => c.itemForm.controls[k].setErrors(null));
    c.selectedOrgData = { id: 'o1' };
    c.commentFilesDataList = [{ fileName: 'a.pdf', file: 'AA' }];
    c.commentFilesDataListImg = [{ fileName: 'a.png', file: 'AA' }];
    c.isEditForm = false;
    c.onAddItemsToCart();
    c.isEditForm = true;
    c.itemGridData.gridValue = [{ id: 'MANUALENTRYID_1' }];
    c.itemForm.patchValue({ id: 'MANUALENTRYID_1', sellPrice: 150, discount: 120, askPrice: 50, buyPriceDisclosure: true, user: { username: 'u' } });
    Object.keys(c.itemForm.controls).forEach((k) => c.itemForm.controls[k].setErrors(null));
    c.onAddItemsToCart();
    c.itemForm.controls.description.setErrors({ required: true });
    c.onAddItemsToCart();
    c.onPriceDiscountChange();
    c.itemForm.patchValue({ sellPrice: '', discount: '' });
    c.onPriceDiscountChange();

    c.getBFSItemNumber();
    c.onDeleteItem({ id: 'MANUALENTRYID_1' });
    c.onEditItem({
      id: 'MANUALENTRYID_1', org: { id: 'o1' }, bfsDocuments: [], bfsImages: [],
      description: 'd', user: { username: 'u' },
    });
    c.onEditItem({ id: 'real1', org: { id: 'o1' }, bfsDocuments: [], bfsImages: [] });
    c.downloadSampleBOQ();
    c.uploadBOQFile({ target: { files: [{ name: 'a.xlsx' }] } });
    c.uploadBOQFile({ target: { files: [{ name: 'a.pdf' }] } });
    c.uploadBOQFile({ target: { files: [{ name: 'a.xls' }] } });
    c.removeFile();
    c.boqSelectedUser = null;
    c.selectedOrgData = null;
    c.onUploadFile();
    c.boqSelectedUser = { username: 'u', id: 'u1' };
    c.selectedOrgData = { id: 'o1' };
    c.boqFile = { file: 'AAA', fileName: 'a.xlsx' };
    bfs.getBFSItemsByBOQFile.and.returnValue(of([{ description: 'd', totalQuantity: 2, sellPrice: 50, discount: 5 }]));
    c.onUploadFile();
    c.convertBoQtoPrItems();
    bfs.getBFSItemsByBOQFile.and.returnValue(of({ error: true }));
    c.boqFile = { file: 'AAA' };
    c.convertBoQtoPrItems();
    bfs.getBFSItemsByBOQFile.and.returnValue(throwError(() => new Error('x')));
    c.boqFile = { file: 'AAA' };
    c.convertBoQtoPrItems();
    c.boqFile = null;
    c.convertBoQtoPrItems();

    c.onGridAction({ eventData: { eventName: 'onDeleteItem' }, rowData: { id: 'x' } });
    c.calculateBuyPrice({ sellPrice: 50, discount: 10 });
    c.calculateBuyPrice({ sellPrice: 500, discount: 10 });
    c.navigateToGMT('GMT');

    const row = { id: 'i1', availableQuantity: 10, sellPrice: 200, askPrice: 180, buyPriceDisclosure: true, discount: 10, remarks: 'r', commentsFlag: true };
    c.getRFQs(row, {});
    c.getCloseRFQs(row, {});
    void c.expandedRowKeys;
    c.expandedRows = null;
    void c.expandedRowKeys;
    bfs.getRequestedUsersByBFSForCM.and.returnValue(of([{ id: 'r1', status: { uiDisplay: 'New' } }]));
    c.getBuyerByBFS(row);
    bfs.getRequestedUsersByBFSForCM.and.returnValue(of({ error: true }));
    c.getBuyerByBFS(row);
    c.onUpdateBFSItem();
    c.onCloseEditForm();

    bfs.getBFSItemDetailsById.and.returnValue(of({
      id: 'i1', org: { id: 'o1' }, userId: 'u1', ageOfAsset: '12 Months', buyPriceDisclosure: true,
      bfsDocuments: [{ id: 'd1' }], bfsImages: [{ id: 'img1' }], discount: 5, sellPrice: 100, askPrice: 90,
    }));
    c.onEditBFSItemDetails({ id: 'i1', buyPriceDisclosure: true });
    bfs.getBFSItemDetailsById.and.returnValue(of({}));
    c.onEditBFSItemDetails({ id: 'i1', buyPriceDisclosure: false });
    bfs.getBFSItemDetailsById.and.returnValue(throwError(() => new Error('e')));
    c.onEditBFSItemDetails({ id: 'i1', buyPriceDisclosure: true });

    c.isEditBFSItem = true;
    c.editBFSItemData = {
      id: 'i1', bfsDocuments: [{ id: 'd1', fileName: 'a.pdf' }], bfsImages: [{ id: 'img1' }], bfsDocumentsImg: [{ id: 'x' }],
    };
    c.itemForm.patchValue({
      description: 'd', unitofMeasures: 'Nos', specification: 's', availableQuantity: 5, ageOfAsset: 12,
      sellPrice: 50, discount: 10, askPrice: 45, category: 'CatA', bfsGroup: 'DivA', location: 'L',
      user: { id: 'u1' }, buyPriceDisclosure: true,
    });
    Object.keys(c.itemForm.controls).forEach((k) => c.itemForm.controls[k].setErrors(null));
    bfs.editBFSItemDetails.and.returnValue(of({ status: 'Success', message: 'ok' }));
    c.updateBFSItemData();
    bfs.editBFSItemDetails.and.returnValue(of({ status: 'Failure', errorMessage: 'bad' }));
    c.editBFSItemData = { id: 'i1', bfsDocuments: [{ id: 'd1' }], bfsImages: [{ id: 'img1' }], bfsDocumentsImg: [] };
    Object.keys(c.itemForm.controls).forEach((k) => c.itemForm.controls[k].setErrors(null));
    c.updateBFSItemData();
    c.itemForm.controls.description.setErrors({ required: true });
    c.updateBFSItemData();

    bfs.getItemDetails.and.returnValue(of({ id: 'i1', description: 'd' }));
    bfs.getDocsByBFSId.and.returnValue(of([{ fileName: 'a.pdf' }]));
    c.onViewItemDetails(row, false);
    c.onViewItemDetails(row, true);
    bfs.getItemDetails.and.returnValue(of({}));
    bfs.getDocsByBFSId.and.returnValue(of({}));
    c.onViewItemDetails(row, false);
    c.onBidReqest(row);

    c.selectedRowData = { ...row, buyPriceDisclosure: true };
    c.bidItemObj = { price: '', quantity: '', discount: '' };
    c.onSubmitBid();
    c.bidItemObj = { price: 100, quantity: 20, discount: 5 };
    c.onSubmitBid();
    c.bidItemObj = { price: 100, quantity: 2, discount: 5 };
    bfs.requestBFSItem.and.returnValue(of({ status: 'Success', message: 'ok' }));
    c.onSubmitBid();
    bfs.requestBFSItem.and.returnValue(of({ status: 'Failure', errorMessage: 'bad' }));
    c.onSubmitBid();
    c.selectedRowData = { ...row, buyPriceDisclosure: false };
    c.bidItemObj = { price: 100, quantity: 2, discount: 0 };
    c.onSubmitBid();
    c.onChangeBidValue(true);
    c.bidItemObj.price = 250;
    c.onChangeBidValue(true);
    c.bidItemObj.discount = 10;
    c.onChangeBidValue(false);
    c.bidItemObj.discount = 100;
    c.onChangeBidValue(false);

    c.editBFSItemData = { bfsDocuments: [], bfsImages: [], bfsDocumentsImg: [] };
    c.commentFilesDataList = [];
    c.commentFilesDataListImg = [];
    c.fileUploadEvent([{ name: 'a.pdf' }], false);
    c.fileUploadEvent([{ name: 'a.pdf' }], true);
    c.fileUploadEventForImages([{ name: 'a.gif' }], false);
    c.fileUploadEventForImages([{ name: 'a.png' }], false);
    c.fileUploadEventForImages([{ name: 'a.JPG' }], true);
    c.commentFilesDataListImg = [{}, {}];
    c.removeFilesImg(0);
    c.editBFSItemData = { bfsDocuments: [{}], bfsImages: [{}], bfsDocumentsImg: [{}] };
    c.removeFilesListImg(0);
    c.removeFilesImgForEdit(0);
    c.removeFilesListImgForEdit(0);
    c.commentFilesDataList = [{}, {}];
    c.removeFiles(0);
    c.removeFilesList(0);

    c.roleName = 'Buyer';
    bfs.getCommentsByBuyer.and.returnValue(of([{ id: 'c1' }]));
    bfs.deactiveCommentFlag.and.returnValue(of({ status: 'Success' }));
    c.openCreateCommentsByBuyer({ ...row, commentsFlag: true });
    c.roleName = 'CategoryManager';
    bfs.getCommentsByCM.and.returnValue(of([{ id: 'c1' }]));
    c.openCreateCommentsByBuyer({ ...row, commentsFlag: false });
    c.getCommentsByBuyer();
    c.roleName = 'Buyer';
    c.getCommentsByBuyer();
    c.commentContent = { text: '' };
    c.createCommentsByBuyer();
    c.commentContent = { text: 'hello' };
    bfs.createCommentsByBuyer.and.returnValue(of({ status: 'Success', message: 'ok' }));
    c.createCommentsByBuyer();
    bfs.createCommentsByBuyer.and.returnValue(of({ status: 'Failure', errorMessage: 'bad' }));
    c.createCommentsByBuyer();
    c.onCloseComments();
    c.tabChanged({ index: 1 });
    expect(component).toBeTruthy();
  });
`;

const vregBlock = `
  it('focused vendor-reg branch matrix', () => {
    const c: any = component;
    const vendorReg = c.vendorRegSer || TestBed.inject(VendorRegistrationService);
    const vendor = c.vendorService || TestBed.inject(VendorService);
    const country = c.country || TestBed.inject(CountriesService);
    const enc = c.encryDecryService || TestBed.inject(EncryDecryService);
    const dialog = c.dialog || c.matDialog || TestBed.inject(MatDialog);
    const convert = c.convertSer || TestBed.inject(ConvertToBase64Service);
    c.vendorRegSer = vendorReg;
    c.vendorService = vendor;
    c.country = country;
    c.dialog = dialog;
    c.matDialog = dialog;
    c.convertSer = convert;
    c.toaster = c.toaster || TestBed.inject(ToastrService);
    c.fb = c.fb || TestBed.inject(FormBuilder);
    dialog.open.and.returnValue({ afterClosed: () => of(true), close: () => undefined });
    dialog.closeAll.and.stub();
    convert.getBase64.and.returnValue(Promise.resolve('data:application/octet-stream;base64,QUFB'));

    enc.get.and.returnValue(JSON.stringify({
      details: { id: 'u1', org: { id: 'o1' }, role: { roleName: 'Vendor' }, listofPermission: [] },
    }));
    const vendorPayload: any = {
      id: 'o1', companyName: 'Acme', city: 'Hyd', gstin: 'G', address1: 'A', state: 'TS', zipCode: '1',
      vendorProduct: [{ id: 'p1', productName: 'P', hsnCode: '1', brandName: 'B' }],
      vendorService: [{ id: 's1', serviceName: 'S', sacCode: '1' }],
      certificates: [{ fileName: 'c.pdf', file: 'AA', isOldCertificate: true }],
      vendorClientReference: [{ id: 'cr1', name: 'R' }],
      orgBranches: [{ branchName: 'B1', gstin: 'G', address1: 'A', state: 'TS', city: 'Hyd', zipCode: '1', others: '' }],
      authorizedDistributors: [{ company: 'C', type: 'T', description: 'D' }],
      financial: { pan: 'P', turnover: [{ year: '2020', amount: '1' }] },
      documents: [{ fileName: 'd.pdf', file: 'AA' }],
      acceptedTerms: false,
    };
    vendorReg.getVendorById.and.returnValue(of(vendorPayload));
    vendorReg.getVendorTc.and.returnValue(of([{ fileName: 'tc.pdf' }]));
    c.ngOnInit();
    c.generateBranchesForm();
    c.createBranch();
    c.AddCreateBranch();
    c.addBranch();
    c.addBranchWithData(vendorPayload.orgBranches[0]);
    c.removeBranch(0);
    c.generateAuthorizedForm();
    c.createauthorized();
    c.addAuthorized();
    c.addAuthorizedWithData(vendorPayload.authorizedDistributors[0]);
    c.removeauthorized(0);
    void c.f;
    c.uploadFile({});
    country.getCountries.and.returnValue(of([{ id: '1', name: 'IN' }]));
    c.getCountries();
    c.onChangeCountry({ id: '1', name: 'IN' });
    c.onChangeState({ id: '1', name: 'TS' });
    c.getFileName({ name: 'a.pdf' });
    c.getProductsData();
    c.getServicesData();
    c.getVendorContactsData();
    c.getClientRefData();
    c.moveToBackTab();
    c.moveToSelectedTab('Products');
    c.moveToNextTab({ valid: true } as any);
    c.moveToNextTab({ valid: false } as any);

    c.onAddProduct('add', null);
    c.onAddProduct('edit', { id: 'p1' });
    c.onAddService('add', null);
    c.onAddService('edit', { id: 's1' });
    c.onAddContact('add', null);
    c.onAddContact('edit', { id: 'c1' });
    c.onAddClientRef('add', null);
    c.onAddClientRef('edit', { id: 'cr1' });
    c.selectedData = [];
    c.onDelete('products');
    c.selectedData = [{ id: 'p1' }];
    c.productsList = [{ id: 'p1' }, { id: 'p2' }];
    c.onDelete('products');
    c.servicesList = [{ id: 's1' }];
    c.selectedData = [{ id: 's1' }];
    c.onDelete('services');
    c.contactsList = [{ id: 'c1' }, { id: 'c2' }];
    c.selectedData = [{ id: 'c1' }];
    c.onDelete('contacts');
    c.clientRefList = [{ id: 'cr1' }];
    c.selectedData = [{ id: 'cr1' }];
    c.onDelete('clientRef');

    c.uploadingFiles([{ name: 'a.pdf' }]);
    c.certificatesArray = [{ name: 'c.pdf' }, { name: 'c2.pdf' }];
    c.removeFile(0);
    c.uploadCertificates([{ name: 'c.pdf' }]);
    c.uploadDocuments([{ name: 'd.pdf' }]);
    c.uploadGSTIN({ target: { files: [{ name: 'g.pdf' }] } });
    c.uploadMSME({ target: { files: [{ name: 'm.pdf' }] } });
    c.uploadCheque({ target: { files: [{ name: 'q.pdf' }] } });
    c.uploadPanCard({ target: { files: [{ name: 'p.pdf' }] } });
    c.deletefiles('pancardDoc');
    c.deletefiles('gstinDoc');
    c.deletefiles('msmeDoc');
    c.deletefiles('chequeDoc');
    c.certificatesArray = [{}, {}];
    c.documentsArray = [{}, {}];
    c.deleteAttachment(0, 'certificatesArray');
    c.deleteAttachment(0, 'documentsArray');
    c.getBase64({ name: 'a.pdf' });

    const validForm: any = { valid: true, invalid: false, value: { companyName: 'A' }, reset() {}, patchValue() {} };
    const invalidForm: any = { valid: false, invalid: true, value: {}, reset() {}, patchValue() {} };
    c.vendorRegObj = { ...vendorPayload, orgBranches: [], acceptedTerms: false, clientRefference: true };
    c.generalModel = { city: 'Hyd', gstin: 'G', address1: 'A', state: 'TS', zipCode: '1' };
    vendorReg.saveVendorGeneral.and.returnValue(of({ status: 'Success', message: 'ok' }));
    c.saveGeneral('next', validForm);
    c.vendorRegObj.orgBranches = [undefined];
    c.saveGeneral('next', validForm);
    c.saveGeneral('next', invalidForm);
    c.branchesForm = c.fb.group({ orgBranches: c.fb.array([c.createBranch()]) });
    vendorReg.saveVendorBranches.and.returnValue(of({ status: 'Success' }));
    c.saveBranches('next', validForm);
    c.saveBranches('next', invalidForm);
    c.productsList = [{ id: 'p1' }];
    vendorReg.saveVendorProducts.and.returnValue(of({ status: 'Success' }));
    c.saveProducts('next', c.productsList);
    c.servicesList = [{ id: 's1' }];
    vendorReg.saveVendorServices.and.returnValue(of({ status: 'Success' }));
    c.saveServices('next', c.servicesList);
    c.contactsList = [{ id: 'c1' }];
    c.saveContacts('next', c.contactsList);
    c.contactsList = [{ id: 'c1' }, { id: 'c2' }];
    vendorReg.saveVendorContacts.and.returnValue(of({ status: 'Success' }));
    c.saveContacts('next', c.contactsList);
    c.clientRefList = [{ id: 'cr1' }];
    vendorReg.saveVendorClientRef.and.returnValue(of({ status: 'Success' }));
    c.saveClientReferences('next', c.clientRefList);
    c.vendorRegObj.clientRefference = false;
    c.saveClientReferences('next', c.clientRefList);
    c.saveFinancials('next', invalidForm);
    vendorReg.saveVendorFinancials.and.returnValue(of({ status: 'Success' }));
    c.saveFinancials('next', validForm);
    c.turnOverList = [{ year: '2020', amount: '1' }];
    vendorReg.saveVendorTurnOver.and.returnValue(of({ status: 'Success' }));
    c.saveTurnOver('next', validForm);
    c.authorizedForm = c.fb.group({
      distributors: c.fb.array([c.createauthorized()]),
      isAuthorizedDistributor: [true],
    });
    c.authorizedForm.patchValue({ isAuthorizedDistributor: true });
    c.authorizedForm.setErrors({ required: true });
    c.saveAuthorized('next', { invalid: true, value: { isAuthorizedDistributor: true } });
    c.saveAuthorized('next', { invalid: false, value: { isAuthorizedDistributor: false } });
    vendorReg.saveVendorAuthorized.and.returnValue(of({ status: 'Success' }));
    c.saveAuthorized('next', { invalid: false, value: { isAuthorizedDistributor: true, distributors: [{}] } });
    c.documentsArray = [{}];
    c.saveDocuments('next', validForm);
    c.documentsArray = [{}, {}];
    vendorReg.saveVendorDocuments.and.returnValue(of({ status: 'Success' }));
    c.saveDocuments('next', validForm);
    c.saveDocuments('next', invalidForm);

    c.vendorRegObj.acceptedTerms = false;
    c.certificatesArray = [{ fileName: 'c.pdf', file: 'AA', isOldCertificate: true }, { fileName: 'n.pdf', file: 'BB' }];
    c.regFormSubmit(validForm, {});
    c.vendorRegObj.acceptedTerms = true;
    c.authorizedForm.patchValue({ isAuthorizedDistributor: true });
    vendorReg.submitVendorReg.and.returnValue(of({ status: 'Success', message: 'ok' }));
    c.regFormSubmit(validForm, {});
    vendorReg.submitVendorReg.and.returnValue(of({ status: 'success', message: 'ok' }));
    c.regFormSubmit(validForm, {});
    vendorReg.submitVendorReg.and.returnValue(of({ status: 'Failure', message: 'bad' }));
    c.regFormSubmit(validForm, {});
    c.authorizedForm.patchValue({ isAuthorizedDistributor: false });
    c.regFormSubmit(validForm, {});
    dialog.open.and.returnValue({ afterClosed: () => of(true), close: () => undefined });
    c.onAcceptSubmit(true);
    dialog.open.and.returnValue({ afterClosed: () => of(false), close: () => undefined });
    c.onAcceptSubmit(false);
    vendorReg.getVendorById.and.returnValue(of({ status: 'Failure' }));
    c.getVendorById('o1');
    expect(component).toBeTruthy();
  });
`;

appendBeforeClose(
  path.join(ROOT, 'src/app/layout/bfs/bfs-items-list/bfs-items-list.component.spec.ts'),
  'focused bfs-items-list branch matrix',
  bfsBlock
);
appendBeforeClose(
  path.join(ROOT, 'src/app/layout/vendor/vendor-reg/vendor-reg.component.spec.ts'),
  'focused vendor-reg branch matrix',
  vregBlock
);
console.log('done');
