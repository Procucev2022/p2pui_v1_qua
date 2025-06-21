import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProCpxVendorSummaryLayoutComponent } from './pro-cpx-vendor-summary-layout.component';

describe('ProCpxVendorSummaryLayoutComponent', () => {
  let component: ProCpxVendorSummaryLayoutComponent;
  let fixture: ComponentFixture<ProCpxVendorSummaryLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProCpxVendorSummaryLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProCpxVendorSummaryLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
