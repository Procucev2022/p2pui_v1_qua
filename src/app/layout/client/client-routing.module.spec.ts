import { ClientRoutingModule } from './client-routing.module';

describe('ClientRoutingModule', () => {
  it('should create an instance', () => {
    expect(new ClientRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new ClientRoutingModule();
    const b = new ClientRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
