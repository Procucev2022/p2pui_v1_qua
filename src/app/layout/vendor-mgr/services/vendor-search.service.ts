import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Injectable({
  providedIn: 'root'
})
export class VendorSearchService {



  constructor(private http:HttpClient) { }

  getSearch(city:string,companyName:string,category:any[]){
      const search ={
        companyName:companyName,
          city:city,
          vendorCategory:category
      };
    console.log(search)
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_DATA_BY_VENDOR_SEARCH, search);
    //return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_DATA_BY_VENDOR_SEARCH,vendorName);
    //return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_DATA_BY_VENDOR_SEARCH,city);

  }
  getSearchData(data){
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_DATA_BY_VENDOR_SEARCH, data,{});
    //return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_DATA_BY_VENDOR_SEARCH,vendorName);
    //return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_DATA_BY_VENDOR_SEARCH,city);

  }

  getVendorInfo(data:any){
    return this.http.post(AppApiConfig.apiEndpoint +AppApiConfig.GET_VENDOR_INFO, data, {})
  }
}
