import { SignupModule } from './signup.module';

describe('SignupModule', () => {
  it('should create an instance', () => {
    expect(new SignupModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new SignupModule();
    const b = new SignupModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
