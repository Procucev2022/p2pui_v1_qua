import { ServerErrorRoutingModule } from './server-error-routing.module';

describe('ServerErrorRoutingModule', () => {
  it('should create an instance', () => {
    expect(new ServerErrorRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new ServerErrorRoutingModule();
    const b = new ServerErrorRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
