import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Injectable({
    providedIn: 'root'
})
export class RfqService {

    constructor(private http: HttpClient) { }

    getAllRFQdata(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_RFQS_BY_VENDOR_ID, data, {})
    }

    getLineitemsById(LineitemID) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEMS_BY_RFQ_ID, LineitemID, {})
    }

    getDocumentsByRfqId(rfqId) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_DOCUMENTS_BY_RFQ_ID, rfqId, {})
    }

    acceptRfqByvendor(id) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.ACCEPT_RFQ_BY_VENDOR, id, {})
    }

    rejectRfqByvendor(id) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.REJECT_RFQ_BY_VENDOR, id, {})
    }

    fetchRfqById(id) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQ_BY_ID, id, {})
    }

    getAllCategoryRFQdata() {
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.FETCH_ALL_RFQS_BY_ID, {})
    }
    getAllRFQsForNoPR() {
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQS_FOR_NOPR, {})
    }

    getAllRFQsForNoPRForClientInitiatorGMT(req: any) {

        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQS_FOR_NOPR_FOR_CLIENT_INITIATOR, req, {})

    }

    getAllCategoryRFQByGMTVendors(req: any) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.FETCH_ALL_RFQS_BY_GTM_VENDOR, req, {})
    }

    requestForRFQByGMTVendor(req: any) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.REQUEST_RFQ_BY_GMT_VENDOR, req, {})

    }

    getAllRFQsByGMTCategory() {
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.FETCH_ALL_RFQS_BY_GMT_CATEGORYMANAGER, {})
    }

    getAllRFQsSummaryByCategory() {
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.CAT_MGR_VENDOR_SUMMARY, {})
    } 
    
    getAllClientRFQsByGMTForCMandCM2() {
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.FETCH_ALL_CLIENT_RFQS_BY_GMT_CATEGORYMANAGER, {})
    }


    getVendorsByRFQIdForGMT(req: any) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_BY_RFQ_ID_FOR_GMT, req)
    }

    getItemsByRFQIdForGMT(req: any) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEMS_BY_RFQ_ID, req)
    }

    ignoreRFQByGTMVendor(req: any) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.IGNORE_RFQ_BY_GMT_VENDOR, req)
    }

    riaseQueryRFQByGTMVendor(req: any) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.RAISE_QUERY_FOR_RFQ_BY_GMT_VENDOR, req)
    }

    acceptVendorByCM(req: any) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.ACCEPT_GMT_VENDOR_BY_CM, req)

    }
    rejectVendorByCM(req: any) {

        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.REJECT_GMT_VENDOR_BY_CM, req)
    }

    getAllRFQSByClientInitiatorGMT(body: any) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.FETCH_ALL_RFQ_IDS_BY_GMT_CLIENTINTIATOR, body, {})
    }
    querySupportMailByClientIntiatory(body: any) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.QUERY_SUPPORT_MAIL, body, {})
    }

    getVendorInfoById(data:any){
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_INFO_BY_ID_GMT, data, {})

    }

    getClientInfoById(data:any){
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_INFO_BY_ID_GMT, data, {})

    }
}
