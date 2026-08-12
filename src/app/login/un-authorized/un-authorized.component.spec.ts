import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UnAuthorizedComponent } from './un-authorized.component';

describe('UnAuthorizedComponent', () => {
  let component: UnAuthorizedComponent;
  let fixture: ComponentFixture<UnAuthorizedComponent>;
  let modalDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    modalDialog = jasmine.createSpyObj('MatDialog', ['closeAll']);
    spyOn(localStorage, 'clear');

    await TestBed.configureTestingModule({
      declarations: [UnAuthorizedComponent],
      providers: [{ provide: MatDialog, useValue: modalDialog }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(UnAuthorizedComponent);
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
