import { VendorRegistrationRoutingModule } from './vendor-registration-routing.module';

describe('VendorRegistrationRoutingModule', () => {
  it('should create an instance', () => {
    expect(new VendorRegistrationRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new VendorRegistrationRoutingModule();
    const b = new VendorRegistrationRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
