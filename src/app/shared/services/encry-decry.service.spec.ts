import { TestBed, inject } from '@angular/core/testing';

import { EncryDecryService } from './encry-decry.service';

describe('EncryDecryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EncryDecryService]
    });
  });

  it('should be created', inject([EncryDecryService], (service: EncryDecryService) => {
    expect(service).toBeTruthy();
  }));
});
