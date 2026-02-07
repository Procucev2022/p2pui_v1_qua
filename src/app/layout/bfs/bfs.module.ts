import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BfsItemsListComponent } from './bfs-items-list/bfs-items-list.component';
import { BfsMyBidsComponent } from './bfs-my-bids/bfs-my-bids.component';
import { BfsMyItemsComponent } from './bfs-my-items/bfs-my-items.component';
import { BfsRoutingModule } from './bfs-routing.module';
import { CommonShareModule } from 'src/app/shared/modules/common-share/common-share.module';
import { BfsCreateItemComponent } from './bfs-create-item/bfs-create-item.component';
import { BFSCommonGridComponent } from './bfs-common-grid/bfs-common-grid.component';
import { BfsRequestItemsComponent } from './bfs-request-items/bfs-request-items.component';
import { SellerBuyerDetailsByUniqueIdComponent } from './seller-buyer-details-by-unique-id/seller-buyer-details-by-unique-id.component';
import { BfsUserInfoDetailsComponent } from './bfs-user-info-details/bfs-user-info-details.component';
import { BfsImagesViewComponent } from './bfs-images-view/bfs-images-view.component';
import { VendorBfsMyItemBidsComponent } from './vendor-bfs-my-item-bids/vendor-bfs-my-item-bids.component';

@NgModule({
  imports: [
    CommonModule, BfsRoutingModule ,   CommonShareModule
  ],
  declarations: [BfsItemsListComponent, BfsMyBidsComponent, BfsMyItemsComponent, BfsCreateItemComponent, BFSCommonGridComponent, BfsRequestItemsComponent, SellerBuyerDetailsByUniqueIdComponent, BfsUserInfoDetailsComponent, BfsImagesViewComponent, VendorBfsMyItemBidsComponent]
})
export class BfsModule { }
