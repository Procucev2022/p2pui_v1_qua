import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrPpoChartComponent } from './pr-ppo-chart.component';

describe('PrPpoChartComponent', () => {
  let component: PrPpoChartComponent;
  let fixture: ComponentFixture<PrPpoChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrPpoChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrPpoChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
