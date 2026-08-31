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

  requestRegistration(data: any) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.VENDOR_INVITATION_REGISTRATION, data, {});
  }

}
