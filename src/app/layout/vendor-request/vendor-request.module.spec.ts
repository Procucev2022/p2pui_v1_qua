import { VendorRequestModule } from './vendor-request.module';

describe('VendorRequestModule', () => {
  it('should create an instance', () => {
    expect(new VendorRequestModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new VendorRequestModule();
    const b = new VendorRequestModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
