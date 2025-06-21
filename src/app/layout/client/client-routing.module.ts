import { NgModule } from '@angular/core';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { ClientProfileComponent } from './client-profile/client-profile.component';
import { ClientProcureRequestComponent } from './client-procure-request/client-procure-request.component';
import { ClientPposComponent } from './client-ppos/client-ppos.component';
import { ItemCatalogueComponent } from './item-catalogue/item-catalogue.component';
import { ClientAnalyticsInfoComponent } from './client-analytics-info/client-analytics-info.component';
import { AuctionsChartComponent } from './auctions-chart/auctions-chart.component';
import { PrPpoChartComponent } from './pr-ppo-chart/pr-ppo-chart.component';
import { PrLeadTimeChartComponent } from './pr-lead-time-chart/pr-lead-time-chart.component';
import { ClientProcureRequestCapexComponent } from './client-procure-request-capex/client-procure-request-capex.component';
import { ClientProcureRequestOpexComponent } from './client-procure-request-opex/client-procure-request-opex.component';
import { ProCpxVendorSummaryLayoutComponent } from 'src/app/shared/modules/common-share/components/pro-cpx-vendor-summary-layout/pro-cpx-vendor-summary-layout.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'prefix'},
  {path: 'dashboard', component: ClientDashboardComponent},
  {path: 'procurerequest', component: ClientProcureRequestComponent},
  {path: 'pr-capex', component: ClientProcureRequestCapexComponent},
  {path: 'pr-opex', component: ClientProcureRequestOpexComponent},
  {path: 'ppos', component: ClientPposComponent},
  {path: 'profile', component: ClientProfileComponent},
  {path: 'itemCatalogue', component: ItemCatalogueComponent},
  {path: 'prs-count', component: ClientAnalyticsInfoComponent},
  {path: 'pr-lead-time', component: PrLeadTimeChartComponent},
  {path: 'pr-ppo', component: PrPpoChartComponent},
  {path: 'auctions-count', component: AuctionsChartComponent},
  {path : 'cient-summary', component: ProCpxVendorSummaryLayoutComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
