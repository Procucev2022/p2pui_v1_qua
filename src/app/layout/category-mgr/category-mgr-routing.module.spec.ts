import { CategoryMgrRoutingModule } from './category-mgr-routing.module';

describe('CategoryMgrRoutingModule', () => {
  let module: CategoryMgrRoutingModule;

  beforeEach(() => {
    module = new CategoryMgrRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});
