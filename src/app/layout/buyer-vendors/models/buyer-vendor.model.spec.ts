import { INDUSTRY_TYPES, VENDOR_GROUPS, SOURCING_SCOPES } from './buyer-vendor.model';

describe('buyer-vendor model', () => {
  it('should export expected industry types constants', () => {
    expect(INDUSTRY_TYPES).toBeDefined();
    expect(INDUSTRY_TYPES.length).toBeGreaterThan(0);
    expect(INDUSTRY_TYPES).toContain('MRO');
    expect(INDUSTRY_TYPES).toContain('Manufacturing');
  });

  it('should export expected vendor groups constants', () => {
    expect(VENDOR_GROUPS).toBeDefined();
    expect(VENDOR_GROUPS).toEqual(['Z001', 'Z002', 'Z003', 'Z004']);
  });

  it('should export expected sourcing scopes constants', () => {
    expect(SOURCING_SCOPES).toBeDefined();
    expect(SOURCING_SCOPES).toEqual(['Client Only', 'Client+Procucev']);
  });
});
