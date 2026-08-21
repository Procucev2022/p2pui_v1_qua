import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of, Subject } from 'rxjs';
import { CreatePrModalComponent } from './create-pr-modal.component';
import { defaultAppConfig } from 'src/testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { CreatePrModelService } from '../../services/create-pr-model.service';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';
import { ClientService } from '../../services/client-service.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, NgForm } from '@angular/forms';
import { MAT_DIALOG_SCROLL_STRATEGY, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { swalConfirm } from 'src/app/shared/helpers/swal-confirm';

describe('CreatePrModalComponent', () => {
  let component: CreatePrModalComponent;
  let fixture: ComponentFixture<CreatePrModalComponent>;
  let toastr: any;
  let createPrService: any;
  let convertSer: any;
  let encryDecryService: any;
  let clientService: any;

  const mockLoggedUserData = {
    details: {
      id: 'u1',
      org: { id: 'org1' },
      department: { id: 'dept1', department: 'Procurement' }
    }
  };

  const samplePrData = {
    id: 'pr-1',
    prId: 'PR-100',
    prCorrespond: 'Opex',
    prDescription: 'Sample Description',
    singleVendor: true,
    suggestNewVendor: true,
    rateCardAvailable: true,
    futureRequirement: 'Yes',
    priority: 'High',
    dueDate: '2026-08-18T00:00:00Z',
    clientcostcentre: [{ id: 'cc1', name: 'Cost Center 1' }],
    estimatedPrvalue: 5000,
    boq: false,
    pritems: [
      { description: 'Item 1', brand: 'Brand 1', unitofMeasures: 'PCS', quantity: 10, category: 'Cat 1', itemcode: 'C1', serialNo: 1, uom: 'PCS', price: '100' }
    ],
    clientdeliverylocation: [
      { address: '123 Main St', city: 'Metropolis', state: 'NY' }
    ],
    prVendors: [
      { companyName: 'Vendor 1', contactPerson: 'John', email: 'john@v1.com', phone: '1234567890' }
    ],
    prDocuments: [
      { fileName: 'doc1.png', file: 'QUJD' }
    ],
    rateCardDocument: 'QUJD',
    ratecardName: 'ratecard.png'
  };

  beforeEach(async () => {
    localStorage.setItem('orgId', 'org1');
    localStorage.setItem('loggedId', 'u1');
    localStorage.setItem('userFullName', 'Test User');

    toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      warning: jasmine.createSpy('warning')
    };

    createPrService = {
      editPr: jasmine.createSpy('editPr').and.returnValue(of({ status: 'Success' })),
      getClientCostCentreByorgId: jasmine.createSpy('getClientCostCentreByorgId').and.returnValue(of([{ id: 'cc1', name: 'CC1' }])),
      savePR: jasmine.createSpy('savePR').and.returnValue(of({ id: 'pr-saved-1', message: 'Saved successfully', pritems: [{ serialNo: 1 }] })),
      submitPrdetails: jasmine.createSpy('submitPrdetails').and.returnValue(of({ status: 'Success', message: 'Submitted successfully', pritems: [{ serialNo: 1 }] }))
    };

    convertSer = {
      getBase64: jasmine.createSpy('getBase64').and.returnValue(Promise.resolve('data:image/png;base64,QUJDRA=='))
    };

    encryDecryService = {
      get: jasmine.createSpy('get').and.returnValue(JSON.stringify(mockLoggedUserData))
    };

    clientService = {
      getPrById: jasmine.createSpy('getPrById').and.returnValue(of(samplePrData)),
      setToEditPRModal: jasmine.createSpy('setToEditPRModal'),
      $_prData: new Subject<any>()
    };

    await TestBed.configureTestingModule({
      declarations: [CreatePrModalComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => undefined, detectChanges: () => undefined } },
        DatePipe,
        { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => ({ attach: () => undefined, enable: () => undefined, disable: () => undefined, detach: () => undefined }) },
        { provide: CreatePrModelService, useValue: createPrService },
        { provide: ConvertToBase64Service, useValue: convertSer },
        { provide: ToastrService, useValue: toastr },
        { provide: EncryDecryService, useValue: encryDecryService },
        { provide: ClientService, useValue: clientService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close: () => undefined } },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(CreatePrModalComponent, '')
      .overrideComponent(CreatePrModalComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(CreatePrModalComponent);
    component = fixture.componentInstance;
    component.loggedUserData = mockLoggedUserData;
    component.tabGroup1 = { selectedIndex: 0 };
  });

  it('should create and initialize in creation mode (no dialogData)', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.deptName as any).toBe('Procurement');
    expect(clientService.setToEditPRModal).toHaveBeenCalledWith(null);
    expect(createPrService.getClientCostCentreByorgId).toHaveBeenCalled();

    // Department is null
    encryDecryService.get.and.returnValue(JSON.stringify({ details: { id: 'u1', org: { id: 'o1' }, department: null } }));
    component.ngOnInit();
    expect(component.deptName as any).toBe('');
  });

  it('should initialize in edit mode with dialogData.prId, singleVendor false, boq true, and null rateCardDocument', fakeAsync(() => {
    component.dialogData = { prId: 'PR-100' };
    clientService.getPrById.and.returnValue(of({
      ...samplePrData,
      singleVendor: false,
      boq: true,
      rateCardDocument: null,
      ratecardName: null
    }));
    component.ngOnInit();
    tick();

    expect(clientService.getPrById).toHaveBeenCalled();
    expect(component.pruuid).toBe('PR-100');
    expect(component.singleVendor).toBeFalse();

    tick(1100);
    expect(component.prItemsFromInvoice.length).toBe(1);
    flush();
  }));

  it('should handle numberOnly and alphaOnly helper methods', () => {
    expect(component.numberOnly({ which: 50, keyCode: 50 })).toBeTrue(); // '2'
    expect(component.numberOnly({ which: 65, keyCode: 65 })).toBeFalse(); // 'A'
    expect(component.numberOnly({ which: 8, keyCode: 8 })).toBeTrue(); // backspace
    expect(component.numberOnly({ which: null, keyCode: 55 })).toBeTrue();

    expect(component.alphaOnly({ keyCode: 65 })).toBeTrue(); // 'A'
    expect(component.alphaOnly({ keyCode: 90 })).toBeTrue(); // 'Z'
    expect(component.alphaOnly({ keyCode: 50 })).toBeFalse(); // '2'
    expect(component.alphaOnly({ keyCode: 8 })).toBeTrue(); // backspace
  });

  it('should handle dataURItoBlob conversion', () => {
    const blob = component.dataURItoBlob('QUJD');
    expect(blob).toBeTruthy();
    expect(blob.size).toBe(3);
  });

  it('should handle editPr and getClientCostCentreByorgId', () => {
    component.editPr({ id: '1' });
    expect(createPrService.editPr).toHaveBeenCalledWith({ id: '1' });

    createPrService.getClientCostCentreByorgId.and.returnValue(of(null));
    component.getClientCostCentreByorgId();
  });

  it('should handle addItem and removeItem with limit', () => {
    component.createPRformList = [];
    component.addItem();
    expect(component.createPRformList.length).toBe(1);

    component.createPRformList = Array.from({ length: 10 }, () => ({ description: '' }));
    component.addItem();
    expect(toastr.error).toHaveBeenCalledWith('You can add maximum 10 items only', 'Error');

    component.removeItem(0);
    expect(component.createPRformList.length).toBe(9);
  });

  it('should handle addLocation and removeLocation with limit', () => {
    component.deliveryLocationList = [];
    component.addLocation();
    expect(component.deliveryLocationList.length).toBe(1);

    component.deliveryLocationList = Array.from({ length: 10 }, () => ({ address: '' }));
    component.addLocation();
    expect(toastr.error).toHaveBeenCalledWith('You can add maximum 10 locations only', 'Error');

    component.removeLocation(0);
    expect(component.deliveryLocationList.length).toBe(9);
  });

  it('should handle addNewVendor and removing with limit', () => {
    component.singleVendorform = [];
    component.addNewVendor();
    expect(component.singleVendorform.length).toBe(1);

    component.singleVendorform = Array.from({ length: 5 }, () => ({ companyName: '' }));
    component.addNewVendor();
    expect(toastr.error).toHaveBeenCalledWith('You can add maximum 5 vendors only', 'Error');

    component.removing(0);
    expect(component.singleVendorform.length).toBe(4);
  });

  it('should handle drag and drop host listeners', () => {
    const file = new File(['abc'], 'test.png');
    const dragEvent = { preventDefault: () => undefined, stopPropagation: () => undefined, dataTransfer: { files: [file] } };

    component.onDragOver(dragEvent);
    expect(component.dragAreaClass).toBe('droparea');

    component.onDragEnter(dragEvent);
    expect(component.dragAreaClass).toBe('droparea');

    component.onDragEnd(dragEvent);
    expect(component.dragAreaClass).toBe('dragarea');

    component.onDragLeave(dragEvent);
    expect(component.dragAreaClass).toBe('dragarea');

    component.onDrop(dragEvent);
    expect(component.dragAreaClass).toBe('dragarea');

    // drop without dataTransfer.files
    component.onDrop({ preventDefault: () => undefined, stopPropagation: () => undefined, dataTransfer: {} });
  });

  it('should handle deleteAttachment, removeFile, and getPrDocuments', fakeAsync(() => {
    const file = new File(['test'], 'file1.png');
    component.documentsArray = [file];
    component.selectedFilesArray = [file];

    component.getPrDocuments();
    tick();
    expect(convertSer.getBase64).toHaveBeenCalledWith(file);
    expect(component.prDocumentsBase64.length).toBe(1);

    component.deleteAttachment(0, 'documentsArray');
    expect(component.documentsArray.length).toBe(0);

    component.removeFile(0);
    expect(component.selectedFilesArray.length).toBe(0);
    flush();
  }));

  it('should handle uploadRateCard, uploadLineItemFile, uploadBOQFile, dropRateCard, deleteRateCard', fakeAsync(() => {
    const file = new File(['test'], 'ratecard.png');
    const event = { target: { files: [file] } };

    component.uploadRateCard(event);
    tick();
    expect(component.rateCardDocToBase64.length).toBe(1);

    component.uploadLineItemFile(event);
    tick();
    expect(component.BOQDocToBase64.length).toBe(1);

    component.uploadBOQFile(event);
    tick();
    expect(component.BOQDocToBase64.length).toBe(2);

    component.dropRateCard(event);
    component.deleteRateCard(0);
    component.onItemSelect({});
    component.onSelectAll({});
    component.onChangeCostCenter({});
    component.closeDialog('event');
    flush();
  }));

  it('should handle next() navigation, validations, and formSave', () => {
    const validForm = {
      value: {
        prDescription: 'Desc',
        dueDate: '2026-08-18',
        prCorrespond: 'Opex',
        city_0: 'City',
        address_0: 'Addr',
        state_0: 'State'
      }
    } as NgForm;

    component.tabGroup1 = { selectedIndex: 0 };
    component.createPRformList = [{ description: 'Item 1', brand: 'Brand 1', uom: 'PCS', price: '100' }];
    component.next(validForm);
    expect(component.selectedIndex).toBe(1);

    // Test brand_0 fallback path
    component.createPRformList = [];
    component.next({
      value: {
        prDescription: 'Desc',
        dueDate: '2026-08-18',
        prCorrespond: 'Opex',
        brand_0: 'B',
        quantity_0: 1,
        description_0: 'D',
        unitofMeasures_0: 'KG'
      }
    } as NgForm);
    expect(component.selectedIndex).toBe(2);

    // Form missing description
    component.next({ value: {} } as NgForm);
    expect(toastr.warning).toHaveBeenCalledWith('Please Enter PR Description', 'Warning');

    // Form missing dueDate
    component.next({ value: { prDescription: 'Desc' } } as NgForm);
    expect(toastr.warning).toHaveBeenCalledWith('Please select Expacted Date', 'Warning');

    // Form missing prCorrespond
    component.next({ value: { prDescription: 'Desc', dueDate: '2026-08-18' } } as NgForm);
    expect(toastr.warning).toHaveBeenCalledWith('Please select Pr Corresponds', 'Warning');

    // back and backToCreatePR
    component.selectedIndex = 2;
    component.back();
    expect(component.selectedIndex).toBe(1);

    spyOn(component.closeCreatePR, 'emit');
    component.backToCreatePR();
    expect(component.closeCreatePR.emit).toHaveBeenCalled();
  });

  it('should handle formSave with success, failure, and editPRData', () => {
    const form = {
      value: {
        prDescription: 'Desc',
        dueDate: '2026-08-18',
        prCorrespond: 'Opex',
        singleVendor: false,
        rateCardAvailable: false
      }
    } as NgForm;

    // Missing prDescription
    component.formSave({ value: {} } as NgForm);
    expect(toastr.warning).toHaveBeenCalledWith('Please Enter PR Description', 'Warning');

    component.createPRformList = [
      { id: '1', description: 'Item 1', uom: 'PCS', specification: 'Spec 1', price: '100' },
      { id: '2', description: 'Item 2', brand: 'Brand 2', unitofMeasures: 'KG', price: 200 }
    ];
    component.singleVendorform = [{ companyName: 'V1' }];
    component.editPRData = { pritems: [{ id: 'item1' }] };
    component.tabGroup1 = { selectedIndex: 0 };
    component.editPrId = 'PR-100';
    component.pruuid = 'uuid-1';

    // Save success
    createPrService.savePR.and.returnValue(of({ id: 'saved-1', message: 'Saved OK', pritems: [{ serialNo: 1 }, { serialNo: 2 }] }));
    component.formSave(form);
    expect(toastr.success).toHaveBeenCalledWith('Saved OK', 'Success');
    expect(component.savedPRData.id).toBe('saved-1');

    // Save failure (Failure / failure)
    createPrService.savePR.and.returnValue(of({ status: 'failure', message: 'Failed to save' }));
    component.formSave(form);
    expect(toastr.error).toHaveBeenCalledWith('Failed to save', 'Failure');
  });

  it('should handle onSubmit with confirm and success/failure callbacks', fakeAsync(() => {
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));
    component.savedPRData = { id: 'saved-1' };
    component.deliveryLocationList = [{ address: 'Main St', city: 'City', state: 'State' }];
    component.estimatedPrvalue = 5000;
    component.rateCardDocToBase64 = [{ fileName: 'rc.png', file: 'QUJD' }];
    component.BOQDocToBase64 = [{ fileName: 'boq.png', file: 'QUJD' }];
    component.createPRformList = [{ uom: 'PCS', brand: 'B', price: '100' }];
    component.singleVendorform = [{ companyName: 'Vendor' }];
    component.pruuid = 'PR-100';
    component.editPrId = 'PR-100';

    const validForm = {
      value: {
        prCorrespond: 'Opex',
        prDescription: 'Desc',
        dueDate: '2026-08-18',
        singleVendor: true,
        suggestNewVendor: true,
        rateCardAvailable: true,
        futureRequirement: 'Yes',
        priority: 'High'
      }
    } as NgForm;

    // Submit success ('Success' / 'success')
    createPrService.submitPrdetails.and.returnValue(of({ status: 'success', message: 'PR Submitted', pritems: [{ serialNo: 1 }] }));
    component.onSubmit(validForm);
    tick(600);
    expect(toastr.success).toHaveBeenCalledWith('PR Submitted', 'Success');

    // Submit failure ('Failure' / 'failure')
    createPrService.submitPrdetails.and.returnValue(of({ status: 'failure', message: 'Submit failed' }));
    component.onSubmit(validForm);
    tick(600);
    expect(toastr.error).toHaveBeenCalledWith('Submit failed', 'Failure');

    // Submit with rateCardAvailable: false, BOQDocToBase64: [], singleVendorform empty, no pruuid, no editPrId
    component.rateCardDocToBase64 = [];
    component.BOQDocToBase64 = [];
    component.singleVendorform = [{ companyName: '' }];
    component.pruuid = '';
    component.editPrId = '';
    component.savedPRData = { id: 'saved-2' };
    createPrService.submitPrdetails.and.returnValue(of({ status: 'Success', message: 'PR Submitted', pritems: [{ serialNo: 1 }] }));
    component.onSubmit({
      value: {
        prCorrespond: 'Opex',
        prDescription: 'Desc',
        dueDate: '2026-08-18',
        singleVendor: false,
        suggestNewVendor: false,
        rateCardAvailable: false
      }
    } as NgForm);
    tick(600);

    // Warning when required fields missing
    component.savedPRData = null;
    component.onSubmit(validForm);
    expect(toastr.warning).toHaveBeenCalledWith('Please Enter Required Fields', 'Warning');

    flush();
  }));

  it('should handle onChangeVendor, updatePRList, and ngOnDestroy', () => {
    component.onChangeVendor({});
    expect(component.singleVendorform.length).toBe(1);

    component.updatePRList({
      prItemsList: [{ id: '1', name: 'Item 1' }, { name: 'Item 2' }],
      estimatedPRValue: 5000,
      estimatedItemValue: 4000
    });
    expect(component.createPRformList.length).toBe(2);
    expect(component.estimatedPrvalue).toBe(5000);
    expect(component.estimatedItemValue).toBe(4000);

    // updatePRList with empty/falsy values
    component.updatePRList({
      prItemsList: null,
      estimatedPRValue: 0,
      estimatedItemValue: 0
    });

    spyOn(clientService.$_prData, 'next');
    component.ngOnDestroy();
    expect(clientService.$_prData.next).toHaveBeenCalledWith(null);
  });
});
