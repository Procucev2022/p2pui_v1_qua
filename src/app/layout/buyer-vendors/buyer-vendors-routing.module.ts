import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { VendorFormComponent } from './vendor-form/vendor-form.component';
import { VendorDetailComponent } from './vendor-detail/vendor-detail.component';
import { VendorAiAnalysisComponent } from './vendor-ai-analysis/vendor-ai-analysis.component';
import { VendorAiProfileComponent } from './vendor-ai-profile/vendor-ai-profile.component';

const routes: Routes = [
  { path: '', component: VendorListComponent },
  { path: 'new', component: VendorFormComponent },
  { path: 'ai-analysis', component: VendorAiAnalysisComponent },
  { path: 'ai-profile/:code', component: VendorAiProfileComponent },
  { path: ':id', component: VendorDetailComponent },
  { path: ':id/edit', component: VendorFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyerVendorsRoutingModule {}
