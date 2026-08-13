import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InvoicesService } from './invoices.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

describe('InvoicesService', () => {
  let service: InvoicesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InvoicesService],
    });
    service = TestBed.inject(InvoicesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function expectPost(method: keyof InvoicesService, urlSuffix: string) {
    (service[method] as any)({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + urlSuffix);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  }

  function expectGet(method: keyof InvoicesService, urlSuffix: string) {
    (service[method] as any)({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + urlSuffix);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAllInvoices', () => {
    expectGet('getAllInvoices', AppApiConfig.FETCH_ALL_INVOICES);
  });

  it('should call getAllInvoicesByClientId', () => {
    expectPost('getAllInvoicesByClientId', AppApiConfig.GET_INVOICES_BY_CLIENT);
  });

  it('should call getAllInvoicesByVendor', () => {
    expectPost('getAllInvoicesByVendor', AppApiConfig.GET_INVOICES_BY_VENDOR);
  });

  it('should call getItemsByASNId', () => {
    expectPost('getItemsByASNId', AppApiConfig.GET_ITEMS_BY_ASN_ID);
  });

  it('should call createInvoice', () => {
    expectPost('createInvoice', AppApiConfig.CREATE_INVOICE);
  });

  it('should call getInvoiceById', () => {
    expectPost('getInvoiceById', AppApiConfig.VIEW_INVOICE);
  });

  it('should call acceptInvoiceById', () => {
    expectPost('acceptInvoiceById', AppApiConfig.ACCEPT_INVOICE);
  });

  it('should call getPOAdvanceById', () => {
    expectPost('getPOAdvanceById', AppApiConfig.GET_PO_ADVANCE_BY_ID);
  });

  it('should call getPoAdvanceByPo', () => {
    expectPost('getPoAdvanceByPo', AppApiConfig.GET_PO_ADVANCE_BY_PO);
  });

  it('should call createPOAdvancePayment', () => {
    expectPost('createPOAdvancePayment', AppApiConfig.CREATE_PO_ADVANCE_PAYMENT);
  });

  it('should call editPOAdvancePayment', () => {
    expectPost('editPOAdvancePayment', AppApiConfig.EDIT_PO_ADVANCE_PAYMENT);
  });

  it('should call getPosByClientAndAdvance', () => {
    expectPost(
      'getPosByClientAndAdvance',
      AppApiConfig.GET_POS_BY_CLIEN_AND_ADVANCE
    );
  });

  it('should call getPosByAdvance', () => {
    expectGet('getPosByAdvance', AppApiConfig.GET_POS_BY_ADVANCE);
  });

  it('should call getPosByVendorAndAdvance', () => {
    expectPost(
      'getPosByVendorAndAdvance',
      AppApiConfig.GET_POS_BY_VENDOR_AND_ADVANCE
    );
  });

  it('should call acceptPOAdvancePayment', () => {
    expectPost('acceptPOAdvancePayment', AppApiConfig.ACCEPT_PO_ADVANCE_PAYMENT);
  });

  it('should call getAdditionalItemsByInvoiceId', () => {
    expectPost(
      'getAdditionalItemsByInvoiceId',
      AppApiConfig.GET_ADDITIONAL_ITEMS_BY_INVOICEID
    );
  });
});
