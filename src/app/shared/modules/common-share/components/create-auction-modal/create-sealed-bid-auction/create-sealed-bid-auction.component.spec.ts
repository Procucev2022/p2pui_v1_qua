import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSealedBidAuctionComponent } from './create-sealed-bid-auction.component';

describe('CreateSealedBidAuctionComponent', () => {
  let component: CreateSealedBidAuctionComponent;
  let fixture: ComponentFixture<CreateSealedBidAuctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSealedBidAuctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSealedBidAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
