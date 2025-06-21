import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcuceveAdminRoutingModule } from './procuceve-admin-routing.module';
import { ProcuDashboardComponent } from './procu-dashboard/procu-dashboard.component';
import { ProcuVendorSearchComponent } from './procu-vendor-search/procu-vendor-search.component';
import { ProcuClientsComponent } from './procu-clients/procu-clients.component';
import { ProcuProcureRequestsComponent } from './procu-procure-requests/procu-procure-requests.component';
import { ProcuQutotationsComponent } from './procu-qutotations/procu-qutotations.component';
import { ProcuRfqsComponent } from './procu-rfqs/procu-rfqs.component';
import { CommonShareModule } from 'src/app/shared/modules/common-share/common-share.module';

@NgModule({
  imports: [
    CommonModule,
    ProcuceveAdminRoutingModule,
    CommonShareModule
  ],
  declarations: [ProcuDashboardComponent, ProcuVendorSearchComponent, ProcuClientsComponent, ProcuProcureRequestsComponent, ProcuQutotationsComponent, ProcuRfqsComponent]
})
export class ProcuceveAdminModule { }
