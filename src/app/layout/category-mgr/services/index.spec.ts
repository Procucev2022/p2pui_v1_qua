import { CatProcuRequestsService, CatProcuQuotationsService } from './index';

describe('category-mgr/services index', () => {
  it('should export CatProcuRequestsService', () => {
    expect(CatProcuRequestsService).toBeDefined();
  });

  it('should export CatProcuQuotationsService', () => {
    expect(CatProcuQuotationsService).toBeDefined();
  });
});
