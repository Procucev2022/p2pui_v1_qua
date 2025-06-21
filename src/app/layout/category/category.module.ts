import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryListComponent } from './category-list/category-list.component';
import { CommonShareModule } from 'src/app/shared/modules/common-share/common-share.module';
import { CreateSubCategoryComponent } from './create-sub-category/create-sub-category.component';
import { ItemListComponent } from './item-list/item-list.component';
import { CreateItemComponent } from './create-item/create-item.component';
import { CreateItemCategoryComponent } from './create-item-category/create-item-category.component';
import { VendorLinkingToItemModalComponent } from './vendor-linking-to-item-modal/vendor-linking-to-item-modal.component';
import { ClientLinkingToItemModalComponent } from './client-linking-to-item-modal/client-linking-to-item-modal.component';
import { LinkedVendorListComponent } from './linked-vendor-list/linked-vendor-list.component';
import { LinkedClientListComponent } from './linked-client-list/linked-client-list.component';
import { EditVendorLinkingToItemModalComponent } from './edit-vendor-linking-to-item-modal/edit-vendor-linking-to-item-modal.component';
import { EditClientLinkingToItemModalComponent } from './edit-client-linking-to-item-modal/edit-client-linking-to-item-modal.component';
import { ItemListByVendorComponent } from './item-list-by-vendor/item-list-by-vendor.component';
import { LinkClientModalComponent } from './link-client-modal/link-client-modal.component';
import { ItemPriceApprovalsComponent } from './item-price-approvals/item-price-approvals.component';
import { NewCreateSubCategoryComponent } from './new-create-sub-category/new-create-sub-category.component';
import { ProductSubCategoryComponent } from './new-create-sub-category/product-sub-category/product-sub-category.component';
import { ServiceSubCategoryComponent } from './new-create-sub-category/service-sub-category/service-sub-category.component';
import { ChartModule } from 'primeng/chart';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    CategoryRoutingModule,
    CommonShareModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [CategoryListComponent, CreateSubCategoryComponent, ItemListComponent, CreateItemComponent, CreateItemCategoryComponent, VendorLinkingToItemModalComponent, ClientLinkingToItemModalComponent, LinkedVendorListComponent, LinkedClientListComponent, EditVendorLinkingToItemModalComponent, EditClientLinkingToItemModalComponent, ItemListByVendorComponent, LinkClientModalComponent, ItemPriceApprovalsComponent, NewCreateSubCategoryComponent, ProductSubCategoryComponent, ServiceSubCategoryComponent],

  // entryComponents: [CreateSubCategoryComponent, NewCreateSubCategoryComponent, CreateItemCategoryComponent, VendorLinkingToItemModalComponent, ClientLinkingToItemModalComponent, EditVendorLinkingToItemModalComponent, EditClientLinkingToItemModalComponent,LinkClientModalComponent],
  exports: [ChartModule]
})
export class CategoryModule { }
