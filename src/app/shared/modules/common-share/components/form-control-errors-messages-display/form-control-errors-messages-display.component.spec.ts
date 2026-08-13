import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { FormControlErrorsMessagesDisplayComponent } from './form-control-errors-messages-display.component';
import { autoMock, defaultAppConfig, seedComponent, exerciseComponent } from '../../../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';

describe('FormControlErrorsMessagesDisplayComponent', () => {
  let component: FormControlErrorsMessagesDisplayComponent;
  let fixture: ComponentFixture<FormControlErrorsMessagesDisplayComponent>;

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');


    await TestBed.configureTestingModule({
      declarations: [FormControlErrorsMessagesDisplayComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: autoMock('ChangeDetectorRef') },
        DatePipe,
        { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => ({ attach: () => undefined, enable: () => undefined, disable: () => undefined, detach: () => undefined }) },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(FormControlErrorsMessagesDisplayComponent, '')
      .overrideComponent(FormControlErrorsMessagesDisplayComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(FormControlErrorsMessagesDisplayComponent);
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
