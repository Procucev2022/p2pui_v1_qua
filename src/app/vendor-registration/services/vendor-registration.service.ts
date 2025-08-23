import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VendorRegistrationService {

    constructor(private http: HttpClient) { }

    saveVendorRegistration(data: any) {
        //  return this.http.post('http://104.154.48.179:8080/authprocucev/rest1/vendor/newVendorRegistration',data)
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.NEW_VENDOR_REGISTRATION, data, {});
    }

    submitVendorRegistration(data: any) {
        // return this.http.post('http://104.154.48.179:8080/authprocucev/rest1/vendor/submitVendorRegistration',data)
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.SUBMIT_VENDOR_REGISTRATION, data, {});
    }

    getHsnCodes() {
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_HSN_CODES, {});
    }

    getSacCodes() {
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_SAC_CODES, {});
    }


    getVendorById(data): Observable<any> {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_BY_ID, data, {});
    }

    getGMTSellerById(data): Observable<any> {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_GMT_SELLER_BY_ID, data, {});
    }
    

    getUpdateOrgTc(data): Observable<any> {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_UPDATE_ORG_TC, data, {});
    }

    getVendorTc() {
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_TC, {});
    }

    editVendor(data: any) {
        // return this.http.post('http://104.154.48.179:8080/authprocucev/rest1/vendor/submitVendorRegistration',data)
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.EDIT_VENDOR, data, {});
    }

    

    submitSelfVendorRegistration(data: any) {

        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.SUBMIT_VENDOR_SELF_REGISTRATION, data, {});
    }


    //panValidation
    panOrEamilValidation(data: any) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.PAN_VALIDATION, data, {});

    }
    verifyOTP(data: any) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.OTP_VALIDATION, data, {});

    }

    sendAllOTPs(data: any) {
      return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.OTPs_SENT, data, {});

  }

  validateAllOTPs(data: any) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.  VALIDATE_ALL_OTPS, data, {});

}


    //get Details By Pan
    getDetailsByPan(data: any) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_DETAILS_BY_PAN, data, {});

    }
//submit self client registration
    submitSelfClientRegistration(data: any) {

        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.SUBMIT_CLIENT_SELF_REGISTRATION, data, {});
    }


    //email Validation
    emailValidation(data:any){
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_DETAILS_BY_PAN, data, {});

    }

    sendOTP(data){
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.SEND_OTP_TO_MAIL, data, {});

    }
}
