import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestServiceService } from './test-service.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

describe('TestServiceService', () => {
  let service: TestServiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TestServiceService]
    });
    service = TestBed.inject(TestServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post getTestdata', () => {
    const payload = { rfqId: 1 };
    service.getTestdata(payload).subscribe(res => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEMS_BY_RFQ_ID);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ ok: true });
  });
});
