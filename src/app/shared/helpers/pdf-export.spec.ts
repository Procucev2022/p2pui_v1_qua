import { pdfExport, createJsPdf, runAutoTable } from './pdf-export';

describe('pdf-export helpers', () => {
  it('pdfExport should have createJsPdf function', () => {
    expect(typeof pdfExport.createJsPdf).toBe('function');
  });

  it('pdfExport should have runAutoTable function', () => {
    expect(typeof pdfExport.runAutoTable).toBe('function');
  });

  it('createJsPdf named export should delegate to pdfExport.createJsPdf', () => {
    const mockDoc = { text: 'mock' };
    const orig = pdfExport.createJsPdf;
    pdfExport.createJsPdf = jasmine.createSpy('createJsPdf').and.returnValue(mockDoc);
    const result = createJsPdf();
    expect(result).toBe(mockDoc);
    expect(pdfExport.createJsPdf).toHaveBeenCalled();
    pdfExport.createJsPdf = orig;
  });

  it('runAutoTable named export should delegate to pdfExport.runAutoTable', () => {
    const orig = pdfExport.runAutoTable;
    pdfExport.runAutoTable = jasmine.createSpy('runAutoTable').and.returnValue(undefined);
    const doc = {};
    const opts = { head: [] };
    runAutoTable(doc, opts);
    expect(pdfExport.runAutoTable).toHaveBeenCalledWith(doc, opts);
    pdfExport.runAutoTable = orig;
  });

  it('createJsPdf real call should return a jsPDF instance', () => {
    const doc = pdfExport.createJsPdf();
    expect(doc).toBeTruthy();
  });

  it('runAutoTable real call should not throw', () => {
    const doc = pdfExport.createJsPdf();
    expect(() => pdfExport.runAutoTable(doc, { head: [['A']], body: [['1']] })).not.toThrow();
  });
});
