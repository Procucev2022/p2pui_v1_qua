import { LoginRoutingModule } from './login-routing.module';

describe('LoginRoutingModule', () => {
  let module: LoginRoutingModule;

  beforeEach(() => {
    module = new LoginRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});
