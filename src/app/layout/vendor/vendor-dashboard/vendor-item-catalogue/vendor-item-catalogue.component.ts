import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { VendorDashboardService } from '../services/vendor-dashboard.service';
import {
  CatalogueProduct,
  VendorOpportunity,
  VendorProfileSummary
} from '../models/vendor-dashboard.model';

@Component({
  selector: 'app-vendor-item-catalogue',
  templateUrl: './vendor-item-catalogue.component.html',
  styleUrls: ['./vendor-item-catalogue.component.scss']
})
export class VendorItemCatalogueComponent implements OnInit {

  @Input() profile: VendorProfileSummary | null = null;
  @Output() navigateToSubscriptions = new EventEmitter<void>();

  products: CatalogueProduct[] = [];
  opportunities: VendorOpportunity[] = [];
  loading = true;
  saving = false;
  searchTerm = '';
  showForm = false;
  editingId: string | null = null;

  draft: CatalogueProduct = this.createEmptyDraft();

  constructor(
    private vendorDashboardService: VendorDashboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.vendorDashboardService.getCatalogue().subscribe(list => {
      this.products = list || [];
      this.loading = false;
    });

    this.vendorDashboardService.getOpportunities().subscribe(list => {
      this.opportunities = list || [];
    });
  }

  /**
   * Catalogue publishing depends on the active plan including catalogue
   * listing. Plans without it can view the catalogue but not edit.
   */
  get canPublish(): boolean {
    return this.maxProducts > 0;
  }

  /** Product cap from the active plan; 0 means catalogue listing is excluded. */
  get maxProducts(): number {
    return this.profile ? (this.profile.maxCatalogueProducts || 0) : 0;
  }

  get atCapacity(): boolean {
    return this.maxProducts > 0 && this.products.length >= this.maxProducts;
  }

  get publishedCount(): number {
    return this.products.filter(p => p.published).length;
  }

  get filteredProducts(): CatalogueProduct[] {
    const term = (this.searchTerm || '').trim().toLowerCase();
    if (!term) { return this.products; }
    return this.products.filter(p =>
      `${p.sku} ${p.name} ${p.category} ${p.specs || ''}`.toLowerCase().indexOf(term) !== -1
    );
  }

  /**
   * Reverse of the feed's catalogue matching: shows the vendor how many live
   * RFQs each product could be quoted against.
   */
  getRfqMatchCount(product: CatalogueProduct): number {
    const words = `${product.name} ${product.category} ${product.specs || ''}`
      .toLowerCase()
      .split(/\W+/)
      .filter(w => w.length > 3);

    return this.opportunities.filter(opp => {
      const lineItemText = (opp.lineItems || []).map(li => li.description).join(' ');
      const rfqText = `${opp.title} ${lineItemText}`.toLowerCase();
      return words.some(w => rfqText.indexOf(w) !== -1);
    }).length;
  }

  get totalRfqMatches(): number {
    return this.products.reduce((acc, p) => acc + (this.getRfqMatchCount(p) > 0 ? 1 : 0), 0);
  }

  private createEmptyDraft(): CatalogueProduct {
    return {
      id: '',
      sku: '',
      name: '',
      category: '',
      specs: '',
      moq: null,
      unit: '',
      unitPrice: null,
      leadTimeDays: null,
      published: true
    } as CatalogueProduct;
  }

  openForm(): void {
    if (!this.canPublish) {
      this.toastr.info('Your plan does not include catalogue publishing', 'Upgrade required');
      this.navigateToSubscriptions.emit();
      return;
    }
    if (this.atCapacity) {
      this.toastr.warning(
        `Your plan allows up to ${this.maxProducts} products`, 'Catalogue limit reached'
      );
      return;
    }
    this.editingId = null;
    this.draft = this.createEmptyDraft();
    this.showForm = true;
  }

  editProduct(product: CatalogueProduct): void {
    if (!this.canPublish) {
      this.toastr.info('Your plan does not include catalogue publishing', 'Upgrade required');
      this.navigateToSubscriptions.emit();
      return;
    }
    this.editingId = product.id;
    this.draft = { ...product };
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.draft = this.createEmptyDraft();
  }

  get isDraftValid(): boolean {
    return !!this.draft.sku.trim()
      && !!this.draft.name.trim()
      && !!this.draft.category.trim()
      && Number(this.draft.unitPrice) > 0
      && Number(this.draft.moq) > 0
      && Number(this.draft.leadTimeDays) > 0;
  }

  saveProduct(): void {
    if (!this.isDraftValid || this.saving) { return; }
    this.saving = true;
    const editing = this.editingId;

    this.vendorDashboardService.saveCatalogueProduct({ ...this.draft }).subscribe({
      next: (res: any) => {
        this.saving = false;
        const saved = (res && res.data && res.data.product) ? res.data.product : null;
        if (!saved) {
          this.toastr.error('Product could not be saved', 'Error');
          return;
        }
        if (editing) {
          this.products = this.products.map(p => p.id === editing ? saved : p);
          this.toastr.success(`Product ${saved.name} updated`, 'Saved');
        } else {
          this.products = this.products.concat([saved]);
          this.toastr.success(`Product ${saved.name} added to your catalogue`, 'Saved');
        }
        this.cancelForm();
      },
      error: () => {
        this.saving = false;
        this.toastr.error('Product could not be saved', 'Error');
      }
    });
  }

  togglePublished(product: CatalogueProduct): void {
    if (!this.canPublish) {
      this.toastr.info('An active subscription is required to change publishing', 'Subscription required');
      this.navigateToSubscriptions.emit();
      return;
    }
    const updated = { ...product, published: !product.published };
    this.vendorDashboardService.saveCatalogueProduct(updated).subscribe({
      next: () => {
        this.products = this.products.map(p => p.id === product.id ? updated : p);
        this.toastr.success(
          `${product.name} ${updated.published ? 'published' : 'hidden'}`, 'Updated'
        );
      },
      error: () => this.toastr.error('Could not update publishing status', 'Error')
    });
  }

  trackByProductId(index: number, product: CatalogueProduct): string {
    return product.id;
  }
}
