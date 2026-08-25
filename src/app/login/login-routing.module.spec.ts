import { LoginRoutingModule } from './login-routing.module';

describe('LoginRoutingModule', () => {
  it('should create an instance', () => {
    expect(new LoginRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new LoginRoutingModule();
    const b = new LoginRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
