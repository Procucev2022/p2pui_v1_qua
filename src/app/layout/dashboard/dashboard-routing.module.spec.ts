import { DashboardRoutingModule } from './dashboard-routing.module';

describe('DashboardRoutingModule', () => {
  it('should create an instance', () => {
    expect(new DashboardRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new DashboardRoutingModule();
    const b = new DashboardRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
