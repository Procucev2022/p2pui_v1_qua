import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProCpxVendorPPOsComponent } from './pro-cpx-vendor-ppos.component';

describe('ProCpxVendorPPOsComponent', () => {
  let component: ProCpxVendorPPOsComponent;
  let fixture: ComponentFixture<ProCpxVendorPPOsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProCpxVendorPPOsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProCpxVendorPPOsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
