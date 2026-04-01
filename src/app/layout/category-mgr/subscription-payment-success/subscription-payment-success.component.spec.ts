import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPaymentSuccessComponent } from './subscription-payment-success.component';

describe('SubscriptionPaymentSuccessComponent', () => {
  let component: SubscriptionPaymentSuccessComponent;
  let fixture: ComponentFixture<SubscriptionPaymentSuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriptionPaymentSuccessComponent]
    });
    fixture = TestBed.createComponent(SubscriptionPaymentSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
