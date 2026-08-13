import { CommonShareModule } from './common-share.module';

describe('CommonShareModule', () => {
  it('should create an instance', () => {
    expect(new CommonShareModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new CommonShareModule();
    const b = new CommonShareModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
