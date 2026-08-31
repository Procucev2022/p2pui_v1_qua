import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';

@Injectable({
    providedIn: 'root'
})
export class BfsItemsService {
    loggedUserDetails: any;

    constructor(private httpService: HttpClient, private encryDecryService: EncryDecryService) {
        const temp = JSON.parse(
            this.encryDecryService.get(localStorage.getItem('logData'))
        );
        this.loggedUserDetails = temp.details;
    }

    //Create Items
    createItems(requestBody: any): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_CREATE_ITEMS, requestBody, {})
    }

    //BFS_GET_ORG_SEARCH
    getOrgSearch(requestBody: any): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_ORG_SEARCH, requestBody, {})
    }

      //BFS_GET_ORG_SEARCH
    getOrgSearchByEmailPhone(requestBody: any): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_ORG_SEARCH_BY_EMAIL, requestBody, {})
    }


    //BFS_GET_USERS_BY_ORG
    getUsersByOrg(requestBody: any): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_USERS_BY_ORG, requestBody, {})
    }


    //BFS_GET_ALL_BFS_ITEMS
    getAllBFSItems(requestBody: any): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_ALL_BFS_ITEMS, requestBody, {})
    }

    //BFS_GET_REQUESTED_USERS_BY_BFS_FOR_CM
    getRequestedUsersByBFSForCM(requestBody: any): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_REQUESTED_USERS_BY_BFS_FOR_CM, requestBody, {})
    }

    //BFS_GET_REQUESTED_USERS_BY_BFS_FOR_SELLER
    getRequestedUsersByBFSForSeller(requestBody: any): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_REQUESTED_USERS_BY_BFS_FOR_SELLER, requestBody, {})
    }
    //BFS_GET_MY_ITEMS
    getMyItems(): Observable<any> {
        const requestBody = { org: { id: this.loggedUserDetails.org.id }, id: this.loggedUserDetails.id }
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_MY_ITEMS, requestBody, {})
    }

    //get seller item bids

    getSellerBidMyItems(): Observable<any> {
        const requestBody = { org: { id: this.loggedUserDetails.org.id }, id: this.loggedUserDetails.id }
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.SELLER_BID_MY_ITEMS, requestBody, {})
    }


    // BFS_GET_REQUESTED_ITEMS
    getRequestedItemstoCM(): Observable<any> {
        return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_REQUESTED_ITEMS_BY_CM, {})
    }

    // BFS_REQUEST_BFS_ITEM
    requestBFSItem(requestBody: any): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_REQUEST_BFS_ITEM, requestBody, {})
    }

    // BFS_APPROVE_BFS_ITEM_BY_CM
    approveBFSItemByCM(requestBody: any): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_APPROVE_BFS_ITEM_BY_CM, requestBody, {})
    }

    // BFS_REJECTED_BY_SELLER
    bfsRejectedBySeller(requestBody: any): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_REJECTED_BY_SELLER, requestBody, {})
    }
    // BFS_ACPETED_BY_SELLER
    bfsAcceptedBySeller(requestBody: any): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_ACPETED_BY_SELLER, requestBody, {})
    }

    // BFS_GET_ITEMS_BY_BOQ_FILE
    getBFSItemsByBOQFile(requestBody: any): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_ITEMS_BY_BOQ_FILE, requestBody, {})
    }

    // BFS_GET_DOCUMENTS_BY_BFS_ID
    getDocsByBFSId(requestBody: any): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_DOCUMENTS_BY_BFS_ID, requestBody, {})
    }

      // BFS_GET_DOCUMENTS_BY_BFS_ID
    getItemDetails(requestBody: any): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_ITEM_DETAILS, requestBody, {})
    }
    //BFS_GET_BFS_ITEMDETAILS_BY_ID
    getBFSItemDetailsById(requestBody: any): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_BFS_ITEMDETAILS_BY_ID, requestBody, {})
    }
    //BFS_EDIT_BFS_ITEM_DATA
    editBFSItemDetails(requestBody: any): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_EDIT_BFS_ITEM_DATA, requestBody, {})
    }
    getGMTDivisions() {
        return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_DIVISIONS_GMT, {})
    }

    getGMTCategories() {
        return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_CATEGORIES_GMT, {})
    }

    //BFS_GET_REQUESTED_BY_ITEMS_BY_BUYER
    getReqItemsByBuyer(req: any) {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_REQUESTED_BY_ITEMS_BY_BUYER, req, {})
    }

    //BFS_CREATE_COMMENT_BY_BUYER
    createCommentsByBuyer(req: any) {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_CREATE_COMMENT_BY_BUYER, req, {})
    }

    //BFS_GET_COMMENTS_BY_BUYER
    getCommentsByBuyer(req: any) {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_COMMENTS_BY_BUYER, req, {})
    }
    //BFS_GET_COMMENTS_BY_CM
    getCommentsByCM(req: any) {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_COMMENTS_BY_CM, req, {})
    }

    //BFS_GET_BUYERS_BY_BID_ITEMS
    getBuyersByBidItems(req: any) {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_BUYERS_BY_BID_ITEMS, req, {})
    }

    //BFS_EDIT_BUYER_ITEM_BY_SELLER
    editBFSBuyerItemBySeller(req: any) {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_EDIT_BUYER_ITEM_BY_SELLER, req, {});
    }

    //BFS_RE_BID_BY_BUYER_WITH_NEW_QTY
    reBidByBuyerWithNewQtyPrice(req: any) {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_RE_BID_BY_BUYER_WITH_NEW_QTY, req, {});
    }

    //BFS_UNIQUE_ID_BASE_DETAILS ='/rest/bfs/getItemByUniqueId';
    uniqueIdDetails(req: any) {
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_UNIQUE_ID_BASE_DETAILS, req, {});
    }

    //BFS_GET_USER_INFO_DETAILS
    selectedIdDetails(req:any){
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_USER_INFO_DETAILS, req, {});
    }

       //BFS_GET_USER_INFO_DETAILS
    addBFSImage(req:any){
         return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_USER_INFO_DETAILS, req, {});
    }

    //BFS_GET_IMAGES
    getBFSImage(req:any){
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_GET_IMAGES, req, {});
   }

   //BFS_COMMENT_FLAG_DEACTIVE
   deactiveCommentFlag(req:any){
        return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.BFS_COMMENT_FLAG_DEACTIVE, req, {});
    }
}
