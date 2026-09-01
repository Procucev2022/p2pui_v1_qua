import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics-funnel',
  templateUrl: './analytics-funnel.component.html',
  styleUrls: ['./analytics-funnel.component.scss']
})
export class AnalyticsFunnelComponent implements OnInit {
  activeTab: 'buyer' | 'seller' = 'buyer';
  stages: any[] = [];
  summary: any = null;
  isLoading: boolean = true;

  isModalOpen: boolean = false;
  selectedStage: any = null;
  stageRecords: any[] = [];
  filteredRecords: any[] = [];
  isModalLoading: boolean = false;
  modalSearchQuery: string = '';

  isInfoModalOpen: boolean = false;
  selectedInfoStage: any = null;
  isDetailsInfoExpanded: boolean = false;

  isDropoffModalOpen: boolean = false;
  selectedDropoffStage: any = null;
  dropoffRecords: any[] = [];
  filteredDropoffRecords: any[] = [];
  isDropoffLoading: boolean = false;
  dropoffSearchQuery: string = '';
  dropoffTitle: string = '';

  stageInfoMap: Record<string, { title: string; category: string; whatIs: string; condition: string }> = {
    'buyer_1': {
      title: 'Registered Buyer Accounts',
      category: 'Cohort Acquisition',
      whatIs: 'Total cumulative buyer user accounts registered on the Procucev platform since inception.',
      condition: 'All user account records in the system database (user table).'
    },
    'buyer_2': {
      title: 'Active Buyer Accounts',
      category: 'Platform Engagement',
      whatIs: 'Registered buyer users with active account status who have active system access and platform participation.',
      condition: 'User records with user.is_active = 1 in the database, verifying active credentials and participation.'
    },
    'buyer_3': {
      title: 'RFQ Created (Transacting Buyers)',
      category: 'Demand Initiation',
      whatIs: 'Buyer accounts that have initiated demand by drafting and publishing at least one Request For Quotation (RFQ).',
      condition: 'Distinct user accounts linked to at least 1 requisition record in the rfq_header table.'
    },
    'buyer_4': {
      title: 'Repeat Buyers (High Intent Goal)',
      category: 'Retention & Loyalty',
      whatIs: 'Retained buyers who have returned to publish 2 or more distinct RFQs across categories on the platform.',
      condition: 'Buyers having created > 1 RFQ (SELECT user FROM rfq_header GROUP BY user HAVING count(*) > 1).'
    },
    'seller_1': {
      title: 'All Onboarded Sellers',
      category: 'Supplier Ingestion',
      whatIs: 'Total vendor and supplier business enterprises registered across all channels (WhatsApp Bot, Web, Direct).',
      condition: 'Organizations categorized as sellers (organization.org_type_uuid = "3003" OR organization.client_vendor = 1).'
    },
    'seller_2': {
      title: 'Category Linked Sellers',
      category: 'Capability Setup',
      whatIs: 'Suppliers who have mapped and linked specific product or service categories to receive matched buyer RFQs.',
      condition: 'Sellers with mapped category entries in org_division_category, vendor_catalogue, or vendorcategory.'
    },
    'seller_3': {
      title: 'Sellers with First Quote Placed',
      category: 'Commercial Activity',
      whatIs: 'Suppliers that have actively participated in competitive bidding and submitted at least one quotation.',
      condition: 'Suppliers with recorded quote submissions in gmt_rfq_vendors (quote_submitted_date IS NOT NULL).'
    },
    'seller_4': {
      title: 'Subscribed Active Sellers (Goal)',
      category: 'Monetization',
      whatIs: 'Verified suppliers actively subscribed to a paid platform plan or BFS membership tier.',
      condition: 'Organizations with an active subscription plan (subscription_plan_uuid IS NOT NULL OR bfs_name IS NOT NULL).'
    },
    'seller_5': {
      title: 'Sellers with Depleted Credit (Alert)',
      category: 'Credit Risk / Top-up',
      whatIs: 'Registered suppliers whose RFQ bidding credits are exhausted and cannot place bids without credit top-up.',
      condition: 'Seller organizations where rfq_credits <= 0 OR rfq_credits IS NULL.'
    }
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadFunnel();
  }

  setTab(tab: 'buyer' | 'seller'): void {
    this.activeTab = tab;
    this.loadFunnel();
  }

  loadFunnel(): void {
    this.isLoading = true;
    this.analyticsService.getFunnelData(this.activeTab).subscribe({
      next: (res: any) => {
        if (res) {
          this.stages = res.stages || [];
          this.summary = res.summary || null;

          if (this.activeTab === 'seller') {
            const hasDepletedStage = this.stages.some((s: any) => s.isAlert || s.name?.toLowerCase().includes('depleted'));
            if (!hasDepletedStage) {
              const depletedCount = this.summary?.depletedCreditSellers ?? 0;
              const totalCohort = this.summary?.totalEntered ?? this.stages[0]?.usersEntered ?? 0;
              this.stages.push({
                stageNumber: 5,
                name: 'Sellers with Depleted Credit',
                usersEntered: depletedCount,
                dropOffVolume: null,
                dropOffRate: '—',
                convRatePrev: '—',
                convRateTotal: totalCohort > 0 ? Math.round((depletedCount / totalCohort) * 100) + '%' : '—',
                isAlert: true,
                icon: 'warning'
              });
            }
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Funnel loading error:', err);
        this.isLoading = false;
      }
    });
  }

  openStageModal(stage: any): void {
    this.selectedStage = stage;
    this.modalSearchQuery = '';
    this.isModalOpen = true;
    this.isModalLoading = true;
    this.stageRecords = [];
    this.isModalLoading = true;
    const stageNum = stage.stageNumber || 1;
    setTimeout(() => {
      const el = document.getElementById('funnel-modal-backdrop');
      if (el && el.parentElement !== document.body) {
        document.body.appendChild(el);
      }
    }, 0);
    this.analyticsService.getFunnelStageDetails(this.activeTab, stageNum, '').subscribe({
      next: (res: any) => {
        if (res && res.records) {
          this.stageRecords = res.records;
          this.filteredRecords = [...res.records];
        }
        this.isModalLoading = false;
      },
      error: (err) => {
        console.error('Error fetching stage details:', err);
        this.isModalLoading = false;
      }
    });
  }

  closeStageModal(): void {
    const el = document.getElementById('funnel-modal-backdrop');
    if (el && el.parentElement === document.body) {
      document.body.removeChild(el);
    }
    this.isModalOpen = false;
    this.selectedStage = null;
    this.stageRecords = [];
    this.filteredRecords = [];
  }

  filterRecords(): void {
    if (!this.modalSearchQuery || !this.modalSearchQuery.trim()) {
      this.filteredRecords = [...this.stageRecords];
      return;
    }
    const q = this.modalSearchQuery.toLowerCase().trim();
    this.filteredRecords = this.stageRecords.filter((item: any) => {
      return (
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.contactPerson && item.contactPerson.toLowerCase().includes(q)) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.phone && item.phone.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.companyName && item.companyName.toLowerCase().includes(q)) ||
        (item.planName && item.planName.toLowerCase().includes(q))
      );
    });
  }

  exportStageData(): void {
    if (!this.filteredRecords || this.filteredRecords.length === 0) return;
    const headers = Object.keys(this.filteredRecords[0]).join(',');
    const rows = this.filteredRecords.map((rec: any) => {
      return Object.values(rec)
        .map((val: any) => `"${String(val !== null && val !== undefined ? val : '').replace(/"/g, '""')}"`)
        .join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${this.activeTab}_stage_${this.selectedStage?.stageNumber || 1}_records.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  openDropoffModal(stage: any): void {
    if (!stage || !stage.dropOffVolume) return;
    this.selectedDropoffStage = stage;
    this.dropoffSearchQuery = '';
    this.dropoffTitle = '';
    this.isDropoffModalOpen = true;
    this.isDropoffLoading = true;
    this.dropoffRecords = [];
    this.filteredDropoffRecords = [];
    const stageNum = stage.stageNumber || 2;
    setTimeout(() => {
      const el = document.getElementById('dropoff-modal-backdrop');
      if (el && el.parentElement !== document.body) {
        document.body.appendChild(el);
      }
    }, 0);
    this.analyticsService.getFunnelDropoffDetails(this.activeTab, stageNum, '').subscribe({
      next: (res: any) => {
        if (res) {
          this.dropoffRecords = res.records || [];
          this.filteredDropoffRecords = [...this.dropoffRecords];
          this.dropoffTitle = res.title || '';
        }
        this.isDropoffLoading = false;
      },
      error: (err) => {
        console.error('Error fetching drop-off details:', err);
        this.isDropoffLoading = false;
      }
    });
  }

  closeDropoffModal(): void {
    const el = document.getElementById('dropoff-modal-backdrop');
    if (el && el.parentElement === document.body) {
      document.body.removeChild(el);
    }
    this.isDropoffModalOpen = false;
    this.selectedDropoffStage = null;
    this.dropoffRecords = [];
    this.filteredDropoffRecords = [];
  }

  filterDropoffRecords(): void {
    if (!this.dropoffSearchQuery || !this.dropoffSearchQuery.trim()) {
      this.filteredDropoffRecords = [...this.dropoffRecords];
      return;
    }
    const q = this.dropoffSearchQuery.toLowerCase().trim();
    this.filteredDropoffRecords = this.dropoffRecords.filter((item: any) => {
      return (
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.contactPerson && item.contactPerson.toLowerCase().includes(q)) ||
        (item.companyName && item.companyName.toLowerCase().includes(q)) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.phone && item.phone.toLowerCase().includes(q))
      );
    });
  }

  exportDropoffData(): void {
    if (!this.filteredDropoffRecords || this.filteredDropoffRecords.length === 0) return;
    const headers = Object.keys(this.filteredDropoffRecords[0]).join(',');
    const rows = this.filteredDropoffRecords.map((rec: any) => {
      return Object.values(rec)
        .map((val: any) => `"${String(val !== null && val !== undefined ? val : '').replace(/"/g, '""')}"`)
        .join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${this.activeTab}_stage_${this.selectedDropoffStage?.stageNumber || 1}_dropoff.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getStageInfo(stage: any): { title: string; category: string; whatIs: string; condition: string } {
    if (!stage) {
      return {
        title: 'Conversion Stage',
        category: 'Funnel Analytics',
        whatIs: 'Conversion step in user acquisition and transactional milestone flow.',
        condition: 'Calculated from live platform database transactions.'
      };
    }
    const key = `${this.activeTab}_${stage.stageNumber || 1}`;
    return this.stageInfoMap[key] || {
      title: stage.name || 'Stage Details',
      category: 'Conversion Funnel',
      whatIs: `Participants who have reached the ${stage.name} milestone.`,
      condition: 'Real-time state and transaction events recorded in the database.'
    };
  }

  openStageInfo(stage: any, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedInfoStage = stage;
    this.isInfoModalOpen = true;
  }

  closeStageInfo(): void {
    this.isInfoModalOpen = false;
    this.selectedInfoStage = null;
  }

  toggleDetailsInfo(): void {
    this.isDetailsInfoExpanded = !this.isDetailsInfoExpanded;
  }
}
