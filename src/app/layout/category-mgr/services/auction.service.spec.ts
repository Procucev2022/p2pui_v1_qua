import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuctionService } from './auction.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';


describe('AuctionService', () => {
  let service: AuctionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuctionService
      ]
    });
    service = TestBed.inject(AuctionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAllAuctions', () => {
    service.getAllAuctions().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_AUCTIONS);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllAuctionsForCapex', () => {
    service.getAllAuctionsForCapex().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_AUCTIONS_FOR_CAPEX);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllAuctionsByVendorForCapex', () => {
    service.getAllAuctionsByVendorForCapex({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_AUCTIONS_BY_VENDOR_FOR_CAPEX);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAllAuctionsByVendor', () => {
    service.getAllAuctionsByVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_AUCTIONS_BY_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAuctionsByClientId', () => {
    service.getAuctionsByClientId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_AUCTIONS_BY_CLIENT_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAuctionsByClientIdForCapex', () => {
    service.getAuctionsByClientIdForCapex({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_AUCTIONS_BY_CLIENT_ID_FOR_CAPEX);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getBidsByAuctionId', () => {
    service.getBidsByAuctionId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_BIDS_BY_AUCTION_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAuctionDetails', () => {
    service.getAuctionDetails({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_AUCTION_DETAILS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getBidsByAuctionIdAndVendorId', () => {
    service.getBidsByAuctionIdAndVendorId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_BIDS_BY_AUCTION_ID_AND_VENDOR_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAuctionDocByAuction', () => {
    service.getAuctionDocByAuction({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_AUCTION_DOC_BY_AUCTION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getBidByVendorPdf', () => {
    service.getBidByVendorPdf({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_BID_BY_VENDOR_PDF);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAuctionAccept', () => {
    service.getAuctionAccept({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ACCEPT_TC);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAuctionById', () => {
    service.getAuctionById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_AUCTON_BY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call updateAuctionDetails', () => {
    service.updateAuctionDetails({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_AUCTON_DETAILS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call createAuction', () => {
    service.createAuction({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_AUCTION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call createAuctionForCapex', () => {
    service.createAuctionForCapex({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_AUCTION_FOR_CAPEX);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getItemsByRFQ', () => {
    service.getItemsByRFQ({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_LINE_ITEMS_BY_RFQ);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getQuoteVendorsByRFQ', () => {
    service.getQuoteVendorsByRFQ({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_QUOTE_VENDORS_BY_RFQ);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call editAuction', () => {
    service.editAuction({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.EDIT_AUCTION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call submitBidByVendorForRFQwiseOrItemwise', () => {
    service.submitBidByVendorForRFQwiseOrItemwise({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SUBMIT_BID_BY_VENDOR_FOR_RFQ_OR_ITEM_WISE);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call cancelledAuctions', () => {
    service.cancelledAuctions({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.AUCTIONS_CANCELLED);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getBidItemsByAuction', () => {
    service.getBidItemsByAuction({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_BID_ITEMS_BY_AUCTION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getBidItemsByAuctionForVendor', () => {
    service.getBidItemsByAuctionForVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_BID_ITEMS_BY_AUCTION_FOR_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getBidsByAuction', () => {
    service.getBidsByAuction({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_BIDS_BY_AUCTION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getBidsByAuctionForVendor', () => {
    service.getBidsByAuctionForVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_BIDS_BY_AUCTION_FOR_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getQuoteitemsByRFQ', () => {
    service.getQuoteitemsByRFQ({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PDF_QUOTE_ITEMS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAuctionChartData', () => {
    service.getAuctionChartData({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_AUCTION_PRICE_DATA);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAllAuctionsByStatus', () => {
    service.getAllAuctionsByStatus({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_AUCTIONS_BY_STATUS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAuctionVendorsByAuction', () => {
    service.getAuctionVendorsByAuction({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_AUCTION_VENDORS_BY_AUCTION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
