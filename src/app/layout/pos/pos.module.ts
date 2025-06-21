import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosRoutingModule } from './pos-routing.module';
import { PosComponent } from './pos/pos.component';
import { ViewPosComponent } from './view-pos/view-pos.component';
import { AcceptPosComponent } from './accept-pos/accept-pos.component';
import { PoDeliveryItemsComponent } from './po-delivery-items/po-delivery-items.component';
import { CancelPoComponent } from './cancel-po/cancel-po.component';
import { PoItemsComponent } from './po-items/po-items.component';
import { PoViewDeliveryComponent } from './po-view-delivery/po-view-delivery.component';
import { PoCreateAsnComponent } from './po-create-asn/po-create-asn.component';
import { CreateInvoiceComponent } from '../invoices/create-invoice/create-invoice.component';
import { InvoicesModule } from '../invoices/invoices.module';
import { ViewAsnModalComponent } from './view-asn-modal/view-asn-modal.component';
import { CommonShareModule } from 'src/app/shared/modules/common-share/common-share.module';

@NgModule({
  imports: [
    CommonModule,
    PosRoutingModule,
    CommonShareModule,
    InvoicesModule
  ],
  declarations: [PosComponent, ViewPosComponent, AcceptPosComponent, PoDeliveryItemsComponent, CancelPoComponent, PoItemsComponent, PoViewDeliveryComponent, PoCreateAsnComponent, ViewAsnModalComponent],
  // entryComponents: [ViewPosComponent, AcceptPosComponent, CancelPoComponent, PoViewDeliveryComponent, PoCreateAsnComponent, CreateInvoiceComponent, ViewAsnModalComponent]
})
export class PosModule { }
