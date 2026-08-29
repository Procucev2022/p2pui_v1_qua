import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import {
  DashboardSummary,
  RFQItem,
  AIBotFeedItem,
  VendorEvaluationRecord,
  SubscriptionPlan
} from '../models/buyer-dashboard.model';

/**
 * Buyer dashboard data access. Read calls return empty results on failure so
 * screens show an explicit empty state instead of fabricated records.
 * Write calls surface errors to the caller.
 */
@Injectable({
  providedIn: 'root'
})
export class BuyerDashboardService {

  constructor(private http: HttpClient) {}

  private getBuyerQueryParams(): string {
    const orgId = localStorage.getItem('orgId') || '';
    const loggedId = localStorage.getItem('loggedId') || '';
    const params: string[] = [];
    if (orgId) { params.push(`orgId=${encodeURIComponent(orgId)}`); }
    if (loggedId) { params.push(`buyerId=${encodeURIComponent(loggedId)}`); }
    return params.length > 0 ? params.join('&') : '';
  }

  getSummary(): Observable<DashboardSummary | null> {
    const q = this.getBuyerQueryParams();
    const url = AppApiConfig.apiEndpoint + AppApiConfig.BUYER_DASHBOARD_SUMMARY + (q ? `?${q}` : '');
    return this.http.get<{ data: { summary: DashboardSummary } }>(url).pipe(
      map(res => (res && res.data && res.data.summary) ? res.data.summary : null),
      catchError(() => of(null))
    );
  }

  getPipelineRfqs(): Observable<RFQItem[]> {
    const q = this.getBuyerQueryParams();
    const url = AppApiConfig.apiEndpoint + AppApiConfig.BUYER_DASHBOARD_RFQS + (q ? `?${q}` : '');
    return this.http.get<{ data: { rfqs: RFQItem[] } }>(url).pipe(
      map(res => (res && res.data && res.data.rfqs) ? res.data.rfqs : []),
      catchError(() => of([]))
    );
  }

  getLiveFeed(channel: string = 'all'): Observable<AIBotFeedItem[]> {
    const q = this.getBuyerQueryParams();
    const url = `${AppApiConfig.apiEndpoint}${AppApiConfig.BUYER_DASHBOARD_LIVE_FEED}?channel=${channel}${q ? `&${q}` : ''}`;
    return this.http.get<{ data: { feed: AIBotFeedItem[] } }>(url).pipe(
      map(res => (res && res.data && res.data.feed) ? res.data.feed : []),
      catchError(() => of([]))
    );
  }

  triggerChaser(payload: { rfqNumber: string; vendorName: string; channel: string; customMessage?: string }): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.BUYER_DASHBOARD_CHASER, payload);
  }

  approvePurchaseOrder(payload: { rfqNumber: string; vendorName: string; totalAmount: number; unitPrice: number; leadTime: number; approverNotes?: string }): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.BUYER_DASHBOARD_PO_APPROVE, payload);
  }

  getVendorEvaluations(): Observable<VendorEvaluationRecord[]> {
    return this.http.get<{ data: { evaluations: VendorEvaluationRecord[] } }>(
      AppApiConfig.apiEndpoint + AppApiConfig.BUYER_DASHBOARD_EVALUATIONS
    ).pipe(
      map(res => (res && res.data && res.data.evaluations) ? res.data.evaluations : []),
      catchError(() => of([]))
    );
  }

  getSubscriptions(): Observable<SubscriptionPlan[]> {
    return this.http.get<{ data: { plans: SubscriptionPlan[] } }>(
      AppApiConfig.apiEndpoint + AppApiConfig.BUYER_DASHBOARD_SUBSCRIPTIONS
    ).pipe(
      map(res => (res && res.data && res.data.plans) ? res.data.plans : []),
      catchError(() => of([]))
    );
  }

  /** Generates a Zoho payment link for the selected plan. */
  generatePaymentLink(payload: { planId: string; userEmail: string; userPhone: string }): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_PAYMENT_FOR_SUBSCRIPTION, payload);
  }

  createRfq(payload: any): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.BUYER_DASHBOARD_CREATE_RFQ, payload);
  }
}
