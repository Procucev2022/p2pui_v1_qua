import { PageHeaderModule, StatModule } from './index';

describe('shared/modules index', () => {
  it('should export PageHeaderModule', () => {
    expect(PageHeaderModule).toBeDefined();
  });

  it('should export StatModule', () => {
    expect(StatModule).toBeDefined();
  });
});
