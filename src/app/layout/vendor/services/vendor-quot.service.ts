import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorQuotService {

    constructor(private http: HttpClient) { }

    getAllQuotation(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_QUOT_FOR_VENDOR, data, {});
    }

    getQuotDataByid(linedata) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_QUOTATION_LINE_ITEMS_BY_ID, linedata, {});
    }

    uploadQuotation(data): Observable<any> {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.UPLOAD_QUOTATION, data, {});
    }

    getQuotCommentsById(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_QUOT_COMMENTS_BY_ID, data, {});
    }

    getAllClientVendors() {
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_CLIENT_VENDORS,  {});
    }
}
