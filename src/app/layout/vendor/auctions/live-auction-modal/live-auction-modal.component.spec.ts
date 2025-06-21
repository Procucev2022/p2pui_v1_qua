import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveAuctionModalComponent } from './live-auction-modal.component';

describe('LiveAuctionModalComponent', () => {
  let component: LiveAuctionModalComponent;
  let fixture: ComponentFixture<LiveAuctionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveAuctionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveAuctionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
