import { TestBed, inject } from '@angular/core/testing';

import { CatProcuQuotationsService } from './cat-procu-quotations.service';

describe('CatProcuQuotationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatProcuQuotationsService]
    });
  });

  it('should be created', inject([CatProcuQuotationsService], (service: CatProcuQuotationsService) => {
    expect(service).toBeTruthy();
  }));
});
