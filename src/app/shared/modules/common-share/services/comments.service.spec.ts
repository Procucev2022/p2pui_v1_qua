import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentsService } from './comments.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';


describe('CommentsService', () => {
  let service: CommentsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CommentsService
      ]
    });
    service = TestBed.inject(CommentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getRFQComments', () => {
    service.getRFQComments({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQ_COMMENTS_BY);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getRFQCommentsByRFQandVendor', () => {
    service.getRFQCommentsByRFQandVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQ_COMMENTS_BY_RFQ_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call saveRFQComments', () => {
    service.saveRFQComments({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_RFQ_COMMENTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorsByRfq', () => {
    service.getVendorsByRfq({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_BY_RFQ);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getPRComments', () => {
    service.getPRComments({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_COMMENTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call savePRComments', () => {
    service.savePRComments({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_PR_COMMENTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getQuoteComments', () => {
    service.getQuoteComments({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_QUOTE_COMMENTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call saveQuoteComments', () => {
    service.saveQuoteComments({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_QUOTE_COMMENTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getPPOComments', () => {
    service.getPPOComments({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PPO_COMMENTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call savePPOComments', () => {
    service.savePPOComments({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_PPO_COMMENTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call savePrClientComment', () => {
    service.savePrClientComment({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_PR_CLIENT_COMMENTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getPrClientCommentByPr', () => {
    service.getPrClientCommentByPr({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_PR_COMMENTS_BY_PR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getPOComments', () => {
    service.getPOComments({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PO_COMMENTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call savePOComments', () => {
    service.savePOComments({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_PO_COMMENTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getDeliveryComments', () => {
    service.getDeliveryComments({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_DELIVERY_COMMENTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call saveDeliveryComments', () => {
    service.saveDeliveryComments({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_DELIVERY_COMMENTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getASNComments', () => {
    service.getASNComments({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ASN_COMMENTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call saveASNComments', () => {
    service.saveASNComments({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_ASN_COMMENTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getValidatePincode', () => {
    service.getValidatePincode({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PINCODE_VALIDATION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
