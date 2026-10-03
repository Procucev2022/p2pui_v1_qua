import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreateRfqService } from './create-rfq.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services/encry-decry.service';

describe('CreateRfqService', () => {
  let service: CreateRfqService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const encryDecry = jasmine.createSpyObj('EncryDecryService', ['get', 'set']);
    encryDecry.get.and.returnValue(JSON.stringify({ details: { id: 'u1', org: { id: 'o1' } } }));
    localStorage.setItem('logData', 'x');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CreateRfqService,
        { provide: EncryDecryService, useValue: encryDecry }
      ]
    });
    service = TestBed.inject(CreateRfqService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAllSubCategoriesForRFQ', () => {
    service.getAllSubCategoriesForRFQ().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_SUB_CATEGORY_FOR_RFQ);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllItemsDescriptionsForRFQ', () => {
    service.getAllItemsDescriptionsForRFQ().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_ITEM_MASTER_FOR_RFQ);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllVendorByCategory', () => {
    service.getAllVendorByCategory({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_All_VENDORS_BY_CATEGORY);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAllVendorsList', () => {
    service.getAllVendorsList().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_VENDORS);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllVendorsListByPagination', () => {
    service.getAllVendorsListByPagination(0, 10).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne((r) => r.url.includes(AppApiConfig.GET_ALL_VENDORS_BY_PAGINATION));
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllVendorsBySearchCriteria', () => {
    service.getAllVendorsBySearchCriteria('name', 'acme').subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne((r) => r.url.includes(AppApiConfig.GET_ALL_VENDORS_BY_SEARCH_CRITERIA));
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllVendorsBySearchCriteria with empty filters', () => {
    service.getAllVendorsBySearchCriteria('', '').subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne((r) => r.url.includes(AppApiConfig.GET_ALL_VENDORS_BY_SEARCH_CRITERIA));
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllVendorsBySearchCriteria with city and state parameters', () => {
    service.getAllVendorsBySearchCriteria('category', 'Hardware', 'Mumbai', 'Maharashtra').subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne((r) => {
      return r.url.includes(AppApiConfig.GET_ALL_VENDORS_BY_SEARCH_CRITERIA) &&
             r.params.get('city') === 'Mumbai' &&
             r.params.get('state') === 'Maharashtra' &&
             r.params.get('searchType') === 'category' &&
             r.params.get('searchValue') === 'Hardware';
    });
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllVendorsBySearchCriteria with blank city and state without adding them to params', () => {
    service.getAllVendorsBySearchCriteria('category', 'Hardware', '   ', '   ').subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne((r) => {
      return r.url.includes(AppApiConfig.GET_ALL_VENDORS_BY_SEARCH_CRITERIA) &&
             !r.params.has('city') &&
             !r.params.has('state');
    });
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getCitiesByVendorCategory with and without category', () => {
    service.getCitiesByVendorCategory('Hardware').subscribe((res: any) => {
      expect(res).toEqual({ cities: ['Mumbai'] });
    });
    const req1 = httpMock.expectOne((r) => {
      return r.url.includes(AppApiConfig.GET_CITIES_BY_VENDOR_CATEGORY) &&
             r.params.get('category') === 'Hardware';
    });
    expect(req1.request.method).toBe('GET');
    req1.flush({ cities: ['Mumbai'] });

    service.getCitiesByVendorCategory(null).subscribe((res: any) => {
      expect(res).toEqual({ cities: [] });
    });
    const req2 = httpMock.expectOne((r) => {
      return r.url.includes(AppApiConfig.GET_CITIES_BY_VENDOR_CATEGORY) &&
             r.params.get('category') === '';
    });
    expect(req2.request.method).toBe('GET');
    req2.flush({ cities: [] });
  });

  it('should call sendRFQ', () => {
    service.sendRFQ({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_RFQ_FOR_NOPR_WITH_ITEMS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call createRFQByClient', () => {
    service.createRFQByClient({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_RFQ_FOR_NOPR_WITH_ITEMS_BY_CLIENT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call convertToBOQ', () => {
    service.convertToBOQ({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CONVERT_RFQ_FOR_ITEMS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call forwardRFQ', () => {
    service.forwardRFQ({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.FORWARD_RFQ_TO_VENDORS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getQuotationCounter', () => {
    service.getQuotationCounter({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_QUOTATIONS_COUNT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call saveAuthenticateUser', () => {
    service.saveAuthenticateUser({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_AUTHENTICATE_USER);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call updateAuthenticationUser', () => {
    service.updateAuthenticationUser({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_AUTHENTICATE_USER);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getGMTSummary', () => {
    service.getGMTSummary().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_GMT_SUMMARY);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getGMTRegisteredClients', () => {
    service.getGMTRegisteredClients().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_GMT_FOR_REG_CLIENTS);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getGMTRegisteredClientsWithUser', () => {
    service.getGMTRegisteredClientsWithUser().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_WITH_USER_LIST_CM2);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getVendorCatalogues', () => {
    service.getVendorCatalogues({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_CATALOGUES);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call addVendorCatalogue', () => {
    service.addVendorCatalogue({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.ADD_VENDOR_CATALOGUE);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call addVendorCatalogueTC', () => {
    service.addVendorCatalogueTC({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.ADD_VENDOR_CATALOGUE_TERMS_CONDITIONS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorCatalogueTC', () => {
    service.getVendorCatalogueTC({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_CATALOGUE_TERMS_CONDITIONS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call acceptGMTRegisteredClient', () => {
    service.acceptGMTRegisteredClient({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.ACCEPT_GMT_FOR_REG_CLIENTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call ignoreGMTRegisteredClient', () => {
    service.ignoreGMTRegisteredClient({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.REJECT_GMT_FOR_REG_CLIENTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call editRFQByClient', () => {
    service.editRFQByClient({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.EDIT_RFQ_BY_CLIENT_GMT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call onSaveAndSend', () => {
    service.onSaveAndSend({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.ACCEPT_AND_SAVE_RFQ_BY_CM);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getGMTDivisions', () => {
    service.getGMTDivisions().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_DIVISIONS_GMT);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getGMTCategories', () => {
    service.getGMTCategories().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_CATEGORIES_GMT);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getGMTCategoriesByDivision', () => {
    service.getGMTCategoriesByDivision({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_CATEGORIES_BY_DIVISION_GMT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call updateSellerData', () => {
    service.updateSellerData({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_SELLER_DATA);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call updatePaymentForSubscription', () => {
    service.updatePaymentForSubscription({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_PAYMENT_FOR_SUBSCRIPTION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call updateBuyerData', () => {
    service.updateBuyerData({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_BUYER_DATA);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getBuyerDataById', () => {
    service.getBuyerDataById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_BUYER_BY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getSubscriptionsList', () => {
    service.getSubscriptionsList().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_SUBSCRIPTIONS_LIST);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call updateClientDetails', () => {
    service.updateClientDetails({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_CLIENT_DETAILS_GMT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call updateUserDetails', () => {
    service.updateUserDetails({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_USER_DETAILS_GMT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call deleteUser', () => {
    service.deleteUser({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.DELETE_USER_FOR_REG_CLIENT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getReportData', () => {
    service.getReportData(
      { reportId: 'R1', startDate: '2020-01-01', endDate: '2020-01-31' },
      'GET_REPORT_DATA_FOR_GMT'
    ).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne((r) => r.url.includes(AppApiConfig.GET_REPORT_DATA_FOR_GMT));
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call updateDeliveryLocation', () => {
    service.updateDeliveryLocation({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_DELIVERY_LOCATION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
