import { LayoutModule } from './layout.module';

describe('LayoutModule', () => {
  it('should create an instance', () => {
    expect(new LayoutModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new LayoutModule();
    const b = new LayoutModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
