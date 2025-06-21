import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrReportsComponent } from './pr-reports.component';

describe('PrReportsComponent', () => {
  let component: PrReportsComponent;
  let fixture: ComponentFixture<PrReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
