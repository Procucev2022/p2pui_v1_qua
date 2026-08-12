import { AuthGuard, SharedPipesModule, PageHeaderModule, StatModule } from './index';

describe('shared index', () => {
  it('should re-export AuthGuard', () => {
    expect(AuthGuard).toBeDefined();
  });

  it('should re-export SharedPipesModule', () => {
    expect(SharedPipesModule).toBeDefined();
  });

  it('should re-export module barrels', () => {
    expect(PageHeaderModule).toBeDefined();
    expect(StatModule).toBeDefined();
  });
});
