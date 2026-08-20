import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PpoViewModalComponent } from './ppo-view-modal.component';

if (typeof (jsPDF as any).prototype?.autoTable !== 'function') {
  (jsPDF as any).prototype.autoTable = function (...args: any[]) {
    return (autoTable as any)(this, ...args);
  };
}
import { defaultAppConfig } from 'src/testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { EncryDecryService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from 'src/app/layout/client/services/client-service.service';
import { PposService } from 'src/app/layout/ppos/services/ppos.service';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

describe('PpoViewModalComponent', () => {
  let component: PpoViewModalComponent;
  let fixture: ComponentFixture<PpoViewModalComponent>;
  let toastr: any;
  let ppoService: any;
  let dialogRef: any;
  let matDialog: any;
  let encryDecryService: any;

  const mockPpoData = {
    id: 'ppo-100',
    ppoId: 'PPO-100',
    prId: 'PR-100',
    ppoValue: 1000,
    createdTS: '2024-01-01',
    deliveryTerms: 'Immediate',
    otherTerms: 'None',
    paymentTerms: 'Net 30',
    approvedBy: 'Approver',
    submittedBy: 'Reviewer',
    createdBy: 'Creator',
    procucevStatus: { uiDisplay: 'Submitted' },
    ppoitems: [
      {
        org: { id: 'org-1', companyName: 'Company 1' },
        description: 'Item 1',
        brand: 'B1',
        quantity: 10,
        unitofMeasures: 'Nos',
        unitprice: 100,
        excludetaxamount: 1000,
        gstValue: 180,
        totalamount: 1180
      }
    ]
  };

  const mockUserData = {
    details: {
      id: 'u1',
      username: 'approver1',
      role: { roleName: 'CategoryManager' },
      listofPermission: ['VIEW_PPO']
    }
  };

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('userFullName', 'John Approver');

    toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      warning: jasmine.createSpy('warning')
    };

    ppoService = {
      acceptPPO: jasmine.createSpy('acceptPPO').and.returnValue(of({ status: 'Success', message: 'Accepted' })),
      rejectPPO: jasmine.createSpy('rejectPPO').and.returnValue(of({ status: 'Success', message: 'Rejected' })),
      submitPPO: jasmine.createSpy('submitPPO').and.returnValue(of({ status: 'Success', message: 'Submitted' })),
      rejectPPOByCm: jasmine.createSpy('rejectPPOByCm').and.returnValue(of({ status: 'Success', message: 'Rejected by CM' })),
      updateAcceptPPOViaService: jasmine.createSpy('updateAcceptPPOViaService')
    };

    dialogRef = {
      close: jasmine.createSpy('close'),
      updateSize: jasmine.createSpy('updateSize')
    };

    matDialog = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of(true)
      }),
      closeAll: jasmine.createSpy('closeAll')
    };

    encryDecryService = {
      get: jasmine.createSpy('get').and.returnValue(JSON.stringify(mockUserData))
    };

    await TestBed.configureTestingModule({
      declarations: [PpoViewModalComponent],
      imports: [CommonModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => undefined, detectChanges: () => undefined } },
        { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => ({ attach: () => undefined, enable: () => undefined, disable: () => undefined, detach: () => undefined }) },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: JSON.parse(JSON.stringify(mockPpoData)) },
        { provide: EncryDecryService, useValue: encryDecryService },
        { provide: ToastrService, useValue: toastr },
        { provide: ClientService, useValue: {} },
        { provide: MatDialog, useValue: matDialog },
        { provide: PposService, useValue: ppoService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(PpoViewModalComponent, '')
      .overrideComponent(PpoViewModalComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(PpoViewModalComponent);
    component = fixture.componentInstance;
  });

  it('should create and initialize permissions', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.roleName).toBe('CategoryManager');
    expect(component.loggedUserDetails.id).toBe('u1');
  });

  it('should handle convertPo with and without selected items', () => {
    component.selectedPoItems = null;
    expect(component.convertPo()).toBeFalse();
    expect(toastr.warning).toHaveBeenCalledWith('Warning', 'Please select vendor from PPO Line Items tab');

    component.selectedPoItems = [{ id: 'item-1' }];
    component.convertPo();
    expect(matDialog.open).toHaveBeenCalled();
  });

  it('should handle acceptPPO for Accept and Reject (success and failure)', fakeAsync(() => {
    component.ngOnInit();

    // Accept Success
    component.acceptPPO('Accept');
    tick(500);
    if (swal.isVisible()) { swal.clickConfirm(); tick(500); }
    expect(ppoService.acceptPPO).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('Accepted', 'Success');
    expect(matDialog.closeAll).toHaveBeenCalled();

    // Accept Failure
    ppoService.acceptPPO.and.returnValue(of({ status: 'Failed' }));
    component.acceptPPO('Accept');
    tick(500);
    if (swal.isVisible()) { swal.clickConfirm(); tick(500); }
    expect(toastr.error).toHaveBeenCalledWith('PPO Acceptance failed', 'Failed');

    // Reject Success
    component.acceptPPO('Reject');
    tick(500);
    if (swal.isVisible()) { swal.clickConfirm(); tick(500); }
    expect(ppoService.rejectPPO).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('Rejected', 'Success');

    // Reject Failure
    ppoService.rejectPPO.and.returnValue(of({ status: 'Failed' }));
    component.acceptPPO('Reject');
    tick(500);
    if (swal.isVisible()) { swal.clickConfirm(); tick(500); }
    expect(toastr.error).toHaveBeenCalledWith('PPO Rejection failed', 'Failed');
    flush();
  }));

  it('should handle navigation, dialog size, onSelectedVendorFromPo, getPRdetails, and getAuctionData', () => {
    component.next();
    expect(component.selectedIndex).toBe(1);
    component.back();
    expect(component.selectedIndex).toBe(0);

    component.zoomout();
    expect(dialogRef.updateSize).toHaveBeenCalledWith('70%');
    component.zoomin();
    expect(dialogRef.updateSize).toHaveBeenCalledWith('100%');

    component.onSelectedVendorFromPo([{ id: 'v1' }]);
    expect(component.selectedPoItems).toEqual([{ id: 'v1' }]);

    component.getPRdetails({ id: 'pr-1' });
    expect(component.prDetails).toEqual({ id: 'pr-1' });

    component.getAuctionData({ id: 'auc-1' });
    expect(component.selectedauctionData).toEqual({ id: 'auc-1' });
  });

  it('should handle ppoActions across all action types (Submit, Accept, Reject, Reject_p)', fakeAsync(() => {
    component.ngOnInit();

    // Submit as non-CategoryManager2
    component.loggedUserDetails.role.roleName = 'CategoryManager';
    component.ppoActions('Submit');
    tick(500);
    if (swal.isVisible()) { swal.clickConfirm(); tick(500); }
    expect(ppoService.submitPPO).toHaveBeenCalled();

    // Submit as CategoryManager2
    component.loggedUserDetails.role.roleName = 'CategoryManager2';
    component.ppoActions('Submit');
    tick(500);
    if (swal.isVisible()) { swal.clickConfirm(); tick(500); }
    expect(ppoService.submitPPO).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('Submitted', 'Success');

    // Submit failure
    ppoService.submitPPO.and.returnValue(of({ status: 'Failed' }));
    component.ppoActions('Submit');
    tick(500);
    if (swal.isVisible()) { swal.clickConfirm(); tick(500); }
    expect(toastr.error).toHaveBeenCalledWith('PPO submission failed', 'Failed');

    // Accept action success & failure
    ppoService.acceptPPO.and.returnValue(of({ status: 'Success' }));
    component.ppoActions('Accept');
    tick(500);
    if (swal.isVisible()) { swal.clickConfirm(); tick(500); }
    expect(ppoService.acceptPPO).toHaveBeenCalled();

    ppoService.acceptPPO.and.returnValue(of({ status: 'Failed' }));
    component.ppoActions('Accept');
    tick(500);
    if (swal.isVisible()) { swal.clickConfirm(); tick(500); }
    expect(toastr.error).toHaveBeenCalledWith('PPO Acceptance failed', 'Failed');

    // Reject action success & failure
    ppoService.rejectPPO.and.returnValue(of({ status: 'Success' }));
    component.ppoActions('Reject');
    tick(500);
    if (swal.isVisible()) { swal.clickConfirm(); tick(500); }
    expect(ppoService.rejectPPO).toHaveBeenCalled();

    ppoService.rejectPPO.and.returnValue(of({ status: 'Failed' }));
    component.ppoActions('Reject');
    tick(500);
    if (swal.isVisible()) { swal.clickConfirm(); tick(500); }
    expect(toastr.error).toHaveBeenCalledWith('PPO Rejection failed', 'Failed');

    // Reject_p action success & failure
    ppoService.rejectPPOByCm.and.returnValue(of({ status: 'Success' }));
    component.ppoActions('Reject_p');
    tick(500);
    if (swal.isVisible()) { swal.clickConfirm(); tick(500); }
    expect(ppoService.rejectPPOByCm).toHaveBeenCalled();

    ppoService.rejectPPOByCm.and.returnValue(of({ status: 'Failed' }));
    component.ppoActions('Reject_p');
    tick(500);
    if (swal.isVisible()) { swal.clickConfirm(); tick(500); }
    expect(toastr.error).toHaveBeenCalledWith('PPO Rejection failed', 'Failed');

    // Client Accepted guard check
    component.data.procucevStatus = { uiDisplay: 'Client Accepted' };
    component.ppoActions('Submit');
    expect(toastr.error).toHaveBeenCalledWith('The following request cant be process as it has already Selected or Rejected PRs. Please unselect selected or rejected PRs', 'Failed');

    flush();
  }));

  it('should handle downloadPPO with full details, auction data, and empty fields', () => {
    component.prDetails = {
      prId: 'PR-100',
      deptName: 'Finance',
      singleVendor: true,
      suggestNewVendor: true,
      rateCardAvailable: true,
      prCorrespond: 'Email',
      prDescription: 'Project A',
      priority: 'High',
      estimatedPrvalue: 50000,
      futureRequirement: 'None',
      dueDate: new Date(),
      prVendors: [{ companyName: 'Vendor 1', contactPerson: 'John', email: 'j@v.com', phone: '123' }],
      pritems: [{ serialNo: 1, description: 'Item 1', brand: 'B1', unitofMeasures: 'Nos', quantity: 10 }],
      clientdeliverylocation: [{ address: 'Main St', city: 'NY', state: 'NY' }, { address: '', city: '', state: '' }]
    };

    component.selectedauctionData = {
      headers: [{ vname: 'Vendor 1', qid: 'Q1', vid: 'v1' }],
      items: [{ description: 'Item 1', data: [{ vendorid: 'v1', totalamount: 100 }] }]
    };

    component.downloadPPO();

    // Test with false flags and null fields
    component.prDetails.singleVendor = false;
    component.prDetails.suggestNewVendor = false;
    component.prDetails.rateCardAvailable = false;
    component.prDetails.prVendors = [];
    component.selectedauctionData = null;
    component.data.deliveryTerms = null;
    component.data.otherTerms = null;
    component.data.paymentTerms = null;

    component.downloadPPO();
    expect(component.prDetails).toBeDefined();
  });
});
