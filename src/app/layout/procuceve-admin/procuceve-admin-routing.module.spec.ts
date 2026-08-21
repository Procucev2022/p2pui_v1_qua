import { ProcuceveAdminRoutingModule } from './procuceve-admin-routing.module';

describe('ProcuceveAdminRoutingModule', () => {
  it('should create an instance', () => {
    expect(new ProcuceveAdminRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new ProcuceveAdminRoutingModule();
    const b = new ProcuceveAdminRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
