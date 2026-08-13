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
    expect(po.desc).toBe('desc');
    expect(po.advanceAmount).toBe(10);
    expect(po.podesc).toBe('podesc');
    expect(po.otherTerms).toBe('other');
    expect(po.paymentTerms).toBe('net30');
    expect(po.deliveryTerms).toBe('standard');
    expect(po.note).toBe('note');
    expect(po.frieghtTerms).toBe('freight');
    expect(po.warranty).toBe('1y');
  });

  it('should allow constructing multiple independent instances', () => {
    const a = new PO();
    const b = new PO();
    a.clientPONum = 'A';
    b.clientPONum = 'B';
    expect(a.clientPONum).toBe('A');
    expect(b.clientPONum).toBe('B');
  });

  it('should return a plain object snapshot', () => {
    const po = new PO();
    po.clientPONum = 'PO-9';
    po.poValue = 50;
    expect(po.toPlainObject()).toEqual(
      jasmine.objectContaining({ clientPONum: 'PO-9', poValue: 50 })
    );
  });
});
