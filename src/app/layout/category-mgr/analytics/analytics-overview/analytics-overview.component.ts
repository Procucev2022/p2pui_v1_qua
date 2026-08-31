import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics-overview',
  templateUrl: './analytics-overview.component.html',
  styleUrls: ['./analytics-overview.component.scss']
})
export class AnalyticsOverviewComponent implements OnInit {
  isLoading: boolean = true;
  metrics: any = null;
  sources: any[] = [];
  lifecycleStages: any[] = [];
  isModalOpen: boolean = false;
  selectedMetricDetail: any = null;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;
    this.analyticsService.getDashboardData().subscribe({
      next: (res: any) => {
        if (res) {
          this.metrics = res.metrics || {};
          const totalB = this.metrics.totalBuyers?.value || 0;
          const totalS = this.metrics.totalSellers?.value || 0;
          this.sources = (res.sources || []).map((s: any) => {
            const buyersCount = s.buyersCount !== undefined && s.buyersCount !== null
              ? s.buyersCount
              : Math.round((totalB * (s.buyersPercent || 0)) / 100);
            const sellersCount = s.sellersCount !== undefined && s.sellersCount !== null
              ? s.sellersCount
              : Math.round((totalS * (s.sellersPercent || 0)) / 100);
            const totalCount = s.totalCount !== undefined && s.totalCount !== null
              ? s.totalCount
              : (buyersCount + sellersCount);
            return {
              ...s,
              buyersCount,
              sellersCount,
              totalCount
            };
          });
          this.lifecycleStages = res.lifecycleStages || [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
        this.isLoading = false;
      }
    });
  }

  openMetricDetails(metricKey: string): void {
    const detailsMap: { [key: string]: any } = {
      totalBuyers: {
        title: 'Total Buyers',
        icon: 'fa-users',
        colorClass: 'text-primary',
        bgClass: 'bg-primary-soft',
        category: 'Buyer Network',
        value: this.metrics?.totalBuyers?.value ?? '0',
        change: this.metrics?.totalBuyers?.change,
        isFormattedNumber: true,
        whatIs: 'Total cumulative number of registered buyer organizations and client enterprise accounts onboarded onto the Procucev platform.',
        condition: 'All verified buyer accounts created across Direct Web, WhatsApp Bot, Sales Referrals, and Admin Onboarding with completed business registration.'
      },
      totalSellers: {
        title: 'Total Sellers',
        icon: 'fa-building',
        colorClass: 'text-primary',
        bgClass: 'bg-primary-soft',
        category: 'Supplier Network',
        value: this.metrics?.totalSellers?.value ?? '0',
        change: this.metrics?.totalSellers?.change,
        isFormattedNumber: true,
        whatIs: 'Total count of verified vendor, manufacturer, distributor, and supplier accounts registered across all material and service categories.',
        condition: 'Includes all onboarded suppliers currently in Approved, Active, or Document Verification states across platform categories.'
      },
      activeBuyers: {
        title: 'Active Buyers',
        icon: 'fa-check-circle',
        colorClass: 'text-success',
        bgClass: 'bg-success-soft',
        category: 'Buyer Engagement',
        value: this.metrics?.activeBuyers?.value ?? '0',
        subtitle: this.metrics?.activeBuyers?.percentOfTotal || 'Active Engagement',
        isFormattedNumber: true,
        whatIs: 'Registered buyer organizations that are actively utilizing the platform to initiate RFQs, compare quotes, or issue Purchase Orders.',
        condition: 'Any registered buyer account that has floated at least 1 RFQ or purchase requisition, or conducted bidding/negotiation within the past 30 days.'
      },
      inactiveBuyers: {
        title: 'Inactive Buyers',
        icon: 'fa-user-times',
        colorClass: 'text-warning',
        bgClass: 'bg-warning-soft',
        category: 'Churn Prevention',
        value: this.metrics?.inactiveBuyers?.value ?? '0',
        subtitle: this.metrics?.inactiveBuyers?.percentOfTotal || this.metrics?.inactiveBuyers?.change || 'Inactive Rate',
        isFormattedNumber: true,
        whatIs: 'Registered buyer accounts that currently have zero procurement or requisition activity over the recent reporting cycle.',
        condition: 'Registered buyer organizations with 0 RFQs created and no login or quotation evaluation activity in the past 30 consecutive days.'
      },
      totalRfqs: {
        title: 'Total RFQs',
        icon: 'fa-file-text-o',
        colorClass: 'text-primary',
        bgClass: 'bg-primary-soft',
        category: 'Procurement Pipeline',
        value: this.metrics?.totalRfqs?.value ?? '0',
        change: this.metrics?.totalRfqs?.change,
        isFormattedNumber: true,
        whatIs: 'Total cumulative volume of Request for Quotations (RFQs) generated across all buyers and product/service categories.',
        condition: 'All RFQ records generated on the platform across all lifecycle statuses (Draft, Published, Live Bidding, Under Review, Awarded, and Closed).'
      },
      rfqsWithQuotes: {
        title: 'RFQs with Quotes',
        icon: 'fa-check-square-o',
        colorClass: 'text-success',
        bgClass: 'bg-success-soft',
        category: 'Bidding Liquidity',
        value: this.metrics?.rfqsWithQuotes?.value ?? '0',
        subtitle: this.metrics?.rfqsWithQuotes?.tag || 'Competitive RFQs',
        isFormattedNumber: true,
        whatIs: 'RFQs that have successfully received one or more competitive commercial bids or price quotations from registered sellers.',
        condition: 'Published RFQs where seller submission count is &ge; 1 within the designated bidding and quotation window.'
      },
      sellerSubmissions: {
        title: 'Seller Submissions Number',
        icon: 'fa-paper-plane',
        colorClass: 'text-primary',
        bgClass: 'bg-primary-soft',
        category: 'Supplier Activity',
        value: this.metrics?.sellerSubmissions?.value ?? '0',
        change: this.metrics?.sellerSubmissions?.change,
        isFormattedNumber: true,
        whatIs: 'Total count of individual commercial bids and quotation proposals submitted by vendors across all open and closed RFQs.',
        condition: 'Sum of all completed quotation submissions made by invited or public vendors across platform RFQ line items.'
      },
      rfqsWithoutQuotes: {
        title: 'RFQs Without Quotes',
        icon: 'fa-exclamation-triangle',
        colorClass: 'text-danger',
        bgClass: 'bg-danger-soft',
        isAlert: true,
        category: 'Critical Action Needed',
        value: this.metrics?.rfqsWithoutQuotes?.value ?? '0',
        subtitle: this.metrics?.rfqsWithoutQuotes?.tag || 'Needs Immediate Attention',
        isFormattedNumber: true,
        whatIs: 'Published, live RFQs that currently have zero quotation responses from suppliers and risk breaching procurement turnaround SLAs.',
        condition: 'Active published RFQs where seller quote count = 0, requiring category manager review of specifications and vendor invites.'
      },
      sellerSubs: {
        title: 'Seller Subscribe Value',
        icon: 'fa-rupee',
        colorClass: 'text-success',
        bgClass: 'bg-success-soft',
        category: 'Monetization & Revenue',
        value: this.metrics?.sellerSubs?.value ?? '₹0',
        change: this.metrics?.sellerSubs?.change,
        isFormattedNumber: false,
        whatIs: 'Total gross monetary revenue generated from vendor subscription plans, premium tier packages, and annual renewals.',
        condition: 'Sum of all successful subscription fee payments and renewal transactions processed through the payment gateway (in ₹).'
      },
      pendingCredits: {
        title: 'Pending Credits',
        icon: 'fa-credit-card',
        colorClass: 'text-warning',
        bgClass: 'bg-warning-soft',
        category: 'Financial Operations',
        value: this.metrics?.pendingCredits?.value ?? '0',
        subtitle: this.metrics?.pendingCredits?.tag || 'Awaiting Settlement',
        isFormattedNumber: true,
        whatIs: 'Total outstanding credit requests, refund adjustments, or wallet credit balances awaiting verification and approval.',
        condition: 'Credit notes or reimbursement claims submitted by vendors/buyers in Pending Verification status.'
      },
      repeatBuyers: {
        title: 'Repeat Buyers',
        icon: 'fa-repeat',
        colorClass: 'text-info',
        bgClass: 'bg-info-soft',
        category: 'Customer Retention',
        value: this.metrics?.repeatBuyers?.value ?? '0%',
        subtitle: this.metrics?.repeatBuyers?.tag || 'Loyalty Rate',
        isFormattedNumber: false,
        whatIs: 'The proportion and volume of enterprise client buyers who regularly return to place multiple purchase requests.',
        condition: 'Registered buyer accounts having &ge; 2 completed or active RFQs/POs created over their account lifetime.'
      },
      topCategory: {
        title: 'Top Category',
        icon: 'fa-cube',
        colorClass: 'text-primary',
        bgClass: 'bg-primary-soft',
        category: 'Category Performance',
        value: this.metrics?.topCategory?.name || 'N/A',
        subtitle: (this.metrics?.topCategory?.volumePercent || '0%') + ' of Total Volume',
        isFormattedNumber: false,
        whatIs: 'The leading product or service category commanding the largest share of procurement activity, RFQs, and order volume.',
        condition: 'Category tagged with the highest aggregate RFQ count and quotation transaction volume during the reporting period.'
      },
      registrationSource: {
        title: 'Registration Source Breakdown',
        icon: 'fa-sign-in',
        colorClass: 'text-primary',
        bgClass: 'bg-primary-soft',
        category: 'Acquisition Channels',
        value: this.sources?.length ? `${this.sources.length} Channels Tracked` : 'Channel Analytics',
        subtitle: 'Buyer & Seller Onboarding Distribution',
        isFormattedNumber: false,
        whatIs: 'Detailed breakdown of user acquisition channels (WhatsApp Bot, Web Portal, Referrals) for both buyers and suppliers.',
        condition: 'Calculated from registration origin source parameters and onboarding channel tags.'
      },
      lifecycleStatus: {
        title: 'RFQ Lifecycle Pipeline Status',
        icon: 'fa-exchange',
        colorClass: 'text-primary',
        bgClass: 'bg-primary-soft',
        category: 'Pipeline Velocity',
        value: `${this.metrics?.totalRfqs?.value || 0} RFQs in Pipeline`,
        subtitle: `${this.lifecycleStages?.length || 0} Pipeline Stages`,
        isFormattedNumber: false,
        whatIs: 'Full-funnel stage distribution tracking RFQs from Draft creation through Bidding, Evaluation, PO Issuance, and Closure.',
        condition: 'Real-time state transitions recorded in the database across all RFQ lifecycle milestone events.'
      }
    };

    if (detailsMap[metricKey]) {
      this.selectedMetricDetail = detailsMap[metricKey];
      this.isModalOpen = true;
      setTimeout(() => {
        const el = document.getElementById('overview-modal-backdrop');
        if (el && el.parentElement !== document.body) {
          document.body.appendChild(el);
        }
      }, 0);
    }
  }

  closeMetricDetails(): void {
    const el = document.getElementById('overview-modal-backdrop');
    if (el && el.parentElement === document.body) {
      document.body.removeChild(el);
    }
    this.isModalOpen = false;
    this.selectedMetricDetail = null;
  }

  exportData(): void {
    if (!this.metrics) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value\n' +
      `Total Buyers,${this.metrics.totalBuyers?.value || 0}\n` +
      `Total Sellers,${this.metrics.totalSellers?.value || 0}\n` +
      `Active Buyers,${this.metrics.activeBuyers?.value || 0}\n` +
      `Total RFQs,${this.metrics.totalRfqs?.value || 0}\n` +
      `RFQs with Quotes,${this.metrics.rfqsWithQuotes?.value || 0}\n` +
      `Seller Submissions Number,${this.metrics.sellerSubmissions?.value || 0}\n` +
      `RFQs Without Quotes,${this.metrics.rfqsWithoutQuotes?.value || 0}\n` +
      `Seller Subscribe Value,${this.metrics.sellerSubs?.value || 0}\n` +
      `Pending Credits,${this.metrics.pendingCredits?.value || 0}\n` +
      `Repeat Buyers,${this.metrics.repeatBuyers?.value || 0}\n` +
      `Top Category,${this.metrics.topCategory?.name || 'N/A'}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'analytics_overview.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
