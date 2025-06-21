import { TestBed, inject } from '@angular/core/testing';

import { CustomValidationsService } from './custom-validations.service';

describe('CustomValidationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomValidationsService]
    });
  });

  it('should be created', inject([CustomValidationsService], (service: CustomValidationsService) => {
    expect(service).toBeTruthy();
  }));
});
