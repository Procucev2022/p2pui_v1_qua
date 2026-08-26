export type SourcingMode = 'mode_1' | 'mode_2' | 'mode_3';

export interface SourcingModeDetail {
  id: SourcingMode;
  code: string;
  name: string;
  shortLabel: string;
  description: string;
  badgeColor: string;
}

export interface ExtractedEntity {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  targetDate: string;
  technicalSpecs: string;
  confidence: number;
  category: string;
}

export interface QuoteComparison {
  vendorId: string;
  vendorName: string;
  vendorCategory: 'Client List' | 'Procucev - AI Rec' | 'Procucev Network' | string;
  unitPrice: number;
  totalPrice: number;
  leadTimeDays: number;
  aiMatchScore: number;
  isBestPrice?: boolean;
  isPreferred?: boolean;
  warrantyYears: number;
  complianceStatus: 'Fully Compliant' | 'Minor Exception' | 'Pending Review' | string;
  paymentTerms: string;
  remarks: string;
}

export interface VendorFollowUpRecord {
  vendorId: string;
  vendorName: string;
  phone: string;
  contactPerson: string;
  callStatus?: string;
  callDuration?: string;
  callLastAttempt?: string;
  whatsappStatus?: string;
  whatsappLastAttempt?: string;
  smsStatus?: string;
  emailStatus?: string;
  overallStatus: 'Responded' | 'Follow-up Active' | 'Awaiting Bid' | 'Escalated' | 'Pending' | string;
  lastInteraction: string;
  attemptsCount: number;
  bidStatus: 'Submitted' | 'In Progress' | 'Pending' | 'Declined' | string;
}

export interface RFQFollowUpBreakdown {
  rfqNumber: string;
  totalInvited: number;
  respondedCount: number;
  callStats: {
    total: number;
    connected: number;
    avgDuration: string;
  };
  whatsappStats: {
    total: number;
    read: number;
  };
  smsStats: {
    total: number;
    delivered: number;
  };
  emailStats?: {
    total: number;
  };
  vendors: VendorFollowUpRecord[];
  nextScheduledChaser?: string;
  autoChasingEnabled: boolean;
}

export interface RFQItem {
  id: string;
  rfqNumber: string;
  title: string;
  category: string;
  sourcingMode: SourcingMode;
  status: 'Parsing' | 'In Evaluation' | 'AI Recommended' | 'PO Generated' | 'Quotes Pending' | string;
  quotesCount: number;
  targetDeliveryDate: string;
  budget: number;
  createdAt: string;
  extractedEntities: ExtractedEntity[];
  quotes: QuoteComparison[];
  chasingActive: boolean;
  chaserMethod?: 'WhatsApp' | 'Email' | 'SMS' | 'Call' | 'Multi-Channel' | string;
  aiScore?: number;
  followUpData?: RFQFollowUpBreakdown;
}

export interface AIBotFeedItem {
  id: string;
  type: 'call' | 'whatsapp' | 'sms' | 'email' | 'system' | string;
  channel?: string;
  title: string;
  message: string;
  timestamp: string;
  rfqNumber?: string;
  recipient?: string;
  channelDetails?: {
    duration?: string;
  };
}

export interface DashboardSummary {
  totalActiveRFQs: number;
  totalPendingQuotes: number;
  totalSpend: string;
  totalCalls: number;
  connectedCalls: number;
  totalWhatsApp: number;
  readWhatsApp: number;
  totalSMS: number;
  totalEmails: number;
  totalFollowupsToday: number;
  activeSubscription: string;
  remainingFreeRFQs: number;
  sourcingPlanName: string;
}

export interface VendorEvaluationRecord {
  id: string;
  vendorName: string;
  category: string;
  location: string;
  overallScore: number;
  commercialScore: number;
  technicalScore: number;
  qualityScore: number;
  esgScore: number;
  riskRating: string;
  status: string;
  evaluatedDate: string;
  keyHighlights?: Record<string, string>;
}

export interface SubscriptionPlan {
  id: string;
  code: string;
  name: string;
  price: string;
  period: string;
  description: string;
  isCurrent: boolean;
  features: string[];
  remainingQuota: number;
  totalQuota: number;
}
