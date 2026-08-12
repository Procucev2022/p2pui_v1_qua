import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientService } from './client-service.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ClientService,
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open', 'closeAll']) }
      ]
    });
    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getPRitemsByid', () => {
    service.getPRitemsByid({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_ITEMS_BY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getPrById', () => {
    service.getPrById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_BY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getSquareFeetPrById', () => {
    service.getSquareFeetPrById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_SQR_FEET_PR_BY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getPrTrackingStatus', () => {
    service.getPrTrackingStatus({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.PR_TRACKING_STATUS_END_POINT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getRfqwiseAuctionIdsByPR', () => {
    service.getRfqwiseAuctionIdsByPR({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQ_AUCTION_ID_BY_PR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getRFQWiseSummary', () => {
    service.getRFQWiseSummary({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQ_WISE_SUMMARY);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getCapexExcelSummary', () => {
    service.getCapexExcelSummary({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_CAPEX_EXCEL_SUMMARY);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getItemWiseSummary', () => {
    service.getItemWiseSummary({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEM_WISE_SUMMARY);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getPpoDocuments', () => {
    service.getPpoDocuments({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PPO_DOC_BY_PPO);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getItemCatalogue', () => {
    service.getItemCatalogue({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEM_CATALOGUE_BY_CLIENT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call createItemCatalogue', () => {
    service.createItemCatalogue({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_ITEM_CATALOGUE_REQ_BY_CLIENT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorsByItem', () => {
    service.getVendorsByItem({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_BY_ITEM);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorsByItemForClientInitiator', () => {
    service.getVendorsByItemForClientInitiator({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_BY_ITEM_FOR_CLIENT_INITIATOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call prChart', () => {
    service.prChart({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_COUNT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call prLeadTimeChart', () => {
    service.prLeadTimeChart({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_INPROGRESS_PR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call prPpoChart', () => {
    service.prPpoChart({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_PPO);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call auctionChart', () => {
    service.auctionChart({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_AUCTION_COUNT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getPRByClientStatus', () => {
    service.getPRByClientStatus({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_BY_CLIENT_STATUS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getRFQVendorsByPRId', () => {
    service.getRFQVendorsByPRId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQ_VENDORS_BY_PR_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getSubCategoryList', () => {
    service.getSubCategoryList({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_SUB_CATEGORY_LIST);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getProjectCategoryList', () => {
    service.getProjectCategoryList({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PROJECT_SUB_CATEGORY_BY_CLIENT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getPriceTrendByItemId', () => {
    service.getPriceTrendByItemId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PRICE_TREND_BY_ITEM);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getPriceTrendByItemIdAndVendorId', () => {
    service.getPriceTrendByItemIdAndVendorId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PRICE_TREND_BY_ITEM_AND_VENDORID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call updateItemCatalogueByRequest', () => {
    service.updateItemCatalogueByRequest({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_ITEM_CATALOGUE_REQ_BY_CLIENT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call createItemCatalogueByRequestBOQFile', () => {
    service.createItemCatalogueByRequestBOQFile({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_ITEM_CATALOGUE_REQ_BY_BOQ_FILE);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getItemDetailsById', () => {
    service.getItemDetailsById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEM_CATALOGUE_REQ_BY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorsByclientAndCategory', () => {
    service.getVendorsByclientAndCategory({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_BY_CLIENT_AND_CATEGORy);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should set and get edit PR modal data', () => {
    const dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    service.setToEditPRModal({ id: 'pr1' });
    expect(dialog.closeAll).toHaveBeenCalled();
    expect(service.getToEditPRModal()).toEqual({ id: 'pr1' });
  });

  it('should push pr summary subject via goToEditPRModal', () => {
    const dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    let value = null;
    service.getprData.subscribe((v) => (value = v));
    service.goToEditPRModal({ id: 'pr2' });
    expect(dialog.closeAll).toHaveBeenCalled();
    expect(value).toEqual({ id: 'pr2' });
  });

  it('should call getPrSummaryData with dynamic endpoint', () => {
    service.getPrSummaryData({ id: 1 }, AppApiConfig.GET_ITEM_WISE_SUMMARY).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEM_WISE_SUMMARY);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
