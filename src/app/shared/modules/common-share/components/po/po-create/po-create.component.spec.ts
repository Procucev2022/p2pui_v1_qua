import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { PoCreateComponent } from './po-create.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { EncryDecryService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from 'src/app/layout/client/services/client-service.service';
import { ConvertToBase64Service } from '../../../services/convert-to-base64.service';
import { PoService } from '../../../services/po.service';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { swalConfirm } from 'src/app/shared/helpers/swal-confirm';

describe('PoCreateComponent', () => {
  let component: PoCreateComponent;
  let fixture: ComponentFixture<PoCreateComponent>;
  let encry: any;
  let toaster: any;
  let poService: any;
  let convertSer: any;
  let dialogRef: any;

  const createData = {
    isPoCreate: true,
    ppoId: 'ppo1',
    ppoData: { id: 'ppo1', prsid: 'pr1' },
    poItemsData: {
      vendorId: 'v1',
      poItemsHeaders: [{ field: 'description' }],
      lineItemsList: [
        { id: 'i1', quantity: 5, poQuantity: 5, excludetaxamount: 10, gstValue: 1, unitprice: 10 },
        { id: 'i2', quantity: 2, poQuantity: 2, excludetaxamount: 5, gstValue: 0, unitprice: 5 },
      ],
    },
  };

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('loggedId', 'u1');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    encry = autoMock('EncryDecryService');
    toaster = autoMock('ToastrService');
    poService = autoMock('PoService');
    convertSer = autoMock('ConvertToBase64Service');
    dialogRef = autoMock('MatDialogRef');
    encry.get.and.returnValue(
      JSON.stringify({ details: { role: { roleName: 'CategoryManager' }, org: { id: 'o1' } } })
    );
    poService.getVendorsBranches.and.returnValue(of([{ id: 'b1' }]));
    poService.getDynamicFieldsByClientId.and.returnValue(of([{ id: 'df1', name: 'f' }]));
    poService.createPO.and.returnValue(of({ status: 'Success' }));
    poService.updatePO.and.returnValue(of({ status: 'Success' }));
    convertSer.getBase64.and.returnValue(Promise.resolve('data:text/plain;base64,QQ=='));

    await TestBed.configureTestingModule({
      declarations: [PoCreateComponent],
      imports: [CommonModule, FormsModule],
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
        { provide: MAT_DIALOG_DATA, useValue: createData },
        { provide: EncryDecryService, useValue: encry },
        { provide: ToastrService, useValue: toaster },
        { provide: ClientService, useValue: autoMock('ClientService') },
        { provide: ConvertToBase64Service, useValue: convertSer },
        { provide: MatDialog, useValue: autoMock('MatDialog') },
        { provide: PoService, useValue: poService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(PoCreateComponent, '')
      .overrideComponent(PoCreateComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(PoCreateComponent);
    component = fixture.componentInstance;
    component.data = JSON.parse(JSON.stringify(createData));
    seedComponent(component as any);
  });

  it('should init create and edit modes', () => {
    component.ngOnInit();
    expect(component.isPOCreate).toBe(true);
    expect(component.vendorBranches.length).toBe(1);

    poService.getVendorsBranches.and.returnValue(of({ status: 'Failure' }));
    component.getVendorsBranches();
    expect(component.vendorBranches).toEqual([]);

    poService.getVendorsBranches.and.returnValue(throwError(() => new Error('e')));
    component.getVendorsBranches();
    expect(component.vendorBranches).toEqual([]);

    poService.getDynamicFieldsByClientId.and.returnValue(of({ status: 'Failure' }));
    component.generateDynamicClientFields({ id: 'o1' });

    component.data = {
      isPoCreate: true,
      ppoId: 'ppo1',
      ppoData: { id: 'ppo1', prsid: 'pr1' },
      poItemsData: { vendorId: 'v1' },
    };
    component.generateFormData();
    expect(component.tableHeaders).toEqual([]);
    expect(component.tableColumnData).toEqual([]);

    component.data = {
      isPoCreate: false,
      poData: {
        poId: 'PO1',
        poValue: 10,
        advance: true,
        dynamicfields: [],
        documents: [],
        poitems: [{ id: 'i1', quantity: 1, poQuantity: 0, excludetaxamount: 1, gstValue: 0 }],
        vendor: { id: 'v1' },
      },
    };
    component.generateFormData();
    expect(component.poId).toBe('PO1');
    poService.getVendorsBranches.and.returnValue(of([{ id: 'b2' }]));
    component.getVendorsBranches();
    expect(component.vendorBranches.length).toBe(1);

    component.getTotalPoAmount([{ poQuantity: 0, excludetaxamount: 5, gstValue: 1 }]);
    component.selectedData = [{ poQuantity: 0, excludetaxamount: 5, gstValue: 1 }];
    component.checkValue({});

    component.data = JSON.parse(JSON.stringify(createData));
    component.selectedData = [{ poQuantity: 0, quantity: 1, id: 'i9', unitprice: 1, gstValue: 0 }];
    component.dynamicFields = [{ id: 'df9' }];
    component.buildCreatePoJson();
  });

  it('should totals quantity files and generate/update PO', async () => {
    component.ngOnInit();
    component.onGetPoTotal({ poQuantity: 20, quantity: 5 });
    expect(toaster.warning).toHaveBeenCalled();
    component.onGetPoTotal({ poQuantity: -1, quantity: 5 });
    component.getTotalPoAmount([]);
    component.selectedData = [];
    component.checkValue({});
    component.selectedData = [{ poQuantity: 1, excludetaxamount: 10, gstValue: 1 }];
    component.checkValue({});

    await component.filesDropped([{ name: 'a.txt' }]);
    await component.fileUploadEvent({ target: { files: [{ name: 'b.txt' }] } }, false);
    component.deleteAttachments(0);
    component.resetForm({ reset: jasmine.createSpy('reset') } as any);

    component.poValue = 0;
    component.generatePo({ form: { invalid: false } } as any);

    component.poValue = 100;
    component.selectedData = [];
    component.generatePo({ form: { invalid: false } } as any);

    component.selectedData = [{ poQuantity: 0, quantity: 5, id: 'i1', excludetaxamount: 1, gstValue: 0, unitprice: 1 }];
    component.generatePo({ form: { invalid: false } } as any);

    component.selectedData = [{ poQuantity: 2, quantity: 5, id: 'i1', excludetaxamount: 1, gstValue: 0, unitprice: 1 }];
    component.isQuantityValid = true;
    component.generatePo({ form: { invalid: false } } as any);

    component.isQuantityValid = false;
    component.generatePo({ form: { invalid: true } } as any);

    const swalSpy = spyOn(swalConfirm, 'open').and.callFake(() => ({
      then: (cb: any) => {
        cb({ value: true });
        return Promise.resolve();
      },
    } as any));
    component.dynamicFields = [{ id: 'df1' }];
    component.generatePo({ form: { invalid: false } } as any);
    expect(poService.createPO).toHaveBeenCalled();

    poService.createPO.and.returnValue(of({ status: 'Failure', errorMessage: 'bad' }));
    component.selectedData = [{ poQuantity: 2, quantity: 5, id: 'i2', excludetaxamount: 1, gstValue: 0, unitprice: 1 }];
    component.dynamicFields = [{ id: 'df2' }];
    component.generatePo({ form: { invalid: false } } as any);

    swalSpy.and.callFake(() => ({
      then: (cb: any) => {
        cb({ value: false });
        return Promise.resolve();
      },
    } as any));
    component.generatePo({ form: { invalid: false } } as any);

    component.tableColumnData = [];
    component.updatePo({ form: { invalid: false } } as any);
    component.tableColumnData = [{ poQuantity: 0 }];
    component.updatePo({ form: { invalid: false } } as any);
    component.tableColumnData = [{ poQuantity: 1 }];
    component.isQuantityValid = true;
    component.updatePo({ form: { invalid: false } } as any);
    component.isQuantityValid = false;
    component.updatePo({ form: { invalid: true } } as any);
    component.advance = false;
    component.tableColumnData = [{ poQuantity: 1 }];
    component.updatePo({ form: { invalid: false } } as any);
    component.advance = true;
    component.updatePo({ form: { invalid: false } } as any);
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
