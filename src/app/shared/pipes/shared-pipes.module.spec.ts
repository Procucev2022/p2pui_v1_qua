import { SharedPipesModule } from './shared-pipes.module';

describe('SharedPipesModule', () => {
  it('should create an instance', () => {
    expect(new SharedPipesModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new SharedPipesModule();
    const b = new SharedPipesModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});
