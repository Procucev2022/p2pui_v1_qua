import { AnalyticsRoutingModule, analyticsRoutes } from './analytics-routing.module';
import { AnalyticsOverviewComponent } from './analytics-overview/analytics-overview.component';
import { AnalyticsFunnelComponent } from './analytics-funnel/analytics-funnel.component';
import { AnalyticsCategoriesComponent } from './analytics-categories/analytics-categories.component';
import { AnalyticsCalendarComponent } from './analytics-calendar/analytics-calendar.component';
import { AnalyticsConsoleComponent } from './analytics-console/analytics-console.component';

describe('AnalyticsRoutingModule', () => {
  it('should create an instance', () => {
    expect(new AnalyticsRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new AnalyticsRoutingModule();
    const b = new AnalyticsRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });

  it('should redirect empty path to overview', () => {
    const children = analyticsRoutes[0].children || [];
    const redirect = children.find((c) => c.path === '');
    expect(redirect?.redirectTo).toBe('overview');
    expect(redirect?.pathMatch).toBe('full');
  });

  it('should map child routes to expected components', () => {
    const children = analyticsRoutes[0].children || [];
    const byPath: Record<string, any> = {};
    children.forEach((c) => { byPath[c.path as string] = c.component; });
    expect(byPath['overview']).toBe(AnalyticsOverviewComponent);
    expect(byPath['funnel']).toBe(AnalyticsFunnelComponent);
    expect(byPath['categories']).toBe(AnalyticsCategoriesComponent);
    expect(byPath['calendar']).toBe(AnalyticsCalendarComponent);
    expect(byPath['console']).toBe(AnalyticsConsoleComponent);
  });
});
