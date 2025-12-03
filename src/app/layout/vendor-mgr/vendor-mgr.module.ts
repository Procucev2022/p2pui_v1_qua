
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorMgrRoutingModule } from './vendor-mgr-routing.module';
import { VmgrVendorApprovalsComponent } from './vmgr-vendor-approvals/vmgr-vendor-approvals.component';
import { VmgrDashboardComponent } from './vmgr-dashboard/vmgr-dashboard.component';
import { VmgrVendorSearchComponent } from './vmgr-vendor-search/vmgr-vendor-search.component';
import { VmgrVendorRequestsComponent } from './vmgr-vendor-requests/vmgr-vendor-requests.component';
import { VmgrVendorInvitationComponent } from './vmgr-vendor-invitation/vmgr-vendor-invitation.component';
import { VendortabComponent } from './components/vendortab/vendortab.component';
import { ApprovalpendingTabComponent } from './components/approvalpending-tab/approvalpending-tab.component';
import { VendorApprovalModalComponent } from './components/vendor-approval-modal/vendor-approval-modal.component';
import { VendorRegistrationPendingComponent } from './components/vendor-registration-pending/vendor-registration-pending.component';
import { MatIconModule } from '@angular/material/icon';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { VendorTabViewModelComponent } from './components/vendor-tab-view-model/vendor-tab-view-model.component';
import { VendorRejectedComponent } from './components/vendor-rejected/vendor-rejected.component';
import { VendorAssignRankModelComponent } from './components/vendor-assign-rank-model/vendor-assign-rank-model.component';
import { PrevendorComponent } from './prevendor/prevendor.component';
// import { AddOrEditVendorModalComponent } from '../../shared/modules/common-share/components/add-or-edit-vendor-modal/add-or-edit-vendor-modal.component';
import { ViewPreVendorDetailsComponent } from './view-pre-vendor-details/view-pre-vendor-details.component';
import { VendorActiveTimesComponent } from './vendor-active-time/vendor-active-times/vendor-active-times.component';
import { VendorEvolutionComponent } from './vendor-evolution/vendor-evolution.component';
import { VendorCapabilityComponent } from './vendor-evolution/vendor-capability/vendor-capability.component';
import { VendorQualityComponent } from './vendor-evolution/vendor-quality/vendor-quality.component';
import { VendorCommercialComponent } from './vendor-evolution/vendor-commercial/vendor-commercial.component';
import { VendorClientComponent } from './vendor-evolution/vendor-client/vendor-client.component';
import { ViewVendorEvaluationComponent } from './view-vendor-evaluation/view-vendor-evaluation.component';
import { ForwardedVendorsTabComponent } from './components/forwarded-vendors-tab/forwarded-vendors-tab.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicPricingItemsComponent } from './dynamic-pricing-items/dynamic-pricing-items.component'; 
import { VendorInfoComponent } from './vendor-evolution/vendor-info/vendor-info.component';

import { CommonShareModule } from "./../../shared/modules/common-share/common-share.module"
@NgModule({
  imports: [
    CommonModule,
    VendorMgrRoutingModule,
    CommonShareModule,
    MatIconModule,
    SelectDropDownModule,
    NgbModalModule
  ],
  declarations: [VmgrVendorApprovalsComponent, VmgrDashboardComponent, VmgrVendorSearchComponent, VmgrVendorRequestsComponent, VmgrVendorInvitationComponent, VendortabComponent, ApprovalpendingTabComponent, VendorApprovalModalComponent, VendorRegistrationPendingComponent, VendorTabViewModelComponent, VendorRejectedComponent, VendorAssignRankModelComponent, PrevendorComponent,

    ViewPreVendorDetailsComponent,
    VendorEvolutionComponent,
    VendorInfoComponent,
    VendorCapabilityComponent,
    VendorQualityComponent,
    VendorCommercialComponent,
    VendorClientComponent,
    ViewVendorEvaluationComponent,
    ForwardedVendorsTabComponent,
    DynamicPricingItemsComponent,
    // VendorActiveTimesComponent,
    ],
  // entryComponents: [VendorApprovalModalComponent, VendorTabViewModelComponent, VendorAssignRankModelComponent, ViewPreVendorDetailsComponent, VendorEvolutionComponent, ViewVendorEvaluationComponent]
})
export class VendorMgrModule { }
