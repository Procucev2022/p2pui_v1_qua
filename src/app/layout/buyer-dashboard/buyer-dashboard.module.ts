import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuyerDashboardRoutingModule } from './buyer-dashboard-routing.module';

import { BuyerDashboardComponent } from './buyer-dashboard.component';
import { BuyerCommandCenterComponent } from './buyer-command-center/buyer-command-center.component';
import { BuyerIngestionWizardComponent } from './buyer-ingestion-wizard/buyer-ingestion-wizard.component';
import { BuyerQuoteMatrixComponent } from './buyer-quote-matrix/buyer-quote-matrix.component';
import { BuyerVendorEvaluationComponent } from './buyer-vendor-evaluation/buyer-vendor-evaluation.component';
import { BuyerVendorDirectoryComponent } from './buyer-vendor-directory/buyer-vendor-directory.component';
import { BuyerSubscriptionsComponent } from './buyer-subscriptions/buyer-subscriptions.component';
import { BuyerProfileComponent } from './buyer-profile/buyer-profile.component';

@NgModule({
  declarations: [
    BuyerDashboardComponent,
    BuyerCommandCenterComponent,
    BuyerIngestionWizardComponent,
    BuyerQuoteMatrixComponent,
    BuyerVendorEvaluationComponent,
    BuyerVendorDirectoryComponent,
    BuyerSubscriptionsComponent,
    BuyerProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BuyerDashboardRoutingModule
  ]
})
export class BuyerDashboardModule {}
