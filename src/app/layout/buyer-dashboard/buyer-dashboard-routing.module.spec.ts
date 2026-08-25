import { BuyerDashboardRoutingModule, routes } from './buyer-dashboard-routing.module';

describe('BuyerDashboardRoutingModule', () => {
  it('should define routes for buyer dashboard, command center, ingestion wizard, and quote matrix', () => {
    expect(routes).toBeDefined();
    expect(routes[0].path).toBe('');
    expect(routes[0].children?.length).toBe(4);
  });
});
