import { TestBed, inject } from '@angular/core/testing';

import { CreatePrModelService } from './create-pr-model.service';

describe('CreatePrModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreatePrModelService]
    });
  });

  it('should be created', inject([CreatePrModelService], (service: CreatePrModelService) => {
    expect(service).toBeTruthy();
  }));
});
