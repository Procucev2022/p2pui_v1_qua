import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { AcceptPosComponent } from './accept-pos.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { EncryDecryService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { PoService } from 'src/app/shared/modules/common-share/services/po.service';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('AcceptPosComponent', () => {
  let component: AcceptPosComponent;
  let fixture: ComponentFixture<AcceptPosComponent>;
  let encry: any;
  let toaster: any;
  let poService: any;
  let dialogRef: any;

  const poitems = [
    {
      id: 'i1',
      description: 'A',
      quantity: 10,
      unitprice: 5,
      gstValue: 1,
      brand: 'B',
      unitofMeasures: 'EA',
      excludetaxamount: 50,
    },
    {
      id: 'i2',
      description: 'B',
      quantity: 4,
      unitprice: 2,
      gstValue: 0,
      brand: 'B',
      unitofMeasures: 'EA',
      excludetaxamount: 8,
    },
  ];

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    encry = autoMock('EncryDecryService');
    toaster = autoMock('ToastrService');
    poService = autoMock('PoService');
    dialogRef = autoMock('MatDialogRef');
    encry.get.and.returnValue(
      JSON.stringify({ details: { role: { roleName: 'Vendor' }, org: { id: 'vorg' } } })
    );
    poService.acceptPoOrCreateDeliveryHeader.and.returnValue(of({ status: 'Success', message: 'ok' }));

    await TestBed.configureTestingModule({
      declarations: [AcceptPosComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: autoMock('ChangeDetectorRef') },
        DatePipe,
        FormBuilder,
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
        {
          provide: MAT_DIALOG_DATA,
          useValue: { id: 'po1', client: { id: 'c1' }, poitems: JSON.parse(JSON.stringify(poitems)) },
        },
        { provide: EncryDecryService, useValue: encry },
        { provide: ToastrService, useValue: toaster },
        { provide: MatDialog, useValue: autoMock('MatDialog') },
        { provide: PoService, useValue: poService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(AcceptPosComponent, '')
      .overrideComponent(AcceptPosComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(AcceptPosComponent);
    component = fixture.componentInstance;
    component.data = {
      id: 'po1',
      client: { id: 'c1' },
      poitems: JSON.parse(JSON.stringify(poitems)),
    };
    seedComponent(component as any);
  });

  it('should init and delivery type change', () => {
    component.ngOnInit();
    expect(component.deliveryData.length).toBe(1);
    component.deliveryTypeChange('multiple');
    component.deliveryTypeChange('single');
    expect(component.customTB({ id: 'x' }, 1)).toContain('x');
    component.ngOnChanges({ deliveryMode: { currentValue: 'single' } } as any);
  });

  it('should validate submit and buildJSON', () => {
    component.ngOnInit();
    component.onSubmit({ form: { invalid: true } });
    expect(toaster.warning).toHaveBeenCalled();

    component.deliveryData[0].deliveryDate = null;
    component.onSubmit({ form: { invalid: false } });

    component.deliveryData[0].deliveryDate = new Date();
    component.deliveryData[0].itemsData_.forEach((i) => (i.deliveryQuantity = 0));
    component.onSubmit({ form: { invalid: false } });

    component.deliveryData[0].itemsData_[0].deliveryQuantity = 5;
    component.deliveryData[0].itemsData_[0].isInValid = true;
    component.onSubmit({ form: { invalid: false } });

    component.deliveryData[0].itemsData_[0].isInValid = false;
    component.onSubmit({ form: { invalid: false } });
    expect(poService.acceptPoOrCreateDeliveryHeader).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalled();

    poService.acceptPoOrCreateDeliveryHeader.and.returnValue(of({ status: 'Failure', message: 'bad' }));
    component.ngOnInit();
    component.deliveryData[0].deliveryDate = new Date();
    component.buildJSON();
    expect(toaster.error).toHaveBeenCalled();
  });

  it('should add more deliveries and quantity edits', () => {
    component.ngOnInit();
    component.addOneMoreDelivery(false);
    expect(toaster.warning).toHaveBeenCalled();

    component.deliveryData[0].deliveryDate = new Date();
    component.deliveryData[0].itemsData_[0].deliveryQuantity = 0;
    component.deliveryData[0].itemsData_[1].deliveryQuantity = 0;
    component.addOneMoreDelivery(false);

    component.deliveryData[0].itemsData_[0].deliveryQuantity = 10;
    component.deliveryData[0].itemsData_[1].deliveryQuantity = 4;
    component.addOneMoreDelivery(false);
    expect(toaster.warning).toHaveBeenCalledWith('All items are selected', 'Warning');

    component.deliveryData[0].itemsData_[0].deliveryQuantity = 3;
    component.deliveryData[0].itemsData_[1].deliveryQuantity = 1;
    component.addOneMoreDelivery(false);
    expect(component.deliveryData.length).toBe(2);

    component.onGetPoTotal({ target: { value: 100 } }, { quantity: 10 }, 0, 0);
    expect(toaster.warning).toHaveBeenCalled();
    component.onGetPoTotal({ target: { value: 0 } }, { quantity: 10 }, 0, 0);
    component.onGetPoTotal({ target: { value: 2 } }, { quantity: 10 }, 0, 0);
    component.getTotalPoAmount([], 0);
    component.removeDeliveryItem(1, {});
    component.tableArrayData = [[{ deliveryQuantity: 1 }]];
    component.onChangeQty(0 as any, 0);
  });
});
