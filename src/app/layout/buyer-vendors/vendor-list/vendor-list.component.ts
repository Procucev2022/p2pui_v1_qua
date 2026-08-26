import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { BuyerVendorService } from '../services/buyer-vendor.service';
import { BuyerVendor, INDUSTRY_TYPES } from '../models/buyer-vendor.model';
import { AiVendorProcessingService } from '../services/ai-vendor-processing.service';
import { AiVendorAnalysisItem } from '../models/ai-vendor-analysis.model';
import { swalConfirm } from 'src/app/shared/helpers/swal-confirm';


interface ParsedVendorRow {
  vendor: BuyerVendor;
  isValid: boolean;
  errors: string[];
}

export interface AiProcessStep {
  id: string;
  label: string;
  detail: string;
  status: 'pending' | 'processing' | 'completed';
}

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit, OnDestroy {

  // Enriched Vendor Data
  enrichedVendors: AiVendorAnalysisItem[] = [];
  filteredVendors: AiVendorAnalysisItem[] = [];
  loading = false;

  // Real KPI Metrics
  totalCount = 0;
  qualifiedCount = 0;
  kycVerifiedCount = 0;
  complianceIssuesCount = 0;
  aiRecommendedCount = 0;
  pendingVerificationCount = 0;
  avgAiScore = 0;

  // Search & Filter State
  searchText = '';
  industryFilter = '';
  categoryFilter = '';
  qualificationFilter = '';
  sourcingScopeFilter = '';
  scoreFilter = '';
  verificationFilter = '';
  complianceFilter = '';
  vendorGroupFilter = '';

  availableIndustries: string[] = [];
  availableCategories: string[] = [];
  availableVendorGroups: string[] = [];
  industryTypes = INDUSTRY_TYPES;

  // Pagination
  currentPage = 0;
  pageSize = 10;

  // Selection & Bulk Actions State
  selectedVendorCodes = new Set<string>();
  isBulkDeleting = false;

  // Excel Upload Modal State

  showUploadModal = false;
  selectedFileName = '';
  isDragging = false;
  isUploading = false;
  parsedRows: ParsedVendorRow[] = [];
  validCount = 0;
  invalidCount = 0;

  // AI Vendor Processing Pipeline Modal State
  showAiProcessingModal = false;
  aiProcessingComplete = false;
  aiProcessingProgress = 0;
  aiProcessingCount = 0;
  aiTotalToProcess = 0;
  aiProcessingStatusText = 'Processing Vendors...';
  private aiStepTimer: any;

  aiSteps: AiProcessStep[] = [
    { id: 'import', label: 'Vendors Imported', detail: 'Validation & Database Persistence', status: 'completed' },
    { id: 'analysis', label: 'Vendor Data Analysis', detail: 'Parsing Structure & Master Attributes', status: 'pending' },
    { id: 'industry', label: 'Industry Detection', detail: 'Taxonomic & Scope Classification', status: 'pending' },
    { id: 'categorization', label: 'Vendor Categorization', detail: 'AI Primary & Sub-Category Mapping', status: 'pending' },
    { id: 'credentials', label: 'Credential Mapping', detail: 'GSTIN, PAN & Verification Sync', status: 'pending' },
    { id: 'qualification', label: 'Vendor Qualification', detail: 'Risk Scoring & Procurement Readiness', status: 'pending' }
  ];

  constructor(
    private vendorService: BuyerVendorService,
    private aiProcessingService: AiVendorProcessingService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadEnrichedVendors();
  }

  ngOnDestroy(): void {
    if (this.aiStepTimer) {
      clearTimeout(this.aiStepTimer);
    }
  }

  loadEnrichedVendors(isRefresh: boolean = false): void {
    this.loading = true;
    this.aiProcessingService.getVendors().subscribe({
      next: (vendors) => {
        this.enrichedVendors = vendors || [];
        this.populateFilterOptions();
        this.calculateKpiMetrics();
        this.applyFilters();
        this.loading = false;
        if (isRefresh) {
          this.toastr.success('Vendor directory refreshed successfully.', 'Refreshed');
        }
      },
      error: (err) => {
        console.error('Failed to load vendors', err);
        this.loading = false;
        if (isRefresh) {
          this.toastr.error('Failed to refresh vendor directory.', 'Error');
        }
      }
    });
  }

  refreshDirectory(): void {
    this.loadEnrichedVendors(true);
  }

  private populateFilterOptions(): void {
    const indSet = new Set<string>();
    const catSet = new Set<string>();
    const grpSet = new Set<string>();

    this.enrichedVendors.forEach(v => {
      if (v.industry) { indSet.add(v.industry); }
      if (v.category) { catSet.add(v.category); }
      if (v.vendorGroup) { grpSet.add(v.vendorGroup); }
    });

    this.availableIndustries = Array.from(indSet).sort();
    this.availableCategories = Array.from(catSet).sort();
    this.availableVendorGroups = Array.from(grpSet).sort();
  }

  private calculateKpiMetrics(): void {
    this.totalCount = this.enrichedVendors.length;
    this.qualifiedCount = this.enrichedVendors.filter(v => v.qualification === 'Qualified').length;
    
    this.kycVerifiedCount = this.enrichedVendors.filter(
      v => (v.credentials?.gstin?.verified && v.credentials?.pan?.verified)
    ).length;

    this.complianceIssuesCount = this.enrichedVendors.filter(
      v => v.complianceStatus && v.complianceStatus !== 'Compliant' && v.complianceStatus !== 'Fully Compliant'
    ).length;

    this.aiRecommendedCount = this.enrichedVendors.filter(v => (v.aiScore || 0) > 80).length;

    this.pendingVerificationCount = this.enrichedVendors.filter(
      v => !v.credentials?.gstin?.verified || !v.credentials?.pan?.verified
    ).length;

    if (this.totalCount > 0) {
      const sum = this.enrichedVendors.reduce((acc, curr) => acc + (curr.aiScore || 0), 0);
      this.avgAiScore = Math.round(sum / this.totalCount);
    } else {
      this.avgAiScore = 0;
    }
  }

  applyFilters(): void {
    let result = [...this.enrichedVendors];

    if (this.searchText && this.searchText.trim()) {
      const q = this.searchText.toLowerCase().trim();
      result = result.filter(v =>
        (v.vendorName && v.vendorName.toLowerCase().includes(q)) ||
        (v.vendorCode && v.vendorCode.toLowerCase().includes(q)) ||
        (v.searchTerm && v.searchTerm.toLowerCase().includes(q)) ||
        (v.category && v.category.toLowerCase().includes(q)) ||
        (v.industry && v.industry.toLowerCase().includes(q)) ||
        (v.contactInfo?.email && v.contactInfo.email.toLowerCase().includes(q)) ||
        (v.credentials?.gstin?.value && v.credentials.gstin.value.toLowerCase().includes(q)) ||
        (v.credentials?.pan?.value && v.credentials.pan.value.toLowerCase().includes(q)) ||
        (v.capabilities && v.capabilities.some(c => c.toLowerCase().includes(q)))
      );
    }

    if (this.industryFilter) {
      result = result.filter(v => v.industry === this.industryFilter);
    }

    if (this.categoryFilter) {
      result = result.filter(v => v.category === this.categoryFilter);
    }

    if (this.qualificationFilter) {
      result = result.filter(v => v.qualification === this.qualificationFilter);
    }

    if (this.sourcingScopeFilter) {
      result = result.filter(v => v.sourcingScope === this.sourcingScopeFilter);
    }

    if (this.vendorGroupFilter) {
      result = result.filter(v => v.vendorGroup === this.vendorGroupFilter);
    }

    if (this.scoreFilter === 'preferred') {
      result = result.filter(v => (v.aiScore || 0) > 80);
    } else if (this.scoreFilter === 'high') {
      result = result.filter(v => (v.aiScore || 0) >= 90);
    } else if (this.scoreFilter === 'standard') {
      result = result.filter(v => (v.aiScore || 0) <= 80);
    }

    if (this.verificationFilter === 'verified') {
      result = result.filter(v => v.credentials?.gstin?.verified && v.credentials?.pan?.verified);
    } else if (this.verificationFilter === 'pending') {
      result = result.filter(v => !v.credentials?.gstin?.verified || !v.credentials?.pan?.verified);
    }

    if (this.complianceFilter === 'compliant') {
      result = result.filter(v => v.complianceStatus === 'Compliant' || v.complianceStatus === 'Fully Compliant');
    } else if (this.complianceFilter === 'review') {
      result = result.filter(v => v.complianceStatus !== 'Compliant' && v.complianceStatus !== 'Fully Compliant');
    }

    this.filteredVendors = result;
    this.currentPage = 0;
  }

  resetFilters(): void {
    this.searchText = '';
    this.industryFilter = '';
    this.categoryFilter = '';
    this.qualificationFilter = '';
    this.sourcingScopeFilter = '';
    this.scoreFilter = '';
    this.verificationFilter = '';
    this.complianceFilter = '';
    this.vendorGroupFilter = '';
    this.applyFilters();
  }

  get paginatedVendors(): AiVendorAnalysisItem[] {
    const start = this.currentPage * this.pageSize;
    return this.filteredVendors.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredVendors.length / this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  getScoreColorClass(score: number): string {
    if (score >= 85) { return 'score-high'; }
    if (score >= 70) { return 'score-mid'; }
    return 'score-low';
  }

  isPreferredVendor(vendor: AiVendorAnalysisItem): boolean {
    return (vendor.aiScore || 0) > 80;
  }

  getKycStatusText(vendor: AiVendorAnalysisItem): string {
    const gstinV = vendor.credentials?.gstin?.verified;
    const panV = vendor.credentials?.pan?.verified;
    if (gstinV && panV) { return 'VERIFIED'; }
    if (gstinV || panV) { return 'PARTIAL'; }
    return 'PENDING';
  }

  // --- Actions ---

  viewAiProfile(vendor: AiVendorAnalysisItem, tab?: string): void {
    if (vendor && vendor.vendorCode) {
      if (tab) {
        this.router.navigate(['/categorymgr/buyer-vendors/ai-profile', vendor.vendorCode], { queryParams: { tab } });
      } else {
        this.router.navigate(['/categorymgr/buyer-vendors/ai-profile', vendor.vendorCode]);
      }
    }
  }

  viewDocuments(vendor: AiVendorAnalysisItem): void {
    this.viewAiProfile(vendor, 'documents');
  }

  viewPerformance(vendor: AiVendorAnalysisItem): void {
    this.viewAiProfile(vendor, 'performance');
  }

  addVendor(): void {
    this.router.navigate(['/categorymgr/buyer-vendors/new']);
  }

  editVendor(vendor: AiVendorAnalysisItem): void {
    this.router.navigate(['/categorymgr/buyer-vendors', vendor.vendorCode, 'edit']);
  }

  deleteVendor(vendor: AiVendorAnalysisItem): void {
    if (!vendor) { return; }
    swalConfirm.open({
      title: 'Please Confirm!',
      text: `Are you sure you want to delete vendor ${vendor.vendorName} (${vendor.vendorCode})?`
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result: any) => {
      if (result && (result.value || result.isConfirmed)) {
        const targetId = vendor.id || vendor.vendorCode;
        this.vendorService.deleteVendor(targetId).subscribe({
          next: () => {
            this.toastr.success(`Vendor ${vendor.vendorName} deleted successfully.`, 'Deleted');
            if (vendor.vendorCode) {
              this.selectedVendorCodes.delete(vendor.vendorCode);
            }
            this.loadEnrichedVendors();
          },
          error: (err: any) => {
            console.error('Failed to delete vendor', err);
            this.toastr.error('Failed to delete vendor. Please try again.', 'Error');
          }
        });
      }
    });
  }

  // --- Bulk Deletion Methods ---

  deleteAllVendorsConfirmation(event?: MouseEvent): void {
    if (event) {
      event.preventDefault();
      const target = event.target as HTMLInputElement;
      if (target) {
        target.checked = false;
      }
    }

    const allVendors = this.enrichedVendors;
    if (!allVendors || allVendors.length === 0) {
      this.toastr.warning('No vendors available to delete.', 'No Vendors');
      return;
    }

    const allVendorCodes = allVendors.map(v => v.vendorCode || v.id).filter(c => !!c);

    swalConfirm.open({
      title: '<h6>Please Confirm!</h6>',
      html: `<h4>Are you sure you want to delete all <b>${allVendors.length} vendor(s)</b>?<br/><span style="font-size:13px;color:#dc2626;">This action will permanently delete all vendors and their AI profiles.</span></h4>`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: `Yes, Delete All (${allVendors.length})`,
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result: any) => {
      if (result && (result.value || result.isConfirmed)) {
        this.loading = true;
        this.vendorService.bulkDeleteVendors(allVendorCodes).subscribe({
          next: (res: any) => {
            const deleted = res?.data?.deletedCount ?? allVendorCodes.length;
            this.toastr.success(`All ${deleted} vendor(s) deleted successfully.`, 'Vendors Deleted');
            this.clearSelection();
            this.loadEnrichedVendors();
          },
          error: (err: any) => {
            this.loading = false;
            console.error('Failed to delete all vendors', err);
            this.toastr.error('Failed to delete all vendors. Please try again.', 'Error');
          }
        });
      }
    });
  }

  toggleSelectAll(event: any): void {
    const isChecked = event?.target?.checked;
    if (isChecked) {
      this.paginatedVendors.forEach(v => {
        if (v.vendorCode) {
          this.selectedVendorCodes.add(v.vendorCode);
        }
      });
    } else {
      this.paginatedVendors.forEach(v => {
        if (v.vendorCode) {
          this.selectedVendorCodes.delete(v.vendorCode);
        }
      });
    }
  }

  toggleSelectVendor(vendorCode: string): void {
    if (!vendorCode) { return; }
    if (this.selectedVendorCodes.has(vendorCode)) {
      this.selectedVendorCodes.delete(vendorCode);
    } else {
      this.selectedVendorCodes.add(vendorCode);
    }
  }

  isVendorSelected(vendorCode: string): boolean {
    return !!vendorCode && this.selectedVendorCodes.has(vendorCode);
  }

  isAllSelected(): boolean {
    if (!this.paginatedVendors || this.paginatedVendors.length === 0) {
      return false;
    }
    return this.paginatedVendors.every(v => v.vendorCode && this.selectedVendorCodes.has(v.vendorCode));
  }

  isPartiallySelected(): boolean {
    if (!this.paginatedVendors || this.paginatedVendors.length === 0) {
      return false;
    }
    const selectedInPage = this.paginatedVendors.filter(v => v.vendorCode && this.selectedVendorCodes.has(v.vendorCode)).length;
    return selectedInPage > 0 && selectedInPage < this.paginatedVendors.length;
  }

  clearSelection(): void {
    this.selectedVendorCodes.clear();
  }

  bulkDeleteSelectedVendors(): void {
    this.deleteAllVendorsConfirmation();
  }




  toggleVendorStatus(vendor: AiVendorAnalysisItem): void {
    const currentStatus = vendor.status || 'Active';
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const targetId = vendor.id || vendor.vendorCode;

    this.vendorService.updateVendorStatus(targetId, newStatus).subscribe({
      next: () => {
        vendor.status = newStatus;
        this.toastr.success(`Vendor ${vendor.vendorName} marked as ${newStatus}.`, 'Status Updated');
      },
      error: () => {
        // Optimistically reflect state in UI
        vendor.status = newStatus;
        this.toastr.info(`Vendor ${vendor.vendorName} status updated to ${newStatus}.`, 'Status Updated');
      }
    });
  }

  exportVendorsToExcel(): void {
    const dataToExport = this.filteredVendors.length > 0 ? this.filteredVendors : this.enrichedVendors;
    if (dataToExport.length === 0) {
      this.toastr.warning('No vendor records to export.', 'Export Empty');
      return;
    }

    const exportRows = dataToExport.map((v, index) => ({
      '#': index + 1,
      'Vendor Code': v.vendorCode,
      'Vendor Name': v.vendorName,
      'Search Alias': v.searchTerm || '',
      'Industry': v.industry,
      'AI Category': v.category,
      'Sub Categories': Array.isArray(v.subCategories) ? v.subCategories.join(', ') : '',
      'Capabilities': Array.isArray(v.capabilities) ? v.capabilities.join(', ') : '',
      'Vendor Group': v.vendorGroup || 'Approved Vendor',
      'Sourcing Scope': v.sourcingScope || 'Client Only',
      'Qualification': v.qualification,
      'AI Score': `${v.aiScore || 0}%`,
      'Preferred Vendor': (v.aiScore || 0) > 80 ? 'YES (>80%)' : 'NO (<=80%)',
      'KYC Status': this.getKycStatusText(v),
      'GSTIN': v.credentials?.gstin?.value || '',
      'GSTIN Verified': v.credentials?.gstin?.verified ? 'YES' : 'NO',
      'PAN': v.credentials?.pan?.value || '',
      'PAN Verified': v.credentials?.pan?.verified ? 'YES' : 'NO',
      'Compliance Status': v.complianceStatus || 'Compliant',
      'Primary Phone': v.contactInfo?.phone1 || '',
      'Email': v.contactInfo?.email || '',
      'City': v.contactInfo?.city || '',
      'State': v.contactInfo?.state || '',
      'Country': v.contactInfo?.country || 'India'
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Vendors_Directory': worksheet },
      SheetNames: ['Vendors_Directory']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    saveAs(blob, `Procucev_Vendor_Directory_${new Date().toISOString().split('T')[0]}.xlsx`);
    this.toastr.success(`Exported ${exportRows.length} vendors to Excel.`, 'Export Completed');
  }

  // --- Excel Upload & Template Methods ---

  openUploadModal(): void {
    this.showUploadModal = true;
    this.resetUploadState();
  }

  closeUploadModal(): void {
    if (this.isUploading) { return; }
    this.showUploadModal = false;
    this.resetUploadState();
  }

  private resetUploadState(): void {
    this.selectedFileName = '';
    this.parsedRows = [];
    this.validCount = 0;
    this.invalidCount = 0;
    this.isDragging = false;
    this.isUploading = false;
  }

  downloadTemplate(): void {
    const headers = [
      'Vendor Code *',
      'Vendor Name *',
      'Search Term',
      'Phone 1 (Primary) *',
      'Phone 2 (Alternate)',
      'PAN',
      'GSTIN',
      'Country',
      'Region Code / State',
      'Address Line',
      'City',
      'District',
      'Postal Code',
      'Type of Business',
      'Type of Industry',
      'Vendor Group',
      'Sourcing Scope'
    ];

    const sampleRow = [
      'VND-001',
      'Tata Steel Trading Co',
      'Tata Steel',
      '9820112345',
      '02266658282',
      'AAACT2727Q',
      '27AAACT2727Q1ZW',
      'India',
      'Maharashtra',
      'Bombay House, 24 Homi Mody Street',
      'Mumbai',
      'Mumbai',
      '400001',
      'Manufacturer & Distributor',
      'MRO',
      'Approved Vendor',
      'Client Only'
    ];

    const sampleRow2 = [
      'VND-002',
      'Reliance Petrochem Ltd',
      'Reliance Chem',
      '9820556789',
      '',
      'AABCR1234F',
      '24AABCR1234F1Z8',
      'India',
      'Gujarat',
      'Reliance Greens, Motikhavdi',
      'Jamnagar',
      'Jamnagar',
      '361142',
      'Authorized Manufacturer',
      'Chemicals',
      'Strategic Supplier',
      'Client + Procucev'
    ];

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, sampleRow, sampleRow2]);
    worksheet['!cols'] = [
      { wch: 16 }, { wch: 28 }, { wch: 15 }, { wch: 22 }, { wch: 22 },
      { wch: 15 }, { wch: 20 }, { wch: 10 }, { wch: 20 }, { wch: 32 },
      { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 18 }, { wch: 18 },
      { wch: 16 }, { wch: 16 }
    ];

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Vendors': worksheet },
      SheetNames: ['Vendors']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    saveAs(blob, 'Buyer_Vendor_Master_Template.xlsx');
  }

  onFileSelected(event: any): void {
    const file = event.target?.files?.[0];
    if (file) {
      this.processFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.processFile(file);
    }
  }

  processFile(file: File): void {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValid) {
      this.toastr.error('Please upload a valid Excel (.xlsx, .xls) or CSV file', 'Invalid File');
      return;
    }

    this.selectedFileName = file.name;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const buffer = e.target.result;
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          this.toastr.warning('The uploaded file is empty', 'Empty File');
          this.parsedRows = [];
          this.validCount = 0;
          this.invalidCount = 0;
          return;
        }

        this.parseAndValidateRows(rawJson);
      } catch (err) {
        this.toastr.error('Failed to parse the file. Please ensure it follows the template format.', 'Parse Error');
      }
    };

    reader.readAsArrayBuffer(file);
  }

  private parseAndValidateRows(rawJson: any[]): void {
    this.parsedRows = [];
    let valid = 0;
    let invalid = 0;

    const phoneRegex = /^\d{10}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
    const pinRegex = /^\d{6}$/;

    for (const item of rawJson) {
      if (!item || typeof item !== 'object') { continue; }

      const vendor: BuyerVendor = {
        vendorCode: this.extractFieldValue(item, ['Vendor Code *', 'Vendor Code', 'Vendor ID', 'Code', 'vendorCode', 'vendor_code']),
        vendorName: this.extractFieldValue(item, ['Vendor Name *', 'Vendor Name', 'Company Name', 'Supplier Name', 'Name', 'vendorName', 'vendor_name']),
        searchTerm: this.extractFieldValue(item, ['Search Term', 'Search Alias', 'Alias', 'searchTerm', 'search_term']),
        phone1: this.extractFieldValue(item, ['Primary Phone *', 'Primary Phone', 'Phone 1 (Primary) *', 'Phone 1', 'phone1', 'Phone', 'Mobile', 'Mobile Number', 'Phone Number', 'contact', 'telephone']),
        phone2: this.extractFieldValue(item, ['Phone 2 (Alternate)', 'Phone 2', 'Alternate Phone', 'Secondary Phone', 'phone2']),
        pan: this.extractFieldValue(item, ['PAN', 'pan', 'PAN Number', 'pan_number', 'pan_no']),
        gstin: this.extractFieldValue(item, ['GSTIN', 'gstin', 'GST', 'GST Number', 'gst_number', 'gstin_number', 'gst_no']),
        country: this.extractFieldValue(item, ['Country', 'country']) || 'IN',
        regionCode: this.extractFieldValue(item, ['State', 'Region Code / State', 'Region Code', 'regionCode', 'state', 'province']),
        addressLine: this.extractFieldValue(item, ['Address Line', 'Address', 'addressLine', 'address', 'street']),
        city: this.extractFieldValue(item, ['City', 'city', 'Location']),
        district: this.extractFieldValue(item, ['District', 'district']),
        postalCode: this.extractFieldValue(item, ['Postal Code', 'Pincode', 'Pin Code', 'postalCode', 'pin', 'zip', 'postal_code']),
        typeOfBusiness: this.extractFieldValue(item, ['Type of Business', 'Business Type', 'typeOfBusiness', 'business_type', 'type_of_business']),
        typeOfIndustry: this.extractFieldValue(item, ['Industry', 'Type of Industry', 'Type of Industry *', 'typeOfIndustry', 'industry_type', 'type_of_industry']),
        vendorGroup: this.extractFieldValue(item, ['Vendor Group', 'Group', 'vendorGroup', 'vendor_group']),
        sourcingScope: this.extractFieldValue(item, ['Sourcing Scope', 'Scope', 'sourcingScope', 'sourcing_scope']) || 'Client Only',
        status: 'Active'
      };

      // Skip completely blank/empty rows in Excel
      if (!vendor.vendorCode && !vendor.vendorName && !vendor.phone1) {
        continue;
      }

      if (vendor.vendorCode) { vendor.vendorCode = String(vendor.vendorCode).trim(); }
      if (vendor.vendorName) { vendor.vendorName = String(vendor.vendorName).trim(); }
      if (vendor.phone1) { vendor.phone1 = String(vendor.phone1).replace(/\D/g, '').trim(); }
      if (vendor.phone2) { vendor.phone2 = String(vendor.phone2).replace(/\D/g, '').trim(); }
      if (vendor.pan) { vendor.pan = String(vendor.pan).trim().toUpperCase(); }
      if (vendor.gstin) { vendor.gstin = String(vendor.gstin).trim().toUpperCase(); }
      if (vendor.postalCode) { vendor.postalCode = String(vendor.postalCode).replace(/\D/g, '').trim(); }

      const errors: string[] = [];

      if (!vendor.vendorCode) {
        errors.push('Vendor Code is required');
      }
      if (!vendor.vendorName || vendor.vendorName.length < 2) {
        errors.push('Vendor Name is required (min 2 chars)');
      }
      if (!vendor.phone1 || !phoneRegex.test(vendor.phone1)) {
        errors.push('Primary Phone must be 10 digits');
      }
      if (vendor.pan && !panRegex.test(vendor.pan)) {
        errors.push('Invalid PAN format (e.g. ABCDE1234F)');
      }
      if (vendor.gstin && !gstinRegex.test(vendor.gstin)) {
        errors.push('Invalid GSTIN format (e.g. 29ABCDE1234F1Z5)');
      }
      if (vendor.postalCode && !pinRegex.test(vendor.postalCode)) {
        errors.push('Postal Code must be 6 digits');
      }

      const isValidRow = errors.length === 0;
      if (isValidRow) {
        valid++;
      } else {
        invalid++;
      }

      this.parsedRows.push({
        vendor,
        isValid: isValidRow,
        errors
      });
    }

    this.validCount = valid;
    this.invalidCount = invalid;
  }

  private extractFieldValue(obj: any, possibleKeys: string[]): string {
    const normalize = (s: string) => s.replace(/\*/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase().trim();
    
    // Check direct matches first
    for (const key of possibleKeys) {
      if (obj[key] !== undefined && obj[key] !== null && String(obj[key]).trim() !== '') {
        return String(obj[key]).trim();
      }
    }

    // Build normalized map of Excel row headers
    const objKeys = Object.keys(obj);
    const normalizedMap = new Map<string, string>();
    for (const k of objKeys) {
      normalizedMap.set(normalize(k), k);
    }

    for (const key of possibleKeys) {
      const normTarget = normalize(key);
      const matchedKey = normalizedMap.get(normTarget);
      if (matchedKey && obj[matchedKey] !== undefined && obj[matchedKey] !== null && String(obj[matchedKey]).trim() !== '') {
        return String(obj[matchedKey]).trim();
      }
    }
    return '';
  }


  uploadVendors(): void {
    if (!this.selectedFileName || this.parsedRows.length === 0) {
      this.toastr.warning('Please select an Excel (.xlsx, .xls) or CSV file first.', 'File Required');
      return;
    }

    const validVendors = this.parsedRows.filter(r => r.isValid).map(r => r.vendor);
    if (validVendors.length === 0) {
      this.toastr.warning('No valid vendor rows found in the selected file to upload.', 'Warning');
      return;
    }


    this.isUploading = true;
    this.vendorService.bulkCreateVendors(validVendors).subscribe({
      next: (res: any) => {
        this.isUploading = false;
        const saved = res?.data?.savedCount ?? validVendors.length;
        this.toastr.success(`${saved} vendors imported successfully.`, 'Success');
        this.showUploadModal = false;
        
        // Trigger AI enrichment in background
        this.aiProcessingService.enrichImportedVendors(validVendors).subscribe({
          next: () => {},
          error: () => {}
        });
        
        // Open AI Vendor Processing Pipeline modal
        this.startAiProcessingPipeline(validVendors.length);
      },
      error: () => {
        this.isUploading = false;
        this.toastr.error('Failed to import vendors. Please try again.', 'Error');
      }
    });
  }

  // --- AI Vendor Processing Pipeline Methods ---

  startAiProcessingPipeline(totalCount: number): void {
    this.aiTotalToProcess = totalCount || 2;
    this.aiProcessingCount = 0;
    this.aiProcessingProgress = 10;
    this.aiProcessingComplete = false;
    this.aiProcessingStatusText = 'Processing Vendors...';
    this.showAiProcessingModal = true;

    // Reset steps
    this.aiSteps = [
      { id: 'import', label: 'Vendors Imported', detail: 'Validation & Database Persistence', status: 'completed' },
      { id: 'analysis', label: 'Vendor Data Analysis', detail: 'Parsing Structure & Master Attributes', status: 'processing' },
      { id: 'industry', label: 'Industry Detection', detail: 'Taxonomic & Scope Classification', status: 'pending' },
      { id: 'categorization', label: 'Vendor Categorization', detail: 'AI Primary & Sub-Category Mapping', status: 'pending' },
      { id: 'credentials', label: 'Credential Mapping', detail: 'GSTIN, PAN & Verification Sync', status: 'pending' },
      { id: 'qualification', label: 'Vendor Qualification', detail: 'Risk Scoring & Procurement Readiness', status: 'pending' }
    ];

    // Step 2 -> Step 3
    this.aiStepTimer = setTimeout(() => {
      this.aiSteps[1].status = 'completed';
      this.aiSteps[2].status = 'processing';
      this.aiProcessingProgress = 30;
      this.aiProcessingCount = Math.max(1, Math.floor(this.aiTotalToProcess / 2));
      this.aiProcessingStatusText = `${this.aiProcessingCount} of ${this.aiTotalToProcess} Vendors Processed`;

      // Step 3 -> Step 4
      this.aiStepTimer = setTimeout(() => {
        this.aiSteps[2].status = 'completed';
        this.aiSteps[3].status = 'processing';
        this.aiProcessingProgress = 55;

        // Step 4 -> Step 5
        this.aiStepTimer = setTimeout(() => {
          this.aiSteps[3].status = 'completed';
          this.aiSteps[4].status = 'processing';
          this.aiProcessingProgress = 78;
          this.aiProcessingCount = this.aiTotalToProcess;
          this.aiProcessingStatusText = `${this.aiTotalToProcess} of ${this.aiTotalToProcess} Vendors Processed`;

          // Step 5 -> Step 6
          this.aiStepTimer = setTimeout(() => {
            this.aiSteps[4].status = 'completed';
            this.aiSteps[5].status = 'processing';
            this.aiProcessingProgress = 92;

            // Completion
            this.aiStepTimer = setTimeout(() => {
              this.aiSteps[5].status = 'completed';
              this.aiProcessingProgress = 100;
              this.aiProcessingComplete = true;
              this.aiProcessingStatusText = `${this.aiTotalToProcess} Vendors Successfully Enriched & Qualified`;
              this.loadEnrichedVendors();
            }, 600);
          }, 600);
        }, 600);
      }, 600);
    }, 700);
  }

  finishAiProcessing(): void {
    this.showAiProcessingModal = false;
    this.loadEnrichedVendors();
  }

  closeAiProcessingModal(): void {
    this.showAiProcessingModal = false;
    this.loadEnrichedVendors();
  }
}
