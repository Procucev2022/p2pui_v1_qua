import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Injectable({
  providedIn: 'root'
})
export class CatProcuQuotationsService {

  constructor(private httpService: HttpClient) { }

  getQuotsList() {
    // return this.httpService.get('/assets/jsons/prqs.json');
    return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_QUOTATIONS, {})
  }

  getPRByQuotation(req): any {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PRS_BY_QUOTATIONS, req, {})

  }
  getVendorsByQuot(req): any {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_QUOTATIONS, req, {})

  }
  getRFQsByQuot(req): any {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQ_BY_QUOTATIONS, req, {})

  }
  getLineItemsByQuot(req): any {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_LINE_ITEMS_BY_QUOTATIONS, req, {})

  }

  getVendorsByClientId(req:any){
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_LIST_BY_CLIENT_ID, req, {})

  }

}
