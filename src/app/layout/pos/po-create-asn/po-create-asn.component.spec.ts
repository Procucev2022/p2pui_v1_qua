import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { PoCreateAsnComponent } from './po-create-asn.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { EncryDecryService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { PoService } from 'src/app/shared/modules/common-share/services/po.service';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('PoCreateAsnComponent', () => {
  let component: PoCreateAsnComponent;
  let fixture: ComponentFixture<PoCreateAsnComponent>;
  let encry: any;
  let toaster: any;
  let poService: any;
  let dialogRef: any;

  const data = {
    deliveryData: { id: 'd1', deliveryId: 'DEL-1' },
    poData: { id: 'po1', clientId: 'c1' },
  };

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
    poService.getItemsByDeliveryId.and.returnValue(
      of([
        { id: 'i1', description: 'A', quantity: 5, poQuantity: 10, brand: 'B', unitofMeasures: 'EA', excludetaxamount: 1, gstValue: 0 },
        { id: 'i2', description: 'B', quantity: 0, poQuantity: 3, brand: 'B', unitofMeasures: 'EA', excludetaxamount: 1, gstValue: 0 },
      ])
    );
    poService.createASN.and.returnValue(of({ status: 'Success', message: 'ok' }));

    await TestBed.configureTestingModule({
      declarations: [PoCreateAsnComponent],
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
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: EncryDecryService, useValue: encry },
        { provide: ToastrService, useValue: toaster },
        { provide: MatDialog, useValue: autoMock('MatDialog') },
        { provide: PoService, useValue: poService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(PoCreateAsnComponent, '')
      .overrideComponent(PoCreateAsnComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(PoCreateAsnComponent);
    component = fixture.componentInstance;
    component.data = data;
    seedComponent(component as any);
  });

  it('should init load items and form', () => {
    component.ngOnInit();
    expect(component.itemsData.length).toBe(2);
    expect(component.deliveryItemsData.gridColumnData.length).toBe(2);
    expect(component.f.asndesc).toBeTruthy();

    poService.getItemsByDeliveryId.and.returnValue(of({ status: 'Failure' }));
    component.getDeliveryItems();
  });

  it('should cellEditEvent and grid click', () => {
    component.ngOnInit();
    const row = { deliveryQuantity: 20, poQuantity: 10 };
    component.cellEditEvent(row, 0);
    expect(row.deliveryQuantity).toBe(10);
    const row2 = { deliveryQuantity: -1, poQuantity: 10 };
    component.cellEditEvent(row2, 0);
    expect(row2.deliveryQuantity).toBe(0);
    component.onClickCommonGrid({ eventName: 'cellEditEvent', rowData: row, rowIndex: 0 });
  });

  it('should submit validation and success failure', () => {
    component.ngOnInit();
    component.ivalidQuntyForSomeCell = true;
    component.onSubmit();
    expect(toaster.warning).toHaveBeenCalled();

    component.ivalidQuntyForSomeCell = false;
    component.deliveryItemsData.gridColumnData.forEach((r) => (r.deliveryQuantity = 0));
    component.onSubmit();
    expect(toaster.warning).toHaveBeenCalled();

    component.deliveryItemsData.gridColumnData[0].deliveryQuantity = 2;
    component.onSubmit();
    expect(toaster.warning).toHaveBeenCalledWith('Please fill all required fields', 'Warning');

    component.asnForm.setValue({
      asndesc: 'd',
      transportMode: 't',
      dispatchDate: new Date(),
      expectedDate: new Date(),
      cargoDetails: 'c',
      trasportPhone: '999',
    });
    component.attachments = [];
    component.onSubmit();
    expect(poService.createASN).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalled();

    poService.createASN.and.returnValue(of({ status: 'Failure', message: 'bad' }));
    component.deliveryItemsData.gridColumnData = [
      { id: 'i1', quantity: 5, deliveryQuantity: 2, poQuantity: 10 },
    ];
    component.onSubmit();
    expect(toaster.success).toHaveBeenCalledWith('bad', 'Failed');
  });

  it('should reset and attachments', () => {
    component.ngOnInit();
    component.asnForm.patchValue({ asndesc: 'x' });
    component.getAttachedDocsList({ attachments: [{ name: 'a' }] });
    expect(component.attachments.length).toBe(1);
    component.resetForm();
    expect(component.attachments).toEqual([]);
  });
});
