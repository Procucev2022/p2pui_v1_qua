import { TestBed, inject } from '@angular/core/testing';

import { PposService } from './ppos.service';

describe('PposService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PposService]
    });
  });

  it('should be created', inject([PposService], (service: PposService) => {
    expect(service).toBeTruthy();
  }));
});
