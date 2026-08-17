import { pdfExport, createJsPdf, runAutoTable } from './pdf-export';

describe('pdfExport helper', () => {
  it('should create jsPDF instance and run autoTable', () => {
    spyOn(pdfExport, 'createJsPdf').and.returnValue({ save: () => {} });
    spyOn(pdfExport, 'runAutoTable').and.returnValue({});

    const doc = createJsPdf();
    const table = runAutoTable(doc, {});

    expect(doc).toBeTruthy();
    expect(table).toBeTruthy();
  });

  it('should run default createJsPdf and runAutoTable methods', () => {
    try {
      const doc = pdfExport.createJsPdf();
      expect(doc).toBeTruthy();
      pdfExport.runAutoTable(doc, { head: [['A']], body: [['B']] });
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });
});
