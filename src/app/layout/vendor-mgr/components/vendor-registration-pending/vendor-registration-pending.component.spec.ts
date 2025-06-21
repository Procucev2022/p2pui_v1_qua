import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorRegistrationPendingComponent } from './vendor-registration-pending.component';

describe('VendorRegistrationPendingComponent', () => {
  let component: VendorRegistrationPendingComponent;
  let fixture: ComponentFixture<VendorRegistrationPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorRegistrationPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorRegistrationPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
