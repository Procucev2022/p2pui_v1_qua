import { VendorRoutingModule } from './vendor-routing.module';

describe('VendorRoutingModule', () => {
  let module: VendorRoutingModule;

  beforeEach(() => {
    module = new VendorRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});
