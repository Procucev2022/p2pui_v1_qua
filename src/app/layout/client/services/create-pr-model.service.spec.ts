import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreatePrModelService } from './create-pr-model.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

describe('CreatePrModelService', () => {
  let service: CreatePrModelService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CreatePrModelService]
    });
    service = TestBed.inject(CreatePrModelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should saveCreatePr locally', () => {
    expect(() => service.saveCreatePr('d', 'm', 1, 2, {} as File)).not.toThrow();
  });

  it('should call submitPrdetails', () => {
    service.submitPrdetails({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SUBMIT_CREATE_PR_DETAILS_MODEL);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getClientCostCentreByorgId', () => {
    service.getClientCostCentreByorgId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_COST_CENTRE_BY_ORG_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call editPr', () => {
    service.editPr({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.EDIT_PR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call savePR', () => {
    service.savePR({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_PR_BY_CLIENT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call convertBOQToPR', () => {
    service.convertBOQToPR({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CONVER_BOQ_TO_PR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
