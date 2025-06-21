import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Injectable({
  providedIn: 'root'
})
export class ApprovePrService {

    constructor(private httpService: HttpClient) { }

    approvePRService(data){
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.PR_ACCEPT,data,{})
    }

    approvePRServices(data){
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.PR_ACCEPT,data,{})
    }
    rejectPRService(data){
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.PR_REJECT,data,{})
    }

    closePRService(data){
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.PR_CLOSE,data,{})
    }
}
