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
      providers: [CommentsService]
    });
    service = TestBed.inject(CommentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getRFQComments should POST', () => {
    service.getRFQComments({ id: 1 }).subscribe(r => expect(r).toEqual({ ok: true }));
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQ_COMMENTS_BY);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('getRFQCommentsByRFQandVendor should POST', () => {
    service.getRFQCommentsByRFQandVendor({ id: 1 }).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQ_COMMENTS_BY_RFQ_VENDOR);
    req.flush({});
  });

  it('saveRFQComments should POST', () => {
    service.saveRFQComments({ text: 'hi' }).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_RFQ_COMMENTS);
    req.flush({});
  });

  it('getVendorsByRfq should POST', () => {
    service.getVendorsByRfq({ rfqId: 1 }).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_BY_RFQ);
    req.flush({});
  });

  it('getPRComments should POST', () => {
    service.getPRComments({ id: 1 }).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_COMMENTS);
    req.flush({});
  });

  it('savePRComments should POST', () => {
    service.savePRComments({ text: 'x' }).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_PR_COMMENTS);
    req.flush({});
  });

  it('getQuoteComments should POST', () => {
    service.getQuoteComments({ id: 1 }).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_QUOTE_COMMENTS);
    req.flush({});
  });

  it('saveQuoteComments should POST', () => {
    service.saveQuoteComments({ text: 'x' }).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_QUOTE_COMMENTS);
    req.flush({});
  });

  it('getPPOComments should POST', () => {
    service.getPPOComments({ id: 1 }).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PPO_COMMENTS);
    req.flush({});
  });

  it('savePPOComments should POST', () => {
    service.savePPOComments({ text: 'x' }).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_PPO_COMMENTS);
    req.flush({});
  });

  it('savePrClientComment should POST', () => {
    service.savePrClientComment({ text: 'x' }).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_PR_CLIENT_COMMENTS);
    req.flush({});
  });

  it('getPrClientCommentByPr should POST', () => {
    service.getPrClientCommentByPr({ id: 1 }).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_PR_COMMENTS_BY_PR);
    req.flush({});
  });

  it('getPOComments should POST', () => {
    service.getPOComments({ id: 1 }).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PO_COMMENTS);
    req.flush({});
  });

  it('savePOComments should POST', () => {
    service.savePOComments({ text: 'x' }).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_PO_COMMENTS);
    req.flush({});
  });

  it('getDeliveryComments should POST', () => {
    service.getDeliveryComments({ id: 1 }).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_DELIVERY_COMMENTS);
    req.flush({});
  });

  it('saveDeliveryComments should POST', () => {
    service.saveDeliveryComments({ text: 'x' }).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_DELIVERY_COMMENTS);
    req.flush({});
  });

  it('getASNComments should POST', () => {
    service.getASNComments({ id: 1 }).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ASN_COMMENTS);
    req.flush({});
  });

  it('saveASNComments should POST', () => {
    service.saveASNComments({ text: 'x' }).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_ASN_COMMENTS);
    req.flush({});
  });

  it('getValidatePincode should POST', () => {
    service.getValidatePincode({ pincode: '500001' }).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PINCODE_VALIDATION);
    req.flush({});
  });
});
