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
      providers: [
        InvoicesService
      ]
    });
    service = TestBed.inject(InvoicesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAllInvoices', () => {
    service.getAllInvoices({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.FETCH_ALL_INVOICES);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllInvoicesByClientId', () => {
    service.getAllInvoicesByClientId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_INVOICES_BY_CLIENT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAllInvoicesByVendor', () => {
    service.getAllInvoicesByVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_INVOICES_BY_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getItemsByASNId', () => {
    service.getItemsByASNId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEMS_BY_ASN_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call createInvoice', () => {
    service.createInvoice({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_INVOICE);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getInvoiceById', () => {
    service.getInvoiceById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.VIEW_INVOICE);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
