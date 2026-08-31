import { QualificationQuestion } from '../models/vendor-dashboard.model';

/**
 * Mode 3 360-degree vendor qualification questionnaire.
 *
 * 24 criteria across 6 weighted modules. Each module's weight is split evenly
 * across its 4 questions, so maxWeight values sum to 100 points overall:
 *   M1 25% (6.25 x 4) · M2 15% (3.75 x 4) · M3 20% (5.00 x 4)
 *   M4 20% (5.00 x 4) · M5 10% (2.50 x 4) · M6 10% (2.50 x 4)
 *
 * A score of -1 means the criterion has not been answered yet.
 */

const M1 = 'Commercial Terms (25%)';
const M2 = 'Technical Capabilities (15%)';
const M3 = 'Quality & Warranty (20%)';
const M4 = 'Operational Delivery (20%)';
const M5 = 'Financial Stability (10%)';
const M6 = 'Governance & ESG (10%)';

export const VENDOR_QUALIFICATION_QUESTIONS: QualificationQuestion[] = [
  // ── Module 1: Commercial Terms (25%) ──
  {
    refId: 'M1-Q1', moduleId: 'M1', moduleName: M1,
    criteria: 'Commercial Payment Terms',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 6.25, remarks: '',
    options: [
      { label: 'Net 60+ Days (Optimal)', value: 5 },
      { label: 'Net 30 Days (Standard)', value: 4 },
      { label: 'Net 15 Days', value: 2 },
      { label: '100% Advance Payment', value: 0 }
    ]
  },
  {
    refId: 'M1-Q2', moduleId: 'M1', moduleName: M1,
    criteria: 'Fixed Price Contract (12 Months)',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 6.25, remarks: '',
    options: [
      { label: 'Yes — fixed for 12 months', value: 5 },
      { label: 'No — variable pricing', value: 1 }
    ]
  },
  {
    refId: 'M1-Q3', moduleId: 'M1', moduleName: M1,
    criteria: 'Inclusivity of Freight (DDP)',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 6.25, remarks: '',
    options: [
      { label: 'Full DDP / door delivery included', value: 5 },
      { label: 'FOR destination only', value: 3 },
      { label: 'Ex-works only (freight extra)', value: 1 }
    ]
  },
  {
    refId: 'M1-Q4', moduleId: 'M1', moduleName: M1,
    criteria: 'Volume Tier Discounting',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 6.25, remarks: '',
    options: [
      { label: 'More than 5% volume discount', value: 5 },
      { label: '2% - 5% volume discount', value: 3 },
      { label: 'No volume discount', value: 1 }
    ]
  },

  // ── Module 2: Technical Capabilities (15%) ──
  {
    refId: 'M2-Q1', moduleId: 'M2', moduleName: M2,
    criteria: 'BOQ Specification Compliance',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 3.75, remarks: '',
    options: [
      { label: '100% full specification compliance', value: 5 },
      { label: 'Partial compliance / deviations', value: 2 },
      { label: 'Non-compliant', value: 0 }
    ]
  },
  {
    refId: 'M2-Q2', moduleId: 'M2', moduleName: M2,
    criteria: 'Equipment Automation Level',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 3.75, remarks: '',
    options: [
      { label: 'Fully automated / robotic CNC lines', value: 5 },
      { label: 'Semi-automated lines', value: 3 },
      { label: 'Manual machining lines', value: 1 }
    ]
  },
  {
    refId: 'M2-Q3', moduleId: 'M2', moduleName: M2,
    criteria: 'In-House R&D / Testing Laboratory',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 3.75, remarks: '',
    options: [
      { label: 'Yes — with lab accreditation certificate', value: 5 },
      { label: 'No in-house laboratory', value: 1 }
    ]
  },
  {
    refId: 'M2-Q4', moduleId: 'M2', moduleName: M2,
    criteria: '24/7 Technical Support',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 3.75, remarks: '',
    options: [
      { label: '24/7 on-site engineering support', value: 5 },
      { label: 'Remote engineering support only', value: 3 },
      { label: 'No post-sales support', value: 0 }
    ]
  },

  // ── Module 3: Quality & Warranty (20%) ──
  {
    refId: 'M3-Q1', moduleId: 'M3', moduleName: M3,
    criteria: 'ISO 9001:2015 Certification',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 5.00, remarks: '',
    options: [
      { label: 'ISO 9001:2015 verified upload', value: 5 },
      { label: 'No ISO quality certification', value: 0 }
    ]
  },
  {
    refId: 'M3-Q2', moduleId: 'M3', moduleName: M3,
    criteria: 'Defect Rate (PPM History)',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 5.00, remarks: '',
    options: [
      { label: 'Under 500 PPM (Six Sigma)', value: 5 },
      { label: '500 - 1000 PPM', value: 3 },
      { label: 'Over 1000 PPM', value: 1 }
    ]
  },
  {
    refId: 'M3-Q3', moduleId: 'M3', moduleName: M3,
    criteria: 'Comprehensive Warranty Period',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 5.00, remarks: '',
    options: [
      { label: '24 months or more', value: 5 },
      { label: '12 - 23 months', value: 3 },
      { label: 'Under 12 months', value: 1 }
    ]
  },
  {
    refId: 'M3-Q4', moduleId: 'M3', moduleName: M3,
    criteria: 'Batch Traceability (RFID)',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 5.00, remarks: '',
    options: [
      { label: 'RFID batch tracing', value: 5 },
      { label: 'Manual log tracking', value: 3 },
      { label: 'No traceability', value: 0 }
    ]
  },

  // ── Module 4: Operational Delivery (20%) ──
  {
    refId: 'M4-Q1', moduleId: 'M4', moduleName: M4,
    criteria: 'Verified OTIF Rate',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 5.00, remarks: '',
    options: [
      { label: '95% or higher OTIF delivery rate', value: 5 },
      { label: '90% - 94% OTIF', value: 3 },
      { label: 'Under 90% OTIF', value: 1 }
    ]
  },
  {
    refId: 'M4-Q2', moduleId: 'M4', moduleName: M4,
    criteria: 'Manufacturing Lead Time',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 5.00, remarks: '',
    options: [
      { label: '12 days or fewer (within SLA)', value: 5 },
      { label: '13 - 15 days', value: 3 },
      { label: 'More than 15 days', value: 1 }
    ]
  },
  {
    refId: 'M4-Q3', moduleId: 'M4', moduleName: M4,
    criteria: 'Capacity Utilization Rate',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 5.00, remarks: '',
    options: [
      { label: '60% - 85% utilization (optimal headroom)', value: 5 },
      { label: '86% - 95% utilization', value: 3 },
      { label: 'Over 95% or under 60% utilization', value: 1 }
    ]
  },
  {
    refId: 'M4-Q4', moduleId: 'M4', moduleName: M4,
    criteria: 'Disaster Recovery (BCP)',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 5.00, remarks: '',
    options: [
      { label: 'Active tested BCP plan', value: 5 },
      { label: 'No active BCP plan', value: 0 }
    ]
  },

  // ── Module 5: Financial Stability (10%) ──
  {
    refId: 'M5-Q1', moduleId: 'M5', moduleName: M5,
    criteria: 'Annual Financial Turnover',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 2.50, remarks: '',
    options: [
      { label: '3x contract value or higher', value: 5 },
      { label: '1.5x - 3x contract value', value: 3 },
      { label: 'Under 1.5x contract value', value: 0 }
    ]
  },
  {
    refId: 'M5-Q2', moduleId: 'M5', moduleName: M5,
    criteria: 'Credit Rating Score',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 2.50, remarks: '',
    options: [
      { label: 'Investment grade (AAA / A / BBB)', value: 5 },
      { label: 'Non-investment grade', value: 0 }
    ]
  },
  {
    refId: 'M5-Q3', moduleId: 'M5', moduleName: M5,
    criteria: 'Current Liquidity Ratio',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 2.50, remarks: '',
    options: [
      { label: 'Current ratio 1.5 or higher', value: 5 },
      { label: 'Current ratio under 1.5', value: 2 }
    ]
  },
  {
    refId: 'M5-Q4', moduleId: 'M5', moduleName: M5,
    criteria: 'Active Litigation Claims',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 2.50, remarks: '',
    options: [
      { label: 'No active litigation claims', value: 5 },
      { label: 'Active litigation claims', value: 0 }
    ]
  },

  // ── Module 6: Governance & ESG (10%) ──
  {
    refId: 'M6-Q1', moduleId: 'M6', moduleName: M6,
    criteria: 'Statutory KYC & Tax Uploads',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 2.50, remarks: '',
    options: [
      { label: 'GSTIN, PAN & statutory compliance verified', value: 5 },
      { label: 'Pending verification', value: 0 }
    ]
  },
  {
    refId: 'M6-Q2', moduleId: 'M6', moduleName: M6,
    criteria: 'ISO 14001 / ISO 45001 Certificates',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 2.50, remarks: '',
    options: [
      { label: 'Both ISO 14001 and ISO 45001', value: 5 },
      { label: 'Single certificate only', value: 3 },
      { label: 'No certifications', value: 0 }
    ]
  },
  {
    refId: 'M6-Q3', moduleId: 'M6', moduleName: M6,
    criteria: 'Anti-Bribery & Ethics Policy',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 2.50, remarks: '',
    options: [
      { label: 'Signed code of conduct & ethics policy', value: 5 },
      { label: 'Pending code signing', value: 0 }
    ]
  },
  {
    refId: 'M6-Q4', moduleId: 'M6', moduleName: M6,
    criteria: 'ISO 27001 / GDPR Privacy Framework',
    attachmentName: '', attachmentVerified: false,
    score: -1, weightedScore: 0, maxWeight: 2.50, remarks: '',
    options: [
      { label: 'ISO 27001 certified', value: 5 },
      { label: 'GDPR compliance only', value: 3 },
      { label: 'No active privacy framework', value: 0 }
    ]
  }
];
