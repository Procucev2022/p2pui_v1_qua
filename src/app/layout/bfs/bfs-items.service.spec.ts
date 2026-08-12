import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BfsItemsService } from './bfs-items.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services/encry-decry.service';

describe('BfsItemsService', () => {
  let service: BfsItemsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const encryDecry = jasmine.createSpyObj('EncryDecryService', ['get', 'set']);
    encryDecry.get.and.returnValue(JSON.stringify({ details: { id: 'u1', org: { id: 'o1' } } }));
    localStorage.setItem('logData', 'x');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BfsItemsService,
        { provide: EncryDecryService, useValue: encryDecry }
      ]
    });
    service = TestBed.inject(BfsItemsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call createItems', () => {
    service.createItems({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_CREATE_ITEMS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getOrgSearch', () => {
    service.getOrgSearch({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_ORG_SEARCH);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getOrgSearchByEmailPhone', () => {
    service.getOrgSearchByEmailPhone({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_ORG_SEARCH_BY_EMAIL);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getUsersByOrg', () => {
    service.getUsersByOrg({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_USERS_BY_ORG);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAllBFSItems', () => {
    service.getAllBFSItems({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_ALL_BFS_ITEMS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getRequestedUsersByBFSForCM', () => {
    service.getRequestedUsersByBFSForCM({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_REQUESTED_USERS_BY_BFS_FOR_CM);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getRequestedUsersByBFSForSeller', () => {
    service.getRequestedUsersByBFSForSeller({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_REQUESTED_USERS_BY_BFS_FOR_SELLER);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getMyItems', () => {
    service.getMyItems().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_MY_ITEMS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getSellerBidMyItems', () => {
    service.getSellerBidMyItems().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SELLER_BID_MY_ITEMS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getRequestedItemstoCM', () => {
    service.getRequestedItemstoCM().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_REQUESTED_ITEMS_BY_CM);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call requestBFSItem', () => {
    service.requestBFSItem({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_REQUEST_BFS_ITEM);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call approveBFSItemByCM', () => {
    service.approveBFSItemByCM({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_APPROVE_BFS_ITEM_BY_CM);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call bfsRejectedBySeller', () => {
    service.bfsRejectedBySeller({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_REJECTED_BY_SELLER);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call bfsAcceptedBySeller', () => {
    service.bfsAcceptedBySeller({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_ACPETED_BY_SELLER);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getBFSItemsByBOQFile', () => {
    service.getBFSItemsByBOQFile({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_ITEMS_BY_BOQ_FILE);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getDocsByBFSId', () => {
    service.getDocsByBFSId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_DOCUMENTS_BY_BFS_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getItemDetails', () => {
    service.getItemDetails({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_ITEM_DETAILS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getBFSItemDetailsById', () => {
    service.getBFSItemDetailsById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_BFS_ITEMDETAILS_BY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call editBFSItemDetails', () => {
    service.editBFSItemDetails({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_EDIT_BFS_ITEM_DATA);
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

  it('should call getReqItemsByBuyer', () => {
    service.getReqItemsByBuyer({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_REQUESTED_BY_ITEMS_BY_BUYER);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call createCommentsByBuyer', () => {
    service.createCommentsByBuyer({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_CREATE_COMMENT_BY_BUYER);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getCommentsByBuyer', () => {
    service.getCommentsByBuyer({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_COMMENTS_BY_BUYER);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getCommentsByCM', () => {
    service.getCommentsByCM({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_COMMENTS_BY_CM);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getBuyersByBidItems', () => {
    service.getBuyersByBidItems({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_BUYERS_BY_BID_ITEMS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call editBFSBuyerItemBySeller', () => {
    service.editBFSBuyerItemBySeller({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_EDIT_BUYER_ITEM_BY_SELLER);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call reBidByBuyerWithNewQtyPrice', () => {
    service.reBidByBuyerWithNewQtyPrice({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_RE_BID_BY_BUYER_WITH_NEW_QTY);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call uniqueIdDetails', () => {
    service.uniqueIdDetails({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_UNIQUE_ID_BASE_DETAILS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call selectedIdDetails', () => {
    service.selectedIdDetails({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_USER_INFO_DETAILS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call addBFSImage', () => {
    service.addBFSImage({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_USER_INFO_DETAILS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getBFSImage', () => {
    service.getBFSImage({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_IMAGES);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call deactiveCommentFlag', () => {
    service.deactiveCommentFlag({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.BFS_COMMENT_FLAG_DEACTIVE);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
