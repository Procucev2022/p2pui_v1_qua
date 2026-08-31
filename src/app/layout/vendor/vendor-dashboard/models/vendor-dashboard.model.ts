export type VendorSubscriptionPlan = 'premium' | 'connect' | 'select';

export type ModuleId = 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6';

export interface VendorProfileSummary {
  vendorName: string;
  vendorCode: string;
  primaryCategory: string;
  rating: number;
  verified: boolean;
  activeBids: number;
  awardedPos: number;
  /** Display name of the active plan. */
  subscription: string;
  /** Id of the active plan, matched against the plan cards. */
  subscriptionPlanId: string;
  /** RFQ download bundle size from the active plan; 0 means direct invitations only. */
  rfqQuota: number;
  rfqDownloadsUsed: number;
  /** Products publishable on the active plan; 0 when catalogue listing is excluded. */
  maxCatalogueProducts: number;
}

export interface LineItemBid {
  id: string;
  description: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  leadTimeDays: number;
  uploadedDocument?: string;
  complianceDoc?: string;
  marketBandStatus: 'optimal' | 'warning' | 'high' | string;
  paymentTerms: string;
}

export interface VendorOpportunity {
  id: string;
  rfqNumber: string;
  title: string;
  buyer: string;
  buyerCompany?: string;
  buyerContact?: string;
  majorCategory?: string;
  minorCategory?: string;
  deadline: string;
  daysRemaining: number;
  type: 'direct_invitation' | 'network_marketplace' | string;
  estimatedValue?: string;
  deliveryLocation: string;
  status: 'pending_bid' | 'submitted' | 'under_review' | string;
  lineItems: LineItemBid[];
}

export interface CatalogueProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  specs?: string;
  moq: number;
  unit: string;
  unitPrice: number;
  leadTimeDays: number;
  published: boolean;
}

export interface QualificationOption {
  label: string;
  value: number;
}

export interface QualificationQuestion {
  refId: string;
  moduleId: ModuleId;
  moduleName: string;
  criteria: string;
  attachmentName: string;
  attachmentVerified: boolean;
  score: number;
  weightedScore: number;
  maxWeight: number;
  remarks: string;
  options: QualificationOption[];
}

export interface QualificationModule {
  id: ModuleId;
  code: string;
  name: string;
  weight: number;
  colorClass: string;
}

export interface ModuleScore {
  score: number;
  maxScore: number;
  weight: number;
  weightedScore: number;
  remarks?: string;
}

export interface VendorEvaluationResult {
  id: string;
  vendorName: string;
  category: string;
  submissionDate: string;
  status: string;
  overallScore: number;
  moduleScores: Record<string, ModuleScore>;
  systemAction: string;
  questionBreakdown: QualificationQuestion[];
}

export interface VendorSubscriptionPlanDetail {
  id: string;
  name: string;
  subtext: string;
  price: string;
  billing: string;
  description: string;
  badge: string;
  quota: number;
  features: string[];
  limitations: string[];
  /** False when the plan is not yet launched and cannot be purchased. */
  available: boolean;
  /** Tax or convenience-charge qualifier taken from the plan name. */
  priceNote: string;
  /** Products publishable on this plan; 0 when catalogue listing is excluded. */
  maxCatalogueProducts: number;
}
