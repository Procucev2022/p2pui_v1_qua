import { TestBed, inject } from '@angular/core/testing';

import { ApprovePrService } from './approve-pr.service';

describe('ApprovePrService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApprovePrService]
    });
  });

  it('should be created', inject([ApprovePrService], (service: ApprovePrService) => {
    expect(service).toBeTruthy();
  }));
});
