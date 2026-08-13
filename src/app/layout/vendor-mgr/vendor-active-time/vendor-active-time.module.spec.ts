import { VendorActiveTimeModule } from './vendor-active-time.module';

describe('VendorActiveTimeModule', () => {
  it('should create an instance', () => {
    expect(new VendorActiveTimeModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new VendorActiveTimeModule();
    const b = new VendorActiveTimeModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
