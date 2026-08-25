import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VendorQuotService } from './vendor-quot.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';


describe('VendorQuotService', () => {
  let service: VendorQuotService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        VendorQuotService
      ]
    });
    service = TestBed.inject(VendorQuotService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAllQuotation', () => {
    service.getAllQuotation({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_QUOT_FOR_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getQuotDataByid', () => {
    service.getQuotDataByid({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_QUOTATION_LINE_ITEMS_BY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call uploadQuotation', () => {
    service.uploadQuotation({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.UPLOAD_QUOTATION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getQuotCommentsById', () => {
    service.getQuotCommentsById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_QUOT_COMMENTS_BY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAllClientVendors', () => {
    service.getAllClientVendors().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_CLIENT_VENDORS);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });
});
