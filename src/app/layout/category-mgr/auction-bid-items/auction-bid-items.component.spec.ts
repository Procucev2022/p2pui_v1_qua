import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionBidItemsComponent } from './auction-bid-items.component';

describe('AuctionBidItemsComponent', () => {
  let component: AuctionBidItemsComponent;
  let fixture: ComponentFixture<AuctionBidItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuctionBidItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionBidItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
