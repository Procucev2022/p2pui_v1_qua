import { ProcuceveAdminModule } from './procuceve-admin.module';

describe('ProcuceveAdminModule', () => {
  let procuceveAdminModule: ProcuceveAdminModule;

  beforeEach(() => {
    procuceveAdminModule = new ProcuceveAdminModule();
  });

  it('should create an instance', () => {
    expect(procuceveAdminModule).toBeTruthy();
  });
});
