import { DashboardRoutingModule } from './dashboard-routing.module';

describe('DashboardRoutingModule', () => {
  let module: DashboardRoutingModule;

  beforeEach(() => {
    module = new DashboardRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});
