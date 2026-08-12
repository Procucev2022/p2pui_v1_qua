import { AuthGuard } from './index';

describe('shared/guard index', () => {
  it('should export AuthGuard', () => {
    expect(AuthGuard).toBeDefined();
  });
});
