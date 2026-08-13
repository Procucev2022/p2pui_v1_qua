import { SignupRoutingModule } from './signup-routing.module';

describe('SignupRoutingModule', () => {
  it('should create an instance', () => {
    expect(new SignupRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new SignupRoutingModule();
    const b = new SignupRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
