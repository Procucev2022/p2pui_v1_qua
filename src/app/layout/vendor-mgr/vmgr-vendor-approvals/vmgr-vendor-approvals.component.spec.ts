import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmgrVendorApprovalsComponent } from './vmgr-vendor-approvals.component';

describe('VmgrVendorApprovalsComponent', () => {
  let component: VmgrVendorApprovalsComponent;
  let fixture: ComponentFixture<VmgrVendorApprovalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmgrVendorApprovalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmgrVendorApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
