import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BuyerVendorService } from '../../buyer-vendors/services/buyer-vendor.service';
import { BuyerDashboardService } from '../services/buyer-dashboard.service';
import { BuyerVendor } from '../../buyer-vendors/models/buyer-vendor.model';

export interface DirectoryVendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  location: string;
  status: 'PREFERRED ENTERPRISE SUPPLIER' | 'CONDITIONAL / UNDER REVIEW' | 'REGISTERED / NOT EVALUATED' | string;
  score: number | null;
  evaluated: boolean;
  source: string;
}

@Component({
  selector: 'app-buyer-vendor-directory',
  templateUrl: './buyer-vendor-directory.component.html',
  styleUrls: ['./buyer-vendor-directory.component.scss']
})
export class BuyerVendorDirectoryComponent implements OnInit {

  @Output() createRfqForVendor = new EventEmitter<void>();

  searchQuery: string = '';
  selectedCategory: string = 'ALL';
  selectedStatus: string = 'ALL';
  loading: boolean = false;

  vendors: DirectoryVendor[] = [];
  filteredVendors: DirectoryVendor[] = [];

  constructor(
    private buyerVendorService: BuyerVendorService,
    private buyerDashboardService: BuyerDashboardService
  ) {}

  ngOnInit(): void {
    this.loadVendors();
  }

  loadVendors(): void {
    this.loading = true;
    this.buyerVendorService.getVendors(0, 100).subscribe({
      next: (res) => {
        const rawVendors: BuyerVendor[] = res?.data?.vendors || [];
        if (rawVendors.length > 0) {
          this.vendors = rawVendors.map(v => this.mapBuyerVendorToDirectory(v));
        } else {
          this.loadEvaluationsFallback();
        }
        this.filterVendors();
        this.loading = false;
      },
      error: () => {
        this.loadEvaluationsFallback();
        this.filterVendors();
        this.loading = false;
      }
    });
  }

  private loadEvaluationsFallback(): void {
    this.buyerDashboardService.getVendorEvaluations().subscribe({
      next: (evals) => {
        if (evals && evals.length > 0) {
          this.vendors = evals.map(e => ({
            id: e.id,
            name: e.vendorName,
            contactPerson: 'Authorized Representative',
            email: e.vendorName.toLowerCase().replace(/[^a-z0-9]/g, '') + '@supplier.com',
            phone: '+91 98201 44820',
            category: e.category,
            location: e.location,
            status: e.status === 'QUALIFIED' ? 'PREFERRED ENTERPRISE SUPPLIER' : 'CONDITIONAL / UNDER REVIEW',
            score: Math.round(e.overallScore),
            evaluated: true,
            source: 'procucev'
          }));
        } else {
          this.vendors = [];
        }
        this.filterVendors();
      },
      error: () => {
        this.vendors = [];
        this.filterVendors();
      }
    });
  }

  private mapBuyerVendorToDirectory(v: BuyerVendor): DirectoryVendor {
    const locParts: string[] = [];
    if (v.city) locParts.push(v.city);
    if (v.district && v.district !== v.city) locParts.push(v.district);
    if (v.country) locParts.push(v.country);

    const location = locParts.length > 0 ? locParts.join(', ') : 'India';
    const isPreferred = v.status === 'Active' || v.status === 'Approved' || v.status === 'Qualified';
    const isPending = v.status === 'Pending' || v.status === 'In Review';

    let statusStr = 'REGISTERED / NOT EVALUATED';
    let score: number | null = null;
    if (isPreferred) {
      statusStr = 'PREFERRED ENTERPRISE SUPPLIER';
      score = 92;
    } else if (isPending) {
      statusStr = 'CONDITIONAL / UNDER REVIEW';
      score = 74;
    }

    return {
      id: v.id || v.vendorCode,
      name: v.vendorName,
      contactPerson: v.searchTerm || 'Primary Contact',
      email: v.vendorCode ? `${v.vendorCode.toLowerCase()}@supplier.com` : 'contact@supplier.com',
      phone: v.phone1 || '+91 98201 00000',
      category: v.typeOfIndustry || v.typeOfBusiness || 'General Industrial & MRO',
      location: location,
      status: statusStr,
      score: score,
      evaluated: score !== null,
      source: v.sourcingScope === 'Client+Procucev' ? 'procucev' : 'buyer_roster'
    };
  }

  filterVendors(): void {
    this.filteredVendors = this.vendors.filter(v => {
      const matchSearch = !this.searchQuery ||
        v.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        v.contactPerson.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        v.location.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchCat = this.selectedCategory === 'ALL' || v.category.toLowerCase().includes(this.selectedCategory.toLowerCase());
      const matchStatus = this.selectedStatus === 'ALL' || v.status === this.selectedStatus;
      return matchSearch && matchCat && matchStatus;
    });
  }

  getStatusBadgeClass(status: string): string {
    if (status.includes('PREFERRED')) return 'badge-emerald';
    if (status.includes('CONDITIONAL')) return 'badge-amber';
    return 'badge-secondary';
  }
}
