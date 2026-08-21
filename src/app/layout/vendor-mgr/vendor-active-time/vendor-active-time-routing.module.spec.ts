import { VendorActiveTimeRoutingModule } from './vendor-active-time-routing.module';

describe('VendorActiveTimeRoutingModule', () => {
  it('should create an instance', () => {
    expect(new VendorActiveTimeRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new VendorActiveTimeRoutingModule();
    const b = new VendorActiveTimeRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
