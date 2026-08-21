import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { LinkedPrPpoCreateComponent } from './linked-pr-ppo-create.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { ToastrService } from 'ngx-toastr';
import { ConvertToBase64Service } from '../../services/convert-to-base64.service';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { swalConfirm } from 'src/app/shared/helpers/swal-confirm';

describe('LinkedPrPpoCreateComponent', () => {
  let component: LinkedPrPpoCreateComponent;
  let fixture: ComponentFixture<LinkedPrPpoCreateComponent>;
  let procService: any;
  let toastr: any;
  let dialogRef: any;
  let convertSer: any;

  const dialogData = {
    ppoValue: 100,
    prId: { id: 'pr1' },
    ppoitems: [
      { id: 'i1', vendorId: 'v1', quantity: 2, linkedItemPrice: 10, description: 'A', isActive: true, item_NA: false },
      { id: 'i2', vendorId: 'v2', quantity: 1, linkedItemPrice: 5, description: 'B' },
    ],
  };

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('userFullName', 'Tester');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    procService = autoMock('CatProcuRequestsService');
    toastr = autoMock('ToastrService');
    dialogRef = autoMock('MatDialogRef');
    convertSer = autoMock('ConvertToBase64Service');
    convertSer.getBase64.and.returnValue(Promise.resolve('data:text/plain;base64,AAA='));
    procService.createPPO.and.returnValue(of({ status: 'Success' }));

    await TestBed.configureTestingModule({
      declarations: [LinkedPrPpoCreateComponent],
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
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: CatProcuRequestsService, useValue: procService },
        { provide: ToastrService, useValue: toastr },
        { provide: MatDialog, useValue: autoMock('MatDialog') },
        { provide: ConvertToBase64Service, useValue: convertSer },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(LinkedPrPpoCreateComponent, '')
      .overrideComponent(LinkedPrPpoCreateComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(LinkedPrPpoCreateComponent);
    component = fixture.componentInstance;
    
    const sampleRow: any = {
      id: '1', vendorId: 'v1', ID: '1', name: 'n', status: 'Open', status_ui_display: 'Open',
      description: 'desc1', projectCategory: 'cat1', projectSubCategory: 'subcat1', brand: 'b1',
      quantity: 10, unitofMeasures: 'KG', unitprice: 100, excludetaxamount: 1000, gstValue: 180, totalamount: 1180,
      uom: { description: 'KG', id: 'u1' }, vendorData: ['v1'], action: null, org: { id: 'o1', companyName: 'Org1' },
      certificates: [{ fileName: 'c.pdf', file: 'AAA' }], clientStatus: { uiDisplay: 'Open' },
      createdTS: new Date().toISOString(), query: 'a|b', pricePerUnit: 10, rank: 1, city: 'City1',
      vendorName: 'Vendor1', companyId: 'comp1', lineItems: [], documents: [], items: [],
      rfqData: { id: '1' }, vendorRequest: { id: '1' }, vendorDataObj: { id: '1' },
    };
        (component as any).ppoData = { ppoItems: [sampleRow], id: '1', ppoNumber: 'PPO1', ppoId: '1', prId: '1' };
    (component as any).prDetails = { id: '1', lineItems: [sampleRow] };
    (component as any).data = (component as any).data || { ppoId: '1', prId: '1', id: '1', status: 'Success', items: [sampleRow], lineItems: [sampleRow], vendorProduct: [sampleRow], vendorService: [sampleRow], rfqData: sampleRow, vendors: [sampleRow] };
    (component as any).rfqDataList = [sampleRow];
    (component as any).cache_rfqDataList = [sampleRow];
    (component as any).clientList = [sampleRow];

    seedComponent(component as any);
  });

  it('should init map items', () => {
    component.ngOnInit();
    expect(component.ppoItemsArray.length).toBe(2);
    expect(component.ppoItemsArray[0].totalBasicAmount).toBe(20);
    expect(component.ppoItemsArray[0].gstValue).toBe(0);
  });

  it('should closeDialog', () => {
    component.closeDialog();
    expect(dialogRef.close).toHaveBeenCalledWith({ event: 'Cancel' });
  });

  it('should createConfirmPPO success status and statusCode and failure', () => {
    component.ngOnInit();
    component.paymentTerms = 'p';
    component.otherTerms = 'o';
    component.deliveryTerms = 'd';
    const swalSpy = spyOn(swalConfirm, 'open').and.callFake(() => ({
      then: (cb: any) => {
        cb({ value: true });
        return Promise.resolve();
      },
    } as any));

    component.createConfirmPPO();
    expect(procService.createPPO).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith({ event: 'ppoCreated' });

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

  it('should upload and delete documents', async () => {
    component.documentsArray = [{ fileName: 'a' }, { fileName: 'b' }];
    component.deleteDocuments(0, 'documentsArray');
    expect(component.documentsArray.length).toBeLessThan(2);

    (component as any).other = [{ fileName: 'x' }];
    component.deleteDocuments(0, 'other');
    component.uploadFile({});
    await component.uploadDocuments([{ name: 'f.txt' }]);
    expect(component.documentsArray.some((d) => d.fileName === 'f.txt')).toBe(true);
  });
});

