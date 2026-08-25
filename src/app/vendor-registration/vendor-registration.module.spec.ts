import { VendorRegistrationModule } from './vendor-registration.module';

describe('VendorRegistrationModule', () => {
  it('should create an instance', () => {
    expect(new VendorRegistrationModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new VendorRegistrationModule();
    const b = new VendorRegistrationModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
