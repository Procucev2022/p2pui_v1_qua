import { CategoryModule } from './category.module';

describe('CategoryModule', () => {
  it('should create an instance', () => {
    expect(new CategoryModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new CategoryModule();
    const b = new CategoryModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
