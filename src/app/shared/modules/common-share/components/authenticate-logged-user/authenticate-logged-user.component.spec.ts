import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticateLoggedUserComponent } from './authenticate-logged-user.component';

describe('AuthenticateLoggedUserComponent', () => {
  let component: AuthenticateLoggedUserComponent;
  let fixture: ComponentFixture<AuthenticateLoggedUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthenticateLoggedUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticateLoggedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
