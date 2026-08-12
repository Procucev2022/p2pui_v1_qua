import { ClientRoutingModule } from './client-routing.module';

describe('ClientRoutingModule', () => {
  let module: ClientRoutingModule;

  beforeEach(() => {
    module = new ClientRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});
