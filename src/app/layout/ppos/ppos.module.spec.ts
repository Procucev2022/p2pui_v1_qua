import { PposModule } from './ppos.module';

describe('PposModule', () => {
  let pposModule: PposModule;

  beforeEach(() => {
    pposModule = new PposModule();
  });

  it('should create an instance', () => {
    expect(pposModule).toBeTruthy();
  });
});
