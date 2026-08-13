import { PposRoutingModule } from './ppos-routing.module';

describe('PposRoutingModule', () => {
  it('should create an instance', () => {
    expect(new PposRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new PposRoutingModule();
    const b = new PposRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
