import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveAuctionForItemwiseComponent } from './live-auction-for-itemwise.component';

describe('LiveAuctionForItemwiseComponent', () => {
  let component: LiveAuctionForItemwiseComponent;
  let fixture: ComponentFixture<LiveAuctionForItemwiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveAuctionForItemwiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveAuctionForItemwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
