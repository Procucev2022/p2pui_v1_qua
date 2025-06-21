import { NgModule } from '@angular/core';
import { ProcuDashboardComponent } from './procu-dashboard/procu-dashboard.component';
import { ProcuRfqsComponent } from './procu-rfqs/procu-rfqs.component';
import { ProcuVendorSearchComponent } from './procu-vendor-search/procu-vendor-search.component';
import { ProcuClientsComponent } from './procu-clients/procu-clients.component';
import { ProcuProcureRequestsComponent } from './procu-procure-requests/procu-procure-requests.component';
import { ProcuQutotationsComponent } from './procu-qutotations/procu-qutotations.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '',  redirectTo: 'procurerequest', pathMatch: 'prefix'},
  {path: 'dashboard', component: ProcuDashboardComponent},
  {path: 'vendors', component: ProcuVendorSearchComponent},
  {path: 'clients', component: ProcuClientsComponent},
  {path: 'procurerequest', component: ProcuProcureRequestsComponent},
  {path: 'quotations', component: ProcuQutotationsComponent},
  {path: 'rfqs', component: ProcuRfqsComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcuceveAdminRoutingModule { }
