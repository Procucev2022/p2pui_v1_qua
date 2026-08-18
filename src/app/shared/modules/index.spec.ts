import { SHARED_MODULES_BARREL } from './index';

describe('shared/modules barrel', () => {
  it('should export SHARED_MODULES_BARREL as true', () => {
    expect(SHARED_MODULES_BARREL).toBe(true);
  });
});
