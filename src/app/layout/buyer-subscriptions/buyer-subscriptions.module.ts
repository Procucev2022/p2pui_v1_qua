import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuyerSubscriptionsRoutingModule } from './buyer-subscriptions-routing.module';
import { BuyerSubscriptionsComponent } from './buyer-subscriptions.component';

@NgModule({
  declarations: [
    BuyerSubscriptionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BuyerSubscriptionsRoutingModule
  ],
  exports: [
    BuyerSubscriptionsComponent
  ]
})
export class BuyerSubscriptionsModule {}
