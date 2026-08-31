import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorRFQComponent } from './vendor-rfq/vendor-rfq.component';
import { VendorQuotSubmComponent } from './vendor-quot-subm/vendor-quot-subm.component';
import { VendorProfileComponent } from './vendor-profile/vendor-profile.component';
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard.component';
import { VendorRegComponent } from './vendor-reg/vendor-reg.component';
import { VendorAuctionsComponent } from './auctions/vendor-auctions/vendor-auctions.component';
import {ForwardedVendorComponent} from '../vendor-mgr/forwarded-vendor/forwarded-vendor.component';
// import { VendorQuotationComponent } from './vendor-quotation/vendor-quotation.component';
// import { VendorRegistrationComponent } from './vendor-registration/vendor-registration.component';
import {ClientVendorComponent} from './client-vendor/client-vendor.component';

const routes: Routes = [
  {path: '',  redirectTo: 'dashboard', pathMatch: 'prefix'},
  {path: 'dashboard', component: VendorDashboardComponent},
  // Vendor workspace screens are hosted by the dashboard shell (tab resolved from the URL).
  {path: 'opportunity-feed', component: VendorDashboardComponent},
  {path: 'quotation-form', component: VendorDashboardComponent},
  {path: 'qualification', component: VendorDashboardComponent},
  {path: 'catalogue', component: VendorDashboardComponent},
  {path: 'subscription-center', component: VendorDashboardComponent},
  {path: 'vendor-profile', component: VendorDashboardComponent},
  {path: 'rfq', component: VendorRFQComponent},
  {path: 'quotsubmit', component: VendorQuotSubmComponent},
  {path: 'profile', component: VendorProfileComponent},
  {path: 'vendorReg', component: VendorRegComponent},
  {path: 'auctions', component: VendorAuctionsComponent},
  {path: 'forwardedVendors', component: ForwardedVendorComponent},
  {path: 'clientvendorComponent', component: ClientVendorComponent}

  // {path: 'quotation', component: VendorQuotationComponent},
  // {path: 'vendorReg', component: VendorRegistrationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
