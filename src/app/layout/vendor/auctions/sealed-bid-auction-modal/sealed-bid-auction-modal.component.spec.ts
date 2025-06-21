import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SealedBidAuctionModalComponent } from './sealed-bid-auction-modal.component';

describe('SealedBidAuctionModalComponent', () => {
  let component: SealedBidAuctionModalComponent;
  let fixture: ComponentFixture<SealedBidAuctionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SealedBidAuctionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SealedBidAuctionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
