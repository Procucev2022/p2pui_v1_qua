import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerBuyerDetailsByUniqueIdComponent } from './seller-buyer-details-by-unique-id.component';

describe('SellerBuyerDetailsByUniqueIdComponent', () => {
  let component: SellerBuyerDetailsByUniqueIdComponent;
  let fixture: ComponentFixture<SellerBuyerDetailsByUniqueIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerBuyerDetailsByUniqueIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerBuyerDetailsByUniqueIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
