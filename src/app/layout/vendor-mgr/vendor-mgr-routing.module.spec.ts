import { VendorMgrRoutingModule } from './vendor-mgr-routing.module';

describe('VendorMgrRoutingModule', () => {
  let module: VendorMgrRoutingModule;

  beforeEach(() => {
    module = new VendorMgrRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});
