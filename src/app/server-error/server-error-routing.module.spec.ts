import { ServerErrorRoutingModule } from './server-error-routing.module';

describe('ServerErrorRoutingModule', () => {
  let module: ServerErrorRoutingModule;

  beforeEach(() => {
    module = new ServerErrorRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});
