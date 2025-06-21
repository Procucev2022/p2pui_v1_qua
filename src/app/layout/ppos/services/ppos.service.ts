import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { BehaviorSubject, Observable, of } from 'rxjs';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class PposService {

  private is_$hitPPOAPI = new BehaviorSubject<any>(true)
  constructor(private http: HttpClient) { }

  getAllPPOS(req): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.PPO_GET_ALL,req, {});
}

getClientPPOS(req): Observable<any> {
  return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PPO_BY_CLIENT,req, {});
}
  submitPPO(req): Observable<any>{
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.PPO_SUBMIT, req, {});
  }

  acceptPPO(req): Observable<any>{
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.PPO_ACCEPT, req, {});
  }

  rejectPPO(req): Observable<any>{
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.PPO_REJECT, req, {});
  }
  rejectPPOByCm(req): Observable<any>{
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.PPO_REJECT_P, req, {});
  }
  PPOByCm(req): Observable<any>{
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.PPO_ITEMS_BY_PPO_ID, req, {});
  }


  acceptPPOViaService():Observable<any>{
    return this.is_$hitPPOAPI;
  }

  updateAcceptPPOViaService(res:any){
    this.is_$hitPPOAPI.next(res);
  }

  getAllPPOsByVendorAndClient(req:any){
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_PPOS_BY_VENDOR_AND_CLIENT, req, {});
  }
  saveRatingForPPO(req:any){
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.SAVING_RATING_PPO, req, {});
  }

}
