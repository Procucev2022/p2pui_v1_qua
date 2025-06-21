import { TestBed, inject } from '@angular/core/testing';

import { VendorNamesService } from './vendor-names.service';

describe('VendorNamesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendorNamesService]
    });
  });

  it('should be created', inject([VendorNamesService], (service: VendorNamesService) => {
    expect(service).toBeTruthy();
  }));
});
