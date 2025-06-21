import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { VendorRoutingModule } from './vendor-routing.module';
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard.component';
import { VendorRFQComponent } from './vendor-rfq/vendor-rfq.component';
import { VendorQuotSubmComponent } from './vendor-quot-subm/vendor-quot-subm.component';
import { VendorProfileComponent } from './vendor-profile/vendor-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VendorQuotationModalComponent } from './components/vendor-quotation-modal/vendor-quotation-modal.component';
// import { RfqDetailComponent } from './components/quotationComponents/rfq-detail/rfq-detail.component';
// import { QuotInfoComponent } from './components/quotationComponents/quot-info/quot-info.component';
import { VendorRegComponent } from './vendor-reg/vendor-reg.component';
import { AddProductsComponent } from './components/add-product/add-products.component';
import { AddServicesComponent } from './components/add-services/add-services.component';
import { VendorContactsComponent } from './components/vendor-contacts/vendor-contacts.component';
import { VendorClientRefComponent } from './components/vendor-client-ref/vendor-client-ref.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
// import { VendorQuotationComponent } from './vendor-quotation/vendor-quotation.component';
// import { VendorRegistrationComponent } from './vendor-registration/vendor-registration.component';
// import { AddProductsComponent } from '../../vendor-registration/components/add-product/add-products.component';
// import { VendorContactsComponent } from '../../vendor-registration/components/vendor-contacts/vendor-contacts.component';
// import { VendorClientRefComponent } from '../../vendor-registration/components/vendor-client-ref/vendor-client-ref.component';
// import { AddServicesComponent } from '../../vendor-registration/components/add-services/add-services.component';
import {DropdownModule} from 'primeng/dropdown';
import { QuotByIdComponent } from './components/quotLineItemsComponents/quot-by-id/quot-by-id.component';
import { RfqDetailsComponent } from './components/rfqLinecomponents/rfq-details/rfq-details.component';
import { QuotInfoComponent } from './components/rfqLinecomponents/quot-info/quot-info.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { ServiceEditComponent } from './components/service-edit/service-edit.component';
import { RfqDocumentsComponent } from './components/rfqLinecomponents/rfq-documents/rfq-documents.component';
import { ViewRFQByIdModalComponent } from './components/view-rfq-by-id-modal/view-rfq-by-id-modal.component';
import { ScheduledAuctionsComponent } from './auctions/scheduled-auctions/scheduled-auctions.component';
import { LiveAuctionsComponent } from './auctions/live-auctions/live-auctions.component';
import { VendorAuctionsComponent } from './auctions/vendor-auctions/vendor-auctions.component';
import { LiveAuctionModalComponent } from './auctions/live-auction-modal/live-auction-modal.component';
import { SealedBidAuctionModalComponent } from './auctions/sealed-bid-auction-modal/sealed-bid-auction-modal.component';
import { CountdownModule } from 'ngx-countdown';
import { LiveAuctionForItemwiseComponent } from './auctions/live-auction-for-itemwise/live-auction-for-itemwise.component';
import { LiveAuctionForRfqWiseComponent } from './auctions/live-auction-for-rfq-wise/live-auction-for-rfq-wise.component';
import { VendorRegistrationComponent } from './vendor-registration/vendor-registration.component';
import { AddClientRefComponent } from './components/add-client-ref/add-client-ref.component';
import { EditClientRefComponent } from './components/edit-client-ref/edit-client-ref.component';
import { ForwardedVendorComponent } from '../vendor-mgr/forwarded-vendor/forwarded-vendor.component';
import { ClientVendorComponent } from './client-vendor/client-vendor.component';
import { EditRfqByIdModalComponent } from './components/edit-rfq-by-id-modal/edit-rfq-by-id-modal.component';
import { CommonShareModule } from 'src/app/shared/modules/common-share/common-share.module';
@NgModule({
  imports: [
    CommonModule,
    VendorRoutingModule,
    CommonShareModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    DropdownModule,
    CountdownModule
  ],
  declarations: [
    VendorDashboardComponent,
    VendorRFQComponent,
    VendorQuotSubmComponent,
    VendorProfileComponent,
    VendorQuotationModalComponent,
    QuotByIdComponent,
    RfqDetailsComponent,
    QuotInfoComponent,

    VendorRegComponent,
    // AddProductsComponent,
    // AddServicesComponent,
    // VendorContactsComponent,
    // VendorClientRefComponent,
   // RfqDetailComponent,
    QuotInfoComponent,
   ProductEditComponent,
   ServiceEditComponent,
   RfqDocumentsComponent,
    // VendorQuotationComponent,
    VendorRegistrationComponent,
    ViewRFQByIdModalComponent,
    ScheduledAuctionsComponent,
    LiveAuctionsComponent,
    VendorAuctionsComponent,
    LiveAuctionModalComponent,
    SealedBidAuctionModalComponent,
    LiveAuctionForItemwiseComponent,
    LiveAuctionForRfqWiseComponent,
    AddClientRefComponent,
    EditClientRefComponent,
    ForwardedVendorComponent,
    ClientVendorComponent,
    EditRfqByIdModalComponent,

  ],
  // entryComponents: [
  //   AddProductsComponent,
  //   AddServicesComponent,
  //   VendorContactsComponent,
  //   VendorClientRefComponent,
  //   VendorQuotationModalComponent,
  //   ProductEditComponent,
  //   ServiceEditComponent,
  //   RfqDocumentsComponent,
  //   ViewRFQByIdModalComponent,
  //   LiveAuctionModalComponent,
  //   SealedBidAuctionModalComponent,
  //   LiveAuctionForItemwiseComponent,
  //   LiveAuctionForRfqWiseComponent,
  //   AddClientRefComponent,
  //   EditClientRefComponent,
  //   EditRfqByIdModalComponent
  // ],
  exports : [
      // AddProductsComponent,
      // AddServicesComponent,
      // VendorContactsComponent,
      // VendorClientRefComponent,
      RfqDocumentsComponent,
      ScheduledAuctionsComponent,
      LiveAuctionsComponent,

  ]

})
export class VendorModule { }
