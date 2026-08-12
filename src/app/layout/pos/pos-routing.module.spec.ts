import { PosRoutingModule } from './pos-routing.module';

describe('PosRoutingModule', () => {
  let module: PosRoutingModule;

  beforeEach(() => {
    module = new PosRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});
