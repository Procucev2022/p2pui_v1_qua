import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';
import { CommonShareModule } from 'src/app/shared/modules/common-share/common-share.module';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { ViewInvoiceModalComponent } from './view-invoice-modal/view-invoice-modal.component';
import { AdvancePaymentRequestsComponent } from './advance-payment-requests/advance-payment-requests.component';
import { CreateEditAdvancePaymentRequestsComponent } from './create-edit-advance-payment-requests/create-edit-advance-payment-requests.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
@NgModule({
  imports: [
    CommonModule,
    InvoicesRoutingModule,
    CommonShareModule,
    MatCheckboxModule
  ],
  declarations: [InvoicesListComponent, CreateInvoiceComponent, ViewInvoiceModalComponent, AdvancePaymentRequestsComponent, CreateEditAdvancePaymentRequestsComponent],
  providers: [InvoicesService],
  exports: [CreateInvoiceComponent],
  // entryComponents: [ViewInvoiceModalComponent, CreateEditAdvancePaymentRequestsComponent]
})
export class InvoicesModule { }
