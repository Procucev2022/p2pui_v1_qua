import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RfqService } from './rfq.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';


describe('RfqService', () => {
  let service: RfqService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RfqService
      ]
    });
    service = TestBed.inject(RfqService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAllRFQdata', () => {
    service.getAllRFQdata({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_RFQS_BY_VENDOR_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getLineitemsById', () => {
    service.getLineitemsById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEMS_BY_RFQ_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getDocumentsByRfqId', () => {
    service.getDocumentsByRfqId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_DOCUMENTS_BY_RFQ_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call acceptRfqByvendor', () => {
    service.acceptRfqByvendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.ACCEPT_RFQ_BY_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call rejectRfqByvendor', () => {
    service.rejectRfqByvendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.REJECT_RFQ_BY_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call fetchRfqById', () => {
    service.fetchRfqById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQ_BY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAllCategoryRFQdata', () => {
    service.getAllCategoryRFQdata().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.FETCH_ALL_RFQS_BY_ID);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllRFQsForNoPR', () => {
    service.getAllRFQsForNoPR().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQS_FOR_NOPR);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllRFQsForNoPRForClientInitiatorGMT', () => {
    service.getAllRFQsForNoPRForClientInitiatorGMT({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQS_FOR_NOPR_FOR_CLIENT_INITIATOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAllCategoryRFQByGMTVendors', () => {
    service.getAllCategoryRFQByGMTVendors({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.FETCH_ALL_RFQS_BY_GTM_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call requestForRFQByGMTVendor', () => {
    service.requestForRFQByGMTVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.REQUEST_RFQ_BY_GMT_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call fetchGMTSummary', () => {
    service.fetchGMTSummary().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.FETCH_GMT_VENDOR_SUMMARY);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllRFQsByGMTCategory', () => {
    service.getAllRFQsByGMTCategory().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.FETCH_ALL_RFQS_BY_GMT_CATEGORYMANAGER);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllRFQsSummaryByCategory', () => {
    service.getAllRFQsSummaryByCategory(0, 10, '', 'all').subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne((r) => r.url.includes(AppApiConfig.CAT_MGR_VENDOR_SUMMARY));
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllRFQsSummaryByCategory with search filters', () => {
    service.getAllRFQsSummaryByCategory(1, 20, 'acme', 'gmt').subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne((r) => r.url.includes(AppApiConfig.CAT_MGR_VENDOR_SUMMARY));
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getVendorSummaryForGlobalSearch', () => {
    service.getVendorSummaryForGlobalSearch('name', 'x').subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne((r) => r.url.includes(AppApiConfig.CAT_MGR_VENDOR_SUMMARY_FOR_GLOBAL_SEARCH));
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getVendorSummaryForGlobalSearch with empty filters', () => {
    service.getVendorSummaryForGlobalSearch('', '').subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne((r) => r.url.includes(AppApiConfig.CAT_MGR_VENDOR_SUMMARY_FOR_GLOBAL_SEARCH));
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllClientRFQsByGMTForCMandCM2ByPagination', () => {
    service.getAllClientRFQsByGMTForCMandCM2ByPagination(0, 10).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne((r) => r.url.includes(AppApiConfig.FETCH_ALL_CLIENT_RFQS_BY_GMT_CATEGORYMANAGER));
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllClientRFQsByGMTForCMandCM2ByGlobalSearch', () => {
    service.getAllClientRFQsByGMTForCMandCM2ByGlobalSearch('name', 'x').subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne((r) => r.url.includes(AppApiConfig.FETCH_ALL_CLIENT_RFQS_BY_GMT_CATEGORYMANAGER_FOR_GLOBAL_SEARCH));
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getVendorsByRFQIdForGMT', () => {
    service.getVendorsByRFQIdForGMT({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_BY_RFQ_ID_FOR_GMT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getItemsByRFQIdForGMT', () => {
    service.getItemsByRFQIdForGMT({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEMS_BY_RFQ_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call updateCommentsAsReadByCM', () => {
    service.updateCommentsAsReadByCM({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_COMMENTS_AS_READ_BY_CM);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call ignoreRFQByGTMVendor', () => {
    service.ignoreRFQByGTMVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.IGNORE_RFQ_BY_GMT_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call riaseQueryRFQByGTMVendor', () => {
    service.riaseQueryRFQByGTMVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.RAISE_QUERY_FOR_RFQ_BY_GMT_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call acceptVendorByCM', () => {
    service.acceptVendorByCM({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.ACCEPT_GMT_VENDOR_BY_CM);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call rejectVendorByCM', () => {
    service.rejectVendorByCM({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.REJECT_GMT_VENDOR_BY_CM);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAllRFQSByClientInitiatorGMT', () => {
    service.getAllRFQSByClientInitiatorGMT({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.FETCH_ALL_RFQ_IDS_BY_GMT_CLIENTINTIATOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call querySupportMailByClientIntiatory', () => {
    service.querySupportMailByClientIntiatory({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.QUERY_SUPPORT_MAIL);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorInfoById', () => {
    service.getVendorInfoById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_INFO_BY_ID_GMT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getBuyerInfoByRFQId', () => {
    service.getBuyerInfoByRFQId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_BUYER_INFO_BY_RFQ_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getClientInfoById', () => {
    service.getClientInfoById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_INFO_BY_ID_GMT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getClientInfoByRFQId', () => {
    service.getClientInfoByRFQId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_INFO_BY_RFQ_ID_GMT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
