import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSubscriptionComponent } from './login-subscription.component';

describe('LoginSubscriptionComponent', () => {
  let component: LoginSubscriptionComponent;
  let fixture: ComponentFixture<LoginSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
