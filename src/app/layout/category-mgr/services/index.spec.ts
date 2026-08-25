import {
  CatProcuRequestsService,
  CatProcuQuotationsService,
  CATEGORY_MGR_SERVICES_BARREL,
} from './index';

describe('category-mgr/services index', () => {
  it('should export CatProcuRequestsService', () => {
    expect(CatProcuRequestsService).toBeDefined();
  });

  it('should export CatProcuQuotationsService', () => {
    expect(CatProcuQuotationsService).toBeDefined();
  });

  it('should export barrel marker', () => {
    expect(CATEGORY_MGR_SERVICES_BARREL).toBe(true);
  });
});
