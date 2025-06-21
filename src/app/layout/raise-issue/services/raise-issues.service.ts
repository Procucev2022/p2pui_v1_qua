import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Injectable({
    providedIn: 'root'
})
export class RaiseIssuesService {

    constructor(private http: HttpClient) { }

    getRaisedIssues() {
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.FETCH_ALL_QUERIES, {});
    }

    getAllClients() {
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_CLIENTS_FOR_RAISE_ISSUE, {});
    }

    getAllVendors() {
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_VENDORS_FOR_RAISE_ISSUE, {});
    }

    raiseQuery(data){
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.RAISE_QUERY , data, {});
    }

    updateQuery(data){
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_QUERY,data, {});
    }


}
