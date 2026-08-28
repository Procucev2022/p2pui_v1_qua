import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyerDashboardComponent } from './buyer-dashboard.component';

const routes: Routes = [
  { path: '', component: BuyerDashboardComponent },
  { path: 'command-center', component: BuyerDashboardComponent },
  { path: 'ingestion-wizard', component: BuyerDashboardComponent },
  { path: 'quote-matrix', component: BuyerDashboardComponent },
  { path: 'vendor-evaluation-summary', component: BuyerDashboardComponent },
  { path: 'vendor-summary', component: BuyerDashboardComponent },
  { path: 'subscription-center', component: BuyerDashboardComponent },
  { path: 'subscriptions', component: BuyerDashboardComponent },
  { path: 'buyer-subscriptions', component: BuyerDashboardComponent },
  { path: 'buyer-profile', component: BuyerDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyerDashboardRoutingModule {}
