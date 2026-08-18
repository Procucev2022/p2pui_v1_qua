import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyerVendorService } from '../services/buyer-vendor.service';
import { BuyerVendor, INDUSTRY_TYPES, VENDOR_GROUPS, SOURCING_SCOPES } from '../models/buyer-vendor.model';

@Component({
  selector: 'app-vendor-form',
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.scss']
})
export class VendorFormComponent implements OnInit {

  vendorForm: FormGroup;
  isEditMode = false;
  vendorId: string | null = null;
  loading = false;
  industryTypes = INDUSTRY_TYPES;
  vendorGroups = VENDOR_GROUPS;
  sourcingScopes = SOURCING_SCOPES;

  constructor(
    private fb: FormBuilder,
    private vendorService: BuyerVendorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.vendorForm = this.createForm();
  }

  ngOnInit(): void {
    this.vendorId = this.route.snapshot.paramMap.get('id');
    if (this.vendorId) {
      this.isEditMode = true;
      this.loadVendor(this.vendorId);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      vendorCode: ['', [Validators.required]],
      vendorName: ['', [Validators.required, Validators.minLength(3)]],
      searchTerm: [''],
      pan: ['', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      gstin: ['', [Validators.pattern(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/)]],
      country: ['IN'],
      regionCode: [''],
      addressLine: [''],
      city: [''],
      district: [''],
      postalCode: ['', [Validators.pattern(/^\d{6}$/)]],
      phone1: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      phone2: [''],
      typeOfBusiness: [''],
      typeOfIndustry: [''],
      vendorGroup: [''],
      sourcingScope: ['Client Only']
    });
  }

  loadVendor(id: string): void {
    this.loading = true;
    this.vendorService.getVendorById(id).subscribe({
      next: (res) => {
        if (res && res.data && res.data.vendor) {
          this.vendorForm.patchValue(res.data.vendor);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.vendorForm.invalid) {
      this.vendorForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const vendorData: BuyerVendor = this.vendorForm.value;

    if (this.isEditMode && this.vendorId) {
      this.vendorService.updateVendor(this.vendorId, vendorData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/categorymgr/buyer-vendors']);
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.vendorService.createVendor(vendorData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/categorymgr/buyer-vendors']);
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/categorymgr/buyer-vendors']);
  }

  get f() { return this.vendorForm.controls; }
}
