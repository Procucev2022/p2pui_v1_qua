import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SourcingMode, ExtractedEntity } from '../models/buyer-dashboard.model';
import { BuyerDashboardService } from '../services/buyer-dashboard.service';
import { BuyerVendorService } from '../../buyer-vendors/services/buyer-vendor.service';
import { BuyerVendor } from '../../buyer-vendors/models/buyer-vendor.model';

interface VendorEntry {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  category: string;
  location: string;
  rating: number;
  source: 'roster' | 'recommended';
  selected: boolean;
}

@Component({
  selector: 'app-buyer-ingestion-wizard',
  templateUrl: './buyer-ingestion-wizard.component.html',
  styleUrls: ['./buyer-ingestion-wizard.component.scss']
})
export class BuyerIngestionWizardComponent implements OnInit {

  @Output() complete = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  activeStep = 1;
  isSubmitting = false;
  loadingVendors = true;
  uploadedFileName = '';
  uploadedFile: File | null = null;
  ingestionMethod: 'upload' | 'manual' = 'upload';

  rfqTitle = '';
  rfqNumber = '';
  selectedMode: SourcingMode = 'mode_1';
  budget: number = null;
  deliveryDate = '';
  specialInstruction = '';

  /** Line items the buyer enters or confirms; nothing is pre-filled. */
  entities: ExtractedEntity[] = [];

  vendors: VendorEntry[] = [];
  recommendedVendors: VendorEntry[] = [];

  constructor(
    private buyerDashboardService: BuyerDashboardService,
    private buyerVendorService: BuyerVendorService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadRoster();
  }

  /** Loads the buyer's real vendor roster for targeting. */
  private loadRoster(): void {
    this.loadingVendors = true;
    this.buyerVendorService.getVendors(0, 200).subscribe({
      next: res => {
        const list = (res && res.data && res.data.vendors) ? res.data.vendors : [];
        this.vendors = list
          .filter(v => !v.isProcucevVendor)
          .map(v => this.toVendorEntry(v, 'roster'));
        this.recommendedVendors = list
          .filter(v => !!v.isProcucevVendor)
          .map(v => this.toVendorEntry(v, 'recommended'));
        this.loadingVendors = false;
      },
      error: () => {
        this.vendors = [];
        this.recommendedVendors = [];
        this.loadingVendors = false;
        this.toastr.error('Could not load your vendor roster', 'Error');
      }
    });
  }

  private toVendorEntry(v: BuyerVendor, source: 'roster' | 'recommended'): VendorEntry {
    const location = [v.city, v.district, v.country].filter(p => !!p).join(', ');
    return {
      id: v.id || v.vendorCode,
      name: v.vendorName,
      contactPerson: '',
      phone: v.phone1 || '',
      email: '',
      category: v.typeOfIndustry || '',
      location: location,
      rating: v.rating || 0,
      source: source,
      // Roster vendors are targeted by default in Mode 1.
      selected: source === 'roster'
    };
  }

  setStep(step: number): void {
    if (step >= 1 && step <= 4) {
      this.activeStep = step;
    }
  }

  onFileSelected(event: any): void {
    if (event && event.target && event.target.files && event.target.files[0]) {
      this.uploadedFile = event.target.files[0];
      this.uploadedFileName = this.uploadedFile.name;
    }
  }

  get canProceedFromStep1(): boolean {
    return !!this.rfqTitle.trim() && !!this.deliveryDate;
  }

  get canProceedFromStep2(): boolean {
    return this.entities.length > 0
      && this.entities.every(e => !!e.itemName && e.quantity > 0);
  }

  get selectedVendors(): VendorEntry[] {
    return this.getTargetedVendors().filter(v => v.selected);
  }

  get canDispatch(): boolean {
    return this.canProceedFromStep1
      && this.canProceedFromStep2
      && this.selectedVendors.length > 0;
  }

  handleAddEntity(): void {
    this.entities.push({
      id: `ent-${Date.now()}`,
      itemName: '',
      quantity: null,
      unit: '',
      targetDate: this.deliveryDate,
      technicalSpecs: '',
      confidence: 0,
      category: ''
    } as ExtractedEntity);
  }

  handleDeleteEntity(id: string): void {
    this.entities = this.entities.filter(e => e.id !== id);
  }

  selectMode(mode: SourcingMode): void {
    this.selectedMode = mode;
    // Mode 1 sources from the client roster only; Modes 2 and 3 add the network.
    if (mode === 'mode_1') {
      this.recommendedVendors.forEach(v => v.selected = false);
    }
  }

  /** Mode 1 targets the roster; Modes 2 and 3 include Procucev network vendors. */
  getTargetedVendors(): VendorEntry[] {
    if (this.selectedMode === 'mode_1') {
      return this.vendors;
    }
    return this.vendors.concat(this.recommendedVendors);
  }

  toggleVendor(vendor: VendorEntry): void {
    vendor.selected = !vendor.selected;
  }

  handleDispatch(): void {
    if (this.isSubmitting || !this.canDispatch) { return; }
    this.isSubmitting = true;

    const payload = {
      rfqNumber: this.rfqNumber || null,
      title: this.rfqTitle,
      category: this.entities.length > 0 ? this.entities[0].category : '',
      sourcingStrategyMode: this.selectedMode,
      budget: this.budget,
      deliveryDate: this.deliveryDate,
      specialInstruction: this.specialInstruction,
      entities: this.entities,
      targetedVendorNames: this.selectedVendors.map(v => v.name)
    };

    this.buyerDashboardService.createRfq(payload).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        const rfq = res && res.data ? res.data.rfq : null;
        this.toastr.success(
          rfq && rfq.rfqNumber ? `RFQ ${rfq.rfqNumber} created and dispatched` : 'RFQ created and dispatched',
          'Success'
        );
        this.complete.emit();
      },
      error: () => {
        this.isSubmitting = false;
        this.toastr.error('Failed to create the RFQ. Please try again.', 'Error');
      }
    });
  }
}
