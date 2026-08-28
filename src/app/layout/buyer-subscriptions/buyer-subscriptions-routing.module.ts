import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyerSubscriptionsComponent } from './buyer-subscriptions.component';

const routes: Routes = [
  {
    path: '',
    component: BuyerSubscriptionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyerSubscriptionsRoutingModule {}
