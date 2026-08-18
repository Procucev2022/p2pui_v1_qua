import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuyerVendorsRoutingModule } from './buyer-vendors-routing.module';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { VendorFormComponent } from './vendor-form/vendor-form.component';
import { VendorDetailComponent } from './vendor-detail/vendor-detail.component';

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
    VendorDetailComponent
  ]
})
export class BuyerVendorsModule {}
