import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of, Subject } from 'rxjs';
import { ItemCatalogueComponent } from './item-catalogue.component';
import { defaultAppConfig } from 'src/testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { ClientService } from '../services/client-service.service';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';
import { InvoicesService } from '../../invoices/invoices.service';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, NgForm } from '@angular/forms';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog } from '@angular/material/dialog';

describe('ItemCatalogueComponent', () => {
  let component: ItemCatalogueComponent;
  let fixture: ComponentFixture<ItemCatalogueComponent>;
  let clientService: any;
  let toastr: any;
  let encryDecryService: any;
  let convertSer: any;
  let matDialog: any;

  const mockLoggedUserData = {
    details: {
      org: { id: 'org-1' },
      role: { roleName: 'ClientInitiator' },
      listofPermission: ['VIEW_CATALOGUE']
    }
  };

  beforeEach(async () => {
    localStorage.setItem('orgId', 'org-1');
    localStorage.setItem('logData', 'x');
    (window as any).event = { target: { files: [] } };

    toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      warning: jasmine.createSpy('warning')
    };

    clientService = {
      getItemCatalogue: jasmine.createSpy('getItemCatalogue').and.returnValue(of([
        { id: 'item-1', description: 'Item 1', price: 100, subCategoryId: 'sc1' }
      ])),
      createItemCatalogue: jasmine.createSpy('createItemCatalogue').and.returnValue(of({ statusCode: '200', message: 'Item created' })),
      getVendorsByItemForClientInitiator: jasmine.createSpy('getVendorsByItemForClientInitiator').and.returnValue(of([
        { id: 'v1', companyId: '123456789012345', linked: true, vendorName: 'Vendor 1' },
        { id: 'v2', companyId: '123456789012345', linked: false }
      ])),
      getVendorsByItem: jasmine.createSpy('getVendorsByItem').and.returnValue(of([
        { id: 'v1', companyId: '123456789012345', linked: true, vendorName: 'Vendor 1' },
        { id: 'v2', companyId: '123456789012345', linked: false }
      ])),
      createItemCatalogueByRequestBOQFile: jasmine.createSpy('createItemCatalogueByRequestBOQFile').and.returnValue(of({ statusCode: '200', message: 'BOQ Uploaded' })),
      updateItemCatalogueByRequest: jasmine.createSpy('updateItemCatalogueByRequest').and.returnValue(of({ statusCode: '200', message: 'Updated' })),
      getItemDetailsById: jasmine.createSpy('getItemDetailsById').and.returnValue(of({ id: 'item-1', description: 'Item 1', documents: [{ fileName: 'doc1.pdf' }] })),
      $_prData: new Subject<any>()
    };

    convertSer = {
      getBase64: jasmine.createSpy('getBase64').and.returnValue(Promise.resolve('data:application/vnd.ms-excel;base64,QUJDRA=='))
    };

    encryDecryService = {
      get: jasmine.createSpy('get').and.returnValue(JSON.stringify(mockLoggedUserData))
    };

    matDialog = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of(true)
      }),
      closeAll: jasmine.createSpy('closeAll')
    };

    await TestBed.configureTestingModule({
      declarations: [ItemCatalogueComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => undefined, detectChanges: () => undefined } },
        DatePipe,
        { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => ({ attach: () => undefined, enable: () => undefined, disable: () => undefined, detach: () => undefined }) },
        { provide: ClientService, useValue: clientService },
        { provide: MatDialog, useValue: matDialog },
        { provide: ToastrService, useValue: toastr },
        { provide: EncryDecryService, useValue: encryDecryService },
        { provide: InvoicesService, useValue: {} },
        { provide: ConvertToBase64Service, useValue: convertSer },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(ItemCatalogueComponent, '')
      .overrideComponent(ItemCatalogueComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(ItemCatalogueComponent);
    component = fixture.componentInstance;
  });

  it('should create and initialize for ClientInitiator, PRApprover, and other roles', () => {
    // ClientInitiator
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.isAnalyticsScreenShow).toBeTrue();
    expect(component.itemList.length).toBe(1);
    expect(component.itemList[0].status).toBe('Available');

    // PRApprover
    encryDecryService.get.and.returnValue(JSON.stringify({ details: { org: { id: 'org-1' }, role: { roleName: 'PRApprover' }, listofPermission: [] } }));
    component.ngOnInit();
    expect(component.isAnalyticsScreenShow).toBeTrue();

    // VendorManager
    encryDecryService.get.and.returnValue(JSON.stringify({ details: { org: { id: 'org-1' }, role: { roleName: 'VendorManager' }, listofPermission: [] } }));
    component.ngOnInit();
    expect(component.isAnalyticsScreenShow).toBeTrue();

    // Other role
    encryDecryService.get.and.returnValue(JSON.stringify({ details: { org: { id: 'org-1' }, role: { roleName: 'ClientAdmin' }, listofPermission: [] } }));
    component.ngOnInit();
    expect(component.isAnalyticsScreenShow).toBeFalse();

    // Tooltip label callback test
    const tooltipText = component.options.tooltips.callbacks.label({ index: 0 }, { tooltips: ['A#B'] });
    expect(tooltipText).toEqual(['A', 'B']);
  });

  it('should handle onPage, onSecondPage, and ngOnDestroy', () => {
    component.onPage({ page: 1 });
    expect(component.paginatoryDetails.page).toBe(1);

    component.onSecondPage({ page: 2 });
    expect(component.secondPaginatoryDetails.page).toBe(2);

    spyOn(clientService.$_prData, 'next');
    component.ngOnDestroy();
    expect(clientService.$_prData.next).toHaveBeenCalledWith(null);
  });

  it('should handle newItemRequest and onAddNewItemSubmit', () => {
    component.ngOnInit();
    component.newItemRequest({});
    expect(matDialog.open).toHaveBeenCalled();

    component.onAddNewItemSubmit({} as NgForm);
    expect(clientService.createItemCatalogue).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('Item created', 'Success');

    // Failure branch
    clientService.createItemCatalogue.and.returnValue(of({ statusCode: '400', message: 'Creation failed' }));
    component.onAddNewItemSubmit({} as NgForm);
    expect(toastr.error).toHaveBeenCalledWith('Creation failed', 'Error');
  });

  it('should handle onSubCategoryChange and getCloseVendorByItem', () => {
    component.itemList_cache = [
      { id: '1', subCategoryId: 'sc1' },
      { id: '2', subCategoryId: 'sc2' }
    ];
    component.onSubCategoryChange({ subCategoryId: 'sc1' });
    expect(component.itemList.length).toBe(1);

    component.onSubCategoryChange(null);
    expect(component.itemList.length).toBe(2);

    component.expandedRows = { '1': 1 };
    component.getCloseVendorByItem({});
    expect(component.expandedRows).toEqual({});
  });

  it('should handle getVendorByItem for ClientInitiator and other roles (success and error paths)', () => {
    component.ngOnInit();
    component.itemList = [{ id: 'item-1' }];

    // ClientInitiator success
    component.getVendorByItem({ id: 'item-1' });
    expect(clientService.getVendorsByItemForClientInitiator).toHaveBeenCalled();
    expect(component.vendorsList.length).toBe(2);
    expect(component.itemList[0].childs.length).toBe(2);

    // ClientInitiator error
    clientService.getVendorsByItemForClientInitiator.and.returnValue(of({ errorMessage: 'Failed to fetch vendors' }));
    component.getVendorByItem({ id: 'item-1' });
    expect(toastr.error).toHaveBeenCalledWith('Failed to fetch vendors', 'Error');

    // Other role success
    component.loggedUserDetails.role.roleName = 'ClientAdmin';
    component.getVendorByItem({ id: 'item-1' });
    expect(clientService.getVendorsByItem).toHaveBeenCalled();

    // Other role error
    clientService.getVendorsByItem.and.returnValue(of({ errorMessage: 'Fetch failed' }));
    component.getVendorByItem({ id: 'item-1' });
    expect(toastr.error).toHaveBeenCalledWith('Fetch failed', 'Error');
  });

  it('should handle showAnalyticsForSelectedItem vendor and item levels, generateChart', () => {
    component.showAnalyticsForSelectedItem({ id: 'item-1', description: 'Item 1', price: 100, priceFlag: 'U' }, false);
    expect(matDialog.open).toHaveBeenCalled();

    component.showAnalyticsForSelectedItem({ vendorId: 'v1', vendorName: 'Vendor 1', pricePerUnit: 100, priceFlag: 'U' }, true, { id: 'item-1' });
    expect(matDialog.open).toHaveBeenCalled();

    component.generateChart({}, true);
  });

  it('should handle fileUploadEvent and filesDropped with excel, xls, and invalid files', fakeAsync(() => {
    const xlsxFile = new File(['data'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const xlsFile = new File(['data'], 'test.xls', { type: 'application/vnd.ms-excel' });
    const pdfFile = new File(['data'], 'test.pdf', { type: 'application/pdf' });

    // Valid XLSX
    component.fileUploadEvent([xlsxFile], false);
    tick();
    expect(component.commentFilesDataList.length).toBe(1);
    expect(component.commentFileType).toBe('test.xlsx');

    // Valid XLS
    component.fileUploadEvent([xlsFile], false);
    tick();
    expect(component.commentFilesDataList.length).toBe(2);

    // Invalid PDF (not allow any)
    component.fileUploadEvent([pdfFile], false);
    expect(toastr.warning).toHaveBeenCalledWith('Invalid File format, pls upload excel file only', 'warning');

    // Dropped valid XLSX
    component.filesDropped([xlsxFile], false);
    tick();
    expect(component.commentFilesDataList.length).toBe(3);

    // Dropped valid XLS
    component.filesDropped([xlsFile], false);
    tick();
    expect(component.commentFilesDataList.length).toBe(4);

    // Dropped invalid PDF
    component.filesDropped([pdfFile], false);
    expect(toastr.warning).toHaveBeenCalledWith('Invalid File format, pls upload excel file only', 'warning');

    // Remove file and removeFileFromList
    component.removeFileFromList(0);
    expect(component.commentFilesDataList.length).toBe(3);
    component.removeFileFromList(0);
    expect(component.commentFilesDataList.length).toBe(2);

    component.removeFile();
    expect(component.commentFilesDataList.length).toBe(0);
    expect(component.commentFileData).toBeNull();
    flush();
  }));

  it('should handle createItemCatalogueByRequestBOQFile and uploadItemCatalogueByRequest', () => {
    component.ngOnInit();
    component.commentFileData = 'QUJD';
    component.commentFilesDataList = [{ file: 'QUJD' }];

    component.createItemCatalogueByRequestBOQFile();
    expect(clientService.createItemCatalogueByRequestBOQFile).toHaveBeenCalled();

    // uploadItemCatalogueByRequest with documents
    component.editItemModel = { id: 'item-1', description: 'Updated Item', documents: [{ file: 'doc1.pdf' }] };
    component.commentFilesDataList = [{ file: 'doc2.pdf' }];
    component.uploadItemCatalogueByRequest();
    expect(clientService.updateItemCatalogueByRequest).toHaveBeenCalled();
  });

  it('should handle viewItemData and closeModal', () => {
    component.viewItemData({ id: 'item-1', clientItemFlag: true }, {});
    expect(clientService.getItemDetailsById).toHaveBeenCalled();
    expect(matDialog.open).toHaveBeenCalled();
    expect(component.isEditable).toBeTrue();

    component.closeModal();
    expect(matDialog.closeAll).toHaveBeenCalled();
  });


  it('should cover catalogue fallback, upload, and view branches', fakeAsync(() => {
    component.ngOnInit();
    clientService.getItemCatalogue.and.returnValue(of({ errorMessage: 'not an array' }));
    component.getAllItems();
    expect(component.itemList).toEqual([]);

    // Array with existing status
    clientService.getItemCatalogue.and.returnValue(of([{ id: 'i1', status: 'Reserved' }]));
    component.getAllItems();
    expect(component.itemList[0].status).toBe('Reserved');

    component.editItemModel = { id: 'item-1', description: 'Updated', documents: [] };
    component.commentFilesDataList = [{ file: 'new.pdf' }];
    component.uploadItemCatalogueByRequest();
    expect(clientService.updateItemCatalogueByRequest).toHaveBeenCalledWith({
      id: 'item-1', description: 'Updated', documents: [{ file: 'new.pdf' }]
    });

    component.commentFileData = null;
    component.createItemCatalogueByRequestBOQFile();
    component.editItemModel = {};
    component.uploadItemCatalogueByRequest();

    const anyFile = new File(['data'], 'notes.txt', { type: 'text/plain' });
    component.fileUploadEvent([anyFile], true);
    component.filesDropped([anyFile], true);
    tick();
    expect(convertSer.getBase64).toHaveBeenCalledWith(anyFile);

    component.viewItemData({ id: 'item-1', clientItemFlag: false }, {});
    expect(component.isEditable).toBeFalse();
    component.successChilds([{ id: 'other' }], { id: 'missing' });
  }));

});