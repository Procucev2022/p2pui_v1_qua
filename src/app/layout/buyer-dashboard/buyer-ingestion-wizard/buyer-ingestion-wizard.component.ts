import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SourcingMode, ExtractedEntity } from '../models/buyer-dashboard.model';

interface VendorEntry {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  category: string;
  location: string;
  rating: number;
  source: 'manual' | 'excel';
}

@Component({
  selector: 'app-buyer-ingestion-wizard',
  templateUrl: './buyer-ingestion-wizard.component.html',
  styleUrls: ['./buyer-ingestion-wizard.component.scss']
})
export class BuyerIngestionWizardComponent implements OnInit {

  @Output() complete = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  activeStep: number = 1;
  isProcessingDoc: boolean = false;
  uploadedFileName: string = 'BOQ_Centrifugal_Pumps_HVAC_2026.xlsx';
  ingestionMethod: 'upload' | 'email' = 'upload';

  rfqTitle: string = 'Centrifugal Water Pumps & Industrial Valves Procurement';
  rfqNumber: string = `RFQ-2026-00${Math.floor(430 + Math.random() * 50)}`;
  selectedMode: SourcingMode = 'mode_2';
  budget: number = 145000;
  deliveryDate: string = '2026-09-25';

  entities: ExtractedEntity[] = [
    {
      id: 'ent-1',
      itemName: 'Centrifugal Water Pump (500 GPM)',
      quantity: 12,
      unit: 'Units',
      targetDate: '2026-09-15',
      technicalSpecs: 'Stainless Steel Impeller (SS316), 15 HP Motor, ANSI Flanged, 150 PSI',
      confidence: 98.4,
      category: 'Heavy Mechanical'
    },
    {
      id: 'ent-2',
      itemName: 'Flanged Gate Valve (4-inch Class 150)',
      quantity: 24,
      unit: 'Units',
      targetDate: '2026-09-18',
      technicalSpecs: 'ASTM A216 WCB Cast Carbon Steel Body, 150# Raised Face Flange, Rising Stem',
      confidence: 96.2,
      category: 'Flow Control'
    },
    {
      id: 'ent-3',
      itemName: 'Flexible Metal Expansion Joints 4"',
      quantity: 24,
      unit: 'Pieces',
      targetDate: '2026-09-25',
      technicalSpecs: 'SS304 Bellows, ANSI 150 Class',
      confidence: 94.8,
      category: 'Piping & Fittings'
    }
  ];

  vendors: VendorEntry[] = [
    { id: 'v-1', name: 'Apex Supplies Ltd.', contactPerson: 'Rajesh Nair', phone: '+91 98201 44820', email: 'rajesh@apexsupplies.in', category: 'Heavy Mechanical', location: 'Mumbai, MH', rating: 4.8, source: 'manual' },
    { id: 'v-2', name: 'Kiran Valve Industries', contactPerson: 'Amit Kumar', phone: '+91 97653 21098', email: 'amit@kiranvalves.com', category: 'Flow Control', location: 'Ahmedabad, GJ', rating: 4.5, source: 'manual' },
    { id: 'v-3', name: 'TechnoForce Engineering', contactPerson: 'Sunita Reddy', phone: '+91 87654 32109', email: 'sunita@technoforce.in', category: 'Electrical & Switchgear', location: 'Hyderabad, TS', rating: 4.7, source: 'manual' },
    { id: 'v-4', name: 'Precision Pumps Pvt Ltd', contactPerson: 'Vikram Shah', phone: '+91 99876 54321', email: 'vikram@precisionpumps.co.in', category: 'Heavy Mechanical', location: 'Pune, MH', rating: 4.3, source: 'manual' }
  ];

  recommendedVendors = [
    { id: 'rec-1', name: 'Delta Valve Systems', category: 'Flow Control', location: 'Pune, MH', rating: 4.8, matchScore: 96, proximity: 'Local Hub (<250km)' },
    { id: 'rec-2', name: 'ElectroMech Pumps', category: 'Heavy Mechanical', location: 'Mumbai, MH', rating: 4.6, matchScore: 93, proximity: 'Local Hub (<250km)' },
    { id: 'rec-3', name: 'Vanguard Heavy Engineering', category: 'Heavy Mechanical', location: 'Bangalore, KA', rating: 4.7, matchScore: 91, proximity: 'Regional Hub (<600km)' }
  ];

  toastMessage: string = '';

  constructor() {}

  ngOnInit(): void {}

  setStep(step: number): void {
    if (step >= 1 && step <= 4) {
      this.activeStep = step;
    }
  }

  simulateUpload(event?: any): void {
    if (event && event.target && event.target.files && event.target.files[0]) {
      this.uploadedFileName = event.target.files[0].name;
    }
    this.isProcessingDoc = true;
    setTimeout(() => {
      this.isProcessingDoc = false;
      this.activeStep = 2;
      this.showToast('AI OCR Extraction Complete: 3 Line items parsed with 96.5% confidence.');
    }, 1200);
  }

  handleAddEntity(): void {
    const newEnt: ExtractedEntity = {
      id: `ent-${Date.now()}`,
      itemName: 'New Industrial Specification Item',
      quantity: 10,
      unit: 'Units',
      targetDate: this.deliveryDate,
      technicalSpecs: 'Specify ANSI / DIN / ASTM compliance specs',
      confidence: 99.0,
      category: 'Heavy Mechanical'
    };
    this.entities.push(newEnt);
  }

  handleDeleteEntity(id: string): void {
    this.entities = this.entities.filter(e => e.id !== id);
  }

  selectMode(mode: SourcingMode): void {
    this.selectedMode = mode;
  }

  getTargetedVendors(): VendorEntry[] {
    if (this.selectedMode === 'mode_1') {
      return this.vendors;
    }
    return this.vendors;
  }

  handleDispatch(): void {
    this.showToast('RFQ Dispatched Successfully via Multi-Channel Agents!');
    setTimeout(() => {
      this.complete.emit();
    }, 800);
  }

  showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => this.toastMessage = '', 3500);
  }
}
