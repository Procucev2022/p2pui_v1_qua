import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CatProcuRequestsService } from './cat-procu-requests.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services/encry-decry.service';

describe('CatProcuRequestsService', () => {
  let service: CatProcuRequestsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const encryDecry = jasmine.createSpyObj('EncryDecryService', ['get', 'set']);
    encryDecry.get.and.returnValue(JSON.stringify({ details: { id: 'u1', org: { id: 'o1' } } }));
    localStorage.setItem('logData', 'x');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CatProcuRequestsService,
        { provide: EncryDecryService, useValue: encryDecry }
      ]
    });
    service = TestBed.inject(CatProcuRequestsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getPrLists', () => {
    service.getPrLists({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_PRS_BY_ORGID_AND_STATUS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getPRIdsList', () => {
    service.getPRIdsList().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_IDS);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call geVendorListByPRIdCapex', () => {
    service.geVendorListByPRIdCapex({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_BY_CAPEX_PR_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getCapexPRidsList', () => {
    service.getCapexPRidsList().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_CAPEx_IDS);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getPRIdsListForRFQwise', () => {
    service.getPRIdsListForRFQwise().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_IDS_FOR_RFQ_WISE);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getRfqsByPr', () => {
    service.getRfqsByPr({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQS_BY_PR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getLineItemsByPr', () => {
    service.getLineItemsByPr({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_LINE_ITEMS_BY_PR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call downloadCapexQuoteComparison', () => {
    service.downloadCapexQuoteComparison({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.DOWNLOAD_EXCEL_QUOT_COMPARE_CAPEX);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getQuotationsByRfq', () => {
    service.getQuotationsByRfq({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_QUOTATIONS_BY_RFQ);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getLineItemsByRfq', () => {
    service.getLineItemsByRfq({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_LINE_ITEMS_BY_RFQ);
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

  it('should call getVendorClosingDate', () => {
    service.getVendorClosingDate({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_CLOSING_DATE);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorsByCategory', () => {
    service.getVendorsByCategory({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_BY_CATEGORY);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call createRfq', () => {
    service.createRfq({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_RFQ_FOR_CATEGORY_MANAGER);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getPrAttachments', () => {
    service.getPrAttachments({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_PRODUCT_ITEM_ATTACHMENTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getPrAdresses', () => {
    service.getPrAdresses({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_PRODUCT_ITEM_ADRESSES);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call sentRfqToVendors', () => {
    service.sentRfqToVendors({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SEND_RFQ_TO_VENDORS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call prAccept', () => {
    service.prAccept({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.PR_ACCEPT_CAT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getClients', () => {
    service.getClients().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_CLIENTS);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getClientsForVendorSummaryCM', () => {
    service.getClientsForVendorSummaryCM().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_CLIENTS_PROCPX_VENDOR_SUMMARY);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getClientVerticals', () => {
    service.getClientVerticals().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_VERTICALS);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call createClientRegistration', () => {
    service.createClientRegistration({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_CLIENT_REGISTRATION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getClientDetails', () => {
    service.getClientDetails({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_DETAILS_BY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call updateClient', () => {
    service.updateClient({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_CLIENT_REGISTRATION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getQuotationDetails', () => {
    service.getQuotationDetails({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_QUOTATION_DETAILS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getCompareQuoteByPR', () => {
    service.getCompareQuoteByPR({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_COMPARE_QUOTS_BY_PR_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getCompareQuoteByRFQ', () => {
    service.getCompareQuoteByRFQ({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_COMPARE_QUOTS_BY_RFQ_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getCompareQuoteByRFQView', () => {
    service.getCompareQuoteByRFQView({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_COMPARE_QUOTS_BY_RFQ_ID_VIEW);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call createPPO', () => {
    service.createPPO({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.PPO_CREATE);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getRFQByPRId', () => {
    service.getRFQByPRId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQ_ID_BY_PR_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call clientuserCreation', () => {
    service.clientuserCreation({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_USERS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call submitvendorRank', () => {
    service.submitvendorRank({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SUBMIT_VENDOR_RANK);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call clientRoles', () => {
    service.clientRoles().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_ROLES);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getclientdepartmentByclient', () => {
    service.getclientdepartmentByclient({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_DEPARTMENT_BY_CLIENT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getClientUserByClient', () => {
    service.getClientUserByClient({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_USER_BY_CLIENT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getCompareQuoteExcelByPR', () => {
    service.getCompareQuoteExcelByPR({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_COMPARE_QUOTE_EXCEL_BY_PR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getCompareQuoteExcelByRfq', () => {
    service.getCompareQuoteExcelByRfq({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_COMPARE_QUOTE_EXCEL_BY_RFQ);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAllItemCatalogues', () => {
    service.getAllItemCatalogues().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_CAT_MGR_ITEM_CATALOGUE);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call closeItemReq', () => {
    service.closeItemReq({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CLOSE_ITEM_REQUEST);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call linkNowReq', () => {
    service.linkNowReq({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.LINK_PR_ITEM);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getPrByOrgAndCreatedTS', () => {
    service.getPrByOrgAndCreatedTS({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_BY_ORG_AND_CREATEDTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getPrByCMAndCreatedTS', () => {
    service.getPrByCMAndCreatedTS({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_BY_CM_AND_CREATEDTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getUserNamesByOrg', () => {
    service.getUserNamesByOrg({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_USERNAMES_BY_ORG);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getDepartmentsByOrg', () => {
    service.getDepartmentsByOrg({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_DEPARTMENTS_BY_ORG);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getRfqsList asset json', () => {
    service.getRfqsList().subscribe((res: any) => expect(res).toEqual([]));
    httpMock.expectOne('/assets/jsons/rfqs.json').flush([]);
  });

  it('should load vendors by PR id for capex (array)', () => {
    service.getVendorsByPRIdForCapex({ id: 'pr-1' });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_BY_CAPEX_PR_ID);
    req.flush([{ id: 'v1' }]);
    expect(service.getVendorsListByCapex()).toEqual([{ id: 'v1' }]);
  });

  it('should load vendors by PR id for capex (non-array)', () => {
    service.getVendorsByPRIdForCapex({ id: 'pr-2' });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_BY_CAPEX_PR_ID);
    req.flush({ not: 'array' });
    expect(service.getVendorsListByCapex()).toEqual([]);
  });

  it('should call getQuoteCompExcelJSON', () => {
    service.getQuoteCompExcelJSON().subscribe((res: any) => expect(res).toEqual({ ok: true }));
    httpMock.expectOne('/assets/jsons/excel-quote-comparison.json').flush({ ok: true });
  });
});
