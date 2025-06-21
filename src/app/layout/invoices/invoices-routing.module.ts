import { NgModule } from '@angular/core';
import { AdvancePaymentRequestsComponent } from './advance-payment-requests/advance-payment-requests.component';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'invoices', component: InvoicesListComponent},
  {path: 'advance-payments', component: AdvancePaymentRequestsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutingModule { }
