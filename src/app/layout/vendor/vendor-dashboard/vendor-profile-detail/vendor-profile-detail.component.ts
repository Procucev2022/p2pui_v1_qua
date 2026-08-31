import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CreateRfqService } from '../../../category-mgr/services/create-rfq.service';
import { VendorRegistrationService } from 'src/app/vendor-registration/services/vendor-registration.service';
import { VendorProfileSummary } from '../models/vendor-dashboard.model';

interface OrganizationProfileForm {
  companyName: string;
  brandName: string;
  organizationType: string;
  panNumber: string;
  gstNumber: string;
  cinNumber: string;
  msmeNumber: string;
  website: string;
  annualTurnover: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  contactName: string;
  contactDesignation: string;
  contactEmail: string;
  contactPhone: string;
}

@Component({
  selector: 'app-vendor-profile-detail',
  templateUrl: './vendor-profile-detail.component.html',
  styleUrls: ['./vendor-profile-detail.component.scss']
})
export class VendorProfileDetailComponent implements OnInit {

  @Input() profile: VendorProfileSummary | null = null;

  organizationTypes: string[] = [
    'Private Limited',
    'Public Limited',
    'Partnership',
    'Sole Proprietorship',
    'LLP'
  ];

  /** Division/category tree loaded from the master category service. */
  categoryTree: { major: string; minors: string[] }[] = [];
  loadingCategories = true;
  loadingProfile = true;
  saving = false;

  selectedMajors: string[] = [];
  selectedMinors: { [major: string]: string[] } = {};

  form: OrganizationProfileForm = {
    companyName: '',
    brandName: '',
    organizationType: '',
    panNumber: '',
    gstNumber: '',
    cinNumber: '',
    msmeNumber: '',
    website: '',
    annualTurnover: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    contactName: '',
    contactDesignation: '',
    contactEmail: '',
    contactPhone: ''
  };

  constructor(
    private createRfqService: CreateRfqService,
    private vendorRegService: VendorRegistrationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadDivisions();
    this.loadOrganization();
  }

  /** Loads the real division list; minor categories load on demand per division. */
  private loadDivisions(): void {
    this.loadingCategories = true;
    this.createRfqService.getGMTDivisions().subscribe({
      next: (res: any) => {
        const divisions: string[] = Array.isArray(res) ? res : [];
        this.categoryTree = divisions.map(d => ({ major: d, minors: [] }));
        this.loadingCategories = false;
      },
      error: () => {
        this.categoryTree = [];
        this.loadingCategories = false;
      }
    });
  }

  /** Loads the vendor's saved organization record. */
  private loadOrganization(): void {
    const orgId = localStorage.getItem('orgId');
    if (!orgId) {
      this.loadingProfile = false;
      return;
    }

    this.loadingProfile = true;
    this.vendorRegService.getGMTSellerById({ id: orgId }).subscribe({
      next: (res: any) => {
        if (res) {
          this.form.companyName = res.companyName || '';
          this.form.brandName = res.brandName || '';
          this.form.organizationType = res.orgType && res.orgType.typeName ? res.orgType.typeName : '';
          this.form.panNumber = res.pan || '';
          this.form.gstNumber = res.gstin || '';
          this.form.cinNumber = res.cin || '';
          this.form.msmeNumber = res.msmeNumber || '';
          this.form.website = res.website || '';
          this.form.annualTurnover = res.annualTurnover || '';
          this.form.street = res.address1 || '';
          this.form.city = res.city || '';
          this.form.state = res.state || '';
          this.form.pincode = res.zipCode || '';
          this.form.country = res.country || '';
          this.form.contactName = res.contactPerson || '';
          this.form.contactDesignation = res.designation || '';
          this.form.contactEmail = res.email || '';
          this.form.contactPhone = res.organizationPhonenumber || '';
        }
        this.loadingProfile = false;
      },
      error: () => {
        this.loadingProfile = false;
        this.toastr.error('Could not load your organization profile', 'Error');
      }
    });
  }

  isMajorSelected(major: string): boolean {
    return this.selectedMajors.indexOf(major) !== -1;
  }

  toggleMajor(major: string): void {
    if (this.isMajorSelected(major)) {
      this.selectedMajors = this.selectedMajors.filter(m => m !== major);
      delete this.selectedMinors[major];
    } else {
      this.selectedMajors = this.selectedMajors.concat([major]);
      this.selectedMinors[major] = [];
      this.loadMinorsFor(major);
    }
  }

  /** Fetches the real category list for a division the first time it is opened. */
  private loadMinorsFor(major: string): void {
    const node = this.categoryTree.filter(c => c.major === major)[0];
    if (!node || node.minors.length > 0) { return; }

    this.createRfqService.getGMTCategoriesByDivision({ division: major }).subscribe({
      next: (res: any) => {
        node.minors = Array.isArray(res) ? res : [];
      },
      error: () => {
        node.minors = [];
      }
    });
  }

  isMinorSelected(major: string, minor: string): boolean {
    const list = this.selectedMinors[major] || [];
    return list.indexOf(minor) !== -1;
  }

  toggleMinor(major: string, minor: string): void {
    const list = this.selectedMinors[major] || [];
    this.selectedMinors[major] = this.isMinorSelected(major, minor)
      ? list.filter(m => m !== minor)
      : list.concat([minor]);
  }

  getMinorsFor(major: string): string[] {
    const found = this.categoryTree.filter(c => c.major === major);
    return found.length > 0 ? found[0].minors : [];
  }

  get selectedMinorCount(): number {
    return this.selectedMajors.reduce(
      (acc, major) => acc + (this.selectedMinors[major] || []).length,
      0
    );
  }

  get isValid(): boolean {
    return !!this.form.companyName.trim()
      && !!this.form.panNumber.trim()
      && !!this.form.gstNumber.trim()
      && !!this.form.contactEmail.trim();
  }

  save(): void {
    if (!this.isValid || this.saving) { return; }

    const orgId = localStorage.getItem('orgId');
    if (!orgId) {
      this.toastr.error('Your organization could not be resolved', 'Error');
      return;
    }

    this.saving = true;
    const payload: any = {
      id: orgId,
      companyName: this.form.companyName,
      brandName: this.form.brandName,
      pan: this.form.panNumber,
      gstin: this.form.gstNumber,
      cin: this.form.cinNumber,
      msmeNumber: this.form.msmeNumber,
      website: this.form.website,
      annualTurnover: this.form.annualTurnover,
      address1: this.form.street,
      city: this.form.city,
      state: this.form.state,
      zipCode: this.form.pincode,
      country: this.form.country,
      contactPerson: this.form.contactName,
      designation: this.form.contactDesignation,
      email: this.form.contactEmail,
      organizationPhonenumber: this.form.contactPhone,
      selectedMajorCategories: this.selectedMajors,
      selectedMinorCategories: this.selectedMinors
    };

    this.createRfqService.updateSellerData(payload).subscribe({
      next: () => {
        this.saving = false;
        this.toastr.success('Vendor profile saved', 'Success');
      },
      error: () => {
        this.saving = false;
        this.toastr.error('Could not save your profile', 'Error');
      }
    });
  }
}
