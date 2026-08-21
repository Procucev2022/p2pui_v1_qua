import { ProcuceveAdminModule } from './procuceve-admin.module';

describe('ProcuceveAdminModule', () => {
  it('should create an instance', () => {
    expect(new ProcuceveAdminModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new ProcuceveAdminModule();
    const b = new ProcuceveAdminModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
