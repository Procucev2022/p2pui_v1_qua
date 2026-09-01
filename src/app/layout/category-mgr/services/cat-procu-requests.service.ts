import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig, AppConfig } from 'src/app/app.config';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { Observable } from 'rxjs';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EncryDecryService } from 'src/app/shared/services';
@Injectable({
    providedIn: 'root'
})
export class CatProcuRequestsService {
    loggedUserDetails: any;
    cpaexVendorsByPrId: any = [];


    constructor(private httpService: HttpClient, private encryDecryService: EncryDecryService) {
        const temp = JSON.parse(
            this.encryDecryService.get(localStorage.getItem('logData'))
        );
        this.loggedUserDetails = temp.details;
    }

    getPrLists(req) {
        // return this.httpService.get('/assets/jsons/prqs.json');
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_PRS_BY_ORGID_AND_STATUS, req, {});
    }

    getPRIdsList() {
        return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_IDS, {});
    }

    //
    geVendorListByPRIdCapex(req: any) {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_BY_CAPEX_PR_ID, req, {});
    }
    getCapexPRidsList() {
        return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_CAPEx_IDS, {});
    }

    getPRIdsListForRFQwise() {
        return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_IDS_FOR_RFQ_WISE, {});
    }

    getRfqsList(): any {
        return this.httpService.get('/assets/jsons/rfqs.json');

    }


    getRfqsByPr(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQS_BY_PR, req, {});
    }

    getLineItemsByPr(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_LINE_ITEMS_BY_PR, req, {});
    }


    downloadCapexQuoteComparison(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.DOWNLOAD_EXCEL_QUOT_COMPARE_CAPEX, req, {});
    }




    getQuotationsByRfq(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_QUOTATIONS_BY_RFQ, req, {});
    }


    getLineItemsByRfq(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_LINE_ITEMS_BY_RFQ, req, {});
    }

    getVendorsByRfq(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_BY_RFQ, req, {});
    }
    getVendorClosingDate(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_CLOSING_DATE, req, {});
    }

    getVendorsByCategory(req) {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDORS_BY_CATEGORY, req, {});
    }

    createRfq(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_RFQ_FOR_CATEGORY_MANAGER, req, {});
    }

    getPrAttachments(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_PRODUCT_ITEM_ATTACHMENTS, req, {});
    }



    getPrAdresses(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_PRODUCT_ITEM_ADRESSES, req, {});
    }




    sentRfqToVendors(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.SEND_RFQ_TO_VENDORS, req, {});
    }

    prAccept(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.PR_ACCEPT_CAT, req, {});
    }

    // rest/client/getAllClients

    getClients(): Observable<any> {
        return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_CLIENTS, {});
    }
    getClientsForVendorSummaryCM(): Observable<any> {
        return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_CLIENTS_PROCPX_VENDOR_SUMMARY, {});
    }


    getClientVerticals(): Observable<any> {
        return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_VERTICALS, {});
    }


    createClientRegistration(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_CLIENT_REGISTRATION, req, {});
    }

    getClientDetails(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_DETAILS_BY_ID, req, {});
    }

    updateClient(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_CLIENT_REGISTRATION, req, {});
    }


    getQuotationDetails(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_QUOTATION_DETAILS, req, {});
    }
    getCompareQuoteByPR(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_COMPARE_QUOTS_BY_PR_ID, req, {});
    }
    getCompareQuoteByRFQ(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_COMPARE_QUOTS_BY_RFQ_ID, req, {});
    }

    getCompareQuoteByRFQView(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_COMPARE_QUOTS_BY_RFQ_ID_VIEW, req, {});
    }
    createPPO(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.PPO_CREATE, req, {});
    }
    getRFQByPRId(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_RFQ_ID_BY_PR_ID, req, {});
    }
    clientuserCreation(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_USERS, req, {});
    }
    submitvendorRank(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.SUBMIT_VENDOR_RANK, req, {});
    }
    clientRoles(): Observable<any> {
        return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_ROLES, {});
    }
    getclientdepartmentByclient(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_DEPARTMENT_BY_CLIENT, req, {});
    }
    getClientUserByClient(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_USER_BY_CLIENT, req, {});
    }

    getCompareQuoteExcelByPR(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_COMPARE_QUOTE_EXCEL_BY_PR, req, {});
    }

    getCompareQuoteExcelByRfq(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_COMPARE_QUOTE_EXCEL_BY_RFQ, req, {});
    }
    getAllItemCatalogues() {
        return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_CAT_MGR_ITEM_CATALOGUE, {});
    }

    closeItemReq(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.CLOSE_ITEM_REQUEST, req, {});
    }

    linkNowReq(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.LINK_PR_ITEM, req, {});
    }

    getPrByOrgAndCreatedTS(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_BY_ORG_AND_CREATEDTS, req, {});
    }

    getPrByCMAndCreatedTS(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_BY_CM_AND_CREATEDTS, req, {});
    }

    getUserNamesByOrg(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_USERNAMES_BY_ORG, req, {});
    }

    getDepartmentsByOrg(req): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_DEPARTMENTS_BY_ORG, req, {});
    }


    getVendorsByPRIdForCapex(selectedPr: any) {
        this.geVendorListByPRIdCapex({ id: selectedPr.id }).subscribe((res: any) => {
            if (Array.isArray(res)) {
                this.cpaexVendorsByPrId = res;
            } else {
                this.cpaexVendorsByPrId = [];
            }
        })
    }

    getVendorsListByCapex() {
        return this.cpaexVendorsByPrId;
    }

    getQuoteCompExcelJSON() {
        return this.httpService.get('/assets/jsons/excel-quote-comparison.json');
    }


}
