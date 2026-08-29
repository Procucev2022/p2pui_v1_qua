import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { VendorDashboardService } from '../services/vendor-dashboard.service';
import {
  CatalogueProduct,
  VendorOpportunity,
  VendorProfileSummary
} from '../models/vendor-dashboard.model';

interface FeedFilters {
  buyerCompany: string;
  buyerName: string;
  majorCategory: string;
  minorCategory: string;
  searchTerm: string;
  catalogueOnly: boolean;
}

@Component({
  selector: 'app-vendor-opportunity-feed',
  templateUrl: './vendor-opportunity-feed.component.html',
  styleUrls: ['./vendor-opportunity-feed.component.scss']
})
export class VendorOpportunityFeedComponent implements OnInit {

  @Input() profile: VendorProfileSummary | null = null;
  @Output() navigateToBidForm = new EventEmitter<VendorOpportunity>();
  @Output() navigateToSubscriptions = new EventEmitter<void>();

  opportunities: VendorOpportunity[] = [];
  catalogue: CatalogueProduct[] = [];
  loading = true;

  directFilters: FeedFilters = {
    buyerCompany: 'all',
    buyerName: 'all',
    majorCategory: 'all',
    minorCategory: 'all',
    searchTerm: '',
    catalogueOnly: false
  };

  networkFilters: FeedFilters = {
    buyerCompany: 'all',
    buyerName: 'all',
    majorCategory: 'all',
    minorCategory: 'all',
    searchTerm: '',
    catalogueOnly: false
  };

  constructor(
    private vendorDashboardService: VendorDashboardService,
    private toastr: ToastrService
  ) {}

  /** Buyer companies present in the vendor's actual invitations. */
  get eligibleCompanies(): string[] {
    const names = this.opportunities
      .map(o => o.buyerCompany)
      .filter(n => !!n) as string[];
    return names.filter((n, i) => names.indexOf(n) === i).sort();
  }

  /** Major categories derived from the vendor's actual invitations. */
  get majorCategories(): string[] {
    const values = this.opportunities
      .map(o => o.majorCategory)
      .filter(v => !!v) as string[];
    return values.filter((v, i) => values.indexOf(v) === i).sort();
  }

  ngOnInit(): void {
    this.vendorDashboardService.getCatalogue().subscribe(products => {
      this.catalogue = products || [];
    });

    this.vendorDashboardService.getOpportunities().subscribe(list => {
      this.opportunities = list || [];
      this.loading = false;
    });
  }

  /** Minor categories that actually occur under the chosen major category. */
  getMinorOptions(major: string): string[] {
    if (!major || major === 'all') { return []; }
    const values = this.opportunities
      .filter(o => o.majorCategory === major)
      .map(o => o.minorCategory)
      .filter(v => !!v) as string[];
    return values.filter((v, i) => values.indexOf(v) === i).sort();
  }

  onMajorChange(filters: FeedFilters): void {
    filters.minorCategory = 'all';
  }

  onCompanyChange(filters: FeedFilters): void {
    filters.buyerName = 'all';
  }

  getBuyerNames(company: string): string[] {
    const names = this.opportunities
      .filter(o => o.buyerCompany === company && !!o.buyerContact)
      .map(o => o.buyerContact as string);
    return names.filter((n, i) => names.indexOf(n) === i);
  }

  /** Cross-match catalogue products against RFQ text so vendors see where they can bid. */
  getCatalogueMatches(opp: VendorOpportunity): CatalogueProduct[] {
    const lineItemText = (opp.lineItems || []).map(li => li.description).join(' ');
    const rfqText = `${opp.title} ${lineItemText}`.toLowerCase();

    return this.catalogue.filter(prod => {
      const words = `${prod.name} ${prod.category} ${prod.specs || ''}`
        .toLowerCase()
        .split(/\W+/);
      return words.some(word => word.length > 3 && rfqText.indexOf(word) !== -1);
    });
  }

  /** Flags RFQs whose category matches the vendor's registered category. */
  isPrimaryCategoryMatch(opp: VendorOpportunity): boolean {
    if (!this.profile || !this.profile.primaryCategory) { return false; }
    const primary = this.profile.primaryCategory.toLowerCase();
    const minor = (opp.minorCategory || '').toLowerCase();
    const major = (opp.majorCategory || '').toLowerCase();
    if (!minor && !major) { return false; }
    return (!!minor && (primary.indexOf(minor) !== -1 || minor.indexOf(primary) !== -1))
      || (!!major && (primary.indexOf(major) !== -1 || major.indexOf(primary) !== -1));
  }

  /**
   * Direct invitations are always open. Marketplace RFQs require an active
   * paid plan that includes an RFQ download bundle.
   */
  isLocked(opp: VendorOpportunity): boolean {
    if (opp.type === 'direct_invitation') { return false; }
    return this.maxQuota <= 0;
  }

  /** RFQ download bundle size on the vendor's active plan. */
  get maxQuota(): number {
    return this.profile ? (this.profile.rfqQuota || 0) : 0;
  }

  get quotaExhausted(): boolean {
    return this.maxQuota > 0
      && !!this.profile
      && this.profile.rfqDownloadsUsed >= this.maxQuota;
  }

  private matchesFilters(opp: VendorOpportunity, filters: FeedFilters, includeBuyer: boolean): boolean {
    const company = opp.buyerCompany || '';

    if (includeBuyer) {
      if (filters.buyerCompany !== 'all' && company !== filters.buyerCompany) { return false; }
      if (filters.buyerName !== 'all' && opp.buyerContact !== filters.buyerName) { return false; }
    }

    if (filters.majorCategory !== 'all' && opp.majorCategory !== filters.majorCategory) { return false; }
    if (filters.minorCategory !== 'all' && opp.minorCategory !== filters.minorCategory) { return false; }

    const term = (filters.searchTerm || '').trim().toLowerCase();
    if (term) {
      const haystack = [
        opp.title,
        opp.rfqNumber,
        opp.deliveryLocation,
        opp.majorCategory || '',
        opp.minorCategory || '',
        (opp.lineItems || []).map(li => li.description).join(' ')
      ].join(' ').toLowerCase();
      if (haystack.indexOf(term) === -1) { return false; }
    }

    if (filters.catalogueOnly && this.getCatalogueMatches(opp).length === 0) { return false; }

    return true;
  }

  /** Primary-category matches float to the top of each list. */
  private sortByCategoryMatch(list: VendorOpportunity[]): VendorOpportunity[] {
    return list.slice().sort((a, b) => {
      const matchA = this.isPrimaryCategoryMatch(a) ? 1 : 0;
      const matchB = this.isPrimaryCategoryMatch(b) ? 1 : 0;
      return matchB - matchA;
    });
  }

  get directInvitations(): VendorOpportunity[] {
    return this.sortByCategoryMatch(
      this.opportunities.filter(o =>
        o.type === 'direct_invitation' && this.matchesFilters(o, this.directFilters, true)
      )
    );
  }

  get networkOpportunities(): VendorOpportunity[] {
    return this.sortByCategoryMatch(
      this.opportunities.filter(o =>
        o.type === 'network_marketplace' && this.matchesFilters(o, this.networkFilters, false)
      )
    );
  }

  get directCatalogueMatchCount(): number {
    return this.opportunities.filter(o =>
      o.type === 'direct_invitation' && this.getCatalogueMatches(o).length > 0
    ).length;
  }

  get networkCatalogueMatchCount(): number {
    return this.opportunities.filter(o =>
      o.type === 'network_marketplace' && this.getCatalogueMatches(o).length > 0
    ).length;
  }

  /** Closing within a day. A negative value means no deadline is recorded. */
  get urgentOpportunity(): VendorOpportunity | null {
    const urgent = this.opportunities.filter(o =>
      o.status === 'pending_bid' && o.daysRemaining >= 0 && o.daysRemaining <= 1
    );
    return urgent.length > 0 ? urgent[0] : null;
  }

  toggleCatalogueFilter(filters: FeedFilters): void {
    filters.catalogueOnly = !filters.catalogueOnly;
  }

  submitBid(opp: VendorOpportunity): void {
    if (this.isLocked(opp)) {
      this.toastr.info('An active plan is required to bid on marketplace RFQs', 'Subscription required');
      this.navigateToSubscriptions.emit();
      return;
    }
    this.navigateToBidForm.emit(opp);
  }

  downloadRfq(opp: VendorOpportunity): void {
    if (this.isLocked(opp)) {
      this.toastr.info('An active plan is required to download marketplace RFQs', 'Subscription required');
      this.navigateToSubscriptions.emit();
      return;
    }

    const consumesQuota = opp.type !== 'direct_invitation';
    if (consumesQuota && this.quotaExhausted) {
      this.toastr.warning(
        `Your download quota of ${this.maxQuota} has been used for this period`, 'Quota reached'
      );
      this.navigateToSubscriptions.emit();
      return;
    }

    this.vendorDashboardService.downloadRfqDocuments(opp.rfqNumber).subscribe({
      next: () => {
        if (consumesQuota && this.profile) {
          this.profile.rfqDownloadsUsed = this.profile.rfqDownloadsUsed + 1;
        }
        this.toastr.success(
          `Specifications and BOQ for ${opp.rfqNumber} emailed to you`, 'Sent'
        );
      },
      error: () => this.toastr.error('Could not dispatch the RFQ documents', 'Error')
    });
  }

  trackByOppId(index: number, opp: VendorOpportunity): string {
    return opp.id;
  }
}
