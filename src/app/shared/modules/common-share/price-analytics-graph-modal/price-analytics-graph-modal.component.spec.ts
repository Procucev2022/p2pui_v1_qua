import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceAnalyticsGraphModalComponent } from './price-analytics-graph-modal.component';

describe('PriceAnalyticsGraphModalComponent', () => {
  let component: PriceAnalyticsGraphModalComponent;
  let fixture: ComponentFixture<PriceAnalyticsGraphModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceAnalyticsGraphModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceAnalyticsGraphModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
