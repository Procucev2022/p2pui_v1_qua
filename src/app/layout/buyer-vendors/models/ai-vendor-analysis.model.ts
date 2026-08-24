export interface CredentialStatus {
  verified: boolean;
  value?: string;
  verifiedDate?: string;
  source?: string;
}

export interface AiScoreBreakdown {
  financialStability: number;
  operationalScope: number;
  compliance: number;
  supplyReliability: number;
  priceScore?: number | null;
  qualityScore?: number | null;
  deliverySpeedScore?: number | null;
  pastPerformanceScore?: number | null;
}

export interface VendorDocument {
  id: string;
  name: string;
  documentType: string;
  documentNumber?: string;
  uploadDate: string;
  expiryDate?: string;
  verificationStatus: 'Verified' | 'Pending' | 'Rejected' | 'Not Uploaded';
  uploadedBy?: string;
  fileSize?: string;
  fileUrl?: string;
  isBackendRequired?: boolean;
}

export interface VendorRfqHistoryItem {
  rfqId: string;
  rfqTitle: string;
  category: string;
  date: string;
  quoteStatus: 'Submitted' | 'Won' | 'Lost' | 'Under Review' | 'Declined';
  vendorRank?: string;
  quotedAmount?: string;
  finalResult?: string;
}

export interface VendorPerformanceMetrics {
  rfqsParticipated: number;
  quotesSubmitted: number;
  quotesWon: number;
  ordersReceived: number;
  ordersCompleted: number;
  winRate: number | null;
  quoteResponseRate: number | null;
  onTimeDelivery: number | null;
  qualityScore: number | null;
  avgLeadTimeDays: number | null;
  hasHistoricalData: boolean;
}

export interface VendorAuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  actorType: 'User' | 'System' | 'AI Engine';
  previousValue?: string;
  newValue?: string;
  details?: string;
}

export interface VendorRiskAssessment {
  overallRisk: 'Low' | 'Medium' | 'High' | 'Review Required';
  complianceRisk: 'Low' | 'Medium' | 'High' | 'Review Required';
  financialRisk: 'Low' | 'Medium' | 'High' | 'Review Required';
  performanceRisk: 'Low' | 'Medium' | 'High' | 'Review Required';
  documentRisk: 'Low' | 'Medium' | 'High' | 'Review Required';
  summaryText: string;
}

export interface AiVendorAnalysisItem {
  id?: string;
  vendorCode: string;
  vendorName: string;
  searchTerm?: string;
  industry: string;
  category: string;
  subCategories: string[];
  capabilities: string[];
  credentials: {
    gstin: CredentialStatus;
    pan: CredentialStatus;
    companyInfo: CredentialStatus;
    contactInfo: CredentialStatus;
  };
  qualification: 'Qualified' | 'Conditional' | 'Under Review' | 'Pending' | 'Unqualified';
  aiScore: number; // e.g. 92
  scoreBreakdown: AiScoreBreakdown;
  suitableProcurementCategories: string[];
  contactInfo: {
    phone1: string;
    phone2?: string;
    email?: string;
    addressLine?: string;
    city?: string;
    district?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  typeOfBusiness?: string;
  vendorGroup?: string;
  sourcingScope: string;
  verificationStatus: string; // e.g. "100% Verified"
  complianceStatus: string;   // e.g. "Fully Compliant"
  processedAt?: string;
  status?: string; // 'Active', 'Inactive', 'Pending'
}

export interface ProcessingStep {
  id: string;
  label: string;
  description?: string;
  status: 'pending' | 'processing' | 'completed';
}

