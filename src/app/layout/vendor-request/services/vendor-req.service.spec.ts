import { TestBed, inject } from '@angular/core/testing';

import { VendorReqService } from './vendor-req.service';

describe('VendorReqService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendorReqService]
    });
  });

  it('should be created', inject([VendorReqService], (service: VendorReqService) => {
    expect(service).toBeTruthy();
  }));
});
