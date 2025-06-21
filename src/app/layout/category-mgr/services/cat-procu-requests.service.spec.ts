import { TestBed, inject } from '@angular/core/testing';

import { CatProcuRequestsService } from './cat-procu-requests.service';

describe('CatProcuRequestsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatProcuRequestsService]
    });
  });

  it('should be created', inject([CatProcuRequestsService], (service: CatProcuRequestsService) => {
    expect(service).toBeTruthy();
  }));
});
