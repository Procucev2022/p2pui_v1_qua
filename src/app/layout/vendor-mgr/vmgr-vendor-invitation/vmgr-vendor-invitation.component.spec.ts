import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmgrVendorInvitationComponent } from './vmgr-vendor-invitation.component';

describe('VmgrVendorInvitationComponent', () => {
  let component: VmgrVendorInvitationComponent;
  let fixture: ComponentFixture<VmgrVendorInvitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmgrVendorInvitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmgrVendorInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
