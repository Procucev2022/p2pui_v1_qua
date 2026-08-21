import { ServerErrorModule } from './server-error.module';

describe('ServerErrorModule', () => {
  it('should create an instance', () => {
    expect(new ServerErrorModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new ServerErrorModule();
    const b = new ServerErrorModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
