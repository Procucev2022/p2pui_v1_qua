import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Injectable({
  providedIn: 'root'
})
export class TestServiceService {

  constructor(private http:HttpClient) { }

  getTestdata(data){
      return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEMS_BY_RFQ_ID, data,{})
  }
}
