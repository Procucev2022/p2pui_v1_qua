import { SHARED_GUARD_BARREL } from './index';
import { AuthGuard } from './auth.guard';

describe('shared/guard barrel', () => {
  it('should export SHARED_GUARD_BARREL as true', () => {
    expect(SHARED_GUARD_BARREL).toBe(true);
  });

  it('should export AuthGuard', () => {
    expect(AuthGuard).toBeDefined();
  });
});
