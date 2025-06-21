import { TestBed, inject } from '@angular/core/testing';

import { VendorSearchService } from './vendor-search.service';

describe('VendorSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendorSearchService]
    });
  });

  it('should be created', inject([VendorSearchService], (service: VendorSearchService) => {
    expect(service).toBeTruthy();
  }));
});
