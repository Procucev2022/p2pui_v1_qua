import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorApprovalModalComponent } from './vendor-approval-modal.component';

describe('VendorApprovalModalComponent', () => {
  let component: VendorApprovalModalComponent;
  let fixture: ComponentFixture<VendorApprovalModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorApprovalModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorApprovalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
