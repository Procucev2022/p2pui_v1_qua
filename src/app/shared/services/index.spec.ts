import { EncryDecryService, SHARED_SERVICES_BARREL } from './index';

describe('shared/services index', () => {
  it('should export EncryDecryService', () => {
    expect(EncryDecryService).toBeDefined();
  });

  it('should export barrel marker', () => {
    expect(SHARED_SERVICES_BARREL).toBe(true);
  });
});
