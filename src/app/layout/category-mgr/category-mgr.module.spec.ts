import { CategoryMgrModule } from './category-mgr.module';

describe('CategoryMgrModule', () => {
  let categoryMgrModule: CategoryMgrModule;

  beforeEach(() => {
    categoryMgrModule = new CategoryMgrModule();
  });

  it('should create an instance', () => {
    expect(categoryMgrModule).toBeTruthy();
  });
});
