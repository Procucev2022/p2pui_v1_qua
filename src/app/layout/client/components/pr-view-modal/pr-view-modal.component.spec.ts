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

    // Reject Success
    component.rejectPR();
    tick();
    expect(approvePrService.rejectPRService).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('PR Rejection done successfully', 'Success');
    expect(dialogRef.close).toHaveBeenCalledWith({ event: 'Success' });

    // Reject Failure
    approvePrService.rejectPRService.and.returnValue(of({ status: 'Failure', message: 'Reject failed' }));
    component.rejectPR();
    tick();
    expect(toastr.error).toHaveBeenCalledWith('Reject failed', 'Failure');
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
});
