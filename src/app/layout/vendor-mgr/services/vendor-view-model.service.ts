import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Injectable({
  providedIn: 'root'
})
export class VendorViewModelService {


  constructor(private httpService: HttpClient) { }

  getVendorById(data:any){
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_BY_ID, data, {})
  }

  getRfqData() {
    return this.httpService.get('/assets/jsons/vendorDashboardRfqs.json');
  }

  // fetching products and services data in vendor registration screen
  getProductsData(){
    return this.httpService.get('/assets/jsons/vendorProductsData.json');
  }

  getServicesData(){
    return this.httpService.get('/assets/jsons/vendorServicesData.json');
  }

  getVendorContactsData(){
    return this.httpService.get('/assets/jsons/vendorContactsData.json');
  }

  getClientRefData(){
    return this.httpService.get('/assets/jsons/vendorClientRefData.json');
  }

}
