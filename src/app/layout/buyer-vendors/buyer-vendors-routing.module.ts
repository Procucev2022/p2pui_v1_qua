import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { VendorFormComponent } from './vendor-form/vendor-form.component';
import { VendorDetailComponent } from './vendor-detail/vendor-detail.component';

const routes: Routes = [
  { path: '', component: VendorListComponent },
  { path: 'new', component: VendorFormComponent },
  { path: ':id', component: VendorDetailComponent },
  { path: ':id/edit', component: VendorFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyerVendorsRoutingModule {}
