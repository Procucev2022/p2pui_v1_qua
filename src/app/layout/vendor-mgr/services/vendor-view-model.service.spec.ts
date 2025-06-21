import { TestBed, inject } from '@angular/core/testing';

import { VendorViewModelService } from './vendor-view-model.service';

describe('VendorViewModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendorViewModelService]
    });
  });

  it('should be created', inject([VendorViewModelService], (service: VendorViewModelService) => {
    expect(service).toBeTruthy();
  }));
});
