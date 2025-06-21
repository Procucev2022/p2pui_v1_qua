import { TestBed, inject } from '@angular/core/testing';

import { ConvertToBase64Service } from './convert-to-base64.service';

describe('ConvertToBase64Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConvertToBase64Service]
    });
  });

  it('should be created', inject([ConvertToBase64Service], (service: ConvertToBase64Service) => {
    expect(service).toBeTruthy();
  }));
});
