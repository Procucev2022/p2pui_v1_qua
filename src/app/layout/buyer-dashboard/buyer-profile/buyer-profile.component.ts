import { Component, OnInit } from '@angular/core';

interface MajorCategoryItem {
  name: string;
  minors: string[];
}

@Component({
  selector: 'app-buyer-profile',
  templateUrl: './buyer-profile.component.html',
  styleUrls: ['./buyer-profile.component.scss']
})
export class BuyerProfileComponent implements OnInit {

  companyName: string = 'Larsen & Toubro Limited';
  brandName: string = 'L&T Heavy Engineering & Construction';
  orgType: string = 'Public Limited';
  panNumber: string = 'AAACL1234F';
  gstNumber: string = '27AAACL1234F1Z5';
  cinNumber: string = 'L28920MH1946PLC004768';
  website: string = 'https://www.larsentoubro.com';
  annualTurnover: string = '₹ 1,80,000 Cr+';

  street: string = 'L&T House, Ballard Estate, N.M. Marg';
  city: string = 'Mumbai';
  state: string = 'Maharashtra';
  pincode: string = '400001';
  country: string = 'India';

  contactName: string = 'Rajesh Sharma';
  contactDesignation: string = 'Chief Procurement Officer (CPO)';
  contactEmail: string = 'buyer@procucev.com';
  contactPhone: string = '+91 98201 44820';

  categorySearch: string = '';
  toastMessage: string = '';

  categories: MajorCategoryItem[] = [
    {
      name: 'Engineering Spares - Mechanical',
      minors: ['Bearings & Accessories', 'Compressors & Accessories', 'Pipes & Pipe Fittings', 'Pumps & Accessories', 'Valves & Fittings', 'Gaskets & Seals']
    },
    {
      name: 'Engineering Spares - Electrical',
      minors: ['Cables & Wires', 'Circuit Breakers & Switchgear', 'Distribution Panels', 'DG Sets & Parts', 'Transformers & Relays']
    },
    {
      name: 'Civil Works & Infrastructure',
      minors: ['Piling Works', 'Deep Excavation', 'Waterproofing Solutions', 'PEB Pre-Engineered Structures', 'Roofing & Cladding Sheets']
    },
    {
      name: 'Information Technology & Automation',
      minors: ['Enterprise Servers', 'Industrial Networking Hardware', 'DDC Building Controllers', 'SCADA & PLC Panels', 'ERP Software Modules']
    }
  ];

  selectedMinors: Record<string, string[]> = {
    'Engineering Spares - Mechanical': ['Pumps & Accessories', 'Valves & Fittings', 'Pipes & Pipe Fittings'],
    'Engineering Spares - Electrical': ['Circuit Breakers & Switchgear', 'Cables & Wires', 'Distribution Panels'],
    'Civil Works & Infrastructure': ['PEB Pre-Engineered Structures', 'Roofing & Cladding Sheets'],
    'Information Technology & Automation': ['Enterprise Servers', 'DDC Building Controllers']
  };

  constructor() {}

  ngOnInit(): void {}

  isMinorSelected(major: string, minor: string): boolean {
    return !!(this.selectedMinors[major] && this.selectedMinors[major].includes(minor));
  }

  toggleMinor(major: string, minor: string): void {
    if (!this.selectedMinors[major]) {
      this.selectedMinors[major] = [];
    }
    const idx = this.selectedMinors[major].indexOf(minor);
    if (idx > -1) {
      this.selectedMinors[major].splice(idx, 1);
    } else {
      this.selectedMinors[major].push(minor);
    }
  }

  saveProfile(): void {
    this.showToast('Profile & Category Authorizations Updated Successfully.');
  }

  showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => this.toastMessage = '', 3500);
  }
}
