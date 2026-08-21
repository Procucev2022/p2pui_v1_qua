import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AiVendorProcessingService } from '../services/ai-vendor-processing.service';
import { AiVendorAnalysisItem } from '../models/ai-vendor-analysis.model';

@Component({
  selector: 'app-vendor-ai-analysis',
  templateUrl: './vendor-ai-analysis.component.html',
  styleUrls: ['./vendor-ai-analysis.component.scss']
})
export class VendorAiAnalysisComponent implements OnInit {

  vendors: AiVendorAnalysisItem[] = [];
  filteredVendors: AiVendorAnalysisItem[] = [];
  
  searchText = '';
  industryFilter = '';
  categoryFilter = '';
  qualificationFilter = '';
  
  loading = false;

  // Metric summaries
  totalCount = 0;
  qualifiedCount = 0;
  avgAiScore = 0;
  verifiedCredentialsCount = 0;

  availableIndustries: string[] = [];
  availableCategories: string[] = [];

  constructor(
    private aiProcessingService: AiVendorProcessingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.aiProcessingService.getVendors().subscribe({
      next: (data) => {
        this.vendors = data || [];
        this.computeMetrics();
        this.extractFilters();
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private computeMetrics(): void {
    this.totalCount = this.vendors.length;
    this.qualifiedCount = this.vendors.filter(v => v.qualification === 'Qualified').length;
    
    if (this.vendors.length > 0) {
      const sumScore = this.vendors.reduce((acc, v) => acc + v.aiScore, 0);
      this.avgAiScore = Math.round(sumScore / this.vendors.length);
    } else {
      this.avgAiScore = 0;
    }

    this.verifiedCredentialsCount = this.vendors.filter(
      v => v.credentials.gstin.verified && v.credentials.pan.verified
    ).length;
  }

  private extractFilters(): void {
    const industriesSet = new Set<string>();
    const categoriesSet = new Set<string>();

    this.vendors.forEach(v => {
      if (v.industry) industriesSet.add(v.industry);
      if (v.category) categoriesSet.add(v.category);
    });

    this.availableIndustries = Array.from(industriesSet);
    this.availableCategories = Array.from(categoriesSet);
  }

  applyFilters(): void {
    const search = this.searchText.trim().toLowerCase();

    this.filteredVendors = this.vendors.filter(v => {
      const matchesSearch = !search ||
        v.vendorName.toLowerCase().includes(search) ||
        v.vendorCode.toLowerCase().includes(search) ||
        (v.searchTerm && v.searchTerm.toLowerCase().includes(search)) ||
        v.industry.toLowerCase().includes(search) ||
        v.category.toLowerCase().includes(search);

      const matchesIndustry = !this.industryFilter || v.industry === this.industryFilter;
      const matchesCategory = !this.categoryFilter || v.category === this.categoryFilter;
      const matchesQual = !this.qualificationFilter || v.qualification === this.qualificationFilter;

      return matchesSearch && matchesIndustry && matchesCategory && matchesQual;
    });
  }

  viewAiProfile(vendor: AiVendorAnalysisItem): void {
    this.router.navigate(['/categorymgr/buyer-vendors/ai-profile', vendor.vendorCode]);
  }

  goBackToVendorList(): void {
    this.router.navigate(['/categorymgr/buyer-vendors']);
  }

  getScoreColorClass(score: number): string {
    if (score >= 90) return 'score-high';
    if (score >= 75) return 'score-medium';
    return 'score-low';
  }
}
