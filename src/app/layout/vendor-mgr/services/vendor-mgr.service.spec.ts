import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VendorMgrService } from './vendor-mgr.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';


describe('VendorMgrService', () => {
  let service: VendorMgrService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        VendorMgrService
      ]
    });
    service = TestBed.inject(VendorMgrService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAllVendorsByVendorApproved', () => {
    service.getAllVendorsByVendorApproved().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_VENDORS_BY_VENDOR_APPROVED);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllVendorsByVendorApprovalPending', () => {
    service.getAllVendorsByVendorApprovalPending().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_VENDOR_BY_VENDOR_APPROVAL_PENDING);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllVendorsByVendorRegistrationPending', () => {
    service.getAllVendorsByVendorRegistrationPending().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_VENDORS_BY_VENDOR_REGISTRATION_PENDING);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call rejectRegistration', () => {
    service.rejectRegistration({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.REJECT_REGISTRATION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorByStatus', () => {
    service.getVendorByStatus({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_BY_STATUS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAllForwardedVendors', () => {
    service.getAllForwardedVendors().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_SELF_VENDOR_BY_VENDOR_MANAGER);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });
});
