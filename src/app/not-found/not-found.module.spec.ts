import { NotFoundModule } from './not-found.module';

describe('NotFoundModule', () => {
  it('should create an instance', () => {
    expect(new NotFoundModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new NotFoundModule();
    const b = new NotFoundModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
