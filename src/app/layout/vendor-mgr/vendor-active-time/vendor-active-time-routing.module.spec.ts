import { VendorActiveTimeRoutingModule } from './vendor-active-time-routing.module';

describe('VendorActiveTimeRoutingModule', () => {
  let module: VendorActiveTimeRoutingModule;

  beforeEach(() => {
    module = new VendorActiveTimeRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});
