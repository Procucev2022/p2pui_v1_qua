import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsComponent } from './analytics.component';
import { AnalyticsOverviewComponent } from './analytics-overview/analytics-overview.component';
import { AnalyticsFunnelComponent } from './analytics-funnel/analytics-funnel.component';
import { AnalyticsCategoriesComponent } from './analytics-categories/analytics-categories.component';
import { AnalyticsCalendarComponent } from './analytics-calendar/analytics-calendar.component';
import { AnalyticsConsoleComponent } from './analytics-console/analytics-console.component';

@NgModule({
  declarations: [
    AnalyticsComponent,
    AnalyticsOverviewComponent,
    AnalyticsFunnelComponent,
    AnalyticsCategoriesComponent,
    AnalyticsCalendarComponent,
    AnalyticsConsoleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AnalyticsRoutingModule
  ]
})
export class AnalyticsModule {}
