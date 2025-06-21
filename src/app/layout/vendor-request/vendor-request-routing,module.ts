import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorRequestComponent } from './components/vendor-request/vendor-request.component';

const routes: Routes = [
    {    path: 'req', component: VendorRequestComponent  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRequestRoutingModule { }
