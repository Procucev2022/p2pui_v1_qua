import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AiVendorProcessingService } from '../services/ai-vendor-processing.service';
import { AiVendorAnalysisItem } from '../models/ai-vendor-analysis.model';

@Component({
  selector: 'app-vendor-ai-profile',
  templateUrl: './vendor-ai-profile.component.html',
  styleUrls: ['./vendor-ai-profile.component.scss']
})
export class VendorAiProfileComponent implements OnInit {

  vendorCode: string = '';
  vendor: AiVendorAnalysisItem | undefined;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private aiService: AiVendorProcessingService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.vendorCode = params.get('code') || '';
      this.loadVendorProfile();
    });
  }

  loadVendorProfile(): void {
    this.loading = true;
    this.aiService.getVendorByCode(this.vendorCode).subscribe({
      next: (found) => {
        this.vendor = found;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/categorymgr/buyer-vendors/ai-analysis']);
  }

  goToDirectory(): void {
    this.router.navigate(['/categorymgr/buyer-vendors']);
  }
}
