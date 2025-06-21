import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionBidDetailsComponent } from './auction-bid-details.component';

describe('AuctionBidDetailsComponent', () => {
  let component: AuctionBidDetailsComponent;
  let fixture: ComponentFixture<AuctionBidDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuctionBidDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionBidDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
