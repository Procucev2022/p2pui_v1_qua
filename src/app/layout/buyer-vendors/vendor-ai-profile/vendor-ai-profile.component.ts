import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AiVendorProcessingService } from '../services/ai-vendor-processing.service';
import { BuyerVendorService } from '../services/buyer-vendor.service';
import {
  AiVendorAnalysisItem,
  VendorDocument,
  VendorRfqHistoryItem,
  VendorPerformanceMetrics,
  VendorAuditLog,
  VendorRiskAssessment
} from '../models/ai-vendor-analysis.model';

export interface LifecycleStage {
  id: string;
  name: string;
  subtitle: string;
  status: 'completed' | 'current' | 'pending';
  icon: string;
}

@Component({
  selector: 'app-vendor-ai-profile',
  templateUrl: './vendor-ai-profile.component.html',
  styleUrls: ['./vendor-ai-profile.component.scss']
})
export class VendorAiProfileComponent implements OnInit {

  vendorCode: string = '';
  vendor: AiVendorAnalysisItem | undefined;
  loading = true;
  activeTab: string = 'overview';

  // Available Tabs List
  tabs = [
    { id: 'overview', label: 'Overview', icon: 'fa-info-circle' },
    { id: 'credentials', label: 'Credentials & KYC', icon: 'fa-shield' },
    // { id: 'documents', label: 'Documents', icon: 'fa-file-text-o' },
    { id: 'qualification', label: 'AI Qualification', icon: 'fa-certificate' },
    { id: 'performance', label: 'Performance', icon: 'fa-line-chart' },
    { id: 'rfq-history', label: 'RFQ History', icon: 'fa-history' },
    { id: 'compliance', label: 'Compliance & Risk', icon: 'fa-gavel' },
    { id: 'audit-trail', label: 'Audit Trail', icon: 'fa-list-alt' }
  ];

  // Lifecycle Stages
  lifecycleStages: LifecycleStage[] = [];

  // Documents
  documents: VendorDocument[] = [];
  selectedDocForUpload: string = '';
  uploadModalOpen: boolean = false;

  // Performance
  performanceMetrics: VendorPerformanceMetrics = {
    rfqsParticipated: 0,
    quotesSubmitted: 0,
    quotesWon: 0,
    ordersReceived: 0,
    ordersCompleted: 0,
    winRate: null,
    quoteResponseRate: null,
    onTimeDelivery: null,
    qualityScore: null,
    avgLeadTimeDays: null,
    hasHistoricalData: false
  };

  // RFQ History
  rfqHistory: VendorRfqHistoryItem[] = [];

  // Risk Assessment
  riskAssessment: VendorRiskAssessment = {
    overallRisk: 'Low',
    complianceRisk: 'Low',
    financialRisk: 'Low',
    performanceRisk: 'Review Required',
    documentRisk: 'Low',
    summaryText: 'Assessment derived from verified credentials and compliance status.'
  };

  // Audit Logs
  auditLogs: VendorAuditLog[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private aiService: AiVendorProcessingService,
    private vendorService: BuyerVendorService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.vendorCode = params.get('code') || '';
      this.loadVendorProfile();
    });

    this.route.queryParamMap.subscribe(queryParams => {
      const tabParam = queryParams.get('tab');
      if (tabParam && this.tabs.some(t => t.id === tabParam)) {
        this.activeTab = tabParam;
      }
    });
  }

  loadVendorProfile(): void {
    this.loading = true;
    this.aiService.getVendorByCode(this.vendorCode).subscribe({
      next: (found) => {
        this.vendor = found;
        if (this.vendor) {
          this.buildLifecycleStages();
          this.buildDocuments();
          this.buildRiskAssessment();
          this.buildAuditTrail();
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  selectTab(tabId: string): void {
    this.activeTab = tabId;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabId },
      queryParamsHandling: 'merge'
    });
  }

  // --- Derived Calculations ---

  get isPreferredVendor(): boolean {
    return (this.vendor?.aiScore || 0) > 80;
  }

  get kycStatus(): 'VERIFIED' | 'PARTIAL' | 'PENDING' {
    if (!this.vendor) { return 'PENDING'; }
    const gstinV = this.vendor.credentials?.gstin?.verified;
    const panV = this.vendor.credentials?.pan?.verified;
    if (gstinV && panV) { return 'VERIFIED'; }
    if (gstinV || panV) { return 'PARTIAL'; }
    return 'PENDING';
  }

  get lifecycleCurrentStatus(): string {
    if (!this.vendor) { return 'Imported'; }
    if (this.vendor.status === 'Active') {
      return 'Active';
    }
    if (this.vendor.qualification === 'Qualified') {
      return 'Qualified';
    }
    if (this.vendor.credentials?.gstin?.verified && this.vendor.credentials?.pan?.verified) {
      return 'Credentials Verified';
    }
    return 'AI Processed';
  }

  private buildLifecycleStages(): void {
    if (!this.vendor) { return; }
    const gstinV = !!this.vendor.credentials?.gstin?.verified;
    const panV = !!this.vendor.credentials?.pan?.verified;
    const isQual = this.vendor.qualification === 'Qualified';
    const isScoreHigh = (this.vendor.aiScore || 0) >= 70;

    this.lifecycleStages = [
      { id: '1', name: 'Imported', subtitle: 'Excel / Manual Master Record', status: 'completed', icon: 'fa-upload' },
      { id: '2', name: 'AI Processed', subtitle: 'Gemini AI Taxonomy & Category', status: 'completed', icon: 'fa-magic' },
      {
        id: '3',
        name: 'Credentials Verified',
        subtitle: gstinV && panV ? 'GSTIN & PAN Validated' : 'Verification In Progress',
        status: gstinV && panV ? 'completed' : (gstinV || panV ? 'current' : 'pending'),
        icon: 'fa-shield'
      },
      {
        id: '4',
        name: 'Qualified',
        subtitle: isQual ? 'Procurement Score Approved' : 'Under Review',
        status: isQual ? 'completed' : (isScoreHigh ? 'current' : 'pending'),
        icon: 'fa-certificate'
      },
      {
        id: '5',
        name: 'Buyer Approved',
        subtitle: 'Enterprise Compliance Checked',
        status: isQual ? 'completed' : 'pending',
        icon: 'fa-check-square-o'
      },
      {
        id: '6',
        name: 'Active',
        subtitle: this.vendor.status === 'Inactive' ? 'Vendor Account Inactive' : 'Ready for RFQ Direct Sourcing',
        status: this.vendor.status === 'Active' ? 'completed' : (isQual ? 'current' : 'pending'),
        icon: 'fa-bolt'
      }
    ];
  }

  private buildDocuments(): void {
    // If no document files have been uploaded yet, keep repository empty
    this.documents = [];
  }

  private buildRiskAssessment(): void {
    if (!this.vendor) { return; }
    const gstinV = !!this.vendor.credentials?.gstin?.verified;
    const panV = !!this.vendor.credentials?.pan?.verified;
    const score = this.vendor.aiScore || 0;
    const isCompliant = this.vendor.complianceStatus === 'Compliant' || this.vendor.complianceStatus === 'Fully Compliant';

    let overall: 'Low' | 'Medium' | 'High' | 'Review Required' = 'Low';
    if (!gstinV || !panV || !isCompliant) {
      overall = 'Review Required';
    } else if (score < 75) {
      overall = 'Medium';
    }

    this.riskAssessment = {
      overallRisk: overall,
      complianceRisk: isCompliant && gstinV ? 'Low' : 'Review Required',
      financialRisk: score >= 80 ? 'Low' : 'Review Required',
      performanceRisk: 'Review Required',
      documentRisk: gstinV && panV ? 'Low' : 'Medium',
      summaryText: overall === 'Low'
        ? 'Supplier demonstrates verified statutory credentials and high AI qualification readiness.'
        : 'Statutory verification or compliance review is recommended before issuing large RFQ contracts.'
    };
  }

  private buildAuditTrail(): void {
    // No mock audit logs; empty state until real backend audit log endpoint is connected
    this.auditLogs = [];
  }

  // --- Document & Action Handlers ---

  openUploadDocModal(docType: string = 'General'): void {
    this.selectedDocForUpload = docType;
    this.uploadModalOpen = true;
  }

  closeUploadDocModal(): void {
    this.uploadModalOpen = false;
  }

  triggerDocVerification(doc: VendorDocument): void {
    if (doc.verificationStatus === 'Verified') {
      this.toastr.info(`Document '${doc.name}' is already verified.`, 'Notice');
      return;
    }
    doc.verificationStatus = 'Verified';
    this.toastr.success(`Document '${doc.name}' verified successfully.`, 'Verification Complete');
  }

  downloadDoc(doc: VendorDocument): void {
    this.toastr.info(`Downloading '${doc.name}'...`, 'Document Download');
  }

  editVendorDetails(): void {
    if (this.vendor) {
      this.router.navigate(['/categorymgr/buyer-vendors', this.vendor.vendorCode, 'edit']);
    }
  }

  goBack(): void {
    this.router.navigate(['/categorymgr/buyer-vendors/ai-analysis']);
  }

  goToDirectory(): void {
    this.router.navigate(['/categorymgr/buyer-vendors']);
  }

  getScoreColorClass(score: number): string {
    if (score >= 85) { return 'score-high'; }
    if (score >= 70) { return 'score-mid'; }
    return 'score-low';
  }
}

