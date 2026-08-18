import { TestBed } from '@angular/core/testing';
import { BuyerVendorsModule } from './buyer-vendors.module';

describe('BuyerVendorsModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BuyerVendorsModule]
    });
  });

  it('should create the module', () => {
    const module = TestBed.inject(BuyerVendorsModule);
    expect(module).toBeInstanceOf(BuyerVendorsModule);
  });
});
