import { VendorRequestModule } from './vendor-request.module';

describe('VendorRequestModule', () => {
  let vendorRequestModule: VendorRequestModule;

  beforeEach(() => {
    vendorRequestModule = new VendorRequestModule();
  });

  it('should create an instance', () => {
    expect(vendorRequestModule).toBeTruthy();
  });
});
