import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BuyerDashboardService } from '../services/buyer-dashboard.service';
import { VendorEvaluationRecord } from '../models/buyer-dashboard.model';

@Component({
  selector: 'app-buyer-vendor-evaluation',
  templateUrl: './buyer-vendor-evaluation.component.html',
  styleUrls: ['./buyer-vendor-evaluation.component.scss']
})
export class BuyerVendorEvaluationComponent implements OnInit {

  evaluations: VendorEvaluationRecord[] = [];
  selected: VendorEvaluationRecord | null = null;
  loading = true;

  /** Module weights that make up the Mode 3 overall score. */
  pillarWeights = [
    { key: 'commercialScore', name: 'Commercial Terms', weight: 25 },
    { key: 'technicalScore', name: 'Technical Capability', weight: 15 },
    { key: 'qualityScore', name: 'Quality & Warranty', weight: 20 },
    { key: 'esgScore', name: 'Governance & ESG', weight: 10 }
  ];

  constructor(
    private dashboardService: BuyerDashboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.dashboardService.getVendorEvaluations().subscribe({
      next: list => {
        this.evaluations = list || [];
        this.selected = this.evaluations.length > 0 ? this.evaluations[0] : null;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to load vendor evaluations', 'Error');
      }
    });
  }

  select(record: VendorEvaluationRecord): void {
    this.selected = record;
  }

  getPillarScore(record: VendorEvaluationRecord, key: string): number {
    const value = (record as any)[key];
    return typeof value === 'number' ? value : 0;
  }

  /** Vendors are only scored once a Mode 3 questionnaire has been submitted. */
  isScored(record: VendorEvaluationRecord): boolean {
    return !!record && record.overallScore > 0;
  }

  getStatusClass(record: VendorEvaluationRecord): string {
    if (!this.isScored(record)) { return 'status-pending'; }
    if (record.overallScore >= 80) { return 'status-qualified'; }
    if (record.overallScore >= 65) { return 'status-conditional'; }
    return 'status-disqualified';
  }
}
