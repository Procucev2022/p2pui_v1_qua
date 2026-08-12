import { LayoutRoutingModule } from './layout-routing.module';

describe('LayoutRoutingModule', () => {
  let module: LayoutRoutingModule;

  beforeEach(() => {
    module = new LayoutRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});
