import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPaymentFailureComponent } from './subscription-payment-failure.component';

describe('SubscriptionPaymentFailureComponent', () => {
  let component: SubscriptionPaymentFailureComponent;
  let fixture: ComponentFixture<SubscriptionPaymentFailureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriptionPaymentFailureComponent]
    });
    fixture = TestBed.createComponent(SubscriptionPaymentFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
