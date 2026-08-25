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
          this.sources = res.sources || [];
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
      `Open RFQs,${this.metrics.openRfqs?.value || 0}\n` +
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
