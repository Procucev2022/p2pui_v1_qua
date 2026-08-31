import { AnalyticsModule } from './analytics.module';

describe('AnalyticsModule', () => {
  it('should create an instance', () => {
    expect(new AnalyticsModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new AnalyticsModule();
    const b = new AnalyticsModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
