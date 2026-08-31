import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BuyerVendorService } from '../services/buyer-vendor.service';
import { BuyerVendor } from '../models/buyer-vendor.model';
import { swalConfirm } from 'src/app/shared/helpers/swal-confirm';

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
    private router: Router,
    private toastr: ToastrService
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
        this.toastr.success(`Vendor marked as ${newStatus}.`, 'Status Updated');
        this.loadVendor(this.vendorId!);
      }
    });
  }

  deleteVendor(): void {
    if (!this.vendor) { return; }
    const vendorName = this.vendor.vendorName || 'Vendor';
    const targetId = this.vendorId || this.vendor.id || this.vendor.vendorCode;

    swalConfirm.open({
      title: 'Please Confirm!',
      text: `Are you sure you want to delete vendor "${vendorName}" (${this.vendor.vendorCode})? This action cannot be undone.`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result: any) => {
      if (result && (result.value || result.isConfirmed)) {
        this.vendorService.deleteVendor(targetId).subscribe({
          next: () => {
            this.toastr.success(`Vendor ${vendorName} deleted successfully.`, 'Deleted');
            this.goBack();
          },
          error: (err: any) => {
            console.error('Failed to delete vendor', err);
            this.toastr.error('Failed to delete vendor. Please try again.', 'Error');
          }
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/categorymgr/buyer-vendors']);
  }
}

