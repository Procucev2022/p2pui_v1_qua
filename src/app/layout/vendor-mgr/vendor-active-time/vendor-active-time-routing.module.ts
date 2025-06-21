import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorActiveTimesComponent } from './vendor-active-times/vendor-active-times.component';

const routes: Routes = [
  {    path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
  {    path: 'create-vendor-time', component: VendorActiveTimesComponent  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorActiveTimeRoutingModule { }
