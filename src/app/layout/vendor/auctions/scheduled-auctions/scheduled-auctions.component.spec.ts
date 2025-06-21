import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledAuctionsComponent } from './scheduled-auctions.component';

describe('ScheduledAuctionsComponent', () => {
  let component: ScheduledAuctionsComponent;
  let fixture: ComponentFixture<ScheduledAuctionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledAuctionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledAuctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
