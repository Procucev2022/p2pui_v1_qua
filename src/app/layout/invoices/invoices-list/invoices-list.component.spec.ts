import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { InvoicesListComponent } from './invoices-list.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { EncryDecryService } from 'src/app/shared/services';
import { InvoicesService } from '../invoices.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog } from '@angular/material/dialog';

describe('InvoicesListComponent', () => {
  let component: InvoicesListComponent;
  let fixture: ComponentFixture<InvoicesListComponent>;
  let encry: any;
  let invoiceService: any;
  let modalDialog: any;
  let toaster: any;

  const invoiceRow = {
    id: 'inv1',
    invoiceId: 'I-1',
    status: { uiDisplay: 'Open' },
  };

  function role(roleName: string) {
    encry.get.and.returnValue(
      JSON.stringify({
        details: {
          role: { roleName },
          listofPermission: ['P1'],
          org: { id: 'o1' },
        },
      })
    );
  }

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    encry = autoMock('EncryDecryService');
    invoiceService = autoMock('InvoicesService');
    modalDialog = autoMock('MatDialog');
    toaster = autoMock('ToastrService');
    role('Vendor');
    invoiceService.getAllInvoicesByVendor.and.returnValue(of([invoiceRow]));
    invoiceService.getAllInvoicesByClientId.and.returnValue(of([invoiceRow]));
    invoiceService.getAllInvoices.and.returnValue(of([invoiceRow]));
    invoiceService.getInvoiceById.and.returnValue(of({ id: 'inv1', invoiceId: 'I-1' }));
    modalDialog.open.and.returnValue({ afterClosed: () => of({ event: 'close' }) });

    await TestBed.configureTestingModule({
      declarations: [InvoicesListComponent],
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
        { provide: InvoicesService, useValue: invoiceService },
        { provide: EncryDecryService, useValue: encry },
        { provide: MatDialog, useValue: modalDialog },
        { provide: ToastrService, useValue: toaster },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(InvoicesListComponent, '')
      .overrideComponent(InvoicesListComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(InvoicesListComponent);
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

  it('should load invoices for each role and 204 empty', () => {
    component.ngOnInit();
    expect(component.invoicesList.length).toBe(1);
    expect(component.invoicesList[0].status).toBe('Open');

    role('Registration');
    component.ngOnInit();
    expect(component.roleName).toBe('Vendor');

    role('ClientInitiator');
    component.ngOnInit();
    expect(invoiceService.getAllInvoicesByClientId).toHaveBeenCalled();

    role('PRApprover');
    component.ngOnInit();

    role('CategoryManager');
    component.ngOnInit();
    expect(invoiceService.getAllInvoices).toHaveBeenCalled();

    role('Other');
    component.ngOnInit();

    role('Vendor');
    invoiceService.getAllInvoicesByVendor.and.returnValue(of({ errorCode: 204 }));
    component.getAllInvoices();
    expect(component.invoicesList).toEqual([]);

    invoiceService.getAllInvoicesByVendor.and.returnValue(of({ status: 'Failure' }));
    component.getAllInvoices();

    role('ClientInitiator');
    invoiceService.getAllInvoicesByClientId.and.returnValue(of({ errorCode: 204 }));
    component.getAllInvoices();

    role('CategoryManager');
    invoiceService.getAllInvoices.and.returnValue(of({ errorCode: 204 }));
    component.getAllInvoices();

    component.applyInvoiceResponse([{ id: 'x', status: null }]);
    component.ngOnChanges();
    component.invoicesList = null;
    component.invoicesData = null;
    component.ngOnChanges();
  });


  it('should view invoice success failure and comments', () => {
    component.ngOnInit();
    component.viewInvoice({ rowData: { id: 'inv1', status: 'Open' } });
    expect(modalDialog.open).toHaveBeenCalled();

    invoiceService.getInvoiceById.and.returnValue(of({ status: 'Failure' }));
    component.viewInvoice({ rowData: { id: 'inv1', status: 'Open' } });
    expect(toaster.warning).toHaveBeenCalled();

    invoiceService.getInvoiceById.and.returnValue(of({ id: 'inv1', invoiceId: 'I-1' }));
    modalDialog.open.and.returnValue({ afterClosed: () => of(null) });
    component.viewInvoice({ rowData: { id: 'inv1', status: 'Open' } });

    modalDialog.open.and.returnValue({ afterClosed: () => of({ event: 'other' }) });
    component.viewInvoice({ rowData: { id: 'inv1', status: 'Open' } });

    modalDialog.open.and.returnValue({ afterClosed: () => of({}) });
    component.viewInvoice({ rowData: { id: 'inv1', status: 'Open' } });

    modalDialog.open.and.returnValue({ afterClosed: () => of({ event: 'close' }) });
    component.commentsOnInvoices({ rowData: { id: 'inv1' } });
    component.viewCorresspondance({ id: 'x' }, 'OTHER');
    component.getInvoiceItemsAndDocs({ rowData: { id: 'inv2' } });
    expect(component.invoiceId).toBe('inv2');

    component.onClickCommonGrid({ eventName: 'getInvoiceItemsAndDocs', rowData: { id: 'inv3' } });
    component.ngOnChanges();
    component.invoicesList = [invoiceRow];
    component.invoicesData = { gridColumnData: [] };
    component.ngOnChanges();

    component.applyInvoiceResponse(null);
    component.applyInvoiceResponse(undefined);
    component.applyInvoiceResponse({ errorCode: 200 });
    component.applyInvoiceResponse([]);
    component.invoicesData = { gridColumnData: [] };
    component.invoicesList = undefined as any;
    component.ngOnChanges();
  });
});

