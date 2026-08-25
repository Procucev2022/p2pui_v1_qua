import { GridPdfService } from './grid-pdf.service';

describe('GridPdfService', () => {
  let service: GridPdfService;
  let exportPDFService: jasmine.SpyObj<any>;

  beforeEach(() => {
    exportPDFService = jasmine.createSpyObj('ExportPdfService', ['addFooters']);
    service = new GridPdfService(exportPDFService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('exportAsPDF should create pdf, add footers and save', () => {
    // Just call it — jsPDF is available in the test environment
    spyOn(document, 'createElement').and.callThrough();
    service.exportAsPDF(
      [['Row1Col1', 'Row1Col2']],
      ['Col1', 'Col2'],
      'Test Title',
      'test-file.pdf'
    );
    expect(exportPDFService.addFooters).toHaveBeenCalled();
  });
});
