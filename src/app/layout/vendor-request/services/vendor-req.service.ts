import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class VendorReqService {

   public vendorEvaluationForm : FormGroup;

    constructor(private http: HttpClient, private fb: FormBuilder) { }

    createNewRequestVendor(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.REQUEST_VENDOR, data, {});
    }

    getAllReqVendors() {
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_REQ_VENDORS, {});
    }

    requestCompleted(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.REQ_COMPLETED, data, {});
    }

    inProgress(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.REQ_IN_PROGRESS, data, {});
    }

    closeRequest(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.CLOSE_REQ, data, {});
    }

    getAllPreVendors() {
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_PRE_VENDORS, {});
    }


    createPreVendor(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.UPLOAD_PRE_VENDORS, data, {});
    }

    inActivate(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.INACTIVATE_VENDORS, data, {});
    }

    registerVendor(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.REGISTER_VENDORS, data, {});
    }

    createPreVendorDetails(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_PRE_VENDOR_DETAILS, data, {});
    }

    createClientVendorsDetails(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_CLIENT_VENDOR_DETAILS, data, {});
    }

    editPreVendorDetails(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.EDIT_PRE_VENDOR_DETAILS, data, {});
    }

    saveVendorInfo(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_VENDOR_INFO, data, {});
    }
    submitVendorInfo(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.SUBMIT_VENDOR_INFO, data, {});
    }
    getVendorEvaluationById(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_EVALUATION_BY_ID, data, {});
    }

    getVendorsByVM() {
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.FETCH_VENDORS_BY_VM, {});
    }

    getForwardedVendorsByVE() {
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.FETCH_FORWARDED_VENDORS_BY_VE, {});
    }

    approveForwardedVendor(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.APPROVE_FORWARDED_VENDOR, data, {});
    }

    approvePreVendor(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.APPROVE_VENDOR, data, {});
    }

    createVendorByExecutive(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_VENDOR_BY_EXECUTIVE, data, {});
    }

    vendorDownloadExcNotification() {
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.VENDOER_EXC_DOWNLOAD_NOTIFICATION, {});
    }

    enableVendor(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.VENDOR_ENABLE, data, {});
    }

    generateEvaluationForm(){
        this.vendorEvaluationForm = this.fb.group({
            vendoInfoForm : this.fb.group({
               vendor : new FormControl(''),
               vendorName : new FormControl(''),
               address: new FormControl(''),
               location : new FormControl(''),
               email: new FormControl(''),
               phone: new FormControl(''),
               pan : new FormControl(''),
               gst : new FormControl(''),
               annualTurnOver : new FormControl(''),
               goodsType: new FormControl(''),
            }),
            capabilityForm  :this.fb.group({}),
            qualityForm  :this.fb.group({}),
            commercialForm  :this.fb.group({}),
            clientReferenceForm :this.fb.group({})
        })
    }


    sendOtpForGMTVendor(body) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.SEND_OTP_FOR_GMT_VENDOR, body, {});
    }
    verifyOtpForGMTVendor(body) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.VERIFY_OTP_FOR_GMT_VENDOR, body, {});
    }

    upgradeForGMTVendor(body) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.UPGRADE_GMT_VENDOR, body, {});
    }









}
