import { VendorRegistrationRoutingModule } from './vendor-registration-routing.module';

describe('VendorRegistrationRoutingModule', () => {
  let module: VendorRegistrationRoutingModule;

  beforeEach(() => {
    module = new VendorRegistrationRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});
