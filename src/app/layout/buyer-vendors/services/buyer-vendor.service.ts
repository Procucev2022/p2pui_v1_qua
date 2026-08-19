import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { BuyerVendor, BuyerVendorPageResponse, BuyerVendorSingleResponse } from '../models/buyer-vendor.model';

@Injectable({
  providedIn: 'root'
})
export class BuyerVendorService {

  constructor(private httpService: HttpClient) {}

  getVendors(page: number, size: number, search?: string, status?: string, industry?: string): Observable<BuyerVendorPageResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }
    if (status) {
      params = params.set('status', status);
    }
    if (industry) {
      params = params.set('industry', industry);
    }

    return this.httpService.get<BuyerVendorPageResponse>(
      AppApiConfig.apiEndpoint + AppApiConfig.BUYER_VENDORS, { params }
    );
  }

  getVendorById(id: string): Observable<BuyerVendorSingleResponse> {
    return this.httpService.get<BuyerVendorSingleResponse>(
      AppApiConfig.apiEndpoint + AppApiConfig.BUYER_VENDORS + '/' + id
    );
  }

  createVendor(vendor: BuyerVendor): Observable<BuyerVendorSingleResponse> {
    return this.httpService.post<BuyerVendorSingleResponse>(
      AppApiConfig.apiEndpoint + AppApiConfig.BUYER_VENDORS, vendor
    );
  }

  updateVendor(id: string, vendor: BuyerVendor): Observable<BuyerVendorSingleResponse> {
    return this.httpService.put<BuyerVendorSingleResponse>(
      AppApiConfig.apiEndpoint + AppApiConfig.BUYER_VENDORS + '/' + id, vendor
    );
  }

  updateVendorStatus(id: string, status: string): Observable<any> {
    return this.httpService.patch(
      AppApiConfig.apiEndpoint + AppApiConfig.BUYER_VENDORS + '/' + id + '/status', { status }
    );
  }

  bulkCreateVendors(vendors: BuyerVendor[]): Observable<any> {
    return this.httpService.post<any>(
      AppApiConfig.apiEndpoint + AppApiConfig.BUYER_VENDORS + '/bulk', vendors
    );
  }
}
