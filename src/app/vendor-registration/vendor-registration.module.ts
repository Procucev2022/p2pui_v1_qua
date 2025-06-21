import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorRegistrationRoutingModule } from './vendor-registration-routing.module';
import { CommonShareModule } from '../shared/modules/common-share/common-share.module';
import { AddProductsComponent } from './components/add-product/add-products.component';
import { AddServicesComponent } from './components/add-services/add-services.component';
import { VendorClientRefComponent } from './components/vendor-client-ref/vendor-client-ref.component';
import {   MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [

    CommonModule,
    CommonShareModule,
    VendorRegistrationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,


  ],
  declarations: [
    // AddProductsComponent,
    // AddServicesComponent,
    // VendorClientRefComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
  // entryComponents: [
  //   AddProductsComponent,
  //   AddServicesComponent,
  //   VendorContactsComponent,
  //   VendorClientRefComponent
  // ],
  ,exports:[   MatDialogModule ]
})
export class VendorRegistrationModule { }
