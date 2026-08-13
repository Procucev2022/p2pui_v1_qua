import { StatModule } from './stat.module';

describe('StatModule', () => {
  it('should create an instance', () => {
    expect(new StatModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new StatModule();
    const b = new StatModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
