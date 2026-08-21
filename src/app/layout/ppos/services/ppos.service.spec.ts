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
      providers: [PposService],
    });
    service = TestBed.inject(PposService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function expectPost(method: keyof PposService, urlSuffix: string) {
    (service[method] as any)({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + urlSuffix);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAllPPOS', () => {
    expectPost('getAllPPOS', AppApiConfig.PPO_GET_ALL);
  });

  it('should call getClientPPOS', () => {
    expectPost('getClientPPOS', AppApiConfig.GET_PPO_BY_CLIENT);
  });

  it('should call submitPPO', () => {
    expectPost('submitPPO', AppApiConfig.PPO_SUBMIT);
  });

  it('should call acceptPPO', () => {
    expectPost('acceptPPO', AppApiConfig.PPO_ACCEPT);
  });

  it('should call rejectPPO', () => {
    expectPost('rejectPPO', AppApiConfig.PPO_REJECT);
  });

  it('should call rejectPPOByCm', () => {
    expectPost('rejectPPOByCm', AppApiConfig.PPO_REJECT_P);
  });

  it('should call PPOByCm', () => {
    expectPost('PPOByCm', AppApiConfig.PPO_ITEMS_BY_PPO_ID);
  });

  it('should call getAllPPOsByVendorAndClient', () => {
    expectPost(
      'getAllPPOsByVendorAndClient',
      AppApiConfig.GET_ALL_PPOS_BY_VENDOR_AND_CLIENT
    );
  });

  it('should call saveRatingForPPO', () => {
    expectPost('saveRatingForPPO', AppApiConfig.SAVING_RATING_PPO);
  });

  it('should expose and update acceptPPOViaService subject', (done) => {
    service.acceptPPOViaService().subscribe((val) => {
      if (val === 'updated') {
        expect(val).toBe('updated');
        done();
      }
    });
    service.updateAcceptPPOViaService('updated');
  });
});
