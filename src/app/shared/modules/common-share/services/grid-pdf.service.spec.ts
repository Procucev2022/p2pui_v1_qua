import { TestBed, inject } from '@angular/core/testing';

import { GridPdfService } from './grid-pdf.service';

describe('GridPdfService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridPdfService]
    });
  });

  it('should be created', inject([GridPdfService], (service: GridPdfService) => {
    expect(service).toBeTruthy();
  }));
});
