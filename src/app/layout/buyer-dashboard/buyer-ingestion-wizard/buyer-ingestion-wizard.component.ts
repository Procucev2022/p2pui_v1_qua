import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface ExtractedEntity {
  id: number;
  itemCode: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  confidence: string;
  status: 'Verified' | 'Needs Review';
}

export interface SourcingModeOption {
  id: string;
  version: string;
  title: string;
  badge: string;
  description: string;
  poolSize: string;
  features: string[];
  selected?: boolean;
}

@Component({
  selector: 'app-buyer-ingestion-wizard',
  templateUrl: './buyer-ingestion-wizard.component.html',
  styleUrls: ['./buyer-ingestion-wizard.component.scss']
})
export class BuyerIngestionWizardComponent implements OnInit {

  currentStep = 1;
  ingestionMode: 'upload' | 'email' = 'upload';
  selectedFileName: string | null = null;
  isDragging = false;
  isProcessing = false;
  toastMessage: string | null = null;
  toastTimer: any;

  // Step 2 Extracted Entities Sample Data
  extractedEntities: ExtractedEntity[] = [
    {
      id: 1,
      itemCode: 'PUMP-CP-500',
      description: 'Centrifugal Water Pumps (500 GPM, 150 PSI, Cast Iron)',
      category: 'Mechanical / Fluid Dynamics',
      quantity: 4,
      unit: 'Units',
      confidence: '98.6%',
      status: 'Verified'
    },
    {
      id: 2,
      itemCode: 'VALVE-CRYO-02',
      description: 'High Pressure Cryogenic Control Valves (Class 600)',
      category: 'Specialized Valves',
      quantity: 12,
      unit: 'Pieces',
      confidence: '97.2%',
      status: 'Verified'
    },
    {
      id: 3,
      itemCode: 'SWG-LV-08',
      description: 'LV Electrical Switchgear Panel & Circuit Breakers (415V)',
      category: 'Electrical Infrastructure',
      quantity: 2,
      unit: 'Sets',
      confidence: '96.4%',
      status: 'Verified'
    }
  ];

  // Step 3 Sourcing Modes
  sourcingModes: SourcingModeOption[] = [
    {
      id: 'v1',
      version: 'Version 1',
      title: 'Standard Catalog Sourcing',
      badge: 'Fast & Direct',
      description: 'Instant quoting from pre-contracted catalog items with fixed enterprise discounts.',
      poolSize: '8 Verified Vendors',
      features: ['Automated PO Issuance', 'Standard SLA 48h', 'Fixed Price Guarantee'],
      selected: false
    },
    {
      id: 'v2',
      version: 'Version 2',
      title: 'Hybrid Sourced Pool (Recommended)',
      badge: 'AI Autonomous Sourcing',
      description: 'Multi-tier autonomous bot chasing via WhatsApp, email chasers, and dynamic AI scoring matrix.',
      poolSize: '18 Invited Vendors',
      features: ['WhatsApp Auto-Chaser Bot', 'Real-Time Dynamic Matrix', 'Autonomous Compliance Scoring'],
      selected: true
    },
    {
      id: 'v3',
      version: 'Version 3',
      title: 'Global Reverse Auction & Tender',
      badge: 'High Value Capex',
      description: 'Live competitive multi-round e-auction for high volume procurement with real-time bidding.',
      poolSize: '32 Global Bidders',
      features: ['Multi-Round Live Bidding', 'Sealed Bid Governance', 'Deep Line-Item Analytics'],
      selected: false
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  setIngestionMode(mode: 'upload' | 'email'): void {
    this.ingestionMode = mode;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.handleFileSelected(file.name);
    }
  }

  onFileInputChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.handleFileSelected(file.name);
    }
  }

  handleFileSelected(fileName: string): void {
    this.selectedFileName = fileName;
    this.showToast(`Selected file: ${fileName}. Ready for AI parsing.`);
  }

  goToStep(step: number): void {
    this.currentStep = step;
  }

  parseAndReview(): void {
    this.isProcessing = true;
    this.showToast('QUA AI Engine parsing document entities with OCR...');
    setTimeout(() => {
      this.isProcessing = false;
      this.currentStep = 2;
    }, 800);
  }

  proceedToSourcingMode(): void {
    this.currentStep = 3;
    this.showToast('Entities verified. Select procurement sourcing mode.');
  }

  selectSourcingMode(mode: SourcingModeOption): void {
    this.sourcingModes.forEach(m => m.selected = (m.id === mode.id));
  }

  dispatchRfq(): void {
    const selected = this.sourcingModes.find(m => m.selected) || this.sourcingModes[1];
    this.showToast(`RFQ successfully dispatched with ${selected.title}!`);
    setTimeout(() => {
      this.router.navigateByUrl('/buyer-dashboard/quote-evaluation-matrix');
    }, 1200);
  }

  exitWizard(): void {
    this.router.navigateByUrl('/buyer-dashboard/command-center');
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
