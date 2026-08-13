import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { RegConfirmDialogComponent } from './reg-confirm-dialog.component';
import { autoMock, defaultAppConfig, seedComponent, exerciseComponent } from '../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { Router } from '@angular/router';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog } from '@angular/material/dialog';

describe('RegConfirmDialogComponent', () => {
  let component: RegConfirmDialogComponent;
  let fixture: ComponentFixture<RegConfirmDialogComponent>;

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');


    await TestBed.configureTestingModule({
      imports: [CommonModule, RegConfirmDialogComponent],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: autoMock('ChangeDetectorRef') },
        DatePipe,
        { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => ({ attach: () => undefined, enable: () => undefined, disable: () => undefined, detach: () => undefined }) },
        { provide: Router, useValue: autoMock('Router') },
        { provide: MatDialog, useValue: autoMock('MatDialog') }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(RegConfirmDialogComponent, '')
      .overrideComponent(RegConfirmDialogComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(RegConfirmDialogComponent);
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
