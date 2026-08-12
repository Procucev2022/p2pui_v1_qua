import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VendorViewModelService } from './vendor-view-model.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';


describe('VendorViewModelService', () => {
  let service: VendorViewModelService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        VendorViewModelService
      ]
    });
    service = TestBed.inject(VendorViewModelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getVendorById', () => {
    service.getVendorById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_BY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
