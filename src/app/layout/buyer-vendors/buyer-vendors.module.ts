import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuyerVendorsRoutingModule } from './buyer-vendors-routing.module';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { VendorFormComponent } from './vendor-form/vendor-form.component';
import { VendorDetailComponent } from './vendor-detail/vendor-detail.component';
import { VendorAiAnalysisComponent } from './vendor-ai-analysis/vendor-ai-analysis.component';
import { VendorAiProfileComponent } from './vendor-ai-profile/vendor-ai-profile.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BuyerVendorsRoutingModule
  ],
  declarations: [
    VendorListComponent,
    VendorFormComponent,
    VendorDetailComponent,
    VendorAiAnalysisComponent,
    VendorAiProfileComponent
  ]
})
export class BuyerVendorsModule {}
