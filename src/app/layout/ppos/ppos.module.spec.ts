import { PposModule } from './ppos.module';

describe('PposModule', () => {
  it('should create an instance', () => {
    expect(new PposModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new PposModule();
    const b = new PposModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
