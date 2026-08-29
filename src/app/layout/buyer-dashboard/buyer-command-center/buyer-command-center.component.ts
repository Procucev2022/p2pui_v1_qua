import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BuyerDashboardService } from '../services/buyer-dashboard.service';
import {
  DashboardSummary,
  RFQItem,
  AIBotFeedItem
} from '../models/buyer-dashboard.model';

@Component({
  selector: 'app-buyer-command-center',
  templateUrl: './buyer-command-center.component.html',
  styleUrls: ['./buyer-command-center.component.scss']
})
export class BuyerCommandCenterComponent implements OnInit {

  @Output() navigateToWizard = new EventEmitter<void>();
  @Output() navigateToMatrix = new EventEmitter<RFQItem>();
  @Output() navigateToSubscriptions = new EventEmitter<void>();

  summary: DashboardSummary | null = null;
  rfqs: RFQItem[] = [];
  aiFeed: AIBotFeedItem[] = [];
  filteredFeed: AIBotFeedItem[] = [];
  feedChannelFilter: string = 'all';

  // Active Procurement Pipeline Pagination
  pipelineCurrentPage: number = 1;
  pipelinePageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  // Modal States
  deepDiveModalOpen: boolean = false;
  selectedRFQForDeepDive: RFQItem | null = null;

  quickChaserModalOpen: boolean = false;
  quickChaserRfqNumber: string = '';
  quickChaserVendorName: string = '';
  quickChaserChannel: string = 'all';
  quickChaserMessage: string = '';
  isChaserSending: boolean = false;

  poModalOpen: boolean = false;
  poRfqNumber: string = '';
  poVendorName: string = '';
  poTotalAmount: number = 0;
  poUnitPrice: number = 0;
  poLeadTime: number = 0;
  poApproverNotes: string = '';
  poSigned: boolean = false;
  poShaSignature: string = '';
  poNumber: string = '';
  poApproving: boolean = false;
  loading: boolean = true;

  toastMessage: string = '';
  toastType: string = 'info';

  constructor(private dashboardService: BuyerDashboardService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.dashboardService.getSummary().subscribe(s => this.summary = s);
    this.dashboardService.getPipelineRfqs().subscribe(r => {
      this.rfqs = r || [];
      this.loading = false;
      // Adjust current page if out of bounds
      if (this.pipelineCurrentPage > this.pipelineTotalPages) {
        this.pipelineCurrentPage = Math.max(1, this.pipelineTotalPages);
      }
    });
    this.dashboardService.getLiveFeed('all').subscribe(f => {
      this.aiFeed = f || [];
      this.applyFeedFilter();
    });
  }

  // --- Pagination Helpers for Active Pipeline ---
  get paginatedRfqs(): RFQItem[] {
    const startIndex = (this.pipelineCurrentPage - 1) * this.pipelinePageSize;
    return this.rfqs.slice(startIndex, startIndex + this.pipelinePageSize);
  }

  get pipelineTotalPages(): number {
    return Math.ceil(this.rfqs.length / this.pipelinePageSize) || 1;
  }

  get pipelineStartIndex(): number {
    if (this.rfqs.length === 0) return 0;
    return (this.pipelineCurrentPage - 1) * this.pipelinePageSize + 1;
  }

  get pipelineEndIndex(): number {
    return Math.min(this.pipelineCurrentPage * this.pipelinePageSize, this.rfqs.length);
  }

  get visiblePageNumbers(): (number | string)[] {
    const total = this.pipelineTotalPages;
    const current = this.pipelineCurrentPage;
    if (total <= 7) {
      const pages: (number | string)[] = [];
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    const pages: (number | string)[] = [];
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      pages.push(current - 1);
      pages.push(current);
      pages.push(current + 1);
      pages.push('...');
      pages.push(total);
    }
    return pages;
  }

  goToPipelinePage(page: number | string): void {
    if (page === '...') return;
    const num = typeof page === 'string' ? parseInt(page, 10) : page;
    if (!isNaN(num) && num >= 1 && num <= this.pipelineTotalPages) {
      this.pipelineCurrentPage = num;
    }
  }

  onPageSizeChange(event: any): void {
    const newSize = parseInt(event.target.value, 10);
    if (!isNaN(newSize) && newSize > 0) {
      this.pipelinePageSize = newSize;
      this.pipelineCurrentPage = 1;
    }
  }

  setFeedChannel(channel: string): void {
    this.feedChannelFilter = channel;
    this.applyFeedFilter();
  }

  applyFeedFilter(): void {
    if (this.feedChannelFilter === 'all') {
      this.filteredFeed = this.aiFeed;
    } else {
      this.filteredFeed = this.aiFeed.filter(
        item => item.channel === this.feedChannelFilter || item.type === this.feedChannelFilter
      );
    }
  }

  openDeepDive(rfq: RFQItem): void {
    this.selectedRFQForDeepDive = rfq;
    this.deepDiveModalOpen = true;
  }

  closeDeepDive(): void {
    this.deepDiveModalOpen = false;
    this.selectedRFQForDeepDive = null;
  }

  openQuickChaser(rfqNumber: string, vendorName: string): void {
    this.quickChaserRfqNumber = rfqNumber;
    this.quickChaserVendorName = vendorName;
    this.quickChaserChannel = 'all';
    this.quickChaserMessage = `Dear ${vendorName}, please provide your formal bid quotation for ${rfqNumber}. Sourcing deadline approaching.`;
    this.quickChaserModalOpen = true;
  }

  closeQuickChaser(): void {
    this.quickChaserModalOpen = false;
  }

  sendChaser(): void {
    this.isChaserSending = true;
    this.dashboardService.triggerChaser({
      rfqNumber: this.quickChaserRfqNumber,
      vendorName: this.quickChaserVendorName,
      channel: this.quickChaserChannel,
      customMessage: this.quickChaserMessage
    }).subscribe(res => {
      this.isChaserSending = false;
      this.closeQuickChaser();
      this.showToast('Follow-up Dispatched', `Multi-channel reminder sent to ${this.quickChaserVendorName}`, 'success');
      this.loadData();
    });
  }

  /** Awards against the lowest-priced received quote for this RFQ. */
  openPoModal(rfq: RFQItem): void {
    const quotes = rfq.quotes || [];
    let topQuote = quotes.length > 0 ? quotes[0] : null;
    quotes.forEach(q => {
      if (topQuote && q.totalPrice > 0 && (topQuote.totalPrice <= 0 || q.totalPrice < topQuote.totalPrice)) {
        topQuote = q;
      }
    });

    if (!topQuote) {
      this.showToast('No quotes received', `No vendor quotations available for ${rfq.rfqNumber} yet.`, 'warning');
      return;
    }

    this.poRfqNumber = rfq.rfqNumber;
    this.poVendorName = topQuote.vendorName;
    this.poUnitPrice = topQuote.unitPrice;
    this.poTotalAmount = topQuote.totalPrice;
    this.poLeadTime = topQuote.leadTimeDays;
    this.poSigned = false;
    this.poShaSignature = '';
    this.poNumber = '';
    this.poApproverNotes = '';
    this.poModalOpen = true;
  }

  closePoModal(): void {
    this.poModalOpen = false;
  }

  confirmApprovePo(): void {
    this.poApproving = true;
    this.dashboardService.approvePurchaseOrder({
      rfqNumber: this.poRfqNumber,
      vendorName: this.poVendorName,
      totalAmount: this.poTotalAmount,
      unitPrice: this.poUnitPrice,
      leadTime: this.poLeadTime,
      approverNotes: this.poApproverNotes
    }).subscribe({
      next: (res: any) => {
        this.poApproving = false;
        const po = res && res.data ? res.data.po : null;
        if (po) {
          this.poSigned = true;
          this.poNumber = po.poNumber;
          this.poShaSignature = po.sha256Signature;
          this.showToast('Purchase Order Approved', `${po.poNumber} generated and signed.`, 'success');
          this.loadData();
        }
      },
      error: () => {
        this.poApproving = false;
        this.showToast('Approval failed', 'Could not approve the purchase order.', 'error');
      }
    });
  }

  getModeCode(mode: string): string {
    switch (mode) {
      case 'mode_1': return 'Version 1';
      case 'mode_2': return 'Version 2';
      case 'mode_3': return 'Version 3';
      default: return mode;
    }
  }

  getSourcingModeName(mode: string): string {
    switch (mode) {
      case 'mode_1': return 'Client Approved Pool';
      case 'mode_2': return 'Hybrid Sourced Pool';
      case 'mode_3': return 'AI Match (>80%)';
      default: return mode || 'Client Approved Pool';
    }
  }

  getSourcingModeBadgePill(mode: string): string {
    switch (mode) {
      case 'mode_1': return 'VERSION 1';
      case 'mode_2': return 'VERSION 2';
      case 'mode_3': return 'VERSION 3';
      default: return 'VERSION 1';
    }
  }

  getModeBadgeStyle(mode: string): any {
    switch (mode) {
      case 'mode_1':
        return { backgroundColor: '#07419315', color: '#074193', border: '1px solid #07419335' };
      case 'mode_2':
        return { backgroundColor: '#00dbff15', color: '#0284c7', border: '1px solid #00dbff35' };
      case 'mode_3':
        return { backgroundColor: '#ff480015', color: '#ea580c', border: '1px solid #ff480035' };
      default:
        return { backgroundColor: '#64748b15', color: '#64748b', border: '1px solid #64748b35' };
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'AI Recommended': return 'badge-emerald';
      case 'In Evaluation': return 'badge-blue';
      case 'PO Generated': return 'badge-purple';
      case 'Parsing': return 'badge-amber';
      default: return 'badge-blue';
    }
  }

  getFeedItemColorClass(item: AIBotFeedItem): string {
    if (item.type === 'call' || item.channel === 'call') return 'text-purple';
    if (item.type === 'whatsapp' || item.channel === 'whatsapp') return 'text-emerald';
    if (item.type === 'sms' || item.channel === 'sms') return 'text-sky';
    if (item.type === 'email' || item.channel === 'email') return 'text-amber';
    return 'text-indigo';
  }

  getFeedIconClass(item: AIBotFeedItem): string {
    if (item.type === 'call' || item.channel === 'call') return 'fa-phone';
    if (item.type === 'whatsapp' || item.channel === 'whatsapp') return 'fa-whatsapp';
    if (item.type === 'sms' || item.channel === 'sms') return 'fa-commenting';
    if (item.type === 'email' || item.channel === 'email') return 'fa-envelope';
    return 'fa-sparkles';
  }

  showToast(title: string, message: string, type: string = 'info'): void {
    this.toastMessage = `${title}: ${message}`;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = '';
    }, 4000);
  }
}
