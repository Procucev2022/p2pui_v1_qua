import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { PpoCreateComponent } from './ppo-create.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { ToastrService } from 'ngx-toastr';
import { ConvertToBase64Service } from '../../services/convert-to-base64.service';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { swalConfirm } from 'src/app/shared/helpers/swal-confirm';

describe('PpoCreateComponent', () => {
  let component: PpoCreateComponent;
  let fixture: ComponentFixture<PpoCreateComponent>;
  let procService: any;
  let toastr: any;
  let modalDialog: any;
  let convertSer: any;
  let dialogRef: any;

  const opexData = {
    ppoValue: 100,
    prId: 'pr1',
    rfq: 'rfq1',
    ppoitems: [
      { id: 'i1', vendorId: 'v1', excludetaxamount: 50, gstValue: '5', isActive: true },
      { id: null, vendorId: 'v2', excludetaxamount: 10, gstValue: '1' },
      { id: 'i2', vendorId: 'v3', excludetaxamount: 40, gstValue: '4', item_NA: true },
    ],
  };

  beforeEach(async () => {
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('userFullName', 'Tester');
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    procService = autoMock('CatProcuRequestsService');
    toastr = autoMock('ToastrService');
    modalDialog = autoMock('MatDialog');
    convertSer = autoMock('ConvertToBase64Service');
    dialogRef = autoMock('MatDialogRef');
    convertSer.getBase64.and.returnValue(Promise.resolve('data:text/plain;base64,QQ=='));
    procService.createPPO.and.returnValue(of({ status: 'Success' }));

    await TestBed.configureTestingModule({
      declarations: [PpoCreateComponent],
      imports: [CommonModule],
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
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: opexData },
        { provide: CatProcuRequestsService, useValue: procService },
        { provide: ToastrService, useValue: toastr },
        { provide: MatDialog, useValue: modalDialog },
        { provide: ConvertToBase64Service, useValue: convertSer },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(PpoCreateComponent, '')
      .overrideComponent(PpoCreateComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(PpoCreateComponent);
    component = fixture.componentInstance;
    seedComponent(component as any);
  });

  it('should init opex and capex paths', () => {
    component.data = opexData;
    component.ngOnInit();
    expect(component.ppoItemsArray.length).toBe(2);
    expect(component.sumOfExcludetaxamount).toBe(90);

    component.data = {
      isCapex: true,
      data: {
        ppoValue: 200,
        vendor: 'V1',
        pr: { id: 'prC' },
        ppoitems: [
          { unitPrice: 10, totalBasicAmount: 20, gstValue: '2', vendorId: 'v1' },
          { unitPrice: 5, totalBasicAmount: 5, gstValue: '1', vendorId: 'v2' },
        ],
      },
    };
    component.ngOnInit();
    expect(component.ppoItemsArray.length).toBe(2);
    expect(component.sumOfExcludetaxamount).toBe(200);
  });

  it('should close and createConfirm opex success failure', () => {
    component.data = opexData;
    component.ngOnInit();
    component.closeDialog();
    expect(dialogRef.close).toHaveBeenCalled();

    const swalSpy = spyOn(swalConfirm, 'open').and.callFake(() => ({
      then: (cb: any) => {
        cb({ value: true });
        return Promise.resolve();
      },
    } as any));
    component.createConfirmPPO();
    expect(toastr.success).toHaveBeenCalled();
    expect(modalDialog.closeAll).toHaveBeenCalled();

    procService.createPPO.and.returnValue(of({ statusCode: 'Success' }));
    component.createConfirmPPO();

    procService.createPPO.and.returnValue(of({ status: 'Failure' }));
    component.createConfirmPPO();
    expect(toastr.error).toHaveBeenCalled();

    swalSpy.and.callFake(() => ({
      then: (cb: any) => {
        cb({ value: false });
        return Promise.resolve();
      },
    } as any));
    component.createConfirmPPO();
  });

  it('should createConfirm capex success and failure', () => {
    component.data = {
      isCapex: true,
      data: {
        ppoValue: 20,
        vendor: 'V1',
        pr: { id: 'prC' },
        ppoitems: [{ unitPrice: 10, totalBasicAmount: 20, gstValue: '0', vendorId: 'v1' }],
      },
    };
    component.ngOnInit();
    spyOn(swalConfirm, 'open').and.callFake(() => ({
      then: (cb: any) => {
        cb({ value: true });
        return Promise.resolve();
      },
    } as any));
    procService.createPPO.and.returnValue(of({ status: 'Success' }));
    component.createConfirmPPO();
    expect(toastr.success).toHaveBeenCalled();

    procService.createPPO.and.returnValue(of({ status: 'Failure' }));
    component.createConfirmPPO();
    expect(toastr.error).toHaveBeenCalled();
  });

  it('should upload delete documents', async () => {
    component.documentsArray = [{ fileName: 'a' }, { fileName: 'b' }];
    component.deleteDocuments(0, 'documentsArray');
    (component as any).other = [{ fileName: 'x' }];
    component.deleteDocuments(0, 'other');
    component.uploadFile({});
    await component.uploadDocuments([{ name: 'f.txt' }]);
    expect(component.documentsArray.some((d) => d.fileName === 'f.txt')).toBe(true);
  });
});

