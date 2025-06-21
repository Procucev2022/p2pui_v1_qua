import { TestBed, inject } from '@angular/core/testing';

import { VendorService } from '../vendor-service.service';

describe('VendorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendorService]
    });
  });

  it('should be created', inject([VendorService], (service: VendorService) => {
    expect(service).toBeTruthy();
  }));
});
