import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { VendorRFQComponent } from './vendor-rfq.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { EncryDecryService } from 'src/app/shared/services';
import { RfqService } from '../services/rfq.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog } from '@angular/material/dialog';
import { swalConfirm } from 'src/app/shared/helpers/swal-confirm';

describe('VendorRFQComponent', () => {
  let component: VendorRFQComponent;
  let fixture: ComponentFixture<VendorRFQComponent>;
  let encry: any;
  let rfqservice: any;
  let toastr: any;
  let dialog: any;

  const future = new Date(Date.now() + 86400000).toISOString();
  const past = new Date(Date.now() - 86400000).toISOString();

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    encry = autoMock('EncryDecryService');
    rfqservice = autoMock('RfqService');
    toastr = autoMock('ToastrService');
    dialog = autoMock('MatDialog');
    encry.get.and.returnValue(
      JSON.stringify({
        details: {
          id: 'u1',
          role: { roleName: 'Vendor' },
          listofPermission: ['P1'],
        },
      })
    );
    rfqservice.getAllRFQdata.and.returnValue(of([{ id: 'r1', rfqId: 'RFQ1' }]));
    rfqservice.getLineitemsById.and.returnValue(of([{ id: 'li1' }]));
    rfqservice.acceptRfqByvendor.and.returnValue(of({ status: 'Success', message: 'ok' }));
    rfqservice.rejectRfqByvendor.and.returnValue(of({ status: 'Success', message: 'ok' }));
    rfqservice.fetchRfqById.and.returnValue(of({ id: 'r1', desc: 'D' }));
    dialog.open.and.returnValue({ afterClosed: () => of({ event: 'submit' }) });

    await TestBed.configureTestingModule({
      declarations: [VendorRFQComponent],
      imports: [CommonModule, NoopAnimationsModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: autoMock('ChangeDetectorRef') },
        DatePipe,
        {
          provide: MAT_DIALOG_SCROLL_STRATEGY,
          useValue: () => ({
            attach: () => undefined,
            enable: () => undefined,
            disable: () => undefined,
            detach: () => undefined,
          }),
        },
        { provide: MatDialog, useValue: dialog },
        { provide: EncryDecryService, useValue: encry },
        { provide: RfqService, useValue: rfqservice },
        { provide: ToastrService, useValue: toastr },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(VendorRFQComponent, '')
      .overrideComponent(VendorRFQComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(VendorRFQComponent);
    component = fixture.componentInstance;
    seedComponent(component as any);
  });

  it('should init and list rfqs', () => {
    component.ngOnInit();
    expect(component.rfqDataList.length).toBe(1);
    rfqservice.getAllRFQdata.and.returnValue(of(null));
    component.getRFQList();
    expect(component.rfqDataList).toEqual([]);
  });

  it('should expand close line items page and correspondence', () => {
    component.ngOnInit();
    component.getRFQLineItems({ id: 'r1' }, {});
    expect(component.expandedRows['r1']).toBe(1);
    component.getCloseRFQLineItems({ id: 'r1' }, {});
    expect(component.expandedRows).toEqual({});
    component.onPage({ page: 1 });
    component.getLineItems({});
    component.viewCorresspondance({ id: 'r1' });
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should createQuotation branches', () => {
    component.createQuotation();
    expect(toastr.error).toHaveBeenCalledWith('Please select a record!');

    component.selectedData = [
      { rfquuid: 'u1', vendorStatus: { uiDisplay: 'New' }, vendorResponseDate: future },
    ];
    component.createQuotation();
    expect(toastr.error).toHaveBeenCalled();

    component.selectedData = [
      { rfquuid: 'u1', vendorStatus: { uiDisplay: 'Accepted' }, vendorResponseDate: past },
    ];
    component.createQuotation();

    component.selectedData = [
      { rfquuid: 'u1', vendorStatus: { uiDisplay: 'Accepted' }, vendorResponseDate: future },
    ];
    component.createQuotation();
    expect(dialog.open).toHaveBeenCalled();

    rfqservice.getLineitemsById.and.returnValue(of([]));
    component.selectedData = [
      { rfquuid: 'u1', vendorStatus: { uiDisplay: 'Accepted' }, vendorResponseDate: future },
    ];
    component.createQuotation();
  });

  it('should accept and reject quotation paths', () => {
    const swalSpy = spyOn(swalConfirm, 'open').and.callFake(() => ({
      then: (cb: any) => {
        cb({ value: true });
        return Promise.resolve();
      },
    } as any));

    component.acceptQuotation();
    expect(toastr.error).toHaveBeenCalled();

    component.selectedData = [{ id: 'r1', vendorResponseDate: past }];
    component.acceptQuotation();

    component.selectedData = [{ id: 'r1', vendorResponseDate: future, cmUser: 'cm1' }];
    component.loggedUserDetails = { id: 'u1', role: { roleName: 'Vendor' } };
    component.acceptQuotation();
    expect(rfqservice.acceptRfqByvendor).toHaveBeenCalled();

    component.loggedUserDetails = { id: 'u1', role: { roleName: 'CategoryManager' } };
    component.selectedData = [{ id: 'r1', vendorResponseDate: future }];
    rfqservice.acceptRfqByvendor.and.returnValue(of({ status: 'Failure', message: 'bad' }));
    component.acceptQuotation();

    component.selectedData = [{ id: 'r1', vendorResponseDate: future }];
    swalSpy.and.callFake(() => ({
      then: (cb: any) => {
        cb({ value: false });
        return Promise.resolve();
      },
    } as any));
    component.acceptQuotation();

    swalSpy.and.callFake(() => ({
      then: (cb: any) => {
        cb({ value: true });
        return Promise.resolve();
      },
    } as any));
    component.rejectQuotation();
    component.selectedData = [];
    component.rejectQuotation();

    component.selectedData = [{ id: 'r1', vendorResponseDate: past }];
    component.rejectQuotation();

    component.selectedData = [{ id: 'r1', vendorResponseDate: future }];
    component.loggedUserDetails = { id: 'u1', role: { roleName: 'CategoryManager' } };
    rfqservice.rejectRfqByvendor.and.returnValue(of({ status: 'Success', message: 'ok' }));
    component.rejectQuotation();

    component.loggedUserDetails = { id: 'u1', role: { roleName: 'Vendor' } };
    component.selectedData = [{ id: 'r1', vendorResponseDate: future, cmUser: null }];
    rfqservice.rejectRfqByvendor.and.returnValue(of({ status: 'Failure', message: 'bad' }));
    component.rejectQuotation();
  });

  it('should view RFQ details success and failure', () => {
    component.viewRFQDetails({ rfquuid: 'u1', vendorResponseDate: future });
    expect(dialog.open).toHaveBeenCalled();

    rfqservice.fetchRfqById.and.returnValue(of(null));
    component.viewRFQDetails({ rfquuid: 'u1', vendorResponseDate: future });
    expect(toastr.error).toHaveBeenCalled();
  });
});
