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
  selectedRange: string = 'Last 30 Days (Jul 26 - Aug 24)';

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
      `Total Seller Submissions,${this.metrics.sellerSubmissions?.value || 0}\n` +
      `RFQs Without Quotes,${this.metrics.rfqsWithoutQuotes?.value || 0}\n` +
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
