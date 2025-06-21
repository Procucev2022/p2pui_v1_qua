import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {

  constructor(private httpService: HttpClient) { }


  getAllAuctions() {
    return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_AUCTIONS,  {});
  }
  getAllAuctionsForCapex() {
    return this.httpService.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_AUCTIONS_FOR_CAPEX,  {});
  }

  getAllAuctionsByVendorForCapex(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_AUCTIONS_BY_VENDOR_FOR_CAPEX, data, {});
  }

  getAllAuctionsByVendor(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_AUCTIONS_BY_VENDOR, data, {});
  }

  getAuctionsByClientId(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_AUCTIONS_BY_CLIENT_ID, data, {});
  }

  getAuctionsByClientIdForCapex(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_AUCTIONS_BY_CLIENT_ID_FOR_CAPEX, data, {});
  }

  getBidsByAuctionId(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_BIDS_BY_AUCTION_ID, data, {});
  }

  getAuctionDetails(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_AUCTION_DETAILS, data, {});
  }
  getBidsByAuctionIdAndVendorId(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_BIDS_BY_AUCTION_ID_AND_VENDOR_ID, data, {});
  }

  getAllAuctionsByStatus(data) {
    // return this.httpService.get('/assets/jsons/prqs.json');
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_AUCTIONS_BY_STATUS, data, {});
  }

  getAuctionDocByAuction(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_AUCTION_DOC_BY_AUCTION, data, {});
  }
  getAuctionVendorsByAuction(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig. GET_AUCTION_VENDORS_BY_AUCTION, data, {});
  }

  getBidByVendorPdf(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_BID_BY_VENDOR_PDF, data, {});
  }

  getAuctionAccept(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_ACCEPT_TC, data, {});
  }

  getAuctionById(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_AUCTON_BY_ID, data, {});
  }

  updateAuctionDetails(data) {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_AUCTON_DETAILS, data, {});
  }


  createAuction(data): Observable<any> {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_AUCTION, data, {});
  }
  createAuctionForCapex(data): Observable<any> {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_AUCTION_FOR_CAPEX, data, {});
  }


  getItemsByRFQ(data): Observable<any> {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_LINE_ITEMS_BY_RFQ, data, {});
  }

  getQuoteVendorsByRFQ(data): Observable<any> {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_QUOTE_VENDORS_BY_RFQ, data, {});
  }

  editAuction(data): Observable<any> {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.EDIT_AUCTION, data, {});
  }


  // Auction submission for vendor - rfq wise, items wise
  submitBidByVendorForRFQwiseOrItemwise(data): Observable<any> {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.SUBMIT_BID_BY_VENDOR_FOR_RFQ_OR_ITEM_WISE, data, {});
  }

  cancelledAuctions(data): Observable<any> {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.AUCTIONS_CANCELLED, data, {});
  }

  getBidItemsByAuction(data): Observable<any> {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_BID_ITEMS_BY_AUCTION, data, {});
  }

  getBidItemsByAuctionForVendor(data): Observable<any> {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_BID_ITEMS_BY_AUCTION_FOR_VENDOR, data, {});
  }

  getBidsByAuction(data): Observable<any> {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_BIDS_BY_AUCTION, data, {});
  }

  getBidsByAuctionForVendor(data): Observable<any> {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_BIDS_BY_AUCTION_FOR_VENDOR, data, {});
  }

  getQuoteitemsByRFQ(data): Observable<any> {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PDF_QUOTE_ITEMS, data, {});
  }

  getAuctionChartData(data): Observable<any> {
    return this.httpService.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_AUCTION_PRICE_DATA, data, {});
  }

}
