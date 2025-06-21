import { TestBed, inject } from '@angular/core/testing';

import { CreateRfqService } from './create-rfq.service';

describe('CreateRfqService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateRfqService]
    });
  });

  it('should be created', inject([CreateRfqService], (service: CreateRfqService) => {
    expect(service).toBeTruthy();
  }));
});
