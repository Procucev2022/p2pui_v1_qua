import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VendorRegistrationService } from './vendor-registration.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';


describe('VendorRegistrationService', () => {
  let service: VendorRegistrationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        VendorRegistrationService
      ]
    });
    service = TestBed.inject(VendorRegistrationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call saveVendorRegistration', () => {
    service.saveVendorRegistration({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.NEW_VENDOR_REGISTRATION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call submitVendorRegistration', () => {
    service.submitVendorRegistration({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SUBMIT_VENDOR_REGISTRATION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getHsnCodes', () => {
    service.getHsnCodes().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_HSN_CODES);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getSacCodes', () => {
    service.getSacCodes().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_SAC_CODES);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getVendorById', () => {
    service.getVendorById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_BY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getGMTSellerById', () => {
    service.getGMTSellerById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_GMT_SELLER_BY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getUpdateOrgTc', () => {
    service.getUpdateOrgTc({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_UPDATE_ORG_TC);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorTc', () => {
    service.getVendorTc().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_TC);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call editVendor', () => {
    service.editVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.EDIT_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call submitSelfVendorRegistration', () => {
    service.submitSelfVendorRegistration({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SUBMIT_VENDOR_SELF_REGISTRATION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call panOrEamilValidation', () => {
    service.panOrEamilValidation({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.PAN_VALIDATION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call verifyOTP', () => {
    service.verifyOTP({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.OTP_VALIDATION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call sendAllOTPs', () => {
    service.sendAllOTPs({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.OTPs_SENT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getDetailsByPan', () => {
    service.getDetailsByPan({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_DETAILS_BY_PAN);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call submitSelfClientRegistration', () => {
    service.submitSelfClientRegistration({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SUBMIT_CLIENT_SELF_REGISTRATION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call emailValidation', () => {
    service.emailValidation({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_DETAILS_BY_PAN);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call sendOTP', () => {
    service.sendOTP({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SEND_OTP_TO_MAIL);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
