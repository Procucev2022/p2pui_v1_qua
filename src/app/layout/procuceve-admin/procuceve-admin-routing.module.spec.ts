import { ProcuceveAdminRoutingModule } from './procuceve-admin-routing.module';

describe('ProcuceveAdminRoutingModule', () => {
  let module: ProcuceveAdminRoutingModule;

  beforeEach(() => {
    module = new ProcuceveAdminRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});
