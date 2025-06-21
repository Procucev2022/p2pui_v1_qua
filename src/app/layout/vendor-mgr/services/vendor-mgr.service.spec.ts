import { TestBed, inject } from '@angular/core/testing';

import { VendorMgrService } from './vendor-mgr.service';

describe('VendorMgrService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendorMgrService]
    });
  });

  it('should be created', inject([VendorMgrService], (service: VendorMgrService) => {
    expect(service).toBeTruthy();
  }));
});
