import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UnAuthorizedAccessScreenComponent } from './un-authorized-access-screen.component';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

describe('UnAuthorizedAccessScreenComponent', () => {
  let component: UnAuthorizedAccessScreenComponent;
  let fixture: ComponentFixture<UnAuthorizedAccessScreenComponent>;
  let modalDialog: jasmine.SpyObj<MatDialog>;
  let authService: jasmine.SpyObj<AuthenticationService>;

  beforeEach(async () => {
    modalDialog = jasmine.createSpyObj('MatDialog', ['closeAll']);
    authService = jasmine.createSpyObj('AuthenticationService', ['logout']);
    spyOn(localStorage, 'clear');

    await TestBed.configureTestingModule({
      declarations: [UnAuthorizedAccessScreenComponent],
      providers: [
        { provide: MatDialog, useValue: modalDialog },
        { provide: AuthenticationService, useValue: authService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(UnAuthorizedAccessScreenComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should close dialogs and clear localStorage', () => {
    component.ngOnInit();
    expect(modalDialog.closeAll).toHaveBeenCalled();
    expect(localStorage.clear).toHaveBeenCalled();
  });
});
