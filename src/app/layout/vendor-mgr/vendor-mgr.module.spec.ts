import { VendorMgrModule } from './vendor-mgr.module';

describe('VendorMgrModule', () => {
  it('should create an instance', () => {
    expect(new VendorMgrModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new VendorMgrModule();
    const b = new VendorMgrModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
