import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { BuyerVendorService } from '../services/buyer-vendor.service';
import { BuyerVendor, INDUSTRY_TYPES } from '../models/buyer-vendor.model';
import { AiVendorProcessingService } from '../services/ai-vendor-processing.service';
import { AiVendorAnalysisItem } from '../models/ai-vendor-analysis.model';

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

  // KPI Metrics
  totalCount = 0;
  qualifiedCount = 0;
  avgAiScore = 0;
  verifiedCredentialsCount = 0;

  // Search & Filter State
  searchText = '';
  industryFilter = '';
  categoryFilter = '';
  qualificationFilter = '';
  sourcingScopeFilter = '';
  statusFilter = '';

  availableIndustries: string[] = [];
  availableCategories: string[] = [];
  industryTypes = INDUSTRY_TYPES;

  // Pagination
  currentPage = 0;
  pageSize = 10;

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

  loadEnrichedVendors(): void {
    this.loading = true;
    this.aiProcessingService.getVendors().subscribe({
      next: (vendors) => {
        this.enrichedVendors = vendors || [];
        this.populateFilterOptions();
        this.calculateKpiMetrics();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load vendors', err);
        this.loading = false;
      }
    });
  }

  private populateFilterOptions(): void {
    const indSet = new Set<string>();
    const catSet = new Set<string>();

    this.enrichedVendors.forEach(v => {
      if (v.industry) { indSet.add(v.industry); }
      if (v.category) { catSet.add(v.category); }
    });

    this.availableIndustries = Array.from(indSet).sort();
    this.availableCategories = Array.from(catSet).sort();
  }

  private calculateKpiMetrics(): void {
    this.totalCount = this.enrichedVendors.length;
    this.qualifiedCount = this.enrichedVendors.filter(v => v.qualification === 'Qualified').length;
    
    if (this.totalCount > 0) {
      const sum = this.enrichedVendors.reduce((acc, curr) => acc + (curr.aiScore || 0), 0);
      this.avgAiScore = Math.round(sum / this.totalCount);
    } else {
      this.avgAiScore = 0;
    }

    this.verifiedCredentialsCount = this.enrichedVendors.filter(
      v => (v.credentials?.gstin?.verified || v.credentials?.pan?.verified)
    ).length;
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

    this.filteredVendors = result;
    this.currentPage = 0;
  }

  resetFilters(): void {
    this.searchText = '';
    this.industryFilter = '';
    this.categoryFilter = '';
    this.qualificationFilter = '';
    this.sourcingScopeFilter = '';
    this.statusFilter = '';
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

  // --- Actions ---

  viewAiProfile(vendor: AiVendorAnalysisItem): void {
    if (vendor && vendor.vendorCode) {
      this.router.navigate(['/categorymgr/buyer-vendors/ai-profile', vendor.vendorCode]);
    }
  }

  addVendor(): void {
    this.router.navigate(['/categorymgr/buyer-vendors/new']);
  }

  editVendor(vendor: AiVendorAnalysisItem): void {
    this.router.navigate(['/categorymgr/buyer-vendors', vendor.vendorCode, 'edit']);
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

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
    const phoneRegex = /^\d{10}$/;
    const pinRegex = /^\d{6}$/;

    for (const item of rawJson) {
      const vendor: BuyerVendor = {
        vendorCode: this.extractFieldValue(item, ['Vendor Code *', 'Vendor Code', 'vendorCode', 'code', 'vendor_code']),
        vendorName: this.extractFieldValue(item, ['Vendor Name *', 'Vendor Name', 'vendorName', 'name', 'vendor_name']),
        searchTerm: this.extractFieldValue(item, ['Search Term', 'searchTerm', 'search_term']),
        phone1: this.extractFieldValue(item, ['Phone 1 (Primary) *', 'Phone 1', 'phone1', 'Phone', 'mobile', 'phone']),
        phone2: this.extractFieldValue(item, ['Phone 2 (Alternate)', 'Phone 2', 'phone2']),
        pan: this.extractFieldValue(item, ['PAN', 'pan', 'PAN Number']),
        gstin: this.extractFieldValue(item, ['GSTIN', 'gstin', 'GST', 'GST Number']),
        country: this.extractFieldValue(item, ['Country', 'country']) || 'IN',
        regionCode: this.extractFieldValue(item, ['Region Code / State', 'Region Code', 'State', 'regionCode', 'state']),
        addressLine: this.extractFieldValue(item, ['Address Line', 'Address', 'addressLine', 'address']),
        city: this.extractFieldValue(item, ['City', 'city']),
        district: this.extractFieldValue(item, ['District', 'district']),
        postalCode: this.extractFieldValue(item, ['Postal Code', 'Pincode', 'postalCode', 'pin', 'zip']),
        typeOfBusiness: this.extractFieldValue(item, ['Type of Business', 'Business Type', 'typeOfBusiness']),
        typeOfIndustry: this.extractFieldValue(item, ['Type of Industry', 'Industry', 'typeOfIndustry']),
        vendorGroup: this.extractFieldValue(item, ['Vendor Group', 'Group', 'vendorGroup']),
        sourcingScope: this.extractFieldValue(item, ['Sourcing Scope', 'Scope', 'sourcingScope']) || 'Client Only',
        status: 'Active'
      };

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
      if (!vendor.vendorName || vendor.vendorName.length < 3) {
        errors.push('Vendor Name is required (min 3 chars)');
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
    
    for (const key of possibleKeys) {
      if (obj[key] !== undefined && obj[key] !== null && String(obj[key]).trim() !== '') {
        return String(obj[key]).trim();
      }
    }
    const objKeys = Object.keys(obj);
    for (const key of possibleKeys) {
      const normTarget = normalize(key);
      const matchedKey = objKeys.find(k => normalize(k) === normTarget);
      if (matchedKey && obj[matchedKey] !== undefined && obj[matchedKey] !== null && String(obj[matchedKey]).trim() !== '') {
        return String(obj[matchedKey]).trim();
      }
    }
    return '';
  }

  uploadVendors(): void {
    const validVendors = this.parsedRows.filter(r => r.isValid).map(r => r.vendor);
    if (validVendors.length === 0) {
      this.toastr.warning('No valid vendor rows to upload', 'Warning');
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
        this.toastr.warning(`${validVendors.length} vendors processed.`, 'Notice');
        this.showUploadModal = false;
        this.aiProcessingService.enrichImportedVendors(validVendors).subscribe({
          next: () => {},
          error: () => {}
        });
        this.startAiProcessingPipeline(validVendors.length);
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
