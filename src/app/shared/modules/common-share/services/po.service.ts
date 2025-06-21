import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Injectable({
  providedIn: 'root'
})
export class PoService {


  constructor(private http: HttpClient) { }

  getDynamicFieldsByClientId(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_DYNAMIC_FIELDS_BY_CLIENT_ID, data, {});
  }

  createPO(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_PO, data, {});
  }

  updatePO(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_PO, data, {});
  }

  getAllPos() {
    return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_POS,  {});
  }

  getPosByVendor(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_POS_BY_VENDOR, data,  {});
  }

  getPosByClient(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_POS_BY_CLIENT, data,  {});
  }
  getPosByPrApprover(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_POS_BY_PR_APPROVER, data );
  }

  getPoById(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PO_BY_ID, data,  {});
  }

  cancelPoById(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.CANCEL_PO_BY_ID, data,  {});
  }
  rejectPoById(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.REJECT_PO_BY_ID, data,  {});
  }

  getItemsByPO(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEMS_BY_PO, data,  {});
  }

  getppobyStatusAndCreatedTS(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PPO_BY_STATUS_AND_CREATEDTS, data,  {});
  }
  getppoClientbyStatusAndCreatedTS(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PPO_CLIENT_BY_STATUS_AND_CREATEDTS, data,  {});
  }
  acceptPoOrCreateDeliveryHeader(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_DELIVERY_HEADERS, data,  {});
  }


  getDeliveryHeadersByPOId(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_DELIVERY_HEADERS_BY_PO_ID, data,  {});
  }

  getItemsByDeliveryId(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEMS_BY_DELIVERY_ID, data,  {});
  }

  reviseDeliveryDate(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.REQUEST_FOR_RIVISE_DELIVERY_DATE, data,  {});
  }

  //
  getDeliveryById(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_DELIVERY_BY_ID, data,  {});
  }

  setRequestDate(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.SET_DELIVERY_DATE, data,  {});
  }

  createASN(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_ASN, data,  {});
  }

  getAsnsByDeliveryId(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ASN_BY_DELIVERY_ID, data,  {});
  }

  acceptDelivery(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.ACCEPT_DELIVERY_DATE, data,  {});
  }

  getASNById(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.VIEW_ASN, data,  {});
  }

  acceptASNById(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.ACCEPT_ASN, data,  {});
 }

 getVendorsBranches(data) {
  return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_BRANCHES, data,  {});
 }

 poApprovedByClientApproved(data) {
  return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.PO_APPROVED_BY_CLIENT_APPROVER, data,  {});
 }

 getVendorsByClientAndItem(data) {
  return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_BY_ITEM, data, {});
}
}
