import { VendorMgrRoutingModule } from './vendor-mgr-routing.module';

describe('VendorMgrRoutingModule', () => {
  it('should create an instance', () => {
    expect(new VendorMgrRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new VendorMgrRoutingModule();
    const b = new VendorMgrRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
