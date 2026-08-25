import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsComponent } from './analytics.component';
import { AnalyticsOverviewComponent } from './analytics-overview/analytics-overview.component';
import { AnalyticsFunnelComponent } from './analytics-funnel/analytics-funnel.component';
import { AnalyticsCategoriesComponent } from './analytics-categories/analytics-categories.component';
import { AnalyticsCalendarComponent } from './analytics-calendar/analytics-calendar.component';
import { AnalyticsConsoleComponent } from './analytics-console/analytics-console.component';

const routes: Routes = [
  {
    path: '',
    component: AnalyticsComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: AnalyticsOverviewComponent },
      { path: 'funnel', component: AnalyticsFunnelComponent },
      { path: 'categories', component: AnalyticsCategoriesComponent },
      { path: 'calendar', component: AnalyticsCalendarComponent },
      { path: 'console', component: AnalyticsConsoleComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule {}
