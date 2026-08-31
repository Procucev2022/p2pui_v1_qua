import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorDashboardService } from './services/vendor-dashboard.service';
import {
  VendorOpportunity,
  VendorProfileSummary
} from './models/vendor-dashboard.model';

export interface VendorScreenCard {
  id: string;
  screenNum: string;
  title: string;
  subtitle: string;
  icon: string;
  colorClass: string;
}

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss']
})
export class VendorDashboardComponent implements OnInit {

  activeTab = 'opportunity-feed';
  profile: VendorProfileSummary | null = null;
  selectedOpportunity: VendorOpportunity | null = null;

  screens: VendorScreenCard[] = [
    {
      id: 'opportunity-feed',
      screenNum: 'Screen 3.1',
      title: 'Opportunity Feed',
      subtitle: 'Invitations & Marketplace',
      icon: 'fa fa-th-large',
      colorClass: 'screen-purple'
    },
    {
      id: 'quotation',
      screenNum: 'Screen 3.2',
      title: 'Submit Quotation',
      subtitle: 'Line-Item Bidding',
      icon: 'fa fa-paper-plane',
      colorClass: 'screen-blue'
    },
    {
      id: 'qualification',
      screenNum: 'Screen 3.3',
      title: 'Mode 3 Qualification',
      subtitle: '24-Criteria Scorecard',
      icon: 'fa fa-check-square-o',
      colorClass: 'screen-emerald'
    },
    {
      id: 'catalogue',
      screenNum: 'Screen 3.4',
      title: 'Item Catalogue',
      subtitle: 'SKUs, MOQs & Specs',
      icon: 'fa fa-cubes',
      colorClass: 'screen-indigo'
    },
    {
      id: 'subscriptions',
      screenNum: 'Screen 3.5',
      title: 'Subscriptions',
      subtitle: 'Plans & Download Quota',
      icon: 'fa fa-credit-card',
      colorClass: 'screen-cyan'
    },
    {
      id: 'profile',
      screenNum: 'Screen 3.6',
      title: 'Vendor Profile',
      subtitle: 'Credentials & Scope',
      icon: 'fa fa-user-circle',
      colorClass: 'screen-orange'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vendorDashboardService: VendorDashboardService
  ) {}

  ngOnInit(): void {
    this.vendorDashboardService.getProfileSummary().subscribe(summary => {
      this.profile = summary;
    });

    const url = this.router.url;
    if (url.indexOf('qualification') !== -1) {
      this.activeTab = 'qualification';
    } else if (url.indexOf('catalogue') !== -1) {
      this.activeTab = 'catalogue';
    } else if (url.indexOf('subscription') !== -1) {
      this.activeTab = 'subscriptions';
    } else if (url.indexOf('vendor-profile') !== -1) {
      this.activeTab = 'profile';
    } else if (url.indexOf('quotation') !== -1) {
      this.activeTab = 'quotation';
    }

    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  openBidForm(opp: VendorOpportunity): void {
    this.selectedOpportunity = opp;
    this.activeTab = 'quotation';
  }

  onQuotationSubmitted(): void {
    if (this.profile) {
      this.profile.activeBids = this.profile.activeBids + 1;
    }
  }

  goToSubscriptions(): void {
    this.activeTab = 'subscriptions';
  }


}
