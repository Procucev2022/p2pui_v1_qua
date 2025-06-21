import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCapabilityComponent } from './vendor-capability.component';

describe('VendorCapabilityComponent', () => {
  let component: VendorCapabilityComponent;
  let fixture: ComponentFixture<VendorCapabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorCapabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCapabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
