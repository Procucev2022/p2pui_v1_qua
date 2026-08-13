import { ConfigurationsRoutingModule } from './configurations-routing.module';

describe('ConfigurationsRoutingModule', () => {
  it('should create an instance', () => {
    expect(new ConfigurationsRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new ConfigurationsRoutingModule();
    const b = new ConfigurationsRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
