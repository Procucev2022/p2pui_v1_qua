import { BuyerDashboardModule } from './buyer-dashboard.module';

describe('BuyerDashboardModule', () => {
  let buyerDashboardModule: BuyerDashboardModule;

  beforeEach(() => {
    buyerDashboardModule = new BuyerDashboardModule();
  });

  it('should create an instance of BuyerDashboardModule', () => {
    expect(buyerDashboardModule).toBeTruthy();
  });
});
