import { VendorRequestRoutingModule } from './vendor-request-routing,module';

describe('VendorRequestRoutingModule', () => {
  it('should create an instance', () => {
    expect(new VendorRequestRoutingModule()).toBeTruthy();
  });

  it('should be constructible', () => {
    expect(new VendorRequestRoutingModule()).toEqual(jasmine.any(VendorRequestRoutingModule));
  });
});
