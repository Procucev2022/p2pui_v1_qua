import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Injectable({
  providedIn: 'root'
})
export class VendorNamesService {

  constructor(private httpService: HttpClient) { }

  getVendorNames() {
    //return this.httpService.get('/assets/jsons/vendrnames.json');
    return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_VENDORS_BY_VENDOR_APPROVED, {});
  }

  getVendorClassificationData(data:any){
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_BY_CATEGORY, data, {})
  }

  getVendorClassificationDataForServices(data:any){
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_BY_SAC,data,{})
  }


  approveVendorRegistration(data:any){
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.APPROVE_VENDOR_REGISTRATION, data, {})
  }

  getSearchData(){
      return this.httpService.get('/assets/jsons/vendor-search.json');
  }



  getRfqsList(): any {
    return this.httpService.get('../services/vendor-search.json');

  }

  getVendorOrClientByType(data:any){
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_OR_CLIENT_BY_TYPE, data, {})
  }

  getProductsByVendor(data:any){
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PRODUCT_BY_VENDOR, data, {})
  }

  getServicesByVendor(data:any){
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_SERVICES_BY_VENDOR, data, {})
  }

}
