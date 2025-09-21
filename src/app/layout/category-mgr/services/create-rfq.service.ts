import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';

@Injectable({
    providedIn: 'root'
})
export class CreateRfqService {
    loggedUserDetails: any;

    constructor(private httpService: HttpClient, private encryDecryService: EncryDecryService) {
        const temp = JSON.parse(
            this.encryDecryService.get('perm', localStorage.getItem('logData'))
        );
        this.loggedUserDetails = temp.details;
    }

    getAllSubCategoriesForRFQ():Observable<any> {
        return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_SUB_CATEGORY_FOR_RFQ,   {});
    }

    getAllItemsDescriptionsForRFQ():Observable<any>{
        return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_ITEM_MASTER_FOR_RFQ, {})
    }

    getAllVendorByCategory(req:any): Observable<any>{
        return this.httpService.post(AppApiConfig.apiEndpoint+ AppApiConfig.GET_All_VENDORS_BY_CATEGORY, req,{})
    }

    getAllVendorsList(): Observable<any>{
        return this.httpService.get(AppApiConfig.apiEndpoint+ AppApiConfig.GET_ALL_VENDORS, {})
    }

    sendRFQ(req:any): Observable<any>{
        return this.httpService.post(AppApiConfig.apiEndpoint+ AppApiConfig.CREATE_RFQ_FOR_NOPR_WITH_ITEMS, req,{})
    }
    createRFQByClient(req:any): Observable<any>{
        return this.httpService.post(AppApiConfig.apiEndpoint+ AppApiConfig.CREATE_RFQ_FOR_NOPR_WITH_ITEMS_BY_CLIENT, req,{})
    }

    convertToBOQ(req:any): Observable<any>{
        return this.httpService.post(AppApiConfig.apiEndpoint+ AppApiConfig.CONVERT_RFQ_FOR_ITEMS, req,{})
    }


    forwardRFQ(req:any): Observable<any>{
        return this.httpService.post(AppApiConfig.apiEndpoint+ AppApiConfig.FORWARD_RFQ_TO_VENDORS, req,{})
    }

    getQuotationCounter(req:any){
        return this.httpService.post(AppApiConfig.apiEndpoint+ AppApiConfig.GET_QUOTATIONS_COUNT, req,{})
    }

    saveAuthenticateUser(req:any){
        return this.httpService.post(AppApiConfig.apiEndpoint +AppApiConfig.CREATE_AUTHENTICATE_USER, req, {} )

    }

    updateAuthenticationUser(req:any){
        return this.httpService.post(AppApiConfig.apiEndpoint +AppApiConfig.UPDATE_AUTHENTICATE_USER, req, {} )
    }

    getGMTSummary(){
        return this.httpService.get(AppApiConfig.apiEndpoint +AppApiConfig.GET_GMT_SUMMARY,  {} )

    }

    getGMTRegisteredClients(){
        return this.httpService.get(AppApiConfig.apiEndpoint +AppApiConfig.GET_GMT_FOR_REG_CLIENTS,  {} )

    }


        getGMTRegisteredClientsWithUser(){
        return this.httpService.get(AppApiConfig.apiEndpoint +AppApiConfig.GET_CLIENT_WITH_USER_LIST_CM2,  {} )

    }
    //GET_VENDOR_CATALOGUES
    getVendorCatalogues(req:any){
        return this.httpService.post(AppApiConfig.apiEndpoint +AppApiConfig.GET_VENDOR_CATALOGUES,  req, {})
    }

    addVendorCatalogue(req:any){
        return this.httpService.post(AppApiConfig.apiEndpoint +AppApiConfig.ADD_VENDOR_CATALOGUE,  req, {})
    }

    acceptGMTRegisteredClient(rowData:any){
        return this.httpService.post(AppApiConfig.apiEndpoint +AppApiConfig.ACCEPT_GMT_FOR_REG_CLIENTS, rowData, {} )

    }
    ignoreGMTRegisteredClient(rowData:any){
        return this.httpService.post(AppApiConfig.apiEndpoint +AppApiConfig.REJECT_GMT_FOR_REG_CLIENTS, rowData, {} )

    }


    editRFQByClient(rowData:any){
        return this.httpService.post(AppApiConfig.apiEndpoint +AppApiConfig.EDIT_RFQ_BY_CLIENT_GMT, rowData, {} )
    }

    onSaveAndSend(rowData:any){
        return this.httpService.post(AppApiConfig.apiEndpoint +AppApiConfig.ACCEPT_AND_SAVE_RFQ_BY_CM, rowData, {} )
    }

    getGMTDivisions(){
        return this.httpService.get(AppApiConfig.apiEndpoint +AppApiConfig.GET_ALL_DIVISIONS_GMT,  {} )
    }

    getGMTCategories(){
        return this.httpService.get(AppApiConfig.apiEndpoint +AppApiConfig.GET_ALL_CATEGORIES_GMT,  {} )
    }

    getGMTCategoriesByDivision(data:any){
        return this.httpService.post(AppApiConfig.apiEndpoint +AppApiConfig.GET_CATEGORIES_BY_DIVISION_GMT,data,  {} )
    }

    updateSellerData(data: any) {
        // return this.http.post('http://104.154.48.179:8080/authprocucev/rest1/vendor/submitVendorRegistration',data)
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_SELLER_DATA, data, {});
    }

    updateBuyerData(data: any) {
        // return this.http.post('http://104.154.48.179:8080/authprocucev/rest1/vendor/submitVendorRegistration',data)
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_BUYER_DATA, data, {});
    }
    
    //
    getBuyerDataById(data: any) { 
           return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_BUYER_BY_ID, data, {});
    }
    getSubscriptionsList(){
        return this.httpService.get(AppApiConfig.apiEndpoint +AppApiConfig.GET_SUBSCRIPTIONS_LIST,  {} )
    }


    //Update Client Details
    updateClientDetails(data:any){
        return this.httpService.post(AppApiConfig.apiEndpoint +AppApiConfig.UPDATE_CLIENT_DETAILS_GMT,data,  {} )
    }

     //Update User Details
     updateUserDetails(data:any){
        return this.httpService.post(AppApiConfig.apiEndpoint +AppApiConfig.UPDATE_USER_DETAILS_GMT,data,  {} )
    }

    //delete user
    deleteUser(data:any){
        return this.httpService.post(AppApiConfig.apiEndpoint +AppApiConfig.DELETE_USER_FOR_REG_CLIENT,data,  {} )

    }
}
