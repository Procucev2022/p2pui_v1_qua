import { CommonShareModule } from './common-share.module';

describe('CommonShareModule', () => {
  let commonShareModule: CommonShareModule;

  beforeEach(() => {
    commonShareModule = new CommonShareModule();
  });

  it('should create an instance', () => {
    expect(commonShareModule).toBeTruthy();
  });
});
