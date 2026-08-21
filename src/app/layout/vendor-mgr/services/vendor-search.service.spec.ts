import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VendorSearchService } from './vendor-search.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';


describe('VendorSearchService', () => {
  let service: VendorSearchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        VendorSearchService
      ]
    });
    service = TestBed.inject(VendorSearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getSearch', () => {
    service.getSearch('city', 'co', []).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_DATA_BY_VENDOR_SEARCH);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getSearchData', () => {
    service.getSearchData({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_DATA_BY_VENDOR_SEARCH);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorInfo', () => {
    service.getVendorInfo({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_INFO);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
