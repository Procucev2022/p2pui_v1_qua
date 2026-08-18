import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { swalConfirm } from 'src/app/shared/helpers/swal-confirm';
import { PrViewModalComponent } from './pr-view-modal.component';
import { defaultAppConfig } from 'src/testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { ToastrService } from 'ngx-toastr';
import { ApprovePrService } from '../../services/approve-pr.service';
import { EncryDecryService } from 'src/app/shared/services';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExportPdfService } from 'src/app/layout/category-mgr/services/export-pdf.service';
import { CategoryService } from 'src/app/layout/category/services/category.service';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

describe('PrViewModalComponent', () => {
  let component: PrViewModalComponent;
  let fixture: ComponentFixture<PrViewModalComponent>;
  let toastr: any;
  let approvePrService: any;
  let catService: any;
  let dialogRef: any;
  let modalDialog: any;
  let exportPdfService: any;
  let encryDecryService: any;

  const mockPrData = {
    id: 'pr-100',
    prId: 'PR-100',
    deptName: 'Engineering',
    singleVendor: true,
    suggestNewVendor: true,
    rateCardAvailable: true,
    priority: 'High',
    prCorrespond: 'Internal',
    prDescription: 'Project PR',
    estimatedPrvalue: 50000,
    futureRequirement: 'Yes',
    dueDate: new Date().toISOString(),
    isCapex: true,
    totalSqft: 1000,
    clientStatus: { uiDisplay: 'Submitted' },
    userStatus: { uiDisplay: 'ApprovalPending' },
    pritems: [
      { serialNo: 1, description: 'Item 1', brand: 'Brand 1', unitofMeasures: 'PCS', quantity: 10 }
    ],
    clientdeliverylocation: [
      { address: '123 Street', city: 'City', state: 'State' }
    ],
    clientcostcentre: [{ id: 'cc1', name: 'CC1' }],
    prVendors: [
      { companyName: 'Vendor 1', contactPerson: 'John', email: 'v1@test.com', phone: '1234567890' }
    ]
  };

  beforeEach(async () => {
    toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      warning: jasmine.createSpy('warning')
    };

    approvePrService = {
      approvePRService: jasmine.createSpy('approvePRService').and.returnValue(of({ status: 'Success', message: 'Approved' })),
      rejectPRService: jasmine.createSpy('rejectPRService').and.returnValue(of({ status: 'Success', message: 'Rejected' })),
      closePRService: jasmine.createSpy('closePRService').and.returnValue(of({ statusCode: 1021, message: 'Closed' }))
    };

    catService = {
      createQuoteComparisionCAPEX: jasmine.createSpy('createQuoteComparisionCAPEX').and.returnValue(of({
        vendorHeaders: [{ vendorId: 'v1' }],
        totalItems: [{ pricePerUnit: '100', quantity: '5' }]
      }))
    };

    dialogRef = {
      close: jasmine.createSpy('close'),
      updateSize: jasmine.createSpy('updateSize')
    };

    modalDialog = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of(true)
      })
    };

    exportPdfService = {
      addFooters: jasmine.createSpy('addFooters')
    };

    encryDecryService = {
      get: jasmine.createSpy('get').and.returnValue(JSON.stringify({
        details: { listofPermission: ['APPROVE_PR'] }
      }))
    };

    await TestBed.configureTestingModule({
      declarations: [PrViewModalComponent],
      imports: [CommonModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => undefined, detectChanges: () => undefined } },
        DatePipe,
        { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => ({ attach: () => undefined, enable: () => undefined, disable: () => undefined, detach: () => undefined }) },
        { provide: ToastrService, useValue: toastr },
        { provide: ApprovePrService, useValue: approvePrService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockPrData },
        { provide: EncryDecryService, useValue: encryDecryService },
        { provide: CatProcuRequestsService, useValue: {} },
        { provide: MatDialog, useValue: modalDialog },
        { provide: NgbModal, useValue: {} },
        { provide: ExportPdfService, useValue: exportPdfService },
        { provide: CategoryService, useValue: catService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(PrViewModalComponent, '')
      .overrideComponent(PrViewModalComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(PrViewModalComponent);
    component = fixture.componentInstance;
  });

  it('should create and initialize for Capex PR with Submitted status', fakeAsync(() => {
    component.ngOnInit();
    tick(300);
    expect(component).toBeTruthy();
    expect(component.approveReject).toBe('true');
    expect(component.isCapex).toBeTrue();
    expect(catService.createQuoteComparisionCAPEX).toHaveBeenCalled();
    expect(component.showQuoteComp).toBeTrue();
  }));

  it('should handle numberOnly helper', () => {
    expect(component.numberOnly({ which: 50 })).toBeTrue(); // '2'
    expect(component.numberOnly({ keyCode: 65 })).toBeFalse(); // 'A'
    expect(component.numberOnly({ keyCode: 20 })).toBeTrue(); // control key
  });

  it('should handle item additions, location additions, vendor additions and limits', () => {
    // Add item limit
    component.createPRformList = new Array(9).fill({});
    component.addItem();
    expect(component.createPRformList.length).toBe(10);
    component.addItem();
    expect(toastr.error).toHaveBeenCalledWith('You can add maximum 10 items only', 'Error');
    component.removeItem(0);
    expect(component.createPRformList.length).toBe(9);

    // Add location limit
    component.deliveryLocationList = new Array(9).fill({});
    component.addLocation();
    expect(component.deliveryLocationList.length).toBe(10);
    component.addLocation();
    expect(toastr.error).toHaveBeenCalledWith('You can add maximum 10 locations only', 'Error');
    component.removeLocation(0);
    expect(component.deliveryLocationList.length).toBe(9);

    // Add vendor limit
    component.singleVendorform = new Array(4).fill({});
    component.addNewVendor();
    expect(component.singleVendorform.length).toBe(5);
    component.addNewVendor();
    expect(toastr.error).toHaveBeenCalledWith('You can add maximum 5 vendors only', 'Error');
    component.removing(0);
    expect(component.singleVendorform.length).toBe(4);

    component.onItemSelect({});
    component.onSelectAll([]);
  });

  it('should handle navigation, dialog closing, zoomin, and zoomout', () => {
    component.next();
    expect(component.selectedIndex).toBe(1);
    component.back();
    expect(component.selectedIndex).toBe(0);

    component.closeDialog();
    expect(dialogRef.close).toHaveBeenCalledWith({ event: 'Cancel' });

    component.zoomout();
    expect(dialogRef.updateSize).toHaveBeenCalledWith('70%');
    component.zoomin();
    expect(dialogRef.updateSize).toHaveBeenCalledWith('90%');
  });

  it('should handle approvePR (success and failure paths)', fakeAsync(() => {
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));

    // Approve Success
    component.approvePR();
    tick();
    expect(approvePrService.approvePRService).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('Approved', 'Success');
    expect(dialogRef.close).toHaveBeenCalledWith({ event: 'Success' });

    // Approve Failure
    approvePrService.approvePRService.and.returnValue(of({ status: 'Failure', message: 'Approval failed' }));
    component.approvePR();
    tick();
    expect(toastr.error).toHaveBeenCalledWith('Approval failed', 'Failure');
  }));

  it('should handle rejectPR (success and failure paths)', fakeAsync(() => {
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));

    // Reject Success (truthy response triggers first if(res) branch)
    component.rejectPR();
    tick();
    expect(approvePrService.rejectPRService).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('PR Rejection done successfully', 'Success');
    expect(dialogRef.close).toHaveBeenCalledWith({ event: 'Success' });
  }));

  it('should handle acceptPR and closePr', fakeAsync(() => {
    component.acceptPR();
    expect(modalDialog.open).toHaveBeenCalled();

    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));

    // Close PR Success
    component.closePr();
    tick();
    expect(approvePrService.closePRService).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('Closed', 'Success');

    // Close PR Failure
    approvePrService.closePRService.and.returnValue(of({ status: 'Failure', message: 'Close failed' }));
    component.closePr();
    tick();
    expect(toastr.error).toHaveBeenCalledWith('Close failed', 'Failure');
  }));

  it('should handle downloadPR with full vendor and location arrays and fallbacks', () => {
    component.downloadPR();
    expect(exportPdfService.addFooters).toHaveBeenCalled();

    // Fallback branches (singleVendor false, suggestNewVendor false, rateCardAvailable false, no prVendors)
    component.viewPrByIdList = {
      ...mockPrData,
      singleVendor: false,
      suggestNewVendor: false,
      rateCardAvailable: false,
      priority: null,
      futureRequirement: null,
      dueDate: null,
      prVendors: []
    };
    component.downloadPR();
  });

  it('should handle downloadPR pagination overflow for vendors table', () => {
    // Create many vendors to force page overflow  
    const manyVendors = Array.from({ length: 50 }, (_, i) => ({
      companyName: `Vendor ${i}`, contactPerson: `Person ${i}`, email: `v${i}@t.com`, phone: `12345${i}`
    }));
    component.viewPrByIdList = {
      ...mockPrData,
      prVendors: manyVendors,
      pritems: Array.from({ length: 50 }, (_, i) => ({
        serialNo: i, description: `Item ${i}`, brand: 'B', unitofMeasures: 'PCS', quantity: i
      })),
      clientdeliverylocation: Array.from({ length: 20 }, (_, i) => ({
        address: `Addr ${i}`, city: `City ${i}`, state: `State ${i}`
      }))
    };
    component.downloadPR();
    expect(exportPdfService.addFooters).toHaveBeenCalled();
  });

  it('should handle downloadPR with singleVendor=false and suggestNewVendor=false and rateCardAvailable=false', () => {
    component.viewPrByIdList = {
      ...mockPrData,
      singleVendor: false,
      suggestNewVendor: false,
      rateCardAvailable: false,
      priority: 'Medium',
      futureRequirement: 'No',
      dueDate: '2024-01-15T00:00:00Z',
      prVendors: [{ companyName: 'V', contactPerson: 'P', email: 'e@e.com', phone: '1' }]
    };
    component.downloadPR();
    expect(exportPdfService.addFooters).toHaveBeenCalled();
  });


  it('should cover empty bindings, non-capex initialization, and alternate response branches', fakeAsync(() => {
    component.viewPrByIdList = {
      ...mockPrData,
      isCapex: false,
      pritems: [],
      clientdeliverylocation: [],
      clientcostcentre: [],
      priority: null,
      clientStatus: { uiDisplay: 'Draft' },
      userStatus: null,
      prVendors: []
    };
    component.ngOnInit();
    expect(component.approveReject).toBe('false');
    expect(component.showQuoteComp).toBeFalse();
    component.bindTurnOver();
    component.bindDeliverylocation();
    component.bindPriorities();
    component.bindSelectedCost();

    component.createPRformList = [];
    component.deliveryLocationList = [];
    component.singleVendorform = [];
    component.addItem();
    component.addLocation();
    component.addNewVendor();
    expect(component.createPRformList.length).toBe(1);
    expect(component.deliveryLocationList.length).toBe(1);
    expect(component.singleVendorform.length).toBe(1);

    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ dismiss: 'cancel' }));
    component.approvePR();
    component.rejectPR();
    component.closePr();
    tick();
    flush();
  }));

  it('should handle createQuoteComparision with NaN and integer item values', fakeAsync(() => {
    catService.createQuoteComparisionCAPEX.and.returnValue(of({
      vendorHeaders: [{ vendorId: 'v1' }],
      totalItems: [
        { pricePerUnit: 'abc', quantity: 'xyz' },
        { pricePerUnit: '100', quantity: '10' }
      ]
    }));
    component.viewPrByIdList = { ...mockPrData, isCapex: true, clientStatus: { uiDisplay: 'Submitted' }, userStatus: { uiDisplay: 'ApprovalPending' } };
    component.createQuoteComparision();
    tick(300);
    expect(component.showQuoteComp).toBeTrue();
    expect(component.itemArray[0].pricePerUnit).toBe(0);
    expect(component.itemArray[0].quantity).toBe(0);
    expect(component.itemArray[1].pricePerUnit).toBe(100);
    expect(component.itemArray[1].quantity).toBe(10);
  }));

  it('should handle createQuoteComparision non-capex with Submitted status', fakeAsync(() => {
    component.viewPrByIdList = { ...mockPrData, isCapex: false, clientStatus: { uiDisplay: 'Submitted' }, userStatus: { uiDisplay: 'ApprovalPending' } };
    component.ngOnInit();
    tick(300);
    expect(component.approveReject).toBe('true');
  }));

  it('should handle closePr with non-1021 non-failure statusCode', fakeAsync(() => {
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));
    approvePrService.closePRService.and.returnValue(of({ statusCode: 999, status: 'Other', message: 'Unknown' }));
    component.closePr();
    tick();
    // Neither success nor failure path
    expect(toastr.success).not.toHaveBeenCalledWith('Unknown', 'Success');
    expect(toastr.error).not.toHaveBeenCalledWith('Unknown', 'Failure');
  }));

  it('should handle approvePR with success, Failure, failure, and other status responses', fakeAsync(() => {
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));

    // 1. lowercase 'success'
    approvePrService.approvePRService.and.returnValue(of({ status: 'success', message: 'Approved lowercase' }));
    component.approvePR();
    tick();
    expect(toastr.success).toHaveBeenCalledWith('Approved lowercase', 'Success');

    // 2. uppercase 'Failure'
    approvePrService.approvePRService.and.returnValue(of({ status: 'Failure', message: 'Failed uppercase' }));
    component.approvePR();
    tick();
    expect(toastr.error).toHaveBeenCalledWith('Failed uppercase', 'Failure');

    // 3. lowercase 'failure'
    approvePrService.approvePRService.and.returnValue(of({ status: 'failure', message: 'Failed lowercase' }));
    component.approvePR();
    tick();
    expect(toastr.error).toHaveBeenCalledWith('Failed lowercase', 'Failure');

    // 4. Other status
    approvePrService.approvePRService.and.returnValue(of({ status: 'other', message: 'Other' }));
    component.approvePR();
    tick();
  }));

  it('should handle closePr with uppercase Failure status', fakeAsync(() => {
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));
    approvePrService.closePRService.and.returnValue(of({ status: 'Failure', message: 'Failed to close uppercase' }));
    component.closePr();
    tick();
    expect(toastr.error).toHaveBeenCalledWith('Failed to close uppercase', 'Failure');
  }));

  it('should handle rejectPR with success and failure status', fakeAsync(() => {
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));

    // 1. Success response
    approvePrService.rejectPRService.and.returnValue(of({ status: 'Success', message: 'Rejected' }));
    component.rejectPR();
    tick();
    expect(toastr.success).toHaveBeenCalledWith('PR Rejection done successfully', 'Success');

    // 2. Failure response
    approvePrService.rejectPRService.and.returnValue(of({ status: 'Failure', message: 'Failed to reject' }));
    component.rejectPR();
    tick();
    expect(toastr.error).toHaveBeenCalledWith('Failed to reject', 'Failure');

    // 3. lowercase failure response
    approvePrService.rejectPRService.and.returnValue(of({ status: 'failure', message: 'Failed lowercase' }));
    component.rejectPR();
    tick();
    expect(toastr.error).toHaveBeenCalledWith('Failed lowercase', 'Failure');
  }));

  it('should handle downloadPR page break when table exceeds page height', () => {
    const origAutoTable = (jsPDF as any).API?.autoTable || (jsPDF.prototype as any).autoTable;
    const customAutoTable = function(this: any, options: any) {
      if (origAutoTable) {
        try { origAutoTable.call(this, options); } catch (e) {}
      }
      this.lastAutoTable = { finalY: 285 };
    };

    (jsPDF.prototype as any).autoTable = customAutoTable;
    if ((jsPDF as any).API) {
      (jsPDF as any).API.autoTable = customAutoTable;
    }

    try {
      component.viewPrByIdList = {
        ...mockPrData,
        singleVendor: true,
        suggestNewVendor: true,
        rateCardAvailable: true,
        priority: 'High',
        futureRequirement: 'Required',
        dueDate: '2026-12-31',
        prVendors: [{ companyName: 'V1', contactPerson: 'P1', email: 'v1@t.com', phone: '123' }],
        pritems: [{ serialNo: 1, description: 'I1', brand: 'B', unitofMeasures: 'PCS', quantity: 1 }],
        clientdeliverylocation: [{ address: 'A1', city: 'C1', state: 'S1' }]
      };
      component.downloadPR();
      expect(exportPdfService.addFooters).toHaveBeenCalled();
    } finally {
      (jsPDF.prototype as any).autoTable = origAutoTable;
      if ((jsPDF as any).API) {
        (jsPDF as any).API.autoTable = origAutoTable;
      }
    }
  });

  it('should handle item, location, vendor limits and removals', () => {
    // addItem limits
    component.createPRformList = new Array(10).fill({});
    component.addItem();
    expect(toastr.error).toHaveBeenCalledWith('You can add maximum 10 items only', 'Error');
    component.createPRformList = [{ description: '1' }, { description: '2' }];
    component.removeItem(0);
    expect(component.createPRformList.length).toBe(1);

    // addLocation limits
    component.deliveryLocationList = new Array(10).fill({});
    component.addLocation();
    expect(toastr.error).toHaveBeenCalledWith('You can add maximum 10 locations only', 'Error');
    component.deliveryLocationList = [{ address: '1' }, { address: '2' }];
    component.removeLocation(0);
    expect(component.deliveryLocationList.length).toBe(1);

    // addNewVendor limits
    component.singleVendorform = new Array(5).fill({});
    component.addNewVendor();
    expect(toastr.error).toHaveBeenCalledWith('You can add maximum 5 vendors only', 'Error');
    component.singleVendorform = [{ companyName: '1' }, { companyName: '2' }];
    component.removing(0);
    expect(component.singleVendorform.length).toBe(1);

    // Navigation and selections
    component.selectedIndex = 0;
    component.next();
    expect(component.selectedIndex).toBe(1);
    component.back();
    expect(component.selectedIndex).toBe(0);
    component.onItemSelect({ id: 1 });
    component.onSelectAll([{ id: 1 }]);
    component.closeDialog();
    expect(dialogRef.close).toHaveBeenCalledWith({ event: 'Cancel' });
  });

  it('should handle downloadPR without vendors to cover else branch', () => {
    component.viewPrByIdList = {
      ...mockPrData,
      prVendors: [],
      pritems: [{ serialNo: 1, description: 'I1', brand: 'B', unitofMeasures: 'PCS', quantity: 1 }],
      clientdeliverylocation: [{ address: 'A1', city: 'C1', state: 'S1' }]
    };
    component.downloadPR();
    expect(exportPdfService.addFooters).toHaveBeenCalled();
  });

  it('should handle bindTurnOver, bindDeliverylocation, and bindPriorities branches', () => {
    component.viewPrByIdList = {
      ...mockPrData,
      pritems: [{ description: 'Item 1' }],
      clientdeliverylocation: [{ address: 'Addr 1' }],
      priority: 'High'
    };
    component.bindTurnOver();
    component.bindDeliverylocation();
    component.bindPriorities();
    expect(component.createPRformList.length).toBe(1);
    expect(component.deliveryLocationList.length).toBe(1);
    expect(component.priorities).toBe('High');

    // Empty, null, and empty string priority branches
    component.viewPrByIdList = {
      ...mockPrData,
      pritems: [],
      clientdeliverylocation: [],
      priority: ''
    };
    component.bindTurnOver();
    component.bindDeliverylocation();
    component.bindPriorities();
    expect(component.priorities).toBe('');

    component.viewPrByIdList = {
      ...mockPrData,
      priority: null
    };
    component.bindPriorities();
  });

  it('should handle bindSelectedCost with and without cost centres', () => {
    component.viewPrByIdList = {
      ...mockPrData,
      clientcostcentre: [{ id: 'cc1', name: 'CC1' }]
    };
    component.bindSelectedCost();
    expect(component.selectedCostCentreItems.length).toBe(1);

    component.viewPrByIdList = {
      ...mockPrData,
      clientcostcentre: []
    };
    component.bindSelectedCost();
  });

  it('should cover constructor isCapex fallback branch', () => {
    const comp = new PrViewModalComponent(
      toastr,
      approvePrService,
      dialogRef,
      { isCapex: false, pritems: [], clientdeliverylocation: [], clientcostcentre: [], prVendors: [] },
      encryDecryService,
      {} as any,
      modalDialog,
      {} as any,
      exportPdfService,
      catService
    );
    expect(comp.isCapex).toBeFalse();
  });

  it('should handle ngOnInit with non-matching clientStatus/userStatus display values', fakeAsync(() => {
    // 1. clientStatus !== 'Submitted' and userStatus is undefined
    component.viewPrByIdList = {
      ...mockPrData,
      isCapex: false,
      clientStatus: { uiDisplay: 'Draft' },
      userStatus: undefined
    };
    component.ngOnInit();
    tick(300);
    expect(component.approveReject).toBe('false');

    // 2. clientStatus !== 'Submitted' and userStatus is ApprovalPending
    component.viewPrByIdList = {
      ...mockPrData,
      isCapex: false,
      clientStatus: { uiDisplay: 'Draft' },
      userStatus: { uiDisplay: 'ApprovalPending' }
    };
    component.ngOnInit();
    tick(300);
    expect(component.approveReject).toBe('true');

    // 3. clientStatus !== 'Submitted' and userStatus is other status
    component.viewPrByIdList = {
      ...mockPrData,
      isCapex: true,
      clientStatus: { uiDisplay: 'Draft' },
      userStatus: { uiDisplay: 'Approved' }
    };
    component.ngOnInit();
    tick(300);
    expect(component.approveReject).toBe('false');
  }));

  it('should handle rejectPR with falsy response', fakeAsync(() => {
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));

    // 1. undefined response
    approvePrService.rejectPRService.and.returnValue(of(undefined));
    try {
      component.rejectPR();
      tick();
    } catch (e) {}

    // 2. empty string response
    approvePrService.rejectPRService.and.returnValue(of(''));
    component.rejectPR();
    tick();

    // 3. string object with Failure status
    const failureString = new String('') as any;
    failureString.status = 'Failure';
    failureString.message = 'Fail msg';
    approvePrService.rejectPRService.and.returnValue(of(failureString));
    component.rejectPR();
    tick();
  }));

  it('should handle downloadPR with all true flags and non-null values, and zoom controls', () => {
    component.viewPrByIdList = {
      ...mockPrData,
      singleVendor: true,
      suggestNewVendor: true,
      rateCardAvailable: true,
      priority: 'Urgent',
      futureRequirement: 'Annual',
      dueDate: '2026-12-31',
      prVendors: [{ companyName: 'V1', contactPerson: 'P1', email: 'v1@t.com', phone: '123' }],
      pritems: [{ serialNo: 1, description: 'I1', brand: 'B', unitofMeasures: 'PCS', quantity: 1 }],
      clientdeliverylocation: [{ address: 'A1', city: 'C1', state: 'S1' }]
    };
    component.downloadPR();
    expect(exportPdfService.addFooters).toHaveBeenCalled();

    // False and null values
    component.viewPrByIdList = {
      ...mockPrData,
      singleVendor: false,
      suggestNewVendor: false,
      rateCardAvailable: false,
      priority: null,
      futureRequirement: null,
      dueDate: null,
      prVendors: [],
      pritems: [],
      clientdeliverylocation: []
    };
    component.downloadPR();

    // Zoom controls
    component.zoomout();
    expect(dialogRef.updateSize).toHaveBeenCalledWith('70%');
    component.zoomin();
    expect(dialogRef.updateSize).toHaveBeenCalledWith('90%');
  });

});