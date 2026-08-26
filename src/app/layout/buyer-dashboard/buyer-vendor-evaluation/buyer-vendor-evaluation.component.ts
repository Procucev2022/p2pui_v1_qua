import { Component, OnInit } from '@angular/core';

interface QuestionEvaluationItem {
  id: string;
  pillar: string;
  question: string;
  score: number;
  maxScore: number;
  answer: string;
  status: 'Compliant' | 'Partial' | 'Non-Compliant';
  evidenceDoc?: string;
  verifiedByAi: boolean;
  confidence: number;
}

@Component({
  selector: 'app-buyer-vendor-evaluation',
  templateUrl: './buyer-vendor-evaluation.component.html',
  styleUrls: ['./buyer-vendor-evaluation.component.scss']
})
export class BuyerVendorEvaluationComponent implements OnInit {

  vendorName: string = 'Apex Supplies Ltd.';
  vendorCode: string = 'VN-APEX-4920';
  category: string = 'Heavy Mechanical & Fluid Dynamics';
  location: string = 'Navi Mumbai, MH';
  gstin: string = '27AABCA1234F1Z5';
  cin: string = 'U29100MH2010PTC204821';
  overallScore: number = 95;
  selectedPillarFilter: string = 'ALL';

  showOverrideModal: boolean = false;
  newScoreInput: number = 95;

  showCapaModal: boolean = false;
  capaNotes: string = 'Implement 24/7 automated calibration sensors by Q4 2026.';

  toastMessage: string = '';

  pillars = [
    { id: 'p-1', name: 'General & Financial Stability', score: 96.5, weight: '25%' },
    { id: 'p-2', name: 'Technical & Manufacturing Capability', score: 94.0, weight: '35%' },
    { id: 'p-3', name: 'Quality Assurance & Certifications', score: 95.0, weight: '25%' },
    { id: 'p-4', name: 'ESG & Statutory Compliance', score: 92.5, weight: '15%' }
  ];

  questionItems: QuestionEvaluationItem[] = [
    {
      id: 'q-1',
      pillar: 'General & Financial Stability',
      question: 'D&B Financial Rating & 3-year turnover audit',
      score: 10,
      maxScore: 10,
      answer: 'Turnover > $25M USD with Crisil Rating 1A2 (Low Risk). Zero default filings.',
      status: 'Compliant',
      evidenceDoc: 'Audited_Financial_Statement_2025.pdf',
      verifiedByAi: true,
      confidence: 99.2
    },
    {
      id: 'q-2',
      pillar: 'Technical & Manufacturing Capability',
      question: 'CNC Machining, Hydrostatic Test Bed (up to 300 Bar)',
      score: 9.5,
      maxScore: 10,
      answer: '5-Axis Mazak CNC machines and computerized valve test bed fully commissioned.',
      status: 'Compliant',
      evidenceDoc: 'Plant_Machinery_Layout_Calibration.pdf',
      verifiedByAi: true,
      confidence: 98.0
    },
    {
      id: 'q-3',
      pillar: 'Quality Assurance & Certifications',
      question: 'ISO 9001:2015, ASME Sec VIII, API 6D Certification Validity',
      score: 9.8,
      maxScore: 10,
      answer: 'All certificates valid until Dec 2027 by TUV Nord & Lloyd\'s Register.',
      status: 'Compliant',
      evidenceDoc: 'ISO_9001_ASME_Certificates.pdf',
      verifiedByAi: true,
      confidence: 99.5
    },
    {
      id: 'q-4',
      pillar: 'ESG & Statutory Compliance',
      question: 'Zero Effluent Discharge & Occupational Health Policy',
      score: 9.2,
      maxScore: 10,
      answer: 'RO-based ETP operational. ISO 45001 safety audit passed with zero fatalities.',
      status: 'Compliant',
      evidenceDoc: 'ESG_Compliance_Audit_2025.pdf',
      verifiedByAi: true,
      confidence: 96.0
    }
  ];

  filteredQuestions: QuestionEvaluationItem[] = [];

  constructor() {}

  ngOnInit(): void {
    this.applyPillarFilter();
  }

  setPillarFilter(pillar: string): void {
    this.selectedPillarFilter = pillar;
    this.applyPillarFilter();
  }

  applyPillarFilter(): void {
    if (this.selectedPillarFilter === 'ALL') {
      this.filteredQuestions = this.questionItems;
    } else {
      this.filteredQuestions = this.questionItems.filter(q => q.pillar.includes(this.selectedPillarFilter));
    }
  }

  applyOverride(): void {
    this.overallScore = this.newScoreInput;
    this.showOverrideModal = false;
    this.showToast(`Mode 3 Score overridden to ${this.newScoreInput}%. Audit log updated.`);
  }

  saveCapa(): void {
    this.showCapaModal = false;
    this.showToast('CAPA Corrective Action Notice dispatched to vendor portal.');
  }

  showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => this.toastMessage = '', 3500);
  }
}
