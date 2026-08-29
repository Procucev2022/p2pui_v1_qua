import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { VendorDashboardService } from '../services/vendor-dashboard.service';
import { LineItemBid, VendorOpportunity } from '../models/vendor-dashboard.model';

@Component({
  selector: 'app-vendor-quotations',
  templateUrl: './vendor-quotations.component.html',
  styleUrls: ['./vendor-quotations.component.scss']
})
export class VendorQuotationsComponent implements OnInit {

  @Input() opportunity: VendorOpportunity | null = null;
  @Output() back = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  lineItems: LineItemBid[] = [];
  paymentTermsOptions: string[] = [
    'Net 15 Days',
    'Net 30 Days',
    'Net 45 Days',
    'Net 60 Days',
    '50% Advance / 50% On Delivery'
  ];

  /** Benchmarks captured when the form loads, used to flag out-of-band pricing. */
  private benchmarkPrices: { [lineItemId: string]: number } = {};

  overallRemarks = '';
  submitting = false;
  submittedSuccessfully = false;
  quotationId = '';

  constructor(
    private vendorDashboardService: VendorDashboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.opportunity && this.opportunity.lineItems) {
      this.lineItems = this.opportunity.lineItems.map(li => ({ ...li }));
      this.lineItems.forEach(li => {
        this.benchmarkPrices[li.id] = li.unitPrice;
      });
    }
  }

  getLineTotal(item: LineItemBid): number {
    const price = Number(item.unitPrice) || 0;
    const qty = Number(item.quantity) || 0;
    return price * qty;
  }

  get grandTotal(): number {
    return this.lineItems.reduce((acc, li) => acc + this.getLineTotal(li), 0);
  }

  get maxLeadTime(): number {
    if (this.lineItems.length === 0) { return 0; }
    return this.lineItems.reduce((max, li) => Math.max(max, Number(li.leadTimeDays) || 0), 0);
  }

  /**
   * Compares the quoted price against the benchmark captured on load.
   * Within 5% is optimal, up to 15% is a warning, beyond that is high.
   */
  getMarketBand(item: LineItemBid): 'optimal' | 'warning' | 'high' {
    const benchmark = this.benchmarkPrices[item.id];
    const price = Number(item.unitPrice) || 0;
    if (!benchmark || benchmark <= 0) { return 'optimal'; }

    const variance = ((price - benchmark) / benchmark) * 100;
    if (variance <= 5) { return 'optimal'; }
    if (variance <= 15) { return 'warning'; }
    return 'high';
  }

  getMarketBandLabel(item: LineItemBid): string {
    const band = this.getMarketBand(item);
    if (band === 'optimal') { return 'Within optimal market band'; }
    if (band === 'warning') { return 'Slightly above market band'; }
    return 'Significantly above market band';
  }

  getVariancePercent(item: LineItemBid): number {
    const benchmark = this.benchmarkPrices[item.id];
    const price = Number(item.unitPrice) || 0;
    if (!benchmark || benchmark <= 0) { return 0; }
    return Math.round(((price - benchmark) / benchmark) * 1000) / 10;
  }

  onDocumentSelected(item: LineItemBid, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      item.uploadedDocument = input.files[0].name;
    }
  }

  onComplianceSelected(item: LineItemBid, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      item.complianceDoc = input.files[0].name;
    }
  }

  get isValid(): boolean {
    if (this.lineItems.length === 0) { return false; }
    return this.lineItems.every(li =>
      Number(li.unitPrice) > 0 &&
      Number(li.leadTimeDays) > 0 &&
      !!li.paymentTerms
    );
  }

  submit(): void {
    if (!this.isValid || !this.opportunity) { return; }
    this.submitting = true;

    const payload = {
      rfqNumber: this.opportunity.rfqNumber,
      totalAmount: this.grandTotal,
      maxLeadTimeDays: this.maxLeadTime,
      remarks: this.overallRemarks,
      lineItems: this.lineItems.map(li => ({
        id: li.id,
        description: li.description,
        quantity: li.quantity,
        unitPrice: li.unitPrice,
        lineTotal: this.getLineTotal(li),
        leadTimeDays: li.leadTimeDays,
        paymentTerms: li.paymentTerms,
        uploadedDocument: li.uploadedDocument,
        complianceDoc: li.complianceDoc,
        marketBandStatus: this.getMarketBand(li)
      }))
    };

    this.vendorDashboardService.submitQuotation(payload).subscribe({
      next: (res: any) => {
        this.submitting = false;
        const quotation = res && res.data ? res.data.quotation : null;
        this.submittedSuccessfully = true;
        this.quotationId = quotation ? quotation.quotationId : '';
        this.toastr.success(
          `Quotation submitted for ${payload.rfqNumber}`, 'Success'
        );
        this.submitted.emit();
      },
      error: () => {
        this.submitting = false;
        this.toastr.error('Could not submit your quotation', 'Error');
      }
    });
  }

  trackByItemId(index: number, item: LineItemBid): string {
    return item.id;
  }
}
