import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RFQItem, QuoteComparison } from '../models/buyer-dashboard.model';
import { BuyerDashboardService } from '../services/buyer-dashboard.service';

@Component({
  selector: 'app-buyer-quote-matrix',
  templateUrl: './buyer-quote-matrix.component.html',
  styleUrls: ['./buyer-quote-matrix.component.scss']
})
export class BuyerQuoteMatrixComponent implements OnInit {

  @Input() rfq: RFQItem | null = null;
  @Output() backToCommandCenter = new EventEmitter<void>();

  quotes: QuoteComparison[] = [];
  selectedQuoteForPo: QuoteComparison | null = null;
  poModalOpen = false;
  poApproverNotes = '';
  poSigned = false;
  poShaSignature = '';
  poNumber = '';
  approving = false;

  constructor(
    private dashboardService: BuyerDashboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.quotes = (this.rfq && this.rfq.quotes) ? this.rfq.quotes : [];
  }

  /** Lowest total price among received quotes. */
  get bestPriceVendorId(): string | null {
    if (this.quotes.length === 0) { return null; }
    let best = this.quotes[0];
    this.quotes.forEach(q => {
      if (q.totalPrice > 0 && (best.totalPrice <= 0 || q.totalPrice < best.totalPrice)) {
        best = q;
      }
    });
    return best.totalPrice > 0 ? best.vendorId : null;
  }

  isBestPrice(quote: QuoteComparison): boolean {
    return this.bestPriceVendorId === quote.vendorId;
  }

  openPoModal(quote: QuoteComparison): void {
    this.selectedQuoteForPo = quote;
    this.poSigned = false;
    this.poShaSignature = '';
    this.poNumber = '';
    this.poApproverNotes = '';
    this.poModalOpen = true;
  }

  closePoModal(): void {
    this.poModalOpen = false;
    this.selectedQuoteForPo = null;
  }

  confirmApprovePo(): void {
    if (!this.selectedQuoteForPo || !this.rfq) { return; }
    this.approving = true;

    this.dashboardService.approvePurchaseOrder({
      rfqNumber: this.rfq.rfqNumber,
      vendorName: this.selectedQuoteForPo.vendorName,
      totalAmount: this.selectedQuoteForPo.totalPrice,
      unitPrice: this.selectedQuoteForPo.unitPrice,
      leadTime: this.selectedQuoteForPo.leadTimeDays,
      approverNotes: this.poApproverNotes
    }).subscribe({
      next: (res: any) => {
        this.approving = false;
        const po = res && res.data ? res.data.po : null;
        if (po) {
          this.poSigned = true;
          this.poNumber = po.poNumber;
          this.poShaSignature = po.sha256Signature;
          this.toastr.success(`Purchase Order ${po.poNumber} approved`, 'Success');
        }
      },
      error: () => {
        this.approving = false;
        this.toastr.error('Failed to approve purchase order', 'Error');
      }
    });
  }
}
