import { VendorRegistrationModule } from './vendor-registration.module';

describe('VendorRegistrationModule', () => {
  let vendorRegistrationModule: VendorRegistrationModule;

  beforeEach(() => {
    vendorRegistrationModule = new VendorRegistrationModule();
  });

  it('should create an instance', () => {
    expect(vendorRegistrationModule).toBeTruthy();
  });
});
