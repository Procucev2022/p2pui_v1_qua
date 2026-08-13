import { AuthGuard, SHARED_GUARD_BARREL } from './index';

describe('shared/guard index', () => {
  it('should export AuthGuard', () => {
    expect(AuthGuard).toBeDefined();
  });

  it('should export barrel marker', () => {
    expect(SHARED_GUARD_BARREL).toBe(true);
  });
});
