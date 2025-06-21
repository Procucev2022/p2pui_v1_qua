import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
//import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { catchError } from 'rxjs/operators';
import {  throwError } from 'rxjs';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Injectable({
  providedIn: 'root'
})
export class VendorInviteService {

  constructor(private httpService: HttpClient) { }

  requestRegistration(data:any){
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.VENDOR_INVITATION_REGISTRATION,data, {})
    // return this.httpService.post('http://104.154.48.179:8080/procucev/rest/vendorRegistration/requestRegistration',data);
                // .subscribe((errorResponse: HttpErrorResponse)=>{
                //     if(errorResponse.error instanceof ErrorEvent){
                //           console.error('Client side error:',errorResponse.error.message);
                //     } else{
                //          console.error('Server side error:',errorResponse);
                //     }
                //     return throwError('There is a problem with this service. We are notified and working on it. Please try again later');
                // });
  }

}
