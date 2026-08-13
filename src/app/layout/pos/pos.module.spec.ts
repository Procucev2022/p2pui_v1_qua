import { PosModule } from './pos.module';

describe('PosModule', () => {
  it('should create an instance', () => {
    expect(new PosModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new PosModule();
    const b = new PosModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
