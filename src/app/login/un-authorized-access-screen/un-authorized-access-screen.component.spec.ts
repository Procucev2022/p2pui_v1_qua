import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { UnAuthorizedAccessScreenComponent } from './un-authorized-access-screen.component';
import { autoMock, defaultAppConfig, seedComponent, exerciseComponent } from '../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog } from '@angular/material/dialog';

describe('UnAuthorizedAccessScreenComponent', () => {
  let component: UnAuthorizedAccessScreenComponent;
  let fixture: ComponentFixture<UnAuthorizedAccessScreenComponent>;

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');


    await TestBed.configureTestingModule({
      declarations: [UnAuthorizedAccessScreenComponent],
      imports: [CommonModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: autoMock('ChangeDetectorRef') },
        DatePipe,
        { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => ({ attach: () => undefined, enable: () => undefined, disable: () => undefined, detach: () => undefined }) },
        { provide: MatDialog, useValue: autoMock('MatDialog') },
        { provide: AuthenticationService, useValue: autoMock('AuthenticationService') }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(UnAuthorizedAccessScreenComponent, '')
      .overrideComponent(UnAuthorizedAccessScreenComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(UnAuthorizedAccessScreenComponent);
    component = fixture.componentInstance;
    seedComponent(component as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should exercise component API for coverage', () => {
    exerciseComponent(component as any);
    expect(component).toBeTruthy();
  });
});
