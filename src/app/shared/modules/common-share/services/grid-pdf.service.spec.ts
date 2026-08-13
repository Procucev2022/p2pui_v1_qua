import { TestBed } from '@angular/core/testing';
import { GridPdfService } from './grid-pdf.service';
import { ExportPdfService } from 'src/app/layout/category-mgr/services/export-pdf.service';

describe('GridPdfService', () => {
  let service: GridPdfService;
  let exportPdf: jasmine.SpyObj<ExportPdfService>;

  beforeEach(() => {
    exportPdf = jasmine.createSpyObj('ExportPdfService', ['addFooters']);
    TestBed.configureTestingModule({
      providers: [
        GridPdfService,
        { provide: ExportPdfService, useValue: exportPdf },
      ],
    });
    service = TestBed.inject(GridPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should exportAsPDF, add footers, and save the file', () => {
    const rows = [{ col1: 'a', col2: 'b' }];
    const cols = [
      { title: 'Col1', dataKey: 'col1' },
      { title: 'Col2', dataKey: 'col2' },
    ];

    expect(() =>
      service.exportAsPDF(rows, cols, 'Page Title', 'grid-export.pdf')
    ).not.toThrow();

    expect(exportPdf.addFooters).toHaveBeenCalled();
    const docArg = exportPdf.addFooters.calls.mostRecent().args[0];
    expect(docArg).toBeTruthy();
    expect(typeof docArg.save).toBe('function');
    expect(typeof docArg.internal.getNumberOfPages).toBe('function');
  });

  it('should handle empty rows/cols without throwing', () => {
    expect(() =>
      service.exportAsPDF([], [], 'Empty', 'empty.pdf')
    ).not.toThrow();
    expect(exportPdf.addFooters).toHaveBeenCalled();
  });
});
