import { CategoryRoutingModule } from './category-routing.module';

describe('CategoryRoutingModule', () => {
  let module: CategoryRoutingModule;

  beforeEach(() => {
    module = new CategoryRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});
