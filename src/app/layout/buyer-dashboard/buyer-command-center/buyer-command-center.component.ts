import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface KpiStat {
  id: string;
  title: string;
  value: string;
  trend: string;
  trendType: 'positive' | 'info' | 'highlight' | 'saved';
  bottomText: string;
  iconClass: string;
  iconBgClass: string;
  cardVariant?: 'default' | 'green-highlight' | 'purple-highlight';
}

export interface ProcurementPipelineEvent {
  rfqNumber: string;
  matchScore: string | null;
  productName: string;
  category: string;
  sourcingMode: string;
  sourcingModeClass: string;
  quotesCount: number;
  status: 'IN EVALUATION' | 'AI RECOMMENDED' | 'OCR PARSING';
  statusClass: string;
  actionLabel: string;
  actionType: 'matrix' | 'recommended' | 'validation';
  isHighlighted?: boolean;
}

export interface AiFeedEvent {
  id: string;
  channel: 'calls' | 'wa' | 'sms' | 'system';
  iconType: 'green-dot' | 'ai-sparkle' | 'document-mail' | 'phone-call' | 'sms-msg';
  title: string;
  time: string;
  description: string;
  target?: string | null;
}

export interface FeedTabItem {
  id: 'all' | 'calls' | 'wa' | 'sms' | 'system';
  label: string;
  count?: number;
  icon?: string;
}

@Component({
  selector: 'app-buyer-command-center',
  templateUrl: './buyer-command-center.component.html',
  styleUrls: ['./buyer-command-center.component.scss']
})
export class BuyerCommandCenterComponent implements OnInit {

  // Header Actions notification
  feedbackMessage: string | null = null;
  feedbackTimer: any;

  // KPI Statistics
  kpiStats: KpiStat[] = [
    {
      id: 'active-rfqs',
      title: 'ACTIVE RFQs',
      value: '5',
      trend: '↗ +3 this week',
      trendType: 'positive',
      bottomText: '4 Sourcing categories active',
      iconClass: 'fa fa-file-text-o',
      iconBgClass: 'icon-bg-purple',
      cardVariant: 'default'
    },
    {
      id: 'pending-quotes',
      title: 'PENDING QUOTES',
      value: '40',
      trend: '8 in review',
      trendType: 'info',
      bottomText: 'Across 18 invited vendors',
      iconClass: 'fa fa-clock-o',
      iconBgClass: 'icon-bg-blue',
      cardVariant: 'default'
    },
    {
      id: 'ai-followups',
      title: 'AI FOLLOW-UPS TODAY',
      value: '12',
      trend: '92% Responded',
      trendType: 'highlight',
      bottomText: 'WhatsApp & Email Auto-Chasers',
      iconClass: 'fa fa-android',
      iconBgClass: 'icon-bg-green',
      cardVariant: 'green-highlight'
    },
    {
      id: 'total-spend',
      title: 'TOTAL SPEND (YTD)',
      value: '$1.24M',
      trend: '$184k Saved',
      trendType: 'saved',
      bottomText: 'Aggregated from Azure SQL Master',
      iconClass: 'fa fa-dollar',
      iconBgClass: 'icon-bg-magenta',
      cardVariant: 'purple-highlight'
    }
  ];

  // Active Procurement Pipeline Events
  pipelineEvents: ProcurementPipelineEvent[] = [
    {
      rfqNumber: 'RFQ-2026-00421',
      matchScore: '94% Match',
      productName: 'Centrifugal Water Pumps (500 GPM)',
      category: 'Mechanical / Fluid Dynamics',
      sourcingMode: 'Version 2',
      sourcingModeClass: 'mode-badge-v2',
      quotesCount: 5,
      status: 'IN EVALUATION',
      statusClass: 'status-eval',
      actionLabel: 'View Matrix →',
      actionType: 'matrix',
      isHighlighted: false
    },
    {
      rfqNumber: 'RFQ-2026-00420',
      matchScore: '86% Match',
      productName: 'HVAC Microprocessor Control Units',
      category: 'Building Automation & HVAC',
      sourcingMode: 'Version 1',
      sourcingModeClass: 'mode-badge-v1',
      quotesCount: 3,
      status: 'IN EVALUATION',
      statusClass: 'status-eval',
      actionLabel: 'View Matrix →',
      actionType: 'matrix',
      isHighlighted: false
    },
    {
      rfqNumber: 'RFQ-2026-00418',
      matchScore: '96% Match',
      productName: 'LV Electrical Switchgear & Control Panels',
      category: 'Electrical Infrastructure',
      sourcingMode: 'Version 3',
      sourcingModeClass: 'mode-badge-v3',
      quotesCount: 8,
      status: 'AI RECOMMENDED',
      statusClass: 'status-recommended',
      actionLabel: 'AI Recommended',
      actionType: 'recommended',
      isHighlighted: true
    },
    {
      rfqNumber: 'RFQ-2026-00425',
      matchScore: null,
      productName: 'High Pressure Cryogenic Valves',
      category: 'Specialized Valves',
      sourcingMode: 'Version 2',
      sourcingModeClass: 'mode-badge-v2',
      quotesCount: 0,
      status: 'OCR PARSING',
      statusClass: 'status-ocr',
      actionLabel: 'In Validation',
      actionType: 'validation',
      isHighlighted: false
    },
    {
      rfqNumber: 'RFQ-2026-00426',
      matchScore: null,
      productName: 'Seamless Carbon Steel Heavy Wall Pipes',
      category: 'Piping & Structural',
      sourcingMode: 'Version 1',
      sourcingModeClass: 'mode-badge-v1',
      quotesCount: 0,
      status: 'OCR PARSING',
      statusClass: 'status-ocr',
      actionLabel: 'In Validation',
      actionType: 'validation',
      isHighlighted: false
    }
  ];

  // AI Bot Feed Filter Tabs
  selectedFeedTab: 'all' | 'calls' | 'wa' | 'sms' | 'system' = 'all';

  feedTabs: FeedTabItem[] = [
    { id: 'all', label: 'All (9)', icon: '' },
    { id: 'calls', label: 'Calls', icon: 'fa fa-phone' },
    { id: 'wa', label: 'WA', icon: 'fa fa-comment-o' },
    { id: 'sms', label: 'SMS', icon: 'fa fa-mobile' },
    { id: 'system', label: 'System', icon: '' }
  ];

  // AI Bot Live Feed Activity Events
  aiFeedEvents: AiFeedEvent[] = [
    {
      id: 'feed-1',
      channel: 'wa',
      iconType: 'green-dot',
      title: 'WhatsApp Follow-Up Dispatched',
      time: '11:20 AM',
      description: 'Automated WhatsApp reminder sent to Apex Supplies Ltd. for RFQ-2026-00421. Status: Read by vendor.',
      target: 'Target: Apex Supplies Ltd. (+91 98201 44820)'
    },
    {
      id: 'feed-2',
      channel: 'system',
      iconType: 'ai-sparkle',
      title: 'Autonomous AI Scoring Completed',
      time: '10:45 AM',
      description: 'AI Evaluation Matrix synthesized 8 vendor line-item bids for RFQ-2026-00418. Match score calculated at 96% for preferred supplier.',
      target: null
    },
    {
      id: 'feed-3',
      channel: 'calls',
      iconType: 'phone-call',
      title: 'Autonomous Voice Call Follow-Up',
      time: '10:10 AM',
      description: 'Voice AI Agent completed 2-min confirmation call with Kirloskar Dynamic Eng. Vendor confirmed delivery SLA within 30 days.',
      target: 'Target: Kirloskar Eng (+91 22 6678 1200)'
    },
    {
      id: 'feed-4',
      channel: 'sms',
      iconType: 'sms-msg',
      title: 'Urgent Quote Submission SMS',
      time: '09:45 AM',
      description: 'Dispatched automated SMS alert with one-click bid link to Global Flow Systems for pending BOQ items.',
      target: 'Target: Global Flow (+91 98334 11290)'
    },
    {
      id: 'feed-5',
      channel: 'system',
      iconType: 'document-mail',
      title: 'BOQ Document Ingestion via Email',
      time: '09:15 AM',
      description: 'Ingested raw Excel BOQ attachment received via client@procucev.com. OCR parsed 2 line-item entities with 98.4% confidence.',
      target: 'Target: client@procucev.com'
    },
    {
      id: 'feed-6',
      channel: 'wa',
      iconType: 'green-dot',
      title: 'Bid Submitted via WhatsApp Bot Link',
      time: '08:40 AM',
      description: 'Apex Supplies Ltd. submitted quotation for RFQ-2026-00421 via WhatsApp conversation agent with complete line-item breakdown.',
      target: 'Target: Apex Supplies Ltd.'
    },
    {
      id: 'feed-7',
      channel: 'calls',
      iconType: 'phone-call',
      title: 'Inbound Callback Processed',
      time: '08:15 AM',
      description: 'Bharat Heavy Machines called AI Support hotline to clarify technical specs for Centrifugal Water Pumps.',
      target: 'Target: Bharat Heavy (+91 98450 33211)'
    },
    {
      id: 'feed-8',
      channel: 'sms',
      iconType: 'sms-msg',
      title: 'RFQ Award Notification SMS',
      time: '07:50 AM',
      description: 'Confirmation SMS sent to procurement team regarding PO approval threshold.',
      target: 'Target: Internal Audit'
    },
    {
      id: 'feed-9',
      channel: 'system',
      iconType: 'ai-sparkle',
      title: 'Daily Auto-Chasing Pool Synchronized',
      time: '07:00 AM',
      description: 'QUA AI engine analyzed 18 invited suppliers and queued autonomous multi-channel chasing triggers.',
      target: 'Target: 18 Active Suppliers'
    }
  ];

  get filteredFeedEvents(): AiFeedEvent[] {
    if (this.selectedFeedTab === 'all') {
      return this.aiFeedEvents;
    }
    return this.aiFeedEvents.filter(e => e.channel === this.selectedFeedTab);
  }

  selectFeedTab(tabId: 'all' | 'calls' | 'wa' | 'sms' | 'system'): void {
    this.selectedFeedTab = tabId;
  }

  constructor(private router: Router) {}

  ngOnInit(): void {}

  // Action Handlers
  onCreateRfq(): void {
    this.showFeedback('Initiating Create New RFQ flow (Screen 1.2: AI Ingestion Wizard)...');
    setTimeout(() => {
      this.router.navigateByUrl('/buyer-dashboard/ai-ingestion-wizard');
    }, 600);
  }

  onUploadBoq(): void {
    this.showFeedback('Opening BOQ Document Ingestion wizard (Screen 1.2)...');
    setTimeout(() => {
      this.router.navigateByUrl('/buyer-dashboard/ai-ingestion-wizard');
    }, 600);
  }

  onExportAnalytics(): void {
    this.showFeedback('Generating Analytics Export package...');
  }

  onViewMatrix(event: ProcurementPipelineEvent): void {
    this.showFeedback(`Navigating to Evaluation Matrix for ${event.rfqNumber}...`);
    setTimeout(() => {
      this.router.navigateByUrl('/buyer-dashboard/quote-evaluation-matrix');
    }, 600);
  }

  onAiRecommended(event: ProcurementPipelineEvent): void {
    this.showFeedback(`Opening AI Recommendation Details for ${event.rfqNumber}...`);
    setTimeout(() => {
      this.router.navigateByUrl('/buyer-dashboard/quote-evaluation-matrix');
    }, 600);
  }

  onActionClick(event: ProcurementPipelineEvent): void {
    if (event.actionType === 'matrix') {
      this.onViewMatrix(event);
    } else if (event.actionType === 'recommended') {
      this.onAiRecommended(event);
    } else {
      this.showFeedback(`${event.rfqNumber} is currently in OCR Parsing validation.`);
    }
  }

  private showFeedback(message: string): void {
    this.feedbackMessage = message;
    if (this.feedbackTimer) {
      clearTimeout(this.feedbackTimer);
    }
    this.feedbackTimer = setTimeout(() => {
      this.feedbackMessage = null;
    }, 3500);
  }
}
