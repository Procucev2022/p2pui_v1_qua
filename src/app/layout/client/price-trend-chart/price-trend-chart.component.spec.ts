import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceTrendChartComponent } from './price-trend-chart.component';

describe('PriceTrendChartComponent', () => {
  let component: PriceTrendChartComponent;
  let fixture: ComponentFixture<PriceTrendChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceTrendChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceTrendChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
