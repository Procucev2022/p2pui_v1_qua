import { Component, OnInit } from '@angular/core';

export interface VendorBid {
  id: string;
  name: string;
  isAiPick?: boolean;
  totalPrice: number;
  formattedPrice: string;
  variance: string;
  varianceClass: 'variance-positive' | 'variance-negative';
  paymentTerms: string;
  freight: string;
  aiScore: string;
  techCompliance: string;
  warranty: string;
  leadTime: string;
  rating: string;
  isSelected?: boolean;
}

@Component({
  selector: 'app-buyer-quote-matrix',
  templateUrl: './buyer-quote-matrix.component.html',
  styleUrls: ['./buyer-quote-matrix.component.scss']
})
export class BuyerQuoteMatrixComponent implements OnInit {

  toastMessage: string | null = null;
  toastTimer: any;

  // RFQ Metadata
  rfqMetadata = {
    rfqNumber: 'RFQ-2026-00421',
    sourcingItem: 'Centrifugal Water Pumps (500 GPM)',
    targetBudget: '$450,000',
    quotesCount: '5 Vendors',
    status: 'IN EVALUATION'
  };

  // Top AI Pick Summary
  topAiPick = {
    vendorName: 'Apex Supplies Ltd.',
    matchPercent: '96% MATCH',
    totalBid: '$412,000',
    savings: '8.44% ($38,000 Saved)',
    leadTime: '14 Days',
    badges: ['Full Technical Compliance', 'ISO 9001 Certified', '3 Years Warranty']
  };

  // Side-by-Side Vendors
  vendors: VendorBid[] = [
    {
      id: 'v-apex',
      name: 'Apex Supplies Ltd.',
      isAiPick: true,
      totalPrice: 412000,
      formattedPrice: '$412,000',
      variance: '-$38,000 (-8.4%)',
      varianceClass: 'variance-positive',
      paymentTerms: 'Net 45 Days',
      freight: 'Included (DDP)',
      aiScore: '96% (Preferred)',
      techCompliance: '100% Compliant',
      warranty: '36 Months',
      leadTime: '14 Days',
      rating: '4.9 / 5.0',
      isSelected: true
    },
    {
      id: 'v-bharat',
      name: 'Bharat Heavy Machines',
      isAiPick: false,
      totalPrice: 428500,
      formattedPrice: '$428,500',
      variance: '-$21,500 (-4.8%)',
      varianceClass: 'variance-positive',
      paymentTerms: 'Net 30 Days',
      freight: 'Included (DDP)',
      aiScore: '88%',
      techCompliance: '95% Compliant',
      warranty: '24 Months',
      leadTime: '21 Days',
      rating: '4.6 / 5.0',
      isSelected: false
    },
    {
      id: 'v-global',
      name: 'Global Flow Systems',
      isAiPick: false,
      totalPrice: 445000,
      formattedPrice: '$445,000',
      variance: '-$5,000 (-1.1%)',
      varianceClass: 'variance-positive',
      paymentTerms: 'Net 30 Days',
      freight: 'Ex-Works',
      aiScore: '82%',
      techCompliance: '90% Compliant',
      warranty: '24 Months',
      leadTime: '25 Days',
      rating: '4.3 / 5.0',
      isSelected: false
    },
    {
      id: 'v-kirloskar',
      name: 'Kirloskar Dynamic Eng',
      isAiPick: false,
      totalPrice: 462000,
      formattedPrice: '$462,000',
      variance: '+$12,000 (+2.7%)',
      varianceClass: 'variance-negative',
      paymentTerms: 'Advance 20%',
      freight: 'Ex-Works',
      aiScore: '75%',
      techCompliance: '85% Compliant',
      warranty: '12 Months',
      leadTime: '30 Days',
      rating: '4.0 / 5.0',
      isSelected: false
    },
    {
      id: 'v-rotork',
      name: 'Rotork Valves & Pumps',
      isAiPick: false,
      totalPrice: 479000,
      formattedPrice: '$479,000',
      variance: '+$29,000 (+6.4%)',
      varianceClass: 'variance-negative',
      paymentTerms: 'Advance 30%',
      freight: 'Ex-Works',
      aiScore: '68%',
      techCompliance: '80% Compliant',
      warranty: '12 Months',
      leadTime: '45 Days',
      rating: '3.8 / 5.0',
      isSelected: false
    }
  ];

  ngOnInit(): void {}

  selectVendor(vendor: VendorBid): void {
    this.vendors.forEach(v => v.isSelected = (v.id === vendor.id));
    this.showToast(`Selected ${vendor.name} (${vendor.formattedPrice}) for award.`);
  }

  acceptAiPick(): void {
    this.showToast('Accepted AI Pick (Apex Supplies Ltd.). Autonomous PO Generated!');
  }

  onCounterOffer(): void {
    this.showToast('Initiated WhatsApp AI Bot Counter-Offer workflow with Apex Supplies Ltd.');
  }

  exportPdf(): void {
    this.showToast('Exporting Side-by-Side Comparison PDF report...');
  }

  downloadExcel(): void {
    this.showToast('Downloading Line-Item Evaluation Excel workbook...');
  }

  awardSelectedVendor(): void {
    const selected = this.vendors.find(v => v.isSelected) || this.vendors[0];
    this.showToast(`Awarding Purchase Order to ${selected.name} for ${selected.formattedPrice}.`);
  }

  private showToast(msg: string): void {
    this.toastMessage = msg;
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastTimer = setTimeout(() => {
      this.toastMessage = null;
    }, 3500);
  }
}
