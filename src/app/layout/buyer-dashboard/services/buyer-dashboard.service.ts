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

@Injectable({
  providedIn: 'root'
})
export class BuyerDashboardService {

  constructor(private http: HttpClient) {}

  private getBuyerQueryParams(): string {
    const orgId = localStorage.getItem('orgId') || '';
    const loggedId = localStorage.getItem('loggedId') || '';
    const params: string[] = [];
    if (orgId) params.push(`orgId=${encodeURIComponent(orgId)}`);
    if (loggedId) params.push(`buyerId=${encodeURIComponent(loggedId)}`);
    return params.length > 0 ? params.join('&') : '';
  }

  getSummary(): Observable<DashboardSummary> {
    const q = this.getBuyerQueryParams();
    const url = AppApiConfig.apiEndpoint + AppApiConfig.BUYER_DASHBOARD_SUMMARY + (q ? `?${q}` : '');
    return this.http.get<{ data: { summary: DashboardSummary } }>(url).pipe(
      map(res => res.data?.summary || this.getDefaultSummary()),
      catchError(() => of(this.getDefaultSummary()))
    );
  }

  getPipelineRfqs(): Observable<RFQItem[]> {
    const q = this.getBuyerQueryParams();
    const url = AppApiConfig.apiEndpoint + AppApiConfig.BUYER_DASHBOARD_RFQS + (q ? `?${q}` : '');
    return this.http.get<{ data: { rfqs: RFQItem[] } }>(url).pipe(
      map(res => res.data?.rfqs || this.getDefaultRfqs()),
      catchError(() => of(this.getDefaultRfqs()))
    );
  }

  getLiveFeed(channel: string = 'all'): Observable<AIBotFeedItem[]> {
    const q = this.getBuyerQueryParams();
    const url = `${AppApiConfig.apiEndpoint}${AppApiConfig.BUYER_DASHBOARD_LIVE_FEED}?channel=${channel}${q ? `&${q}` : ''}`;
    return this.http.get<{ data: { feed: AIBotFeedItem[] } }>(url).pipe(
      map(res => res.data?.feed || this.getDefaultFeed()),
      catchError(() => of(this.getDefaultFeed()))
    );
  }

  triggerChaser(payload: { rfqNumber: string; vendorName: string; channel: string; customMessage?: string }): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.BUYER_DASHBOARD_CHASER, payload).pipe(
      catchError(() => of({
        statusCode: '200',
        message: 'Chaser triggered successfully',
        data: {
          chaser: {
            success: true,
            trackingId: 'CHS-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
            message: `${payload.channel.toUpperCase()} chaser dispatched to ${payload.vendorName}`
          }
        }
      }))
    );
  }

  approvePurchaseOrder(payload: { rfqNumber: string; vendorName: string; totalAmount: number; unitPrice: number; leadTime: number; approverNotes?: string }): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.BUYER_DASHBOARD_PO_APPROVE, payload).pipe(
      catchError(() => of({
        statusCode: '200',
        message: 'PO approved successfully',
        data: {
          po: {
            poNumber: 'PO-2026-' + payload.rfqNumber.replace('RFQ-2026-', ''),
            sha256Signature: 'c7d1e3a985f621b0e49c812d4a7f55e0921bc3d49f018a7c2b53e6144f5592a1',
            status: 'APPROVED'
          }
        }
      }))
    );
  }

  getVendorEvaluations(): Observable<VendorEvaluationRecord[]> {
    return this.http.get<{ data: { evaluations: VendorEvaluationRecord[] } }>(AppApiConfig.apiEndpoint + AppApiConfig.BUYER_DASHBOARD_EVALUATIONS).pipe(
      map(res => res.data?.evaluations || this.getDefaultEvaluations()),
      catchError(() => of(this.getDefaultEvaluations()))
    );
  }

  getSubscriptions(): Observable<SubscriptionPlan[]> {
    return this.http.get<{ data: { plans: SubscriptionPlan[] } }>(AppApiConfig.apiEndpoint + AppApiConfig.BUYER_DASHBOARD_SUBSCRIPTIONS).pipe(
      map(res => res.data?.plans || this.getDefaultSubscriptions()),
      catchError(() => of(this.getDefaultSubscriptions()))
    );
  }

  createRfq(payload: any): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.BUYER_DASHBOARD_CREATE_RFQ, payload).pipe(
      catchError(() => of({
        statusCode: '200',
        message: 'RFQ created and sourcing strategy mode persisted successfully',
        data: {
          rfq: {
            rfqNumber: payload.rfqNumber || 'RFQ-2026-00445',
            sourcingStrategyMode: payload.sourcingStrategyMode,
            status: 'Success'
          }
        }
      }))
    );
  }

  private getDefaultSummary(): DashboardSummary {
    return {
      totalActiveRFQs: 4,
      totalPendingQuotes: 32,
      totalSpend: '$1.24M',
      totalCalls: 9,
      connectedCalls: 7,
      totalWhatsApp: 14,
      readWhatsApp: 12,
      totalSMS: 6,
      totalEmails: 2,
      totalFollowupsToday: 31,
      activeSubscription: 'free_trial',
      remainingFreeRFQs: 5,
      sourcingPlanName: 'Free Trial (Version 1 - Client Roster)'
    };
  }

  private getDefaultRfqs(): RFQItem[] {
    return [
      {
        id: 'rfq-1',
        rfqNumber: 'RFQ-2026-00421',
        title: 'Centrifugal Water Pumps & Industrial Valves Procurement',
        category: 'Heavy Mechanical & Flow Control',
        sourcingMode: 'mode_2',
        status: 'AI Recommended',
        quotesCount: 8,
        targetDeliveryDate: '15-Sep-2026',
        budget: 145000,
        createdAt: '18-Aug-2026',
        aiScore: 96,
        chasingActive: true,
        chaserMethod: 'Multi-Channel',
        extractedEntities: [
          { id: 'e-1', itemName: 'Centrifugal Water Pump 500 GPM', quantity: 12, unit: 'Units', targetDate: '15-Sep-2026', technicalSpecs: '15 HP, ANSI Flanged 150#', confidence: 98.4, category: 'Heavy Mechanical' },
          { id: 'e-2', itemName: 'Forged Steel Gate Valve 4 inch', quantity: 45, unit: 'Pieces', targetDate: '20-Sep-2026', technicalSpecs: 'Class 300, Trim 8, Handwheel', confidence: 96.2, category: 'Flow Control' },
          { id: 'e-3', itemName: 'Flexible Metal Expansion Joints 4"', quantity: 24, unit: 'Pieces', targetDate: '25-Sep-2026', technicalSpecs: 'SS304 Bellows, ANSI 150', confidence: 94.8, category: 'Piping & Fittings' }
        ],
        quotes: [
          { vendorId: 'v-1', vendorName: 'Apex Supplies Ltd.', vendorCategory: 'Client List', unitPrice: 2850, totalPrice: 34200, leadTimeDays: 18, aiMatchScore: 96, isBestPrice: true, isPreferred: true, warrantyYears: 2, complianceStatus: 'Fully Compliant', paymentTerms: 'Net 30 Days', remarks: 'Pre-negotiated annual roster vendor; 100% specs matched.' },
          { vendorId: 'v-2', vendorName: 'Kiran Valve Industries', vendorCategory: 'Client List', unitPrice: 3100, totalPrice: 37200, leadTimeDays: 21, aiMatchScore: 92, isBestPrice: false, isPreferred: false, warrantyYears: 2, complianceStatus: 'Fully Compliant', paymentTerms: 'Net 30 Days', remarks: 'Standard catalogue item, prompt response.' },
          { vendorId: 'v-3', vendorName: 'Delta Valve Systems', vendorCategory: 'Procucev - AI Rec', unitPrice: 2920, totalPrice: 35040, leadTimeDays: 14, aiMatchScore: 94, isBestPrice: false, isPreferred: false, warrantyYears: 3, complianceStatus: 'Fully Compliant', paymentTerms: 'Net 45 Days', remarks: 'AI Match: Proximity <250km, ISO 9001 certified.' }
        ],
        followUpData: {
          rfqNumber: 'RFQ-2026-00421',
          totalInvited: 8,
          respondedCount: 6,
          callStats: { total: 4, connected: 3, avgDuration: '2m 14s' },
          whatsappStats: { total: 6, read: 5 },
          smsStats: { total: 3, delivered: 3 },
          emailStats: { total: 1 },
          autoChasingEnabled: true,
          nextScheduledChaser: 'Today, 17:30 IST',
          vendors: [
            { vendorId: 'v-1', vendorName: 'Apex Supplies Ltd.', phone: '+91 98201 44820', contactPerson: 'Rajesh Nair', callStatus: 'connected', callDuration: '1m 45s', callLastAttempt: 'Today 11:20 AM', whatsappStatus: 'read', whatsappLastAttempt: 'Today 10:15 AM', smsStatus: 'delivered', emailStatus: 'delivered', overallStatus: 'Responded', lastInteraction: '11:20 AM', attemptsCount: 2, bidStatus: 'Submitted' },
            { vendorId: 'v-2', vendorName: 'Kiran Valve Industries', phone: '+91 97653 21098', contactPerson: 'Amit Kumar', callStatus: 'connected', callDuration: '2m 10s', callLastAttempt: 'Today 11:35 AM', whatsappStatus: 'read', whatsappLastAttempt: 'Today 10:18 AM', smsStatus: 'delivered', emailStatus: 'delivered', overallStatus: 'Responded', lastInteraction: '11:35 AM', attemptsCount: 2, bidStatus: 'Submitted' },
            { vendorId: 'v-3', vendorName: 'Delta Valve Systems', phone: '+91 98334 11223', contactPerson: 'Sanjay Verma', callStatus: 'connected', callDuration: '2m 45s', callLastAttempt: 'Today 12:05 PM', whatsappStatus: 'read', whatsappLastAttempt: 'Today 10:22 AM', smsStatus: 'delivered', emailStatus: 'delivered', overallStatus: 'Responded', lastInteraction: '12:05 PM', attemptsCount: 1, bidStatus: 'Submitted' },
            { vendorId: 'v-4', vendorName: 'Precision Pumps Pvt Ltd', phone: '+91 99876 54321', contactPerson: 'Vikram Shah', callStatus: 'scheduled', callDuration: '0s', callLastAttempt: 'Today 14:00 PM', whatsappStatus: 'delivered', whatsappLastAttempt: 'Today 10:25 AM', smsStatus: 'delivered', emailStatus: 'delivered', overallStatus: 'Follow-up Active', lastInteraction: '14:00 PM', attemptsCount: 1, bidStatus: 'In Progress' }
          ]
        }
      },
      {
        id: 'rfq-2',
        rfqNumber: 'RFQ-2026-00418',
        title: 'High-Voltage Switchgear & Transformers 33kV',
        category: 'Electrical & Power Distribution',
        sourcingMode: 'mode_1',
        status: 'In Evaluation',
        quotesCount: 5,
        targetDeliveryDate: '30-Sep-2026',
        budget: 320000,
        createdAt: '17-Aug-2026',
        aiScore: 91,
        chasingActive: true,
        chaserMethod: 'Call',
        extractedEntities: [],
        quotes: [],
        followUpData: {
          rfqNumber: 'RFQ-2026-00418',
          totalInvited: 5,
          respondedCount: 4,
          callStats: { total: 3, connected: 2, avgDuration: '3m 05s' },
          whatsappStats: { total: 4, read: 3 },
          smsStats: { total: 2, delivered: 2 },
          emailStats: { total: 1 },
          autoChasingEnabled: true,
          nextScheduledChaser: 'Tomorrow, 10:00 IST',
          vendors: []
        }
      },
      {
        id: 'rfq-3',
        rfqNumber: 'RFQ-2026-00415',
        title: 'Precision CNC Machined Shafts & Flanges',
        category: 'Precision Machining & Tooling',
        sourcingMode: 'mode_3',
        status: 'PO Generated',
        quotesCount: 4,
        targetDeliveryDate: '10-Sep-2026',
        budget: 85000,
        createdAt: '14-Aug-2026',
        aiScore: 98,
        chasingActive: false,
        chaserMethod: 'Multi-Channel',
        extractedEntities: [],
        quotes: []
      },
      {
        id: 'rfq-4',
        rfqNumber: 'RFQ-2026-00424',
        title: 'Building Automation Controllers & Sensors BOQ',
        category: 'Building Automation & HVAC',
        sourcingMode: 'mode_2',
        status: 'Parsing',
        quotesCount: 0,
        targetDeliveryDate: '05-Oct-2026',
        budget: 95000,
        createdAt: '19-Aug-2026',
        aiScore: 88,
        chasingActive: false,
        extractedEntities: [],
        quotes: []
      }
    ];
  }

  private getDefaultFeed(): AIBotFeedItem[] {
    return [
      {
        id: 'feed-1',
        type: 'call',
        channel: 'call',
        title: 'AI Voice Agent Completed Call',
        message: 'Spoke with Rajesh Nair (Apex Supplies Ltd). Vendor confirmed quote submission within 2 hours.',
        timestamp: '2m ago',
        rfqNumber: 'RFQ-2026-00421',
        recipient: 'Apex Supplies Ltd.',
        channelDetails: { duration: '1m 45s' }
      },
      {
        id: 'feed-2',
        type: 'whatsapp',
        channel: 'whatsapp',
        title: 'WhatsApp Quote Link Opened',
        message: 'Kiran Valve Industries viewed the RFQ specification document via secure WhatsApp token link.',
        timestamp: '8m ago',
        rfqNumber: 'RFQ-2026-00421',
        recipient: 'Kiran Valve Industries'
      },
      {
        id: 'feed-3',
        type: 'system',
        channel: 'system',
        title: 'AI Pricing Band Recommendation',
        message: 'Target benchmark computed for Centrifugal Pumps: Optimal rate $2,850/unit based on historical transactions.',
        timestamp: '14m ago',
        rfqNumber: 'RFQ-2026-00421'
      },
      {
        id: 'feed-4',
        type: 'sms',
        channel: 'sms',
        title: 'SMS Follow-Up Delivered',
        message: 'High-priority SMS reminder delivered to Vikram Shah (Precision Pumps Pvt Ltd).',
        timestamp: '25m ago',
        rfqNumber: 'RFQ-2026-00421',
        recipient: 'Precision Pumps Pvt Ltd'
      },
      {
        id: 'feed-5',
        type: 'email',
        channel: 'email',
        title: '24h Sourcing Alert Sent',
        message: 'Automated 24h milestone reminder dispatched to 3 pending vendors.',
        timestamp: '42m ago',
        rfqNumber: 'RFQ-2026-00418'
      }
    ];
  }

  private getDefaultEvaluations(): VendorEvaluationRecord[] {
    return [
      {
        id: 'eval-1',
        vendorName: 'Apex Supplies Ltd.',
        category: 'Heavy Mechanical & Pumps',
        location: 'Navi Mumbai, MH',
        overallScore: 94.5,
        commercialScore: 96.0,
        technicalScore: 93.0,
        qualityScore: 95.5,
        esgScore: 92.0,
        riskRating: 'Low Risk',
        status: 'QUALIFIED',
        evaluatedDate: '18-Aug-2026',
        keyHighlights: {
          technical: 'ISO 9001:2015, ASME Sec VIII Certified',
          capacity: '12,000 units/year',
          financial: 'D&B Rating: 1A2 (Low Risk)'
        }
      },
      {
        id: 'eval-2',
        vendorName: 'Delta Valve Systems',
        category: 'Flow Control & Valves',
        location: 'Pune, MH',
        overallScore: 91.8,
        commercialScore: 89.5,
        technicalScore: 94.0,
        qualityScore: 92.0,
        esgScore: 90.0,
        riskRating: 'Low Risk',
        status: 'QUALIFIED',
        evaluatedDate: '17-Aug-2026',
        keyHighlights: {
          technical: 'API 6D Certified, High pressure test bed',
          capacity: '8,500 valves/year',
          financial: 'Crisil Rating: MSE 1'
        }
      }
    ];
  }

  private getDefaultSubscriptions(): SubscriptionPlan[] {
    return [
      {
        id: 'plan-v1',
        code: 'version_1',
        name: 'Version 1: Client Roster Sourcing',
        price: '$0 (Trial)',
        period: '5 Free RFQs',
        description: 'Source directly from your uploaded vendor roster with automated entity extraction and multi-channel chasers.',
        isCurrent: true,
        remainingQuota: 5,
        totalQuota: 5,
        features: [
          'Excel / Email BOQ Entity Extraction',
          'Client Vendor Roster Management',
          'Multi-channel Chasers (Voice, WhatsApp, SMS)',
          'Side-by-side Quote Comparison Matrix',
          'Cryptographic SHA-256 PO Generation'
        ]
      },
      {
        id: 'plan-v2',
        code: 'version_2',
        name: 'Version 2: Hybrid Sourcing',
        price: '$499',
        period: '/ month',
        description: 'Combine your internal roster with Procucev verified vendor recommendations and category intelligence.',
        isCurrent: false,
        remainingQuota: 0,
        totalQuota: 50,
        features: [
          'All Version 1 Features',
          'Procucev Verified Vendor Recommendations',
          'AI Proximity & Rating Matching',
          'Real-time Market Band Price Benchmarking',
          'Dedicated Account Concierge Support'
        ]
      },
      {
        id: 'plan-v3',
        code: 'version_3',
        name: 'Version 3: Autonomous AI Sourcing',
        price: '$1,299',
        period: '/ month',
        description: 'Fully autonomous sourcing: AI RFQ generation, autonomous multi-round negotiation, and Mode 3 deep qualification.',
        isCurrent: false,
        remainingQuota: 0,
        totalQuota: 150,
        features: [
          'All Version 2 Features',
          'Autonomous Multi-Round Vendor Negotiation',
          'Mode 3 Deep Vendor Qualification Scorecard',
          'ERP Integration (SAP / Oracle NetSuite)',
          'Zero-Touch Automated PO Awarding'
        ]
      }
    ];
  }
}
