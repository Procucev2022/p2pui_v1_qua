import { AppModule } from './app.module';

describe('AppModule', () => {
  it('should create an instance', () => {
    expect(new AppModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new AppModule();
    const b = new AppModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
