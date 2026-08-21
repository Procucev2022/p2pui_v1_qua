import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UomService } from './uom.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';


describe('UomService', () => {
  let service: UomService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UomService
      ]
    });
    service = TestBed.inject(UomService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAllUOMs', () => {
    service.getAllUOMs().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_UOM);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call createUOM', () => {
    service.createUOM({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_UOM);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call editUOM', () => {
    service.editUOM({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.EDIT_UOM);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
