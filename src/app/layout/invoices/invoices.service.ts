import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  constructor(private http: HttpClient) { }

  getAllInvoices(data) {
    return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.FETCH_ALL_INVOICES, data);
  }

  getAllInvoicesByClientId(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_INVOICES_BY_CLIENT, data,  {});
  }

  getAllInvoicesByVendor(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_INVOICES_BY_VENDOR, data,  {});
  }

  getItemsByASNId(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEMS_BY_ASN_ID, data,  {});
  }

  createInvoice(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_INVOICE, data,  {});
  }

  getInvoiceById(data) {
     return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.VIEW_INVOICE, data,  {});
  }

 acceptInvoiceById(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.ACCEPT_INVOICE, data,  {});
 }

 getPOAdvanceById(data) {
  return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PO_ADVANCE_BY_ID, data,  {});
 }
 getPoAdvanceByPo(data) {
  return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PO_ADVANCE_BY_PO, data,  {});
 }
 createPOAdvancePayment(data) {
  return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_PO_ADVANCE_PAYMENT, data,  {});
 }
 editPOAdvancePayment(data) {
  return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.EDIT_PO_ADVANCE_PAYMENT, data,  {});
 }
 getPosByClientAndAdvance(data) {
  return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_POS_BY_CLIEN_AND_ADVANCE, data,  {});
 }
 getPosByAdvance(data) {
  return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_POS_BY_ADVANCE,  {});
 }
 getPosByVendorAndAdvance(data) {
  return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_POS_BY_VENDOR_AND_ADVANCE, data,  {});
 }
 acceptPOAdvancePayment(data) {
  return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.ACCEPT_PO_ADVANCE_PAYMENT, data,  {});
 }
 getAdditionalItemsByInvoiceId(data) {
   return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ADDITIONAL_ITEMS_BY_INVOICEID, data,  {});
 }
}
