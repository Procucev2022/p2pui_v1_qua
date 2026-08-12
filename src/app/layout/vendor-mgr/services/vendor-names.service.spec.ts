import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VendorNamesService } from './vendor-names.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';


describe('VendorNamesService', () => {
  let service: VendorNamesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        VendorNamesService
      ]
    });
    service = TestBed.inject(VendorNamesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getVendorClassificationData', () => {
    service.getVendorClassificationData({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_BY_CATEGORY);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorClassificationDataForServices', () => {
    service.getVendorClassificationDataForServices({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_BY_SAC);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call approveVendorRegistration', () => {
    service.approveVendorRegistration({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.APPROVE_VENDOR_REGISTRATION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorOrClientByType', () => {
    service.getVendorOrClientByType({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_OR_CLIENT_BY_TYPE);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getProductsByVendor', () => {
    service.getProductsByVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PRODUCT_BY_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getServicesByVendor', () => {
    service.getServicesByVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_SERVICES_BY_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
