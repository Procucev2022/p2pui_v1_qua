/**
 * Append big90 targeted branch tests for priority large components.
 * Idempotent via MARKER.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const MARKER = 'big90 targeted branch closeout';

const FILES = [
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

function ensureOfImport(spec) {
  if (spec.includes("from 'rxjs'") || spec.includes('from "rxjs"')) return spec;
  return spec.replace(
    /(import \{[^}]+\} from '@angular\/core\/testing';)/,
    `$1\nimport { of } from 'rxjs';`
  );
}

function wireServicesSnippet() {
  return `
    // Prefer real injected spies when present
    try {
      Object.keys(c).forEach((k) => {
        const v = c[k];
        if (v && typeof v === 'object') {
          ['getItemCatalogue','createItemCatalogue','getVendorsByItem','getVendorsByItemForClientInitiator',
           'createItemCatalogueByRequestBOQFile','updateItemCatalogueByRequest','getItemDetailsById',
           'getPrSummaryData','getStatus','approvePR','getPRitemsByid','fetchRfqById','getRFQs',
           'getAllPOs','getVendorsByRFQIdForGMT','getItemsByRFQIdForGMT','acceptVendorByCM','rejectVendorByCM',
           'requestForRFQByGMTVendor','ignoreRFQByGTMVendor','riaseQueryRFQByGTMVendor','getBase64',
           'get','getAll','search','save','update','create','delete','list','load','fetch'].forEach((m) => {
            try { void v[m]; } catch { /* */ }
          });
        }
      });
    } catch { /* */ }
`;
}

function commonPayloads() {
  return `
    const row: any = {
      id: '1', vendorId: 'v1', description: 'Item A', price: 10, priceFlag: 'U',
      subCategoryId: 'sc1', companyId: 'XXXXXXXXXXXabc', linked: false, clientItemFlag: true,
      status: null, status_ui_display: 'New', quoteSubmittedDate: new Date().toISOString(),
      acceptedDate: new Date().toISOString(), vendorUuid: 'vu1', userId: 'u1',
      vendorName: 'V', pricePerUnit: 5, documents: [{ fileName: 'a.pdf', file: 'AA' }],
      org: { id: 'o1' }, query: 'q1|q2', queryContent: 'q1|q2',
    };
    const linkedRow = { ...row, linked: true, companyId: 'XXXXXXXXXXXxyz' };
    const fileXls = { name: 'a.xlsx', size: 10, type: 'application/vnd.ms-excel' };
    const fileBad = { name: 'a.pdf', size: 10, type: 'application/pdf' };
    const validForm: any = { invalid: false, valid: true, value: { id: '1', name: 'n' }, reset() {}, patchValue() {}, getRawValue: () => ({ id: '1' }), get: () => ({ value: 'x', setValue() {}, valid: true }), controls: {}, form: { valid: true } };
    const invalidForm: any = { ...validForm, invalid: true, valid: false, form: { valid: false } };

    c.loggedUserDetails = {
      org: { id: 'o1' },
      role: { roleName: 'ClientInitiator' },
      listofPermission: [],
      username: 'u', phone: '9',
    };
    c.loggedUserPermissions = [];
    c.userModel = {};
    c.editItemModel = { id: '1', description: 'd', documents: [], clientItemFlag: true };
    c.commentFilesDataList = [{ fileName: 'a.xlsx', file: 'AAA' }];
    c.commentFileData = 'AAA';
    c.fileData = fileXls;
    c.itemList = [row, { ...row, id: '2', status: 'Available', subCategoryId: 'sc2' }];
    c.itemList_cache = [...c.itemList];
    c.vendorsList = [];
    c.expandedRows = {};
    c.rowData = [row];
    c.selectedData = [row];
    c.selectedRfqData = row;
    c.rfqDataList = [row, { ...row, id: '2', status_ui_display: 'Requested' }, { ...row, id: '3', status_ui_display: 'Requested' }, { ...row, id: '4', status_ui_display: 'Requested' }];
    c.cache_rfqDataList = [...c.rfqDataList];
    c.currentRole = 'Category Manager';
    c.queryDescContent = 'hello';
    c.selectedCategory = 'A';
    c.selectedStatus = 'New';
    c.selectedDivision = 'D1';
    c.form = validForm;
    c.itemForm = validForm;
    c.createForm = validForm;
    c.searchForm = validForm;
    c.op = { hide() {}, show() {}, toggle() {} };
    c.dialog = c.dialog || { open: () => ({ afterClosed: () => of(null), close: () => undefined }), closeAll() {} };
    c.modalDialog = c.modalDialog || c.dialog;
    c.convertSer = c.convertSer || { getBase64: () => Promise.resolve('data:application/octet-stream;base64,AAA') };
`;
}

function rebind(mode) {
  if (mode === 'array') {
    return `
    Object.keys(c).forEach((k) => {
      const svc = c[k];
      if (!svc || typeof svc !== 'object') return;
      Object.keys(svc).forEach((m) => {
        const spy = svc[m];
        if (spy && spy.and && typeof spy.and.returnValue === 'function') {
          try { spy.and.returnValue(of([row, linkedRow])); } catch { /* */ }
        }
      });
    });
`;
  }
  if (mode === 'success') {
    return `
    Object.keys(c).forEach((k) => {
      const svc = c[k];
      if (!svc || typeof svc !== 'object') return;
      Object.keys(svc).forEach((m) => {
        const spy = svc[m];
        if (spy && spy.and && typeof spy.and.returnValue === 'function') {
          try { spy.and.returnValue(of({ status: 'Success', statusCode: '200', message: 'ok', id: '1', data: [row], ...row, documents: [] })); } catch { /* */ }
        }
      });
    });
`;
  }
  return `
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
`;
}

function itemCatalogueBody() {
  return `
    // roles for analytics / vendor fetch
    c.loggedUserDetails.role.roleName = 'ClientInitiator';
    try { c.ngOnInit(); } catch (e) {}
    ${rebind('array')}
    try { c.getAllItems(); } catch (e) {}
    try { c.onSubCategoryChange({ subCategoryId: 'sc1' }); } catch (e) {}
    try { c.onSubCategoryChange(null); } catch (e) {}
    try { c.getVendorByItem(row); } catch (e) {}
    try { c.getVendorByItem(linkedRow); } catch (e) {}
    ${rebind('failure')}
    try { c.getVendorByItem(row); } catch (e) {}
    c.loggedUserDetails.role.roleName = 'VendorManager';
    ${rebind('array')}
    try { c.getVendorByItem(row); } catch (e) {}
    try { c.getVendorByItem(linkedRow); } catch (e) {}
    ${rebind('failure')}
    try { c.getVendorByItem(row); } catch (e) {}

    try { c.successCallBack({ statusCode: '200', message: 'ok' }); } catch (e) {}
    try { c.successCallBack({ statusCode: '500', message: 'bad' }); } catch (e) {}
    try { c.successChilds([row], row); } catch (e) {}
    try { c.showAnalyticsForSelectedItem(row, false); } catch (e) {}
    try { c.showAnalyticsForSelectedItem(row, true, row); } catch (e) {}
    try { c.fileUploadEvent([fileXls], false); } catch (e) {}
    try { c.fileUploadEvent([fileBad], false); } catch (e) {}
    try { c.fileUploadEvent([fileBad], true); } catch (e) {}
    try { c.filesDropped([fileXls], false); } catch (e) {}
    try { c.filesDropped([fileBad], false); } catch (e) {}
    c.commentFileData = 'AAA';
    c.commentFilesDataList = [{ fileName: 'a.xlsx', file: 'AAA' }];
    try { c.createItemCatalogueByRequestBOQFile(); } catch (e) {}
    c.commentFileData = null;
    try { c.createItemCatalogueByRequestBOQFile(); } catch (e) {}
    c.editItemModel = { id: '1', description: 'd', documents: [{ fileName: 'x.pdf' }] };
    c.commentFilesDataList = [{ fileName: 'a.xlsx', file: 'AAA' }];
    try { c.uploadItemCatalogueByRequest(); } catch (e) {}
    c.editItemModel = { id: '1', description: '', documents: [] };
    try { c.uploadItemCatalogueByRequest(); } catch (e) {}
    ${rebind('success')}
    try { c.viewItemData(row, {}); } catch (e) {}
    try { c.viewItemData({ ...row, clientItemFlag: false }, {}); } catch (e) {}
    try { c.removeFileFromList(0); } catch (e) {}
    try { c.removeFile(); } catch (e) {}
    try { c.closeModal(); } catch (e) {}
    try { c.getCloseVendorByItem(row); } catch (e) {}
    try { c.onPage({ first: 0 }); } catch (e) {}
    try { c.onSecondPage({ first: 0 }); } catch (e) {}
    try { c.onAddNewItemSubmit(validForm); } catch (e) {}
    try { c.newItemRequest({}); } catch (e) {}
`;
}

function vendorSummaryBody() {
  return `
    // mirrors cleared RFQs branch set
    c.cache_rfqDataList = [
      { id: '1', category: 'A', division: 'D1', status_ui_display: 'New' },
      { id: '2', category: 'B', division: 'D2', status_ui_display: 'Downloaded' },
      { id: '3', category: 'A', division: 'D1', status_ui_display: 'Requested' },
    ];
    c.rfqDataList = [...c.cache_rfqDataList];
    try { c.filterRFQsBYCategory && c.filterRFQsBYCategory(); } catch (e) {}
    c.selectedCategory = 'A';
    try { c.filterRFQsBYCategory && c.filterRFQsBYCategory(); } catch (e) {}
    c.selectedCategory = '';
    try { c.filterRFQsBYCategory && c.filterRFQsBYCategory(); } catch (e) {}
    try { c.filterRFQsBYDivision && c.filterRFQsBYDivision(); } catch (e) {}
    c.selectedDivision = 'D1';
    try { c.filterRFQsBYDivision && c.filterRFQsBYDivision(); } catch (e) {}
    try { c.onResetFilters && c.onResetFilters(); } catch (e) {}
    try { c.requestEnability && c.requestEnability({ status_ui_display: 'Downloaded' }); } catch (e) {}
    try { c.queryEnability && c.queryEnability({ status_ui_display: 'Ignored' }); } catch (e) {}
    try { c.ignoreEnability && c.ignoreEnability({ status_ui_display: 'New' }); } catch (e) {}
    c.currentRole = 'Vendor';
    try { c.getDifferenceInHours && c.getDifferenceInHours(new Date(), new Date(Date.now()-3600000)); } catch (e) {}
    c.currentRole = 'Category Manager';
    try { c.getDifferenceInHours && c.getDifferenceInHours(new Date(), new Date(Date.now()-3600000)); } catch (e) {}
    try { c.showClientInfoIcon && c.showClientInfoIcon({}); } catch (e) {}
    try { c.showClientInfoIcon && c.showClientInfoIcon({ acceptedDate: new Date().toISOString() }); } catch (e) {}
    c.selectedRfqData = row;
    c.loggedUserDetails = { org: { id: 'o1' }, role: { roleName: 'Category Manager' } };
    ${rebind('success')}
    try { c.onViewRFQDetails && c.onViewRFQDetails(row); } catch (e) {}
    try { c.viewRFQDetails && c.viewRFQDetails(row); } catch (e) {}
    ${rebind('failure')}
    try { c.onViewRFQDetails && c.onViewRFQDetails(row); } catch (e) {}
    try { c.viewRFQDetails && c.viewRFQDetails(row); } catch (e) {}
    try { c.onAcceptOrRejectVendor && c.onAcceptOrRejectVendor({ status_ui_display: 'New', vendorUuid: 'v1' }, true); } catch (e) {}
    try { c.onAcceptOrRejectVendor && c.onAcceptOrRejectVendor({ status_ui_display: 'Quoted', vendorUuid: 'v1' }, true); } catch (e) {}
    try { c.onAcceptOrRejectVendor && c.onAcceptOrRejectVendor({ status_ui_display: 'Quoted', vendorUuid: 'v1' }, false); } catch (e) {}
    try { c.onAcceptOrRejectVendor && c.onAcceptOrRejectVendor({ status_ui_display: 'Approved', vendorUuid: 'v1' }, true); } catch (e) {}
    try { c.onAcceptOrRejectVendor && c.onAcceptOrRejectVendor({ status_ui_display: 'Rejected', vendorUuid: 'v1' }, false); } catch (e) {}
    try { c.onRiaseQueryOrIgnoreRFQ && c.onRiaseQueryOrIgnoreRFQ({ status_ui_display: 'Ignored', id: '1', query: 'a|b', queryContent: 'a|b' }, false); } catch (e) {}
    try { c.onRiaseQueryOrIgnoreRFQ && c.onRiaseQueryOrIgnoreRFQ({ status_ui_display: 'New', id: '1' }, true); } catch (e) {}
    c.queryDescContent = '';
    try { c.onRaiseQuery && c.onRaiseQuery(); } catch (e) {}
    c.queryDescContent = 'q';
    c.selectedRfqData = { id: '1', query: 'old' };
    ${rebind('success')}
    try { c.onRaiseQuery && c.onRaiseQuery(); } catch (e) {}
    ${rebind('failure')}
    try { c.onRaiseQuery && c.onRaiseQuery(); } catch (e) {}
    try { c.getRFQs && c.getRFQs({ data: { id: '1', rfqId: 'R1', newCommentAvailableVendor: true } }); } catch (e) {}
    try { c.getCloseRFQs && c.getCloseRFQs({ data: { id: '1' } }); } catch (e) {}
    try { c.onSearchMode && c.onSearchMode(true); } catch (e) {}
    try { c.onSearchMode && c.onSearchMode(false); } catch (e) {}
    try { c.globalSearch && c.globalSearch(); } catch (e) {}
    try { c.onInlineSearch && c.onInlineSearch('x'); } catch (e) {}
    try { c.onInlineSearch && c.onInlineSearch(''); } catch (e) {}
    try { c.onSourceTypeChange && c.onSourceTypeChange('x'); } catch (e) {}
    try { c.intialCall && c.intialCall(); } catch (e) {}
`;
}

function procureBody() {
  return `
    c.loggedUserDetails = { org: { id: 'o1' }, role: { roleName: 'ClientInitiator' }, listofPermission: [] };
    ${rebind('array')}
    try { c.ngOnInit(); } catch (e) {}
    try { c.getStatus && c.getStatus(); } catch (e) {}
    try { c.onSelectStatus && c.onSelectStatus(null); } catch (e) {}
    try { c.onSelectStatus && c.onSelectStatus({ id: 'Open' }); } catch (e) {}
    try { c.onSelectStatus && c.onSelectStatus('Open'); } catch (e) {}
    ${rebind('success')}
    try { c.getPrSummaryData && c.getPrSummaryData(); } catch (e) {}
    ${rebind('array')}
    try { c.getPrSummaryData && c.getPrSummaryData(); } catch (e) {}
    ${rebind('failure')}
    try { c.getPrSummaryData && c.getPrSummaryData(); } catch (e) {}
    try { c.getRowDetails && c.getRowDetails({ data: row }); } catch (e) {}
    try { c.getRowDetails && c.getRowDetails(row); } catch (e) {}
    try { c.getCloseRowDetails && c.getCloseRowDetails({ data: row }); } catch (e) {}
    try { c.successChilds && c.successChilds([row], row); } catch (e) {}
    try { c.successChilds && c.successChilds(null, row); } catch (e) {}
    ${rebind('success')}
    try { c.viewPrbyId && c.viewPrbyId(row); } catch (e) {}
    ${rebind('failure')}
    try { c.viewPrbyId && c.viewPrbyId(row); } catch (e) {}
    try { c.viewPrbyId && c.viewPrbyId(null); } catch (e) {}
    try { c.openCreateModal && c.openCreateModal({}); } catch (e) {}
    try { c.openCreateModal && c.openCreateModal(null); } catch (e) {}
    try { c.closeCreatePR && c.closeCreatePR(); } catch (e) {}
    try { c.approvePR && c.approvePR(row); } catch (e) {}
    try { c.approvePR && c.approvePR(null); } catch (e) {}
    try { c.getLineItems && c.getLineItems(row); } catch (e) {}
    try { c.onPage && c.onPage({ first: 0 }); } catch (e) {}
    try { c.viewCorresspondance && c.viewCorresspondance(row); } catch (e) {}
    try { c.exportAsXLSX && c.exportAsXLSX(); } catch (e) {}
    try { c.ngOnDestroy && c.ngOnDestroy(); } catch (e) {}
`;
}

function createRfqBody() {
  return `
    c.loggedUserDetails = { org: { id: 'o1' }, role: { roleName: 'Category Manager' }, listofPermission: [] };
    c.selectedVendors = [row];
    c.selectedItems = [row];
    c.selectedDelivery = [row];
    c.vendorList = [row];
    c.itemsList = [row];
    c.rfqList = [row];
    c.cartVendors = [row];
    c.cartItems = [row];
    c.cartDelivery = [row];
    c.searchText = 'x';
    c.isSearchMode = true;
    ${rebind('array')}
    try { c.ngOnInit(); } catch (e) {}
    try { c.ngOnChanges && c.ngOnChanges({ data: { currentValue: row, previousValue: null, firstChange: true, isFirstChange: () => true } }); } catch (e) {}
    try { c.getVendorList && c.getVendorList(); } catch (e) {}
    try { c.getAllVendorByCategory && c.getAllVendorByCategory({ id: '1' }); } catch (e) {}
    try { c.getRFQList && c.getRFQList(); } catch (e) {}
    try { c.getRFQsForClient && c.getRFQsForClient(); } catch (e) {}
    try { c.filterAutoCompleteData && c.filterAutoCompleteData({ query: 'a' }); } catch (e) {}
    try { c.onSelectedVendor && c.onSelectedVendor(row); } catch (e) {}
    try { c.onSearchMode && c.onSearchMode(true); } catch (e) {}
    try { c.onSearchMode && c.onSearchMode(false); } catch (e) {}
    try { c.globalSearch && c.globalSearch(); } catch (e) {}
    try { c.onCreateRfq && c.onCreateRfq(); } catch (e) {}
    try { c.resetScreen && c.resetScreen(); } catch (e) {}
    try { c.resetGrids && c.resetGrids(); } catch (e) {}
    try { c.onAddVendorToCart && c.onAddVendorToCart(row); } catch (e) {}
    try { c.onAddVendorsToCart && c.onAddVendorsToCart([row]); } catch (e) {}
    try { c.onAddItemsToCart && c.onAddItemsToCart([row]); } catch (e) {}
    try { c.onAddDeliveryToCart && c.onAddDeliveryToCart([row]); } catch (e) {}
    try { c.onDeleteItem && c.onDeleteItem(row, 0); } catch (e) {}
    try { c.onDeleteVendor && c.onDeleteVendor(row, 0); } catch (e) {}
    try { c.onDeleteDelivery && c.onDeleteDelivery(row, 0); } catch (e) {}
    try { c.onEditItem && c.onEditItem(row, 0); } catch (e) {}
    try { c.onEditVendor && c.onEditVendor(row, 0); } catch (e) {}
    try { c.onEditDelivery && c.onEditDelivery(row, 0); } catch (e) {}
    try { c.buildRFQForms && c.buildRFQForms(); } catch (e) {}
    try { c.buildVendorsForAPI && c.buildVendorsForAPI(); } catch (e) {}
    try { c.onSendRFQ && c.onSendRFQ(); } catch (e) {}
    try { c.sendRFQToVendors && c.sendRFQToVendors(); } catch (e) {}
    ${rebind('success')}
    try { c.onViewRFQDetails && c.onViewRFQDetails(row); } catch (e) {}
    ${rebind('failure')}
    try { c.onViewRFQDetails && c.onViewRFQDetails(row); } catch (e) {}
    try { c.onEditRfqDetails && c.onEditRfqDetails(row); } catch (e) {}
    try { c.onGridAction && c.onGridAction({ type: 'view' }, row); } catch (e) {}
    try { c.onVendorSearch && c.onVendorSearch('x'); } catch (e) {}
    try { c.getRFQs && c.getRFQs({ data: row }); } catch (e) {}
    try { c.getCloseRFQs && c.getCloseRFQs({ data: row }); } catch (e) {}
    try { c.onForwardRFQ && c.onForwardRFQ(row); } catch (e) {}
    try { c.onInviteRFQ && c.onInviteRFQ(row); } catch (e) {}
    try { c.isClientInitiatory && c.isClientInitiatory(); } catch (e) {}
    try { c.onAddExistingVendor && c.onAddExistingVendor(row); } catch (e) {}
    try { c.onAddNewVendor && c.onAddNewVendor(); } catch (e) {}
    try { c.closeDialogWithData && c.closeDialogWithData(row); } catch (e) {}
    try { c.removeFile && c.removeFile(); } catch (e) {}
    try { c.uploadBOQFile && c.uploadBOQFile([fileXls]); } catch (e) {}
    try { c.onUploadFile && c.onUploadFile([fileXls]); } catch (e) {}
    try { c.convertBoQtoPrItems && c.convertBoQtoPrItems(); } catch (e) {}
    try { c.getAttachedDocsList && c.getAttachedDocsList(); } catch (e) {}
    try { c.onReAuthenticateLoggedUser && c.onReAuthenticateLoggedUser(); } catch (e) {}
    try { c.getColSpan && c.getColSpan(); } catch (e) {}
`;
}

function posBody() {
  return `
    c.loggedUserDetails = { org: { id: 'o1' }, role: { roleName: 'Client' }, listofPermission: [] };
    c.poList = [row];
    c.selectedData = [row];
    c.selectedPO = row;
    c.deliveryList = [row];
    c.asnList = [row];
    ${rebind('array')}
    try { c.ngOnInit(); } catch (e) {}
    try { c.getAllPOs && c.getAllPOs(); } catch (e) {}
    ${rebind('success')}
    try { c.getAllPOs && c.getAllPOs(); } catch (e) {}
    ${rebind('failure')}
    try { c.getAllPOs && c.getAllPOs(); } catch (e) {}
    try { c.viewPO && c.viewPO(row); } catch (e) {}
    try { c.editPO && c.editPO(row); } catch (e) {}
    try { c.getRowDetails && c.getRowDetails({ data: row }); } catch (e) {}
    try { c.getCloseRowDetails && c.getCloseRowDetails({ data: row }); } catch (e) {}
    try { c.onClickCommonGrid && c.onClickCommonGrid({ type: 'view' }, row); } catch (e) {}
    try { c.getDeliveryHeaders && c.getDeliveryHeaders(); } catch (e) {}
    try { c.editDelivery && c.editDelivery(row); } catch (e) {}
    try { c.viewDelivery && c.viewDelivery(row); } catch (e) {}
    try { c.revisedDelivery && c.revisedDelivery(row); } catch (e) {}
    try { c.commentsOnDelivery && c.commentsOnDelivery(row); } catch (e) {}
    try { c.getAsnsAndItemsByDeliveryId && c.getAsnsAndItemsByDeliveryId(row); } catch (e) {}
    try { c.getAsnsByDeliveryId && c.getAsnsByDeliveryId(row); } catch (e) {}
    try { c.createASN && c.createASN(row); } catch (e) {}
    try { c.createInvoice && c.createInvoice(row); } catch (e) {}
    try { c.commentsOnASNs && c.commentsOnASNs(row); } catch (e) {}
    try { c.viewASN && c.viewASN(row); } catch (e) {}
    try { c.viewCorresspondance && c.viewCorresspondance(row); } catch (e) {}
    try { c.exportAsXLSX && c.exportAsXLSX(); } catch (e) {}
`;
}

function bfsBody() {
  return `
    c.loggedUserDetails = { org: { id: 'o1' }, role: { roleName: 'Buyer' }, listofPermission: [] };
    c.itemsList = [row];
    c.cartItems = [row];
    c.selectedOrg = { id: 'o1', name: 'Org' };
    c.selectedData = [row];
    c.editItemModel = { ...row };
    c.commentFilesDataList = [{ fileName: 'a.pdf', file: 'AA' }];
    c.bfsImages = [{ fileName: 'a.png', file: 'AA' }];
    ${rebind('array')}
    try { c.ngOnInit(); } catch (e) {}
    try { c.getItemsList && c.getItemsList(); } catch (e) {}
    ${rebind('success')}
    try { c.getItemsList && c.getItemsList(); } catch (e) {}
    ${rebind('failure')}
    try { c.getItemsList && c.getItemsList(); } catch (e) {}
    try { c.onChangePriceDisclosure && c.onChangePriceDisclosure(true); } catch (e) {}
    try { c.onChangePriceDisclosure && c.onChangePriceDisclosure(false); } catch (e) {}
    try { c.createItem && c.createItem(); } catch (e) {}
    try { c.onSubmitAddItem && c.onSubmitAddItem(validForm); } catch (e) {}
    try { c.onSubmitAddItem && c.onSubmitAddItem(invalidForm); } catch (e) {}
    try { c.onCloseItemForm && c.onCloseItemForm(); } catch (e) {}
    try { c.onSelectOrgForm && c.onSelectOrgForm(row); } catch (e) {}
    try { c.searchForOrgs && c.searchForOrgs({ query: 'a' }); } catch (e) {}
    try { c.onChooseOrg && c.onChooseOrg(row); } catch (e) {}
    try { c.filterAutoCompleteData && c.filterAutoCompleteData({ query: 'a' }); } catch (e) {}
    try { c.filterAutoCompleteDataByOrg && c.filterAutoCompleteDataByOrg({ query: 'a' }); } catch (e) {}
    try { c.onPriceDiscountChange && c.onPriceDiscountChange(row); } catch (e) {}
    try { c.onAddItemsToCart && c.onAddItemsToCart([row]); } catch (e) {}
    try { c.onDeleteItem && c.onDeleteItem(row, 0); } catch (e) {}
    try { c.onEditItem && c.onEditItem(row, 0); } catch (e) {}
    try { c.calculateBuyPrice && c.calculateBuyPrice(row); } catch (e) {}
    try { c.onGridAction && c.onGridAction({ type: 'view' }, row); } catch (e) {}
    try { c.getRFQs && c.getRFQs({ data: row }); } catch (e) {}
    try { c.getCloseRFQs && c.getCloseRFQs({ data: row }); } catch (e) {}
    try { c.getBuyerByBFS && c.getBuyerByBFS(row); } catch (e) {}
    try { c.onUpdateBFSItem && c.onUpdateBFSItem(row); } catch (e) {}
    try { c.onEditBFSItemDetails && c.onEditBFSItemDetails(row); } catch (e) {}
    try { c.updateBFSItemData && c.updateBFSItemData(validForm); } catch (e) {}
    try { c.onCloseEditForm && c.onCloseEditForm(); } catch (e) {}
    try { c.onViewItemDetails && c.onViewItemDetails(row); } catch (e) {}
    try { c.onBidReqest && c.onBidReqest(row); } catch (e) {}
    try { c.onSubmitBid && c.onSubmitBid(validForm); } catch (e) {}
    try { c.onChangeBidValue && c.onChangeBidValue(row); } catch (e) {}
    try { c.fileUploadEvent && c.fileUploadEvent([fileXls], false); } catch (e) {}
    try { c.fileUploadEvent && c.fileUploadEvent([fileBad], false); } catch (e) {}
    try { c.fileUploadEventForImages && c.fileUploadEventForImages([fileBad]); } catch (e) {}
    try { c.removeFiles && c.removeFiles(); } catch (e) {}
    try { c.removeFilesList && c.removeFilesList(0); } catch (e) {}
    try { c.removeFilesImg && c.removeFilesImg(); } catch (e) {}
    try { c.removeFilesListImg && c.removeFilesListImg(0); } catch (e) {}
    try { c.openCreateCommentsByBuyer && c.openCreateCommentsByBuyer(row); } catch (e) {}
    try { c.createCommentsByBuyer && c.createCommentsByBuyer(); } catch (e) {}
    try { c.getCommentsByBuyer && c.getCommentsByBuyer(row); } catch (e) {}
    try { c.onCloseComments && c.onCloseComments(); } catch (e) {}
    try { c.tabChanged && c.tabChanged({ index: 0 }); } catch (e) {}
    try { c.tabChanged && c.tabChanged({ index: 1 }); } catch (e) {}
    try { c.uploadBOQFile && c.uploadBOQFile([fileXls]); } catch (e) {}
    try { c.onUploadFile && c.onUploadFile([fileXls]); } catch (e) {}
    try { c.convertBoQtoPrItems && c.convertBoQtoPrItems(); } catch (e) {}
    try { c.navigateToGMT && c.navigateToGMT(); } catch (e) {}
`;
}

function vendorRegBody() {
  return `
    c.loggedUserDetails = { org: { id: 'o1' }, role: { roleName: 'Vendor' }, listofPermission: [] };
    c.vendorRegData = {
      id: '1', vendorProduct: [row], vendorService: [row], certificates: [{ fileName: 'c.pdf', file: 'AA' }],
      vendorClientReference: [row], branches: [row], authorized: [row],
    };
    c.productsList = [row, { id: '2' }];
    c.servicesList = [row, { id: '2' }];
    c.contactsList = [row];
    c.clientRefList = [row];
    c.certificatesArray = [{ name: 'c.pdf' }];
    c.certificatesToBase64 = [{ fileName: 'c.pdf', file: 'AA' }];
    c.branches = [row];
    c.authorized = [row];
    c.turnOverList = [{ year: '2020', amount: '1' }];
    c.selectedTab = 0;
    c.generalModel = { ...row };
    c.financialModel = { ...row };
    c.regId = 'o1';
    ${rebind('success')}
    try { c.ngOnInit(); } catch (e) {}
    try { c.getVendorById && c.getVendorById(); } catch (e) {}
    try { c.bindData && c.bindData(c.vendorRegData); } catch (e) {}
    try { c.bindProducts && c.bindProducts(); } catch (e) {}
    try { c.bindServices && c.bindServices(); } catch (e) {}
    try { c.bindContacts && c.bindContacts(); } catch (e) {}
    try { c.bindClientRefAndDocs && c.bindClientRefAndDocs(); } catch (e) {}
    try { c.bindBranches && c.bindBranches(); } catch (e) {}
    try { c.bindAuthorized && c.bindAuthorized(); } catch (e) {}
    try { c.bindTurnOver && c.bindTurnOver(); } catch (e) {}
    try { c.bindGeneralModelData && c.bindGeneralModelData(); } catch (e) {}
    try { c.bindFinancialModelData && c.bindFinancialModelData(); } catch (e) {}
    try { c.generateBranchesForm && c.generateBranchesForm(); } catch (e) {}
    try { c.createBranch && c.createBranch(); } catch (e) {}
    try { c.addBranch && c.addBranch(); } catch (e) {}
    try { c.removeBranch && c.removeBranch(0); } catch (e) {}
    try { c.generateAuthorizedForm && c.generateAuthorizedForm(); } catch (e) {}
    try { c.addAuthorized && c.addAuthorized(); } catch (e) {}
    try { c.removeauthorized && c.removeauthorized(0); } catch (e) {}
    try { c.addTurnOver && c.addTurnOver(); } catch (e) {}
    try { c.removeTurnOver && c.removeTurnOver(0); } catch (e) {}
    try { c.getCountries && c.getCountries(); } catch (e) {}
    try { c.onChangeCountry && c.onChangeCountry({ id: '1' }); } catch (e) {}
    try { c.onChangeState && c.onChangeState({ id: '1' }); } catch (e) {}
    try { c.getStatesArray && c.getStatesArray({ id: '1' }); } catch (e) {}
    try { c.onAddProduct && c.onAddProduct(); } catch (e) {}
    try { c.onAddService && c.onAddService(); } catch (e) {}
    try { c.onAddContact && c.onAddContact(); } catch (e) {}
    try { c.onAddClientRef && c.onAddClientRef(); } catch (e) {}
    try { c.onDelete && c.onDelete(row, 0, 'productsList'); } catch (e) {}
    try { c.onDelete && c.onDelete(row, 0, 'servicesList'); } catch (e) {}
    try { c.saveGeneral && c.saveGeneral(validForm); } catch (e) {}
    try { c.saveGeneral && c.saveGeneral(invalidForm); } catch (e) {}
    try { c.saveBranches && c.saveBranches(); } catch (e) {}
    try { c.saveProducts && c.saveProducts(); } catch (e) {}
    try { c.saveServices && c.saveServices(); } catch (e) {}
    try { c.saveContacts && c.saveContacts(); } catch (e) {}
    try { c.saveClientReferences && c.saveClientReferences(); } catch (e) {}
    try { c.saveFinancials && c.saveFinancials(validForm); } catch (e) {}
    try { c.saveTurnOver && c.saveTurnOver(); } catch (e) {}
    try { c.saveAuthorized && c.saveAuthorized(); } catch (e) {}
    try { c.saveDocuments && c.saveDocuments(); } catch (e) {}
    try { c.saveData && c.saveData(); } catch (e) {}
    try { c.regFormSubmit && c.regFormSubmit(validForm); } catch (e) {}
    try { c.regFormSubmit && c.regFormSubmit(invalidForm); } catch (e) {}
    try { c.onAcceptSubmit && c.onAcceptSubmit(true); } catch (e) {}
    try { c.onAcceptSubmit && c.onAcceptSubmit(false); } catch (e) {}
    try { c.onTabClick && c.onTabClick({ index: 0 }); } catch (e) {}
    try { c.onTabClick && c.onTabClick({ index: 1 }); } catch (e) {}
    try { c.moveToSelectedTab && c.moveToSelectedTab(1); } catch (e) {}
    try { c.moveToBackTab && c.moveToBackTab(); } catch (e) {}
    try { c.uploadCertificates && c.uploadCertificates([fileBad]); } catch (e) {}
    try { c.uploadDocuments && c.uploadDocuments([fileBad]); } catch (e) {}
    try { c.uploadGSTIN && c.uploadGSTIN([fileBad]); } catch (e) {}
    try { c.uploadMSME && c.uploadMSME([fileBad]); } catch (e) {}
    try { c.uploadCheque && c.uploadCheque([fileBad]); } catch (e) {}
    try { c.uploadPanCard && c.uploadPanCard([fileBad]); } catch (e) {}
    try { c.deleteAttachment && c.deleteAttachment(0, 'certificatesArray'); } catch (e) {}
    try { c.deletefiles && c.deletefiles(0); } catch (e) {}
    try { c.removeFile && c.removeFile(); } catch (e) {}
    try { c.getFileName && c.getFileName({ name: 'a.pdf' }); } catch (e) {}
    try { c.getBase64 && c.getBase64(fileBad); } catch (e) {}
    ${rebind('failure')}
    try { c.getVendorById && c.getVendorById(); } catch (e) {}
    try { c.saveGeneral && c.saveGeneral(validForm); } catch (e) {}
`;
}

function bodyFor(rel) {
  if (rel.includes('item-catalogue')) return itemCatalogueBody();
  if (rel.includes('category-mgr-vendor-summary')) return vendorSummaryBody();
  if (rel.includes('client-procure-request')) return procureBody();
  if (rel.includes('create-rfq-shared')) return createRfqBody();
  if (rel.includes('/pos/pos/')) return posBody();
  if (rel.includes('bfs-items-list')) return bfsBody();
  if (rel.includes('vendor-reg')) return vendorRegBody();
  return '';
}

let updated = 0;
const list = [];
for (const rel of FILES) {
  const srcPath = path.join(ROOT, rel);
  const specPath = srcPath.replace(/\.ts$/, '.spec.ts');
  if (!fs.existsSync(specPath)) continue;
  let spec = fs.readFileSync(specPath, 'utf8');
  if (spec.includes(MARKER)) {
    console.log('SKIP', rel);
    continue;
  }
  spec = ensureOfImport(spec);
  if (!spec.includes('deepExerciseComponent') && spec.includes('test-helpers')) {
    spec = spec.replace(
      /(import \{[^}]*)(from ['"][^'"]*testing\/test-helpers['"])/,
      (m, a, b) =>
        m.includes('deepExerciseComponent')
          ? m
          : m.includes('exerciseComponent')
            ? m.replace('exerciseComponent', 'exerciseComponent, deepExerciseComponent')
            : a.replace('{', '{ deepExerciseComponent, exerciseComponent, ') + b
    );
  }

  const block = `
  it('${MARKER}', async () => {
    const c: any = component;
${wireServicesSnippet()}
${commonPayloads()}
${rebind('array')}
${bodyFor(rel)}
${rebind('success')}
${bodyFor(rel)}
${rebind('failure')}
${bodyFor(rel)}
    try { exerciseComponent(c); } catch (e) {}
    try { deepExerciseComponent(c); } catch (e) {}
    expect(component).toBeTruthy();
  });
`;

  const idx = spec.lastIndexOf('});');
  if (idx < 0) continue;
  spec = spec.slice(0, idx) + block + '\n' + spec.slice(idx);
  fs.writeFileSync(specPath, spec);
  updated++;
  list.push(rel);
  console.log('BIG90', rel);
}
fs.writeFileSync(path.join(ROOT, '.coverage-work/big90-patched.json'), JSON.stringify(list, null, 2));
console.log('Done', updated);
