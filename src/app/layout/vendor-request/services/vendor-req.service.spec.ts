import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VendorReqService } from './vendor-req.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { FormBuilder } from '@angular/forms';

describe('VendorReqService', () => {
  let service: VendorReqService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        VendorReqService,
        FormBuilder
      ]
    });
    service = TestBed.inject(VendorReqService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call createNewRequestVendor', () => {
    service.createNewRequestVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.REQUEST_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAllReqVendors', () => {
    service.getAllReqVendors().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_REQ_VENDORS);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call requestCompleted', () => {
    service.requestCompleted({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.REQ_COMPLETED);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call inProgress', () => {
    service.inProgress({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.REQ_IN_PROGRESS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call closeRequest', () => {
    service.closeRequest({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CLOSE_REQ);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAllPreVendors', () => {
    service.getAllPreVendors().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_PRE_VENDORS);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call createPreVendor', () => {
    service.createPreVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.UPLOAD_PRE_VENDORS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call inActivate', () => {
    service.inActivate({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.INACTIVATE_VENDORS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call registerVendor', () => {
    service.registerVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.REGISTER_VENDORS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call createPreVendorDetails', () => {
    service.createPreVendorDetails({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_PRE_VENDOR_DETAILS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call createClientVendorsDetails', () => {
    service.createClientVendorsDetails({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_CLIENT_VENDOR_DETAILS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call editPreVendorDetails', () => {
    service.editPreVendorDetails({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.EDIT_PRE_VENDOR_DETAILS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call saveVendorInfo', () => {
    service.saveVendorInfo({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_VENDOR_INFO);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call submitVendorInfo', () => {
    service.submitVendorInfo({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SUBMIT_VENDOR_INFO);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorEvaluationById', () => {
    service.getVendorEvaluationById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_EVALUATION_BY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorsByVM', () => {
    service.getVendorsByVM().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.FETCH_VENDORS_BY_VM);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getForwardedVendorsByVE', () => {
    service.getForwardedVendorsByVE().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.FETCH_FORWARDED_VENDORS_BY_VE);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call approveForwardedVendor', () => {
    service.approveForwardedVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.APPROVE_FORWARDED_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call approvePreVendor', () => {
    service.approvePreVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.APPROVE_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call createVendorByExecutive', () => {
    service.createVendorByExecutive({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_VENDOR_BY_EXECUTIVE);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call vendorDownloadExcNotification', () => {
    service.vendorDownloadExcNotification().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.VENDOER_EXC_DOWNLOAD_NOTIFICATION);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call enableVendor', () => {
    service.enableVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.VENDOR_ENABLE);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call sendOtpForGMTVendor', () => {
    service.sendOtpForGMTVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SEND_OTP_FOR_GMT_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call sendOtpForGMTVendorUpgrade', () => {
    service.sendOtpForGMTVendorUpgrade({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SEND_OTP_FOR_GMT_VENDOR_UPGRADE);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call verifyOtpForGMTVendor', () => {
    service.verifyOtpForGMTVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.VERIFY_OTP_FOR_GMT_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call upgradeForGMTVendor', () => {
    service.upgradeForGMTVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.UPGRADE_GMT_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call validateVmOtp', () => {
    service.validateVmOtp({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.UPGRADE_OTP_FOR_GMT_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call upgradeGmtVendor', () => {
    service.upgradeGmtVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.UPGRADE_GMT_VENDOR_AFTER_OTP);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
