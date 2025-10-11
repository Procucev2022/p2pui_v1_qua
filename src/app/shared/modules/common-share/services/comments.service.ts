import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

  getRFQComments(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQ_COMMENTS_BY, data, {});
  }

  getRFQCommentsByRFQandVendor(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQ_COMMENTS_BY_RFQ_VENDOR, data, {});
  }


  saveRFQComments(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_RFQ_COMMENTS, data, {});
  }

  getVendorsByRfq(req):  Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_BY_RFQ, req, {});
  }

  getPRComments (data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_COMMENTS, data, {});
  }

  savePRComments (data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_PR_COMMENTS, data, {});
  }


  getQuoteComments (data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_QUOTE_COMMENTS, data, {});
  }

  saveQuoteComments (data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_QUOTE_COMMENTS, data, {});
  }

  getPPOComments(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PPO_COMMENTS, data, {});
  }

  savePPOComments (data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_PPO_COMMENTS, data, {});
  }

  savePrClientComment(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_PR_CLIENT_COMMENTS, data, {});
  }
  getPrClientCommentByPr(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_PR_COMMENTS_BY_PR, data, {});
  }

  getPOComments(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PO_COMMENTS, data, {});
  }

  savePOComments (data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_PO_COMMENTS, data, {});
  }

  getDeliveryComments(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_DELIVERY_COMMENTS, data, {});
  }

  saveDeliveryComments (data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_DELIVERY_COMMENTS, data, {});
  }


  getASNComments(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ASN_COMMENTS, data, {});
  }

  saveASNComments (data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_ASN_COMMENTS, data, {});
  }

  getValidatePincode(data): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PINCODE_VALIDATION, data, {});
  }
}
