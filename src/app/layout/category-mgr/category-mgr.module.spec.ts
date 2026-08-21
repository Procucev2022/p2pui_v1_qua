import { CategoryMgrModule } from './category-mgr.module';

describe('CategoryMgrModule', () => {
  it('should create an instance', () => {
    expect(new CategoryMgrModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new CategoryMgrModule();
    const b = new CategoryMgrModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
