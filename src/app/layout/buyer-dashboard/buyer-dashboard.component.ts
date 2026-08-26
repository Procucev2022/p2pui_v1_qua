import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RFQItem } from './models/buyer-dashboard.model';

export interface BuyerScreenCard {
  id: string;
  screenNum: string;
  title: string;
  subtitle: string;
  icon: string;
  colorClass: string;
}

@Component({
  selector: 'app-buyer-dashboard',
  templateUrl: './buyer-dashboard.component.html',
  styleUrls: ['./buyer-dashboard.component.scss']
})
export class BuyerDashboardComponent implements OnInit {

  activeTab: string = 'command-center';
  selectedRfqForMatrix: RFQItem | null = null;

  screens: BuyerScreenCard[] = [
    {
      id: 'command-center',
      screenNum: 'Screen 1.1',
      title: 'Command Center',
      subtitle: 'Pipeline & Live Chasers',
      icon: 'fa fa-th-large',
      colorClass: 'screen-blue'
    },
    {
      id: 'ingestion-wizard',
      screenNum: 'Screen 1.2',
      title: 'Ingestion Wizard',
      subtitle: 'AI BOQ & Sourcing Modes',
      icon: 'fa fa-magic',
      colorClass: 'screen-indigo'
    },
    {
      id: 'vendor-eval',
      screenNum: 'Screen 1.3',
      title: '360° Evaluation',
      subtitle: 'Mode 3 Audit Scorecard',
      icon: 'fa fa-check-square-o',
      colorClass: 'screen-emerald'
    },
    {
      id: 'vendor-directory',
      screenNum: 'Screen 1.4',
      title: 'Vendor Directory',
      subtitle: 'Master Supplier Roster',
      icon: 'fa fa-building-o',
      colorClass: 'screen-cyan'
    },
    {
      id: 'subscriptions',
      screenNum: 'Screen 1.5',
      title: 'Subscriptions',
      subtitle: 'Sourcing Plans & Quota',
      icon: 'fa fa-credit-card',
      colorClass: 'screen-purple'
    },
    {
      id: 'buyer-profile',
      screenNum: 'Screen 1.6',
      title: 'Buyer Profile',
      subtitle: 'Credentials & Scope',
      icon: 'fa fa-user-circle',
      colorClass: 'screen-orange'
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  navigateToWizard(): void {
    this.activeTab = 'ingestion-wizard';
  }

  navigateToMatrix(rfq?: RFQItem): void {
    if (rfq) {
      this.selectedRfqForMatrix = rfq;
    }
    this.activeTab = 'quote-matrix';
  }

  navigateToSubscriptions(): void {
    this.activeTab = 'subscriptions';
  }
}
