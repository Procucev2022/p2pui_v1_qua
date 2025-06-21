import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditAdvancePaymentRequestsComponent } from './create-edit-advance-payment-requests.component';

describe('CreateEditAdvancePaymentRequestsComponent', () => {
  let component: CreateEditAdvancePaymentRequestsComponent;
  let fixture: ComponentFixture<CreateEditAdvancePaymentRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditAdvancePaymentRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditAdvancePaymentRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
