import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VmgrDashboardComponent } from './vmgr-dashboard/vmgr-dashboard.component';
import { VmgrVendorInvitationComponent } from './vmgr-vendor-invitation/vmgr-vendor-invitation.component';
import { VmgrVendorRequestsComponent } from './vmgr-vendor-requests/vmgr-vendor-requests.component';
import { VmgrVendorApprovalsComponent } from './vmgr-vendor-approvals/vmgr-vendor-approvals.component';
import { VmgrVendorSearchComponent } from './vmgr-vendor-search/vmgr-vendor-search.component';
import { PrevendorComponent } from './prevendor/prevendor.component';
import { VendorActiveTimesComponent } from './vendor-active-time/vendor-active-times/vendor-active-times.component';
import { DynamicPricingItemsComponent } from './dynamic-pricing-items/dynamic-pricing-items.component';
import { GmtVendorsListComponent } from './components/gmt-vendors-list/gmt-vendors-list.component';
const routes: Routes = [
  {    path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
  {    path: 'dashboard', component: VmgrDashboardComponent  },
  {    path: 'invitevendor', component: VmgrVendorInvitationComponent  },
  {    path: 'vendorrequests', component: VmgrVendorRequestsComponent  },
  {    path: 'vendorapprovals', component: VmgrVendorApprovalsComponent  },
  {   path: 'vendorsearch', component: VmgrVendorSearchComponent  },
  {   path: 'create-vendor-time', component: VendorActiveTimesComponent  },
  {   path: 'dynamic-price-items', component: DynamicPricingItemsComponent  },
  {   path: 'vendors', component: PrevendorComponent  },
  {   path: 'gmt-vendors', component: GmtVendorsListComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorMgrRoutingModule { }
