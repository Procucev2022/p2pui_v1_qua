import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnalyticsService } from './analytics.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AnalyticsService],
    });
    service = TestBed.inject(AnalyticsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getDashboardData', () => {
    service.getDashboardData().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ANALYTICS_DASHBOARD);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getCategoriesData', () => {
    service.getCategoriesData().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ANALYTICS_CATEGORIES);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getFunnelData with default type', () => {
    service.getFunnelData().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(`${AppApiConfig.apiEndpoint + AppApiConfig.GET_ANALYTICS_FUNNEL}?type=buyer`);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getFunnelData with explicit type', () => {
    service.getFunnelData('seller').subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(`${AppApiConfig.apiEndpoint + AppApiConfig.GET_ANALYTICS_FUNNEL}?type=seller`);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getFunnelStageDetails with defaults', () => {
    service.getFunnelStageDetails().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(
      `${AppApiConfig.apiEndpoint + AppApiConfig.GET_ANALYTICS_FUNNEL_DETAILS}?type=buyer&stage=1&q=`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getFunnelStageDetails with explicit args', () => {
    service.getFunnelStageDetails('seller', 3, 'acme').subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(
      `${AppApiConfig.apiEndpoint + AppApiConfig.GET_ANALYTICS_FUNNEL_DETAILS}?type=seller&stage=3&q=acme`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getFunnelDropoffDetails with defaults', () => {
    service.getFunnelDropoffDetails().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(
      `${AppApiConfig.apiEndpoint + AppApiConfig.GET_ANALYTICS_FUNNEL_DROPOFF}?type=buyer&stage=2&q=`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getFunnelDropoffDetails with explicit args', () => {
    service.getFunnelDropoffDetails('seller', 4, 'test co').subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(
      `${AppApiConfig.apiEndpoint + AppApiConfig.GET_ANALYTICS_FUNNEL_DROPOFF}?type=seller&stage=4&q=test%20co`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getCalendarData without year/month', () => {
    service.getCalendarData().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ANALYTICS_CALENDAR);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getCalendarData with year and month', () => {
    service.getCalendarData(2026, 8).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(
      `${AppApiConfig.apiEndpoint + AppApiConfig.GET_ANALYTICS_CALENDAR}?year=2026&month=8`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call searchCompanies with default query', () => {
    service.searchCompanies().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(`${AppApiConfig.apiEndpoint + AppApiConfig.SEARCH_ANALYTICS_COMPANIES}?q=`);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call searchCompanies with explicit query', () => {
    service.searchCompanies('acme corp').subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(
      `${AppApiConfig.apiEndpoint + AppApiConfig.SEARCH_ANALYTICS_COMPANIES}?q=acme%20corp`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call processChat', () => {
    const payload = { prompt: 'hello', companyId: 'c1' };
    service.processChat(payload).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CHAT_ANALYTICS_CONSOLE);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ ok: true });
  });
});
