import { NgModule } from '@angular/core';
import { CategoryListComponent } from './category-list/category-list.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemPriceApprovalsComponent } from './item-price-approvals/item-price-approvals.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'list', component: CategoryListComponent},
  {path: 'itemsList', component: ItemListComponent},
  {path: 'item-price-approvals', component: ItemPriceApprovalsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
