import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CommonShareRoutingModule } from './common-share-routing.module';

import { TableModule } from 'primeng/table';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PageInfoComponent } from './components/page-info/page-info.component';
import {TooltipModule} from 'primeng/tooltip';
import { NgxDraggableDomModule } from 'ngx-draggable-dom';
import { DragDirective } from './directives/dragAndDropDirective';
import { CorrespondenceComponent } from './components/correspondence/correspondence.component';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { CommentAlertBellBlinkComponent } from './components/comment-alert-bell-blink/comment-alert-bell-blink.component';
import { QuotCompareComponent } from './components/quot-compare/quot-compare.component';
import { FilePipe } from './services/file.pipe';
import { QuotViewDetailsComponent } from './components/quot-view-details/quot-view-details.component';
import { DocGridComponent } from './components/doc-grid/doc-grid.component';
import { PpoCreateComponent } from './components/ppo-create/ppo-create.component';
import { PpoViewModalComponent } from './components/ppo-view-modal/ppo-view-modal.component';
import { PpoItemsComponent } from './components/ppos/ppo-items/ppo-items.component';
import { PrDetailsViewComponent } from './components/pr-details-view/pr-details-view.component';
import { PpoQuotCompareViewComponent } from './components/ppo-quot-compare-view/ppo-quot-compare-view.component';
import { CreateAuctionModalComponent } from './components/create-auction-modal/create-auction-modal.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatSliderModule} from '@angular/material/slider';


import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { CreateRarAuctionComponent } from './components/create-auction-modal/create-rar-auction/create-rar-auction.component';
import { CreateRaiAuctionComponent } from './components/create-auction-modal/create-rai-auction/create-rai-auction.component';
import { CreateSealedBidAuctionComponent } from './components/create-auction-modal/create-sealed-bid-auction/create-sealed-bid-auction.component';

import { PostAuctionCompareComponent } from './components/post-auction-compare/post-auction-compare.component';
import { PpoTermsConditionsComponent } from './components/ppo-terms-conditions/ppo-terms-conditions.component';
import { PpoDocumentsComponent } from './components/ppo-documents/ppo-documents.component';
import { PoCreateComponent } from './components/po/po-create/po-create.component';
import { CommonGridComponent } from './components/common-grid/common-grid.component';
import { CommonAttachmentsComponent } from './components/common-attachments/common-attachments.component';
import { FormControlErrorsMessagesDisplayComponent } from './components/form-control-errors-messages-display/form-control-errors-messages-display.component';
import { LinkedPrPpoCreateComponent } from './components/linked-pr-ppo-create/linked-pr-ppo-create.component';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { VendorSearchForLinkingComponent } from './components/vendor-search-for-linking/vendor-search-for-linking.component';
import { ClientSearchForLinkingComponent } from './components/client-search-for-linking/client-search-for-linking.component';
import {AddOrEditVendorModalComponent } from './components/add-or-edit-vendor-modal/add-or-edit-vendor-modal.component';
import { PpoReportsComponent } from './components/ppo-reports/ppo-reports.component';
import { VendorInfoIconDialogComponent } from './components/vendor-info-icon-dialog/vendor-info-icon-dialog.component';
import { TooltipModule as ngBToolTipModule  } from 'ngx-bootstrap/tooltip';
import { PpoRfqVendorsComponent } from './components/ppo-rfq-vendors/ppo-rfq-vendors.component';
import { SubCategoryDropdownComponent } from './components/sub-category-dropdown/sub-category-dropdown.component';
import { PriceAnalyticsGraphModalComponent } from './price-analytics-graph-modal/price-analytics-graph-modal.component';
import { PriceTrendChartComponent } from 'src/app/layout/client/price-trend-chart/price-trend-chart.component';
import { AuthenticateLoggedUserComponent } from './components/authenticate-logged-user/authenticate-logged-user.component';
// import {ToggleButtonModule} from 'primeng/togglebutton';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { BlockCopyPasteDirective } from './directives/block-copy-paste.directive';
import { GmtVendorInfoModalComponent } from './components/gmt-vendor-info-modal/gmt-vendor-info-modal.component';
import { DownloadAttachmentsComponent } from './components/download-attachments/download-attachments.component';
import { QuotCompareViewComponent } from './components/quot-compare-view/quot-compare-view.component';
import { CapexCatMgrQuoteComparComponent } from './components/capex-cat-mgr-quote-compar/capex-cat-mgr-quote-compar.component';
import { ProCpxVendorSummaryComponent } from './components/pro-cpx-vendor-summary/pro-cpx-vendor-summary.component';
import { ProCpxVendorPPOsComponent } from './components/pro-cpx-vendor-summary/pro-cpx-vendor-ppos/pro-cpx-vendor-ppos.component';

import { ProCpxVendorSummaryClientsComponent } from './components/pro-cpx-vendor-summary-clients/pro-cpx-vendor-summary-clients.component';
import { ProCpxVendorSummaryLayoutComponent } from './components/pro-cpx-vendor-summary-layout/pro-cpx-vendor-summary-layout.component';
import { MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MultiSelectModule } from 'primeng/multiselect';
import { AccordionModule } from 'primeng/accordion';
import { SidebarModule } from 'primeng/sidebar';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { StepsModule } from 'primeng/steps';
import { ChartModule} from 'primeng/chart';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RatingModule } from 'ngx-bootstrap/rating';
import { ConfirmationService } from 'primeng/api';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VendorViewModelComponent } from './components/vendor-view-model/vendor-view-model.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeTableModule } from 'primeng/treetable';
import { PincodeControlComponent } from './components/pincode-control/pincode-control.component';
import { VendorChooseModalPopupComponent } from './components/vendor-choose-modal-popup/vendor-choose-modal-popup.component';

// import { AgGridAngular } from 'ag-grid-angular';
@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        CommonModule,
        CommonShareRoutingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatGridListModule,
        MatCardModule,
        MatDividerModule,
        MatGridListModule,
        MatTabsModule,
        MatExpansionModule,
        TableModule,
        FormsModule,
        ReactiveFormsModule,
        // NgxDraggableDomModule,
        SelectDropDownModule,
        MatCardModule,
        MatRadioModule,
        MatSlideToggleModule,
        TooltipModule,
        MultiSelectModule,
        DropdownModule,
        AutoCompleteModule,
        OverlayPanelModule,
        ngBToolTipModule,
        AccordionModule,
        NgbModule,
        SidebarModule,
        CalendarModule,
        DialogModule,
        ChartModule,
        StepsModule,
        // ToggleButtonModule,
        MatButtonToggleModule,
        ConfirmDialogModule,
        RatingModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        TreeTableModule,
        // AgGridAngular
        OverlayPanelModule 
    ],

    declarations: [PageInfoComponent, DragDirective, CorrespondenceComponent,  CommentAlertBellBlinkComponent, QuotCompareComponent, FilePipe, QuotViewDetailsComponent, DocGridComponent, PpoCreateComponent, PpoViewModalComponent, PpoItemsComponent, PrDetailsViewComponent, PpoQuotCompareViewComponent, CreateAuctionModalComponent, NumbersOnlyDirective, CreateRarAuctionComponent, CreateRaiAuctionComponent, CreateSealedBidAuctionComponent, PostAuctionCompareComponent, PpoTermsConditionsComponent, PpoDocumentsComponent, PoCreateComponent, CommonGridComponent, CommonAttachmentsComponent, FormControlErrorsMessagesDisplayComponent, VendorSearchForLinkingComponent, ClientSearchForLinkingComponent, LinkedPrPpoCreateComponent, AddOrEditVendorModalComponent, PpoReportsComponent,  VendorInfoIconDialogComponent, PpoRfqVendorsComponent, SubCategoryDropdownComponent, PriceAnalyticsGraphModalComponent, PriceTrendChartComponent, AuthenticateLoggedUserComponent, BlockCopyPasteDirective,
        GmtVendorInfoModalComponent,
        DownloadAttachmentsComponent, QuotCompareViewComponent,
        CapexCatMgrQuoteComparComponent,
        ProCpxVendorSummaryComponent,ProCpxVendorPPOsComponent, ProCpxVendorSummaryClientsComponent, ProCpxVendorSummaryLayoutComponent, VendorViewModelComponent, PincodeControlComponent, VendorChooseModalPopupComponent],
    exports: [
        DialogModule,
        CommonModule,
        CommonShareRoutingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatGridListModule,
        MatCardModule,
        MatDividerModule,
        MatGridListModule,
        MatTabsModule,
        MatExpansionModule,
        TableModule,
        FormsModule,
        ReactiveFormsModule,
        PageInfoComponent,
        // NgxDraggableDomModule,
        DragDirective,
        SelectDropDownModule,
        CommentAlertBellBlinkComponent,
        QuotCompareComponent,
        PpoViewModalComponent,
        FilePipe,
        PrDetailsViewComponent,
        MatRadioModule,
        MatSliderModule,
        CommonGridComponent,
        MultiSelectModule,
        CommonAttachmentsComponent,
        FormControlErrorsMessagesDisplayComponent,
        DropdownModule,
        AutoCompleteModule,
        AddOrEditVendorModalComponent,
        VendorInfoIconDialogComponent,
        OverlayPanelModule,
        ngBToolTipModule,
        NgbModule,
        AccordionModule ,
        SubCategoryDropdownComponent,
        SidebarModule,
        CalendarModule,
        ChartModule,
        PriceAnalyticsGraphModalComponent,
        PriceTrendChartComponent,
        StepsModule,
        AuthenticateLoggedUserComponent,
        // ToggleButtonModule,
        MatButtonToggleModule,
        BlockCopyPasteDirective,
        GmtVendorInfoModalComponent,
        DownloadAttachmentsComponent,
        ConfirmDialogModule,
        QuotCompareViewComponent,
        ProCpxVendorPPOsComponent,
        RatingModule,
        ProCpxVendorSummaryClientsComponent,
        ProCpxVendorSummaryComponent,
        CorrespondenceComponent,
        FormsModule,
        ReactiveFormsModule,
        VendorViewModelComponent,
        TreeTableModule,
        PincodeControlComponent,
        VendorChooseModalPopupComponent,
        OverlayPanelModule 

    ],
    providers: [
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
        DatePipe,
        ConfirmationService
    ]
    // entryComponents: CorrespondenceComponent,
    //     VendorSearchComponent,
    //     CommentAlertBellBlinkComponent,
    //     QuotViewDetailsComponent,
    //     PpoCreateComponent,
    //     PpoViewModalComponent,
    //     CreateAuctionModalComponent,
    //     PoCreateComponent,
    //     LinkedPrPpoCreateComponent,
    //     VendorViewModelComponent,
    //     AddOrEditVendorModalComponent,
    //     PriceAnalyticsGraphModalComponent,
    //     AuthenticateLoggedUserComponent,
    //     ProCpxVendorPPOsComponent
    // ]
})
export class CommonShareModule { }
