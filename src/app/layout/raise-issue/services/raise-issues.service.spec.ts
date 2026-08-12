import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RaiseIssuesService } from './raise-issues.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';


describe('RaiseIssuesService', () => {
  let service: RaiseIssuesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RaiseIssuesService
      ]
    });
    service = TestBed.inject(RaiseIssuesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getRaisedIssues', () => {
    service.getRaisedIssues().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.FETCH_ALL_QUERIES);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllClients', () => {
    service.getAllClients().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_CLIENTS_FOR_RAISE_ISSUE);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllVendors', () => {
    service.getAllVendors().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_VENDORS_FOR_RAISE_ISSUE);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call raiseQuery', () => {
    service.raiseQuery({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.RAISE_QUERY);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call updateQuery', () => {
    service.updateQuery({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_QUERY);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
