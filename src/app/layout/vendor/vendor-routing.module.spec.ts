import { VendorRoutingModule } from './vendor-routing.module';

describe('VendorRoutingModule', () => {
  it('should create an instance', () => {
    expect(new VendorRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new VendorRoutingModule();
    const b = new VendorRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
