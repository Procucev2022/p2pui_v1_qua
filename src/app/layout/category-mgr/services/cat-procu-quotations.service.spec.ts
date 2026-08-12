import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CatProcuQuotationsService } from './cat-procu-quotations.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';


describe('CatProcuQuotationsService', () => {
  let service: CatProcuQuotationsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CatProcuQuotationsService
      ]
    });
    service = TestBed.inject(CatProcuQuotationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getPRByQuotation', () => {
    service.getPRByQuotation({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PRS_BY_QUOTATIONS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorsByQuot', () => {
    service.getVendorsByQuot({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_QUOTATIONS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getRFQsByQuot', () => {
    service.getRFQsByQuot({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQ_BY_QUOTATIONS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getLineItemsByQuot', () => {
    service.getLineItemsByQuot({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_LINE_ITEMS_BY_QUOTATIONS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorsByClientId', () => {
    service.getVendorsByClientId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_LIST_BY_CLIENT_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
