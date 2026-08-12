import { PposRoutingModule } from './ppos-routing.module';

describe('PposRoutingModule', () => {
  let module: PposRoutingModule;

  beforeEach(() => {
    module = new PposRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});
