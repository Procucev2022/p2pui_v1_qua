import { TestBed, inject } from '@angular/core/testing';

import { VendorQuotService } from './vendor-quot.service';

describe('VendorQuotService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendorQuotService]
    });
  });

  it('should be created', inject([VendorQuotService], (service: VendorQuotService) => {
    expect(service).toBeTruthy();
  }));
});
