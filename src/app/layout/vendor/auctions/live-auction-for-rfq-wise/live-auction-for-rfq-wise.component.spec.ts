import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveAuctionForRfqWiseComponent } from './live-auction-for-rfq-wise.component';

describe('LiveAuctionForRfqWiseComponent', () => {
  let component: LiveAuctionForRfqWiseComponent;
  let fixture: ComponentFixture<LiveAuctionForRfqWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveAuctionForRfqWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveAuctionForRfqWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
