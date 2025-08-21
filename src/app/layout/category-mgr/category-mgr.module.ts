import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TooltipModule} from 'primeng/tooltip';
import { CategoryMgrRoutingModule } from './category-mgr-routing.module';
import { CatMgrDashboardComponent } from './cat-mgr-dashboard/cat-mgr-dashboard.component';
import { CatMgrClientRegstrComponent } from './cat-mgr-client-regstr/cat-mgr-client-regstr.component';
import { CatMgrProcuRequestsComponent } from './cat-mgr-procu-requests/cat-mgr-procu-requests.component';
import { CatMgrQuotationsComponent } from './cat-mgr-quotations/cat-mgr-quotations.component';
import { CatMgrRfqsComponent } from './cat-mgr-rfqs/cat-mgr-rfqs.component';
import { CatMgrVendorRequestsComponent } from './cat-mgr-vendor-requests/cat-mgr-vendor-requests.component';
import { CatMgrVendorsComponent } from './cat-mgr-vendors/cat-mgr-vendors.component';
import { CommonShareModule } from 'src/app/shared/modules/common-share/common-share.module';
import { CatMgrRfqTabComponent } from './cat-mgr-rfq-tab/cat-mgr-rfq-tab.component';
import { CatMgrPrLineItemsTabComponent } from './cat-mgr-pr-line-items-tab/cat-mgr-pr-line-items-tab.component';
import { CatMgrQuotationsSubTabComponent } from './subTab/cat-mgr-quotations-sub-tab/cat-mgr-quotations-sub-tab.component';
import { CatMgrRfqsLineItemsSubTabComponent } from './subTab/cat-mgr-rfqs-line-items-sub-tab/cat-mgr-rfqs-line-items-sub-tab.component';
import { CatMgrVendorsSubTabComponent } from './subTab/cat-mgr-vendors-sub-tab/cat-mgr-vendors-sub-tab.component';
import { CatMgrVendorSearchComponent } from './cat-mgr-vendor-search/cat-mgr-vendor-search.component';
import { CatMgrQuotSubTabLineItemsComponent } from './cat-mgr-quotations/cat-mgr-quot-sub-tab-line-items/cat-mgr-quot-sub-tab-line-items.component';
import { CatMgrQuotSubTabPrDetailsComponent } from './cat-mgr-quotations/cat-mgr-quot-sub-tab-pr-details/cat-mgr-quot-sub-tab-pr-details.component';
import { CatMgrQuotSubTabVendorsComponent } from './cat-mgr-quotations/cat-mgr-quot-sub-tab-vendors/cat-mgr-quot-sub-tab-vendors.component';
import { CatMgrQuotSubTabRfqsComponent } from './cat-mgr-quotations/cat-mgr-quot-sub-tab-rfqs/cat-mgr-quot-sub-tab-rfqs.component';
import { VendorModule } from '../vendor/vendor.module';
import { ClientModule } from '../client/client.module';
import { AuctionsComponent } from './auctions/auctions.component';
import { AuctionBidItemsComponent } from './auction-bid-items/auction-bid-items.component';
import { AuctionBidsComponent } from './auction-bids/auction-bids.component';
import { AuctionBidDetailsComponent } from './auctions/auction-bid-details/auction-bid-details.component';
import { CatMgrItemCatalogueComponent } from './cat-mgr-item-catalogue/cat-mgr-item-catalogue.component';
import { CountdownModule } from 'ngx-countdown';
import { ReportsComponent } from './reports/reports.component';
import { PrReportsComponent } from './pr-reports/pr-reports.component';
import { CatMgrCreateRfqListComponent } from './cat-mgr-create-rfq-list/cat-mgr-create-rfq-list.component';
import { CatMgrCreateRfqVendorDetailsComponent } from './cat-mgr-create-rfq-vendor-details/cat-mgr-create-rfq-vendor-details.component';
import { CatMgrCommonGridComponent } from './cat-mgr-common-grid/cat-mgr-common-grid.component';
import { CatMgrGmtSummaryComponent } from './cat-mgr-gmt-summary/cat-mgr-gmt-summary.component';
import { CatMgrVendorRfqsComponent } from './cat-mgr-vendor-rfqs/cat-mgr-vendor-rfqs.component';
import { CatMgrGmtRegisterClientsComponent } from './cat-mgr-gmt-register-clients/cat-mgr-gmt-register-clients.component';
import { CatMgrClientGmtRfqsComponent } from './cat-mgr-client-gmt-rfqs/cat-mgr-client-gmt-rfqs.component';
import { CreateRFQSharedComponent } from './create-rfq-shared/create-rfq-shared.component';
import { RfqSupportQueryComponent } from './rfq-support-query/rfq-support-query.component';
import { FaqsDocumentComponent } from './faqs-document/faqs-document.component';
import { CapexAuctionsComponent } from './capex-auctions/capex-auctions.component';
import { CapexCatMgrPostAuctionComparComponent } from 'src/app/shared/modules/common-share/components/capex-cat-mgr-post-auction-compar/capex-cat-mgr-post-auction-compar.component';
import { VendorProfileComponent } from './vendor-profile/vendor-profile.component';



@NgModule({
    imports: [CommonModule, CategoryMgrRoutingModule, CommonShareModule, VendorModule, ClientModule, TooltipModule, CountdownModule,

        // NgxMatDatetimePickerModule,
        // NgxMatTimepickerModule,
        // NgxMatNativeDateModule,

    ],
    declarations: [
        CatMgrDashboardComponent,
        CatMgrClientRegstrComponent,
        CatMgrProcuRequestsComponent,
        CatMgrQuotationsComponent,
        CatMgrRfqsComponent,
        CatMgrVendorRequestsComponent,
        CatMgrVendorsComponent,
        CatMgrRfqTabComponent,
        CatMgrPrLineItemsTabComponent,
        CatMgrQuotationsSubTabComponent,
        CatMgrRfqsLineItemsSubTabComponent,
        CatMgrVendorsSubTabComponent,
        CatMgrVendorSearchComponent,
        CatMgrQuotSubTabLineItemsComponent,
        CatMgrQuotSubTabPrDetailsComponent,
        CatMgrQuotSubTabVendorsComponent,
        CatMgrQuotSubTabRfqsComponent,
        AuctionsComponent,
        AuctionBidItemsComponent,
        AuctionBidsComponent,
        AuctionBidDetailsComponent,
        CatMgrItemCatalogueComponent,
        ReportsComponent,
        PrReportsComponent,
        CatMgrCreateRfqListComponent,
        CatMgrCreateRfqVendorDetailsComponent,
        CatMgrCommonGridComponent,
        CatMgrGmtSummaryComponent,
        CatMgrVendorRfqsComponent,
        CatMgrGmtRegisterClientsComponent,
        CatMgrClientGmtRfqsComponent,
        CreateRFQSharedComponent,
        RfqSupportQueryComponent,
        FaqsDocumentComponent,
        CapexAuctionsComponent,
        CapexCatMgrPostAuctionComparComponent,
        VendorProfileComponent
    ],
    exports:[ ],
    // entryComponents: [CatMgrVendorSearchComponent]
})
export class CategoryMgrModule {}
