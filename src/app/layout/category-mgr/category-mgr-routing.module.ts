import { NgModule } from '@angular/core';
import { CatMgrDashboardComponent } from './cat-mgr-dashboard/cat-mgr-dashboard.component';
import { CatMgrClientRegstrComponent } from './cat-mgr-client-regstr/cat-mgr-client-regstr.component';
import { CatMgrProcuRequestsComponent } from './cat-mgr-procu-requests/cat-mgr-procu-requests.component';
import { CatMgrQuotationsComponent } from './cat-mgr-quotations/cat-mgr-quotations.component';
import { CatMgrRfqsComponent } from './cat-mgr-rfqs/cat-mgr-rfqs.component';
import { CatMgrVendorRequestsComponent } from './cat-mgr-vendor-requests/cat-mgr-vendor-requests.component';
import { CatMgrVendorsComponent } from './cat-mgr-vendors/cat-mgr-vendors.component';
import { PpoReportsComponent } from 'src/app/shared/modules/common-share/components/ppo-reports/ppo-reports.component';
import { QuotCompareComponent } from 'src/app/shared/modules/common-share/components/quot-compare/quot-compare.component';
import { AuctionsComponent } from './auctions/auctions.component';
import { CatMgrItemCatalogueComponent } from './cat-mgr-item-catalogue/cat-mgr-item-catalogue.component';
import { ReportsComponent } from './reports/reports.component';
import { PrReportsComponent } from './pr-reports/pr-reports.component';
import { CatMgrCreateRfqListComponent } from './cat-mgr-create-rfq-list/cat-mgr-create-rfq-list.component';
import { CatMgrGmtSummaryComponent } from './cat-mgr-gmt-summary/cat-mgr-gmt-summary.component';
import { CatMgrVendorRfqsComponent } from './cat-mgr-vendor-rfqs/cat-mgr-vendor-rfqs.component';
import { CatMgrGmtRegisterClientsComponent } from './cat-mgr-gmt-register-clients/cat-mgr-gmt-register-clients.component';
import { CatMgrClientGmtRfqsComponent } from './cat-mgr-client-gmt-rfqs/cat-mgr-client-gmt-rfqs.component';
import { RfqSupportQueryComponent } from './rfq-support-query/rfq-support-query.component';
import { FaqsDocumentComponent } from './faqs-document/faqs-document.component';
import { CapexCatMgrQuoteComparComponent } from 'src/app/shared/modules/common-share/components/capex-cat-mgr-quote-compar/capex-cat-mgr-quote-compar.component';
import { CapexAuctionsComponent } from './capex-auctions/capex-auctions.component';
import { CapexCatMgrPostAuctionComparComponent } from 'src/app/shared/modules/common-share/components/capex-cat-mgr-post-auction-compar/capex-cat-mgr-post-auction-compar.component';
import { RouterModule, Routes } from '@angular/router';
import { VendorProfileComponent } from './vendor-profile/vendor-profile.component';
import { VendorProfileSubscriptionsComponent } from './vendor-profile-subscriptions/vendor-profile-subscriptions.component';
import { CategoryMgrVendorSummaryComponent } from './category-mgr-vendor-summary/category-mgr-vendor-summary.component';
import { CatMgrVendorCatalogueComponent } from './cat-mgr-vendor-catalogue/cat-mgr-vendor-catalogue.component';
import { CatMgrVendorTermsCondtsComponent } from './cat-mgr-vendor-terms-condts/cat-mgr-vendor-terms-condts.component';
import { GmtVendorsListComponent } from '../vendor-mgr/components/gmt-vendors-list/gmt-vendors-list.component';
import { MyCategoryListComponent } from './my-category-list/my-category-list.component';
import { SubscriptionPaymentSuccessComponent } from './subscription-payment-success/subscription-payment-success.component';
import { SubscriptionPaymentFailureComponent } from './subscription-payment-failure/subscription-payment-failure.component';
import { CategoryMgrReportsComponent } from './category-mgr-reports/category-mgr-reports.component';
export const routes: Routes = [
    { path: '', redirectTo: 'procurequests', pathMatch: 'prefix' },
    { path: 'dashboard', component: CatMgrDashboardComponent },
    { path: 'clientreg', component: CatMgrClientRegstrComponent },
    { path: 'vendorrequests', component: CatMgrVendorRequestsComponent },
    { path: 'procurequests', component: CatMgrProcuRequestsComponent },
    { path: 'quotations', component: CatMgrQuotationsComponent },
    { path: 'rfqs', component: CatMgrRfqsComponent },
    { path: 'vendors', component: CatMgrVendorsComponent },
    { path: 'quotCompare', component: QuotCompareComponent },
    { path: 'capex-quoteCompare', component : CapexCatMgrQuoteComparComponent},
    { path: 'clientReg', component: CatMgrClientRegstrComponent },
    { path: 'auctions', component: AuctionsComponent },
    { path: 'capex-auctions', component: CapexAuctionsComponent },
    { path: 'capex-post-auctions-comp', component: CapexCatMgrPostAuctionComparComponent },
    { path: 'itemCatalogueforcategorymgr', component: CatMgrItemCatalogueComponent },
    { path: 'reports', component: ReportsComponent },
    { path: 'prreports', component: PrReportsComponent },
    { path: 'pporeports', component: PpoReportsComponent },
    { path: 'create-rfq', component: CatMgrCreateRfqListComponent },
    { path: 'gmt-summary', component: CatMgrGmtSummaryComponent },
    {path: 'gmt-rqfs', component: CatMgrVendorRfqsComponent},
    {path: 'client-gmt-rqfs', component: CatMgrClientGmtRfqsComponent},
    {path: 'gmt-reg-clients', component: CatMgrGmtRegisterClientsComponent},
    {path: 'gmt-rfq-support', component: RfqSupportQueryComponent},
    {path: 'my-profile', component: VendorProfileComponent},
    {path: 'my-category-list', component: MyCategoryListComponent},
    {path: 'gmt-rfq-faqs', component: FaqsDocumentComponent},
    {path: 'vendor-profile-subscriptions', component: VendorProfileSubscriptionsComponent},
    {path: 'vendor-summary', component: CategoryMgrVendorSummaryComponent},
    {path: 'vendor-catalogue', component: CatMgrVendorCatalogueComponent},
    {path:'vendor-catalogue-terms-condts', component: CatMgrVendorTermsCondtsComponent},
    {   path: 'gmt-vendors', component: GmtVendorsListComponent},
    {path: 'payment-success', component: SubscriptionPaymentSuccessComponent},
    {path: 'cat-mgr-reports', component: CategoryMgrReportsComponent},
    {path: 'buyer-vendors', loadChildren: () => import('../buyer-vendors/buyer-vendors.module').then(m => m.BuyerVendorsModule)},
    {path: 'analytics', loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsModule)}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CategoryMgrRoutingModule { }
