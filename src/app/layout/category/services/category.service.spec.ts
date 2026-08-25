import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';


describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CategoryService
      ]
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getHSNCodes', () => {
    service.getHSNCodes({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_HSNCODES);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getHSNNames', () => {
    service.getHSNNames({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_HSNNAMES);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getSacCodes', () => {
    service.getSacCodes({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_SACCODES);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getSacNames', () => {
    service.getSacNames({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_SACNAMES);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getSubCategoryByHSN', () => {
    service.getSubCategoryByHSN({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_SUB_CATEGORY_BY_HSN);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getSubCategoryBySac', () => {
    service.getSubCategoryBySac({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_SUB_CATEGORY_BY_SAC);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAllSubCategoryList', () => {
    service.getAllSubCategoryList().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_SUB_CATEGORIES_LIST);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call createSubCategory', () => {
    service.createSubCategory({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_SUBCATEGORY_HSN);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAllItemsMaster', () => {
    service.getAllItemsMaster().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_ITEMS);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getAllItemsForCM', () => {
    service.getAllItemsForCM().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_ITEMS_FOR_CM);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call fetchAllHSNCodes', () => {
    service.fetchAllHSNCodes().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_HSN_CODES);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call fetchAllSacCodes', () => {
    service.fetchAllSacCodes().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_SAC_CODES);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getSubCategoryByHsnCode', () => {
    service.getSubCategoryByHsnCode({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_SUB_CATEGORY_BY_HSN);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call updateSubCategoryData', () => {
    service.updateSubCategoryData({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_SUB_CATEGORY_DETAILS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getItemMasterBySubCategory', () => {
    service.getItemMasterBySubCategory({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEM_MASTER_BY_SUB_CATEGORY);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call createItemMasterByHsnOrSac', () => {
    service.createItemMasterByHsnOrSac({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_ITEM_MASTER_BY_OR_HSN_SAC);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAllUOM', () => {
    service.getAllUOM().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_UOM);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getVendorsSearch', () => {
    service.getVendorsSearch({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_DATA_BY_VENDOR_SEARCH);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorsSearchByItemCode', () => {
    service.getVendorsSearchByItemCode({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_VENDORS_BY_ITEM_CODE);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorsSearchByItemCodeForCM', () => {
    service.getVendorsSearchByItemCodeForCM({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_VENDORS_BY_ITEM_CODE_FOR_CM);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call createDynamicPricingByItemcodes', () => {
    service.createDynamicPricingByItemcodes({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_DYNAMIC_PRICING_WITH_ITEM_CODE);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call deactivateItem', () => {
    service.deactivateItem({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.DEACTIVATE_ITEM);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call activateItem', () => {
    service.activateItem({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.ACTIVATE_ITEM);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call deactivateVendor', () => {
    service.deactivateVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.DEACTIVATE_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call activateVendor', () => {
    service.activateVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.ACTIVATE_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getClientSearch', () => {
    service.getClientSearch({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CLIENT_SEARCH);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getLinkedVendorByItemId', () => {
    service.getLinkedVendorByItemId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_BY_ITEM_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getLinkedClientByItemId', () => {
    service.getLinkedClientByItemId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_BY_ITEM_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call LinkToVendorWithItem', () => {
    service.LinkToVendorWithItem({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_LINK_ITEM_TO_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call LinkToClientWithItem', () => {
    service.LinkToClientWithItem({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_LINK_ITEM_TO_CLIENT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getItemsByVendor', () => {
    service.getItemsByVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEMS_BY_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getItemsByVendorRef', () => {
    service.getItemsByVendorRef({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_LINKED_ITEMS_BY_VENDOR_REF);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call editItemByVendor', () => {
    service.editItemByVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.EDIT_ITEM_BY_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call editItemByVendorRef', () => {
    service.editItemByVendorRef({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.EDIT_LINKED_ITEM_BY_VENDOR_REF);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getLinkedItemsByClient', () => {
    service.getLinkedItemsByClient({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_LINKED_ITEMS_BY_CLIENT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getLinkedVendorsByClient', () => {
    service.getLinkedVendorsByClient({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_LINK_ITEM_VENDOR_CLIENT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorsByClientAndItem', () => {
    service.getVendorsByClientAndItem({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_BY_ITEM);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getItemsByVendorAndClient', () => {
    service.getItemsByVendorAndClient({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEMBY_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call LinkToClientWithVendorClient', () => {
    service.LinkToClientWithVendorClient({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_LINKED_VENDORS_BY_CLIENT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getClientsListByItemAndVendor', () => {
    service.getClientsListByItemAndVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENTS_LIST_BY_ITEM_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call approveItem', () => {
    service.approveItem({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.APPROVE_ITEM);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call rejectItem', () => {
    service.rejectItem({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.REJECT_ITEM);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call approveSubCategory', () => {
    service.approveSubCategory({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.APPROVE_SUB_CATEGORY);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call rejectSubCategory', () => {
    service.rejectSubCategory({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.REJECT_SUB_CATEGORY);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call delinkVendor', () => {
    service.delinkVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.DELINK_VENDOR_ITEM_FROM_CLIENT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAllItemPriceApprovals', () => {
    service.getAllItemPriceApprovals().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEM_PRICE_APPROVALS);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call approveItemPrice', () => {
    service.approveItemPrice({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.APPROVE_ITEM_PRICE);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call enableEditToVendor', () => {
    service.enableEditToVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.ENABLE_EDIT_ITEM_TO_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getEditDatesByVendor', () => {
    service.getEditDatesByVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ENABLE_DATES_BY_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAddItemToPr', () => {
    service.getAddItemToPr({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.ADD_ITEM_TO_PR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getHSNCodesAndNames', () => {
    service.getHSNCodesAndNames({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_HSNCODES_HSNNAMES);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getSACCodesAndNames', () => {
    service.getSACCodesAndNames({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_SACCODES_SACNAMES);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call editItemDescription', () => {
    service.editItemDescription({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.EDIT_ITEM_DESCRIPTION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getDynamicPricingItems', () => {
    service.getDynamicPricingItems().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_DYNAMIC_PRICING_ITEMS);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getDynamicPricingItemsForCM', () => {
    service.getDynamicPricingItemsForCM().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_DYNAMIC_PRICING_ITEMS_FOR_CM);
    expect(req.request.method).toBe('GET');
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

  it('should call getRegionsByOrgId', () => {
    service.getRegionsByOrgId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_REGIONS_BY_ORD_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getLinkedVendorsByRegion', () => {
    service.getLinkedVendorsByRegion({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_LIKED_VENDORS_BY_CLIENT_REGION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call createQuoteComparisionCAPEX', () => {
    service.createQuoteComparisionCAPEX({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_QUOTE_COMPARISION_CAPEX);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
