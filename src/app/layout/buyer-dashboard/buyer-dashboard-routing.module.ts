import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyerDashboardComponent } from './buyer-dashboard.component';
import { BuyerCommandCenterComponent } from './buyer-command-center/buyer-command-center.component';
import { BuyerIngestionWizardComponent } from './buyer-ingestion-wizard/buyer-ingestion-wizard.component';
import { BuyerQuoteMatrixComponent } from './buyer-quote-matrix/buyer-quote-matrix.component';

export const routes: Routes = [
  {
    path: '',
    component: BuyerDashboardComponent,
    children: [
      { path: '', redirectTo: 'command-center', pathMatch: 'full' },
      { path: 'command-center', component: BuyerCommandCenterComponent },
      { path: 'ai-ingestion-wizard', component: BuyerIngestionWizardComponent },
      { path: 'quote-evaluation-matrix', component: BuyerQuoteMatrixComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyerDashboardRoutingModule {}
