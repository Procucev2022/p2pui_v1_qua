import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorProfileSubscriptionsComponent } from './vendor-profile-subscriptions.component';

describe('VendorProfileSubscriptionsComponent', () => {
  let component: VendorProfileSubscriptionsComponent;
  let fixture: ComponentFixture<VendorProfileSubscriptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorProfileSubscriptionsComponent]
    });
    fixture = TestBed.createComponent(VendorProfileSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
