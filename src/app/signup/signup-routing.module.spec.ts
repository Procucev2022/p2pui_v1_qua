import { SignupRoutingModule } from './signup-routing.module';

describe('SignupRoutingModule', () => {
  let module: SignupRoutingModule;

  beforeEach(() => {
    module = new SignupRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});
