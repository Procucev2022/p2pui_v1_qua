import { createEmptyAiVendorAnalysisItem, AiVendorAnalysisItem } from './ai-vendor-analysis.model';

describe('ai-vendor-analysis model', () => {
  it('createEmptyAiVendorAnalysisItem should return a valid default object', () => {
    const item: AiVendorAnalysisItem = createEmptyAiVendorAnalysisItem();
    expect(item).toBeTruthy();
    expect(item.vendorCode).toBe('');
    expect(item.vendorName).toBe('');
    expect(item.industry).toBe('');
    expect(item.category).toBe('');
    expect(item.subCategories).toEqual([]);
    expect(item.capabilities).toEqual([]);
    expect(item.credentials.gstin.verified).toBe(false);
    expect(item.credentials.pan.verified).toBe(false);
    expect(item.qualification).toBe('Pending');
    expect(item.aiScore).toBe(0);
    expect(item.scoreBreakdown.financialStability).toBe(0);
    expect(item.suitableProcurementCategories).toEqual([]);
    expect(item.contactInfo.phone1).toBe('');
    expect(item.sourcingScope).toBe('Client Only');
    expect(item.verificationStatus).toBe('Pending Verification');
    expect(item.complianceStatus).toBe('Pending Review');
  });
});
