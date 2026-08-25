import { PosRoutingModule } from './pos-routing.module';

describe('PosRoutingModule', () => {
  it('should create an instance', () => {
    expect(new PosRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new PosRoutingModule();
    const b = new PosRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
