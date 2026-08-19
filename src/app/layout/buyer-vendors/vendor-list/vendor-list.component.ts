import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { BuyerVendorService } from '../services/buyer-vendor.service';
import { BuyerVendor, INDUSTRY_TYPES } from '../models/buyer-vendor.model';

interface ParsedVendorRow {
  vendor: BuyerVendor;
  isValid: boolean;
  errors: string[];
}

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit {

  vendors: BuyerVendor[] = [];
  totalRecords = 0;
  currentPage = 0;
  pageSize = 10;
  searchText = '';
  statusFilter = '';
  industryFilter = '';
  industryTypes = INDUSTRY_TYPES;
  loading = false;

  // Excel Upload Modal State
  showUploadModal = false;
  selectedFileName = '';
  isDragging = false;
  isUploading = false;
  parsedRows: ParsedVendorRow[] = [];
  validCount = 0;
  invalidCount = 0;

  constructor(
    private vendorService: BuyerVendorService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadVendors();
  }

  loadVendors(): void {
    this.loading = true;
    this.vendorService.getVendors(
      this.currentPage, this.pageSize, this.searchText, this.statusFilter, this.industryFilter
    ).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.vendors = res.data.vendors || [];
          this.totalRecords = res.data.totalRecords || 0;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadVendors();
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadVendors();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadVendors();
  }

  addVendor(): void {
    this.router.navigate(['/categorymgr/buyer-vendors/new']);
  }

  editVendor(vendor: BuyerVendor): void {
    this.router.navigate(['/categorymgr/buyer-vendors', vendor.id, 'edit']);
  }

  viewVendor(vendor: BuyerVendor): void {
    this.router.navigate(['/categorymgr/buyer-vendors', vendor.id]);
  }

  deactivateVendor(vendor: BuyerVendor): void {
    if (!vendor.id) { return; }
    const newStatus = vendor.status === 'Active' ? 'Inactive' : 'Active';
    this.vendorService.updateVendorStatus(vendor.id, newStatus).subscribe({
      next: () => {
        this.toastr.success(`Vendor status changed to ${newStatus}`, 'Success');
        this.loadVendors();
      },
      error: (err) => {
        this.toastr.error('Failed to update vendor status', 'Error');
      }
    });
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

  resetUploadState(): void {
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

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers]);
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
    saveAs(blob, 'Buyer_Vendor_Import_Template.xlsx');
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

      // Clean string values
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
    for (const key of possibleKeys) {
      if (obj[key] !== undefined && obj[key] !== null && String(obj[key]).trim() !== '') {
        return String(obj[key]).trim();
      }
    }
    // Also try case-insensitive matching
    const objKeys = Object.keys(obj);
    for (const key of possibleKeys) {
      const matchedKey = objKeys.find(k => k.trim().toLowerCase() === key.trim().toLowerCase());
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
        const skipped = res?.data?.skippedCount ?? 0;

        let message = `Successfully imported ${saved} vendor(s).`;
        if (skipped > 0) {
          message += ` (${skipped} duplicate vendor codes skipped)`;
        }

        this.toastr.success(message, 'Upload Complete');
        this.closeUploadModal();
        this.loadVendors();
      },
      error: (err: any) => {
        this.isUploading = false;
        this.toastr.error('Failed to import vendors. Please try again.', 'Error');
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  get pages(): number[] {
    const pagesArr: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pagesArr.push(i);
    }
    return pagesArr;
  }
}
