import { CategoryMgrRoutingModule } from './category-mgr-routing.module';

describe('CategoryMgrRoutingModule', () => {
  it('should create an instance', () => {
    expect(new CategoryMgrRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new CategoryMgrRoutingModule();
    const b = new CategoryMgrRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
