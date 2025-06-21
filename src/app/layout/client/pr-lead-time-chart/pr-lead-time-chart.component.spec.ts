import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrLeadTimeChartComponent } from './pr-lead-time-chart.component';

describe('PrLeadTimeChartComponent', () => {
  let component: PrLeadTimeChartComponent;
  let fixture: ComponentFixture<PrLeadTimeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrLeadTimeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrLeadTimeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
