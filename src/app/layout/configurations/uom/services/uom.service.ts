import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppApiConfig } from "../../../../shared/constants/app-api.config";

@Injectable({
    providedIn: "root",
})
export class UomService {
    constructor(private http: HttpClient) {}

    getAllUOMs(): Observable<any> {
        return this.http.get(
            AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_UOM,
            {}
        );
    }

    createUOM(data): Observable<any> {
        return this.http.post(
            AppApiConfig.apiEndpoint + AppApiConfig.CREATE_UOM,
            data,
            {}
        );
    }
    editUOM(data): Observable<any> {
        return this.http.post(
            AppApiConfig.apiEndpoint + AppApiConfig.EDIT_UOM,
            data,
            {}
        );
    }
}
