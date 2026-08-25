import { BfsModule } from './bfs.module';

describe('BfsModule', () => {
  it('should create an instance', () => {
    expect(new BfsModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new BfsModule();
    const b = new BfsModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
