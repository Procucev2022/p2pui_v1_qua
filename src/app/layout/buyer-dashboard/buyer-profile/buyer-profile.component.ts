import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CreateRfqService } from '../../category-mgr/services/create-rfq.service';

interface MajorCategoryItem {
  name: string;
  minors: string[];
}

@Component({
  selector: 'app-buyer-profile',
  templateUrl: './buyer-profile.component.html',
  styleUrls: ['./buyer-profile.component.scss']
})
export class BuyerProfileComponent implements OnInit {

  companyName = '';
  brandName = '';
  orgType = '';
  panNumber = '';
  gstNumber = '';
  cinNumber = '';
  website = '';
  annualTurnover = '';

  street = '';
  city = '';
  state = '';
  pincode = '';
  country = '';

  contactName = '';
  contactDesignation = '';
  contactEmail = '';
  contactPhone = '';

  categorySearch = '';
  loading = true;
  loadingCategories = true;
  saving = false;

  /** Divisions and categories loaded from the master category service. */
  categories: MajorCategoryItem[] = [];
  selectedMinors: Record<string, string[]> = {};

  constructor(
    private createRfqService: CreateRfqService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadOrganization();
    this.loadDivisions();
  }

  /** Loads the buyer's saved organization record. */
  private loadOrganization(): void {
    const loggedId = localStorage.getItem('loggedId');
    if (!loggedId) {
      this.loading = false;
      return;
    }

    this.loading = true;
    this.createRfqService.getBuyerDataById({ id: loggedId }).subscribe({
      next: (res: any) => {
        if (res) {
          this.companyName = res.companyName || '';
          this.brandName = res.brandName || '';
          this.orgType = res.orgType && res.orgType.typeName ? res.orgType.typeName : '';
          this.panNumber = res.pan || '';
          this.gstNumber = res.gstin || '';
          this.cinNumber = res.cin || '';
          this.website = res.website || '';
          this.annualTurnover = res.annualTurnover || '';
          this.street = res.address1 || '';
          this.city = res.city || '';
          this.state = res.state || '';
          this.pincode = res.zipCode || '';
          this.country = res.country || '';
          this.contactName = res.contactPerson || '';
          this.contactDesignation = res.designation || '';
          this.contactEmail = res.email || '';
          this.contactPhone = res.organizationPhonenumber || '';
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Could not load your organization profile', 'Error');
      }
    });
  }

  /** Loads real divisions; categories load per division on expand. */
  private loadDivisions(): void {
    this.loadingCategories = true;
    this.createRfqService.getGMTDivisions().subscribe({
      next: (res: any) => {
        const divisions: string[] = Array.isArray(res) ? res : [];
        this.categories = divisions.map(d => ({ name: d, minors: [] }));
        this.categories.forEach(c => this.loadMinorsFor(c.name));
        this.loadingCategories = false;
      },
      error: () => {
        this.categories = [];
        this.loadingCategories = false;
      }
    });
  }

  private loadMinorsFor(major: string): void {
    const node = this.categories.filter(c => c.name === major)[0];
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

  get filteredCategories(): MajorCategoryItem[] {
    const term = (this.categorySearch || '').trim().toLowerCase();
    if (!term) { return this.categories; }
    return this.categories.filter(c =>
      c.name.toLowerCase().indexOf(term) !== -1
      || c.minors.some(m => m.toLowerCase().indexOf(term) !== -1)
    );
  }

  isMinorSelected(major: string, minor: string): boolean {
    return !!(this.selectedMinors[major] && this.selectedMinors[major].indexOf(minor) !== -1);
  }

  isAllSelected(major: string): boolean {
    const cat = this.categories.filter(c => c.name === major)[0];
    if (!cat || cat.minors.length === 0) { return false; }
    const selected = this.selectedMinors[major] || [];
    return cat.minors.every(m => selected.indexOf(m) !== -1);
  }

  toggleSelectAll(major: string): void {
    const cat = this.categories.filter(c => c.name === major)[0];
    if (!cat) { return; }
    this.selectedMinors[major] = this.isAllSelected(major) ? [] : cat.minors.slice();
  }

  toggleMinor(major: string, minor: string): void {
    if (!this.selectedMinors[major]) {
      this.selectedMinors[major] = [];
    }
    const idx = this.selectedMinors[major].indexOf(minor);
    if (idx > -1) {
      this.selectedMinors[major].splice(idx, 1);
    } else {
      this.selectedMinors[major].push(minor);
    }
  }

  get isValid(): boolean {
    return !!this.companyName.trim() && !!this.contactEmail.trim();
  }

  saveProfile(): void {
    if (!this.isValid || this.saving) { return; }

    const loggedId = localStorage.getItem('loggedId');
    const orgId = localStorage.getItem('orgId');
    if (!orgId) {
      this.toastr.error('Your organization could not be resolved', 'Error');
      return;
    }

    this.saving = true;
    const payload: any = {
      id: orgId,
      userId: loggedId,
      companyName: this.companyName,
      brandName: this.brandName,
      pan: this.panNumber,
      gstin: this.gstNumber,
      cin: this.cinNumber,
      website: this.website,
      annualTurnover: this.annualTurnover,
      address1: this.street,
      city: this.city,
      state: this.state,
      zipCode: this.pincode,
      country: this.country,
      contactPerson: this.contactName,
      designation: this.contactDesignation,
      email: this.contactEmail,
      organizationPhonenumber: this.contactPhone,
      selectedCategories: this.selectedMinors
    };

    this.createRfqService.updateBuyerData(payload).subscribe({
      next: () => {
        this.saving = false;
        this.toastr.success('Profile and category authorizations saved', 'Success');
      },
      error: () => {
        this.saving = false;
        this.toastr.error('Could not save your profile', 'Error');
      }
    });
  }
}
