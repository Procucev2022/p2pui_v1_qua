import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { GeneratedPposComponent } from './generated-ppos.component';
import { defaultAppConfig } from '../../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { ToastrService } from 'ngx-toastr';
import { PposService } from '../../services/ppos.service';
import { EncryDecryService } from 'src/app/shared/services';
import { ExcelService } from 'src/app/shared/modules/common-share/services/excel.service';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog } from '@angular/material/dialog';
import { swalConfirm } from 'src/app/shared/helpers/swal-confirm';

describe('GeneratedPposComponent', () => {
  let component: GeneratedPposComponent;
  let fixture: ComponentFixture<GeneratedPposComponent>;
  let toastr: any;
  let ppoSer: any;
  let encryDecryService: any;
  let excelService: any;
  let matDialog: any;

  const mockUserDetails = {
    id: 'u1',
    role: { roleName: 'CategoryManager' },
    org: { id: 'org1' },
    department: { id: 'dept1' },
    listofPermission: ['READ', 'WRITE']
  };

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('userFullName', 'Test User');

    toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error')
    };

    ppoSer = {
      acceptPPOViaService: jasmine.createSpy('acceptPPOViaService').and.returnValue(of(true)),
      getAllPPOS: jasmine.createSpy('getAllPPOS').and.returnValue(of([
        { id: 'p1', ppoId: 'PPO-1', desc: 'Desc 1', ppoValue: 100, createdTS: '2026-08-18T00:00:00Z', procucevStatus: { uiDisplay: 'Submitted' } }
      ])),
      getClientPPOS: jasmine.createSpy('getClientPPOS').and.returnValue(of([
        { id: 'p1', ppoId: 'PPO-1', desc: 'Desc 1', ppoValue: 100, createdTS: '2026-08-18T00:00:00Z', procucevStatus: { uiDisplay: 'Submitted' }, userStatus: { uiDisplay: 'Pending' } },
        { id: 'p2', ppoId: 'PPO-2', desc: 'Desc 2', ppoValue: 200, createdTS: '2026-08-18T00:00:00Z', procucevStatus: { uiDisplay: 'Submitted' }, userStatus: null }
      ])),
      PPOByCm: jasmine.createSpy('PPOByCm').and.returnValue(of([{ id: 'item1' }])),
      submitPPO: jasmine.createSpy('submitPPO').and.returnValue(of({ status: 'Success', message: 'Submitted' })),
      acceptPPO: jasmine.createSpy('acceptPPO').and.returnValue(of({ status: 'Success', message: 'Accepted' })),
      rejectPPO: jasmine.createSpy('rejectPPO').and.returnValue(of({ status: 'Success', message: 'Rejected' })),
      rejectPPOByCm: jasmine.createSpy('rejectPPOByCm').and.returnValue(of({ status: 'Success', message: 'Rejected by CM' }))
    };

    encryDecryService = {
      get: jasmine.createSpy('get').and.returnValue(JSON.stringify({ details: mockUserDetails }))
    };

    excelService = {
      exportAsExcelFile: jasmine.createSpy('exportAsExcelFile')
    };

    matDialog = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of({ event: 'Ok' })
      })
    };

    await TestBed.configureTestingModule({
      declarations: [GeneratedPposComponent],
      imports: [CommonModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => undefined, detectChanges: () => undefined } },
        DatePipe,
        { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => ({ attach: () => undefined, enable: () => undefined, disable: () => undefined, detach: () => undefined }) },
        { provide: MatDialog, useValue: matDialog },
        { provide: ToastrService, useValue: toastr },
        { provide: PposService, useValue: ppoSer },
        { provide: EncryDecryService, useValue: encryDecryService },
        { provide: ExcelService, useValue: excelService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(GeneratedPposComponent, '')
      .overrideComponent(GeneratedPposComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(GeneratedPposComponent);
    component = fixture.componentInstance;
  });

  it('should create and initialize for CategoryManager', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.loggedUserDetails.role.roleName).toBe('CategoryManager');
    expect(component.isShowCheckbox).toBeTrue();
    expect(ppoSer.getAllPPOS).toHaveBeenCalled();
    expect(ppoSer.getClientPPOS).toHaveBeenCalled();
  });

  it('should initialize for PRApprover2 and push userStatus header', () => {
    const approverDetails = { ...mockUserDetails, role: { roleName: 'PRApprover2' } };
    encryDecryService.get.and.returnValue(JSON.stringify({ details: approverDetails }));
    ppoSer.acceptPPOViaService.and.returnValue(of(false));

    component.ngOnInit();
    expect(component.pposHeaders.some(h => h.field === 'userStaus_display')).toBeTrue();
  });

  it('should handle role branches in getAllPPOs', () => {
    // CategoryManagerBasic
    component.loggedUserDetails = { ...mockUserDetails, role: { roleName: 'CategoryManagerBasic' } };
    component.getAllPPOs();
    expect(component.isShowCheckbox).toBeFalse();

    // CategoryManager2
    component.loggedUserDetails = { ...mockUserDetails, role: { roleName: 'CategoryManager2' } };
    component.getAllPPOs();
    expect(component.isShowCheckbox).toBeTrue();

    // CategoryManagerBasic2
    component.loggedUserDetails = { ...mockUserDetails, role: { roleName: 'CategoryManagerBasic2' } };
    component.getAllPPOs();
    expect(component.isShowCheckbox).toBeFalse();

    // PRApprover
    component.loggedUserDetails = { ...mockUserDetails, role: { roleName: 'PRApprover' } };
    component.getAllPPOs();
    expect(component.isShowCheckbox).toBeTrue();

    // Other role
    component.loggedUserDetails = { ...mockUserDetails, role: { roleName: 'OtherRole' } };
    component.getAllPPOs();
    expect(component.isShowCheckbox).toBeFalse();

    // Non-array response
    ppoSer.getAllPPOS.and.returnValue(of(null));
    component.getAllPPOs();
  });

  it('should handle role branches in getClientPPOS', () => {
    // ClientInitiator
    component.loggedUserDetails = { ...mockUserDetails, role: { roleName: 'ClientInitiator' } };
    component.getClientPPOS();

    // clientInitiator1.1
    component.loggedUserDetails = { ...mockUserDetails, role: { roleName: 'clientInitiator1.1' } };
    component.getClientPPOS();

    // PRApprover
    component.loggedUserDetails = { ...mockUserDetails, role: { roleName: 'PRApprover' } };
    component.getClientPPOS();

    // PRApprover2
    component.loggedUserDetails = { ...mockUserDetails, role: { roleName: 'PRApprover2' } };
    component.getClientPPOS();

    // Other role
    component.loggedUserDetails = { ...mockUserDetails, role: { roleName: 'Other' } };
    component.getClientPPOS();

    // Non-array response
    ppoSer.getClientPPOS.and.returnValue(of(null));
    component.getClientPPOS();
  });

  it('should view PPO and handle modal close', () => {
    const row = { id: 'p1', ppoId: 'PPO-1' };
    component.loggedUserDetails = mockUserDetails;
    component.viewPPO(row);
    expect(row['ppoitems']).toEqual([{ id: 'item1' }]);
    expect(ppoSer.PPOByCm).toHaveBeenCalledWith({ id: 'p1' });
    expect(matDialog.open).toHaveBeenCalled();
  });

  it('should view correspondence and handle modal close', () => {
    const row = { id: 'p1', ppoId: 'PPO-1' };
    component.loggedUserDetails = mockUserDetails;
    component.viewCorresspondance(row);
    expect(row['commentRootPath']).toBe('PPO-COMMENTS-MODAL');
    expect(matDialog.open).toHaveBeenCalled();
  });

  it('should handle onPage event', () => {
    const pageEvent = { page: 1, pageSize: 10 };
    component.onPage(pageEvent);
    expect(component.paginatoryDetails).toBe(pageEvent);
  });

  it('should export data as XLSX', () => {
    component.pposList = [
      { ppoId: 'P1', desc: 'Desc', ppoValue: 100, createdTS: '2026-08-18', procucevStatus: { uiDisplay: 'Submitted' } }
    ];
    component.exportAsXLSX();
    expect(excelService.exportAsExcelFile).toHaveBeenCalled();
  });

  it('should block ppoActions when selectedData contains already accepted or rejected items', () => {
    component.selectedData = [
      { id: '1', procucevStatus: { uiDisplay: 'Client Accepted' } },
      { id: '2', procucevStatus: { uiDisplay: 'Client Rejected' } }
    ];
    component.ppoActions('Submit');
    expect(toastr.error).toHaveBeenCalled();
  });

  it('should execute Submit action successfully and on failure', fakeAsync(() => {
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));
    component.loggedUserDetails = { ...mockUserDetails, role: { roleName: 'CategoryManager2' } };
    component.selectedData = [{ id: '1', procucevStatus: { uiDisplay: 'Open' } }];

    // Success
    ppoSer.submitPPO.and.returnValue(of({ status: 'Success', message: 'Submitted OK' }));
    component.ppoActions('Submit');
    tick();
    expect(toastr.success).toHaveBeenCalledWith('Submitted OK', 'Success');

    // statusCode branch
    ppoSer.submitPPO.and.returnValue(of({ statusCode: 'Success', message: 'Submitted OK 2' }));
    component.ppoActions('Submit');
    tick();

    // Failure
    ppoSer.submitPPO.and.returnValue(of({ status: 'Error' }));
    component.ppoActions('Submit');
    tick();
    expect(toastr.error).toHaveBeenCalledWith('PPO submission failed', 'Failed');

    // Cancelled in swal
    (swalConfirm.open as jasmine.Spy).and.returnValue(Promise.resolve({ value: false }));
    component.ppoActions('Submit');
    tick();
    flush();
  }));

  it('should execute Accept action successfully and on failure', fakeAsync(() => {
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));
    component.loggedUserDetails = mockUserDetails;
    component.selectedData = [
      { id: '1', procucevStatus: { uiDisplay: 'Submitted' } },
      { id: '2', procucevStatus: { uiDisplay: 'Draft' } }
    ];

    // Success
    ppoSer.acceptPPO.and.returnValue(of({ status: 'Success', message: 'Accepted OK' }));
    component.ppoActions('Accept');
    tick();
    expect(toastr.success).toHaveBeenCalledWith('Accepted OK', 'Success');

    // Failure
    ppoSer.acceptPPO.and.returnValue(of({ status: 'Error' }));
    component.ppoActions('Accept');
    tick();
    expect(toastr.error).toHaveBeenCalledWith('PPO Acceptance failed', 'Failed');

    // Cancelled
    (swalConfirm.open as jasmine.Spy).and.returnValue(Promise.resolve({ value: false }));
    component.ppoActions('Accept');
    tick();
    flush();
  }));

  it('should execute Reject action successfully and on failure', fakeAsync(() => {
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));
    component.loggedUserDetails = mockUserDetails;
    component.selectedData = [{ id: '1', procucevStatus: { uiDisplay: 'Open' } }];

    // Success
    ppoSer.rejectPPO.and.returnValue(of({ status: 'Success', message: 'Rejected OK' }));
    component.ppoActions('Reject');
    tick();
    expect(toastr.success).toHaveBeenCalledWith('Rejected OK', 'Success');

    // Failure
    ppoSer.rejectPPO.and.returnValue(of({ status: 'Error' }));
    component.ppoActions('Reject');
    tick();
    expect(toastr.error).toHaveBeenCalledWith('PPO Rejection failed', 'Failed');

    // Cancelled
    (swalConfirm.open as jasmine.Spy).and.returnValue(Promise.resolve({ value: false }));
    component.ppoActions('Reject');
    tick();
    flush();
  }));

  it('should execute Reject_p action successfully and on failure', fakeAsync(() => {
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));
    component.loggedUserDetails = mockUserDetails;
    component.selectedData = [{ id: '1', procucevStatus: { uiDisplay: 'Open' } }];

    // Success
    ppoSer.rejectPPOByCm.and.returnValue(of({ status: 'Success', message: 'Rejected by CM OK' }));
    component.ppoActions('Reject_p');
    tick();
    expect(toastr.success).toHaveBeenCalledWith('Rejected by CM OK', 'Success');

    // Failure
    ppoSer.rejectPPOByCm.and.returnValue(of({ status: 'Error' }));
    component.ppoActions('Reject_p');
    tick();
    expect(toastr.error).toHaveBeenCalledWith('PPO Rejection failed', 'Failed');

    // Cancelled
    (swalConfirm.open as jasmine.Spy).and.returnValue(Promise.resolve({ value: false }));
    component.ppoActions('Reject_p');
    tick();
    flush();
  }));
});
