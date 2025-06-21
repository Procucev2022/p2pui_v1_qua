import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePaymentRequestsComponent } from './advance-payment-requests.component';

describe('AdvancePaymentRequestsComponent', () => {
  let component: AdvancePaymentRequestsComponent;
  let fixture: ComponentFixture<AdvancePaymentRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancePaymentRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancePaymentRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
