import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VendorInviteService } from './vendor-invite.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';


describe('VendorInviteService', () => {
  let service: VendorInviteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        VendorInviteService
      ]
    });
    service = TestBed.inject(VendorInviteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call requestRegistration', () => {
    service.requestRegistration({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.VENDOR_INVITATION_REGISTRATION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
