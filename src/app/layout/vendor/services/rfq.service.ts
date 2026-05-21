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
    fetchGMTSummary( ) {
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.FETCH_GMT_VENDOR_SUMMARY, {})

    }
    //FETCH_GMT_VENDOR_SUMMARY

    getAllRFQsByGMTCategory() {
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.FETCH_ALL_RFQS_BY_GMT_CATEGORYMANAGER, {})
    }

    getAllRFQsSummaryByCategory(startPage,pageSize, searchText, sourceType) {
        if(searchText){
            searchText = encodeURIComponent(searchText);
        }
        if(sourceType){
            sourceType = encodeURIComponent(sourceType);
        }
        if (!searchText) {
            searchText = '';
        }
        if (!sourceType) {
            sourceType = '';
        }
      
        // add params only when they are present
        const params: any = {};
        if (searchText) {
            params.searchText = searchText;
        }
        if (sourceType) {
            params.sourceType = sourceType;
        }

        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.CAT_MGR_VENDOR_SUMMARY + `?page=${startPage}&size=${pageSize}`, { params })
    }

    getVendorSummaryForGlobalSearch(searchType, searchValue) {
        if(searchValue){
            searchValue = encodeURIComponent(searchValue);
        }
        if(searchType){
            searchType = encodeURIComponent(searchType);
        }
       
        // add params only when they are present
        const params: any = {};
        if (searchValue) {
            params.searchValue = searchValue;
        }
        if (searchType) {
            params.searchType = searchType;
        }
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.CAT_MGR_VENDOR_SUMMARY_FOR_GLOBAL_SEARCH, { params })
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

    updateCommentsAsReadByCM(req: any) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_COMMENTS_AS_READ_BY_CM, req)
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

    getVendorInfoById(data: any) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_INFO_BY_ID_GMT, data, {})

    }

      getBuyerInfoByRFQId(data: any) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_BUYER_INFO_BY_RFQ_ID, data, {})

    }


    getClientInfoById(data: any) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_INFO_BY_ID_GMT, data, {})

    }
 
    getClientInfoByRFQId(data: any) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_INFO_BY_RFQ_ID_GMT, data, {})

    }
}
