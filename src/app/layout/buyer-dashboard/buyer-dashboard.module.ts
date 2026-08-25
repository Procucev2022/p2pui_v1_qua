import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BuyerDashboardRoutingModule } from './buyer-dashboard-routing.module';
import { BuyerDashboardComponent } from './buyer-dashboard.component';
import { BuyerCommandCenterComponent } from './buyer-command-center/buyer-command-center.component';
import { BuyerIngestionWizardComponent } from './buyer-ingestion-wizard/buyer-ingestion-wizard.component';
import { BuyerQuoteMatrixComponent } from './buyer-quote-matrix/buyer-quote-matrix.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BuyerDashboardRoutingModule
  ],
  declarations: [
    BuyerDashboardComponent,
    BuyerCommandCenterComponent,
    BuyerIngestionWizardComponent,
    BuyerQuoteMatrixComponent
  ]
})
export class BuyerDashboardModule {}
