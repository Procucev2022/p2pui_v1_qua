import { TestBed, inject } from '@angular/core/testing';

import { VendorRegistrationService } from './vendor-registration.service';

describe('VendorRegistrationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendorRegistrationService]
    });
  });

  it('should be created', inject([VendorRegistrationService], (service: VendorRegistrationService) => {
    expect(service).toBeTruthy();
  }));
});
