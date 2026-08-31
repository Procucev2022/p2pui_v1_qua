import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import {
  CatalogueProduct,
  VendorEvaluationResult,
  VendorOpportunity,
  VendorProfileSummary,
  VendorSubscriptionPlanDetail
} from '../models/vendor-dashboard.model';

/**
 * Vendor workspace data access. Read calls return empty collections on failure
 * so screens render an explicit empty state rather than fabricated records.
 * Write calls surface errors to the caller.
 */
@Injectable({
  providedIn: 'root'
})
export class VendorDashboardService {

  constructor(private http: HttpClient) {}

  private getVendorQueryParams(): string {
    const orgId = localStorage.getItem('orgId') || '';
    const loggedId = localStorage.getItem('loggedId') || '';
    const params: string[] = [];
    if (orgId) { params.push(`orgId=${encodeURIComponent(orgId)}`); }
    if (loggedId) { params.push(`vendorId=${encodeURIComponent(loggedId)}`); }
    return params.length > 0 ? params.join('&') : '';
  }

  getProfileSummary(): Observable<VendorProfileSummary | null> {
    const q = this.getVendorQueryParams();
    const url = AppApiConfig.apiEndpoint + AppApiConfig.VENDOR_DASHBOARD_SUMMARY + (q ? `?${q}` : '');
    return this.http.get<{ data: { summary: VendorProfileSummary } }>(url).pipe(
      map(res => (res && res.data && res.data.summary) ? res.data.summary : null),
      catchError(() => of(null))
    );
  }

  getOpportunities(): Observable<VendorOpportunity[]> {
    const q = this.getVendorQueryParams();
    const url = AppApiConfig.apiEndpoint + AppApiConfig.VENDOR_DASHBOARD_OPPORTUNITIES + (q ? `?${q}` : '');
    return this.http.get<{ data: { opportunities: VendorOpportunity[] } }>(url).pipe(
      map(res => (res && res.data && res.data.opportunities) ? res.data.opportunities : []),
      catchError(() => of([]))
    );
  }

  getCatalogue(): Observable<CatalogueProduct[]> {
    const q = this.getVendorQueryParams();
    const url = AppApiConfig.apiEndpoint + AppApiConfig.VENDOR_DASHBOARD_CATALOGUE + (q ? `?${q}` : '');
    return this.http.get<{ data: { products: CatalogueProduct[] } }>(url).pipe(
      map(res => (res && res.data && res.data.products) ? res.data.products : []),
      catchError(() => of([]))
    );
  }

  saveCatalogueProduct(product: CatalogueProduct): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.VENDOR_DASHBOARD_CATALOGUE_SAVE, product);
  }

  getSubscriptionPlans(): Observable<VendorSubscriptionPlanDetail[]> {
    const url = AppApiConfig.apiEndpoint + AppApiConfig.VENDOR_DASHBOARD_SUBSCRIPTIONS;
    return this.http.get<{ data: { plans: VendorSubscriptionPlanDetail[] } }>(url).pipe(
      map(res => (res && res.data && res.data.plans) ? res.data.plans : []),
      catchError(() => of([]))
    );
  }

  /** Validates the plan is payable. Actual payment goes through the Zoho link. */
  updateSubscription(planId: string): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.VENDOR_DASHBOARD_SUBSCRIBE, { planId });
  }

  /** Generates a Zoho payment link for the selected plan. */
  generatePaymentLink(payload: { planId: string; userEmail: string; userPhone: string }): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_PAYMENT_FOR_SUBSCRIPTION, payload);
  }

  downloadRfqDocuments(rfqNumber: string): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.VENDOR_DASHBOARD_RFQ_DOWNLOAD, { rfqNumber });
  }

  submitQuotation(payload: any): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.VENDOR_DASHBOARD_QUOTATION, payload);
  }

  submitQualification(payload: any): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.VENDOR_DASHBOARD_QUALIFICATION, payload);
  }
}
