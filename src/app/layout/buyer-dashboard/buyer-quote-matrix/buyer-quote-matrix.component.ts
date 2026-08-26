import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  poModalOpen: boolean = false;
  poApproverNotes: string = 'Approved based on AI Evaluation Matrix >94% match score & lowest compliant price.';
  poSigned: boolean = false;
  poShaSignature: string = '';

  constructor(private dashboardService: BuyerDashboardService) {}

  ngOnInit(): void {
    if (this.rfq && this.rfq.quotes && this.rfq.quotes.length > 0) {
      this.quotes = this.rfq.quotes;
    } else {
      this.loadSampleQuotes();
    }
  }

  loadSampleQuotes(): void {
    this.quotes = [
      {
        vendorId: 'v-1',
        vendorName: 'Apex Supplies Ltd.',
        vendorCategory: 'Client List',
        unitPrice: 2850,
        totalPrice: 34200,
        leadTimeDays: 18,
        aiMatchScore: 96,
        isBestPrice: true,
        isPreferred: true,
        warrantyYears: 2,
        complianceStatus: 'Fully Compliant',
        paymentTerms: 'Net 30 Days',
        remarks: 'Pre-negotiated annual roster vendor; 100% specs matched.'
      },
      {
        vendorId: 'v-2',
        vendorName: 'Kiran Valve Industries',
        vendorCategory: 'Client List',
        unitPrice: 3100,
        totalPrice: 37200,
        leadTimeDays: 21,
        aiMatchScore: 92,
        isBestPrice: false,
        isPreferred: false,
        warrantyYears: 2,
        complianceStatus: 'Fully Compliant',
        paymentTerms: 'Net 30 Days',
        remarks: 'Standard catalogue item, prompt response.'
      },
      {
        vendorId: 'v-3',
        vendorName: 'Delta Valve Systems',
        vendorCategory: 'Procucev - AI Rec',
        unitPrice: 2920,
        totalPrice: 35040,
        leadTimeDays: 14,
        aiMatchScore: 94,
        isBestPrice: false,
        isPreferred: false,
        warrantyYears: 3,
        complianceStatus: 'Fully Compliant',
        paymentTerms: 'Net 45 Days',
        remarks: 'AI Match: Proximity <250km, ISO 9001 certified.'
      }
    ];
  }

  openPoModal(quote: QuoteComparison): void {
    this.selectedQuoteForPo = quote;
    this.poSigned = false;
    this.poShaSignature = 'c7d1e3a985f621b0e49c812d4a7f55e0921bc3d49f018a7c2b53e6144f5592a1';
    this.poModalOpen = true;
  }

  closePoModal(): void {
    this.poModalOpen = false;
    this.selectedQuoteForPo = null;
  }

  confirmApprovePo(): void {
    if (!this.selectedQuoteForPo) return;
    this.poSigned = true;
    const rfqNum = this.rfq ? this.rfq.rfqNumber : 'RFQ-2026-00421';
    this.dashboardService.approvePurchaseOrder({
      rfqNumber: rfqNum,
      vendorName: this.selectedQuoteForPo.vendorName,
      totalAmount: this.selectedQuoteForPo.totalPrice,
      unitPrice: this.selectedQuoteForPo.unitPrice,
      leadTime: this.selectedQuoteForPo.leadTimeDays,
      approverNotes: this.poApproverNotes
    }).subscribe(() => {
      setTimeout(() => {
        this.closePoModal();
        this.backToCommandCenter.emit();
      }, 1200);
    });
  }
}
