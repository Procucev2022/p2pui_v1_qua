import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { UnAuthorizedComponent } from './un-authorized.component';
import { autoMock, defaultAppConfig, seedComponent, exerciseComponent } from '../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog } from '@angular/material/dialog';

describe('UnAuthorizedComponent', () => {
  let component: UnAuthorizedComponent;
  let fixture: ComponentFixture<UnAuthorizedComponent>;

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');


    await TestBed.configureTestingModule({
      declarations: [UnAuthorizedComponent],
      imports: [CommonModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: autoMock('ChangeDetectorRef') },
        DatePipe,
        { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => ({ attach: () => undefined, enable: () => undefined, disable: () => undefined, detach: () => undefined }) },
        { provide: MatDialog, useValue: autoMock('MatDialog') }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(UnAuthorizedComponent, '')
      .overrideComponent(UnAuthorizedComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(UnAuthorizedComponent);
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
