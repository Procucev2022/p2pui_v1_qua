import { PageHeaderModule, StatModule, SHARED_MODULES_BARREL } from './index';

describe('shared/modules index', () => {
  it('should export PageHeaderModule', () => {
    expect(PageHeaderModule).toBeDefined();
  });

  it('should export StatModule', () => {
    expect(StatModule).toBeDefined();
  });

  it('should export barrel marker', () => {
    expect(SHARED_MODULES_BARREL).toBe(true);
  });
});
