import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BuyerVendorService } from '../services/buyer-vendor.service';
import { BuyerVendor, INDUSTRY_TYPES } from '../models/buyer-vendor.model';

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

  constructor(
    private vendorService: BuyerVendorService,
    private router: Router
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
        this.loadVendors();
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
