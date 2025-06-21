import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getHSNCodes(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_HSNCODES, data, {});
  }

  getHSNNames(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_HSNNAMES, data, {});
  }

  getSacCodes(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_SACCODES, data, {});
  }

  getSacNames(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_SACNAMES, data, {});
  }

  getSubCategoryByHSN(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_SUB_CATEGORY_BY_HSN, data, {});
  }
  getSubCategoryBySac(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_SUB_CATEGORY_BY_SAC, data, {});
  }

  getAllSubCategoryList(): Observable<any> {
    return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_SUB_CATEGORIES_LIST, {});
  }

  createSubCategory(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_SUBCATEGORY_HSN, data, {});
  }

  getAllItemsMaster() {
    return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_ITEMS, {});
  }
  getAllItemsForCM() {
    return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_ITEMS_FOR_CM, {});
  }

  // Item Category
  fetchAllHSNCodes() {
    return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_HSN_CODES, {});
  }

  fetchAllSacCodes() {
    return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_SAC_CODES, {});
  }

  getSubCategoryByHsnCode(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_SUB_CATEGORY_BY_HSN, data, {});
  }
  updateSubCategoryData(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_SUB_CATEGORY_DETAILS, data, {});
  }

  getItemMasterBySubCategory(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEM_MASTER_BY_SUB_CATEGORY, data, {});
  }

  createItemMasterByHsnOrSac(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_ITEM_MASTER_BY_OR_HSN_SAC, data, {});
  }

  getAllUOM() {
    return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_UOM, {});
  }

  getVendorsSearch(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_DATA_BY_VENDOR_SEARCH, data, {});
  }

  getVendorsSearchByItemCode(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_VENDORS_BY_ITEM_CODE, data, {});
  }

  getVendorsSearchByItemCodeForCM(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_VENDORS_BY_ITEM_CODE_FOR_CM, data, {});
  }

  createDynamicPricingByItemcodes(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_DYNAMIC_PRICING_WITH_ITEM_CODE, data, {});
  }

  deactivateItem(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.DEACTIVATE_ITEM, data, {});
  }
  activateItem(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.ACTIVATE_ITEM, data, {});
  }

  deactivateVendor(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.DEACTIVATE_VENDOR, data, {});
  }
  activateVendor(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.ACTIVATE_VENDOR, data, {});
  }




  getClientSearch(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.CLIENT_SEARCH, data, {});

  }

  getLinkedVendorByItemId(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_BY_ITEM_ID, data, {});
  }

  getLinkedClientByItemId(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_BY_ITEM_ID, data, {});
  }

  LinkToVendorWithItem(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_LINK_ITEM_TO_VENDOR, data, {});
  }

  LinkToClientWithItem(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_LINK_ITEM_TO_CLIENT, data, {});
  }

  getItemsByVendor(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEMS_BY_VENDOR, data, {});
  }

  getItemsByVendorRef(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_LINKED_ITEMS_BY_VENDOR_REF, data, {});
  }

  editItemByVendor(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.EDIT_ITEM_BY_VENDOR, data, {});
  }

  editItemByVendorRef(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.EDIT_LINKED_ITEM_BY_VENDOR_REF, data, {});
  }

  // PR screen APIs
  getLinkedItemsByClient(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_LINKED_ITEMS_BY_CLIENT, data, {});
  }

  getLinkedVendorsByClient(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_LINK_ITEM_VENDOR_CLIENT, data, {});
  }

  getVendorsByClientAndItem(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_BY_ITEM, data, {});
  }

  getItemsByVendorAndClient(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEMBY_VENDOR, data, {});
  }

  LinkToClientWithVendorClient(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_LINKED_VENDORS_BY_CLIENT, data, {});
  }

  getClientsListByItemAndVendor(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENTS_LIST_BY_ITEM_VENDOR, data, {});
  }

  approveItem(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.APPROVE_ITEM, data, {});
  }

  rejectItem(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.REJECT_ITEM, data, {});
  }

  approveSubCategory(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.APPROVE_SUB_CATEGORY, data, {});
  }

  rejectSubCategory(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.REJECT_SUB_CATEGORY, data, {});
  }

  delinkVendor(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.DELINK_VENDOR_ITEM_FROM_CLIENT, data, {});
  }

  getAllItemPriceApprovals() {
    return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEM_PRICE_APPROVALS, {});
  }

  approveItemPrice(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.APPROVE_ITEM_PRICE, data, {});
  }

  enableEditToVendor(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.ENABLE_EDIT_ITEM_TO_VENDOR, data, {});
  }

  getEditDatesByVendor(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ENABLE_DATES_BY_VENDOR, data, {});
  }

  getAddItemToPr(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.ADD_ITEM_TO_PR, data, {});
  }

  getHSNCodesAndNames(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_HSNCODES_HSNNAMES, data, {});
  }
  getSACCodesAndNames(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_SACCODES_SACNAMES, data, {});
  }

  editItemDescription(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.EDIT_ITEM_DESCRIPTION, data, {});
  }

  getDynamicPricingItems() {
    return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_DYNAMIC_PRICING_ITEMS, {});
  }

  getDynamicPricingItemsForCM() {
    return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_DYNAMIC_PRICING_ITEMS_FOR_CM, {});
  }

  getVendorsByItem(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_BY_ITEM, data, {});
  }


  getRegionsByOrgId(data){
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_REGIONS_BY_ORD_ID, data, {});

  }

  getLinkedVendorsByRegion(data){
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_LIKED_VENDORS_BY_CLIENT_REGION, data, {});

  }

  //CREATE_QUOTE_COMPARISION_CAPEX

  createQuoteComparisionCAPEX(data){
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_QUOTE_COMPARISION_CAPEX, data, {});

  }
}
