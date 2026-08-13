import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { CreateInvoiceComponent } from './create-invoice.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { EncryDecryService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { InvoicesService } from '../invoices.service';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('CreateInvoiceComponent', () => {
  let component: CreateInvoiceComponent;
  let fixture: ComponentFixture<CreateInvoiceComponent>;
  let encry: any;
  let toaster: any;
  let invoiceService: any;
  let dialogRef: any;
  let modalDialog1: any;

  const data = {
    asnData: { id: 'asn1', asnId: 'ASN-1' },
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
    invoiceService = autoMock('InvoicesService');
    dialogRef = autoMock('MatDialogRef');
    modalDialog1 = autoMock('MatDialog');
    encry.get.and.returnValue(
      JSON.stringify({ details: { role: { roleName: 'Vendor' }, org: { id: 'vorg' } } })
    );
    invoiceService.getItemsByASNId.and.returnValue(
      of([
        { id: 'i1', quantity: 5, unitprice: 10, gstValue: 2, description: 'A', brand: 'B', unitofMeasures: 'EA' },
        { id: 'i2', quantity: 0, unitprice: 5, gstValue: 0, description: 'B', brand: 'B', unitofMeasures: 'EA' },
      ])
    );
    invoiceService.createInvoice.and.returnValue(of({ status: 'Success', message: 'ok' }));
    modalDialog1.open.and.returnValue({ close: jasmine.createSpy('close') });

    await TestBed.configureTestingModule({
      declarations: [CreateInvoiceComponent],
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
        { provide: MatDialog, useValue: modalDialog1 },
        { provide: InvoicesService, useValue: invoiceService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(CreateInvoiceComponent, '')
      .overrideComponent(CreateInvoiceComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(CreateInvoiceComponent);
    component = fixture.componentInstance;
    component.data = data;
    seedComponent(component as any);
  });

  it('should init load asn items and empty path', () => {
    component.ngOnInit();
    expect(component.itemsData.length).toBe(2);
    expect(component.f.invoiceDesc).toBeTruthy();
    invoiceService.getItemsByASNId.and.returnValue(of({ status: 'Failure' }));
    component.getASNItems();
  });

  it('should submit validation success and failure', () => {
    component.ngOnInit();
    (component as any).deliveryItemsData = { gridColumnData: [] };
    component.onSubmit();
    expect(toaster.warning).toHaveBeenCalled();

    (component as any).deliveryItemsData = {
      gridColumnData: [{ id: 'i1', quantity: 5, invoiceQuantity: 0, unitprice: 1, gstValue: 0 }],
    };
    component.onSubmit();

    (component as any).deliveryItemsData.gridColumnData[0].invoiceQuantity = 2;
    component.onSubmit();
    expect(toaster.warning).toHaveBeenCalledWith('Please fill all required fields', 'Warning');

    component.invoiceForm.setValue({ invoiceDesc: 'd', remarks: 'r' });
    component.attachments = [];
    component.additionalItemsList = [{ id: 1, description: 'x' }];
    component.onSubmit();
    expect(dialogRef.close).toHaveBeenCalled();

    invoiceService.createInvoice.and.returnValue(of({ status: 'Failure', message: 'bad' }));
    (component as any).deliveryItemsData = {
      gridColumnData: [{ id: 'i1', quantity: 5, invoiceQuantity: 2, unitprice: 1, gstValue: 0 }],
    };
    component.onSubmit();
    expect(toaster.error).toHaveBeenCalled();
  });

  it('should cell edit totals attachments grid and additional items', fakeAsync(() => {
    component.ngOnInit();
    const row = { invoiceQuantity: 20, quantity: 5, unitprice: 10, gstValue: 2, totalamount: 0 };
    component.cellEditEvent(row, 0);
    expect(row.invoiceQuantity).toBe(5);
    const row2 = { invoiceQuantity: -1, quantity: 5, unitprice: 10, gstValue: 2, totalamount: 0 };
    component.cellEditEvent(row2, 0);
    expect(row2.invoiceQuantity).toBe(0);
    component.getInvoiceTotal();
    component.getAttachedDocsList({ attachedDocuments: [{ n: 1 }] });
    component.onClickCommonGrid({ eventName: 'cellEditEvent', rowData: row, rowIndex: 0 });
    component.openAdditonalItemsModal({});
    expect(component.isAdd).toBe(true);

    component.additonItemsRowData = {
      description: '',
      brand: '',
      category: '',
      unitofMeasures: '',
      vendorPrice: '',
      itemcode: '',
      quantity: 0,
      id: 0,
    };
    component.additem({}, true);
    expect(toaster.warning).toHaveBeenCalled();

    component.additonItemsRowData = {
      description: 'D',
      brand: 'B',
      category: 'C',
      unitofMeasures: 'EA',
      vendorPrice: '1',
      itemcode: 'IC',
      quantity: 1,
      id: 0,
    };
    component.additem({}, true);
    tick(50);
    expect(component.additionalItemsList.length).toBe(1);

    component.editAdditionalItemData(component.additionalItemsList[0]);
    expect(component.isAdd).toBe(false);
    component.additonItemsRowData = { ...component.additionalItemsList[0], description: 'D2' };
    component.additem({}, false);
    tick(50);

    component.deleteItem(component.additionalItemsList[0]);
    tick(50);
    component.dialogRef1 = { close: jasmine.createSpy('close') } as any;
    component.closeItemModal();
    component.resetForm();
  }));
});
