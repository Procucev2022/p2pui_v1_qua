import {
  AuthGuard,
  SharedPipesModule,
  PageHeaderModule,
  StatModule,
  SHARED_BARREL,
} from './index';

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

  it('should export barrel marker', () => {
    expect(SHARED_BARREL).toBe(true);
  });
});
