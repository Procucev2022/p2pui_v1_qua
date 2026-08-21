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
  qualification: 'Qualified' | 'Conditional' | 'Under Review';
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
}

export interface ProcessingStep {
  id: string;
  label: string;
  description?: string;
  status: 'pending' | 'processing' | 'completed';
}
