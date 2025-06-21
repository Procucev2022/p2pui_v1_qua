import { Injectable } from '@angular/core';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VendorMgrService {

  constructor(private httpService: HttpClient) { }

  getAllVendorsByVendorApproved() {
    return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_VENDORS_BY_VENDOR_APPROVED, {});
  }

  getAllVendorsByVendorApprovalPending() {
    return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_VENDOR_BY_VENDOR_APPROVAL_PENDING, {});
  }
  getAllVendorsByVendorRegistrationPending() {
    return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_VENDORS_BY_VENDOR_REGISTRATION_PENDING, {});
  }

  rejectRegistration(data: any) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.REJECT_REGISTRATION, data, {});
  }

  getVendorByStatus(rejectedData) {
      return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_BY_STATUS, rejectedData, {});
  }

  getAllForwardedVendors() {
    return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_SELF_VENDOR_BY_VENDOR_MANAGER, {});
  }

}
