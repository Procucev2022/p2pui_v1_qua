import { NgModule } from '@angular/core';
import { BfsItemsListComponent } from './bfs-items-list/bfs-items-list.component';
import { BfsMyItemsComponent } from './bfs-my-items/bfs-my-items.component';
import { BfsMyBidsComponent } from './bfs-my-bids/bfs-my-bids.component';
import { BfsRequestItemsComponent } from './bfs-request-items/bfs-request-items.component';
import { SellerBuyerDetailsByUniqueIdComponent } from './seller-buyer-details-by-unique-id/seller-buyer-details-by-unique-id.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {path: 'items', component: BfsItemsListComponent},
    {path: 'requested-items', component: BfsRequestItemsComponent},
    {path: 'my-items', component: BfsMyItemsComponent},
    {path: 'my-bids', component: BfsMyBidsComponent},
    {path: 'buyer-seller-details', component: SellerBuyerDetailsByUniqueIdComponent},
    {path: '', redirectTo: 'items', pathMatch: 'prefix'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BfsRoutingModule { }
