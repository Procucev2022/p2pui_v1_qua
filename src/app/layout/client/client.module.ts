import { NgModule } from '@angular/core';

import { ClientRoutingModule } from './client-routing.module';
import { ClientProfileComponent } from './client-profile/client-profile.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { ClientPposComponent } from './client-ppos/client-ppos.component';
import { ClientProcureRequestComponent } from './client-procure-request/client-procure-request.component';
import { CommonShareModule } from 'src/app/shared/modules/common-share/common-share.module';
import { CreatePrModalComponent } from './components/create-pr-modal/create-pr-modal.component';
import { AlphabetOnlyDirective } from './components/alphabet-only.directive';
import { ViewPrModalComponent } from './components/view-pr-modal/view-pr-modal.component';
import { ViewPRIdDetailsComponent } from './components/view-pr-id-details/view-pr-id-details.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PrViewModalComponent } from './components/pr-view-modal/pr-view-modal.component';
import { AcceptPrViewComponent } from './components/accept-pr-view/accept-pr-view.component';
import { ItemCatalogueComponent } from './item-catalogue/item-catalogue.component';
import { PrItemsGridPanelComponent } from './components/pr-items-grid-panel/pr-items-grid-panel.component';
import { ClientAnalyticsInfoComponent } from './client-analytics-info/client-analytics-info.component';
import { PrLeadTimeChartComponent } from './pr-lead-time-chart/pr-lead-time-chart.component';
import { AuctionsChartComponent } from './auctions-chart/auctions-chart.component';
import { PrPpoChartComponent } from './pr-ppo-chart/pr-ppo-chart.component';
import { ClientProcureRequestCapexComponent } from './client-procure-request-capex/client-procure-request-capex.component';
import { CreatePrModalNewComponent } from './components/create-pr-modal-new/create-pr-modal-new.component';
import { PrItemsGridPanelCapexComponent } from './components/pr-items-grid-panel-capex/pr-items-grid-panel-capex.component';
import { ClientProcureRequestOpexComponent } from './client-procure-request-opex/client-procure-request-opex.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    CommonModule,
    ClientRoutingModule,
    CommonShareModule, ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    ClientProfileComponent,
    ClientDashboardComponent,
    ClientPposComponent,
    ClientProcureRequestComponent,
    ClientProcureRequestOpexComponent,
    ClientProcureRequestCapexComponent,
    CreatePrModalComponent,
    CreatePrModalNewComponent,
    AlphabetOnlyDirective,
    ViewPrModalComponent,
    ViewPRIdDetailsComponent,
    PrViewModalComponent,
    AcceptPrViewComponent,
    ItemCatalogueComponent,
    PrItemsGridPanelComponent,
    ClientAnalyticsInfoComponent,
    PrLeadTimeChartComponent,
    AuctionsChartComponent,
    PrPpoChartComponent,
    PrItemsGridPanelCapexComponent
  ],
  // entryComponents: [ViewPrModalComponent, PrViewModalComponent, AcceptPrViewComponent]
})
export class ClientModule { }
