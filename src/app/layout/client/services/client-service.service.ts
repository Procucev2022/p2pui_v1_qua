import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  public $_prData = new BehaviorSubject(null);
  getprData = this.$_prData.asObservable();
  constructor(private httpService: HttpClient, private router: Router, private modalDialog: MatDialog) { }

  public prInfo = new BehaviorSubject<any>(null);
  public prDataInfo$ = this.prInfo.asObservable();

  setToEditPRModal(data): void {
    this.modalDialog.closeAll();
    this.prInfo.next(data);
  }

  getToEditPRModal() {
    return this.prInfo.getValue();
  }

  getPrSummaryData(data, serviceEndPoint) {
  return this.httpService.post(AppApiConfig.apiEndpoint + serviceEndPoint , data, {});
   // return this.httpService.get('/assets/jsons/prSummary.json');
  }

  getPRitemsByid(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_ITEMS_BY_ID, data, {});
  }
  getPrById(data) {
    // return this.httpService.post('http://34.68.203.139:8080/procucev/rest/client/getPRById',data,{})
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_BY_ID, data, {});
  }
  getSquareFeetPrById(data) {
    // return this.httpService.post('http://34.68.203.139:8080/procucev/rest/client/getPRById',data,{})
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_SQR_FEET_PR_BY_ID, data, {});
  }

  getPrTrackingStatus(req): any {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.PR_TRACKING_STATUS_END_POINT, req, {});
  }


  getRfqwiseAuctionIdsByPR(data) {
    // return this.httpService.post('http://34.68.203.139:8080/procucev/rest/client/getPRById',data,{})
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQ_AUCTION_ID_BY_PR, data, {});
  }
  getRFQWiseSummary(data) {
    // return this.httpService.post('http://34.68.203.139:8080/procucev/rest/client/getPRById',data,{})
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQ_WISE_SUMMARY, data, {});
  }


  getCapexExcelSummary(data) {
    // return this.httpService.post('http://34.68.203.139:8080/procucev/rest/client/getPRById',data,{})
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_CAPEX_EXCEL_SUMMARY, data, {});
  }


  getItemWiseSummary(data) {
    // return this.httpService.post('http://34.68.203.139:8080/procucev/rest/client/getPRById',data,{})
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEM_WISE_SUMMARY, data, {});
  }

  getPpoDocuments(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PPO_DOC_BY_PPO, data, {});
  }
  goToEditPRModal(data) {
    this.modalDialog.closeAll();
    this.$_prData.next(data);
  }

  getItemCatalogue(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEM_CATALOGUE_BY_CLIENT, data, {});
  }

  createItemCatalogue(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_ITEM_CATALOGUE_REQ_BY_CLIENT, data, {});
  }

  getVendorsByItem(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_BY_ITEM, data, {});
  }
  getVendorsByItemForClientInitiator(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_BY_ITEM_FOR_CLIENT_INITIATOR, data, {});
  }

  prChart(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_COUNT, data, {});
  }

  prLeadTimeChart(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_INPROGRESS_PR, data, {});
  }

  prPpoChart(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_PPO, data, {});
  }

  auctionChart(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_AUCTION_COUNT, data, {});
  }

  getPRByClientStatus(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_BY_CLIENT_STATUS, data, {});
  }

  getRFQVendorsByPRId(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQ_VENDORS_BY_PR_ID, data, {});
  }
  getSubCategoryList(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_SUB_CATEGORY_LIST, data, {});
  }
  getProjectCategoryList(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PROJECT_SUB_CATEGORY_BY_CLIENT, data, {});
  }

  getPriceTrendByItemId(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PRICE_TREND_BY_ITEM, data, {});
  }


  getPriceTrendByItemIdAndVendorId(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PRICE_TREND_BY_ITEM_AND_VENDORID, data, {});
  }

  updateItemCatalogueByRequest(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_ITEM_CATALOGUE_REQ_BY_CLIENT, data, {});
  }
  createItemCatalogueByRequestBOQFile(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_ITEM_CATALOGUE_REQ_BY_BOQ_FILE, data, {});
  }

  getItemDetailsById(data){
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEM_CATALOGUE_REQ_BY_ID, data, {});

  }

  getVendorsByclientAndCategory(data){
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_BY_CLIENT_AND_CATEGORy, data, {});

  }

}
