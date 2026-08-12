import { ConfigurationsRoutingModule } from './configurations-routing.module';

describe('ConfigurationsRoutingModule', () => {
  let module: ConfigurationsRoutingModule;

  beforeEach(() => {
    module = new ConfigurationsRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});
