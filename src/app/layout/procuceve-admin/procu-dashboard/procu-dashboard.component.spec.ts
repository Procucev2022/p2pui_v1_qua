import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcuDashboardComponent } from './procu-dashboard.component';

describe('ProcuDashboardComponent', () => {
  let component: ProcuDashboardComponent;
  let fixture: ComponentFixture<ProcuDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcuDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcuDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
