import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardedVendorComponent } from './forwarded-vendor.component';

describe('ForwardedVendorComponent', () => {
  let component: ForwardedVendorComponent;
  let fixture: ComponentFixture<ForwardedVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForwardedVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwardedVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
