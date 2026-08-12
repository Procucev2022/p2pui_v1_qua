import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApprovePrService } from './approve-pr.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';


describe('ApprovePrService', () => {
  let service: ApprovePrService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApprovePrService
      ]
    });
    service = TestBed.inject(ApprovePrService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call approvePRService', () => {
    service.approvePRService({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.PR_ACCEPT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call approvePRServices', () => {
    service.approvePRServices({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.PR_ACCEPT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call rejectPRService', () => {
    service.rejectPRService({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.PR_REJECT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call closePRService', () => {
    service.closePRService({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.PR_CLOSE);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
