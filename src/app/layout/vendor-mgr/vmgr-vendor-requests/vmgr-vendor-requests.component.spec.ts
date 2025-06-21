import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmgrVendorRequestsComponent } from './vmgr-vendor-requests.component';

describe('VmgrVendorRequestsComponent', () => {
  let component: VmgrVendorRequestsComponent;
  let fixture: ComponentFixture<VmgrVendorRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmgrVendorRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmgrVendorRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
