import { VendorActiveTimeModule } from './vendor-active-time.module';

describe('VendorActiveTimeModule', () => {
  let vendorActiveTimeModule: VendorActiveTimeModule;

  beforeEach(() => {
    vendorActiveTimeModule = new VendorActiveTimeModule();
  });

  it('should create an instance', () => {
    expect(vendorActiveTimeModule).toBeTruthy();
  });
});
