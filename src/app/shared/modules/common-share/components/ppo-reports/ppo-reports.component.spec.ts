import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpoReportsComponent } from './ppo-reports.component';

describe('PpoReportsComponent', () => {
  let component: PpoReportsComponent;
  let fixture: ComponentFixture<PpoReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpoReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpoReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
