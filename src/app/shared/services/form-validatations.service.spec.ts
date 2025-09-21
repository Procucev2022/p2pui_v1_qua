import { TestBed } from '@angular/core/testing';

import { FormValidatationsService } from './form-validatations.service';

describe('FormValidatationsService', () => {
  let service: FormValidatationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormValidatationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
