import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics-funnel',
  templateUrl: './analytics-funnel.component.html',
  styleUrls: ['./analytics-funnel.component.scss']
})
export class AnalyticsFunnelComponent implements OnInit {
  activeTab: 'buyer' | 'seller' = 'buyer';
  stages: any[] = [];
  summary: any = null;
  isLoading: boolean = true;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadFunnel();
  }

  setTab(tab: 'buyer' | 'seller'): void {
    this.activeTab = tab;
    this.loadFunnel();
  }

  loadFunnel(): void {
    this.isLoading = true;
    this.analyticsService.getFunnelData(this.activeTab).subscribe({
      next: (res: any) => {
        if (res) {
          this.stages = res.stages || [];
          this.summary = res.summary || null;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Funnel loading error:', err);
        this.isLoading = false;
      }
    });
  }
}
