import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProCpxVendorSummaryComponent } from './pro-cpx-vendor-summary.component';

describe('ProCpxVendorSummaryComponent', () => {
  let component: ProCpxVendorSummaryComponent;
  let fixture: ComponentFixture<ProCpxVendorSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProCpxVendorSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProCpxVendorSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
