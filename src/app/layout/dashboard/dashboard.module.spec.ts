import { DashboardModule } from './dashboard.module';

describe('DashboardModule', () => {
  it('should create an instance', () => {
    expect(new DashboardModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new DashboardModule();
    const b = new DashboardModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
