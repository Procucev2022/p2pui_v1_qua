import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVendorEvaluationComponent } from './view-vendor-evaluation.component';

describe('ViewVendorEvaluationComponent', () => {
  let component: ViewVendorEvaluationComponent;
  let fixture: ComponentFixture<ViewVendorEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewVendorEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVendorEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
