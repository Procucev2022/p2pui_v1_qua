import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PposService } from './ppos.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';


describe('PposService', () => {
  let service: PposService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PposService
      ]
    });
    service = TestBed.inject(PposService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAllPPOS', () => {
    service.getAllPPOS({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.PPO_GET_ALL);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call submitPPO', () => {
    service.submitPPO({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.PPO_SUBMIT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call acceptPPO', () => {
    service.acceptPPO({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.PPO_ACCEPT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call rejectPPO', () => {
    service.rejectPPO({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.PPO_REJECT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call rejectPPOByCm', () => {
    service.rejectPPOByCm({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.PPO_REJECT_P);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call PPOByCm', () => {
    service.PPOByCm({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.PPO_ITEMS_BY_PPO_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAllPPOsByVendorAndClient', () => {
    service.getAllPPOsByVendorAndClient({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_PPOS_BY_VENDOR_AND_CLIENT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call saveRatingForPPO', () => {
    service.saveRatingForPPO({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SAVING_RATING_PPO);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
