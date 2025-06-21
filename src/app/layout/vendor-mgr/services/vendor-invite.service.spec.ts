import { TestBed, inject } from '@angular/core/testing';

import { VendorInviteService } from './vendor-invite.service';

describe('VendorInviteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendorInviteService]
    });
  });

  it('should be created', inject([VendorInviteService], (service: VendorInviteService) => {
    expect(service).toBeTruthy();
  }));
});
