import { PageHeaderModule } from './page-header.module';

describe('PageHeaderModule', () => {
  it('should create an instance', () => {
    expect(new PageHeaderModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new PageHeaderModule();
    const b = new PageHeaderModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
