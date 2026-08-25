import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyerVendorService } from '../services/buyer-vendor.service';
import { BuyerVendor } from '../models/buyer-vendor.model';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  styleUrls: ['./vendor-detail.component.scss']
})
export class VendorDetailComponent implements OnInit {

  vendor: BuyerVendor | null = null;
  loading = false;
  vendorId: string | null = null;

  constructor(
    private vendorService: BuyerVendorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vendorId = this.route.snapshot.paramMap.get('id');
    if (this.vendorId) {
      this.loadVendor(this.vendorId);
    }
  }

  loadVendor(id: string): void {
    this.loading = true;
    this.vendorService.getVendorById(id).subscribe({
      next: (res) => {
        if (res && res.data && res.data.vendor) {
          this.vendor = res.data.vendor;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  editVendor(): void {
    if (this.vendorId) {
      this.router.navigate(['/categorymgr/buyer-vendors', this.vendorId, 'edit']);
    }
  }

  deactivateVendor(): void {
    if (!this.vendor || !this.vendorId) { return; }
    const newStatus = this.vendor.status === 'Active' ? 'Inactive' : 'Active';
    this.vendorService.updateVendorStatus(this.vendorId, newStatus).subscribe({
      next: () => {
        this.loadVendor(this.vendorId!);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/categorymgr/buyer-vendors']);
  }
}
