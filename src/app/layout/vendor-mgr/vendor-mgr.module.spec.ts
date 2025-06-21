import { VendorMgrModule } from './vendor-mgr.module';

describe('VendorMgrModule', () => {
  let vendorMgrModule: VendorMgrModule;

  beforeEach(() => {
    vendorMgrModule = new VendorMgrModule();
  });

  it('should create an instance', () => {
    expect(vendorMgrModule).toBeTruthy();
  });
});
