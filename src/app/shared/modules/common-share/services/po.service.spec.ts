import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PoService } from './po.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

describe('PoService', () => {
  let service: PoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoService]
    });
    service = TestBed.inject(PoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => { expect(service).toBeTruthy(); });

  it('getDynamicFieldsByClientId', () => {
    service.getDynamicFieldsByClientId({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_DYNAMIC_FIELDS_BY_CLIENT_ID).flush({});
  });

  it('createPO', () => {
    service.createPO({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_PO).flush({});
  });

  it('updatePO', () => {
    service.updatePO({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_PO).flush({});
  });

  it('getAllPos', () => {
    service.getAllPos().subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_POS).flush([]);
  });

  it('getPosByVendor', () => {
    service.getPosByVendor({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_POS_BY_VENDOR).flush([]);
  });

  it('getPosByClient', () => {
    service.getPosByClient({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_POS_BY_CLIENT).flush([]);
  });

  it('getPosByPrApprover', () => {
    service.getPosByPrApprover({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_POS_BY_PR_APPROVER).flush([]);
  });

  it('getPoById', () => {
    service.getPoById({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PO_BY_ID).flush({});
  });

  it('cancelPoById', () => {
    service.cancelPoById({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CANCEL_PO_BY_ID).flush({});
  });

  it('rejectPoById', () => {
    service.rejectPoById({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.REJECT_PO_BY_ID).flush({});
  });

  it('getItemsByPO', () => {
    service.getItemsByPO({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEMS_BY_PO).flush([]);
  });

  it('getppobyStatusAndCreatedTS', () => {
    service.getppobyStatusAndCreatedTS({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PPO_BY_STATUS_AND_CREATEDTS).flush([]);
  });

  it('getppoClientbyStatusAndCreatedTS', () => {
    service.getppoClientbyStatusAndCreatedTS({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PPO_CLIENT_BY_STATUS_AND_CREATEDTS).flush([]);
  });

  it('acceptPoOrCreateDeliveryHeader', () => {
    service.acceptPoOrCreateDeliveryHeader({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_DELIVERY_HEADERS).flush({});
  });

  it('getDeliveryHeadersByPOId', () => {
    service.getDeliveryHeadersByPOId({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_DELIVERY_HEADERS_BY_PO_ID).flush([]);
  });

  it('getItemsByDeliveryId', () => {
    service.getItemsByDeliveryId({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEMS_BY_DELIVERY_ID).flush([]);
  });

  it('reviseDeliveryDate', () => {
    service.reviseDeliveryDate({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.REQUEST_FOR_RIVISE_DELIVERY_DATE).flush({});
  });

  it('getDeliveryById', () => {
    service.getDeliveryById({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_DELIVERY_BY_ID).flush({});
  });

  it('setRequestDate', () => {
    service.setRequestDate({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SET_DELIVERY_DATE).flush({});
  });

  it('createASN', () => {
    service.createASN({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_ASN).flush({});
  });

  it('getAsnsByDeliveryId', () => {
    service.getAsnsByDeliveryId({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ASN_BY_DELIVERY_ID).flush([]);
  });

  it('acceptDelivery', () => {
    service.acceptDelivery({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.ACCEPT_DELIVERY_DATE).flush({});
  });

  it('getASNById', () => {
    service.getASNById({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.VIEW_ASN).flush({});
  });

  it('acceptASNById', () => {
    service.acceptASNById({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.ACCEPT_ASN).flush({});
  });

  it('getVendorsBranches', () => {
    service.getVendorsBranches({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_BRANCHES).flush([]);
  });

  it('poApprovedByClientApproved', () => {
    service.poApprovedByClientApproved({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.PO_APPROVED_BY_CLIENT_APPROVER).flush({});
  });

  it('getVendorsByClientAndItem', () => {
    service.getVendorsByClientAndItem({}).subscribe(r => expect(r).toBeTruthy());
    httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_BY_ITEM).flush([]);
  });
});
