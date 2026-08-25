import { ConfigurationsModule } from './configurations.module';

describe('ConfigurationsModule', () => {
  it('should create an instance', () => {
    expect(new ConfigurationsModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new ConfigurationsModule();
    const b = new ConfigurationsModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
