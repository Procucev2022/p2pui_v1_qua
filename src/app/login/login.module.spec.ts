import { LoginModule } from './login.module';

describe('LoginModule', () => {
  it('should create an instance', () => {
    expect(new LoginModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new LoginModule();
    const b = new LoginModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
