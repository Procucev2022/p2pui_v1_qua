import { PO } from './po.model';

describe('PO model', () => {
  it('should create an instance with assignable fields', () => {
    const po = new PO();
    po.poValue = 100;
    po.desc = 'desc';
    po.advanceAmount = 10;
    po.clientPONum = 'PO-1';
    po.podesc = 'podesc';
    po.otherTerms = 'other';
    po.paymentTerms = 'net30';
    po.deliveryTerms = 'standard';
    po.vendorAddress = { city: 'X' };
    po.note = 'note';
    po.frieghtTerms = 'freight';
    po.warranty = '1y';
    expect(po.poValue).toBe(100);
    expect(po.clientPONum).toBe('PO-1');
    expect(po.vendorAddress.city).toBe('X');
  });
});
