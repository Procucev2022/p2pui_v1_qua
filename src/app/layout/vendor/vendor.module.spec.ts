import { VendorModule } from './vendor.module';

describe('VendorModule', () => {
  it('should create an instance', () => {
    expect(new VendorModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new VendorModule();
    const b = new VendorModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
